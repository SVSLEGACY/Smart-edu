/**
 * CSV-Driven Data Loader for Re:Learn Misconception Engine
 * Auto-generated from misconception_dataset.csv (96 empirical records)
 */

import { DifficultyLevel, TopicQuizQuestion } from "../types";

export interface CsvMisconceptionRecord {
  id: string;
  questionText: string;
  correctAnswer: string;
  learnerResponse: string;
  misconceptionId: string;
  misconceptionLabel: string;
  errorTrace: string;
  studentExplanation: string;
  difficultyNum: number;
  difficulty: DifficultyLevel;
  trackId: string;
  trackTitle: string;
  options: string[];
  correctIndex: number;
  flawedIndex: number;
  teachingGuide: {
    overview: string;
    whyItHappens: string;
    mentalModel: string;
    keyTakeaway: string;
  };
}

export interface ConceptTrack {
  id: string;
  title: string;
  category: string;
  description: string;
  bgColor: string;
  tagBg: string;
  tagText: string;
  csvMisconceptions: string[];
  totalQuestions: number;
  difficultyCounts: {
    Easy: number;
    Medium: number;
    Difficult: number;
  };
}

export const CONCEPT_TRACKS: ConceptTrack[] = [
  {
    id: "course-python-comprehensions",
    title: "Data Structures",
    category: "Data Structures",
    description: "Master sequence immutability, list reference copies vs aliases, and zero-based indexing boundaries from empirical misconception dataset.",
    bgColor: "#FED867",
    tagBg: "bg-zinc-950",
    tagText: "text-white",
    csvMisconceptions: ["M4_STRING_IMMUTABILITY", "M7_LIST_REFERENCE_VS_COPY", "M9_INDEX_OUT_OF_RANGE"],
    totalQuestions: 37,
    difficultyCounts: { Easy: 0, Medium: 37, Difficult: 0 }
  },
  {
    id: "course-python-functions",
    title: "Functions & Scope",
    category: "Functions & Scope",
    description: "Deconstruct definition-time evaluation, mutable default argument leaks, and global variable scope shadowing.",
    bgColor: "#D7C7F9",
    tagBg: "bg-[#FED867]",
    tagText: "text-zinc-950",
    csvMisconceptions: ["M3_MUTABLE_DEFAULT_ARGS", "M5_SCOPE_CONFUSION"],
    totalQuestions: 21,
    difficultyCounts: { Easy: 0, Medium: 0, Difficult: 21 }
  },
  {
    id: "course-python-syntax",
    title: "Core Syntax & Control Flow",
    category: "Core Syntax & Control Flow",
    description: "Eliminate block indentation bugs, assignment vs equality confusion, implicit string type coercion, and integer division pitfalls.",
    bgColor: "#BBE7FE",
    tagBg: "bg-[#D7C7F9]",
    tagText: "text-zinc-950",
    csvMisconceptions: ["M1_INDENTATION", "M2_ASSIGNMENT_VS_COMPARISON", "M10_TYPE_COERCION", "M8_INTEGER_DIVISION"],
    totalQuestions: 38,
    difficultyCounts: { Easy: 31, Medium: 7, Difficult: 0 }
  }
];

