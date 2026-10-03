import { TopicQuiz } from '../types';

export const pythonTopicQuizzes: Record<string, TopicQuiz> = {
  'course-python-slicing': {
    courseId: 'course-python-slicing',
    courseTitle: 'Python Sequences: Slicing & Boundary Math',
    topicName: 'Sequence Indexing & Slicing',
    questions: [
      {
        id: 'q-slice-01',
        type: 'choice',
        concept: 'Exclusive Stop Boundary',
        question: 'Given items = [10, 20, 30, 40, 50], what is the exact output of items[1:3]?',
        codeSnippet: `items = [10, 20, 30, 40, 50]
result = items[1:3]
print(result)`,
        options: ['[20, 30]', '[20, 30, 40]', '[10, 20, 30]', '[30, 40]'],
        correctIndex: 0,
        explanation: 'In Python slicing list[start:stop], the stop index is strictly exclusive. Indices 1 and 2 are retrieved, giving [20, 30].',
        commonMisconception: 'Off-by-One in Slice Stop Boundary: Assuming stop index is included.',
        solutionHint: 'Remember slice length is stop - start (3 - 1 = 2 elements).',
      },
      {
        id: 'q-slice-02',
        type: 'choice',
        concept: 'Center Window Slicing',
        question: 'Which slice expression correctly extracts the middle 3 elements from an odd-length list with len(items) >= 3?',
        codeSnippet: `mid = len(items) // 2
# Goal: extract items[mid-1], items[mid], items[mid+1]
middle_elements = items[???]`,
        options: [
          'items[mid - 1 : mid + 2]',
          'items[mid - 1 : mid + 1]',
          'items[mid : mid + 3]',
          'items[mid - 2 : mid + 1]',
        ],
        correctIndex: 0,
        explanation: 'Because the stop index is exclusive, mid + 2 will stop right after index mid + 1, collecting exactly indices mid-1, mid, and mid+1 (3 elements).',
        commonMisconception: 'Off-by-One in Stop Index: Using mid + 1 only yields 2 elements.',
        solutionHint: 'Since stop is exclusive, mid - 1 to mid + 2 yields indices mid-1, mid, and mid+1.',
      },
      {
        id: 'q-slice-03',
        type: 'choice',
        concept: 'Negative Step Reversal',
        question: 'What is the output of the string slice "python"[::-1]?',
        codeSnippet: `word = "python"
reversed_word = word[::-1]
print(reversed_word)`,
        options: ['"nohtyp"', '"python"', 'IndexError: string index out of range', '"" (empty string)'],
        correctIndex: 0,
        explanation: 'A step of -1 without start or stop indices traverses the sequence backwards from end to start.',
        commonMisconception: 'Expecting negative indices without bounds to raise an IndexError.',
        solutionHint: 'Negative step values reverse the iteration direction.',
      },
      {
        id: 'q-slice-04',
        type: 'choice',
        concept: 'Safe Slice Out-of-Bounds Behavior',
        question: 'What is the result of evaluating items[5:10] when items = [1, 2, 3]?',
        codeSnippet: `items = [1, 2, 3]
print(items[5:10])`,
        options: [
          '[] (empty list)',
          'IndexError: list index out of range',
          '[1, 2, 3]',
          'None',
        ],
        correctIndex: 0,
        explanation: 'Unlike direct index access (items[5]) which raises IndexError, sequence slicing gracefully clamps out-of-bounds indices and returns an empty slice.',
        commonMisconception: 'Expecting slices that exceed length to raise IndexError like item indexing.',
        solutionHint: 'Python slicing never raises IndexError for out-of-bounds start or stop.',
      },
    ],
  },
  'course-python-functions': {
    courseId: 'course-python-functions',
    courseTitle: 'Python Functions, Scope & Mutable Defaults',
    topicName: 'Function Parameters & Execution Scope',
    questions: [
      {
        id: 'q-func-01',
        type: 'choice',
        concept: 'Default Mutable Argument',
        question: 'If def add_item(val, target=[]) is called twice as add_item(1) then add_item(2), what is returned on the second call?',
        codeSnippet: `def add_item(val, target=[]):
    target.append(val)
    return target

add_item(1)
print(add_item(2))`,
        options: [
          '[1, 2] (both items in the shared default list)',
          '[2] (a fresh list is created)',
          'Raises TypeError',
          'None',
        ],
        correctIndex: 0,
        explanation: 'Python evaluates default arguments once when the function definition is executed, so the same list object is shared across all calls that omit the parameter.',
        commonMisconception: 'Assuming default expressions execute each time the function is called.',
        solutionHint: 'Function definitions in Python are executable statements that bind defaults once at definition time.',
      },
      {
        id: 'q-func-02',
        type: 'choice',
        concept: 'Sentinel Default Pattern',
        question: 'What is the idiomatic Python pattern to avoid shared state mutations across function calls?',
        codeSnippet: `# Which implementation ensures an isolated list each call?`,
        options: [
          'def append_tag(tag, tags=None):\n    if tags is None: tags = []\n    tags.append(tag)\n    return tags',
          'def append_tag(tag, tags=[]):\n    tags.append(tag)\n    return tags',
          'def append_tag(tag, tags=list.copy()):\n    tags.append(tag)\n    return tags',
          'def append_tag(tag, tags=()):\n    tags.append(tag)\n    return tags',
        ],
        correctIndex: 0,
        explanation: 'Using None as a sentinel value allows creating a brand new empty list in local scope during each invocation.',
        commonMisconception: 'Using tags=[] in function header which leads to shared state mutation.',
        solutionHint: 'Check if tags is None inside the body, and instantiate [] there.',
      },
      {
        id: 'q-func-03',
        type: 'choice',
        concept: 'LEGB Scope Resolution',
        question: 'In which order does Python resolve variable names according to the LEGB rule?',
        codeSnippet: `x = "global"
def outer():
    x = "enclosing"
    def inner():
        x = "local"
        return x`,
        options: [
          'Local -> Enclosing -> Global -> Built-in',
          'Global -> Local -> Enclosing -> Built-in',
          'Local -> Global -> Enclosing -> Built-in',
          'Lexical -> External -> Global -> Base',
        ],
        correctIndex: 0,
        explanation: 'Python checks Local first, then Enclosing functions (closures), then Global module scope, and finally Built-in names.',
        commonMisconception: 'Confusing Enclosing closures with Global scope priority.',
        solutionHint: 'LEGB stands for Local, Enclosing, Global, Built-in.',
      },
      {
        id: 'q-func-04',
        type: 'choice',
        concept: 'Late Binding in Closures',
        question: 'What is the output of invoking the functions generated in this loop?',
        codeSnippet: `funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])`,
        options: [
          '[2, 2, 2]',
          '[0, 1, 2]',
          '[0, 0, 0]',
          'Raises UnboundLocalError',
        ],
        correctIndex: 0,
        explanation: 'Python closures bind late to variable names rather than values. When the lambdas are executed, the loop has completed and i is 2.',
        commonMisconception: 'Assuming lambdas capture the loop iteration variable by value eagerly.',
        solutionHint: 'The variable i is looked up in the enclosing scope at invocation time, not definition time.',
      },
    ],
  },
  'course-python-comprehensions': {
    courseId: 'course-python-comprehensions',
    courseTitle: 'Idiomatic Comprehensions & Data Structures',
    topicName: 'Comprehensions & Mappings',
    questions: [
      {
        id: 'q-comp-01',
        type: 'choice',
        concept: 'Dictionary Comprehension Filtering',
        question: 'What is returned by {x: x**2 for x in [1, 2, 3, 4] if x % 2 != 0}?',
        codeSnippet: `result = {x: x**2 for x in [1, 2, 3, 4] if x % 2 != 0}
print(result)`,
        options: ['{1: 1, 3: 9}', '[1, 9]', '{1, 9}', '{2: 4, 4: 16}'],
        correctIndex: 0,
        explanation: 'The filter x % 2 != 0 keeps only 1 and 3. The dict comprehension pairs 1: 1**2 and 3: 3**2.',
        commonMisconception: 'Confusing dict comprehension syntax with set comprehension.',
        solutionHint: 'Look for key: value syntax inside curly braces.',
      },
      {
        id: 'q-comp-02',
        type: 'choice',
        concept: 'Inverting Dictionaries with .items()',
        question: 'Which comprehension correctly inverts a dictionary mapping (swapping keys and values)?',
        codeSnippet: `original = {'a': 1, 'b': 2, 'c': 3}
# Desired output: {1: 'a', 2: 'b', 3: 'c'}
inverted = ???`,
        options: [
          '{v: k for k, v in original.items()}',
          '{k: v for k, v in original}',
          '{v: k for v in original}',
          '[v: k for k, v in original.values()]',
        ],
        correctIndex: 0,
        explanation: 'Iterating over d.items() yields (key, value) pairs which can be swapped to {v: k}.',
        commonMisconception: 'Iterating over d directly, which only yields keys.',
        solutionHint: 'Remember to call .items() on the dictionary.',
      },
      {
        id: 'q-comp-03',
        type: 'choice',
        concept: 'Generators vs Lists',
        question: 'What is the primary memory advantage of a generator expression (x*2 for x in data) over a list comprehension [x*2 for x in data]?',
        codeSnippet: `gen = (x * 2 for x in range(10_000_000))
lst = [x * 2 for x in range(10_000_000)]`,
        options: [
          'It yields elements one at a time on demand without storing the full sequence in RAM',
          'It automatically compiles down to GPU instructions',
          'It deletes data from disk after iteration',
          'It caches all outputs permanently',
        ],
        correctIndex: 0,
        explanation: 'Generators use lazy evaluation, producing items only when requested and keeping memory consumption constant (O(1)).',
        commonMisconception: 'Believing generators run faster or use multi-threading.',
        solutionHint: 'Generators calculate the next value on-the-fly.',
      },
      {
        id: 'q-comp-04',
        type: 'choice',
        concept: 'Set Comprehension Deduplication',
        question: 'What data structure and value is produced by {x for x in [1, 2, 2, 3, 3, 3]}?',
        codeSnippet: `result = {x for x in [1, 2, 2, 3, 3, 3]}
print(type(result), result)`,
        options: [
          '<class \'set\'> {1, 2, 3}',
          '<class \'dict\'> {1: None, 2: None, 3: None}',
          '<class \'list\'> [1, 2, 3]',
          '<class \'tuple\'> (1, 2, 3)',
        ],
        correctIndex: 0,
        explanation: 'Curly braces without key:value colons define a set comprehension, which automatically deduplicates items.',
        commonMisconception: 'Assuming all curly brace comprehensions produce dictionaries.',
        solutionHint: 'Dictionaries require key: value pairs; single expressions in braces create sets.',
      },
    ],
  },
  'course-python-algorithms': {
    courseId: 'course-python-algorithms',
    courseTitle: 'Algorithmic Python: Recursion, Call Stacks & Big Data',
    topicName: 'Recursion & Memory Frames',
    questions: [
      {
        id: 'q-algo-01',
        type: 'choice',
        concept: 'Recursion Termination',
        question: 'What error is raised if a recursive Python function exceeds the call stack depth without hitting a base case?',
        codeSnippet: `def recurse():
    return recurse()
recurse()`,
        options: [
          'RecursionError (maximum recursion depth exceeded)',
          'StackMemoryError',
          'InfiniteLoopWarning',
          'SegmentationFault',
        ],
        correctIndex: 0,
        explanation: 'CPython enforces a recursion limit (default ~1000 frames) and raises RecursionError to protect the C call stack.',
        commonMisconception: 'Expecting Python to hang indefinitely like an infinite while loop.',
        solutionHint: 'Python guards against call stack overflow with RecursionError.',
      },
      {
        id: 'q-algo-02',
        type: 'choice',
        concept: 'Recursive Digit Sum Base Case',
        question: 'Which recursive implementation correctly computes the sum of digits of non-negative integer n?',
        codeSnippet: `# Example: sum_digits(245) -> 2 + 4 + 5 = 11
def sum_digits(n):
    # Which base case and reduction step is correct?`,
        options: [
          'if n < 10: return n\nreturn (n % 10) + sum_digits(n // 10)',
          'if n == 0: return 0\nreturn (n / 10) + sum_digits(n % 10)',
          'return sum(str(n))',
          'if n < 1: return 1\nreturn n * sum_digits(n - 1)',
        ],
        correctIndex: 0,
        explanation: 'The base case is when n < 10 (single digit), where the sum is simply n. Otherwise add the last digit (n % 10) to the recursive sum of remaining digits (n // 10).',
        commonMisconception: 'Forgetting single-digit termination or using floating-point division instead of integer floor division //.',
        solutionHint: 'Use modulo % 10 for last digit and integer division // 10 to reduce.',
      },
      {
        id: 'q-algo-03',
        type: 'choice',
        concept: 'Memoization with lru_cache',
        question: 'Which standard library decorator is typically used to cache recursive function calls in Python?',
        codeSnippet: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)`,
        options: [
          '@functools.lru_cache',
          '@itertools.memoize',
          '@contextlib.cache',
          '@sys.cache_frames',
        ],
        correctIndex: 0,
        explanation: 'functools.lru_cache wraps a function with a memoizing callable that saves recent calls, preventing re-computation in recursive algorithms.',
        commonMisconception: 'Looking for memoize in itertools.',
        solutionHint: 'It lives in the functools module.',
      },
      {
        id: 'q-algo-04',
        type: 'choice',
        concept: 'Call Stack Frame Unwinding',
        question: 'What happens to Python call stack frames when a recursive function hits its base case?',
        codeSnippet: `# Phase: Recursive Unwinding`,
        options: [
          'Active frames are popped in LIFO (Last In First Out) order, returning values back to each caller frame',
          'All frames are cleared simultaneously in O(1) time',
          'Frames are converted into generator objects',
          'Frames are preserved permanently on the heap',
        ],
        correctIndex: 0,
        explanation: 'As the base case returns, each active frame on the call stack receives its child return value and unwinds in LIFO order.',
        commonMisconception: 'Believing recursion bypasses stack unwinding or jumps directly to the entry frame.',
        solutionHint: 'Call stacks operate on Last In, First Out semantics.',
      },
    ],
  },
};
