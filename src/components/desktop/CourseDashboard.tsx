import React, { useState } from 'react';
import { Bookmark, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, CategoryFilter, UpcomingLesson } from '../../types';
import { Avatar, AvatarStack } from '../common/Avatar';

interface CourseDashboardProps {
  courses: Course[];
  recommendedCourse: Course;
  upcomingLessons: UpcomingLesson[];
  onSelectCourse: (courseId: string) => void;
  onSelectLesson?: (lesson: UpcomingLesson) => void;
}

export const CourseDashboard: React.FC<CourseDashboardProps> = ({
  courses,
  recommendedCourse,
  upcomingLessons,
  onSelectCourse,
  onSelectLesson,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All courses');
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({
    'course-creative-writing': true,
    'course-digital-illustration': false,
    'course-public-speaking': false,
    'course-microsoft-future-ready': false,
  });

  const categories: CategoryFilter[] = ['All courses', 'Marketing', 'Computer Science', 'Psychology'];

  const filteredCourses =
    activeCategory === 'All courses'
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
      {/* Top Section: "My courses" + Category Filter Pills */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
          My courses
        </h2>

        {/* Filter Pills matching screenshot */}
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

      {/* Main 3 Course Cards Grid */}
      <motion.section layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, idx) => {
            const isBookmarked = bookmarkedMap[course.id];
            const progressPercent = Math.round((course.progressLessons / course.totalLessons) * 100);

            // Styling customizer to match the precise colors from Image 1:
            // Card 1: Marketing / Creative Writing -> Warm Yellow #FED867
            // Card 2: Computer Science / Digital Illustration -> Soft Lilac #D7C7F9
            // Card 3: Psychology / Public Speaking -> Soft Sky Blue #BBE7FE
            const bgClass =
              course.category === 'Marketing'
                ? 'bg-[#FED867] dark:bg-[#382C10] dark:border-[#524117]'
                : course.category === 'Computer Science'
                ? 'bg-[#D7C7F9] dark:bg-[#282142] dark:border-[#3D3363]'
                : 'bg-[#BBE7FE] dark:bg-[#18314A] dark:border-[#23486E]';

            const tagBg =
              course.category === 'Marketing'
                ? 'bg-zinc-900 text-white'
                : course.category === 'Computer Science'
                ? 'bg-[#FED867] text-zinc-900 font-bold'
                : 'bg-[#D7C7F9] text-zinc-900 font-bold';

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => onSelectCourse(course.id)}
                className={`rounded-3xl p-6 flex flex-col justify-between h-72 shadow-sm border border-black/5 dark:border-white/10 cursor-pointer relative transition-shadow hover:shadow-lg ${bgClass}`}
              >
                {/* Card Header: Category Tag & Bookmark */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tagBg}`}>
                    {course.category}
                  </span>

                  <button
                    onClick={(e) => toggleBookmark(e, course.id)}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark course'}
                    className="p-1.5 text-zinc-900 dark:text-zinc-100 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${isBookmarked ? 'fill-zinc-900 dark:fill-zinc-100' : ''}`}
                    />
                  </button>
                </div>

                {/* Course Title */}
                <div className="my-auto">
                  <h3 className="text-xl font-extrabold text-zinc-950 dark:text-white leading-snug line-clamp-2 font-heading tracking-tight">
                    {course.title}
                  </h3>
                </div>

                {/* Progress Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                    <span>Progress</span>
                    <span className="font-mono tabular-nums">
                      {course.progressLessons}/{course.totalLessons} lessons
                    </span>
                  </div>

                  {/* Progress Bar with dark fill like screenshot */}
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-zinc-900 dark:bg-white rounded-full"
                    />
                  </div>
                </div>

                {/* Card Footer: Student Avatars & "Continue" Button */}
                <div className="flex items-center justify-between pt-2">
                  <AvatarStack count={course.enrolledStudentsCount} size="sm" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCourse(course.id);
                    }}
                    className="px-5 py-2 rounded-full bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.section>

      {/* Bottom Row: "My next lessons" (Left) & Recommended Dark Card (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left 2 Cols: My Next Lessons List */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-[#1E1E22] border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header: Title & "View all lessons" */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-heading">
                My next lessons
              </h3>

              <button
                onClick={() => onSelectCourse('course-public-speaking')}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
              >
                View all lessons
              </button>
            </div>

            {/* Table Columns Header */}
            <div className="grid grid-cols-12 text-xs font-semibold text-zinc-400 dark:text-zinc-500 py-2.5 px-2">
              <div className="col-span-7 sm:col-span-6">Lesson</div>
              <div className="col-span-3 sm:col-span-4">Teacher</div>
              <div className="col-span-2 text-right">Duration</div>
            </div>

            {/* Next Lessons Items (from Image 1) */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {upcomingLessons.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectLesson?.(item);
                    onSelectCourse(item.courseId);
                  }}
                  className="grid grid-cols-12 items-center py-3.5 px-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                >
                  {/* Lesson Number, Title, Course Subtitle */}
                  <div className="col-span-7 sm:col-span-6 pr-2">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors truncate">
                      {item.number}. {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                      {item.courseTitle}
                    </p>
                  </div>

                  {/* Teacher: Avatar + Name */}
                  <div className="col-span-3 sm:col-span-4 flex items-center gap-2">
                    <Avatar name={item.teacherName} size="xs" colorIndex={idx + 1} />
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate hidden sm:inline">
                      {item.teacherName}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="col-span-2 text-right">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      {item.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Dark Recommendation Card (Matching Image 1) */}
        <div className="rounded-3xl p-6 bg-[#212124] dark:bg-[#161618] border border-zinc-800 text-white flex flex-col justify-between shadow-lg relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtitle */}
          <div>
            <span className="text-xs font-medium text-zinc-400">
              New course matching your interests
            </span>

            {/* Tag */}
            <div className="mt-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FED867] text-zinc-900">
                {recommendedCourse.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-extrabold text-white mt-4 font-heading leading-tight tracking-tight">
              {recommendedCourse.title}
            </h3>
          </div>

          {/* Bottom Area: Social Proof + Button */}
          <div className="mt-6 flex flex-col gap-4">
            <div>
              <span className="text-xs text-zinc-400 block mb-2 font-medium">
                They are already studying
              </span>
              <AvatarStack count={recommendedCourse.enrolledStudentsCount} size="sm" />
            </div>

            <button
              onClick={() => onSelectCourse(recommendedCourse.id)}
              className="w-full py-3 rounded-2xl bg-[#FF533D] hover:bg-[#FF4128] text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <span>More details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
