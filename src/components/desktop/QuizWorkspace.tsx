import React, { useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import {
  Sparkles,
  Flame,
  Zap,
  ArrowRight,
  Code2,
  ListFilter,
  RotateCcw,
  Send,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  Copy,
  Check,
  AlertTriangle,
  Play,
  Terminal,
  HelpCircle,
  GraduationCap,
  X,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, DifficultyLevel, TopicQuizQuestion } from '../../types';
import { useDifficulty } from '../../context/DifficultyContext';
import {
  CONCEPT_TRACKS,
  getFilteredCsvQuestions,
  CsvMisconceptionRecord,
} from '../../data/csvDataLoader';

export interface QuizWorkspaceProps {
  courses?: Course[];
  activeCourseId?: string;
  completedTaskIds?: string[];
  onCompleteTask?: (taskId: string, courseId?: string) => void;
  onBack?: () => void;
}

export const QuizWorkspace: React.FC<QuizWorkspaceProps> = ({
  courses = [],
  activeCourseId = 'course-python-syntax',
  completedTaskIds = [],
  onCompleteTask,
  onBack,
}) => {
  const { difficulty, setDifficulty, getDifficultyBadgeClasses } = useDifficulty();

  // Track selection: matching the 3 CSV concept tracks
  const trackKeys = ['course-python-syntax', 'course-python-comprehensions', 'course-python-functions'];
  const initialTrack = trackKeys.includes(activeCourseId) ? activeCourseId : trackKeys[0];
  const [selectedTrackId, setSelectedTrackId] = useState<string>(initialTrack);

  // Active difficulty numeric representation (1 = Easy, 2 = Medium, 3 = Difficult)
  const difficultyNum = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;

  // Initial difficulty selection prompt on workshop start
  const [showDifficultyPrompt, setShowDifficultyPrompt] = useState<boolean>(false);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [submissionMode, setSubmissionMode] = useState<'choice' | 'editor'>('choice');
  const [studentCode, setStudentCode] = useState<string>('');
  const [submissionState, setSubmissionState] = useState<'idle' | 'evaluating' | 'correct' | 'incorrect'>('idle');
  const [showLearnThisModal, setShowLearnThisModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'guide'>('quiz');

  // Query CSV questions strictly filtered by active track and difficulty
  const activeQuestions: TopicQuizQuestion[] = useMemo(() => {
    return getFilteredCsvQuestions({
      trackId: selectedTrackId,
      difficulty: difficulty,
      difficultyNum: difficultyNum,
    });
  }, [selectedTrackId, difficulty, difficultyNum]);

  // Safe question index with boundary clamping to prevent index-out-of-range
  const safeQuestionIndex = useMemo(() => {
    if (activeQuestions.length === 0) return 0;
    return Math.min(Math.max(0, currentQuestionIndex), activeQuestions.length - 1);
  }, [currentQuestionIndex, activeQuestions.length]);

  const currentQuestion: TopicQuizQuestion | undefined = activeQuestions[safeQuestionIndex];

  // Active track metadata
  const activeTrackMeta = CONCEPT_TRACKS.find((t) => t.id === selectedTrackId) || CONCEPT_TRACKS[0];

  // Completed questions count in this track
  const completedInTrackCount = useMemo(() => {
    return activeQuestions.filter((q) => completedTaskIds.includes(q.id)).length;
  }, [activeQuestions, completedTaskIds]);

  // Reset quiz states when track or difficulty changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setSubmissionState('idle');
    setShowLearnThisModal(false);
  }, [selectedTrackId, difficulty]);

  // Update active question starter code when question changes
  useEffect(() => {
    setSelectedOptionIndex(null);
    setSubmissionState('idle');
    setShowLearnThisModal(false);

    if (currentQuestion) {
      setStudentCode(currentQuestion.starterCode || currentQuestion.codeSnippet || '');
    }
  }, [safeQuestionIndex, currentQuestion?.id]);

  // Sync if prop activeCourseId changes
  useEffect(() => {
    if (activeCourseId && trackKeys.includes(activeCourseId)) {
      setSelectedTrackId(activeCourseId);
    }
  }, [activeCourseId]);

  // Handle difficulty selection
  const handleSelectDifficulty = (lvl: DifficultyLevel) => {
    setDifficulty(lvl);
    setShowDifficultyPrompt(false);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setSubmissionState('idle');
  };

  // Submit Answer handler
  const handleSubmitAnswer = () => {
    if (!currentQuestion || submissionState === 'evaluating') return;

    setSubmissionState('evaluating');

    // Simulate diagnostic engine verification
    setTimeout(() => {
      let isCorrect = false;

      if (submissionMode === 'choice') {
        isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
      } else {
        // Compare code trimmed
        const trimmedStudent = studentCode.replace(/\s+/g, ' ').trim();
        const trimmedFlawed = (currentQuestion.learnerFlawedCode || '').replace(/\s+/g, ' ').trim();
        const trimmedCorrect = (currentQuestion.codeSnippet || '').replace(/\s+/g, ' ').trim();

        if (trimmedStudent === trimmedCorrect) {
          isCorrect = true;
        } else if (trimmedStudent === trimmedFlawed) {
          isCorrect = false;
        } else {
          // Check for core misconception markers
          const containsFlaw =
            trimmedStudent.includes('=') && !trimmedStudent.includes('==') && currentQuestion.misconceptionId === 'M2_ASSIGNMENT_VS_COMPARISON';
          isCorrect = !containsFlaw && trimmedStudent.length > 15;
        }
      }

      if (isCorrect) {
        setSubmissionState('correct');
        if (onCompleteTask) {
          onCompleteTask(currentQuestion.id, selectedTrackId);
        }
      } else {
        setSubmissionState('incorrect');
      }
    }, 400);
  };

  // Next question handler
  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setSubmissionState('idle');
    setShowLearnThisModal(false);

    if (safeQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex(safeQuestionIndex + 1);
    } else {
      // Completed all questions in this track/difficulty
      if (onBack) {
        onBack();
      }
    }
  };

  // Retry question handler
  const handleRetryQuestion = () => {
    setSelectedOptionIndex(null);
    setSubmissionState('idle');
    setShowLearnThisModal(false);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const progressPercent = activeQuestions.length > 0
    ? Math.round(((safeQuestionIndex + 1) / activeQuestions.length) * 100)
    : 0;

  return (
    <div className="flex-1 p-4 sm:p-7 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* 1. Top Workspace Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back to dashboard"
              className="p-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-[#FF533D]/10 text-[#FF533D]">
                CSV Misconception Diagnostic Engine
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadgeClasses()}`}>
                Level {difficultyNum}: {difficulty}
              </span>
              <button
                type="button"
                onClick={() => setShowDifficultyPrompt(true)}
                className="text-[11px] font-bold text-[#FF533D] hover:underline cursor-pointer flex items-center gap-1"
                title="Change difficulty level"
              >
                <span>Change Level</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-heading mt-1">
              {activeTrackMeta.title}
            </h1>
          </div>
        </div>

        {/* Question Counter & Solved Progress */}
        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="text-right">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Track Progress ({difficulty})
            </span>
            <div className="text-sm font-extrabold text-zinc-900 dark:text-white font-mono">
              Question {activeQuestions.length > 0 ? safeQuestionIndex + 1 : 0} of {activeQuestions.length}
            </div>
          </div>
          <div className="w-28 sm:w-36 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-[#FF533D] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Track Selector Pills (Functions & Scope, Data Structures, Core Syntax & Control Flow) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CONCEPT_TRACKS.map((t) => {
          const isSelected = selectedTrackId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTrackId(t.id);
                setCurrentQuestionIndex(0);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                  : 'bg-white dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/15 font-mono">
                {t.totalQuestions} Qs
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Workspace Content Area */}
      {activeQuestions.length === 0 ? (
        /* Empty Filter Fallback Guard: prevents index-out-of-range errors */
        <div className="bg-white dark:bg-[#1E1E22] rounded-[32px] p-8 sm:p-12 border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            No {difficulty} Questions in {activeTrackMeta.title}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md">
            In the empirical misconception dataset, this concept track features questions at other complexity levels. Switch level or view all tracks to continue.
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
            <button
              onClick={() => handleSelectDifficulty(selectedTrackId === 'course-python-functions' ? 'Difficult' : 'Medium')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#FF533D] text-white shadow-md cursor-pointer"
            >
              Switch to Native Difficulty Level
            </button>
            <button
              onClick={() => setSelectedTrackId('course-python-syntax')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              Go to Core Syntax (Easy)
            </button>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Question Prompt & Code/Options Workspace (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E1E22] rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-sm flex flex-col gap-5">
            {/* Question Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  {currentQuestion.concept || 'Python Misconception'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  ID: {currentQuestion.id}
                </span>
              </div>

              {/* Mode Toggle: Multiple Choice vs Code Editor */}
              <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                <button
                  type="button"
                  onClick={() => setSubmissionMode('choice')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    submissionMode === 'choice'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  Choice
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionMode('editor')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    submissionMode === 'editor'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  Editor
                </button>
              </div>
            </div>

            {/* Question Prompt */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white font-heading leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Question Interaction Area */}
            {submissionMode === 'choice' ? (
              /* Multiple Choice Option Cards */
              <div className="flex flex-col gap-3">
                {currentQuestion.options?.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const optionLetter = String.fromCharCode(65 + idx);

                  let borderClass = 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600';
                  let bgClass = 'bg-zinc-50/60 dark:bg-zinc-800/40';

                  if (submissionState === 'correct') {
                    if (idx === currentQuestion.correctIndex) {
                      borderClass = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100';
                    }
                  } else if (submissionState === 'incorrect') {
                    if (isSelected) {
                      borderClass = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-[#FF533D] bg-orange-50/60 dark:bg-orange-950/30';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={submissionState === 'evaluating'}
                      onClick={() => {
                        setSelectedOptionIndex(idx);
                        if (submissionState !== 'idle') {
                          setSubmissionState('idle');
                        }
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 group ${borderClass} ${bgClass}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#FF533D] text-white'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-x-auto text-zinc-900 dark:text-zinc-100">
                        {option}
                      </pre>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Monaco Code Editor */
              <div className="flex flex-col gap-2">
                <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-inner bg-[#1e1e1e]">
                  <div className="px-4 py-2 bg-zinc-900 text-zinc-400 border-b border-zinc-800 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-2 font-mono text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>solution.py</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Level {difficultyNum} · Python 3.12
                    </span>
                  </div>
                  <div className="h-64 sm:h-72 w-full">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      value={studentCode}
                      onChange={(val) => {
                        setStudentCode(val || '');
                        if (submissionState !== 'idle') {
                          setSubmissionState('idle');
                        }
                      }}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* 4. DYNAMIC ACTION FOOTER (RESOLVES SUBMISSION LOCK BUG CRITICAL)  */}
            {/* ================================================================= */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
              {/* State A: CORRECT ANSWER BANNER */}
              {submissionState === 'correct' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                        Correct! Excellent understanding.
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Your response adheres to Python semantics and avoids common misconceptions.
                      </p>
                    </div>
                  </div>

                  {/* Immediate Next Question Button */}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <span>{safeQuestionIndex + 1 < activeQuestions.length ? 'Next Question' : 'Complete Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* State B: INCORRECT ANSWER BANNER WITH 'LEARN THIS' BUTTON */}
              {submissionState === 'incorrect' && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100">
                        Incorrect Answer
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-300">
                        Diagnosed misconception: <strong className="font-semibold">{currentQuestion.misconceptionLabel || currentQuestion.concept}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: LEARN THIS, Retry, Next Question */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Prominent LEARN THIS Button */}
                    <button
                      type="button"
                      onClick={() => setShowLearnThisModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
                    >
                      <Lightbulb className="w-4 h-4 fill-white" />
                      <span>LEARN THIS</span>
                    </button>

                    {/* Retry Button */}
                    <button
                      type="button"
                      onClick={handleRetryQuestion}
                      className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer"
                      title="Try another answer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>

                    {/* Never-blocked Next Question Button */}
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-3.5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs hover:opacity-90 flex items-center gap-1 cursor-pointer"
                      title="Advance to next question"
                    >
                      <span>Skip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* State C: DEFAULT SUBMIT BAR (When unsubmitted) */}
              {submissionState === 'idle' && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-400">
                    Select an answer option or test your Python code above.
                  </span>

                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={
                      (submissionMode === 'choice' && selectedOptionIndex === null) ||
                      (submissionMode === 'editor' && !studentCode.trim())
                    }
                    className={`px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                      (submissionMode === 'choice' && selectedOptionIndex !== null) ||
                      (submissionMode === 'editor' && studentCode.trim())
                        ? 'bg-[#FF533D] hover:bg-[#FF4128] text-white shadow-orange-500/20 active:scale-95 cursor-pointer'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Answer</span>
                  </button>
                </div>
              )}

              {/* State D: EVALUATING LOADER */}
              {submissionState === 'evaluating' && (
                <div className="flex items-center justify-center p-3 text-xs text-zinc-500 gap-2">
                  <div className="w-4 h-4 border-2 border-[#FF533D] border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating against misconception dataset...</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Concept Information & Reference Notes (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Concept Card */}
            <div className="bg-white dark:bg-[#1E1E22] rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Concept Under Test
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5">
                  {currentQuestion.misconceptionId || 'CSV Dataset'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  {currentQuestion.misconceptionLabel || currentQuestion.concept}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Teaching Guide Highlights */}
              {currentQuestion.teachingGuide && (
                <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                      Mental Model:
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {currentQuestion.teachingGuide.mentalModel}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                      Key Takeaway:
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {currentQuestion.teachingGuide.keyTakeaway}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Track Overview Card */}
            <div className="bg-white dark:bg-[#1E1E22] rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Active Track
              </h4>
              <div className="flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-white">
                <span>{activeTrackMeta.title}</span>
                <span className="font-mono text-xs">{completedInTrackCount} Solved</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {activeTrackMeta.description}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* 5. "LEARN THIS" MISCONCEPTION INTERVENTION MODAL                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showLearnThisModal && currentQuestion && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#1E1E22] rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF533D]">
                      Diagnosed Misconception Analysis
                    </span>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white font-heading">
                      {currentQuestion.misconceptionLabel || currentQuestion.concept}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLearnThisModal(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: 3 CSV-Grounded Sections */}
              <div className="flex flex-col gap-4 py-5 text-xs sm:text-sm">
                {/* 1. Exact Error Trace from CSV */}
                {currentQuestion.errorTrace && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Runtime Error Trace / Symptom</span>
                    </span>
                    <div className="p-3.5 rounded-xl bg-zinc-950 text-rose-400 font-mono text-xs border border-rose-900/40 whitespace-pre-wrap">
                      {currentQuestion.errorTrace}
                    </div>
                  </div>
                )}

                {/* 2. Exact Student Explanation from CSV */}
                {currentQuestion.studentExplanation && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Student Mental Model (Why this occurs)</span>
                    </span>
                    <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-zinc-800 dark:text-zinc-200 italic">
                      "{currentQuestion.studentExplanation}"
                    </div>
                  </div>
                )}

                {/* 3. Concept Breakdown & Mental Model */}
                {currentQuestion.teachingGuide && (
                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
                      Correct Python Mental Model
                    </span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {currentQuestion.teachingGuide.overview}
                    </p>
                    <div className="pt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      ✓ Takeaway: {currentQuestion.teachingGuide.keyTakeaway}
                    </div>
                  </div>
                )}

                {/* 4. Code Comparison (Flawed vs Correct) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {currentQuestion.learnerFlawedCode && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                        ✗ Flawed Response (Misconception)
                      </span>
                      <pre className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                        {currentQuestion.learnerFlawedCode}
                      </pre>
                    </div>
                  )}

                  {(currentQuestion.correctAnswer || currentQuestion.codeSnippet) && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Correct Pattern
                      </span>
                      <pre className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
                        {currentQuestion.correctAnswer || currentQuestion.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowLearnThisModal(false);
                    handleRetryQuestion();
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Got It, Let Me Retry</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowLearnThisModal(false);
                    handleNextQuestion();
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#FF533D] hover:bg-[#FF4128] text-white cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  <span>{safeQuestionIndex + 1 < activeQuestions.length ? 'Next Question' : 'Complete Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. DIFFICULTY SELECTION PROMPT MODAL (Allows switching 1=Easy, 2=Med, 3=Diff) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showDifficultyPrompt && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-[#1E1E22] rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative my-8 overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 mb-6 text-center sm:text-left">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF533D]/10 text-[#FF533D] self-center sm:self-start">
                  CSV Dataset Difficulty Calibration
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-heading">
                  Select Quiz Difficulty Level
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  Questions are filtered strictly from the misconception dataset matching your chosen difficulty tier.
                </p>
              </div>

              {/* 3 Difficulty Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1 = Easy */}
                <div
                  onClick={() => handleSelectDifficulty('Easy')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    difficulty === 'Easy'
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 bg-zinc-50/60 dark:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">
                        Level 1
                      </span>
                      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Easy</h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Block indentation (M1), assignment vs equality == (M2), type coercion (M10).
                    </p>
                  </div>
                  <button className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Select Easy (Level 1)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2 = Medium */}
                <div
                  onClick={() => handleSelectDifficulty('Medium')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    difficulty === 'Medium'
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-amber-400 bg-zinc-50/60 dark:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase">
                        Level 2
                      </span>
                      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Medium</h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      String immutability (M4), list reference copies (M7), integer division (M8), index boundaries (M9).
                    </p>
                  </div>
                  <button className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Select Medium (Level 2)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 = Difficult */}
                <div
                  onClick={() => handleSelectDifficulty('Difficult')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    difficulty === 'Difficult'
                      ? 'border-[#FF533D] bg-orange-50/60 dark:bg-orange-950/30'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-[#FF533D] bg-zinc-50/60 dark:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#FF533D] flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#FF533D] uppercase">
                        Level 3
                      </span>
                      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Difficult</h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Mutable default arguments (M3), variable scope shadowing and global counter (M5).
                    </p>
                  </div>
                  <button className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-[#FF533D] hover:bg-[#FF4128] text-white flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>Select Difficult (Level 3)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span>Active: <strong className="text-zinc-900 dark:text-white">{difficulty} (Level {difficultyNum})</strong></span>
                <button
                  type="button"
                  onClick={() => setShowDifficultyPrompt(false)}
                  className="font-bold text-zinc-600 dark:text-zinc-300 hover:underline cursor-pointer"
                >
                  Close & Continue →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizWorkspace;
