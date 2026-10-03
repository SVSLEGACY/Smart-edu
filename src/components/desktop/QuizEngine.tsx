import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  Flame,
  Check,
  Code2,
  Layers,
  ChevronRight,
  Play,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, TopicQuiz, TopicQuizQuestion } from '../../types';
import { pythonTopicQuizzes } from '../../data/pythonQuizzes';

export interface QuizEngineProps {
  courses: Course[];
  activeCourseId?: string;
  completedTaskIds?: string[];
  onCompleteTask?: (taskId: string, courseId?: string) => void;
  onSelectCourse?: (courseId: string) => void;
  onBack?: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  courses,
  activeCourseId,
  completedTaskIds = [],
  onCompleteTask,
  onSelectCourse,
  onBack,
}) => {
  // Topic selection
  const allTopicKeys = Object.keys(pythonTopicQuizzes);
  const initialTopicKey =
    activeCourseId && pythonTopicQuizzes[activeCourseId]
      ? activeCourseId
      : allTopicKeys[0];

  const [selectedTopicKey, setSelectedTopicKey] = useState<string>(initialTopicKey);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  // Active quiz & course
  const currentQuiz: TopicQuiz =
    pythonTopicQuizzes[selectedTopicKey] || pythonTopicQuizzes[allTopicKeys[0]];
  const activeCourse: Course | undefined = courses.find((c) => c.id === selectedTopicKey);
  const currentQuestion: TopicQuizQuestion = currentQuiz.questions[currentQuestionIndex];

  // Sync when activeCourseId changes from props
  useEffect(() => {
    if (activeCourseId && pythonTopicQuizzes[activeCourseId]) {
      setSelectedTopicKey(activeCourseId);
      setCurrentQuestionIndex(0);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
      setShowHint(false);
      setIsQuizComplete(false);
    }
  }, [activeCourseId]);

  const handleSelectTopic = (topicKey: string) => {
    setSelectedTopicKey(topicKey);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setShowHint(false);
    setIsQuizComplete(false);
    setSessionScore(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOptionIndex(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      // Integrate with course progress tracking system
      if (onCompleteTask) {
        onCompleteTask(currentQuestion.id, currentQuiz.courseId);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
      setShowHint(false);
    } else {
      setIsQuizComplete(true);
      // Mark topic completion in progress system
      if (onCompleteTask) {
        onCompleteTask(`topic-complete-${currentQuiz.courseId}`, currentQuiz.courseId);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
      setShowHint(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setShowHint(false);
    setIsQuizComplete(false);
    setSessionScore(0);
  };

  // Find next topic key
  const currentTopicIndex = allTopicKeys.indexOf(selectedTopicKey);
  const nextTopicKey =
    currentTopicIndex + 1 < allTopicKeys.length ? allTopicKeys[currentTopicIndex + 1] : allTopicKeys[0];

  // Count how many questions in this topic have been solved in completedTaskIds
  const completedQuestionsInTopic = currentQuiz.questions.filter((q) =>
    completedTaskIds.includes(q.id)
  ).length;

  const isCurrentQuestionDoneBefore = completedTaskIds.includes(currentQuestion.id);

  // Course progress calculations
  const progressPercent = activeCourse
    ? Math.round((activeCourse.progressLessons / activeCourse.totalLessons) * 100)
    : 0;

  return (
    <div className="flex-1 p-5 sm:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back to dashboard"
              className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400">
                Adaptive Quiz Engine
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>Streak: {streak}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mt-1 font-heading">
              Python Topic Mastery Quizzes
            </h2>
          </div>
        </div>

        {/* Live Integrated Course Progress Card */}
        {activeCourse && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/90 dark:border-zinc-700 shadow-xs">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Course Track Progress
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-zinc-900 dark:text-white truncate max-w-[180px]">
                  {activeCourse.title}
                </span>
                <span className="font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <div className="w-16 h-2 rounded-full bg-zinc-100 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Python Topic Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allTopicKeys.map((key) => {
          const tq = pythonTopicQuizzes[key];
          const isSelected = selectedTopicKey === key;
          const completedCount = tq.questions.filter((q) => completedTaskIds.includes(q.id)).length;
          const isAllDone = completedCount === tq.questions.length;

          return (
            <button
              key={key}
              onClick={() => handleSelectTopic(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                  : 'bg-white dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <span>{tq.topicName}</span>
              {isAllDone ? (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              ) : (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {completedCount}/{tq.questions.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Quiz Area */}
      {!isQuizComplete ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question & Options Area (Left 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5 bg-white dark:bg-[#1E1E22] rounded-3xl p-6 sm:p-8 border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
            {/* Question Progress and Topic Info */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400">
                  Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Concept: {currentQuestion.concept}
                </span>
              </div>

              {isCurrentQuestionDoneBefore && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mastered</span>
                </span>
              )}
            </div>

            {/* Stepper Bar */}
            <div className="w-full grid grid-cols-4 gap-1.5 h-1.5">
              {currentQuiz.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isDone = completedTaskIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'bg-orange-500 ring-2 ring-orange-500/30'
                        : isDone
                        ? 'bg-emerald-500'
                        : 'bg-zinc-100 dark:bg-zinc-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Question Prompt */}
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Code Snippet Box (if present) */}
            {currentQuestion.codeSnippet && (
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 text-xs font-mono text-zinc-200 overflow-x-auto relative shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-orange-400">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Python Code Context</span>
                  </span>
                  <span className="text-zinc-500 font-sans">Read carefully</span>
                </div>
                <pre className="leading-relaxed whitespace-pre font-mono">
                  {currentQuestion.codeSnippet}
                </pre>
              </div>
            )}

            {/* Multiple Choice Options List */}
            <div className="flex flex-col gap-2.5 pt-2">
              {currentQuestion.options?.map((option, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                const isSelected = selectedOptionIndex === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let optionStyles =
                  'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800';

                if (isSelected && !isSubmitted) {
                  optionStyles =
                    'bg-orange-50 dark:bg-orange-950/30 border-orange-400 dark:border-orange-500/60 text-zinc-900 dark:text-white shadow-xs';
                } else if (isSubmitted) {
                  if (isCorrect) {
                    optionStyles =
                      'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    optionStyles =
                      'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20';
                  } else {
                    optionStyles =
                      'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 dark:text-zinc-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer font-sans ${optionStyles}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSubmitted && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isSubmitted && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {option}
                    </span>
                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 self-center" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Feedback Banner */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col gap-2.5 ${
                    selectedOptionIndex === currentQuestion.correctIndex
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedOptionIndex === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                            Excellent! Precise Python Comprehension
                          </h4>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                            Misconception Diagnosed
                          </h4>
                        </>
                      )}
                    </div>
                    {selectedOptionIndex === currentQuestion.correctIndex && (
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        +1 Lesson Progress Credited
                      </span>
                    )}
                  </div>

                  {/* Misconception Name if wrong */}
                  {selectedOptionIndex !== currentQuestion.correctIndex &&
                    currentQuestion.commonMisconception && (
                      <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/60">
                        <span>Underlying Misconception: </span>
                        <span className="font-bold">{currentQuestion.commonMisconception}</span>
                      </div>
                    )}

                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                {currentQuestion.solutionHint && !isSubmitted && (
                  <button
                    onClick={() => setShowHint((prev) => !prev)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Get Hint'}</span>
                  </button>
                )}

                {currentQuestionIndex > 0 && !isSubmitted && (
                  <button
                    onClick={handlePreviousQuestion}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                )}
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOptionIndex === null}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                    selectedOptionIndex !== null
                      ? 'bg-[#FF533D] hover:bg-[#FF4128] text-white cursor-pointer active:scale-95'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <span>Submit Answer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span>
                    {currentQuestionIndex + 1 < currentQuiz.questions.length
                      ? 'Next Question'
                      : 'View Topic Summary'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Expandable Hint Box */}
            <AnimatePresence>
              {showHint && currentQuestion.solutionHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Conceptual Nudge: </span>
                    <span>{currentQuestion.solutionHint}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar: Topic Overview & Course Progress (Right 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Topic Info Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E22] border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Topic Curriculum
                </h4>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                  {currentQuiz.courseTitle}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Focuses on eliminating off-by-one errors, state leaks, and conceptual misconceptions
                  through verified multiple-choice evaluations.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Questions Solved</span>
                  <span className="font-mono tabular-nums font-bold">
                    {completedQuestionsInTopic} / {currentQuiz.questions.length}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(completedQuestionsInTopic / currentQuiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {activeCourse && (
                <div className="pt-2">
                  <button
                    onClick={() => onSelectCourse && onSelectCourse(activeCourse.id)}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Video Lectures for Topic</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Topic Switcher List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E22] border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                All Python Topics
              </h4>
              <div className="flex flex-col gap-2">
                {allTopicKeys.map((key) => {
                  const tq = pythonTopicQuizzes[key];
                  const isCurrent = key === selectedTopicKey;
                  const cCount = tq.questions.filter((q) => completedTaskIds.includes(q.id)).length;

                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectTopic(key)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-400/80 text-orange-950 dark:text-orange-200'
                          : 'bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold truncate block">{tq.topicName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {cCount}/{tq.questions.length} mastered
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Completion Summary Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto w-full bg-white dark:bg-[#1E1E22] rounded-3xl p-8 border border-zinc-200/90 dark:border-zinc-800 shadow-md text-center flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Topic Quiz Completed!
            </span>
            <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {currentQuiz.topicName}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              Your answers have been processed and your course progress has been automatically updated in
              the learning platform.
            </p>
          </div>

          {/* Badge Achievement Reward Banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-medium max-w-md w-full">
            <span className="text-xl">🏆</span>
            <div className="text-left flex-1">
              <span className="font-extrabold block text-zinc-900 dark:text-white">
                Virtual Skill Reward Progress Credited!
              </span>
              <span className="text-zinc-600 dark:text-zinc-300">
                Check your newly earned badge and XP on the Course Dashboard.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Score</span>
              <p className="text-xl font-extrabold text-zinc-900 dark:text-white mt-1 font-mono">
                {sessionScore}/{currentQuiz.questions.length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Streak</span>
              <p className="text-xl font-extrabold text-orange-600 dark:text-orange-400 mt-1 font-mono">
                {streak} 🔥
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Progress</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                +{sessionScore}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={() => handleSelectTopic(nextTopicKey)}
              className="w-full sm:flex-1 py-3 rounded-xl bg-[#FF533D] hover:bg-[#FF4128] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Next Topic Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeCourse && onSelectCourse && (
            <button
              onClick={() => onSelectCourse(activeCourse.id)}
              className="text-xs font-semibold text-zinc-500 hover:text-orange-500 transition-colors cursor-pointer"
            >
              Return to course lectures & materials →
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
