import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DifficultyLevel } from '../types';

interface DifficultyContextType {
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  getDifficultyColor: (level?: DifficultyLevel) => string;
  getDifficultyBadgeClasses: (level?: DifficultyLevel) => string;
}

const DifficultyContext = createContext<DifficultyContextType | undefined>(undefined);

const STORAGE_KEY = 'relearn_difficulty_level';

export const DifficultyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'Easy' || stored === 'Medium' || stored === 'Difficult') {
        return stored;
      }
    }
    return 'Medium';
  });

  const setDifficulty = (level: DifficultyLevel) => {
    setDifficultyState(level);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, level);
      } catch (e) {
        console.error('Failed to persist difficulty level', e);
      }
    }
  };

  const getDifficultyColor = (level = difficulty): string => {
    switch (level) {
      case 'Easy':
        return '#10B981'; // Emerald
      case 'Medium':
        return '#F59E0B'; // Amber
      case 'Difficult':
        return '#EF4444'; // Red
      default:
        return '#F59E0B';
    }
  };

  const getDifficultyBadgeClasses = (level = difficulty): string => {
    switch (level) {
      case 'Easy':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
      case 'Medium':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60';
      case 'Difficult':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <DifficultyContext.Provider
      value={{
        difficulty,
        setDifficulty,
        getDifficultyColor,
        getDifficultyBadgeClasses,
      }}
    >
      {children}
    </DifficultyContext.Provider>
  );
};

export const useDifficulty = (): DifficultyContextType => {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error('useDifficulty must be used within a DifficultyProvider');
  }
  return context;
};
