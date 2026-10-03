import React, { useState } from 'react';
import { Bookmark, ArrowRight, CheckCircle2, Sparkles, Code2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, CategoryFilter, UpcomingLesson, DifficultyLevel } from '../../types';
import { AvatarStack } from '../common/Avatar';
import { pythonTopicQuizzes } from '../../data/pythonQuizzes';
import { TopicQuizModal } from './TopicQuizModal';
import { Badges } from './Badges';
import { allBadges, calculateBadgeProgress } from '../../data/badgesData';
import { useDifficulty } from '../../context/DifficultyContext';

interface CourseDashboardProps {
  courses: Course[];
  recommendedCourse: Course;
  upcomingLessons: UpcomingLesson[];
  onSelectCourse: (courseId: string, level?: DifficultyLevel) => void;
  onSelectLesson?: (lesson: UpcomingLesson) => void;
  onLaunchQuiz?: (courseId: string) => void;
  completedTaskIds?: string[];
  onCompleteTask?: (taskId: string, courseId?: string) => void;
  onResetTasks?: () => void;
}

export const CourseDashboard: React.FC<CourseDashboardProps> = ({
  courses,
  recommendedCourse,
  upcomingLessons,
  onSelectCourse,
  onSelectLesson,
  onLaunchQuiz,
  completedTaskIds = [],
  onCompleteTask,
  onResetTasks,
}) => {
  const { difficulty, getDifficultyBadgeClasses } = useDifficulty();
  const [activeCategory, setActiveCategory] = useState<string>('All courses');
  const [selectedQuizCourseId, setSelectedQuizCourseId] = useState<string | null>(null);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({
    'course-python-comprehensions': true,
    'course-python-functions': false,
    'course-python-slicing': false,
    'course-python-syntax': false,
  });

  // Filter categories matching image layout
  const categories: string[] = ['All courses', 'Data Structures', 'Functions & Scope', 'Core Syntax & Control Flow'];

  // Map courses to match the exact 3 primary tracks in reference design
  const primaryCourses = courses.filter((c) =>
    ['course-python-comprehensions', 'course-python-functions', 'course-python-syntax'].includes(c.id)
  );

  const filteredCourses =
    activeCategory === 'All courses'
      ? primaryCourses.length > 0 ? primaryCourses : courses.slice(0, 3)
      : courses.filter((c) => c.category === activeCategory);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarkedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex-1 p-6 sm:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* 1. Python Quiz Tracks Section Header & Filter Pills */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
          Python Quiz Tracks
        </h3>

        {/* Filter Pills matching screenshot */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-md'
                    : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main 3 Curriculum Cards Grid (Data Structures, Functions & Scope, Core & Slicing) */}
      <motion.section layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => {
            const isBookmarked = bookmarkedMap[course.id];
            const progressPercent = Math.round((course.progressLessons / course.totalLessons) * 100);
            const associatedBadge = allBadges.find((b) => b.courseId === course.id);
            const badgeProgress = associatedBadge
              ? calculateBadgeProgress(associatedBadge, completedTaskIds)
              : null;

            // Card Colors matching Image Reference (DO NOT CHANGE TOPIC BLOCK COLOR):
            // 1. Data Structures -> Warm Yellow #FED867
            // 2. Functions & Scope -> Soft Lilac #D7C7F9
            // 3. Core & Slicing -> Soft Sky Blue #BBE7FE
            const bgClass =
              course.category === 'Data Structures'
                ? 'bg-[#FED867] border-black/10'
                : course.category === 'Functions & Scope'
                ? 'bg-[#D7C7F9] border-black/10'
                : 'bg-[#BBE7FE] border-black/10';

            const tagBg =
              course.category === 'Data Structures'
                ? 'bg-zinc-950 text-white'
                : course.category === 'Functions & Scope'
                ? 'bg-[#FED867] text-zinc-950 font-bold border border-black/10'
                : 'bg-[#D7C7F9] text-zinc-950 font-bold border border-black/10';

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => onSelectCourse(course.id, difficulty)}
                className={`rounded-[30px] p-6 sm:p-7 flex flex-col justify-between border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl relative overflow-hidden group min-h-[320px] ${bgClass}`}
              >
                {/* Header: Tag + Bookmark Icon */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs ${tagBg}`}>
                      {course.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(e, course.id)}
                      aria-label="Bookmark Quiz Track"
                      className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          isBookmarked ? 'fill-current text-zinc-950' : 'text-zinc-800'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Course Title */}
                  <h4 className="text-xl font-extrabold text-zinc-950 mt-4 font-heading leading-tight tracking-tight">
                    {course.title}
                  </h4>

                  <p className="text-xs text-zinc-800 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {course.description}
                  </p>
                </div>

                {/* Badge Achievement Callout (if present) */}
                {associatedBadge && (
                  <div className="mt-3 p-2 rounded-xl bg-black/5 border border-black/10 flex items-center justify-between text-xs backdrop-blur-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center text-sm shadow-xs shrink-0 select-none">
                        {associatedBadge.symbol}
                      </span>
                      <span className="font-bold text-zinc-950 truncate text-[11px]">
                        {associatedBadge.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-900 shrink-0 px-2 py-0.5 rounded-md bg-black/10">
                      {badgeProgress?.completedCount}/{badgeProgress?.totalCount}
                    </span>
                  </div>
                )}

                {/* Progress Indicator */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-950 mb-1">
                    <span>Quiz Track Progress</span>
                    <span className="font-mono tabular-nums">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/15 overflow-hidden">
                    <motion.div
                      key={course.progressLessons}
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-zinc-950 rounded-full"
                    />
                  </div>
                </div>

                {/* Card Footer: Student Avatars Stack & '</> Quiz Workspace ->' Action Button */}
                <div className="flex items-center justify-between pt-3 gap-2">
                  <AvatarStack count={course.enrolledStudentsCount} size="sm" />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Passes the active course ID and the global difficulty level to workspace
                      onSelectCourse(course.id, difficulty);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    title={`Open Quiz Workspace (${difficulty} Level)`}
                  >
                    <span className="font-mono font-black text-white/90">&lt;/&gt;</span>
                    <span>Quiz Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.section>

      {/* Virtual Rewards & Skill Badges Component */}
      <section className="w-full">
        <Badges
          completedTaskIds={completedTaskIds}
          onLaunchQuiz={onLaunchQuiz}
          onSelectCourse={(id) => onSelectCourse(id, difficulty)}
        />
      </section>

      {/* Bottom Section: Active Challenges Table & Advanced Track */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 rounded-[28px] p-6 bg-white dark:bg-[#1E1E22] border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
                  Targeted Python Challenges
                </h3>
                <span className="text-xs text-zinc-400">
                  Calibrated to your active <strong className="text-zinc-900 dark:text-white">{difficulty}</strong> complexity
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectCourse('course-python-syntax', difficulty)}
                className="text-xs font-bold text-[#FF533D] hover:underline cursor-pointer"
              >
                Launch Workspace →
              </button>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 mt-2">
              {upcomingLessons.map((item) => {
                const isLessonDone = (item as any).isCompleted;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectLesson?.(item);
                      onSelectCourse(item.courseId, difficulty);
                    }}
                    className="flex items-center justify-between py-3.5 px-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-mono font-bold text-xs">
                        {item.number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold transition-colors ${
                              isLessonDone
                                ? 'line-through text-zinc-400'
                                : 'text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500'
                            }`}
                          >
                            {item.title}
                          </h4>
                          {isLessonDone && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Solved</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          {item.courseTitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {item.difficulty || difficulty}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recommended Track */}
        <div className="rounded-[28px] p-6 bg-[#1E1E22] dark:bg-[#161619] border border-zinc-800/80 dark:border-zinc-800/90 text-white flex flex-col justify-between shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="text-xs font-semibold text-zinc-400">
              Advanced Challenge Track
            </span>

            <div className="mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FED867] text-zinc-950 shadow-xs inline-block">
                {recommendedCourse.category}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mt-4 font-heading leading-tight tracking-tight">
              {recommendedCourse.title}
            </h3>

            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {recommendedCourse.description}
            </p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-1.5">
                <span>Mastery Progress</span>
                <span className="font-mono tabular-nums font-bold text-white">
                  {recommendedCourse.progressLessons}/{recommendedCourse.totalLessons} challenges
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/15 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#FED867] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (recommendedCourse.progressLessons / recommendedCourse.totalLessons) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => onSelectCourse(recommendedCourse.id, difficulty)}
              className="w-full py-3 rounded-2xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="font-mono font-bold">&lt;/&gt;</span>
              <span>Open in Quiz Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Topic Quiz Modal */}
      <AnimatePresence>
        {selectedQuizCourseId && (
          <TopicQuizModal
            quiz={
              pythonTopicQuizzes[selectedQuizCourseId] ||
              pythonTopicQuizzes['course-python-slicing']
            }
            onClose={() => setSelectedQuizCourseId(null)}
            onQuizCompleted={(_score) => {
              if (selectedQuizCourseId && onCompleteTask) {
                onCompleteTask(`topic-complete-${selectedQuizCourseId}`, selectedQuizCourseId);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDashboard;
