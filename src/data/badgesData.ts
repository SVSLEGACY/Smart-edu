import { Badge } from '../types';

export const allBadges: Badge[] = [
  {
    id: 'badge-syntax-pioneer',
    name: 'Syntax Pioneer',
    description: 'Mastered block indentation (M1), assignment vs equality == (M2), and strong type coercion (M10).',
    category: 'python-syntax',
    tier: 'bronze',
    icon: 'Code2',
    symbol: '🐍',
    color: '#10B981', // Emerald
    xpReward: 100,
    requiredTaskIds: ['Q1_M1', 'Q2_M2', 'Q10_M10'],
    courseId: 'course-python-syntax',
    courseTitle: 'Core Syntax & Control Flow',
  },
  {
    id: 'badge-data-alchemist',
    name: 'Data Structures Alchemist',
    description: 'Conquered string immutability (M4), list reference copies (M7), and zero-based sequence boundaries (M9).',
    category: 'python-core',
    tier: 'silver',
    icon: 'Layers',
    symbol: '📦',
    color: '#FED867', // Warm Yellow
    xpReward: 200,
    requiredTaskIds: ['Q4_M4', 'Q7_M7', 'Q9_M9'],
    courseId: 'course-python-comprehensions',
    courseTitle: 'Data Structures',
  },
  {
    id: 'badge-scope-sentinel',
    name: 'Scope Sentinel',
    description: 'Defeated mutable default argument traps (M3), mastered None sentinels, and conquered LEGB scoping (M5).',
    category: 'python-syntax',
    tier: 'silver',
    icon: 'ShieldAlert',
    symbol: '🛡️',
    color: '#D7C7F9', // Soft Lilac
    xpReward: 200,
    requiredTaskIds: ['Q3_M3', 'Q5_M5'],
    courseId: 'course-python-functions',
    courseTitle: 'Functions & Scope',
  },
  {
    id: 'badge-division-dynamo',
    name: 'Division Dynamo',
    description: 'Distinguished float true division (/) from floor truncation (//) with mathematical precision (M8).',
    category: 'python-core',
    tier: 'gold',
    icon: 'Zap',
    symbol: '⚡',
    color: '#06B6D4', // Cyan
    xpReward: 250,
    requiredTaskIds: ['Q8_M8'],
    courseId: 'course-python-syntax',
    courseTitle: 'Core Syntax & Control Flow',
  },
  {
    id: 'badge-streak-inferno',
    name: 'Streak Inferno',
    description: 'Maintained a persistent learning streak by conquering diagnostic questions without interruption.',
    category: 'streak',
    tier: 'gold',
    icon: 'Flame',
    symbol: '🔥',
    color: '#FF533D', // Flame Orange
    xpReward: 300,
    requiredTaskIds: ['streak-01', 'streak-02', 'streak-03'],
  },
  {
    id: 'badge-misconception-slayer',
    name: 'Misconception Slayer',
    description: 'Diagnosed and debugged multiple fundamental Python misconceptions using LEARN THIS interventions.',
    category: 'algorithms',
    tier: 'diamond',
    icon: 'Sparkles',
    symbol: '⚔️',
    color: '#EC4899', // Fuchsia
    xpReward: 350,
    requiredTaskIds: ['slayer-01', 'slayer-02', 'slayer-03', 'slayer-04', 'slayer-05'],
  },
  {
    id: 'badge-python-polymath',
    name: 'CPython Grandmaster',
    description: 'Achieved the ultimate milestone by mastering all 9 empirical Python misconceptions in the dataset.',
    category: 'mastery',
    tier: 'diamond',
    icon: 'Crown',
    symbol: '👑',
    color: '#8B5CF6', // Purple
    xpReward: 500,
    requiredTaskIds: [
      'topic-complete-course-python-syntax',
      'topic-complete-course-python-comprehensions',
      'topic-complete-course-python-functions',
    ],
    courseTitle: 'Full Curriculum Mastery',
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

  // 1. Syntax Pioneer (Core Syntax & Control Flow)
  if (badge.id === 'badge-syntax-pioneer') {
    const matched = completedTaskIds.filter(
      (id) => id.includes('M1_') || id.includes('M2_') || id.includes('M10_') || id.includes('syntax')
    ).length;
    const total = 3;
    const isUnlocked = matched >= 1;
    return {
      badge,
      isUnlocked,
      completedCount: Math.min(total, Math.max(matched > 0 ? 1 : 0, matched)),
      totalCount: total,
      progressPercent: isUnlocked ? 100 : Math.round((matched / total) * 100),
    };
  }

  // 2. Data Structures Alchemist
  if (badge.id === 'badge-data-alchemist') {
    const matched = completedTaskIds.filter(
      (id) => id.includes('M4_') || id.includes('M7_') || id.includes('M9_') || id.includes('comprehensions')
    ).length;
    const total = 3;
    const isUnlocked = matched >= 1;
    return {
      badge,
      isUnlocked,
      completedCount: Math.min(total, matched),
      totalCount: total,
      progressPercent: isUnlocked ? 100 : Math.round((matched / total) * 100),
    };
  }

  // 3. Scope Sentinel
  if (badge.id === 'badge-scope-sentinel') {
    const matched = completedTaskIds.filter(
      (id) => id.includes('M3_') || id.includes('M5_') || id.includes('functions')
    ).length;
    const total = 2;
    const isUnlocked = matched >= 1;
    return {
      badge,
      isUnlocked,
      completedCount: Math.min(total, matched),
      totalCount: total,
      progressPercent: isUnlocked ? 100 : Math.round((matched / total) * 100),
    };
  }

  // 4. Division Dynamo
  if (badge.id === 'badge-division-dynamo') {
    const matched = completedTaskIds.filter((id) => id.includes('M8_')).length;
    const total = 1;
    const isUnlocked = matched >= 1;
    return {
      badge,
      isUnlocked,
      completedCount: isUnlocked ? 1 : 0,
      totalCount: total,
      progressPercent: isUnlocked ? 100 : 0,
    };
  }

  // 5. Streak Inferno
  if (badge.id === 'badge-streak-inferno') {
    const total = 3;
    const count = Math.min(total, completedTaskIds.length);
    const isUnlocked = completedTaskIds.length >= 2;
    return {
      badge,
      isUnlocked,
      completedCount: isUnlocked ? total : count,
      totalCount: total,
      progressPercent: isUnlocked ? 100 : Math.round((count / total) * 100),
    };
  }

  // 6. Misconception Slayer
  if (badge.id === 'badge-misconception-slayer') {
    const total = 5;
    const count = Math.min(total, completedTaskIds.length);
    const isUnlocked = completedTaskIds.length >= 3;
    return {
      badge,
      isUnlocked,
      completedCount: count,
      totalCount: total,
      progressPercent: Math.round((count / total) * 100),
    };
  }

  // 7. CPython Grandmaster (Polymath)
  if (badge.id === 'badge-python-polymath') {
    const total = 6;
    const count = Math.min(total, completedTaskIds.length);
    const isUnlocked = completedTaskIds.length >= 6;
    return {
      badge,
      isUnlocked,
      completedCount: count,
      totalCount: total,
      progressPercent: Math.round((count / total) * 100),
    };
  }

  // Default fallback
  const completedCount = badge.requiredTaskIds.filter((taskId) => completedSet.has(taskId)).length;
  const totalCount = badge.requiredTaskIds.length;
  const isUnlocked = completedCount >= totalCount && totalCount > 0;
  return {
    badge,
    isUnlocked,
    completedCount,
    totalCount,
    progressPercent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
  };
}
