import { Badge } from '../types';

export const allBadges: Badge[] = [
  {
    id: 'badge-python-novice',
    name: 'Python Novice',
    description: 'Began your Python journey by answering sequence indexing and boundary slice quizzes.',
    category: 'python-core',
    tier: 'bronze',
    icon: 'Sparkles',
    color: '#3B82F6', // Blue
    xpReward: 100,
    requiredTaskIds: ['q-slice-01'],
    courseId: 'course-python-slicing',
    courseTitle: 'Python Sequences: Slicing & Boundary Math',
  },
  {
    id: 'badge-slice-master',
    name: 'Slice & Dice Master',
    description: 'Mastered exclusive stop boundaries, center windows, and negative step sequence traversal.',
    category: 'python-core',
    tier: 'silver',
    icon: 'Scissors',
    color: '#06B6D4', // Cyan
    xpReward: 200,
    requiredTaskIds: ['q-slice-01', 'q-slice-02', 'q-slice-03', 'q-slice-04'],
    courseId: 'course-python-slicing',
    courseTitle: 'Python Sequences: Slicing & Boundary Math',
  },
  {
    id: 'badge-scope-sentinel',
    name: 'Scope Sentinel',
    description: 'Defeated mutable default argument traps, mastered None sentinels, and conquered LEGB scoping.',
    category: 'python-syntax',
    tier: 'silver',
    icon: 'ShieldAlert',
    color: '#8B5CF6', // Purple
    xpReward: 200,
    requiredTaskIds: ['q-func-01', 'q-func-02', 'q-func-03', 'q-func-04'],
    courseId: 'course-python-functions',
    courseTitle: 'Python Functions, Scope & Mutable Defaults',
  },
  {
    id: 'badge-loop-legend',
    name: 'Loop Legend',
    description: 'Eliminated clunky for-loops with idiomatic list comprehensions, dict maps, and set filtering.',
    category: 'python-syntax',
    tier: 'gold',
    icon: 'Repeat',
    color: '#EAB308', // Amber / Gold
    xpReward: 250,
    requiredTaskIds: ['q-comp-01', 'q-comp-02', 'q-comp-03', 'q-comp-04'],
    courseId: 'course-python-comprehensions',
    courseTitle: 'Idiomatic Comprehensions & Data Structures',
  },
  {
    id: 'badge-recursion-wizard',
    name: 'Recursion Wizard',
    description: 'Conquered recursive call stack frames, base case design, and dynamic memoization caching.',
    category: 'algorithms',
    tier: 'gold',
    icon: 'Zap',
    color: '#EC4899', // Pink / Fuchsia
    xpReward: 300,
    requiredTaskIds: ['q-algo-01', 'q-algo-02', 'q-algo-03', 'q-algo-04'],
    courseId: 'course-python-algorithms',
    courseTitle: 'Algorithmic Python: Recursion, Call Stacks & Big Data',
  },
  {
    id: 'badge-python-polymath',
    name: 'Python Polymath',
    description: 'Earned the ultimate distinction by completing comprehensive quizzes across every curriculum topic.',
    category: 'mastery',
    tier: 'diamond',
    icon: 'Crown',
    color: '#10B981', // Emerald / Diamond
    xpReward: 500,
    requiredTaskIds: [
      'topic-complete-course-python-slicing',
      'topic-complete-course-python-functions',
      'topic-complete-course-python-comprehensions',
      'topic-complete-course-python-algorithms',
    ],
    courseId: 'course-python-slicing',
    courseTitle: 'Curriculum Mastery',
  },
];

export interface BadgeProgress {
  badge: Badge;
  isUnlocked: boolean;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
}

/**
 * Computes progress and unlock state for a badge given the user's completed task/quiz IDs.
 */
export function calculateBadgeProgress(badge: Badge, completedTaskIds: string[]): BadgeProgress {
  const completedSet = new Set(completedTaskIds);

  // Special case: Python Novice unlocks with any 1 completed quiz or slice question
  if (badge.id === 'badge-python-novice') {
    const hasAnyQuizCompleted = completedTaskIds.some(
      (id) => id.startsWith('q-') || id.startsWith('topic-complete-')
    );
    const count = hasAnyQuizCompleted ? 1 : 0;
    return {
      badge,
      isUnlocked: hasAnyQuizCompleted,
      completedCount: count,
      totalCount: 1,
      progressPercent: hasAnyQuizCompleted ? 100 : 0,
    };
  }

  // Special case: Python Polymath unlocks if all 4 topics are completed OR at least 12 questions completed
  if (badge.id === 'badge-python-polymath') {
    const topicCompleteCount = badge.requiredTaskIds.filter((tid) => completedSet.has(tid)).length;
    const questionsCompletedCount = completedTaskIds.filter((tid) => tid.startsWith('q-')).length;

    const isUnlocked = topicCompleteCount === 4 || questionsCompletedCount >= 12;
    const progressPercent = isUnlocked
      ? 100
      : Math.min(100, Math.round((Math.max(topicCompleteCount * 3, questionsCompletedCount) / 12) * 100));

    return {
      badge,
      isUnlocked,
      completedCount: Math.min(12, Math.max(topicCompleteCount * 3, questionsCompletedCount)),
      totalCount: 12,
      progressPercent,
    };
  }

  // For topic-specific badges:
  // Check either the topic completion flag OR the individual question IDs
  const topicFlagId = `topic-complete-${badge.courseId}`;
  if (completedSet.has(topicFlagId)) {
    return {
      badge,
      isUnlocked: true,
      completedCount: badge.requiredTaskIds.length,
      totalCount: badge.requiredTaskIds.length,
      progressPercent: 100,
    };
  }

  const completedCount = badge.requiredTaskIds.filter((taskId) => completedSet.has(taskId)).length;
  const totalCount = badge.requiredTaskIds.length;
  const isUnlocked = completedCount >= totalCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    badge,
    isUnlocked,
    completedCount,
    totalCount,
    progressPercent,
  };
}
