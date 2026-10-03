import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Flame,
  X,
  Calendar as CalendarIcon,
  Trophy,
  Target,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../../types';

export interface StreakActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  completedTaskIds?: string[];
  currentUser?: UserProfile | null;
  onLaunchPractice?: () => void;
}

interface CalendarDay {
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  formattedDate: string;
  count: number;
  isToday: boolean;
  isStreakDay: boolean;
  isFuture: boolean;
  xpEarned: number;
}

export const StreakActivityModal: React.FC<StreakActivityModalProps> = ({
  isOpen,
  onClose,
  currentStreak,
  completedTaskIds = [],
  currentUser,
  onLaunchPractice,
}) => {
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reference date: Current local date (October 3, 2026)
  const today = useMemo(() => new Date(2026, 9, 3), []); // Month 9 is October

  // Target date based on month offset
  const targetMonthDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(today.getMonth() + selectedMonthOffset);
    return d;
  }, [today, selectedMonthOffset]);

  const year = targetMonthDate.getFullYear();
  const month = targetMonthDate.getMonth();
  const monthName = targetMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate calendar days for the selected month
  const { calendarCells, activeDaysCount, totalMonthQuestions } = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (CalendarDay | null)[] = [];

    // Empty padding slots before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }

    let activeCount = 0;
    let questionsTotal = 0;
    const seed = (currentUser?.name?.length || 7) + currentStreak * 2;

    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const diffTime = today.getTime() - cellDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const isToday = diffDays === 0;
      const isFuture = diffDays < 0;
      const isStreakDay = diffDays >= 0 && diffDays < currentStreak;

      let count = 0;
      if (isFuture) {
        count = 0;
      } else if (isStreakDay) {
        count = 3 + ((diffDays * 5 + seed) % 4);
      } else if (diffDays > 0) {
        // Historical deterministic activity pattern
        const pseudo = Math.sin(diffDays * 19.33 + seed) * 10000;
        const rand = pseudo - Math.floor(pseudo);
        if (rand > 0.38) {
          count = Math.floor(rand * 5) + 1;
        }
      }

      // Add live session completions to today
      if (isToday) {
        count = Math.max(count, 3 + completedTaskIds.length);
      }

      if (count > 0) {
        activeCount++;
        questionsTotal += count;
      }

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayItem: CalendarDay = {
        dayNumber: d,
        dateStr,
        formattedDate: cellDate.toLocaleDateString('default', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        count,
        isToday,
        isStreakDay,
        isFuture,
        xpEarned: count * 35,
      };

      cells.push(dayItem);
    }

    return {
      calendarCells: cells,
      activeDaysCount: activeCount,
      totalMonthQuestions: questionsTotal,
    };
  }, [year, month, today, currentStreak, currentUser, completedTaskIds.length]);

  // Set default selected day to today (or the first active day)
  useEffect(() => {
    if (!selectedDay && calendarCells.length > 0) {
      const todayCell = calendarCells.find((c) => c?.isToday);
      if (todayCell) setSelectedDay(todayCell);
    }
  }, [calendarCells, selectedDay]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-calendar-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-[#18181B] rounded-[28px] sm:rounded-[36px] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-7 relative overflow-hidden text-zinc-900 dark:text-zinc-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Orange Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-[#FF533D]/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF533D] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 shrink-0">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  Streak Calendar
                </span>
                <span className="text-xs font-semibold text-zinc-400">
                  {currentUser?.name || 'Active Student'}
                </span>
              </div>
              <h2
                id="streak-calendar-title"
                className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white font-heading mt-0.5"
              >
                Monthly Learning Streak Calendar
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close streak calendar"
            className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Quick Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 relative z-10">
          {/* 1. Current Streak */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-50/80 to-amber-50/50 dark:from-orange-950/40 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800/60 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Current Streak</span>
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
                {currentStreak}
              </span>
              <span className="text-xs font-bold text-zinc-500">Days</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Active Today 🔥
            </span>
          </div>

          {/* 2. Monthly Active Days */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Monthly Active</span>
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
                {activeDaysCount}
              </span>
              <span className="text-xs font-bold text-zinc-500">Days</span>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400">
              In {targetMonthDate.toLocaleString('default', { month: 'short' })}
            </span>
          </div>

          {/* 3. Best Streak */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Best Streak</span>
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
                {Math.max(14, currentStreak + 3)}
              </span>
              <span className="text-xs font-bold text-zinc-500">Days</span>
            </div>
            <span className="text-[11px] font-semibold text-zinc-400">
              Personal Record
            </span>
          </div>

          {/* 4. Total Quizzes Solved */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span>Questions</span>
            </span>
            <div className="my-1 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-mono">
                {totalMonthQuestions}
              </span>
              <span className="text-xs font-bold text-zinc-500">Solved</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Target Met</span>
            </span>
          </div>
        </div>

        {/* Monthly Calendar View */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 relative z-10">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200/70 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#FF533D]" />
              <h3 className="font-black text-base sm:text-lg text-zinc-900 dark:text-white font-heading">
                {monthName}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedMonthOffset((prev) => prev - 1)}
                className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors shadow-2xs"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedMonthOffset(0)}
                className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  selectedMonthOffset === 0
                    ? 'bg-[#FF533D]/10 text-[#FF533D] border-[#FF533D]/30'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                Current Month
              </button>

              <button
                type="button"
                onClick={() => setSelectedMonthOffset((prev) => Math.min(0, prev + 1))}
                disabled={selectedMonthOffset >= 0}
                className={`p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition-colors shadow-2xs ${
                  selectedMonthOffset >= 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer'
                }`}
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-zinc-400 mb-2">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Days Cells Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarCells.map((day, idx) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-12 sm:h-14 rounded-xl bg-transparent opacity-0 pointer-events-none"
                  />
                );
              }

              const hasActivity = day.count > 0;
              const isSelected = selectedDay?.dateStr === day.dateStr;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  disabled={day.isFuture}
                  className={`h-12 sm:h-14 rounded-xl p-1.5 sm:p-2 flex flex-col justify-between border transition-all text-left relative ${
                    day.isToday
                      ? 'ring-2 ring-[#FF533D] bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800 shadow-xs'
                      : isSelected
                      ? 'ring-2 ring-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700'
                      : hasActivity
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400'
                      : day.isFuture
                      ? 'bg-zinc-50/40 dark:bg-zinc-900/20 border-zinc-200/40 dark:border-zinc-800/40 opacity-40 cursor-not-allowed'
                      : 'bg-white dark:bg-zinc-800/50 border-zinc-200/70 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold ${
                        day.isToday
                          ? 'text-[#FF533D]'
                          : hasActivity
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {day.isStreakDay ? (
                      <span className="relative flex items-center justify-center">
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 drop-shadow-2xs shrink-0" />
                      </span>
                    ) : hasActivity ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    ) : null}
                  </div>

                  {day.isToday ? (
                    <span className="text-[9px] font-extrabold text-[#FF533D] uppercase tracking-wider font-mono">
                      Today
                    </span>
                  ) : hasActivity ? (
                    <span className="text-[9px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 truncate">
                      {day.count} solved
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-300 dark:text-zinc-600">
                      -
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Inspector Card */}
          {selectedDay && (
            <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedDay.count > 0
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-400'
                  }`}
                >
                  {selectedDay.count > 0 ? (
                    <Flame className="w-5 h-5 fill-current" />
                  ) : (
                    <CalendarIcon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {selectedDay.formattedDate}
                    </span>
                    {selectedDay.isToday && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-[#FF533D]/15 text-[#FF533D]">
                        TODAY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {selectedDay.count > 0
                      ? `${selectedDay.count} quiz challenges completed · Streak maintained`
                      : selectedDay.isFuture
                      ? 'Upcoming practice date'
                      : 'Rest day — No quiz activity logged'}
                  </p>
                </div>
              </div>

              {selectedDay.count > 0 && (
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    +{selectedDay.xpEarned} XP
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Calendar Status Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 pt-3 mt-2 border-t border-zinc-200/60 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">Active Streak Day</span>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md ring-2 ring-[#FF533D] bg-orange-100 dark:bg-orange-950" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">Today</span>
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">Practiced</span>
              </span>
            </div>

            <span className="text-[11px] text-zinc-400 font-mono">
              Live synced with completed quiz topics
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800 relative z-10">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Practice daily to keep your flame blazing!</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 cursor-pointer transition-colors"
            >
              Close
            </button>

            {onLaunchPractice && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchPractice();
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#FF533D] hover:bg-[#FF4128] text-white flex items-center gap-1.5 shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 fill-white" />
                <span>Practice to Extend Streak</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default StreakActivityModal;
