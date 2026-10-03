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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../common/Avatar';
import { MascotRobot } from '../common/MascotRobot';
import { BusinessAnalyticsIllustration } from '../common/BusinessAnalyticsIllustration';
import { quizQuestions, scheduleItems, mobileUser } from '../../data/mockData';

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

  // Schedule state
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [progressToday, setProgressToday] = useState<number>(58);

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
      {/* Top Header: Len Avatar + Hello Len + Reading Bar + Bell */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <Avatar name="Len" variant="len" size="md" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">Hello Len</span>
            {/* Small book icon & pink reading bar from screenshot */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-pink-500">📖</span>
              <div className="w-16 h-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 overflow-hidden">
                <div className="w-3/5 h-full bg-pink-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bell Button */}
        <button className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center relative shadow-xs">
          <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
      </div>

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

      {/* My Schedule Title & Timeline */}
      <div className="flex items-center justify-between mt-2 mb-1">
        <h3 className="text-lg font-black text-zinc-950 dark:text-white font-heading">
          My Schedule
        </h3>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Timeline (8:00, 10:00, 12:00) */}
      <div className="flex flex-col gap-3 my-2 text-xs">
        {/* 8:00 Slot */}
        <div className="flex items-start gap-3">
          <span className="w-10 text-zinc-400 font-mono text-[11px] pt-1">8:00</span>
          <div className="flex-1 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF9C3] text-amber-900 border border-amber-200 shadow-xs">
              <span className="text-xs">✏️</span>
              <span className="font-bold">Writing</span>
              <span className="text-[10px] text-amber-700 font-mono">8:00-8:30</span>
              <ExternalLink className="w-3 h-3 text-amber-700 ml-1" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FCE7F3] text-pink-900 border border-pink-200 shadow-xs">
              <span className="text-xs">📐</span>
              <span className="font-bold">Math</span>
              <span className="text-[10px] text-pink-700 font-mono">8:30-9:00</span>
              <ExternalLink className="w-3 h-3 text-pink-700 ml-1" />
            </div>
          </div>
        </div>

        {/* 10:00 Slot */}
        <div className="flex items-start gap-3">
          <span className="w-10 text-zinc-400 font-mono text-[11px] pt-1">10:00</span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-purple-900 border border-purple-200 shadow-xs">
              <span className="text-xs">🧪</span>
              <span className="font-bold">Chemistry</span>
              <span className="text-[10px] text-purple-700 font-mono">10:00-10:30</span>
              <ExternalLink className="w-3 h-3 text-purple-700 ml-1" />
            </div>
          </div>
        </div>

        {/* 12:00 Slot */}
        <div className="flex items-start gap-3">
          <span className="w-10 text-zinc-400 font-mono text-[11px] pt-1">12:00</span>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFEDD5] text-orange-900 border border-orange-200 shadow-xs">
              <span className="text-xs">💻</span>
              <span className="font-bold">Developing</span>
              <span className="text-[10px] text-orange-700 font-mono">12:00-12:30</span>
              <ExternalLink className="w-3 h-3 text-orange-700 ml-1" />
            </div>
          </div>
        </div>
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
    <div className="flex-1 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] max-w-7xl mx-auto w-full">
      {/* Sub-header controls for mobile companion preview */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {onBackToDesktop && (
            <button
              onClick={onBackToDesktop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Learnify Web</span>
            </button>
          )}
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span>Len's Mobile Companion App</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 font-semibold">
              Live Preview
            </span>
          </h2>
        </div>

        {/* View Style Switcher: Single Interactive Phone vs All Three Side-by-Side */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setViewStyle('single-phone')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewStyle === 'single-phone'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Phone</span>
          </button>

          <button
            onClick={() => setViewStyle('all-three')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              viewStyle === 'all-three'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3 Screens (Side-by-Side)</span>
          </button>
        </div>
      </div>

      {/* Screen Render Mode */}
      {viewStyle === 'single-phone' ? (
        <div className="flex flex-col items-center">
          {/* Navigation Pill tabs between the 3 mobile screens */}
          <div className="flex items-center gap-2 mb-4 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-full border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveMobileScreen('dashboard')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMobileScreen === 'dashboard'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              1. Dashboard
            </button>
            <button
              onClick={() => setActiveMobileScreen('quiz')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMobileScreen === 'quiz'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              2. Interactive Quiz
            </button>
            <button
              onClick={() => setActiveMobileScreen('schedule')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMobileScreen === 'schedule'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              3. Schedule
            </button>
          </div>

          {/* Physical Phone Mockup Container */}
          <div className="relative w-[340px] sm:w-[380px] h-[720px] rounded-[48px] bg-zinc-900 p-3 shadow-2xl border-4 border-zinc-800">
            {/* Phone Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-40" />

            {/* Inner Screen */}
            <div className="w-full h-full rounded-[38px] overflow-hidden relative shadow-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMobileScreen}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  {activeMobileScreen === 'dashboard' && renderDashboardScreen()}
                  {activeMobileScreen === 'quiz' && renderQuizScreen()}
                  {activeMobileScreen === 'schedule' && renderScheduleScreen()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side 3 Screens Gallery matching Image 2 & 3 */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full justify-items-center py-4">
          {/* Screen 1: Dashboard */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-zinc-500 mb-2">Screen 1: Dashboard</span>
            <div className="w-[320px] sm:w-[360px] h-[680px] rounded-[44px] bg-zinc-900 p-2.5 shadow-2xl border-4 border-zinc-800">
              <div className="w-full h-full rounded-[34px] overflow-hidden relative shadow-inner">
                {renderDashboardScreen()}
              </div>
            </div>
          </div>

          {/* Screen 2: Interactive Quiz */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-zinc-500 mb-2">Screen 2: Interactive Quiz</span>
            <div className="w-[320px] sm:w-[360px] h-[680px] rounded-[44px] bg-zinc-900 p-2.5 shadow-2xl border-4 border-zinc-800">
              <div className="w-full h-full rounded-[34px] overflow-hidden relative shadow-inner">
                {renderQuizScreen()}
              </div>
            </div>
          </div>

          {/* Screen 3: Schedule */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-zinc-500 mb-2">Screen 3: Daily Schedule</span>
            <div className="w-[320px] sm:w-[360px] h-[680px] rounded-[44px] bg-zinc-900 p-2.5 shadow-2xl border-4 border-zinc-800">
              <div className="w-full h-full rounded-[34px] overflow-hidden relative shadow-inner">
                {renderScheduleScreen()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
