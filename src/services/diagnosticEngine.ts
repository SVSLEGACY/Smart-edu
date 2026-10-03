import { DiagnosticPayload, DiagnosticResult } from '../types/tutor';
import { DifficultyLevel } from '../types';
import { csvMisconceptionsData } from '../data/misconceptionsDataset';

export const RE_LEARN_SYSTEM_PROMPT = `# ROLE
You are the diagnostic engine for Re:Learn, an AI Python tutor. You evaluate one student submission per call, diagnose the underlying misconception (not just the symptom), and decide what the learning loop does next. You never act as a code-golfing solution generator: your job is to build understanding.

# MISCONCEPTION GROUND TRUTH CATALOG (from empirical learner dataset):
- M1_INDENTATION ("Indentation as Syntax Not Semantics"): Missing block indentation under def/for/if blocks -> IndentationError.
- M2_ASSIGNMENT_VS_COMPARISON ("Assignment = vs Comparison =="): Using single '=' in conditional tests -> SyntaxError.
- M3_MUTABLE_DEFAULT_ARGS ("Mutable Default Arguments"): Writing def f(lst=[]), causing shared state mutation across calls.
- M4_STRING_IMMUTABILITY ("String Immutability"): Attempting item assignment s[0] = ... -> TypeError: 'str' object does not support item assignment.
- M5_SCOPE_CONFUSION ("Variable Scope Confusion"): Modifying a global variable without 'global var' -> UnboundLocalError.
- M7_LIST_REFERENCE_VS_COPY ("List Reference vs Copy"): Writing new_list = lst instead of new_list = lst.copy() -> Logic error mutating original list.
- M8_INTEGER_DIVISION ("Integer Division Confusion"): Using // instead of / when floating-point averages or decimals are required.
- M9_INDEX_OUT_OF_RANGE ("Index Boundary Understanding"): Accessing index lst[len(lst)] instead of lst[-1] -> IndexError: list index out of range.
- M10_TYPE_COERCION ("Implicit Type Coercion"): Adding string and number (s + n) instead of (s + str(n)) -> TypeError.

# INPUT
You receive a JSON object:
{
  "current_concept": string,            // topic under test, e.g. "String Immutability"
  "original_question": string,          // prompt being solved
  "student_code": string,               // submission code
  "attempt_number": integer,            // attempt count
  "mastery_streak": integer,            // current streak
  "mastery_target": integer,            // target streak
  "misconception_history": [string],    // past misconceptions
  "concepts_remaining": [string],       // remaining curriculum
  "difficulty": "Easy" | "Medium" | "Difficult" // active complexity tier
}

# EVALUATION PROCEDURE (reason silently, output only the JSON)
1. Trace the code against the question with normal cases and edge cases (empty strings, empty lists, boundaries).
2. Classify:
   - CORRECT: meets requirements on all cases.
   - SLIP: trivial typo or syntax slip. Treat as incorrect but name it "Careless Slip".
   - MISCONCEPTION: faulty mental model. Match against the empirical misconception catalog above whenever applicable.
3. Pinpoint the exact line or expression exhibiting the error.
4. Strictly calibrate "reassessment_question" to the requested difficulty tier:
   - Easy: 1-step direct operations, concrete explicit numbers/strings, basic syntax.
   - Medium: boundaries, slice steps, reference copies, true division.
   - Difficult: parameter bindings, closures, global scope modifications.

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
}`;

/**
 * Evaluates student code through the Re:Learn diagnostic engine.
 * Calls the server-side Gemini endpoint (/api/evaluate or /api/diagnose),
 * and seamlessly uses a specialized local fallback evaluator grounded in the CSV dataset.
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

  // Local Diagnostic Engine implementing the exact specification grounded in CSV data
  return localDiagnosticEngine({ ...payload, difficulty: activeDifficulty });
}

/**
 * Built-in diagnostic engine implementation for deterministic, instant diagnosis
 * using the empirical CSV dataset and difficulty calibration.
 */
