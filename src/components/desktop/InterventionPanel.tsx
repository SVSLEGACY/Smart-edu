import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Code2,
  Sparkles,
  Flame,
  RotateCcw,
  Target,
} from 'lucide-react';
import { DiagnosticResult } from '../../types/tutor';
import { DifficultyLevel } from '../../types';

interface InterventionPanelProps {
  result: DiagnosticResult | null;
  difficulty: DifficultyLevel;
  onApplyReassessment?: (newQuestion: string) => void;
  onRetryQuestion?: () => void;
  onAdvanceNext?: () => void;
}

export const InterventionPanel: React.FC<InterventionPanelProps> = ({
  result,
  difficulty,
  onApplyReassessment,
  onRetryQuestion,
  onAdvanceNext,
}) => {
  if (!result) return null;

  const isCorrect = result.is_correct;
  const reassessmentQuestion = result.reassessment_question || result.next_question;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isCorrect ? 'correct-panel' : 'intervention-panel'}
        initial={{ opacity: 0, y: 16, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: 16, height: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full overflow-hidden"
      >
        <div
          className={`rounded-3xl p-6 sm:p-7 border shadow-lg transition-all ${
            isCorrect
              ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
              : 'bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-transparent border-amber-500/30 text-amber-950 dark:text-amber-100'
          }`}
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isCorrect
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300'
                    }`}
                  >
                    {isCorrect
                      ? 'Demonstrated Understanding'
                      : result.classification === 'slip'
                      ? 'Careless Slip Diagnosed'
                      : 'Underlying Misconception Diagnosed'}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Difficulty: <strong className="text-zinc-900 dark:text-white">{difficulty}</strong>
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5 font-heading">
                  {isCorrect
                    ? 'Concept Mastered!'
                    : result.misconception_diagnosed || 'Faulty Concept Model Detected'}
                </h4>
              </div>
            </div>

            {/* Streak & XP Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-zinc-800/80 border border-black/5 dark:border-white/10 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>Streak: {result.mastery_streak}</span>
              </div>
              {isCorrect && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+50 XP</span>
                </div>
              )}
            </div>
          </div>

          {/* Intervention Body */}
          <div className="py-4 flex flex-col gap-4 text-xs sm:text-sm">
            {/* Flawed Code Evidence (if diagnosed) */}
            {!isCorrect && result.evidence && (
              <div className="p-3.5 rounded-2xl bg-zinc-950 text-zinc-200 border border-zinc-800/80 font-mono text-xs flex flex-col gap-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800/70 pb-1">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Evidence of Misconception in Submission</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">Trace point</span>
                </div>
                <pre className="text-rose-400 whitespace-pre-wrap font-mono py-1">
                  {result.evidence}
                </pre>
              </div>
            )}

            {/* Targeted AI Explanation / Intervention */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
                  Targeted Pedagogical Intervention
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  {result.feedback_intervention}
                </p>
              </div>
            </div>

            {/* Dynamic Reassessment Question Section */}
            {!isCorrect && reassessmentQuestion && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                      Dynamic Reassessment Challenge ({difficulty} Level)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                    Verify Resolution
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white leading-relaxed">
                  {reassessmentQuestion}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  {onApplyReassessment && (
                    <button
                      type="button"
                      onClick={() => onApplyReassessment(reassessmentQuestion)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load Reassessment into Workspace</span>
                    </button>
                  )}

                  {onRetryQuestion && (
                    <button
                      type="button"
                      onClick={onRetryQuestion}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Original Question</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {isCorrect && onAdvanceNext && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onAdvanceNext}
                className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:scale-102 active:scale-95 transition-all"
              >
                <span>Advance to Next Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterventionPanel;
