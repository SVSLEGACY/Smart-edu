import React from 'react';
import { motion } from 'motion/react';

interface MascotRobotProps {
  status?: 'idle' | 'happy' | 'thinking' | 'celebrating';
  size?: number;
  className?: string;
  onItemClick?: (item: string) => void;
}

export const MascotRobot: React.FC<MascotRobotProps> = ({
  status = 'idle',
  size = 240,
  className = '',
  onItemClick,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size + 40 }}
    >
      {/* Concentric ambient background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: status === 'celebrating' ? [1, 1.08, 1] : [1, 1.03, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-56 h-56 rounded-full border border-pink-300/40 dark:border-pink-500/20"
        />
        <motion.div
          animate={{
            scale: status === 'celebrating' ? [1, 1.12, 1] : [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="w-44 h-44 rounded-full border border-pink-300/60 dark:border-pink-500/30"
        />
        <div className="w-36 h-36 rounded-full bg-pink-100/70 dark:bg-pink-900/20 blur-md -z-10" />
      </div>

      {/* Floating Robot Mascot */}
      <motion.div
        animate={{
          y: status === 'celebrating' ? [-10, 5, -10] : [-5, 5, -5],
          rotate: status === 'celebrating' ? [-4, 4, -4] : [-1, 1, -1],
        }}
        transition={{
          duration: status === 'celebrating' ? 1.5 : 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-36 h-36 drop-shadow-md"
      >
        <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible">
          <defs>
            {/* Robot body gradients */}
            <linearGradient id="robotPink" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
            <linearGradient id="robotCoral" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <linearGradient id="robotFace" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCE7F3" />
              <stop offset="100%" stopColor="#FBCFE8" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ears */}
          {/* Left Ear */}
          <path d="M 40 45 L 26 22 C 24 18 30 14 36 18 L 56 36 Z" fill="url(#robotCoral)" />
          <path d="M 38 40 L 30 25 C 29 23 33 21 37 23 L 50 34 Z" fill="#9D174D" />
          {/* Right Ear */}
          <path d="M 120 45 L 134 22 C 136 18 130 14 124 18 L 104 36 Z" fill="url(#robotCoral)" />
          <path d="M 122 40 L 130 25 C 131 23 127 21 123 23 L 110 34 Z" fill="#9D174D" />

          {/* Torso/Shoulders */}
          <rect x="52" y="88" width="56" height="34" rx="16" fill="url(#robotCoral)" />
          <rect x="62" y="94" width="36" height="14" rx="7" fill="#881337" opacity="0.6" />
          <circle cx="80" cy="101" r="4" fill="#38BDF8" filter="url(#softGlow)" />

          {/* Arms */}
          {/* Left Arm */}
          <motion.g
            animate={{ rotate: status === 'celebrating' ? [-15, 20, -15] : [0, 8, 0] }}
            style={{ originX: '45px', originY: '90px' }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M 48 92 C 34 94 28 108 36 118 C 42 125 50 115 50 108 Z" fill="url(#robotPink)" />
            {/* Claws */}
            <circle cx="34" cy="120" r="3" fill="#9D174D" />
            <circle cx="40" cy="123" r="3" fill="#9D174D" />
            <circle cx="46" cy="122" r="3" fill="#9D174D" />
          </motion.g>

          {/* Right Arm */}
          <motion.g
            animate={{ rotate: status === 'celebrating' ? [15, -20, 15] : [0, -8, 0] }}
            style={{ originX: '115px', originY: '90px' }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M 112 92 C 126 94 132 108 124 118 C 118 125 110 115 110 108 Z" fill="url(#robotPink)" />
            {/* Claws */}
            <circle cx="126" cy="120" r="3" fill="#9D174D" />
            <circle cx="120" cy="123" r="3" fill="#9D174D" />
            <circle cx="114" cy="122" r="3" fill="#9D174D" />
          </motion.g>

          {/* Feet */}
          <ellipse cx="64" cy="126" rx="8" ry="6" fill="#9D174D" />
          <ellipse cx="96" cy="126" rx="8" ry="6" fill="#9D174D" />

          {/* Head Outer Shell */}
          <rect x="34" y="28" width="92" height="66" rx="30" fill="url(#robotPink)" />
          {/* Head Crest */}
          <path d="M 70 28 L 80 20 L 90 28 Z" fill="#E11D48" />
          <circle cx="80" cy="22" r="3" fill="#38BDF8" />

          {/* Head Screen / Face Visor */}
          <rect x="42" y="36" width="76" height="50" rx="22" fill="#1E1E24" />
          <rect x="44" y="38" width="72" height="46" rx="20" fill="url(#robotFace)" />

          {/* Robot Eyes (Glowing curved happy eyes) */}
          <motion.path
            d={
              status === 'thinking'
                ? 'M 54 58 A 6 6 0 0 1 66 58'
                : 'M 52 58 Q 60 50 68 58'
            }
            fill="none"
            stroke="#0F766E"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <motion.path
            d={
              status === 'thinking'
                ? 'M 94 58 A 6 6 0 0 1 106 58'
                : 'M 92 58 Q 100 50 108 58'
            }
            fill="none"
            stroke="#0F766E"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Blush spots */}
          <ellipse cx="50" cy="67" rx="5" ry="3" fill="#F472B6" opacity="0.6" />
          <ellipse cx="110" cy="67" rx="5" ry="3" fill="#F472B6" opacity="0.6" />

          {/* Cute robot mouth */}
          <path d="M 76 68 Q 80 73 84 68" fill="none" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* 3 Floating Interactive Subject Badges (Orange flask, Green cube, Purple folder) */}
      <div className="flex items-center justify-center gap-3.5 mt-2 z-20">
        {/* Beaker / Potion */}
        <motion.button
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onItemClick?.('chemistry')}
          className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center border border-orange-100 dark:border-zinc-700 cursor-pointer"
          title="Chemistry & Science"
        >
          <div className="w-5 h-5 text-orange-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.07-10.127A2 2 0 0 1 14 9.527V2" />
              <path d="M8.5 2h7" />
              <path d="M7 16h10" />
            </svg>
          </div>
        </motion.button>

        {/* 3D Isometric Green Cube */}
        <motion.button
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onItemClick?.('math')}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center border border-emerald-100 dark:border-zinc-700 cursor-pointer"
          title="Math & Spatial"
        >
          <div className="w-5 h-5 text-emerald-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="m21 16-9 5-9-5V8l9-5 9 5v8Z" />
              <path d="M3.27 6.96 12 12.01l8.73-5.05" />
              <path d="M12 22.08V12" />
            </svg>
          </div>
        </motion.button>

        {/* Purple Folder / Document */}
        <motion.button
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onItemClick?.('writing')}
          className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center border border-purple-100 dark:border-zinc-700 cursor-pointer"
          title="Writing & Literature"
        >
          <div className="w-5 h-5 text-purple-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
            </svg>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
