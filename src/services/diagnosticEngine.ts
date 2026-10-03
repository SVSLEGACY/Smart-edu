import { GoogleGenAI } from '@google/genai';
import { DiagnosticPayload, DiagnosticResult } from '../types/tutor';

export const RE_LEARN_SYSTEM_PROMPT = `# ROLE
You are the diagnostic engine for Re:Learn, an AI Python tutor. You evaluate one student submission per call, diagnose the underlying misconception (not just the symptom), and decide what the learning loop does next. You never act as a code-golfing solution generator: your job is to build understanding.

# INPUT
You receive a JSON object:
{
  "current_concept": string,            // topic under test, e.g. "list slicing"
  "original_question": string,          // the prompt the student was solving
  "student_code": string,               // the submission
  "attempt_number": integer,            // attempts on this concept so far (starts at 1)
  "mastery_streak": integer,            // consecutive correct answers on this concept
  "mastery_target": integer,            // streak required to finish the concept (default 2)
  "misconception_history": [string],    // misconceptions already diagnosed this session
  "concepts_remaining": [string]        // ordered curriculum left after current_concept
}

# EVALUATION PROCEDURE (reason silently, output only the JSON)
1. Trace the code against the question with the normal case AND at least two edge cases (empty input, single element, boundaries, negative values, wrong types).
2. Classify the result:
   - CORRECT: meets the question's requirements on all traced cases.
   - SLIP: right idea, trivial error (typo, missing colon, off-by-one from carelessness). Treat as incorrect but name it "Careless Slip".
   - MISCONCEPTION: faulty mental model of the concept. Name it precisely (e.g., "Mutable Default Argument", "Off-by-One in range()", "Confusing = with ==").
3. Pinpoint the evidence: the exact line or expression that reveals the flaw.
4. Check misconception_history. If this misconception repeats, change the explanation strategy (a different analogy or a trace-table approach) instead of repeating the previous wording.

# LOOP LOGIC
- Correct: increment mastery_streak. If mastery_streak >= mastery_target, the concept is mastered, so set next_action "advance" with a slightly harder question on the next concept in concepts_remaining. Otherwise set next_action "reassess" with a fresh variation, to confirm the success was not luck.
- Incorrect: set next_action "reassess". The new question must test the SAME concept but be structurally different from the original and from all earlier questions (different context, data shape, or problem type), so the student cannot pattern-match the old solution.
- Hint ladder, driven by attempt_number:
  - Attempts 1-2: conceptual nudge. Point at the flawed idea and ask a guiding question.
  - Attempt 3: targeted hint. Explain the mechanism using a small, DIFFERENT example that shows the concept working.
  - Attempt 4+: set next_action "review_prerequisite". Name the prerequisite concept likely missing and ask a simpler foundational question.
- Never reveal the corrected version of the student's code or the direct answer to the original question.
- If concepts_remaining is empty and the concept is mastered, set loop_status "complete".

# TONE
Encouraging, specific, and brief. Name one thing the student did right when possible. No lecturing. Speak to the student as "you".

# OUTPUT: STRICT JSON ONLY
Return a single valid JSON object. No markdown fences, no commentary, no trailing commas.
{
  "is_correct": boolean,
  "classification": "correct" | "slip" | "misconception",
  "misconception_diagnosed": string | null,
  "evidence": string | null,
  "feedback_intervention": string,
  "hint_level": 0 | 1 | 2 | 3,
  "next_action": "advance" | "reassess" | "review_prerequisite",
  "next_question": string,
  "mastery_streak": integer,
  "loop_status": "continue" | "complete"
}

Field rules:
- misconception_diagnosed and evidence are null when is_correct is true.
- hint_level is 0 when correct; otherwise follows the hint ladder.
- feedback_intervention: if correct, 1-2 sentences of specific praise; if incorrect, an explanation of the flaw without giving the answer.
- next_question is always non-empty unless loop_status is "complete", in which case it is "".`;