export const CSV_DATASET_RECORDS: CsvMisconceptionRecord[] = [
  {
    "id": "Q4_M4_var19",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q4_M4_var77",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q7_M7_var38",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q3_M3_var96",
    "questionText": "Write a function that appends an item to a list (default empty).",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q7_M7_var31",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q1_M1_var70",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop. (variation 70)",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q5_M5_var93",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q8_M8_var64",
    "questionText": "Calculate the average of two numbers (return float).",
    "correctAnswer": "def average(a, b):\n    return (a + b) / 2",
    "learnerResponse": "def average(a, b):\n    return (a + b) // 2",
    "misconceptionId": "M8_INTEGER_DIVISION",
    "misconceptionLabel": "Integer Division Confusion",
    "errorTrace": "No error but returns integer instead of float",
    "studentExplanation": "I thought // and / are the same.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def average(a, b):\n    return (a + b) / 2",
      "def average(a, b):\n    return (a + b) // 2",
      "def average(a, b):\n    return float(a + b % 2)",
      "def average(a, b):\n    return (a + b) \\ 2"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single slash `/` performs floating-point division; double slash `//` performs integer floor division.",
      "whyItHappens": "Python 2 previously truncated integers on `/`. Python 3 guarantees `/` always yields a float.",
      "mentalModel": "`/` preserves exact decimal fractions; `//` chops off fractional remainder toward negative infinity.",
      "keyTakeaway": "Always use `/` for averages, percentages, and floating-point math."
    }
  },
  {
    "id": "Q9_M9_var96",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q1_M1_var30",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop. (variation 30)",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q2_M2_var92",
    "questionText": "Write a function that checks if a number is even.",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q10_M10_var70",
    "questionText": "Concatenate a string and a number. (variation 70)",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q7_M7_var85",
    "questionText": "Double all elements without modifying the original list. (variation 85)",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q8_M8_var5",
    "questionText": "Calculate the average of two numbers (return float). (variation 5)",
    "correctAnswer": "def average(a, b):\n    return (a + b) / 2",
    "learnerResponse": "def average(a, b):\n    return (a + b) // 2",
    "misconceptionId": "M8_INTEGER_DIVISION",
    "misconceptionLabel": "Integer Division Confusion",
    "errorTrace": "No error but returns integer instead of float",
    "studentExplanation": "I thought // and / are the same.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def average(a, b):\n    return (a + b) / 2",
      "def average(a, b):\n    return (a + b) // 2",
      "def average(a, b):\n    return float(a + b % 2)",
      "def average(a, b):\n    return (a + b) \\ 2"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single slash `/` performs floating-point division; double slash `//` performs integer floor division.",
      "whyItHappens": "Python 2 previously truncated integers on `/`. Python 3 guarantees `/` always yields a float.",
      "mentalModel": "`/` preserves exact decimal fractions; `//` chops off fractional remainder toward negative infinity.",
      "keyTakeaway": "Always use `/` for averages, percentages, and floating-point math."
    }
  },
  {
    "id": "Q10_M10_var12",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q1_M1_var86",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q4_M4_var21",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q4_M4_var61",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q1_M1_var39",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q9_M9_var37",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q4_M4_var14",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q3_M3_var90",
    "questionText": "Write a function that appends an item to a list (default empty). (variation 90)",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q3_M3_var35",
    "questionText": "Write a function that appends an item to a list (default empty). (variation 35)",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q1_M1_var96",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q9_M9_var16",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q9_M9_var15",
    "questionText": "Return the last element of a list. (variation 15)",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q7_M7_var99",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q4_M4_var52",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q10_M10_var57",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q5_M5_var39",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q3_M3_var59",
    "questionText": "Write a function that appends an item to a list (default empty).",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q2_M2_var7",
    "questionText": "Write a function that checks if a number is even.",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q1_M1_var63",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q2_M2_var20",
    "questionText": "Write a function that checks if a number is even. (variation 20)",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q5_M5_var44",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q9_M9_var56",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q1_M1_var67",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q7_M7_var28",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q2_M2_var37",
    "questionText": "Write a function that checks if a number is even.",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q7_M7_var52",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q9_M9_var11",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q4_M4_var32",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q8_M8_var52",
    "questionText": "Calculate the average of two numbers (return float).",
    "correctAnswer": "def average(a, b):\n    return (a + b) / 2",
    "learnerResponse": "def average(a, b):\n    return (a + b) // 2",
    "misconceptionId": "M8_INTEGER_DIVISION",
    "misconceptionLabel": "Integer Division Confusion",
    "errorTrace": "No error but returns integer instead of float",
    "studentExplanation": "I thought // and / are the same.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def average(a, b):\n    return (a + b) / 2",
      "def average(a, b):\n    return (a + b) // 2",
      "def average(a, b):\n    return float(a + b % 2)",
      "def average(a, b):\n    return (a + b) \\ 2"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single slash `/` performs floating-point division; double slash `//` performs integer floor division.",
      "whyItHappens": "Python 2 previously truncated integers on `/`. Python 3 guarantees `/` always yields a float.",
      "mentalModel": "`/` preserves exact decimal fractions; `//` chops off fractional remainder toward negative infinity.",
      "keyTakeaway": "Always use `/` for averages, percentages, and floating-point math."
    }
  },
  {
    "id": "Q3_M3_var44",
    "questionText": "Write a function that appends an item to a list (default empty).",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q2_M2_var65",
    "questionText": "Write a function that checks if a number is even. (variation 65)",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q9_M9_var58",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q8_M8_var34",
    "questionText": "Calculate the average of two numbers (return float).",
    "correctAnswer": "def average(a, b):\n    return (a + b) / 2",
    "learnerResponse": "def average(a, b):\n    return (a + b) // 2",
    "misconceptionId": "M8_INTEGER_DIVISION",
    "misconceptionLabel": "Integer Division Confusion",
    "errorTrace": "No error but returns integer instead of float",
    "studentExplanation": "I thought // and / are the same.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def average(a, b):\n    return (a + b) / 2",
      "def average(a, b):\n    return (a + b) // 2",
      "def average(a, b):\n    return float(a + b % 2)",
      "def average(a, b):\n    return (a + b) \\ 2"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single slash `/` performs floating-point division; double slash `//` performs integer floor division.",
      "whyItHappens": "Python 2 previously truncated integers on `/`. Python 3 guarantees `/` always yields a float.",
      "mentalModel": "`/` preserves exact decimal fractions; `//` chops off fractional remainder toward negative infinity.",
      "keyTakeaway": "Always use `/` for averages, percentages, and floating-point math."
    }
  },
  {
    "id": "Q1_M1_var23",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q2_M2_var10",
    "questionText": "Write a function that checks if a number is even. (variation 10)",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q5_M5_var30",
    "questionText": "Write a function that increments a global counter. (variation 30)",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q9_M9_var54",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q5_M5_var28",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q3_M3_var54",
    "questionText": "Write a function that appends an item to a list (default empty).",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q7_M7_var25",
    "questionText": "Double all elements without modifying the original list. (variation 25)",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q5_M5_var9",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q9_M9_var60",
    "questionText": "Return the last element of a list. (variation 60)",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q8_M8_var88",
    "questionText": "Calculate the average of two numbers (return float).",
    "correctAnswer": "def average(a, b):\n    return (a + b) / 2",
    "learnerResponse": "def average(a, b):\n    return (a + b) // 2",
    "misconceptionId": "M8_INTEGER_DIVISION",
    "misconceptionLabel": "Integer Division Confusion",
    "errorTrace": "No error but returns integer instead of float",
    "studentExplanation": "I thought // and / are the same.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def average(a, b):\n    return (a + b) / 2",
      "def average(a, b):\n    return (a + b) // 2",
      "def average(a, b):\n    return float(a + b % 2)",
      "def average(a, b):\n    return (a + b) \\ 2"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single slash `/` performs floating-point division; double slash `//` performs integer floor division.",
      "whyItHappens": "Python 2 previously truncated integers on `/`. Python 3 guarantees `/` always yields a float.",
      "mentalModel": "`/` preserves exact decimal fractions; `//` chops off fractional remainder toward negative infinity.",
      "keyTakeaway": "Always use `/` for averages, percentages, and floating-point math."
    }
  },
  {
    "id": "Q3_M3_var8",
    "questionText": "Write a function that appends an item to a list (default empty).",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q1_M1_var72",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q7_M7_var39",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q4_M4_var11",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q4_M4_var67",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q8_M8_var77",
    "questionText": "Calculate the average of two numbers (return float).",
    "correctAnswer": "def average(a, b):\n    return (a + b) / 2",
    "learnerResponse": "def average(a, b):\n    return (a + b) // 2",
    "misconceptionId": "M8_INTEGER_DIVISION",
    "misconceptionLabel": "Integer Division Confusion",
    "errorTrace": "No error but returns integer instead of float",
    "studentExplanation": "I thought // and / are the same.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def average(a, b):\n    return (a + b) / 2",
      "def average(a, b):\n    return (a + b) // 2",
      "def average(a, b):\n    return float(a + b % 2)",
      "def average(a, b):\n    return (a + b) \\ 2"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single slash `/` performs floating-point division; double slash `//` performs integer floor division.",
      "whyItHappens": "Python 2 previously truncated integers on `/`. Python 3 guarantees `/` always yields a float.",
      "mentalModel": "`/` preserves exact decimal fractions; `//` chops off fractional remainder toward negative infinity.",
      "keyTakeaway": "Always use `/` for averages, percentages, and floating-point math."
    }
  },
  {
    "id": "Q9_M9_var7",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q7_M7_var59",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q10_M10_var77",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q5_M5_var64",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q10_M10_var49",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q5_M5_var40",
    "questionText": "Write a function that increments a global counter. (variation 40)",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q10_M10_var9",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q9_M9_var95",
    "questionText": "Return the last element of a list. (variation 95)",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q1_M1_var44",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q9_M9_var31",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q4_M4_var12",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q3_M3_var9",
    "questionText": "Write a function that appends an item to a list (default empty).",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q4_M4_var57",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q2_M2_var41",
    "questionText": "Write a function that checks if a number is even.",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q10_M10_var28",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q3_M3_var94",
    "questionText": "Write a function that appends an item to a list (default empty).",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q3_M3_var60",
    "questionText": "Write a function that appends an item to a list (default empty). (variation 60)",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q7_M7_var93",
    "questionText": "Double all elements without modifying the original list.",
    "correctAnswer": "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "learnerResponse": "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
    "misconceptionId": "M7_LIST_REFERENCE_VS_COPY",
    "misconceptionLabel": "List Reference vs Copy",
    "errorTrace": "No error but original list is modified (logic error)",
    "studentExplanation": "I thought = creates a copy of the list.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def double_list(lst):\n    new_list = lst.copy()\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    new_list = lst\n    for i in range(len(new_list)):\n        new_list[i] *= 2\n    return new_list",
      "def double_list(lst):\n    return lst * 2",
      "def double_list(lst):\n    return [lst.append(x * 2) for x in lst]"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Variable assignment `new_list = lst` does not clone the list; it copies the memory reference (pointer) to the same list.",
      "whyItHappens": "Primitive numbers copy values on `=`, but composite mutable objects share the same heap reference.",
      "mentalModel": "Two variables pointing to the same list are two stickers on the same box. Opening either one edits the same contents.",
      "keyTakeaway": "Always use `lst.copy()`, `list(lst)`, or `lst[:]` when you need an isolated clone."
    }
  },
  {
    "id": "Q10_M10_var81",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q4_M4_var26",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q10_M10_var58",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q10_M10_var68",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q10_M10_var63",
    "questionText": "Concatenate a string and a number.",
    "correctAnswer": "def concat_string_number(s, n):\n    return s + str(n)",
    "learnerResponse": "def concat_string_number(s, n):\n    return s + n",
    "misconceptionId": "M10_TYPE_COERCION",
    "misconceptionLabel": "Implicit Type Coercion",
    "errorTrace": "TypeError: can only concatenate str (not 'int') to str",
    "studentExplanation": "In JavaScript, this works fine.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def concat_string_number(s, n):\n    return s + str(n)",
      "def concat_string_number(s, n):\n    return s + n",
      "return s.concat(str(n))",
      "return str.concat(s, n)"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python is strongly typed and refuses to implicitly coerce integers to strings during addition.",
      "whyItHappens": "Languages like JavaScript implicitly cast numbers into strings on `+`. Python enforces strict type safety.",
      "mentalModel": "The `+` operator has two distinct signatures: numeric addition and string concatenation. Python will not guess your intention.",
      "keyTakeaway": "Explicitly convert numbers with `str(n)` or use f-strings `f\"{s}{n}\"`."
    }
  },
  {
    "id": "Q9_M9_var99",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q3_M3_var80",
    "questionText": "Write a function that appends an item to a list (default empty). (variation 80)",
    "correctAnswer": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "learnerResponse": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "misconceptionId": "M3_MUTABLE_DEFAULT_ARGS",
    "misconceptionLabel": "Mutable Default Arguments",
    "errorTrace": "No syntax error but causes shared state bug",
    "studentExplanation": "The list should reset every time, right?",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=list()):\n    lst.append(item)\n    return lst",
      "def add_item(item, lst=[None]):\n    lst.append(item)\n    return lst"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Default arguments are evaluated once at function definition time, NOT each time the function is called.",
      "whyItHappens": "Learners assume `lst=[]` in the header allocates a fresh empty list upon each call. In CPython, that default list is shared.",
      "mentalModel": "The default parameter is a shared box attached to the function object. Callers without their own box modify that same box.",
      "keyTakeaway": "Always use sentinel `None` for mutable default arguments: `def f(item, lst=None): if lst is None: lst = []`."
    }
  },
  {
    "id": "Q1_M1_var60",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop. (variation 60)",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q2_M2_var36",
    "questionText": "Write a function that checks if a number is even.",
    "correctAnswer": "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
    "learnerResponse": "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
    "misconceptionId": "M2_ASSIGNMENT_VS_COMPARISON",
    "misconceptionLabel": "Assignment = vs Comparison ==",
    "errorTrace": "SyntaxError: invalid syntax",
    "studentExplanation": "I thought = and == are the same in conditions.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def is_even(n):\n    if n % 2 == 0:\n        return True\n    return False",
      "def is_even(n):\n    if n % 2 = 0:\n        return True\n    return False",
      "def is_even(n):\n    return n / 2 == True",
      "def is_even(n):\n    if n = 2:\n        return True"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single `=` assigns a value to a variable name, whereas double `==` tests value equality.",
      "whyItHappens": "Everyday math uses `=` for equality, but in programming `=` is an active write/assignment operator.",
      "mentalModel": "`=` is a write arrow putting data into storage; `==` is a question: \"Are these two values equal?\".",
      "keyTakeaway": "Use `==` when testing conditions inside `if` or `while` statements."
    }
  },
  {
    "id": "Q9_M9_var64",
    "questionText": "Return the last element of a list.",
    "correctAnswer": "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
    "learnerResponse": "def get_last(lst):\n    return lst[len(lst)]",
    "misconceptionId": "M9_INDEX_OUT_OF_RANGE",
    "misconceptionLabel": "Index Boundary Understanding",
    "errorTrace": "IndexError: list index out of range",
    "studentExplanation": "The last element should be at position equal to length.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def get_last(lst):\n    if len(lst) == 0:\n        return None\n    return lst[-1]",
      "def get_last(lst):\n    return lst[len(lst)]",
      "def get_last(lst):\n    return lst.last()",
      "def get_last(lst):\n    return lst.end"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Python sequences are 0-indexed: valid positive indices for length N range from 0 to N-1. Index `len(lst)` is out of range.",
      "whyItHappens": "Human counting starts at 1, causing off-by-one errors when querying the final element.",
      "mentalModel": "Index -1 wraps around backward to the last element safely.",
      "keyTakeaway": "Use `lst[-1]` to retrieve the final element cleanly."
    }
  },
  {
    "id": "Q8_M8_var70",
    "questionText": "Calculate the average of two numbers (return float). (variation 70)",
    "correctAnswer": "def average(a, b):\n    return (a + b) / 2",
    "learnerResponse": "def average(a, b):\n    return (a + b) // 2",
    "misconceptionId": "M8_INTEGER_DIVISION",
    "misconceptionLabel": "Integer Division Confusion",
    "errorTrace": "No error but returns integer instead of float",
    "studentExplanation": "I thought // and / are the same.",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def average(a, b):\n    return (a + b) / 2",
      "def average(a, b):\n    return (a + b) // 2",
      "def average(a, b):\n    return float(a + b % 2)",
      "def average(a, b):\n    return (a + b) \\ 2"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Single slash `/` performs floating-point division; double slash `//` performs integer floor division.",
      "whyItHappens": "Python 2 previously truncated integers on `/`. Python 3 guarantees `/` always yields a float.",
      "mentalModel": "`/` preserves exact decimal fractions; `//` chops off fractional remainder toward negative infinity.",
      "keyTakeaway": "Always use `/` for averages, percentages, and floating-point math."
    }
  },
  {
    "id": "Q5_M5_var51",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },
  {
    "id": "Q1_M1_var66",
    "questionText": "Write a function that prints numbers 1 to 5 using a for loop.",
    "correctAnswer": "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
    "learnerResponse": "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
    "misconceptionId": "M1_INDENTATION",
    "misconceptionLabel": "Indentation as Syntax Not Semantics",
    "errorTrace": "IndentationError: expected an indented block",
    "studentExplanation": "I thought indentation was just for readability.",
    "difficultyNum": 1,
    "difficulty": "Easy",
    "trackId": "course-python-syntax",
    "trackTitle": "Core Syntax & Control Flow",
    "options": [
      "def print_numbers():\n    for i in range(1, 6):\n        print(i)",
      "def print_numbers():\nfor i in range(1, 6):\nprint(i)",
      "def print_numbers():\n    for i in range(1, 5):\n    print(i)",
      "def print_numbers() {\n    for (i = 1; i <= 5; i++) { print(i); }\n}"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "In Python, whitespace and indentation are syntactic requirements that delineate execution blocks and scopes.",
      "whyItHappens": "Developers with backgrounds in C, Java, or JS expect compiler-ignored whitespace, relying on curly braces.",
      "mentalModel": "Every line following a colon `:` must be indented 4 spaces. Indentation level defines the nesting boundary.",
      "keyTakeaway": "Always indent function, loop, and conditional bodies by 4 spaces."
    }
  },
  {
    "id": "Q4_M4_var34",
    "questionText": "Capitalize the first character of a string.",
    "correctAnswer": "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
    "learnerResponse": "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
    "misconceptionId": "M4_STRING_IMMUTABILITY",
    "misconceptionLabel": "String Immutability",
    "errorTrace": "TypeError: 'str' object does not support item assignment",
    "studentExplanation": "Why can't I just change one character?",
    "difficultyNum": 2,
    "difficulty": "Medium",
    "trackId": "course-python-comprehensions",
    "trackTitle": "Data Structures",
    "options": [
      "def capitalize_first(s):\n    if len(s) == 0:\n        return s\n    return s[0].upper() + s[1:]",
      "def capitalize_first(s):\n    if len(s) > 0:\n        s[0] = s[0].upper()\n    return s",
      "def capitalize_first(s):\n    return s.modify(0, s[0].upper())",
      "def capitalize_first(s):\n    s[0] = chr(ord(s[0]) - 32)\n    return s"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Strings in Python are strictly immutable. Characters within a string cannot be modified or reassigned in-place.",
      "whyItHappens": "Lists allow item assignment (`lst[0] = x`), leading learners to assume strings also support item assignment.",
      "mentalModel": "A string is a sealed sculpture in memory. Slices must be carved out to build a brand new string.",
      "keyTakeaway": "To capitalize or replace text, slice and concatenate: `s[0].upper() + s[1:]`."
    }
  },
  {
    "id": "Q5_M5_var99",
    "questionText": "Write a function that increments a global counter.",
    "correctAnswer": "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
    "learnerResponse": "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
    "misconceptionId": "M5_SCOPE_CONFUSION",
    "misconceptionLabel": "Variable Scope Confusion",
    "errorTrace": "UnboundLocalError: local variable 'counter' referenced before assignment",
    "studentExplanation": "I thought the function would use the global variable.",
    "difficultyNum": 3,
    "difficulty": "Difficult",
    "trackId": "course-python-functions",
    "trackTitle": "Functions & Scope",
    "options": [
      "counter = 0\n\ndef increment_counter():\n    global counter\n    counter += 1\n    return counter",
      "counter = 0\n\ndef increment_counter():\n    counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    window.counter += 1\n    return counter",
      "counter = 0\ndef increment_counter():\n    this.counter += 1\n    return counter"
    ],
    "correctIndex": 0,
    "flawedIndex": 1,
    "teachingGuide": {
      "overview": "Writing to a variable inside a function body (`counter += 1`) marks it as local to the entire function scope, raising `UnboundLocalError` if read prior.",
      "whyItHappens": "Reading global variables works without extra syntax, so learners assume modifying them works identically.",
      "mentalModel": "An assignment statement inside a function flags the variable name as local, hiding the global variable.",
      "keyTakeaway": "Declare `global var_name` inside the function if you must rebind a global variable from local scope."
    }
  },

];

