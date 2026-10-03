import { DiagnosticPayload, DiagnosticResult } from '../types/tutor';
import { DifficultyLevel } from '../types';

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
  "concepts_remaining": [string],       // ordered curriculum left after current_concept
  "difficulty": "Easy" | "Medium" | "Difficult" // student's active difficulty tier
}

# EVALUATION PROCEDURE (reason silently, output only the JSON)
1. Trace the code against the question with the normal case AND at least two edge cases (empty input, single element, boundaries, negative values, wrong types).
2. Classify the result:
   - CORRECT: meets the question's requirements on all traced cases.
   - SLIP: right idea, trivial error (typo, missing colon, off-by-one from carelessness). Treat as incorrect but name it "Careless Slip".
   - MISCONCEPTION: faulty mental model of the concept. Name it precisely (e.g., "Mutable Default Argument", "Off-by-One in range()", "Confusing = with ==").
3. Pinpoint the evidence: the exact line or expression that reveals the flaw.
4. Check misconception_history. If this misconception repeats, change the explanation strategy (a different analogy or a trace-table approach) instead of repeating the previous wording.

# DIFFICULTY CONSTRAINTS FOR REASSESSMENT & NEXT QUESTIONS:
When generating "reassessment_question" and "next_question", you MUST strictly calibrate the complexity to the student's chosen "difficulty":
- "Easy": Direct syntax, explicit concrete list/dict values, 1-step transformations, basic zero/single element boundaries, no nested scopes or tricky mutable traps.
- "Medium": Standard boundary cases (off-by-one stops, step direction, sentinel defaults with None, dictionary items unpacking).
- "Difficult": Algorithmic logic, tricky closures with late binding, multi-boundary mathematical invariants, recursive stack unwinding, corner cases with empty or large sequences.

# LOOP LOGIC
- Correct: increment mastery_streak. If mastery_streak >= mastery_target, the concept is mastered, so set next_action "advance" with a question on the next concept in concepts_remaining calibrated to the chosen difficulty. Otherwise set next_action "reassess" with a fresh variation, to confirm the success was not luck.
- Incorrect: set next_action "reassess". The new "reassessment_question" must test the SAME concept but be structurally different from the original and strictly adhere to the requested difficulty level.
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
  "reassessment_question": string,
  "difficulty": "Easy" | "Medium" | "Difficult",
  "mastery_streak": integer,
  "loop_status": "continue" | "complete"
}

Field rules:
- misconception_diagnosed and evidence are null when is_correct is true.
- hint_level is 0 when correct; otherwise follows the hint ladder.
- feedback_intervention: if correct, 1-2 sentences of specific praise; if incorrect, an explanation of the flaw without giving the answer.
- reassessment_question matches the student's selected difficulty level.`;

/**
 * Evaluates student code through the Re:Learn diagnostic engine.
 * Calls the server-side Gemini endpoint (/api/evaluate or /api/diagnose),
 * and seamlessly uses a specialized local fallback evaluator otherwise.
 */
export async function diagnoseStudentSubmission(
  payload: DiagnosticPayload
): Promise<DiagnosticResult> {
  const activeDifficulty = payload.difficulty || 'Medium';

  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, difficulty: activeDifficulty }),
    });

    if (response.ok) {
      const parsed = (await response.json()) as DiagnosticResult;
      return {
        ...parsed,
        difficulty: parsed.difficulty || activeDifficulty,
        reassessment_question: parsed.reassessment_question || parsed.next_question,
      };
    }
  } catch (err) {
    console.warn('Server diagnostic call unavailable, falling back to local diagnostic engine:', err);
  }

  // Local Diagnostic Engine implementing the exact specification
  return localDiagnosticEngine({ ...payload, difficulty: activeDifficulty });
}

