import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Clock,
  Star,
  Share2,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  Download,
  FileText,
  Send,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, LessonChapter, SubLesson, VideoTimestamp } from '../../types';
import { InstructorVideoThumbnail } from '../common/InstructorVideoThumbnail';

interface CoursePlayerProps {
  course: Course;
  chapters: LessonChapter[];
  timestamps: VideoTimestamp[];
  onBack: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  chapters,
  timestamps,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'materials' | 'hometask'>('description');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'chapter-01': true,
  });
  const [activeSubLessonId, setActiveSubLessonId] = useState<string>('sub-01');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const totalVideoDuration = 8 * 60; // 8 minutes (480s)
  const [sharedToast, setSharedToast] = useState<boolean>(false);
  const [taskSubmitted, setTaskSubmitted] = useState<boolean>(false);
  const [taskText, setTaskText] = useState<string>('');

  // Simulated video playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalVideoDuration) {
            setIsPlaying(false);
            return totalVideoDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalVideoDuration]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  // Find currently active sublesson title
  let currentSubLesson: SubLesson | undefined;
  for (const ch of chapters) {
    const found = ch.subLessons.find((sl) => sl.id === activeSubLessonId);
    if (found) {
      currentSubLesson = found;
      break;
    }
  }

  return (
    <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      <AnimatePresence>
        {sharedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-xl z-50 text-xs font-semibold flex items-center gap-2 border border-zinc-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Lesson share link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Breadcrumb Path (Matching Image 4) */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 overflow-x-auto whitespace-nowrap">
        <button
          onClick={onBack}
          className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          My courses
        </button>
        <span>/</span>
        <button
          onClick={onBack}
          className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {course.title}
        </button>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-200 font-semibold truncate">
          Lesson 1. Introduction to Public Speaking ...
        </span>
      </nav>

      {/* Header Bar with Back Button & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Back and Title */}
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 group cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors shadow-xs">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-heading tracking-tight">
            {course.title}
          </h2>
        </button>

        {/* 3 Yellow Badges (from Image 4) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FED867] text-zinc-900 text-xs font-bold shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>6 lessons</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FED867] text-zinc-900 text-xs font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>3h 25min</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FED867] text-zinc-900 text-xs font-bold shadow-xs">
            <Star className="w-3.5 h-3.5 fill-zinc-900" />
            <span>4.8 (86 reviews)</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Video & Content (Left) vs Curriculum Accordion (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Video Player + Tabs + Description (7 or 8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Main Video Frame */}
          <InstructorVideoThumbnail
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            currentTime={currentTime}
            totalTime={totalVideoDuration}
            onSeek={handleSeek}
            lessonTitle={currentSubLesson?.title}
          />

          {/* Controls Bar under Video: Tabs & Share button */}
          <div className="flex items-center justify-between gap-4 pt-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
            {/* Tabs: Description, Materials, Home task */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'description'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                Description
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'materials'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                Materials
              </button>

              <button
                onClick={() => setActiveTab('hometask')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'hometask'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                Home task
              </button>
            </div>

            {/* Share Lesson Button (Matching Image 4) */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-orange-500" />
              <span>Share lesson</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
            {activeTab === 'description' && (
              <div className="flex flex-col gap-5">
                {/* Main Paragraph from Image 4 */}
                <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
                  Public speaking is an essential skill that plays a significant role in both
                  personal and professional development. Whether you're delivering a speech at a
                  conference, giving a presentation at work, or speaking at a social event, being
                  able to communicate effectively in front of an audience is invaluable.
                </p>

                {/* Timestamps Chapter Index (Clickable to Seek) */}
                <div className="flex flex-col gap-2 pt-2">
                  <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Video Chapters
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {timestamps.map((ts) => {
                      const isCurrentChapter =
                        currentTime >= ts.timeSeconds &&
                        (!timestamps.find((t) => t.timeSeconds > ts.timeSeconds) ||
                          currentTime <
                            (timestamps.find((t) => t.timeSeconds > ts.timeSeconds)?.timeSeconds ||
                              9999));

                      return (
                        <button
                          key={ts.timeSeconds}
                          onClick={() => {
                            handleSeek(ts.timeSeconds);
                            setIsPlaying(true);
                          }}
                          className={`flex items-center gap-3 text-left py-1 px-2 rounded-lg transition-colors cursor-pointer group ${
                            isCurrentChapter
                              ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          <span className="font-mono text-xs tabular-nums text-zinc-500 dark:text-zinc-400 group-hover:text-orange-500">
                            {ts.displayTime}
                          </span>
                          <span className="text-sm">{ts.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Supplementary course documents and workbook exercises for Lesson 01:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-900 dark:text-white">
                          Public Speaking Cheatsheet.pdf
                        </h5>
                        <span className="text-[11px] text-zinc-400">2.4 MB · 12 Pages</span>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-900 dark:text-white">
                          Speech Structure Template.docx
                        </h5>
                        <span className="text-[11px] text-zinc-400">1.1 MB · Fillable</span>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hometask' && (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200">
                  <h5 className="text-xs font-bold mb-1">Homework Prompt: 60-Second Hook</h5>
                  <p className="text-xs leading-relaxed">
                    Record or write out an opening hook for an audience of prospective clients. Introduce
                    a surprising statistic or relatable dilemma within the first 15 seconds.
                  </p>
                </div>

                {taskSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold">
                      Your response has been submitted! Teacher feedback will be available within 24 hours.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={taskText}
                      onChange={(e) => setTaskText(e.target.value)}
                      placeholder="Type your speech hook draft here..."
                      rows={3}
                      className="w-full p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/30"
                    />
                    <button
                      onClick={() => {
                        if (taskText.trim()) setTaskSubmitted(true);
                      }}
                      className="self-end px-4 py-2 rounded-xl bg-[#FF533D] hover:bg-[#FF4128] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Feedback</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Accordion Curriculum (4 or 5 Cols) Matching Image 4 */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-3xl p-5 bg-white dark:bg-[#1E1E22] border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight uppercase">
              Course Content
            </h3>
            <span className="text-xs text-zinc-400 font-mono">6 Chapters</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 flex flex-col">
            {chapters.map((chapter) => {
              const isExpanded = !!expandedChapters[chapter.id];

              return (
                <div key={chapter.id} className="py-2.5">
                  {/* Chapter Header Toggle */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-center justify-between text-left py-1 hover:text-orange-500 transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 pr-3">
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors">
                        {chapter.number}. {chapter.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-zinc-400 font-mono tabular-nums">
                        {chapter.duration}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Sub-Lessons list (as in Image 4) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden flex flex-col gap-1.5 pt-3 pl-3 pr-1"
                      >
                        {chapter.subLessons.map((sub) => {
                          const isActive = sub.id === activeSubLessonId;

                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setActiveSubLessonId(sub.id);
                                setIsPlaying(true);
                              }}
                              className={`flex items-center justify-between text-left p-2 rounded-xl text-xs transition-colors cursor-pointer group ${
                                isActive
                                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate pr-2">
                                <Play
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isActive
                                      ? 'fill-[#FF533D] text-[#FF533D]'
                                      : 'fill-zinc-400 text-zinc-400 group-hover:fill-zinc-700'
                                  }`}
                                />
                                <span className="truncate">{sub.title}</span>
                              </div>

                              <span className="font-mono text-zinc-400 text-[11px] tabular-nums shrink-0">
                                {sub.duration}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