/**
 * Filter questions strictly by active difficulty and/or track.
 * Safely prevents index-out-of-range on empty filters by offering curriculum fallbacks.
 */
export function getFilteredCsvQuestions(params: {
  trackId?: string;
  difficulty?: DifficultyLevel;
  difficultyNum?: number;
}): TopicQuizQuestion[] {
  let targetDifficulty: DifficultyLevel | undefined = params.difficulty;
  if (!targetDifficulty && params.difficultyNum) {
    targetDifficulty = params.difficultyNum === 1 ? "Easy" : params.difficultyNum === 2 ? "Medium" : "Difficult";
  }

  // 1. Filter all records matching the difficulty strictly
  const matchingDifficulty = targetDifficulty
    ? CSV_DATASET_RECORDS.filter((r) => r.difficulty === targetDifficulty)
    : CSV_DATASET_RECORDS;

  // 2. If trackId is specified, check if this track has questions for this difficulty
  if (params.trackId) {
    const trackAndDiff = matchingDifficulty.filter((r) => r.trackId === params.trackId);
    if (trackAndDiff.length > 0) {
      return trackAndDiff.map(mapCsvRecordToTopicQuestion);
    }
    
    // If the track does not natively contain questions for this difficulty,
    // return all questions matching this difficulty from the CSV so the learner is never stuck on an empty screen!
    if (matchingDifficulty.length > 0) {
      return matchingDifficulty.map(mapCsvRecordToTopicQuestion);
    }

    // Otherwise return questions for that track
    const trackOnly = CSV_DATASET_RECORDS.filter((r) => r.trackId === params.trackId);
    if (trackOnly.length > 0) {
      return trackOnly.map(mapCsvRecordToTopicQuestion);
    }
  }

  return matchingDifficulty.map(mapCsvRecordToTopicQuestion);
}

