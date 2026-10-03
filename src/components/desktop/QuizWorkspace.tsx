import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, TopicQuiz, TopicQuizQuestion, DifficultyLevel } from '../../types';
import { pythonTopicQuizzes } from '../../data/pythonQuizzes';
import { useDifficulty } from '../../context/DifficultyContext';
import { InterventionPanel } from './InterventionPanel';
import { diagnoseStudentSubmission } from '../../services/diagnosticEngine';
import { DiagnosticResult } from '../../types/tutor';

export interface QuizWorkspaceProps {
  courses?: Course[];
  activeCourseId?: string;
  difficulty?: DifficultyLevel; // Globally selected difficulty level passed from dashboard card
  completedTaskIds?: string[];
  onCompleteTask?: (taskId: string, courseId?: string) => void;
  onBack?: () => void;
}

export const QuizWorkspace: React.FC<QuizWorkspaceProps> = ({
  courses = [],
  activeCourseId,
  difficulty: propDifficulty,
  completedTaskIds = [],
  onCompleteTask,
  onBack,
}) => {
  const { difficulty, setDifficulty, getDifficultyBadgeClasses } = useDifficulty();

  // If a propDifficulty is passed on initial entry, initialize it once
  useEffect(() => {
    if (propDifficulty) {
      setDifficulty(propDifficulty);
    }
  }, [propDifficulty, setDifficulty]);

  // Topic selection
  const allTopicKeys = Object.keys(pythonTopicQuizzes);
  const initialTopicKey =
    activeCourseId && pythonTopicQuizzes[activeCourseId]
      ? activeCourseId
      : allTopicKeys[0];

  const [selectedTopicKey, setSelectedTopicKey] = useState<string>(initialTopicKey);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [submissionMode, setSubmissionMode] = useState<'editor' | 'choice'>('choice');
  const [activeTab, setActiveTab] = useState<'workspace' | 'teach'>('workspace');
  const [studentCode, setStudentCode] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [misconceptionHistory, setMisconceptionHistory] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [flawedLoaded, setFlawedLoaded] = useState<boolean>(false);

  // Active quiz & question
  const currentQuiz: TopicQuiz =
    pythonTopicQuizzes[selectedTopicKey] || pythonTopicQuizzes[allTopicKeys[0]];

  // Ask quiz difficulty level when quiz workshop starts
  const [showDifficultyPrompt, setShowDifficultyPrompt] = useState<boolean>(true);

  // The active difficulty level dictates which questions are served to the student.
  // Questions are STRICTLY filtered by difficulty so Easy, Medium, and Difficult NEVER show the same questions.
  const questionsMatchingDifficulty = currentQuiz.questions.filter(
    (q) => q.difficulty === difficulty
  );

  // Fallback to all questions across the curriculum matching THIS EXACT difficulty if this track has fewer
  const allCurriculumQuestions = Object.values(pythonTopicQuizzes).flatMap((tq) => tq.questions);
  const fallbackDifficultyQuestions = allCurriculumQuestions.filter(
    (q) => q.difficulty === difficulty
  );

  const activeQuestions =
    questionsMatchingDifficulty.length > 0
      ? questionsMatchingDifficulty
      : fallbackDifficultyQuestions.length > 0
      ? fallbackDifficultyQuestions
      : currentQuiz.questions;

  const safeQuestionIndex = Math.min(
    Math.max(0, currentQuestionIndex),
    Math.max(0, activeQuestions.length - 1)
  );
  const currentQuestion: TopicQuizQuestion =
    activeQuestions[safeQuestionIndex] || activeQuestions[0];

  const handleSelectDifficultyAndStart = (lvl: DifficultyLevel) => {
    setDifficulty(lvl);
    setShowDifficultyPrompt(false);
    setCurrentQuestionIndex(0);
  };

  // Reset index when track or difficulty changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [selectedTopicKey, difficulty]);

  // Initialize or reset starter code when question changes
  useEffect(() => {
    setSelectedOptionIndex(null);
    setDiagnosticResult(null);
    setShowHint(false);
    setAttemptCount(1);
    setFlawedLoaded(false);

    if (!currentQuestion) return;

    const initialCode =
      currentQuestion.starterCode ||
      currentQuestion.codeSnippet ||
      `# Write Python code for: ${currentQuestion.concept}\ndef solve():\n    pass\n`;
    setStudentCode(initialCode);

    if (currentQuestion.type === 'code') {
      setSubmissionMode('editor');
    } else {
      setSubmissionMode('choice');
    }
  }, [safeQuestionIndex, selectedTopicKey, currentQuestion?.id]);

  // Adjust active topic if prop changes
  useEffect(() => {
    if (activeCourseId && pythonTopicQuizzes[activeCourseId]) {
      setSelectedTopicKey(activeCourseId);
      setCurrentQuestionIndex(0);
    }
  }, [activeCourseId]);

  const handleCopySnippet = () => {
    const textToCopy = currentQuestion.codeSnippet || currentQuestion.starterCode;
    if (textToCopy) {
      navigator.clipboard?.writeText?.(textToCopy);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleResetCode = () => {
    const initialCode =
      currentQuestion.starterCode ||
      currentQuestion.codeSnippet ||
      `# Write Python code for: ${currentQuestion.concept}\ndef solve():\n    pass\n`;
    setStudentCode(initialCode);
    setFlawedLoaded(false);
  };

  const handleLoadFlawedCode = () => {
    if (currentQuestion.learnerFlawedCode) {
      setSubmissionMode('editor');
      setStudentCode(currentQuestion.learnerFlawedCode);
      setFlawedLoaded(true);
    }
  };

  // ===========================================================================
  // 3. RE:LEARN DIAGNOSTIC API INTEGRATION (/api/evaluate)
  // ---------------------------------------------------------------------------
  // The payload sent to the backend MUST include:
  //   1) student_code: The student's code or choice submission.
  //   2) current_concept (problem topic): The specific concept under test.
  //   3) difficulty: The user's globally selected difficulty level ("Easy" | "Medium" | "Difficult").
  //
  // ARCHITECTURAL RATIONALE:
  // Our system trains an empirical model to analyze the code and identify the
  // underlying misconception rather than just marking answers as incorrect.
  //
  // The 'difficulty' level parameter is strictly required so that:
  //   - The AI generates a targeted intervention suited to the learner's tier.
  //   - The AI dynamically generates a follow-up reassessment question that
  //     strictly matches the user's selected difficulty level to determine
  //     if the diagnosed misconception has actually been resolved.
  // ===========================================================================
  const handleSubmitResponse = async () => {
    if (isEvaluating) return;

    let submissionPayloadText = '';
    if (submissionMode === 'choice') {
      if (selectedOptionIndex === null) return;
      submissionPayloadText = currentQuestion.options
        ? currentQuestion.options[selectedOptionIndex]
        : '';
    } else {
      if (!studentCode.trim()) return;
      submissionPayloadText = studentCode;
    }

    setIsEvaluating(true);

    try {
      const result = await diagnoseStudentSubmission({
        current_concept: currentQuestion.concept,
        original_question: currentQuestion.question,
        student_code: submissionPayloadText,
        attempt_number: attemptCount,
        mastery_streak: diagnosticResult?.mastery_streak || 0,
        mastery_target: 2,
        misconception_history: misconceptionHistory,
        concepts_remaining: currentQuiz.questions
          .slice(currentQuestionIndex + 1)
          .map((q) => q.concept),
        difficulty: difficulty,
      });

      setDiagnosticResult(result);

      if (!result.is_correct && result.misconception_diagnosed) {
        setMisconceptionHistory((prev) =>
          prev.includes(result.misconception_diagnosed!)
            ? prev
            : [...prev, result.misconception_diagnosed!]
        );
        setAttemptCount((prev) => prev + 1);
      } else if (result.is_correct) {
        if (onCompleteTask) {
          onCompleteTask(currentQuestion.id, currentQuiz.courseId);
        }
      }
    } catch (err) {
      console.error('Submission evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApplyReassessment = (reassessmentQuestion: string) => {
    setSubmissionMode('editor');
    const reassessmentStarter = `# REASSESSMENT CHALLENGE (${difficulty} Level):\n# ${reassessmentQuestion}\n\ndef solve_reassessment():\n    # Implement your corrected mental model:\n    pass\n`;
    setStudentCode(reassessmentStarter);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleAdvanceNext = () => {
    if (safeQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex(safeQuestionIndex + 1);
    } else {
      const nextTopicIdx = (allTopicKeys.indexOf(selectedTopicKey) + 1) % allTopicKeys.length;
      setSelectedTopicKey(allTopicKeys[nextTopicIdx]);
      setCurrentQuestionIndex(0);
    }
  };

  const isCurrentQuestionDone = completedTaskIds.includes(currentQuestion.id);

  return (
    <div className="flex-1 p-4 sm:p-7 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
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
                Adaptive Misconception Learning & Testing
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadgeClasses()}`}>
                {difficulty} Complexity
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
              {currentQuiz.topicName}
            </h1>
          </div>
        </div>
      </div>

      {/* Topic Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {allTopicKeys.map((key) => {
          const tq = pythonTopicQuizzes[key];
          const isSelected = selectedTopicKey === key;
          const solvedCount = tq.questions.filter((q) => completedTaskIds.includes(q.id)).length;

          return (
            <button
              key={key}
              onClick={() => {
                setSelectedTopicKey(key);
                setCurrentQuestionIndex(0);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                  : 'bg-white dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{tq.topicName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/15 font-mono">
                {solvedCount}/{tq.questions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dual Mode Tabs: "Test Knowledge (Workspace)" vs "Teach Me Concept (Deep-Dive)" */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Test Knowledge & Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teach')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'teach'
                ? 'bg-[#FF533D] text-white shadow-sm'
                : 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teach Me This Concept</span>
          </button>
        </div>

        {currentQuestion.learnerFlawedCode && activeTab === 'workspace' && (
          <button
            type="button"
            onClick={handleLoadFlawedCode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 text-xs font-bold cursor-pointer transition-colors"
            title="Load student misconception from empirical dataset into editor"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>{flawedLoaded ? 'Flawed Code Loaded' : 'Test Real Student Misconception'}</span>
          </button>
        )}
      </div>

      {/* View Mode 1: Concept Teaching Guide (Deep-Dive) */}
      {activeTab === 'teach' && currentQuestion.teachingGuide && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E1E22] border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col gap-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Pedagogical Concept Breakdown
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {currentQuestion.concept}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('workspace')}
              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs cursor-pointer hover:scale-102 transition-transform"
            >
              Ready to Test Knowledge →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview & Why it happens */}
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  1. How Python Behaves
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {currentQuestion.teachingGuide.overview}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1">
                  2. Why Learners Fall Into This Misconception
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {currentQuestion.teachingGuide.whyItHappens}
                </p>
              </div>
            </div>

            {/* Mental Model & Takeaway */}
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">
                  3. The Accurate Mental Model
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {currentQuestion.teachingGuide.mentalModel}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1">
                  4. Rule of Thumb / Key Takeaway
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-200 leading-relaxed">
                  {currentQuestion.teachingGuide.keyTakeaway}
                </p>
              </div>
            </div>
          </div>

          {/* Dataset Evidence Card */}
          {currentQuestion.learnerFlawedCode && (
            <div className="mt-2 p-5 rounded-2xl bg-zinc-950 text-zinc-100 border border-zinc-800 flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px] text-zinc-400 font-sans">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>Real Learner Misconception Trace from Empirical Dataset</span>
                </span>
                <span className="text-zinc-500">{currentQuestion.misconceptionId}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-rose-400 font-sans uppercase font-bold block mb-1">
                    Flawed Submission:
                  </span>
                  <pre className="text-rose-300 whitespace-pre font-mono p-3 bg-rose-950/30 rounded-xl border border-rose-900/50">
                    {currentQuestion.learnerFlawedCode}
                  </pre>
                  {currentQuestion.studentExplanation && (
                    <span className="text-[11px] text-zinc-400 font-sans mt-2 block italic">
                      Student thought: "{currentQuestion.studentExplanation}"
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-emerald-400 font-sans uppercase font-bold block mb-1">
                    Correct Pattern:
                  </span>
                  <pre className="text-emerald-300 whitespace-pre font-mono p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50">
                    {currentQuestion.codeSnippet || currentQuestion.starterCode}
                  </pre>
                  {currentQuestion.errorTrace && (
                    <span className="text-[11px] text-amber-300 font-mono mt-2 block">
                      CPython Trace: {currentQuestion.errorTrace}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* View Mode 2: Test Knowledge (Workspace) */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Question Prompt, Concept & Context (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-white dark:bg-[#1E1E22] rounded-3xl p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
            {/* Question Stepper & Concept Tag */}
            <div className="flex flex-col gap-2.5 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#FF533D]">
                    Question {safeQuestionIndex + 1} of {activeQuestions.length} ({difficulty})
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Attempt #{attemptCount}
                  </span>
                </div>

                {isCurrentQuestionDone && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mastered</span>
                  </span>
                )}
              </div>

              {/* Question Navigation Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {activeQuestions.map((q, idx) => {
                  const isCurrent = idx === safeQuestionIndex;
                  const isDone = completedTaskIds.includes(q.id);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer select-none ${
                        isCurrent
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300/50'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                      title={`${q.concept} (${q.difficulty || difficulty})`}
                    >
                      <span>Q{idx + 1}</span>
                      <span className="text-[9px] uppercase opacity-75">({(q.difficulty || difficulty)[0]})</span>
                      {isDone && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Concept Target: {currentQuestion.concept}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Reference Code Snippet if provided */}
            {currentQuestion.codeSnippet && (
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase text-orange-400">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Problem Context</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 leading-relaxed whitespace-pre font-mono text-xs overflow-x-auto text-emerald-300">
                  {currentQuestion.codeSnippet}
                </pre>
              </div>
            )}

            {/* Hint Expander */}
            {currentQuestion.solutionHint && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showHint ? 'Hide Pedagogical Nudge' : 'Need a Conceptual Nudge?'}</span>
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 leading-relaxed"
                    >
                      <span className="font-bold">Guiding clue: </span>
                      {currentQuestion.solutionHint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Column: Code Editor (Monaco) or Multiple-Choice Form (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 bg-white dark:bg-[#1E1E22] rounded-3xl p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
            {/* Submission Mode Selector (Choice vs Code Editor) */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                {currentQuestion.options && (
                  <button
                    type="button"
                    onClick={() => setSubmissionMode('choice')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      submissionMode === 'choice'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Multiple Choice</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSubmissionMode('editor')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    submissionMode === 'editor'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Monaco Python Editor</span>
                </button>
              </div>

              {submissionMode === 'editor' && (
                <div className="flex items-center gap-2">
                  {currentQuestion.learnerFlawedCode && (
                    <button
                      type="button"
                      onClick={handleLoadFlawedCode}
                      className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{flawedLoaded ? 'Flawed Code Set' : 'Load Dataset Bug'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    title="Reset starter template"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>

            {/* Multiple-Choice Form */}
            {submissionMode === 'choice' && currentQuestion.options ? (
              <div className="flex flex-col gap-2.5 py-1">
                {currentQuestion.options.map((option, idx) => {
                  const optionLetter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOptionIndex === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOptionIndex(idx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950/30 border-[#FF533D] text-zinc-950 dark:text-white shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#FF533D] text-white'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed flex-1">
                        {option}
                      </pre>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Monaco Code Editor Container */
              <div className="flex flex-col gap-2">
                <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700/80 shadow-inner bg-[#1e1e1e]">
                  <div className="px-4 py-2 bg-zinc-900 text-zinc-400 border-b border-zinc-800 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-2 font-mono text-zinc-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      <span>solution.py</span>
                    </span>
                    <span className="font-sans text-[10px] text-zinc-500">
                      Monaco Editor · Python 3.12 syntax
                    </span>
                  </div>

                  <div className="h-64 sm:h-72 w-full">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      value={studentCode}
                      onChange={(val) => setStudentCode(val || '')}
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

            {/* Submit Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-400">
                Evaluated against empirical misconception dataset
              </span>

              <button
                type="button"
                onClick={handleSubmitResponse}
                disabled={
                  isEvaluating ||
                  (submissionMode === 'choice' && selectedOptionIndex === null) ||
                  (submissionMode === 'editor' && !studentCode.trim())
                }
                className={`px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                  !isEvaluating &&
                  ((submissionMode === 'choice' && selectedOptionIndex !== null) ||
                    (submissionMode === 'editor' && studentCode.trim()))
                    ? 'bg-[#FF533D] hover:bg-[#FF4128] text-white shadow-orange-500/20 active:scale-95 cursor-pointer'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {isEvaluating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Diagnosing Misconception...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Response</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Initially Hidden Intervention Panel (Appears once AI diagnostic returns) */}
      <InterventionPanel
        result={diagnosticResult}
        difficulty={difficulty}
        onApplyReassessment={handleApplyReassessment}
        onRetryQuestion={() => {
          handleResetCode();
          setDiagnosticResult(null);
        }}
        onAdvanceNext={handleAdvanceNext}
      />

      {/* Quiz Difficulty Level Selection Prompt Modal (Shown when workshop starts) */}
      <AnimatePresence>
        {showDifficultyPrompt && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#1E1E22] rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative my-8 overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col gap-1.5 mb-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF533D]/10 text-[#FF533D]">
                    Quiz Workshop Setup
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    Topic: {currentQuiz.topicName}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white font-heading">
                  Select Quiz Difficulty Level
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
                  Choose your target challenge level to begin. Questions, code requirements, and AI diagnostic interventions will be served depending upon the difficulty selected.
                </p>
              </div>

              {/* 3 Difficulty Option Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Easy Card */}
                <div
                  onClick={() => handleSelectDifficultyAndStart('Easy')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    difficulty === 'Easy'
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 bg-zinc-50/60 dark:bg-zinc-800/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Foundational
                      </span>
                      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Easy</h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Core syntax, indentation semantics, assignment vs equality, and explicit type coercion.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1 text-[10px] text-zinc-500 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M1 Indentation</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M2 Equality</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M10 Types</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Start Easy Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Medium Card */}
                <div
                  onClick={() => handleSelectDifficultyAndStart('Medium')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    difficulty === 'Medium'
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-amber-400 bg-zinc-50/60 dark:bg-zinc-800/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Intermediate
                      </span>
                      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Medium</h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      String immutability, list reference copies vs aliases, division precision, and boundary indexing.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1 text-[10px] text-zinc-500 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M4 Immutability</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M7 Copy vs Ref</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M9 Indexing</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Start Medium Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Difficult Card */}
                <div
                  onClick={() => handleSelectDifficultyAndStart('Difficult')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    difficulty === 'Difficult'
                      ? 'border-[#FF533D] bg-orange-50/60 dark:bg-orange-950/30 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-[#FF533D] bg-zinc-50/60 dark:bg-zinc-800/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#FF533D] flex items-center justify-center shadow-xs">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#FF533D] uppercase tracking-wider">
                        Advanced
                      </span>
                      <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Difficult</h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Mutable default argument state leaks, global variable shadowing, and closure late binding.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1 text-[10px] text-zinc-500 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M3 Mutable Defs</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">M5 Global Scope</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5">Closures</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-[#FF533D] hover:bg-[#FF4128] text-white shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Start Difficult Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Close / Skip button */}
              <div className="mt-6 flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span>Selected: <strong className="text-zinc-900 dark:text-white">{difficulty}</strong></span>
                <button
                  type="button"
                  onClick={() => setShowDifficultyPrompt(false)}
                  className="font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white cursor-pointer hover:underline"
                >
                  Continue with {difficulty} →
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
