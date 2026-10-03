import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Sparkles,
  Code2,
  ListFilter,
  RotateCcw,
  Send,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Flame,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, TopicQuiz, TopicQuizQuestion, DifficultyLevel } from '../../types';
import { pythonTopicQuizzes } from '../../data/pythonQuizzes';
import { useDifficulty } from '../../context/DifficultyContext';
import { DifficultySelector } from './DifficultySelector';
import { InterventionPanel } from './InterventionPanel';
import { diagnoseStudentSubmission } from '../../services/diagnosticEngine';
import { DiagnosticResult } from '../../types/tutor';

export interface QuizWorkspaceProps {
  courses?: Course[];
  activeCourseId?: string;
  completedTaskIds?: string[];
  onCompleteTask?: (taskId: string, courseId?: string) => void;
  onBack?: () => void;
}

export const QuizWorkspace: React.FC<QuizWorkspaceProps> = ({
  courses = [],
  activeCourseId,
  completedTaskIds = [],
  onCompleteTask,
  onBack,
}) => {
  const { difficulty, setDifficulty, getDifficultyBadgeClasses } = useDifficulty();

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
  const [studentCode, setStudentCode] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [misconceptionHistory, setMisconceptionHistory] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Active quiz & question
  const currentQuiz: TopicQuiz =
    pythonTopicQuizzes[selectedTopicKey] || pythonTopicQuizzes[allTopicKeys[0]];
  const currentQuestion: TopicQuizQuestion =
    currentQuiz.questions[currentQuestionIndex] || currentQuiz.questions[0];

  // Initialize or reset starter code when question changes
  useEffect(() => {
    setSelectedOptionIndex(null);
    setDiagnosticResult(null);
    setShowHint(false);
    setAttemptCount(1);

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
  }, [currentQuestionIndex, selectedTopicKey]);

  // Adjust active topic if prop changes
  useEffect(() => {
    if (activeCourseId && pythonTopicQuizzes[activeCourseId]) {
      setSelectedTopicKey(activeCourseId);
      setCurrentQuestionIndex(0);
    }
  }, [activeCourseId]);

  const handleCopySnippet = () => {
    if (currentQuestion.codeSnippet) {
      navigator.clipboard?.writeText?.(currentQuestion.codeSnippet);
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
  };

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
    // Switch to editor mode and seed the reassessment problem prompt
    setSubmissionMode('editor');
    const reassessmentStarter = `# REASSESSMENT CHALLENGE (${difficulty} Level):\n# ${reassessmentQuestion}\n\ndef solve_reassessment():\n    # Implement your corrected mental model:\n    pass\n`;
    setStudentCode(reassessmentStarter);
    // Smoothly scroll editor into view
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleAdvanceNext = () => {
    if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Loop or next topic
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
                Re:Learn Adaptive Quiz Workspace
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadgeClasses()}`}>
                {difficulty} Complexity
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-heading mt-1">
              {currentQuiz.topicName}
            </h1>
          </div>
        </div>

        {/* Difficulty Selector Bound to Global State */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <DifficultySelector compact />
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

      {/* Main Workspace Grid (Left: Question Prompt & Context; Right: Code Editor / Options) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Prompt, Concept & Context (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-white dark:bg-[#1E1E22] rounded-3xl p-6 border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
          {/* Question Stepper & Concept Tag */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#FF533D]">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
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
              <button
                type="button"
                onClick={handleResetCode}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset starter template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
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
                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {option}
                    </span>
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
              Evaluated against real edge-case trace models
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
    </div>
  );
};

export default QuizWorkspace;
