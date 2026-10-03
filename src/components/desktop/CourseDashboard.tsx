import React, { useState } from 'react';
import { Bookmark, ArrowRight, CheckCircle2, Sparkles, RefreshCw, HelpCircle, Code2, Flame, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, CategoryFilter, UpcomingLesson } from '../../types';
import { AvatarStack } from '../common/Avatar';
import { pythonTopicQuizzes } from '../../data/pythonQuizzes';
import { TopicQuizModal } from './TopicQuizModal';
import { Badges } from './Badges';
import { allBadges, calculateBadgeProgress } from '../../data/badgesData';
import { DifficultySelector } from './DifficultySelector';
import { useDifficulty } from '../../context/DifficultyContext';

interface CourseDashboardProps {
  courses: Course[];
  recommendedCourse: Course;
  upcomingLessons: UpcomingLesson[];
  onSelectCourse: (courseId: string) => void;
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
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All topics');
  const [selectedQuizCourseId, setSelectedQuizCourseId] = useState<string | null>(null);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({
    'course-python-comprehensions': true,
    'course-python-functions': false,
    'course-python-slicing': false,
    'course-python-algorithms': false,
  });

  const categories: CategoryFilter[] = ['All topics', 'Core & Slicing', 'Functions & Scope', 'Data Structures'];

  const filteredCourses =
    activeCategory === 'All topics'
      ? courses
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
      {/* Top Banner with Adaptive Difficulty Selector */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1E1E22] p-6 rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF533D]/10 text-[#FF533D]">
              Misconception Diagnostic Engine
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadgeClasses()}`}>
              Active: {difficulty}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading mt-1">
            Python Mastery Curriculum
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Choose your difficulty level. The diagnostic evaluator isolates mental models, diagnoses misconceptions, and generates targeted follow-up challenges.
          </p>
        </div>

        <DifficultySelector compact />
      </section>

      {/* Top Section: Category Filter Pills */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
          Python Quiz Tracks
        </h3>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
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

      {/* Main 3 Topic Quiz Cards Grid */}
      <motion.section layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => {
            const isBookmarked = bookmarkedMap[course.id];
            const progressPercent = Math.round((course.progressLessons / course.totalLessons) * 100);
            const associatedBadge = allBadges.find((b) => b.courseId === course.id);
            const badgeProgress = associatedBadge
              ? calculateBadgeProgress(associatedBadge, completedTaskIds)
              : null;

            const bgClass =
              course.category === 'Data Structures'
                ? 'bg-[#FED867] dark:bg-[#382C10] dark:border-[#524117]'
                : course.category === 'Functions & Scope'
                ? 'bg-[#D7C7F9] dark:bg-[#282142] dark:border-[#3D3363]'
                : 'bg-[#BBE7FE] dark:bg-[#18314A] dark:border-[#23486E]';

            const tagBg =
              course.category === 'Data Structures'
                ? 'bg-zinc-900 text-white'
                : course.category === 'Functions & Scope'
                ? 'bg-[#FED867] text-zinc-900 font-bold'
                : 'bg-[#D7C7F9] text-zinc-900 font-bold';

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => onSelectCourse(course.id)}
                className={`rounded-3xl p-6 flex flex-col justify-between border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg relative overflow-hidden group min-h-[300px] ${bgClass}`}
              >
                {/* Header: Tag + Bookmark Icon */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs ${tagBg}`}>
                      {course.category}
                    </span>

                    <button
                      onClick={(e) => toggleBookmark(e, course.id)}
                      aria-label="Bookmark Quiz Track"
                      className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          isBookmarked ? 'fill-current text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Course Title */}
                  <h4 className="text-xl font-extrabold text-zinc-900 dark:text-white mt-4 font-heading leading-tight tracking-tight">
                    {course.title}
                  </h4>

                  <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Badge Achievement Callout */}
                {associatedBadge && (
                  <div className="mt-3 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-sm">{associatedBadge.icon}</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-[11px]">
                        {associatedBadge.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
                      {badgeProgress?.completedCount}/{badgeProgress?.totalCount}
                    </span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-200 mb-1">
                    <span>Quiz Track Progress</span>
                    <span className="font-mono tabular-nums">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      key={course.progressLessons}
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-zinc-900 dark:bg-white rounded-full"
                    />
                  </div>
                </div>

                {/* Card Footer: Student Avatars & "Solve in Workspace" Button */}
                <div className="flex items-center justify-between pt-3">
                  <AvatarStack count={course.enrolledStudentsCount} size="sm" />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Quiz Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
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
          onSelectCourse={onSelectCourse}
        />
      </section>

      {/* Bottom Row: Active Question Challenges & Recommended Algorithm Track */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left 2 Cols: Active Quiz Challenges */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-[#1E1E22] border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
                  Targeted Python Challenges
                </h3>
                <span className="text-xs text-zinc-400">
                  Evaluated at current <strong className="text-zinc-900 dark:text-white">{difficulty}</strong> complexity
                </span>
              </div>

              <button
                onClick={() => onSelectCourse('course-python-slicing')}
                className="text-xs font-bold text-[#FF533D] hover:underline cursor-pointer"
              >
                Launch Full Workspace →
              </button>
            </div>

            {/* Questions Table */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 mt-2">
              {upcomingLessons.map((item) => {
                const isLessonDone = (item as any).isCompleted;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectLesson?.(item);
                      onSelectCourse(item.courseId);
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

        {/* Right 1 Col: Recommended Advanced Algorithm Card */}
        <div className="rounded-3xl p-6 bg-[#1E1E22] dark:bg-[#161619] border border-zinc-800/80 dark:border-zinc-800/90 text-white flex flex-col justify-between shadow-md relative overflow-hidden group">
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

            {/* Progress indicator */}
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
              onClick={() => onSelectCourse(recommendedCourse.id)}
              className="w-full py-3 rounded-2xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Enter Algorithmic Workspace</span>
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