/**
 * Maps a CSV record directly to a clean TopicQuizQuestion with varied option positioning
 */
export function mapCsvRecordToTopicQuestion(record: CsvMisconceptionRecord): TopicQuizQuestion {
  // Deterministic rotation based on question ID hash so option A is not always correct
  let hash = 0;
  for (let i = 0; i < record.id.length; i++) {
    hash = (hash * 31 + record.id.charCodeAt(i)) % 4;
  }
  const raw = [
    { text: record.correctAnswer, isCorrect: true },
    { text: record.learnerResponse, isCorrect: false },
    { text: record.options[2] || '# Alternative distractor A', isCorrect: false },
    { text: record.options[3] || '# Alternative distractor B', isCorrect: false },
  ];
  const rotated = [];
  for (let i = 0; i < 4; i++) {
    rotated.push(raw[(i + hash) % 4]);
  }
  const options = rotated.map((item) => item.text);
  const correctIndex = rotated.findIndex((item) => item.isCorrect);

  return {
    id: record.id,
    question: record.questionText,
    type: 'choice',
    difficulty: record.difficulty,
    difficultyNum: record.difficultyNum,
    codeSnippet: record.correctAnswer,
    correctAnswer: record.correctAnswer,
    starterCode: record.learnerResponse,
    options,
    correctIndex,
    explanation: record.teachingGuide.overview + ' ' + record.teachingGuide.keyTakeaway,
    concept: record.misconceptionLabel,
    misconceptionId: record.misconceptionId,
    misconceptionLabel: record.misconceptionLabel,
    commonMisconception: record.misconceptionLabel + ': ' + record.studentExplanation,
    learnerFlawedCode: record.learnerResponse,
    errorTrace: record.errorTrace,
    studentExplanation: record.studentExplanation,
    solutionHint: record.teachingGuide.keyTakeaway,
    teachingGuide: record.teachingGuide,
  };
}
