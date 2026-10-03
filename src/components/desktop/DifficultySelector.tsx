import React from 'react';
import { motion } from 'motion/react';
import { Zap, Sparkles, Flame, Check } from 'lucide-react';
import { useDifficulty } from '../../context/DifficultyContext';
import { DifficultyLevel } from '../../types';

interface DifficultySelectorProps {
  className?: string;
  compact?: boolean;
  onLevelChange?: (level: DifficultyLevel) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  className = '',
  compact = false,
  onLevelChange,
}) => {
  const { difficulty, setDifficulty } = useDifficulty();

  const levels: {
    id: DifficultyLevel;
    label: string;
    description: string;
    icon: React.ReactNode;
    activeBg: string;
    activeText: string;
    badgeColor: string;
  }[] = [
    {
      id: 'Easy',
      label: 'Easy',
      description: 'Core syntax, basic indexing & direct operations',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      activeBg: 'bg-emerald-500 text-white shadow-emerald-500/25',
      activeText: 'text-emerald-600 dark:text-emerald-400',
      badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'Medium',
      label: 'Medium',
      description: 'Boundary math, scope rules & mutable defaults',
      icon: <Flame className="w-3.5 h-3.5" />,
      activeBg: 'bg-amber-500 text-white shadow-amber-500/25',
      activeText: 'text-amber-600 dark:text-amber-400',
      badgeColor: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 'Difficult',
      label: 'Difficult',
      description: 'Algorithmic recursion, frame unwinding & comprehensions',
      icon: <Zap className="w-3.5 h-3.5" />,
      activeBg: 'bg-[#FF533D] text-white shadow-orange-500/25',
      activeText: 'text-rose-600 dark:text-rose-400',
      badgeColor: 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
    },
  ];

  const handleSelect = (level: DifficultyLevel) => {
    setDifficulty(level);
    onLevelChange?.(level);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {!compact && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-[10px]">
            Adaptive Question Difficulty
          </span>
          <span className="font-semibold text-zinc-500 dark:text-zinc-400 text-[11px]">
            Current: <strong className="text-zinc-900 dark:text-white">{difficulty}</strong>
          </span>
        </div>
      )}

      <div className="inline-flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 shadow-inner">
        {levels.map((lvl) => {
          const isSelected = difficulty === lvl.id;

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleSelect(lvl.id)}
              className={`relative flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                isSelected
                  ? `${lvl.activeBg} shadow-md scale-[1.02]`
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {lvl.icon}
              <span>{lvl.label}</span>
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
