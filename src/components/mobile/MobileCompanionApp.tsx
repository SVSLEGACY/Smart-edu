import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  ChevronLeft,
  MoreHorizontal,
  Eye,
  EyeOff,
  ArrowRight,
  Calendar as CalendarIcon,
  ExternalLink,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Layers,
  Flame,
  Zap,
  X,
  GripVertical,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  Laptop,
  LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../common/Avatar';
import { ThemeToggle } from '../common/ThemeToggle';
import { MascotRobot } from '../common/MascotRobot';
import { BusinessAnalyticsIllustration } from '../common/BusinessAnalyticsIllustration';
import { quizQuestions, scheduleItems, mobileUser } from '../../data/mockData';
import { ScheduleItem } from '../../types';

interface MobileCompanionAppProps {
  onBackToDesktop?: () => void;
  initialScreen?: 'dashboard' | 'quiz' | 'schedule';
}

export const MobileCompanionApp: React.FC<MobileCompanionAppProps> = ({
  onBackToDesktop,
  initialScreen = 'dashboard',
}) => {
  const [activeMobileScreen, setActiveMobileScreen] = useState<'dashboard' | 'quiz' | 'schedule'>(
    initialScreen
  );
  const [viewStyle, setViewStyle] = useState<'single-phone' | 'all-three'>('single-phone');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswerHint, setShowAnswerHint] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [activeSubject, setActiveSubject] = useState('Geographic');
  const [mascotStatus, setMascotStatus] = useState<'idle' | 'celebrating' | 'thinking'>('idle');

  // Schedule state & Reorderable List (Persisted in Local Storage)
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [progressToday, setProgressToday] = useState<number>(58);

  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('learnify-schedule-tasks');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Error loading schedule from localStorage', e);
        }
      }
    }
    return scheduleItems;
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [scheduleFeedbackToast, setScheduleFeedbackToast] = useState<string | null>(null);

  const saveScheduleToStorage = (newList: ScheduleItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('learnify-schedule-tasks', JSON.stringify(newList));
    }
    setScheduleFeedbackToast('✓ Schedule reordered and saved!');
    setTimeout(() => {
      setScheduleFeedbackToast(null);
    }, 2200);
  };

  const reorderScheduleTasks = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= scheduleList.length ||
      toIndex >= scheduleList.length
    )
      return;
    const updated = [...scheduleList];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setScheduleList(updated);
    saveScheduleToStorage(updated);
  };

  const moveTaskUp = (index: number) => {
    if (index > 0) reorderScheduleTasks(index, index - 1);
  };

  const moveTaskDown = (index: number) => {
    if (index < scheduleList.length - 1) reorderScheduleTasks(index, index + 1);
  };

  const resetScheduleToDefault = () => {
    setScheduleList(scheduleItems);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learnify-schedule-tasks');
    }
    setScheduleFeedbackToast('✓ Schedule reset to default!');
    setTimeout(() => {
      setScheduleFeedbackToast(null);
    }, 2200);
  };

  // Daily Streak State & Animation
  const [streakDays, setStreakDays] = useState<number>(7);
  const [isCheckingStreak, setIsCheckingStreak] = useState<boolean>(false);
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [streakToast, setStreakToast] = useState<string | null>(null);

  const handleCheckStreak = () => {
    setIsCheckingStreak(true);
    setStreakToast('🔥 Daily Streak Checked: 7 Days Active!');
    setTimeout(() => {
      setShowStreakModal(true);
      setIsCheckingStreak(false);
    }, 450);
  };

  // Timer simulation for quiz
  const [timeLeft, setTimeLeft] = useState<number>(381); // 6:21 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCheckAnswer = () => {
    const q = quizQuestions[currentQuizIndex];
    const cleaned = userAnswer.trim().toLowerCase();
    if (!cleaned) return;

    const isMatch = q.acceptableAnswers.some((ans) => cleaned.includes(ans) || ans.includes(cleaned));

    if (isMatch) {
      setQuizFeedback('correct');
      setMascotStatus('celebrating');
      setTimeout(() => {
        setMascotStatus('idle');
      }, 3000);
    } else {
      setQuizFeedback('incorrect');
      setMascotStatus('thinking');
      setTimeout(() => {
        setMascotStatus('idle');
      }, 2000);
    }
  };

  const handleNextQuiz = () => {
    setQuizFeedback('idle');
    setUserAnswer('');
    setShowAnswerHint(false);
    setCurrentQuizIndex((prev) => (prev + 1) % quizQuestions.length);
  };

  const handlePrevQuiz = () => {
    setQuizFeedback('idle');
    setUserAnswer('');
    setShowAnswerHint(false);
    setCurrentQuizIndex((prev) => (prev - 1 + quizQuestions.length) % quizQuestions.length);
  };

  // Render Mobile Dashboard (Screen 1 in Image 2/3)
  const renderDashboardScreen = () => (
    <div className="flex flex-col h-full bg-[#FBFBFC] dark:bg-[#18181B] text-zinc-900 dark:text-zinc-100 p-5 overflow-y-auto scrollbar-none select-none">
      {/* Top Header: Len Avatar + Hello Len + Reading Bar + Daily Streak + Bell */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <Avatar name="Len" variant="len" size="md" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">Hello Len</span>
            {/* Small book icon & pink reading bar, clickable to check progress */}
            <button
              onClick={handleCheckStreak}
              className="flex items-center gap-1.5 mt-0.5 group cursor-pointer text-left"
              title="Click to check your study streak"
            >
              <span className="text-[10px] text-pink-500 group-hover:scale-110 transition-transform">📖</span>
              <div className="w-14 h-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 overflow-hidden">
                <div className="w-3/5 h-full bg-pink-500 rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* Right Actions: Daily Streak Counter with Fire Icon + Bell */}
        <div className="flex items-center gap-2">
          {/* Daily Streak Counter Button */}
          <motion.button
            onClick={handleCheckStreak}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-rose-500/15 border border-orange-500/35 dark:border-orange-500/50 text-orange-600 dark:text-orange-400 font-bold text-xs shadow-xs hover:shadow-orange-500/20 transition-all cursor-pointer relative overflow-hidden group"
            title="Daily Streak: Click to check your progress"
          >
            {/* Fire Icon with pulse and click animation */}
            <motion.div
              animate={
                isCheckingStreak
                  ? {
                      scale: [1, 1.5, 0.85, 1.3, 1],
                      rotate: [0, -18, 18, -10, 0],
                      filter: [
                        'drop-shadow(0 0 2px rgba(249,115,22,0.4))',
                        'drop-shadow(0 0 10px rgba(239,68,68,0.9))',
                        'drop-shadow(0 0 4px rgba(249,115,22,0.5))',
                      ],
                    }
                  : {
                      scale: [1, 1.12, 1],
                    }
              }
              transition={
                isCheckingStreak
                  ? { duration: 0.7, ease: 'easeOut' }
                  : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
              }
              className="flex items-center justify-center shrink-0"
            >
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 group-hover:scale-110 transition-transform drop-shadow-[0_1px_3px_rgba(249,115,22,0.4)]" />
            </motion.div>
            <span className="font-heading font-black tabular-nums text-zinc-950 dark:text-white">
              {streakDays}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Streak
            </span>

            {/* Glowing ripple burst when checking progress */}
            {isCheckingStreak && (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-orange-400/40 rounded-full pointer-events-none"
              />
            )}
          </motion.button>

          {/* Bell Button */}
          <button className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center relative shadow-xs shrink-0 cursor-pointer">
            <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
          </button>
        </div>
      </div>

      {/* Daily Streak Motivational Encouragement Banner */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={handleCheckStreak}
        className="mb-2 p-2.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200/70 dark:border-orange-500/20 flex items-center justify-between cursor-pointer group hover:bg-orange-500/15 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-xl bg-orange-500/20 dark:bg-orange-500/30 flex items-center justify-center text-orange-500 shrink-0"
          >
            <Flame className="w-4 h-4 fill-orange-500" />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-white">Daily Study Streak</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 font-extrabold">
                {streakDays} Days 🔥
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Tap to check your progress & boost habits
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-orange-500 group-hover:translate-x-0.5 transition-transform shrink-0">
          Check →
        </span>
      </motion.div>

      {/* Main Title: Dashboard */}
      <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white my-2 font-heading">
        Dashboard
      </h2>

      {/* Top Stats Cards: 5 Certificates & 12 Courses */}
      <div className="grid grid-cols-2 gap-3.5 my-3">
        {/* Certificates Card (Pale Green) */}
        <div className="p-4 rounded-3xl bg-[#EAF7EE] dark:bg-[#162B1E] border border-[#D1F0D9] dark:border-[#1E432B] flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            {/* Circular mini gauge */}
            <div className="relative w-8 h-8 rounded-full border-2 border-emerald-400 border-t-emerald-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-emerald-200 font-heading">
              5
            </span>
            <p className="text-xs font-semibold text-zinc-600 dark:text-emerald-400/80 mt-0.5">
              Certificates
            </p>
          </div>
        </div>

        {/* Courses Card (Pale Peach/Beige) */}
        <div className="p-4 rounded-3xl bg-[#FDF4E7] dark:bg-[#322513] border border-[#FAE5C7] dark:border-[#4E391C] flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            {/* Circular mini gauge */}
            <div className="relative w-8 h-8 rounded-full border-2 border-amber-400 border-t-amber-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-amber-200 font-heading">
              12
            </span>
            <p className="text-xs font-semibold text-zinc-600 dark:text-amber-400/80 mt-0.5">Courses</p>
          </div>
        </div>
      </div>

      {/* Search Input matching screenshot */}
      <div className="my-2">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/70 dark:border-zinc-700 text-xs text-zinc-400">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Featured Card: Business Analytics (Pink card with illustration & 78%) */}
      <div
        onClick={() => setActiveMobileScreen('quiz')}
        className="mt-3 p-4 rounded-3xl bg-[#FFDEE9] dark:bg-[#3D1E2C] border border-[#FFCADC] dark:border-[#5E2B43] flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
      >
        <div className="flex items-start justify-between z-10">
          <div>
            <h3 className="text-lg font-black text-zinc-950 dark:text-pink-100 font-heading leading-tight">
              Business Analytics
            </h3>
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-pink-300">
              37/40 Places
            </span>
          </div>

          {/* 78% Circular Progress Badge from screenshot */}
          <div className="w-12 h-12 rounded-full bg-zinc-950 text-white flex flex-col items-center justify-center font-bold text-xs shadow-md border-2 border-pink-400">
            <span>78%</span>
          </div>
        </div>

        {/* Avatars Stack */}
        <div className="z-10 mt-2">
          <div className="flex items-center -space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-400 border border-white text-[9px] flex items-center justify-center font-bold">
              J
            </span>
            <span className="w-5 h-5 rounded-full bg-rose-400 border border-white text-[9px] flex items-center justify-center font-bold">
              M
            </span>
            <span className="w-5 h-5 rounded-full bg-cyan-400 border border-white text-[9px] flex items-center justify-center font-bold">
              S
            </span>
            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white border border-white text-[8px] flex items-center justify-center font-bold">
              +33
            </span>
          </div>
        </div>

        {/* Illustration of Person & Pie Chart with Green Splash */}
        <BusinessAnalyticsIllustration />

        {/* Author Footer */}
        <div className="mt-1 pt-1 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-pink-200">
          <span>By John Paul</span>
          <span className="text-pink-600 dark:text-pink-400 text-[11px] flex items-center gap-1 font-bold">
            Start Quiz →
          </span>
        </div>
      </div>

      {/* Second Card: Motion Design */}
      <div
        onClick={() => setActiveMobileScreen('schedule')}
        className="mt-3 p-4 rounded-3xl bg-[#D6EFFF] dark:bg-[#132A3E] border border-[#BCE1FD] dark:border-[#1E4362] flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
      >
        <div>
          <h3 className="text-base font-black text-zinc-950 dark:text-sky-100 font-heading">
            Motion Design
          </h3>
          <span className="text-[11px] font-semibold text-zinc-600 dark:text-sky-300">
            View Schedule
          </span>
        </div>
        <div className="w-11 h-11 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-sky-400">
          78%
        </div>
      </div>
    </div>
  );

  // Render Mobile Quiz (Screen 2 in Image 2/3)
  const currentQuiz = quizQuestions[currentQuizIndex];

  const renderQuizScreen = () => (
    <div className="flex flex-col h-full bg-[#FCEBF2] dark:bg-[#1D141C] text-zinc-900 dark:text-zinc-100 p-5 overflow-y-auto scrollbar-none select-none justify-between">
      {/* Top Header: Back Arrow + Timer Capsule 6:21 + Dots Menu */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveMobileScreen('dashboard')}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
        </button>

        {/* 6:21 Live Timer Capsule from Screenshot */}
        <div className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white tracking-wider">
            {formatTimer(timeLeft)}
          </span>
        </div>

        <button
          onClick={() => setShowAnswerHint(!showAnswerHint)}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center cursor-pointer shadow-xs"
          title="Hint / Options"
        >
          <MoreHorizontal className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
        </button>
      </div>

      {/* Progress Line: Progress 78% */}
      <div className="my-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
          <span>Progress</span>
          <span className="font-mono tabular-nums">{currentQuiz.progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentQuiz.progressPercent}%` }}
            className="h-full bg-zinc-950 dark:bg-white rounded-full"
          />
        </div>
      </div>

      {/* Center Interactive Robot Mascot with Floating Badges */}
      <div className="my-1 flex items-center justify-center">
        <MascotRobot
          status={mascotStatus}
          size={180}
          onItemClick={(item) => {
            if (item === 'chemistry') setActiveSubject('Chemistry');
            if (item === 'math') setActiveSubject('Math');
            if (item === 'writing') setActiveSubject('Writing');
          }}
        />
      </div>

      {/* Subject Filter Pills (Geographic, Chemistry, Math, Writing, Developing) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {['Geographic', 'Chemistry', 'Math', 'Writing', 'Developing'].map((subj) => {
          const isActive = activeSubject === subj;
          return (
            <button
              key={subj}
              onClick={() => setActiveSubject(subj)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {subj}
            </button>
          );
        })}
      </div>

      {/* Question Prompt Card */}
      <div className="my-2">
        <h3 className="text-base font-extrabold text-zinc-950 dark:text-white font-heading leading-snug">
          {currentQuiz.question}
        </h3>

        {/* Hint banner if toggled */}
        {showAnswerHint && (
          <div className="mt-2 p-2 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs">
            💡 Hint: {currentQuiz.hint}
          </div>
        )}
      </div>

      {/* Input Field: "Type your answer.." with Eye Icon */}
      <div className="relative my-2">
        <div className="flex items-center bg-white dark:bg-zinc-800 rounded-full pl-4 pr-3 py-2.5 border border-zinc-300/80 dark:border-zinc-700 focus-within:border-zinc-950 dark:focus-within:border-white shadow-xs">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
            placeholder="Type your answer.."
            className="w-full bg-transparent text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden"
          />
          <button
            onClick={() => setShowAnswerHint(!showAnswerHint)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
            title="Toggle hint"
          >
            {showAnswerHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Feedback message */}
        {quizFeedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 px-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Spot on! That border is verified. (+50 XP)</span>
          </motion.div>
        )}
        {quizFeedback === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 px-2"
          >
            Try another neighbor! (e.g. France, Austria, Poland, Denmark...)
          </motion.div>
        )}
      </div>

      {/* Bottom Buttons: Back & Next -> (From screenshot) */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handlePrevQuiz}
          className="flex-1 py-3 rounded-full border border-zinc-950 dark:border-zinc-400 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={quizFeedback === 'correct' ? handleNextQuiz : handleCheckAnswer}
          className="flex-1 py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <span>{quizFeedback === 'correct' ? 'Next' : 'Check'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Render Mobile Schedule (Screen 3 in Image 2/3)
  const renderScheduleScreen = () => (
    <div className="flex flex-col h-full bg-[#FBFBFC] dark:bg-[#18181B] text-zinc-900 dark:text-zinc-100 p-5 overflow-y-auto scrollbar-none select-none">
      {/* Top Header: Back + Calendar + Bell + Len Avatar */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={() => setActiveMobileScreen('dashboard')}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </button>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-xs">
            <CalendarIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-xs">
            <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </button>
          <Avatar name="Len" variant="len" size="sm" />
        </div>
      </div>

      {/* Top Card: "Learnings today: 58% / 28min" (Matching Screenshot 3) */}
      <div className="p-4 rounded-3xl bg-[#FBF3E8] dark:bg-[#2C2114] border border-[#F3DFC7] dark:border-[#463420] flex flex-col justify-between my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
            <span>📖</span>
            <span>Learnings today</span>
          </div>
          <button
            onClick={() => setProgressToday((prev) => Math.min(100, prev + 10))}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-xs hover:scale-105 transition-transform cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
          </button>
        </div>

        <div className="mt-3">
          <span className="text-2xl font-black text-zinc-950 dark:text-white font-heading">
            {progressToday}% / 28min
          </span>

          {/* Interactive Progress Slider */}
          <div className="mt-2.5 relative w-full h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full bg-zinc-950 dark:bg-white rounded-full transition-all duration-300"
              style={{ width: `${progressToday}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekday strip: S 13, M 14 (active black filled circle), T 15, W 16, T 17 */}
      <div className="grid grid-cols-5 gap-2 my-3">
        {[
          { day: 'S', date: 13 },
          { day: 'M', date: 14 },
          { day: 'T', date: 15 },
          { day: 'W', date: 16 },
          { day: 'T', date: 17 },
        ].map((item) => {
          const isSelected = selectedDay === item.date;
          return (
            <button
              key={item.date}
              onClick={() => setSelectedDay(item.date)}
              className={`flex flex-col items-center justify-center py-2.5 rounded-full transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md scale-105'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <span className="text-[10px] font-medium opacity-80">{item.day}</span>
              <span className="text-sm font-bold font-mono">{item.date}</span>
            </button>
          );
        })}
      </div>

      {/* My Schedule Title & Drag-and-Drop Action Header */}
      <div className="flex items-center justify-between mt-3 mb-1.5">
        <div>
          <h3 className="text-base font-black text-zinc-950 dark:text-white font-heading">
            My Schedule
          </h3>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            Drag cards or tap ↑↓ to reorder
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetScheduleToDefault}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            title="Reset schedule to default order"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Reorderable Task List */}
      <div className="flex flex-col gap-2 my-1.5">
        {scheduleList.map((task, index) => {
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={task.id}
              draggable={true}
              onDragStart={(e: React.DragEvent) => {
                e.dataTransfer.setData('text/plain', index.toString());
                e.dataTransfer.effectAllowed = 'move';
                setDraggedIndex(index);
              }}
              onDragOver={(e: React.DragEvent) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverIndex !== index) {
                  setDragOverIndex(index);
                }
              }}
              onDragLeave={() => {
                if (dragOverIndex === index) setDragOverIndex(null);
              }}
              onDrop={(e: React.DragEvent) => {
                e.preventDefault();
                const sourceIdxStr = e.dataTransfer.getData('text/plain');
                const sourceIdx = sourceIdxStr ? parseInt(sourceIdxStr, 10) : draggedIndex;
                if (sourceIdx !== null && sourceIdx !== undefined && sourceIdx !== index && !isNaN(sourceIdx)) {
                  reorderScheduleTasks(sourceIdx, index);
                }
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`relative p-2.5 rounded-2xl border transition-all duration-200 select-none ${
                isDragging
                  ? 'opacity-35 scale-95 border-dashed border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                  : isOver
                  ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 scale-[1.02] shadow-md ring-2 ring-orange-500/20'
                  : 'border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {/* Left: Drag Handle, Time, and Subject Pill */}
                <div className="flex items-center gap-2 min-w-0">
                  {/* Grip Vertical Drag Handle */}
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition-colors shrink-0"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  {/* Time slot */}
                  <span className="text-[11px] font-mono font-bold text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0">
                    {task.timeSlot}
                  </span>

                  {/* Subject badge */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 shadow-xs border ${task.colorClass} ${task.darkColorClass}`}
                  >
                    <span>{task.icon || '📚'}</span>
                    <span>{task.subject}</span>
                  </div>
                </div>

                {/* Right: Time Range + Touch Up/Down Reorder Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 tabular-nums hidden xs:inline">
                    {task.timeRange}
                  </span>

                  <div className="flex items-center bg-zinc-100 dark:bg-zinc-700/60 rounded-lg p-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTaskUp(index);
                      }}
                      className="p-1 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-600 transition-colors cursor-pointer"
                      title="Move task earlier in day"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === scheduleList.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTaskDown(index);
                      }}
                      className="p-1 rounded text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-zinc-600 transition-colors cursor-pointer"
                      title="Move task later in day"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Note / Subtitle */}
              {task.note && (
                <div className="pl-6 pt-1 text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {task.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Quick Cards: Developing 15 min & Math 12 min */}
      <div className="flex flex-col gap-2 mt-auto pt-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
              🚀
            </div>
            <div>
              <h5 className="text-xs font-bold text-zinc-900 dark:text-white">Developing</h5>
              <span className="text-[10px] text-zinc-400">15 min quick sprint</span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-400" />
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-xs">
              📐
            </div>
            <div>
              <h5 className="text-xs font-bold text-zinc-900 dark:text-white">Math</h5>
              <span className="text-[10px] text-zinc-400">12 min geometry review</span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-[#18181B] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between w-full max-w-lg mx-auto sm:border-x border-zinc-200/80 dark:border-zinc-800 shadow-2xl relative transition-colors duration-200">
      {/* Top Mobile Bar */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/80 bg-white/85 dark:bg-[#18181B]/85 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-[#FF533D]">Learn</span>
            <span className="text-zinc-900 dark:text-white">ify</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
            Mobile
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {onBackToDesktop && (
            <button
              onClick={onBackToDesktop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Switch to Desktop / Tablet view"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xs:inline">Desktop</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col pb-20">
        <AnimatePresence mode="wait">
          {activeMobileScreen === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="flex-1"
            >
              {renderDashboardScreen()}
            </motion.div>
          )}

          {activeMobileScreen === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="flex-1"
            >
              {renderQuizScreen()}
            </motion.div>
          )}

          {activeMobileScreen === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="flex-1"
            >
              {renderScheduleScreen()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 max-w-lg mx-auto bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800 py-2 px-6 flex items-center justify-around z-40 shadow-lg">
        <button
          onClick={() => setActiveMobileScreen('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeMobileScreen === 'dashboard'
              ? 'text-[#FF533D] font-bold'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              activeMobileScreen === 'dashboard' ? 'bg-orange-100 dark:bg-orange-950/60 scale-105' : ''
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveMobileScreen('quiz')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeMobileScreen === 'quiz'
              ? 'text-[#FF533D] font-bold'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              activeMobileScreen === 'quiz' ? 'bg-orange-100 dark:bg-orange-950/60 scale-105' : ''
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Practice</span>
        </button>

        <button
          onClick={() => setActiveMobileScreen('schedule')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeMobileScreen === 'schedule'
              ? 'text-[#FF533D] font-bold'
              : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              activeMobileScreen === 'schedule' ? 'bg-orange-100 dark:bg-orange-950/60 scale-105' : ''
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Schedule</span>
        </button>
      </nav>

      {/* Toast Notification for Schedule Reorder */}
      <AnimatePresence>
        {scheduleFeedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold shadow-xl flex items-center gap-2 border border-zinc-800 dark:border-zinc-200"
          >
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{scheduleFeedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification for Streak Check */}
      <AnimatePresence>
        {streakToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onAnimationComplete={() => {
              setTimeout(() => setStreakToast(null), 2200);
            }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold shadow-xl flex items-center gap-2 border border-zinc-800 dark:border-zinc-200"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>{streakToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Streak Celebration & Progress Modal */}
      <AnimatePresence>
        {showStreakModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl overflow-hidden text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStreakModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glowing Background Radial */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent pointer-events-none" />

              {/* Animated Big Flame Mascot with Pulsing Glow */}
              <div className="relative my-3 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500/30 to-amber-400/40 blur-xl"
                />

                <motion.div
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [-3, 3, -3],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/40 relative z-10"
                >
                  <Flame className="w-10 h-10 fill-white text-white drop-shadow-md" />
                </motion.div>
              </div>

              {/* Title & Streak Counter */}
              <h3 className="text-2xl font-black text-zinc-950 dark:text-white font-heading tracking-tight mt-3">
                {streakDays} Day Streak!
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
                Consistency is your superpower! You've checked in and studied 7 days in a row.
              </p>

              {/* 7-Day Weekly Streak Strip */}
              <div className="mt-5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2 text-left px-1">
                  This Week's Study Habit
                </span>
                <div className="grid grid-cols-7 gap-1.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                        <Flame className="w-4 h-4 fill-white" />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-left">
                <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/40">
                  <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 text-xs font-bold">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>+50 Daily XP</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 block">
                    Streak bonus claimed
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>Next Milestone</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 block">
                    10 Days (3 days left)
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setShowStreakModal(false);
                  setActiveMobileScreen('quiz');
                }}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Keep Learning Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
