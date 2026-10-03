import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Flame,
  Layers,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../../types';
import {
  registeredStudents,
  authenticateStudentCredentials,
  saveStudentSession,
} from '../../data/studentAccounts';
import { ThemeToggle } from '../common/ThemeToggle';

interface StudentLoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!rollNumber.trim()) {
      setErrorMessage('Please enter your Student Roll Number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Brief simulation for smooth natural feel
    setTimeout(() => {
      const result = authenticateStudentCredentials(rollNumber, password);

      if (result.success && result.user) {
        saveStudentSession(result.user, rememberMe);
        setIsLoading(false);
        onLoginSuccess(result.user);
      } else {
        setIsLoading(false);
        setErrorMessage(result.error || 'Invalid credentials. Please verify your Roll Number.');
      }
    }, 350);
  };

  const handleQuickFill = (demoRoll: string, demoPass: string) => {
    setRollNumber(demoRoll);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121214] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between font-sans transition-colors duration-300 antialiased overflow-x-hidden relative selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black tracking-tight text-lg shadow-sm">
            RE
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight select-none">
              <span className="text-[#FF533D]">RE:</span>
              <span className="text-zinc-900 dark:text-white">LEARN</span>
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Python Student Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Academic Portal Live</span>
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Overview (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 w-fit">
              <GraduationCap className="w-4 h-4" />
              <span>Student Authentication</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight font-heading">
                Master Python with Diagnostic Intelligence.
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                Log in with your university or cohort Roll Number to access your course progress, interactive
                topic quizzes, and student learning streaks.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                    Trackable Course Mastery
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Every solved question and quiz credits lessons directly into your course record.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                    Adaptive Misconception Lab
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Diagnoses specific conceptual blindspots like off-by-one stops and mutable defaults.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                    Interactive Python Topics
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Full video lectures, homework prompts, cheatsheets, and dynamic code playgrounds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md bg-white dark:bg-[#1E1E22] rounded-3xl p-7 sm:p-9 border border-zinc-200/90 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-black/40 flex flex-col gap-6"
            >
              {/* Card Header */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Student Login
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Academic Year 2026
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
                  Sign in to your account
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Enter your registered student credentials to continue to the learning dashboard.
                </p>
              </div>

              {/* Error Message Alert */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Roll Number Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="rollNumber"
                    className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                  >
                    <span>Student Roll Number</span>
                    <span className="text-[10px] font-normal text-zinc-400">Format: PY-2026-XXX</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <input
                      id="rollNumber"
                      type="text"
                      value={rollNumber}
                      onChange={(e) => {
                        setRollNumber(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="e.g. PY-2026-042"
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF533D]/30 focus:border-[#FF533D] transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between"
                  >
                    <span>Student Password</span>
                    <span className="text-[10px] font-normal text-zinc-400">Min. 4 characters</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF533D]/30 focus:border-[#FF533D] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md border-zinc-300 text-[#FF533D] focus:ring-[#FF533D] dark:border-zinc-700 dark:bg-zinc-800 cursor-pointer accent-[#FF533D]"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      Remember on this workstation
                    </span>
                  </label>
                  <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#FF533D] hover:bg-[#FF4128] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/25 active:scale-98 cursor-pointer mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue to Python Courses</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill Demo Accounts */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Quick-Login Demo Students:
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Password: python123</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {registeredStudents.slice(0, 4).map((student) => (
                    <button
                      key={student.rollNumber}
                      type="button"
                      onClick={() => handleQuickFill(student.rollNumber, student.password)}
                      className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/60 text-left transition-colors cursor-pointer group flex flex-col"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {student.initials}
                        </span>
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-orange-500 transition-colors">
                          {student.name.split(' ')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                        {student.rollNumber}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Footer Notice */}
              <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500 leading-normal">
                Authorized student access only. Sessions are saved locally on your device for seamless course progression.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400 border-t border-zinc-200/60 dark:border-zinc-800/60 z-10">
        <span>© 2026 RE:LEARN Interactive Learning Systems. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="hover:underline cursor-pointer">Student Honor Code</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Privacy & Terms</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Support Desk</span>
        </div>
      </footer>
    </div>
  );
};
