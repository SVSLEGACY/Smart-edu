import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Repeat,
  Scissors,
  ShieldAlert,
  Zap,
  Crown,
  Star,
  Check,
  X,
  Play,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../../types';
import { allBadges, calculateBadgeProgress, BadgeProgress } from '../../data/badgesData';

interface BadgesProps {
  completedTaskIds?: string[];
  onLaunchQuiz?: (courseId: string) => void;
  onSelectCourse?: (courseId: string) => void;
  className?: string;
  isCompact?: boolean;
}

export const Badges: React.FC<BadgesProps> = ({
  completedTaskIds = [],
  onLaunchQuiz,
  onSelectCourse,
  className = '',
  isCompact = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'in-progress'>('all');
  const [selectedBadgeProgress, setSelectedBadgeProgress] = useState<BadgeProgress | null>(null);

  // Compute progress for all badges
  const badgeProgressList: BadgeProgress[] = allBadges.map((badge) =>
    calculateBadgeProgress(badge, completedTaskIds)
  );

  const unlockedCount = badgeProgressList.filter((bp) => bp.isUnlocked).length;
  const totalBadges = badgeProgressList.length;
  const totalXPEarned = badgeProgressList
    .filter((bp) => bp.isUnlocked)
    .reduce((sum, bp) => sum + bp.badge.xpReward, 0);
  const totalXPAvailable = badgeProgressList.reduce((sum, bp) => sum + bp.badge.xpReward, 0);

  const filteredList = badgeProgressList.filter((bp) => {
    if (filter === 'unlocked') return bp.isUnlocked;
    if (filter === 'in-progress') return !bp.isUnlocked;
    return true;
  });

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean, color: string, symbol?: string) => {
    return (
      <div className="flex items-center justify-center relative select-none">
        {symbol ? (
          <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-125">
            {symbol}
          </span>
        ) : (
          <Sparkles
            className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110 ${
              isUnlocked ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'
            }`}
          />
        )}
      </div>
    );
  };

  const getTierBadgeStyle = (tier: Badge['tier']) => {
    switch (tier) {
      case 'diamond':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'gold':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'silver':
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30';
      case 'bronze':
      default:
        return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Component Header with Overview Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1E1E22] p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Trophy className="w-6 h-6 drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
                Virtual Skill Badges
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF533D]/10 text-[#FF533D] border border-[#FF533D]/20">
                Rewards Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-xl">
              Complete interactive quiz topics to unlock badges and showcase your Python proficiency.
            </p>
          </div>
        </div>

        {/* Stats metrics & Progress bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-zinc-50 dark:bg-zinc-800/60 p-3 sm:px-4 sm:py-2.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Badges Earned
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-zinc-900 dark:text-white tabular-nums font-mono">
                {unlockedCount}
              </span>
              <span className="text-xs text-zinc-400 font-medium">/ {totalBadges}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />

          <div>
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Earned Rewards
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-amber-500 tabular-nums font-mono">
                +{totalXPEarned}
              </span>
              <span className="text-xs text-zinc-400 font-medium">XP</span>
            </div>
          </div>

          <div className="w-full sm:w-28 mt-1 sm:mt-0">
            <div className="flex justify-between text-[10px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
              <span>Progress</span>
              <span>{Math.round((unlockedCount / totalBadges) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-[#FF533D] rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
            }`}
          >
            All Badges ({totalBadges})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'in-progress'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
            }`}
          >
            In Progress ({totalBadges - unlockedCount})
          </button>
        </div>

        {onLaunchQuiz && (
          <button
            onClick={() => onLaunchQuiz('course-python-slicing')}
            className="text-xs font-bold text-[#FF533D] hover:text-[#e04430] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Open Python Quiz Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredList.map((bp) => {
            const { badge, isUnlocked, progressPercent, completedCount, totalCount } = bp;

            return (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedBadgeProgress(bp)}
                className={`group relative rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isUnlocked
                    ? 'bg-white dark:bg-[#1E1E22] border-zinc-200/90 dark:border-zinc-700/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-zinc-50/70 dark:bg-[#161619]/90 border-zinc-200/50 dark:border-zinc-800/80 opacity-90 hover:opacity-100 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Glow backdrop for unlocked badge */}
                {isUnlocked && (
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: badge.color }}
                  />
                )}

                <div>
                  {/* Top Bar: Tier Badge + Status + XP */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getTierBadgeStyle(
                        badge.tier
                      )}`}
                    >
                      {badge.tier}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-extrabold font-mono text-amber-500">
                        +{badge.xpReward} XP
                      </span>
                      {isUnlocked ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Icon & Title Row */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-xs relative transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? 'shadow-md ring-2 ring-white/60 dark:ring-zinc-700'
                          : 'bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300/60 dark:border-zinc-700'
                      }`}
                      style={{
                        backgroundColor: isUnlocked ? badge.color : undefined,
                      }}
                    >
                      {renderBadgeIcon(badge.icon, isUnlocked, badge.color, badge.symbol)}

                      {/* Small unlocked star indicator */}
                      {isUnlocked && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-base font-extrabold tracking-tight truncate ${
                          isUnlocked
                            ? 'text-zinc-900 dark:text-white group-hover:text-[#FF533D] transition-colors'
                            : 'text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {badge.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Progress Bar & CTA */}
                <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-zinc-400 dark:text-zinc-500">
                      {isUnlocked ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Topic Mastered</span>
                        </span>
                      ) : (
                        <span>
                          {completedCount}/{totalCount} required quizzes
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-zinc-600 dark:text-zinc-400 tabular-nums">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-[#FF533D]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Action Button */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate max-w-[65%]">
                      {badge.courseTitle || 'Curriculum Quiz'}
                    </span>

                    {isUnlocked ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (badge.courseId && onLaunchQuiz) {
                            onLaunchQuiz(badge.courseId);
                          }
                        }}
                        className="text-[11px] font-bold text-[#FF533D] hover:text-[#e04430] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Earn Badge</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Interactive Badge Detail & Reward Celebration Modal */}
      <AnimatePresence>
        {selectedBadgeProgress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-[#1E1E22] rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 dark:border-zinc-700 relative overflow-hidden text-zinc-900 dark:text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadgeProgress(null)}
                aria-label="Close modal"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Decorative radial burst */}
              <div
                className="absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{ backgroundColor: selectedBadgeProgress.badge.color }}
              />

              {/* Modal Content */}
              <div className="flex flex-col items-center text-center">
                {/* Large Badge Crest */}
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl mb-4 relative ${
                    selectedBadgeProgress.isUnlocked
                      ? 'ring-4 ring-white dark:ring-zinc-700 shadow-orange-500/20'
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                  style={{
                    backgroundColor: selectedBadgeProgress.isUnlocked
                      ? selectedBadgeProgress.badge.color
                      : undefined,
                  }}
                >
                  {renderBadgeIcon(
                    selectedBadgeProgress.badge.icon,
                    selectedBadgeProgress.isUnlocked,
                    selectedBadgeProgress.badge.color,
                    selectedBadgeProgress.badge.symbol
                  )}
                  {selectedBadgeProgress.isUnlocked && (
                    <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-md">
                      <Crown className="w-4 h-4 fill-current" />
                    </span>
                  )}
                </div>

                {/* Tier and XP */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider border ${getTierBadgeStyle(
                      selectedBadgeProgress.badge.tier
                    )}`}
                  >
                    {selectedBadgeProgress.badge.tier}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                    +{selectedBadgeProgress.badge.xpReward} XP Reward
                  </span>
                </div>

                <h3 className="text-2xl font-black tracking-tight mt-1">
                  {selectedBadgeProgress.badge.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm leading-relaxed">
                  {selectedBadgeProgress.badge.description}
                </p>

                {/* Status Box */}
                <div className="w-full mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-left">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-zinc-600 dark:text-zinc-300">Unlock Condition:</span>
                    <span
                      className={`font-mono ${
                        selectedBadgeProgress.isUnlocked ? 'text-emerald-500' : 'text-zinc-400'
                      }`}
                    >
                      {selectedBadgeProgress.completedCount} / {selectedBadgeProgress.totalCount} completed
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Associated Topic:{' '}
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      {selectedBadgeProgress.badge.courseTitle}
                    </strong>
                  </p>

                  <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedBadgeProgress.isUnlocked
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-amber-400 to-[#FF533D]'
                      }`}
                      style={{ width: `${selectedBadgeProgress.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full mt-6">
                  <button
                    onClick={() => setSelectedBadgeProgress(null)}
                    className="flex-1 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      const courseId = selectedBadgeProgress.badge.courseId;
                      setSelectedBadgeProgress(null);
                      if (courseId && onLaunchQuiz) {
                        onLaunchQuiz(courseId);
                      }
                    }}
                    className="flex-1 py-3 rounded-2xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {selectedBadgeProgress.isUnlocked ? 'Practice Again' : 'Take Topic Quiz'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
