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
import { MobileCompanionApp } from './components/mobile/MobileCompanionApp';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string>('course-public-speaking');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile-preview' | 'split'>('desktop');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const allCourses = [...coursesData, recommendedCourse];
  const activeCourse =
    allCourses.find((c) => c.id === activeCourseId) || coursesData[2];

  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentScreen('course-player');
  };

  const handleSelectUpcomingLesson = (lesson: UpcomingLesson) => {
    setActiveCourseId(lesson.courseId);
    setCurrentScreen('course-player');
  };

  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'mobile-dashboard' || screen === 'mobile-quiz' || screen === 'mobile-schedule') {
      setViewMode('mobile-preview');
    } else {
      setCurrentScreen(screen);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121214] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300 antialiased overflow-x-hidden">
      {/* Outer Shell: Tablet/Desktop Application Layout */}
      {viewMode === 'desktop' ? (
        <div className="flex-1 flex w-full min-h-screen overflow-hidden">
          {/* Left Dark Sidebar (From Image 1 & 4) */}
          <LearnifySidebar
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onOpenMobileCompanion={() => setViewMode('mobile-preview')}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
            {/* Top Bar (From Image 1 & 4) */}
            <LearnifyHeader
              courses={allCourses}
              onSearch={setSearchFilter}
              onSelectCourse={handleSelectCourse}
              activeViewMode={viewMode}
              onChangeViewMode={setViewMode}
            />

            {/* Screen Content with Smooth Animated Page Transitions */}
            <main className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                {currentScreen === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex flex-col"
                  >
                    <CourseDashboard
                      courses={coursesData}
                      recommendedCourse={recommendedCourse}
                      upcomingLessons={upcomingLessonsData}
                      onSelectCourse={handleSelectCourse}
                      onSelectLesson={handleSelectUpcomingLesson}
                    />
                  </motion.div>
                )}

                {currentScreen === 'course-player' && (
                  <motion.div
                    key="course-player"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
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
      ) : (
        /* Mobile Companion App (Images 2 & 3) */
        <div className="flex-1 flex flex-col min-h-screen">
          <LearnifyHeader
            courses={allCourses}
            onSearch={setSearchFilter}
            onSelectCourse={handleSelectCourse}
            activeViewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
          <MobileCompanionApp onBackToDesktop={() => setViewMode('desktop')} />
        </div>
      )}
    </div>
  );
}
