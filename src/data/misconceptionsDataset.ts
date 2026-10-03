import { DifficultyLevel } from '../types';

export interface MisconceptionData {
  misconceptionId: string;
  misconceptionLabel: string;
  conceptName: string;
  difficulty: DifficultyLevel;
  difficultyNum: number;
  questionText: string;
  correctAnswer: string;
  learnerResponse: string;
  errorTrace: string;
  studentExplanation: string;
  teachingGuide: {
    overview: string;
    whyItHappens: string;
    mentalModel: string;
    keyTakeaway: string;
  };
}

export const csvMisconceptionsData: MisconceptionData[] = [
  {
    misconceptionId: 'M1_INDENTATION',
    misconceptionLabel: 'Indentation as Syntax Not Semantics',
    conceptName: 'Python Block Indentation',
    difficulty: 'Easy',
    difficultyNum: 1,
    questionText: 'Write a function that prints numbers 1 to 5 using a for loop.',
    correctAnswer: `def print_numbers():\n    for i in range(1, 6):\n        print(i)`,
    learnerResponse: `def print_numbers():\nfor i in range(1, 6):\nprint(i)`,
    errorTrace: 'IndentationError: expected an indented block',
    studentExplanation: 'I thought indentation was just for readability.',
    teachingGuide: {
      overview: 'In Python, whitespace and indentation are not merely stylistic choices; they define code blocks and scope.',
      whyItHappens: 'In languages like C, Java, or JavaScript, curly braces `{}` delineate blocks, and indentation is optional. Python replaces curly braces entirely with indentation.',
      mentalModel: 'Every statement after a colon `:` must be indented exactly 4 spaces (or 1 tab). When indentation returns to the previous level, the block ends.',
      keyTakeaway: 'Always indent code nested inside `def`, `for`, `while`, `if`, and `with` blocks.',
    },
  },
  {
    misconceptionId: 'M2_ASSIGNMENT_VS_COMPARISON',
    misconceptionLabel: 'Assignment = vs Comparison ==',
    conceptName: 'Equality vs Variable Assignment',
    difficulty: 'Easy',
    difficultyNum: 1,
    questionText: 'Write a function that checks if a number is even.',
    correctAnswer: `def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False`,
    learnerResponse: `def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False`,
    errorTrace: 'SyntaxError: invalid syntax (cannot assign to expression here)',
    studentExplanation: 'I thought = and == are the same in conditions.',
    teachingGuide: {
      overview: 'Single equals `=` assigns a value to a variable name, whereas double equals `==` evaluates value equality.',
      whyItHappens: 'In everyday mathematics, `=` denotes equality. In programming, `=` is a mutation operator (assignment).',
      mentalModel: 'Think of `=` as an arrow `<-` putting data into a box. Think of `==` as asking a question: "Are these two values identical?"',
      keyTakeaway: 'Use `==` when comparing values inside `if` statements and loops. Never use a single `=` inside conditional tests.',
    },
  },
  {
    misconceptionId: 'M10_TYPE_COERCION',
    misconceptionLabel: 'Implicit Type Coercion',
    conceptName: 'Strong Typing & String Conversion',
    difficulty: 'Easy',
    difficultyNum: 1,
    questionText: 'Concatenate a string and a number.',
    correctAnswer: `def concat_string_number(s, n):\n    return s + str(n)`,
    learnerResponse: `def concat_string_number(s, n):\n    return s + n`,
    errorTrace: "TypeError: can only concatenate str (not 'int') to str",
    studentExplanation: 'In JavaScript, "age: " + 25 automatically converts to a string.',
    teachingGuide: {
      overview: 'Python is dynamically typed but strongly typed. It refuses to implicitly convert numbers to strings during addition.',
      whyItHappens: 'Languages like JavaScript implicitly cast numbers into strings with `+`. Python enforces strict type discipline to prevent silent bugs.',
      mentalModel: 'In Python, the `+` operator has two distinct meanings: numeric addition and sequence concatenation. Python will not guess which one you intended if types are mixed.',
      keyTakeaway: 'Explicitly wrap numbers in `str(n)` or use f-strings `f"{s}{n}"` when combining text with numbers.',
    },
  },
  {
    misconceptionId: 'M4_STRING_IMMUTABILITY',
    misconceptionLabel: 'String Immutability',
    conceptName: 'Immutable Text Sequences',
    difficulty: 'Medium',
    difficultyNum: 2,
    questionText: 'Capitalize the first character of a string.',
    correctAnswer: `def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]`,
    learnerResponse: `def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s`,
    errorTrace: "TypeError: 'str' object does not support item assignment",
    studentExplanation: "Why can't I just change one character like in an array?",
    teachingGuide: {
      overview: 'Strings in Python are strictly immutable. Once created in memory, characters within a string cannot be modified or reassigned in-place.',
      whyItHappens: 'Lists allow item assignment (`lst[0] = "A"`), leading learners to assume strings (which also support index subscripting `s[0]`) can be mutated similarly.',
      mentalModel: 'A string is a sealed sculpture. You cannot chisel out one letter and replace it; you must construct a brand new string by slicing and concatenating.',
      keyTakeaway: 'To modify a string, slice the parts you want and concatenate them into a new string: `s[0].upper() + s[1:]`.',
    },
  },
  {
    misconceptionId: 'M7_LIST_REFERENCE_VS_COPY',
    misconceptionLabel: 'List Reference vs Copy',
    conceptName: 'Object References & Memory Aliasing',
    difficulty: 'Medium',
    difficultyNum: 2,
    questionText: 'Double all elements without modifying the original list.',
    correctAnswer: `def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list`,
    learnerResponse: `def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list`,
    errorTrace: 'No runtime crash, but original list is mutated in-place (logic error)',
    studentExplanation: 'I thought `new_list = lst` creates a separate copy of the list.',
    teachingGuide: {
      overview: 'Variable assignment `new_list = lst` does not create a new list; it only copies the memory reference (pointer) to the exact same list in the heap.',
      whyItHappens: 'In primitive types (integers, booleans), assignment copies the value. In composite mutable objects (lists, dicts), assignment creates an alias to the same underlying object.',
      mentalModel: 'Think of `lst` and `new_list` as two different sticky notes placed on the same physical cardboard box. Changing what is inside via one note modifies the box for both.',
      keyTakeaway: 'Always use `lst.copy()`, `list(lst)`, or slice `lst[:]` when you need an independent clone of a mutable sequence.',
    },
  },
  {
    misconceptionId: 'M8_INTEGER_DIVISION',
    misconceptionLabel: 'Integer Division Confusion',
    conceptName: 'True Division (/) vs Floor Division (//)',
    difficulty: 'Medium',
    difficultyNum: 2,
    questionText: 'Calculate the average of two numbers (return float).',
    correctAnswer: `def average(a, b):\n    return (a + b) / 2`,
    learnerResponse: `def average(a, b):\n    return (a + b) // 2`,
    errorTrace: 'Returns truncated integer (e.g. 7 // 2 = 3) instead of float 3.5',
    studentExplanation: 'I thought // and / were identical division operators.',
    teachingGuide: {
      overview: 'Single slash `/` performs floating-point division (true division), while double slash `//` performs floor division, discarding fractional parts.',
      whyItHappens: 'In Python 2, `/` performed integer division on integers. In Python 3, `/` always yields a float, while `//` explicitly truncates toward negative infinity.',
      mentalModel: '`/` gives the precise decimal (e.g., `5 / 2 = 2.5`). `//` calculates how many whole times the divisor fits, dropping the remainder (`5 // 2 = 2`).',
      keyTakeaway: 'Use `/` whenever exact averages, ratios, or decimal values are required. Use `//` only when indexing or counting whole discrete chunks.',
    },
  },
  {
    misconceptionId: 'M9_INDEX_OUT_OF_RANGE',
    misconceptionLabel: 'Index Boundary Understanding',
    conceptName: 'Zero-Based Indexing & Negative Indices',
    difficulty: 'Medium',
    difficultyNum: 2,
    questionText: 'Return the last element of a list.',
    correctAnswer: `def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]`,
    learnerResponse: `def get_last(lst):\n    return lst[len(lst)]`,
    errorTrace: 'IndexError: list index out of range',
    studentExplanation: 'The last element should be at the position equal to the length.',
    teachingGuide: {
      overview: 'Because Python sequences use 0-based indexing, valid positive indices for a list of length N range from 0 to N-1. Accessing index N raises `IndexError`.',
      whyItHappens: 'Human intuition counts 1, 2, 3... N, so beginners naturally assume the last item lives at index `len(lst)`.',
      mentalModel: 'For a 5-item list, indices are `[0, 1, 2, 3, 4]`. Index 5 does not exist! Python provides `lst[-1]` as an idiomatic shortcut to wrap around backwards to the final element.',
      keyTakeaway: 'Use `lst[-1]` to retrieve the final element, or `lst[len(lst) - 1]` after verifying `len(lst) > 0`.',
    },
  },
  {
    misconceptionId: 'M3_MUTABLE_DEFAULT_ARGS',
    misconceptionLabel: 'Mutable Default Arguments',
    conceptName: 'Definition-Time Parameter Binding',
    difficulty: 'Difficult',
    difficultyNum: 3,
    questionText: 'Write a function that appends an item to a list (default empty).',
    correctAnswer: `def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst`,
    learnerResponse: `def add_item(item, lst=[]):\n    lst.append(item)\n    return lst`,
    errorTrace: 'Shared state leak: subsequent function calls accumulate previous items in the same default list',
    studentExplanation: 'The list in the parameter default should reset on every function call, right?',
    teachingGuide: {
      overview: 'Python evaluates and binds default argument values once at function definition time, NOT each time the function is invoked.',
      whyItHappens: 'Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is created once and stored on the function object (`f.__defaults__`).',
      mentalModel: 'The default argument is like a permanent drawer on the teacher desk. If callers do not bring their own paper, they all share that same drawer and scribble on the same paper.',
      keyTakeaway: 'Always use sentinel value `None` as default: `def f(item, lst=None): if lst is None: lst = []`.',
    },
  },
  {
    misconceptionId: 'M5_SCOPE_CONFUSION',
    misconceptionLabel: 'Variable Scope Confusion',
    conceptName: 'Global Scope vs Local Variable Shadowing',
    difficulty: 'Difficult',
    difficultyNum: 3,
    questionText: 'Write a function that increments a global counter.',
    correctAnswer: `counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter`,
    learnerResponse: `counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter`,
    errorTrace: "UnboundLocalError: local variable 'counter' referenced before assignment",
    studentExplanation: 'I thought the function would automatically see and modify the global variable.',
    teachingGuide: {
      overview: 'When Python sees an assignment `counter += 1` inside a function body, it treats `counter` as a local variable throughout the entire function scope. If it is read before assignment, `UnboundLocalError` is raised.',
      whyItHappens: 'Reading a global variable without modifying it works (`print(counter)`). But the moment you write to it, Python treats it as local unless explicitly told otherwise.',
      mentalModel: 'Python compiles variable lookups at function definition time. An assignment marks the name as local, shadowing the global name.',
      keyTakeaway: 'Declare `global var_name` inside the function if you must rebind a global variable from local scope.',
    },
  },
  {
    misconceptionId: 'CORRECT_LOOP_SUM',
    misconceptionLabel: 'Accumulator Pattern & Loop Bounds',
    conceptName: 'Loop Accumulators & Invariant Range',
    difficulty: 'Easy',
    difficultyNum: 1,
    questionText: 'Write a function that sums numbers 1 to n.',
    correctAnswer: `def sum_numbers(n):\n    total = 0\n    for i in range(1, n+1):\n        total += i\n    return total`,
    learnerResponse: `def sum_numbers(n):\n    total = 0\n    for i in range(1, n+1):\n        total += i\n    return total`,
    errorTrace: 'No error. Concept mastered.',
    studentExplanation: 'Correctly understood accumulator initialization and inclusive stop bound n+1.',
    teachingGuide: {
      overview: 'Standard accumulator loop pattern requiring variable initialization before the loop and proper stop boundary.',
      whyItHappens: 'Success requires remembering that `range(1, n)` stops at `n-1`, so `range(1, n+1)` is needed to include `n`.',
      mentalModel: 'Initialize the bucket to 0, then add each number into the bucket.',
      keyTakeaway: 'To include `n`, use `n+1` as the range stop parameter.',
    },
  },
];
