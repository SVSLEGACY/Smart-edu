import { ConceptCurriculum } from '../types/tutor';

export const pythonCurriculumQueue: ConceptCurriculum[] = [
  {
    id: 'concept-list-slicing',
    name: 'list slicing',
    description: 'Extracting sublists using start:stop:step indexing and boundaries.',
    category: 'Sequences & Indexing',
    firstQuestion: 'Write a function `middle_three(items)` that returns a new list containing the middle 3 elements of a list of odd length >= 3.',
    starterCode: `def middle_three(items):\n    # Return the middle 3 elements as a new list\n    mid = len(items) // 2\n    return items[mid - 1 : mid + 2]\n`,
    prerequisite: 'integer division and index math',
    sampleMisconceptions: [
      {
        label: 'Off-by-One (exclusive stop boundary)',
        code: `def middle_three(items):\n    mid = len(items) // 2\n    # Mistake: slice stop is exclusive, returning only 2 elements\n    return items[mid - 1 : mid + 1]`,
        expectedMisconception: 'Off-by-One in Slice Stop Boundary',
      },
      {
        label: 'Correct Solution',
        code: `def middle_three(items):\n    mid = len(items) // 2\n    return items[mid - 1 : mid + 2]`,
        expectedMisconception: 'None (Correct)',
      },
      {
        label: 'Careless Slip (missing colon/syntax typo)',
        code: `def middle_three(items):\n    mid = len(items) // 2\n    return items[mid - 1 , mid + 2]`,
        expectedMisconception: 'Careless Slip',
      },
    ],
  },
  {
    id: 'concept-mutable-defaults',
    name: 'default mutable arguments',
    description: 'Understanding function definition-time evaluation of default parameters.',
    category: 'Functions & Scope',
    firstQuestion: 'Write a function `append_tag(tag, tags=None)` that appends `tag` to `tags` and returns the list. If `tags` is not passed, start with a fresh empty list.',
    starterCode: `def append_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags\n`,
    prerequisite: 'variable assignment and None checks',
    sampleMisconceptions: [
      {
        label: 'Mutable Default Argument (tags=[])',
        code: `def append_tag(tag, tags=[]):\n    # Mistake: default list is created once at function definition time\n    tags.append(tag)\n    return tags`,
        expectedMisconception: 'Mutable Default Argument',
      },
      {
        label: 'Correct Solution',
        code: `def append_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags`,
        expectedMisconception: 'None (Correct)',
      },
    ],
  },
  {
    id: 'concept-dict-comprehension',
    name: 'dictionary comprehension',
    description: 'Transforming key-value mappings concisely with condition filters.',
    category: 'Data Structures',
    firstQuestion: 'Write a function `invert_mapping(d)` that takes a dict `d` with unique values and returns a new dict with keys and values swapped.',
    starterCode: `def invert_mapping(d):\n    return {v: k for k, v in d.items()}\n`,
    prerequisite: 'dictionary iteration (.items())',
    sampleMisconceptions: [
      {
        label: 'Confusing dict iteration with items()',
        code: `def invert_mapping(d):\n    # Mistake: iterating directly over dict yields keys only\n    return {v: k for k, v in d}`,
        expectedMisconception: 'Iterating Dictionary Keys as Pairs',
      },
      {
        label: 'Correct Solution',
        code: `def invert_mapping(d):\n    return {v: k for k, v in d.items()}`,
        expectedMisconception: 'None (Correct)',
      },
    ],
  },
  {
    id: 'concept-recursion-base-case',
    name: 'recursion base case',
    description: 'Formulating terminating conditions before inductive steps.',
    category: 'Algorithms',
    firstQuestion: 'Write a recursive function `sum_digits(n)` that returns the sum of all digits of non-negative integer `n`.',
    starterCode: `def sum_digits(n):\n    if n < 10:\n        return n\n    return (n % 10) + sum_digits(n // 10)\n`,
    prerequisite: 'modulo and floor division',
    sampleMisconceptions: [
      {
        label: 'Missing or Non-terminating Base Case',
        code: `def sum_digits(n):\n    # Mistake: checks == 0 but misses single digit termination, recursion error on 0\n    return (n % 10) + sum_digits(n // 10)`,
        expectedMisconception: 'Missing Recursion Base Case',
      },
      {
        label: 'Correct Solution',
        code: `def sum_digits(n):\n    if n < 10:\n        return n\n    return (n % 10) + sum_digits(n // 10)`,
        expectedMisconception: 'None (Correct)',
      },
    ],
  },
];