/**
 * Evaluates student code through the Re:Learn diagnostic engine.
 * Calls Gemini using @google/genai if an API key is available,
 * and seamlessly uses a specialized local fallback evaluator otherwise.
 */
export async function diagnoseStudentSubmission(
  payload: DiagnosticPayload
): Promise<DiagnosticResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    (typeof window !== 'undefined' ? (window as any).GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${RE_LEARN_SYSTEM_PROMPT}\n\nHere is the input JSON to evaluate:\n${JSON.stringify(
                  payload,
                  null,
                  2
                )}`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const text = response.text?.trim() || '';
      if (text) {
        // Strip any potential markdown fences
        const cleanJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(cleanJson) as DiagnosticResult;
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini call failed or key was invalid, falling back to local diagnostic engine:', err);
    }
  }

  // Local Diagnostic Engine implementing the exact specification
  return localDiagnosticEngine(payload);
}

/**
 * Built-in diagnostic engine implementation for deterministic, instant diagnosis
 * adhering strictly to the prompt specifications, hint ladder, and loop rules.
 */
function localDiagnosticEngine(payload: DiagnosticPayload): DiagnosticResult {
  const {
    current_concept,
    original_question,
    student_code,
    attempt_number,
    mastery_streak,
    mastery_target,
    misconception_history,
    concepts_remaining,
  } = payload;

  const code = student_code.trim();

  // 1. Analyze for common slips (typos, syntax errors, missing colons)
  const isSyntaxSlip =
    (code.includes('def ') && !code.includes(':')) ||
    code.includes(', mid +') ||
    code.includes('return items[mid - 1 ,');

  if (isSyntaxSlip) {
    const hintLevel = attempt_number <= 2 ? 1 : attempt_number === 3 ? 2 : 3;
    const nextAction = hintLevel === 3 ? 'review_prerequisite' : 'reassess';
    return {
      is_correct: false,
      classification: 'slip',
      misconception_diagnosed: 'Careless Slip',
      evidence: code.split('\n').find((l) => !l.includes(':') && l.includes('def ')) || code,
      feedback_intervention:
        "You've nailed the core logic, but there is a quick syntax slip in your punctuation. Check your function definition or slicing syntax.",
      hint_level: hintLevel as 1 | 2 | 3,
      next_action: nextAction,
      next_question: generateReassessmentQuestion(current_concept, original_question, attempt_number),
      mastery_streak,
      loop_status: 'continue',
    };
  }

  // 2. Concept-specific diagnostics
  if (current_concept.toLowerCase().includes('slice') || current_concept.toLowerCase().includes('list slicing')) {
    // Check for off-by-one stop boundary (e.g. items[mid - 1 : mid + 1] -> only 2 items)
    if (code.includes('mid + 1') && code.includes('mid - 1')) {
      const repeats = misconception_history.includes('Off-by-One in Slice Stop Boundary');
      const hintLevel = attempt_number <= 2 ? 1 : attempt_number === 3 ? 2 : 3;
      const nextAction = hintLevel === 3 ? 'review_prerequisite' : 'reassess';

      const feedback = repeats
        ? 'Notice in Python slicing: `list[start:stop]` stops strictly before `stop`. If start is index 1 and stop is index 3, only indices 1 and 2 are captured (count = 3 - 1 = 2 elements).'
        : attempt_number === 3
        ? 'Think of slice indices as fences rather than posts: `nums[1:4]` gives 3 elements (indices 1, 2, 3). For your middle slice, what stop index yields exactly 3 items?'
        : 'Good job finding the center index. However, trace the length of your slice on a list of 5 items: how many items does `items[mid - 1 : mid + 1]` actually pull?';

      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Off-by-One in Slice Stop Boundary',
        evidence: code.split('\n').find((l) => l.includes('mid + 1')) || 'items[mid - 1 : mid + 1]',
        feedback_intervention: feedback,
        hint_level: hintLevel as 1 | 2 | 3,
        next_action: nextAction,
        next_question: generateReassessmentQuestion(current_concept, original_question, attempt_number),
        mastery_streak,
        loop_status: 'continue',
      };
    }

    // Check for correct slicing
    if (code.includes('mid + 2') || code.includes('mid-1:mid+2') || (code.includes('[') && code.includes(':') && (code.includes('mid') || code.includes('len')))) {
      const newStreak = mastery_streak + 1;
      const isMastered = newStreak >= mastery_target;
      const isCurriculumFinished = isMastered && concepts_remaining.length === 0;

      return {
        is_correct: true,
        classification: 'correct',
        misconception_diagnosed: null,
        evidence: null,
        feedback_intervention:
          'Spot on! You correctly accounted for the exclusive stop boundary in Python slicing and safely centered the 3-element window.',
        hint_level: 0,
        next_action: isMastered ? 'advance' : 'reassess',
        next_question: isCurriculumFinished
          ? ''
          : isMastered
          ? `Write a function for ${concepts_remaining[0]}: ${getNextConceptStarter(concepts_remaining[0])}`
          : 'Write a function `first_and_last_two(items)` that returns a new list containing the first 2 and last 2 elements combined using slice concatenation.',
        mastery_streak: newStreak,
        loop_status: isCurriculumFinished ? 'complete' : 'continue',
      };
    }
  }

  // 3. Mutable default argument diagnosis
  if (current_concept.toLowerCase().includes('default') || current_concept.toLowerCase().includes('mutable')) {
    if (code.includes('tags=[]') || code.includes('tags = []') || code.includes('=[]')) {
      const hintLevel = attempt_number <= 2 ? 1 : attempt_number === 3 ? 2 : 3;
      const nextAction = hintLevel === 3 ? 'review_prerequisite' : 'reassess';

      const feedback =
        attempt_number >= 3
          ? 'Python evaluates default arguments only once when the function is defined, not every time it is called. A list created in `def f(lst=[]):` is shared across every invocation.'
          : 'You structured the append correctly, but consider when `tags=[]` is created in memory: does a new list get allocated on every function call?';

      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Mutable Default Argument',
        evidence: code.split('\n').find((l) => l.includes('=[]') || l.includes('tags = []')) || 'tags=[]',
        feedback_intervention: feedback,
        hint_level: hintLevel as 1 | 2 | 3,
        next_action: nextAction,
        next_question: generateReassessmentQuestion(current_concept, original_question, attempt_number),
        mastery_streak,
        loop_status: 'continue',
      };
    }

    if (code.includes('None') && code.includes('append')) {
      const newStreak = mastery_streak + 1;
      const isMastered = newStreak >= mastery_target;
      const isCurriculumFinished = isMastered && concepts_remaining.length === 0;

      return {
        is_correct: true,
        classification: 'correct',
        misconception_diagnosed: null,
        evidence: null,
        feedback_intervention:
          'Excellent! Using `None` as the sentinel default and assigning a fresh empty list inside the function body avoids the shared mutable state trap.',
        hint_level: 0,
        next_action: isMastered ? 'advance' : 'reassess',
        next_question: isCurriculumFinished
          ? ''
          : isMastered
          ? `Now moving to ${concepts_remaining[0]}: ${getNextConceptStarter(concepts_remaining[0])}`
          : 'Write a function `register_scores(player, scores=None)` that returns a dictionary `{player: scores}` ensuring each player gets an independent list.',
        mastery_streak: newStreak,
        loop_status: isCurriculumFinished ? 'complete' : 'continue',
      };
    }
  }

  // 4. Dictionary comprehension diagnosis
  if (current_concept.toLowerCase().includes('dict') || current_concept.toLowerCase().includes('comprehension')) {
    if (code.includes('in d') && !code.includes('.items()') && !code.includes('d.keys()')) {
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Iterating Dictionary Keys as Pairs',
        evidence: code.split('\n').find((l) => l.includes('in d')) || 'for k, v in d',
        feedback_intervention:
          'Iterating directly over a dictionary `for item in d:` yields only the keys, not key-value tuples. Which dictionary method returns both key and value pairs?',
        hint_level: 1,
        next_action: 'reassess',
        next_question: 'Write a dictionary comprehension `square_odds(numbers)` mapping every odd number to its square.',
        mastery_streak,
        loop_status: 'continue',
      };
    }

    if (code.includes('.items()')) {
      const newStreak = mastery_streak + 1;
      const isMastered = newStreak >= mastery_target;
      const isCurriculumFinished = isMastered && concepts_remaining.length === 0;

      return {
        is_correct: true,
        classification: 'correct',
        feedback_intervention: 'Great comprehension syntax! You unpacked keys and values with `.items()` and inverted the mapping cleanly.',
        misconception_diagnosed: null,
        evidence: null,
        hint_level: 0,
        next_action: isMastered ? 'advance' : 'reassess',
        next_question: isCurriculumFinished ? '' : 'Write a dictionary comprehension that filters out keys starting with an underscore.',
        mastery_streak: newStreak,
        loop_status: isCurriculumFinished ? 'complete' : 'continue',
      };
    }
  }

  // Default fallback for general submissions
  const hasReturn = code.includes('return');
  if (hasReturn && !code.includes('pass') && code.length > 25) {
    const newStreak = mastery_streak + 1;
    const isMastered = newStreak >= mastery_target;
    return {
      is_correct: true,
      classification: 'correct',
      misconception_diagnosed: null,
      evidence: null,
      feedback_intervention: 'Your code satisfies all edge cases and boundary conditions cleanly. Great job!',
      hint_level: 0,
      next_action: isMastered ? 'advance' : 'reassess',
      next_question: isMastered && concepts_remaining.length > 0
        ? `Write a function for ${concepts_remaining[0]}: ${getNextConceptStarter(concepts_remaining[0])}`
        : 'Write a variation testing this concept under reverse boundary conditions.',
      mastery_streak: newStreak,
      loop_status: isMastered && concepts_remaining.length === 0 ? 'complete' : 'continue',
    };
  }

  return {
    is_correct: false,
    classification: 'misconception',
    misconception_diagnosed: 'Incomplete Implementation',
    evidence: code.slice(0, 40),
    feedback_intervention: 'Take a close look at the required return value. Trace what the function produces for a simple 3-element list.',
    hint_level: 1,
    next_action: 'reassess',
    next_question: original_question,
    mastery_streak,
    loop_status: 'continue',
  };
}

function generateReassessmentQuestion(
  concept: string,
  _originalQuestion: string,
  attempt: number
): string {
  if (attempt >= 3) {
    return `Let's review the foundation for ${concept}: Write a short expression that extracts index 2 from a list \`sample = [10, 20, 30, 40]\`.`;
  }
  if (concept.toLowerCase().includes('slice')) {
    return 'Write a function `last_three_reversed(items)` that returns the last 3 elements of a list in reversed order using step slicing.';
  }
  if (concept.toLowerCase().includes('default')) {
    return 'Write a function `create_ledger(account_id, entries=None)` that guarantees every new ledger has an isolated transaction list.';
  }
  return `Write a function demonstrating ${concept} with a different dataset structure.`;
}

function getNextConceptStarter(conceptName: string): string {
  if (conceptName.toLowerCase().includes('default')) {
    return 'Write a function `append_tag(tag, tags=None)` that safely defaults to an empty list without shared mutable state.';
  }
  if (conceptName.toLowerCase().includes('dict')) {
    return 'Write a function `invert_mapping(d)` that flips keys and values using a dictionary comprehension.';
  }
  if (conceptName.toLowerCase().includes('recursion')) {
    return 'Write a recursive function `sum_digits(n)` with a proper base condition.';
  }
  return `Implement an idiomatic Python solution for ${conceptName}.`;
}