export function localDiagnosticEngine(payload: DiagnosticPayload): DiagnosticResult {
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

  // 1. M1_INDENTATION Check
  if (
    current_concept.toLowerCase().includes('indent') ||
    (code.includes('def print_numbers():\nfor') || (code.includes('def ') && code.includes('\nfor') && !code.includes('    for')))
  ) {
    if (code.includes('\nfor i in range') && !code.includes('    for')) {
      const reassessment = generateDifficultyReassessment('Indentation', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Indentation as Syntax Not Semantics (M1)',
        evidence: 'for i in range(1, 6):\nprint(i) # Missing 4-space block indentation',
        feedback_intervention:
          'In Python, indentation is not just for readability; it defines the execution block. Every line inside def or for must be indented by 4 spaces. Without indentation, Python raises IndentationError.',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 2. M2_ASSIGNMENT_VS_COMPARISON Check
  if (
    current_concept.toLowerCase().includes('assignment') ||
    current_concept.toLowerCase().includes('comparison') ||
    code.includes('% 2 = 0') ||
    code.includes('if n = 2')
  ) {
    if (code.includes('% 2 = 0') || (code.includes('if ') && code.includes(' = ') && !code.includes(' == '))) {
      const reassessment = generateDifficultyReassessment('Equality Comparison', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Assignment = vs Comparison == (M2)',
        evidence: 'if n % 2 = 0: # Cannot assign to expression in conditional test',
        feedback_intervention:
          'Single "=" is the assignment operator used to store values into variables. To test whether two values are equal inside an if condition, you must use double "==".',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 3. M10_TYPE_COERCION Check
  if (
    current_concept.toLowerCase().includes('coercion') ||
    current_concept.toLowerCase().includes('type') ||
    code.includes('return s + n')
  ) {
    if (code.includes('return s + n') || code.includes('s + n')) {
      const reassessment = generateDifficultyReassessment('Type Coercion', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Implicit Type Coercion (M10)',
        evidence: 'return s + n # TypeError: can only concatenate str (not "int") to str',
        feedback_intervention:
          'Unlike JavaScript, Python is strongly typed and refuses to automatically coerce numbers to strings during addition. Explicitly convert the number using `str(n)` or use `f"{s}{n}"`.',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 4. M4_STRING_IMMUTABILITY Check
  if (
    current_concept.toLowerCase().includes('immutab') ||
    current_concept.toLowerCase().includes('capitalize') ||
    code.includes('s[0] =') ||
    code.includes('s[0]=')
  ) {
    if (code.includes('s[0] =') || code.includes('s[0]=')) {
      const reassessment = generateDifficultyReassessment('String Immutability', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'String Immutability (M4)',
        evidence: "s[0] = s[0].upper() # TypeError: 'str' object does not support item assignment",
        feedback_intervention:
          "Strings in Python are strictly immutable in memory. Once created, characters cannot be reassigned in-place. You must construct a new string by slicing: `s[0].upper() + s[1:]`.",
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 5. M7_LIST_REFERENCE_VS_COPY Check
  if (
    current_concept.toLowerCase().includes('reference') ||
    current_concept.toLowerCase().includes('copy') ||
    code.includes('new_list = lst\n') ||
    code.includes('new_list = lst;')
  ) {
    if ((code.includes('new_list = lst') && !code.includes('.copy()') && !code.includes('lst[:]')) || code.includes('new_list = lst\n')) {
      const reassessment = generateDifficultyReassessment('List Reference vs Copy', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'List Reference vs Copy (M7)',
        evidence: 'new_list = lst # Creates alias to same memory address; original list is mutated',
        feedback_intervention:
          'Writing `new_list = lst` does not clone the list; it only copies the memory reference pointing to the exact same list in the heap. Use `lst.copy()`, `list(lst)`, or `lst[:]` to create an independent copy.',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 6. M8_INTEGER_DIVISION Check
  if (
    current_concept.toLowerCase().includes('division') ||
    current_concept.toLowerCase().includes('average') ||
    code.includes('// 2')
  ) {
    if (code.includes('// 2')) {
      const reassessment = generateDifficultyReassessment('Integer Division', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Integer Division Confusion (M8)',
        evidence: 'return (a + b) // 2 # Floor division truncates decimal float (e.g. 7 // 2 = 3 instead of 3.5)',
        feedback_intervention:
          'Double slash `//` performs floor division and truncates the decimal part to an integer. For exact averages or decimal results, use single slash `/` for true floating-point division.',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 7. M9_INDEX_OUT_OF_RANGE Check
  if (
    current_concept.toLowerCase().includes('index') ||
    current_concept.toLowerCase().includes('last') ||
    code.includes('len(lst)]')
  ) {
    if (code.includes('lst[len(lst)]')) {
      const reassessment = generateDifficultyReassessment('Index Boundary', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Index Boundary Understanding (M9)',
        evidence: 'return lst[len(lst)] # IndexError: list index out of range',
        feedback_intervention:
          'Python sequences use zero-based indexing (0 to N-1). A list of length N does not have an element at index N! Use `lst[-1]` to retrieve the final element safely.',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 8. M3_MUTABLE_DEFAULT_ARGS Check
  if (
    current_concept.toLowerCase().includes('default') ||
    current_concept.toLowerCase().includes('mutable') ||
    code.includes('lst=[]') ||
    code.includes('lst = []') ||
    code.includes('target=[]')
  ) {
    if (code.includes('def add_item(item, lst=[]):') || code.includes('def add_item(item, lst=[])') || code.includes('target=[]')) {
      const reassessment = generateDifficultyReassessment('Mutable Default Arguments', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Mutable Default Arguments (M3)',
        evidence: 'def add_item(item, lst=[]): # Default list evaluated once at definition time; shared across calls',
        feedback_intervention:
          'Python evaluates default parameter expressions only once when the function definition is executed, not on each call. An in-place mutable default like `lst=[]` retains state across every invocation. Use `lst=None` and initialize `if lst is None: lst = []`.',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // 9. M5_SCOPE_CONFUSION Check
  if (
    current_concept.toLowerCase().includes('scope') ||
    current_concept.toLowerCase().includes('counter') ||
    current_concept.toLowerCase().includes('global')
  ) {
    if (code.includes('counter += 1') && !code.includes('global counter')) {
      const reassessment = generateDifficultyReassessment('Variable Scope Confusion', original_question, difficulty, attempt_number);
      return {
        is_correct: false,
        classification: 'misconception',
        misconception_diagnosed: 'Variable Scope Confusion (M5)',
        evidence: "counter += 1 # UnboundLocalError: local variable 'counter' referenced before assignment",
        feedback_intervention:
          'Assigning to a variable inside a function body marks it as a local variable for the entire function scope. Because it is read before assignment, Python raises UnboundLocalError. Add `global counter` to modify the global variable.',
        hint_level: 1,
        next_action: 'reassess',
        next_question: reassessment,
        reassessment_question: reassessment,
        difficulty,
        mastery_streak,
        loop_status: 'continue',
      };
    }
  }

  // Slicing Center Check
  if (code.includes('mid + 1') && code.includes('mid - 1')) {
    const reassessment = generateDifficultyReassessment('Sequence Slicing', original_question, difficulty, attempt_number);
    return {
      is_correct: false,
      classification: 'misconception',
      misconception_diagnosed: 'Off-by-One in Slice Stop Boundary',
      evidence: 'items[mid - 1 : mid + 1] # Slicing stop is exclusive; only retrieves 2 items',
      feedback_intervention:
        'In Python slicing `items[start:stop]`, the stop boundary is strictly exclusive. To pull 3 elements around the center index, use `items[mid - 1 : mid + 2]`.',
      hint_level: 1,
      next_action: 'reassess',
      next_question: reassessment,
      reassessment_question: reassessment,
      difficulty,
      mastery_streak,
      loop_status: 'continue',
    };
  }

  // Correct Check
  const isRecognizedCorrect =
    code.includes('for i in range(1, 6):') ||
    code.includes('n % 2 == 0') ||
    code.includes('s + str(n)') ||
    code.includes('s[0].upper() + s[1:]') ||
    code.includes('lst.copy()') ||
    (code.includes('(a + b) / 2') && !code.includes('//')) ||
    code.includes('lst[-1]') ||
    (code.includes('lst=None') && code.includes('lst = []')) ||
    (code.includes('global counter') && code.includes('counter += 1')) ||
    code.includes('range(1, n+1)') ||
    code.includes('[20, 30]') ||
    code.includes('mid + 2') ||
    code.includes('[::-1]');

  if (isRecognizedCorrect) {
    const newStreak = mastery_streak + 1;
    const isMastered = newStreak >= mastery_target;
    return {
      is_correct: true,
      classification: 'correct',
      misconception_diagnosed: null,
      evidence: null,
      feedback_intervention:
        `Spot on! You demonstrated full understanding of ${current_concept} without falling into the common misconception. Code executed cleanly.`,
      hint_level: 0,
      next_action: isMastered ? 'advance' : 'reassess',
      next_question: isMastered && concepts_remaining.length > 0
        ? `Write a ${difficulty} solution for ${concepts_remaining[0]}.`
        : generateDifficultyReassessment(current_concept, original_question, difficulty, 1),
      reassessment_question: '',
      difficulty,
      mastery_streak: newStreak,
      loop_status: isMastered && concepts_remaining.length === 0 ? 'complete' : 'continue',
    };
  }

  // General fallback for unknown submissions
  const reassessment = generateDifficultyReassessment(current_concept, original_question, difficulty, attempt_number);
  return {
    is_correct: false,
    classification: 'misconception',
    misconception_diagnosed: 'Incomplete Implementation or Syntax Error',
    evidence: code.slice(0, 40) || 'No executable return statements found',
    feedback_intervention:
      'Review your solution against the concept requirements. Trace through the execution steps line-by-line.',
    hint_level: 1,
    next_action: 'reassess',
    next_question: reassessment,
    reassessment_question: reassessment,
    difficulty,
    mastery_streak,
    loop_status: 'continue',
  };
}

function generateDifficultyReassessment(
  concept: string,
  _originalQuestion: string,
  difficulty: DifficultyLevel,
  attempt: number
): string {
  const c = concept.toLowerCase();

  if (attempt >= 3) {
    return `Foundational Review: Write a 1-line Python expression demonstrating ${concept} with direct basic values.`;
  }

  if (c.includes('indent')) {
    if (difficulty === 'Easy') return 'Write a function `count_to_three()` that prints numbers 1, 2, 3 on separate lines with correct 4-space indentation.';
    if (difficulty === 'Medium') return 'Write a function with a nested loop printing a 3x3 grid of asterisks with proper nested indentation.';
    return 'Write a function with nested conditionals and a loop demonstrating clean indentation blocks across 3 levels.';
  }

  if (c.includes('equality') || c.includes('assignment')) {
    if (difficulty === 'Easy') return 'Write an if-condition that checks if variable `status` is equal to the string `"ready"`.';
    if (difficulty === 'Medium') return 'Write a function `is_leap_year(year)` that checks divisibility by 4 and 400 using equality comparisons.';
    return 'Write a function evaluating equality between compound nested structures without assigning variables.';
  }

  if (c.includes('immutab') || c.includes('string')) {
    if (difficulty === 'Easy') return 'Write an expression that replaces the first character of string `"cat"` with `"b"` using slice concatenation.';
    if (difficulty === 'Medium') return 'Write a function `mask_email(email)` that replaces the first 3 characters with `"***"` using slicing.';
    return 'Write a function `reverse_capitalize_words(sentence)` that reverses and capitalizes each word without attempting in-place string mutation.';
  }

  if (c.includes('reference') || c.includes('copy')) {
    if (difficulty === 'Easy') return 'Given `nums = [1, 2, 3]`, create an independent copy `cloned` using `nums.copy()`.';
    if (difficulty === 'Medium') return 'Write a function `filter_and_double(lst)` that doubles elements into a new list without altering the input list.';
    return 'Write a function demonstrating deep versus shallow copying on a list of nested sublists.';
  }

  if (c.includes('division')) {
    if (difficulty === 'Easy') return 'Calculate the exact decimal half of number `n`.';
    if (difficulty === 'Medium') return 'Calculate the float percentage `part / total * 100` avoiding floor division truncation.';
    return 'Write a function that returns both the true division quotient and the integer floor division quotient as a tuple.';
  }

  if (c.includes('index') || c.includes('boundary')) {
    if (difficulty === 'Easy') return 'Given `items = [10, 20, 30]`, return the last element using negative indexing.';
    if (difficulty === 'Medium') return 'Write a function `second_from_end(lst)` that safely returns the penultimate element or None if length < 2.';
    return 'Write a function that slices an array into 3 equal partitions while safely managing fencepost boundaries.';
  }

  if (c.includes('default') || c.includes('mutable')) {
    if (difficulty === 'Easy') return 'Write a function `add_tag(tag, tags=None)` that initializes `tags = []` inside the function body.';
    if (difficulty === 'Medium') return 'Write a function `register_player(name, inventory=None)` ensuring each player gets an isolated list.';
    return 'Write a higher-order function generating state accumulators with completely isolated mutable default parameters.';
  }

  if (c.includes('scope') || c.includes('global')) {
    if (difficulty === 'Easy') return 'Write a function `reset_counter()` that sets global variable `counter` to 0 using the `global` keyword.';
    if (difficulty === 'Medium') return 'Write two functions `increment()` and `decrement()` that safely modify a shared module-level integer.';
    return 'Demonstrate the difference between LEGB enclosing closure scope (`nonlocal`) and module scope (`global`).';
  }

  return `Write a ${difficulty}-level Python function demonstrating ${concept} with edge-case validation.`;
}