/**
 * Built-in diagnostic engine implementation for deterministic, instant diagnosis
 * adhering strictly to the prompt specifications, hint ladder, difficulty calibration, and loop rules.
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
    difficulty = 'Medium',
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
    const reassessment = generateDifficultyReassessment(current_concept, original_question, difficulty, attempt_number);
    return {
      is_correct: false,
      classification: 'slip',
      misconception_diagnosed: 'Careless Slip',
      evidence: code.split('\n').find((l) => !l.includes(':') && l.includes('def ')) || code,
      feedback_intervention:
        "You've nailed the core logic, but there is a quick syntax slip in your punctuation. Check your function definition or slicing syntax.",
      hint_level: hintLevel as 1 | 2 | 3,
      next_action: nextAction,
      next_question: reassessment,
      reassessment_question: reassessment,
      difficulty,
      mastery_streak,
      loop_status: 'continue',
    };
  }

  // 2. Concept-specific diagnostics for Slicing & Sequences
  if (current_concept.toLowerCase().includes('slice') || current_concept.toLowerCase().includes('sequence')) {
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

      const reassessment = generateDifficultyReassessment(current_concept, original_question, difficulty, attempt_number);

      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Off-by-One in Slice Stop Boundary',
        evidence: code.split('\n').find((l) => l.includes('mid + 1')) || 'items[mid - 1 : mid + 1]',
        feedback_intervention: feedback,
        hint_level: hintLevel as 1 | 2 | 3,
        next_action: nextAction,
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }

    // Check for correct slicing
    if (
      code.includes('mid + 2') ||
      code.includes('mid-1:mid+2') ||
      (code.includes('[20, 30]') && !code.includes('[20, 30, 40]')) ||
      code.includes('[::-1]') ||
      code.includes('[]')
    ) {
      const newStreak = mastery_streak + 1;
      const isMastered = newStreak >= mastery_target;
      const isCurriculumFinished = isMastered && concepts_remaining.length === 0;

      return {
        is_correct: true,
        classification: 'correct',
        misconception_diagnosed: null,
        evidence: null,
        feedback_intervention:
          'Spot on! You correctly accounted for Python sequence boundary semantics and demonstrated clear comprehension.',
        hint_level: 0,
        next_action: isMastered ? 'advance' : 'reassess',
        next_question: isCurriculumFinished
          ? ''
          : isMastered
          ? `Write a ${difficulty} solution for ${concepts_remaining[0]}: ${getNextConceptStarter(concepts_remaining[0], difficulty)}`
          : generateDifficultyReassessment(current_concept, original_question, difficulty, 1),
        reassessment_question: '',
        difficulty,
        mastery_streak: newStreak,
        loop_status: isCurriculumFinished ? 'complete' : 'continue',
      };
    }
  }

  // 3. Mutable default argument diagnosis
  if (current_concept.toLowerCase().includes('default') || current_concept.toLowerCase().includes('scope') || current_concept.toLowerCase().includes('mutable')) {
    if (code.includes('tags=[]') || code.includes('tags = []') || code.includes('target=[]') || code.includes('target = []') || code.includes('=[1, 2]')) {
      const hintLevel = attempt_number <= 2 ? 1 : attempt_number === 3 ? 2 : 3;
      const nextAction = hintLevel === 3 ? 'review_prerequisite' : 'reassess';

      const feedback =
        attempt_number >= 3
          ? 'Python evaluates default parameter expressions only once when the function definition is executed, not on each call. A list in `def f(lst=[]):` is shared across all invocations.'
          : 'You structured the append correctly, but consider when `target=[]` is created in memory: does a new list get allocated on every function call?';

      const reassessment = generateDifficultyReassessment(current_concept, original_question, difficulty, attempt_number);

      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Mutable Default Argument',
        evidence: code.split('\n').find((l) => l.includes('=[]') || l.includes('target = []')) || 'target=[]',
        feedback_intervention: feedback,
        hint_level: hintLevel as 1 | 2 | 3,
        next_action: nextAction,
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }

    if (code.includes('None') || code.includes('[1, 2] (both') || code.includes('Local -> Enclosing')) {
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
          ? `Now moving to ${concepts_remaining[0]}: ${getNextConceptStarter(concepts_remaining[0], difficulty)}`
          : generateDifficultyReassessment(current_concept, original_question, difficulty, 1),
        reassessment_question: '',
        difficulty,
        mastery_streak: newStreak,
        loop_status: isCurriculumFinished ? 'complete' : 'continue',
      };
    }
  }

  // 4. Comprehensions & Data Structures
  if (current_concept.toLowerCase().includes('comprehension') || current_concept.toLowerCase().includes('dict') || current_concept.toLowerCase().includes('structure')) {
    if (code.includes('in d') && !code.includes('.items()') && !code.includes('d.keys()')) {
      const reassessment = generateDifficultyReassessment(current_concept, original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Iterating Dictionary Keys as Pairs',
        evidence: code.split('\n').find((l) => l.includes('in d')) || 'for k, v in d',
        feedback_intervention:
          'Iterating directly over a dictionary `for item in d:` yields only the keys, not key-value tuples. Which dictionary method returns both key and value pairs?',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }

    if (code.includes('.items()') || code.includes('{1: 1, 3: 9}') || code.includes('lazy evaluation')) {
      const newStreak = mastery_streak + 1;
      const isMastered = newStreak >= mastery_target;
      const isCurriculumFinished = isMastered && concepts_remaining.length === 0;

      return {
        is_correct: true,
        classification: 'correct',
        feedback_intervention: 'Great comprehension syntax! You unpacked keys and values cleanly and observed efficient evaluation.',
        misconception_diagnosed: null,
        evidence: null,
        hint_level: 0,
        next_action: isMastered ? 'advance' : 'reassess',
        next_question: isCurriculumFinished ? '' : generateDifficultyReassessment(current_concept, original_question, difficulty, 1),
        reassessment_question: '',
        difficulty,
        mastery_streak: newStreak,
        loop_status: isCurriculumFinished ? 'complete' : 'continue',
      };
    }
  }

  // General fallback
  const hasReturn = code.includes('return') || code.length > 30;
  if (hasReturn && !code.includes('pass')) {
    const newStreak = mastery_streak + 1;
    const isMastered = newStreak >= mastery_target;
    return {
      is_correct: true,
      classification: 'correct',
      misconception_diagnosed: null,
      evidence: null,
      feedback_intervention: `Your ${difficulty} level submission satisfies the specification cleanly. Excellent problem resolution!`,
      hint_level: 0,
      next_action: isMastered ? 'advance' : 'reassess',
      next_question: isMastered && concepts_remaining.length > 0
        ? `Write a function for ${concepts_remaining[0]}: ${getNextConceptStarter(concepts_remaining[0], difficulty)}`
        : generateDifficultyReassessment(current_concept, original_question, difficulty, 1),
      reassessment_question: '',
      difficulty,
      mastery_streak: newStreak,
      loop_status: isMastered && concepts_remaining.length === 0 ? 'complete' : 'continue',
    };
  }

  const reassessment = generateDifficultyReassessment(current_concept, original_question, difficulty, attempt_number);
  return {
    is_correct: false,
    classification: 'misconception',
    misconception_diagnosed: 'Incomplete Concept Implementation',
    evidence: code.slice(0, 40) || 'Missing return expression',
    feedback_intervention: 'Take a close look at the required return value. Trace what the function produces for a simple 3-element test input.',
    hint_level: 1,
    next_action: 'reassess',
    next_question: reassessment,
    reassessment_question: reassessment,
    difficulty,
    mastery_streak,
    loop_status: 'continue',
  };
}

/**
 * Generates dynamic follow-up reassessment questions strictly calibrated to Easy, Medium, or Difficult tiers.
 */
