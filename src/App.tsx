/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, Course, UpcomingLesson } from './types';
import {
  coursesData,
  recommendedCourse,
  upcomingLessonsData,
  publicSpeakingChapters,
  publicSpeakingTimestamps,
} from './data/mockData';
import { LearnifySidebar } from './components/desktop/LearnifySidebar';
import { LearnifyHeader } from './components/desktop/LearnifyHeader';
import { CourseDashboard } from './components/desktop/CourseDashboard';
import { CoursePlayer } from './components/desktop/CoursePlayer';
import { NotesAndBookmarksView } from './components/desktop/NotesAndBookmarksView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string>('course-public-speaking');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Completed task ids for course progress
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('learnify-completed-tasks');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error('Error loading completed tasks', e);
        }
      }
    }
    return [];
  });

  // Map each task ID to its corresponding course
  const taskCourseMap: Record<string, string> = {
    'sch-1': 'course-creative-writing',
    'sch-2': 'course-public-speaking',
    'sch-3': 'course-microsoft-future-ready',
    'sch-4': 'course-digital-illustration',
    'sch-5': 'course-digital-illustration',
    'quick-dev': 'course-digital-illustration',
    'quick-math': 'course-public-speaking',
  };

  const handleResetTasks = () => {
    setCompletedTaskIds([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learnify-completed-tasks');
    }
  };

  // Dynamically compute course progress based on completed tasks
  const syncedCourses: Course[] = coursesData.map((course) => {
    const completedTasksForCourse = completedTaskIds.filter(
      (taskId) => taskCourseMap[taskId] === course.id
    );
    const bonusLessons = completedTasksForCourse.length;
    return {
      ...course,
      progressLessons: Math.min(course.totalLessons, course.progressLessons + bonusLessons),
    };
  });

  const syncedRecommendedCourse: Course = {
    ...recommendedCourse,
    progressLessons: Math.min(
      recommendedCourse.totalLessons,
      recommendedCourse.progressLessons +
        completedTaskIds.filter((taskId) => taskCourseMap[taskId] === recommendedCourse.id).length
    ),
  };

  const allCourses = [...syncedCourses, syncedRecommendedCourse];
  const activeCourse =
    allCourses.find((c) => c.id === activeCourseId) || syncedCourses[2];

  // Sync upcoming lessons completion state
  const syncedUpcomingLessons: UpcomingLesson[] = upcomingLessonsData.map((lesson) => {
    const isDone =
      (lesson.id === 'lesson-cw-01' && completedTaskIds.includes('sch-1')) ||
      (lesson.id === 'lesson-ai-05' &&
        (completedTaskIds.includes('sch-4') || completedTaskIds.includes('sch-5'))) ||
      (lesson.id === 'lesson-ps-11' && completedTaskIds.includes('sch-2'));
    return {
      ...lesson,
      isCompleted: isDone,
    } as any;
  });

  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentScreen('course-player');
  };

  const handleSelectUpcomingLesson = (lesson: UpcomingLesson) => {
    setActiveCourseId(lesson.courseId);
    setCurrentScreen('course-player');
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121214] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300 antialiased overflow-x-hidden">
      <div className="flex-1 flex w-full min-h-screen overflow-hidden">
        {/* Left Dark Sidebar */}
        <LearnifySidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Bar with Search, Dark Mode, Profile */}
          <LearnifyHeader
            courses={allCourses}
            onSearch={setSearchFilter}
            onSelectCourse={handleSelectCourse}
          />

          {/* Screen Content with Smooth Animated Page Transitions */}
          <main className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {currentScreen === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col"
                >
                  <CourseDashboard
                    courses={syncedCourses}
                    recommendedCourse={syncedRecommendedCourse}
                    upcomingLessons={syncedUpcomingLessons}
                    onSelectCourse={handleSelectCourse}
                    onSelectLesson={handleSelectUpcomingLesson}
                    completedTaskIds={completedTaskIds}
                    onResetTasks={handleResetTasks}
                  />
                </motion.div>
              )}

              {currentScreen === 'course-player' && (
                <motion.div
                  key="course-player"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col"
                >
                  <CoursePlayer
                    course={activeCourse}
                    chapters={publicSpeakingChapters}
                    timestamps={publicSpeakingTimestamps}
                    onBack={() => setCurrentScreen('dashboard')}
                  />
                </motion.div>
              )}

              {(currentScreen === 'notes' ||
                currentScreen === 'bookmarks' ||
                currentScreen === 'messages' ||
                currentScreen === 'settings') && (
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="flex-1 flex flex-col"
                >
                  <NotesAndBookmarksView
                    type={currentScreen}
                    courses={allCourses}
                    onSelectCourse={handleSelectCourse}
                    onBack={() => setCurrentScreen('dashboard')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
