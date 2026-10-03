import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Flame,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TopicQuiz, TopicQuizQuestion } from '../../types';
import { diagnoseStudentSubmission } from '../../services/diagnosticEngine';
import { DiagnosticResult } from '../../types/tutor';

interface TopicQuizModalProps {
  quiz: TopicQuiz;
  onClose: () => void;
  onQuizCompleted?: (score: number) => void;
}

export const TopicQuizModal: React.FC<TopicQuizModalProps> = ({
  quiz,
  onClose,
  onQuizCompleted,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [studentCode, setStudentCode] = useState(
    quiz.questions[0]?.starterCode || ''
  );
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [codeResult, setCodeResult] = useState<DiagnosticResult | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ: TopicQuizQuestion = quiz.questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitChoice = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleEvaluateCode = async () => {
    if (!studentCode.trim() || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const result = await diagnoseStudentSubmission({
        current_concept: currentQ.concept,
        original_question: currentQ.question,
        student_code: studentCode,
        attempt_number: 1,
        mastery_streak: streak,
        mastery_target: 2,
        misconception_history: [],
        concepts_remaining: [],
      });

      setCodeResult(result);
      setIsAnswerSubmitted(true);
      if (result.is_correct) {
        setCorrectAnswersCount((prev) => prev + 1);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }
    } catch (e) {
      console.error('Quiz diagnosis error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quiz.questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCodeResult(null);
      setStudentCode(quiz.questions[nextIdx]?.starterCode || '');
    } else {
      setIsCompleted(true);
      onQuizCompleted?.(correctAnswersCount);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-white dark:bg-[#1E1E22] border border-zinc-200 dark:border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Topic Quiz
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Question {currentIndex + 1} of {quiz.questions.length}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">
                {quiz.topicName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streak} Streak</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Quiz"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {!isCompleted ? (
            <>
              {/* Question Statement */}
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Concept: {currentQ.concept}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Choice Type Question */}
              {currentQ.type === 'choice' && currentQ.options && (
                <div className="flex flex-col gap-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let optionStyle =
                      'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optionStyle =
                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-950 dark:text-orange-200 font-bold shadow-xs';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-black/5 dark:bg-white/10 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Code Type Question */}
              {currentQ.type === 'code' && (
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl bg-[#18181B] text-zinc-100 border border-zinc-800 p-4 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1.5 text-orange-400">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Interactive Python Terminal</span>
                      </span>
                      <button
                        onClick={() => setStudentCode(currentQ.starterCode || '')}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                    <textarea
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      rows={6}
                      spellCheck={false}
                      className="w-full bg-transparent text-emerald-400 focus:outline-hidden resize-none leading-relaxed font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Feedback Explanation Card after submit */}
              <AnimatePresence>
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs flex flex-col gap-2 ${
                      (currentQ.type === 'choice' &&
                        selectedOption === currentQ.correctIndex) ||
                      (currentQ.type === 'code' && codeResult?.is_correct)
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                        : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {(currentQ.type === 'choice' &&
                        selectedOption === currentQ.correctIndex) ||
                      (currentQ.type === 'code' && codeResult?.is_correct) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Correct! Great mastery of this concept.</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span>
                            Misconception Detected:{' '}
                            {codeResult?.misconception_diagnosed ||
                              currentQ.commonMisconception}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {codeResult?.feedback_intervention || currentQ.explanation}
                    </p>

                    {currentQ.solutionHint && (
                      <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{currentQ.solutionHint}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* Quiz Completed Screen */
            <div className="py-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-zinc-900 dark:text-white font-heading">
                  Quiz Completed!
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                  You scored {correctAnswersCount} / {quiz.questions.length} on{' '}
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {quiz.topicName}
                  </span>
                  . Keep building that Python mastery streak!
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold text-xs">
                  +75 Topic XP Earned
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/40">
          <span className="text-[11px] text-zinc-400 font-mono">
            {quiz.courseTitle}
          </span>

          {!isCompleted ? (
            !isAnswerSubmitted ? (
              currentQ.type === 'choice' ? (
                <button
                  onClick={handleSubmitChoice}
                  disabled={selectedOption === null}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-all cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-[#FF533D] hover:bg-[#FF4128] text-white shadow-orange-500/20 active:scale-95'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleEvaluateCode}
                  disabled={isEvaluating || !studentCode.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <span>Diagnosing...</span>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Diagnose Code</span>
                    </>
                  )}
                </button>
              )
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-md hover:scale-102 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {currentIndex + 1 < quiz.questions.length
                    ? 'Next Question'
                    : 'View Results'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
