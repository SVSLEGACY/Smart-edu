import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, RotateCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InstructorVideoThumbnailProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  totalTime: number;
  onSeek: (time: number) => void;
  lessonTitle?: string;
  className?: string;
}

export const InstructorVideoThumbnail: React.FC<InstructorVideoThumbnailProps> = ({
  isPlaying,
  onTogglePlay,
  currentTime,
  totalTime,
  onSeek,
  lessonTitle = 'Overview of public speaking',
  className = '',
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, []);

  const progressPercent = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-[#C5BAEB] dark:bg-[#201A38] shadow-lg group select-none ${className}`}
    >
      {/* Studio Backdrop & Instructor Illustration */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        {/* Soft studio ambient light background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DDD4FA] via-[#C9BCF6] to-[#B7A6EE] dark:from-[#2A234A] dark:via-[#1D1734] dark:to-[#141026]" />

        {/* Studio radial glow behind instructor */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/25 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Vector SVG representation matching Image 4 instructor */}
        <svg
          viewBox="0 0 800 480"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="sweaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <pattern id="knitTexture" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 0 6 Q 3 2 6 6 T 12 6" fill="none" stroke="#B45309" strokeWidth="0.8" opacity="0.4" />
              <path d="M 0 12 Q 3 8 6 12 T 12 12" fill="none" stroke="#B45309" strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>

          {/* Instructor Body & Pose */}
          <g transform="translate(0, 15)">
            {/* Long blonde hair behind */}
            <path
              d="M 270 210 C 260 380 290 480 320 480 L 480 480 C 510 480 540 380 530 210 C 530 110 500 70 400 70 C 300 70 270 110 270 210 Z"
              fill="url(#hairGrad)"
            />

            {/* Neck */}
            <rect x="365" y="225" width="70" height="90" rx="15" fill="url(#skinGrad)" />

            {/* Yellow knitted sweater torso */}
            <path
              d="M 230 480 C 240 340 330 300 370 295 L 430 295 C 470 300 560 340 570 480 Z"
              fill="url(#sweaterGrad)"
            />
            {/* Knit texture overlay */}
            <path
              d="M 230 480 C 240 340 330 300 370 295 L 430 295 C 470 300 560 340 570 480 Z"
              fill="url(#knitTexture)"
            />

            {/* Sweater Collar */}
            <path
              d="M 355 295 C 380 315 420 315 445 295 C 455 310 445 325 400 325 C 355 325 345 310 355 295 Z"
              fill="#D97706"
            />

            {/* Left Hand on Chest (gesture in Image 4) */}
            <g transform="translate(370, 360)">
              {/* Arm reaching inwards */}
              <path d="M 120 120 C 80 80 40 40 10 20 C -10 10 -20 20 -15 35 C 10 60 40 90 80 120 Z" fill="url(#sweaterGrad)" />
              {/* Hand with gentle fingers */}
              <ellipse cx="0" cy="10" rx="28" ry="18" fill="url(#skinGrad)" transform="rotate(-15)" />
              {/* Fingers */}
              <path d="M -22 10 Q -30 2 -26 -6 Q -18 -6 -14 6" fill="url(#skinGrad)" />
              <path d="M -14 6 Q -20 -4 -16 -12 Q -8 -10 -6 4" fill="url(#skinGrad)" />
              <path d="M -5 4 Q -9 -6 -5 -14 Q 3 -12 4 4" fill="url(#skinGrad)" />
              <path d="M 6 8 Q 5 -2 9 -8 Q 15 -6 14 8" fill="url(#skinGrad)" />
            </g>

            {/* Head & Face */}
            <ellipse cx="400" cy="190" rx="72" ry="86" fill="url(#skinGrad)" />

            {/* Front hair framing face */}
            <path
              d="M 328 170 C 330 110 360 80 400 80 C 440 80 470 110 472 170 C 460 140 420 120 400 135 C 380 120 340 140 328 170 Z"
              fill="url(#hairGrad)"
            />
            {/* Soft hair strands on sides */}
            <path d="M 328 170 Q 320 280 345 360 Q 330 270 338 180 Z" fill="url(#hairGrad)" />
            <path d="M 472 170 Q 480 280 455 360 Q 470 270 462 180 Z" fill="url(#hairGrad)" />

            {/* Glasses (Thin round dark frames like Image 4) */}
            {/* Left Frame */}
            <circle cx="366" cy="186" r="24" fill="rgba(255,255,255,0.15)" stroke="#262626" strokeWidth="3.5" />
            {/* Right Frame */}
            <circle cx="434" cy="186" r="24" fill="rgba(255,255,255,0.15)" stroke="#262626" strokeWidth="3.5" />
            {/* Bridge */}
            <path d="M 390 184 Q 400 180 410 184" fill="none" stroke="#262626" strokeWidth="3.5" />
            {/* Glasses sides */}
            <path d="M 342 184 L 328 180" stroke="#262626" strokeWidth="3" />
            <path d="M 458 184 L 472 180" stroke="#262626" strokeWidth="3" />

            {/* Eyes (warm and engaged) */}
            <ellipse cx="366" cy="186" rx="6" ry="6" fill="#1C1917" />
            <circle cx="368" cy="184" r="2" fill="#FFFFFF" />
            <ellipse cx="434" cy="186" rx="6" ry="6" fill="#1C1917" />
            <circle cx="436" cy="184" r="2" fill="#FFFFFF" />

            {/* Eyebrows */}
            <path d="M 348 162 Q 366 156 384 164" fill="none" stroke="#A16207" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 416 164 Q 434 156 452 162" fill="none" stroke="#A16207" strokeWidth="2.8" strokeLinecap="round" />

            {/* Nose */}
            <path d="M 400 184 Q 402 208 396 214 Q 404 214 406 210" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />

            {/* Warm confident smile with teeth */}
            <path d="M 378 230 Q 400 252 422 230 Z" fill="#FFFFFF" />
            <path d="M 376 229 Q 400 256 424 229" fill="none" stroke="#BE185D" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 382 231 Q 400 240 418 231" fill="none" stroke="#E11D48" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Animated Sound Wave or Live Indicator when Playing */}
        {isPlaying && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px]">STREAMING 1080p</span>
          </div>
        )}
      </div>

      {/* Center Orange Play Button (from screenshot) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <AnimatePresence>
          {(!isPlaying || showControls) && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={onTogglePlay}
              className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FF533D] hover:bg-[#FF4128] text-white shadow-xl shadow-orange-600/40 flex items-center justify-center transition-all cursor-pointer focus:outline-hidden"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white text-white" />
              ) : (
                <Play className="w-8 h-8 fill-white text-white ml-1" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Video Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-12 z-20 flex flex-col gap-2"
          >
            {/* Scrubber progress bar */}
            <div
              className="relative w-full h-2 bg-white/30 hover:h-3 rounded-full cursor-pointer transition-all group/bar"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                onSeek(ratio * totalTime);
              }}
            >
              <div
                className="h-full bg-[#FF533D] rounded-full relative transition-all"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
              </div>
            </div>

            {/* Bottom buttons row */}
            <div className="flex items-center justify-between text-white text-xs pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={onTogglePlay}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => onSeek(Math.max(0, currentTime - 10))}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSeek(Math.min(totalTime, currentTime + 10))}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-orange-400 transition-colors cursor-pointer ml-1"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-mono text-xs tabular-nums text-zinc-300">
                  {formatTime(currentTime)} / {formatTime(totalTime)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Speed selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-0.5 rounded-md hover:bg-white/20 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    {speed}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-7 right-0 bg-zinc-900 border border-zinc-700 rounded-lg p-1 shadow-xl flex flex-col gap-0.5 text-xs min-w-[70px] z-30">
                      {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSpeed(s);
                            setShowSpeedMenu(false);
                          }}
                          className={`flex items-center justify-between px-2 py-1 rounded text-left hover:bg-white/10 ${
                            speed === s ? 'text-[#FF533D] font-bold' : 'text-zinc-300'
                          }`}
                        >
                          <span>{s}x</span>
                          {speed === s && <Check className="w-3 h-3 text-[#FF533D]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    const el = document.fullscreenElement;
                    if (!el) {
                      document.documentElement.requestFullscreen?.().catch(() => {});
                    } else {
                      document.exitFullscreen?.().catch(() => {});
                    }
                  }}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
