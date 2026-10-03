import React from 'react';

export const BusinessAnalyticsIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-32 overflow-hidden flex items-end justify-center select-none ${className}`}>
      <svg viewBox="0 0 320 180" className="w-full h-full overflow-visible">
        {/* Lime green energetic starburst background (from Image 2/3) */}
        <g transform="translate(230, 90)">
          <path
            d="M 0 -70 L 15 -25 L 60 -45 L 30 -5 L 80 15 L 30 25 L 60 70 L 15 40 L 0 80 L -15 40 L -60 70 L -30 25 L -80 15 L -30 -5 L -60 -45 L -15 -25 Z"
            fill="#84CC16"
            opacity="0.85"
          />
        </g>

        {/* 3D Pie Chart floating near the person */}
        <g transform="translate(140, 115)">
          {/* Pie Slice 1 */}
          <path d="M 0 0 L 28 0 A 28 28 0 0 1 10 26 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          {/* Pie Slice 2 */}
          <path d="M 0 0 L 10 26 A 28 28 0 1 1 0 -28 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Separators */}
          <line x1="0" y1="0" x2="28" y2="0" stroke="#1E293B" strokeWidth="2" />
        </g>

        {/* Person Sitting with Laptop */}
        <g transform="translate(195, 60)">
          {/* Torso in black shirt */}
          <path d="M -30 90 C -30 55 -5 45 15 45 C 35 45 60 55 60 90 Z" fill="#18181B" />

          {/* Neck */}
          <rect x="5" y="32" width="18" height="20" rx="4" fill="#FED7AA" stroke="#18181B" strokeWidth="2" />

          {/* Head & Face in clean line art (from screenshot) */}
          <ellipse cx="14" cy="20" rx="16" ry="18" fill="#FED7AA" stroke="#18181B" strokeWidth="2.5" />

          {/* Hair - black stylized contour */}
          <path
            d="M -2 18 C -2 0 12 -2 24 2 C 32 6 32 20 28 24 C 28 8 20 5 10 7 C 0 9 -1 15 -2 18 Z"
            fill="#18181B"
          />

          {/* Eye & eyebrow */}
          <circle cx="8" cy="18" r="2" fill="#18181B" />
          <path d="M 4 13 Q 9 11 14 13" fill="none" stroke="#18181B" strokeWidth="2" />

          {/* Nose & mouth */}
          <path d="M 4 19 L 2 24 L 6 25" fill="none" stroke="#18181B" strokeWidth="1.8" />
          <path d="M 4 29 Q 8 32 12 29" fill="none" stroke="#18181B" strokeWidth="1.8" strokeLinecap="round" />

          {/* Arm extending to laptop */}
          <path
            d="M -15 65 Q -50 75 -65 90"
            fill="none"
            stroke="#FED7AA"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M -15 65 Q -50 75 -65 90"
            fill="none"
            stroke="#18181B"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Laptop open on desk */}
          <g transform="translate(-85, 68)">
            {/* Screen lid angled */}
            <path
              d="M 10 5 L 35 -18 L 35 15 L 10 38 Z"
              fill="#F1F5F9"
              stroke="#18181B"
              strokeWidth="2.5"
            />
            {/* Screen inner glow / apple-style circle */}
            <circle cx="22" cy="10" r="3" fill="#94A3B8" />
            {/* Keyboard base */}
            <path
              d="M 10 38 L 45 42 L 35 48 L 0 44 Z"
              fill="#E2E8F0"
              stroke="#18181B"
              strokeWidth="2.5"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