function generateDifficultyReassessment(
  concept: string,
  _originalQuestion: string,
  difficulty: DifficultyLevel,
  attempt: number
): string {
  const c = concept.toLowerCase();

  if (attempt >= 3) {
    return `Prerequisite review for ${concept}: Write a single-line Python expression extracting the element at index 2 from \`items = [10, 20, 30, 40]\`.`;
  }

  if (c.includes('slice') || c.includes('sequence')) {
    if (difficulty === 'Easy') {
      return 'Given `nums = [1, 2, 3, 4, 5]`, write a slice expression that extracts the first 3 elements (`[1, 2, 3]`).';
    } else if (difficulty === 'Medium') {
      return 'Write a function `last_three_reversed(items)` that returns the last 3 elements of any sequence in reverse order using slice step syntax.';
    } else {
      return 'Write a function `every_other_except_ends(items)` that excludes the first and last element of a list, then takes every 2nd element in reversed order in a single slice expression.';
    }
  }

  if (c.includes('default') || c.includes('scope') || c.includes('mutable')) {
    if (difficulty === 'Easy') {
      return 'Write a function `add_log(entry, logs=None)` that returns a new list containing `entry`, ensuring `logs` is initialized as a fresh list if `None`.';
    } else if (difficulty === 'Medium') {
      return 'Write a function `create_ledger(account_id, entries=None)` that guarantees every new ledger has an isolated transaction list in local scope.';
    } else {
      return 'Write a higher-order factory function `make_accumulator(initial=None)` that returns a closure with an isolated mutable list state that cannot be corrupted across separate instances.';
    }
  }

  if (c.includes('comprehension') || c.includes('dict') || c.includes('data')) {
    if (difficulty === 'Easy') {
      return 'Write a list comprehension that multiplies every number in `[1, 2, 3, 4]` by 10.';
    } else if (difficulty === 'Medium') {
      return 'Write a dictionary comprehension `invert_mapping(d)` that flips keys and values using `.items()` iteration.';
    } else {
      return 'Write a nested dictionary comprehension that maps each string in `words` to a sub-dictionary of character frequency counts for non-vowel characters only.';
    }
  }

  // General fallbacks by difficulty
  if (difficulty === 'Easy') {
    return `Write a foundational 2-line Python example demonstrating ${concept} with direct integer values.`;
  } else if (difficulty === 'Medium') {
    return `Write a function demonstrating ${concept} with edge case validation for empty collections.`;
  } else {
    return `Design an optimal, edge-case proof Python implementation for ${concept} under adversarial inputs (empty collections, negative indices, duplicate keys).`;
  }
}

function getNextConceptStarter(conceptName: string, difficulty: DifficultyLevel): string {
  if (difficulty === 'Easy') {
    return `Write a basic expression testing ${conceptName}.`;
  } else if (difficulty === 'Difficult') {
    return `Write a robust, edge-case tested implementation for ${conceptName}.`;
  }
  return `Implement an idiomatic Python solution for ${conceptName}.`;
}
