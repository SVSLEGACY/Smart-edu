import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'student' | 'teacher' | 'kacie' | 'len';
  colorIndex?: number;
}

const colorPalettes = [
  { bg: 'bg-amber-400 dark:bg-amber-500', text: 'text-amber-950', ring: 'ring-amber-200' },
  { bg: 'bg-pink-400 dark:bg-pink-500', text: 'text-pink-950', ring: 'ring-pink-200' },
  { bg: 'bg-indigo-400 dark:bg-indigo-500', text: 'text-indigo-950', ring: 'ring-indigo-200' },
  { bg: 'bg-emerald-400 dark:bg-emerald-500', text: 'text-emerald-950', ring: 'ring-emerald-200' },
  { bg: 'bg-sky-400 dark:bg-sky-500', text: 'text-sky-950', ring: 'ring-sky-200' },
  { bg: 'bg-purple-400 dark:bg-purple-500', text: 'text-purple-950', ring: 'ring-purple-200' },
];

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
  variant,
  colorIndex = 0,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-14 h-14 text-lg font-bold',
  };

  const palette = colorPalettes[Math.abs(colorIndex) % colorPalettes.length];

  // Specific render for Kacie Velasquez (blond hair, warm look)
  if (variant === 'kacie' || name.toLowerCase().includes('kacie')) {
    return (
      <div
        className={`${sizeMap[size]} rounded-full overflow-hidden shrink-0 border-2 border-orange-400/50 shadow-sm relative bg-[#FED7AA] flex items-center justify-center ${className}`}
        title={name}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#FED7AA" />
          {/* Hair back */}
          <path d="M22 45 C20 75 30 90 35 100 L65 100 C70 90 80 75 78 45 C78 25 70 14 50 14 C30 14 22 25 22 45 Z" fill="#EAB308" />
          {/* Neck */}
          <path d="M42 62 L58 62 L58 75 L42 75 Z" fill="#FDBA74" />
          {/* Shoulders yellow knit */}
          <path d="M20 100 C20 78 35 70 50 70 C65 70 80 78 80 100 Z" fill="#F59E0B" />
          {/* Face */}
          <ellipse cx="50" cy="46" rx="20" ry="24" fill="#FED7AA" />
          {/* Hair front bangs */}
          <path d="M28 35 C32 20 50 16 72 25 C66 38 58 40 45 35 C35 30 30 35 28 35 Z" fill="#FACC15" />
          {/* Round Glasses */}
          <circle cx="41" cy="45" r="7" fill="none" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="59" cy="45" r="7" fill="none" stroke="#78350F" strokeWidth="2.5" />
          <path d="M48 45 L52 45" stroke="#78350F" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="41" cy="45" r="2.5" fill="#451A03" />
          <circle cx="59" cy="45" r="2.5" fill="#451A03" />
          {/* Smile */}
          <path d="M44 56 Q50 62 56 56" fill="none" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Specific render for Len (young student with yellow top)
  if (variant === 'len' || name.toLowerCase().includes('len')) {
    return (
      <div
        className={`${sizeMap[size]} rounded-full overflow-hidden shrink-0 border-2 border-pink-400/80 shadow-sm relative bg-[#FCE7F3] flex items-center justify-center ${className}`}
        title={name}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="#FCE7F3" />
          {/* Dark hair */}
          <path d="M26 40 C24 20 40 12 50 12 C60 12 76 20 74 40 C70 24 55 22 45 23 C35 24 28 32 26 40 Z" fill="#1E293B" />
          {/* Face */}
          <ellipse cx="50" cy="48" rx="21" ry="24" fill="#FED7AA" />
          {/* Yellow shirt */}
          <path d="M22 100 C22 78 35 72 50 72 C65 72 78 78 78 100 Z" fill="#EAB308" />
          {/* Eyes */}
          <circle cx="42" cy="46" r="3" fill="#1E293B" />
          <circle cx="58" cy="46" r="3" fill="#1E293B" />
          {/* Smile */}
          <path d="M44 58 Q50 63 56 58" fill="none" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Teacher / Student dynamic avatars
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${sizeMap[size]} ${palette.bg} ${palette.text} rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-xs border border-white/60 dark:border-black/40 ${className}`}
      title={name}
    >
      <span className="font-heading tracking-tight select-none">{initials}</span>
    </div>
  );
};

interface AvatarStackProps {
  count?: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  count = 120,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] -ml-2 border-2 border-white dark:border-zinc-900',
    sm: 'w-7 h-7 text-xs -ml-2.5 border-2 border-white dark:border-zinc-900',
    md: 'w-8 h-8 text-xs -ml-3 border-2 border-white dark:border-zinc-900',
  };

  const sampleAvatars = [
    { name: 'Alex Rivera', color: 'bg-amber-400 text-amber-950' },
    { name: 'Chloe Dubois', color: 'bg-rose-400 text-rose-950' },
    { name: 'David Park', color: 'bg-cyan-400 text-cyan-950' },
  ];

  return (
    <div className={`flex items-center ${className}`}>
      {sampleAvatars.map((person, index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${person.color} rounded-full flex items-center justify-center font-semibold shrink-0 shadow-xs first:ml-0`}
          title={person.name}
        >
          {person.name[0]}
        </div>
      ))}
      <div
        className={`${sizeClasses[size]} bg-zinc-900 text-white dark:bg-zinc-700 dark:text-zinc-100 rounded-full flex items-center justify-center font-bold shrink-0 shadow-xs text-[11px]`}
      >
        +{count}
      </div>
    </div>
  );
};
