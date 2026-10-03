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
} from './data/mockData';
import { DifficultyProvider } from './context/DifficultyContext';
import { LearnifySidebar } from './components/desktop/LearnifySidebar';
import { LearnifyHeader } from './components/desktop/LearnifyHeader';
import { CourseDashboard } from './components/desktop/CourseDashboard';
import { QuizWorkspace } from './components/desktop/QuizWorkspace';
import { QuizEngine } from './components/desktop/QuizEngine';
import { NotesAndBookmarksView } from './components/desktop/NotesAndBookmarksView';
import { StudentLogin } from './components/desktop/StudentLogin';
import { getStoredStudentSession, removeStudentSession } from './data/studentAccounts';
import { UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredStudentSession());
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string>('course-python-slicing');
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

  // Map each task/quiz ID to its corresponding Python course
  const taskCourseMap: Record<string, string> = {
    'lesson-slice-01': 'course-python-slicing',
    'lesson-func-03': 'course-python-functions',
    'lesson-comp-05': 'course-python-comprehensions',
    'lesson-algo-02': 'course-python-algorithms',
    'lesson-slice-04': 'course-python-slicing',
    // Python Sequences Slicing Quizzes
    'q-slice-01': 'course-python-slicing',
    'q-slice-02': 'course-python-slicing',
    'q-slice-03': 'course-python-slicing',
    'q-slice-04': 'course-python-slicing',
    'q-slice-05': 'course-python-slicing',
    'topic-complete-course-python-slicing': 'course-python-slicing',
    // Python Functions & Scope Quizzes
    'q-func-01': 'course-python-functions',
    'q-func-02': 'course-python-functions',
    'q-func-03': 'course-python-functions',
    'q-func-04': 'course-python-functions',
    'topic-complete-course-python-functions': 'course-python-functions',
    // Python Comprehensions Quizzes
    'q-comp-01': 'course-python-comprehensions',
    'q-comp-02': 'course-python-comprehensions',
    'q-comp-03': 'course-python-comprehensions',
    'q-comp-04': 'course-python-comprehensions',
    'topic-complete-course-python-comprehensions': 'course-python-comprehensions',
    // Algorithmic Python Quizzes
    'q-algo-01': 'course-python-algorithms',
    'q-algo-02': 'course-python-algorithms',
    'q-algo-03': 'course-python-algorithms',
    'q-algo-04': 'course-python-algorithms',
    'topic-complete-course-python-algorithms': 'course-python-algorithms',
  };

  const handleCompleteTask = (taskId: string, _courseId?: string) => {
    setCompletedTaskIds((prev) => {
      if (prev.includes(taskId)) return prev;
      const updated = [...prev, taskId];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('learnify-completed-tasks', JSON.stringify(updated));
        } catch (e) {
          console.error('Error saving completed task', e);
        }
      }
      return updated;
    });
  };

  const handleResetTasks = () => {
    setCompletedTaskIds([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learnify-completed-tasks');
    }
  };

  const handleLaunchQuiz = (courseId?: string) => {
    if (courseId) {
      setActiveCourseId(courseId);
    }
    setCurrentScreen('quiz-workspace');
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

  // Sync upcoming lessons completion state
  const syncedUpcomingLessons: UpcomingLesson[] = upcomingLessonsData.map((lesson) => {
    const isDone = completedTaskIds.includes(lesson.id);
    return {
      ...lesson,
      isCompleted: isDone,
    } as any;
  });

  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentScreen('quiz-workspace');
  };

  const handleSelectUpcomingLesson = (lesson: UpcomingLesson) => {
    setActiveCourseId(lesson.courseId);
    setCurrentScreen('quiz-workspace');
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    removeStudentSession();
    setCurrentUser(null);
    setCurrentScreen('dashboard');
  };

  // If student is not logged in, enforce Student Login Interface
  if (!currentUser) {
    return <StudentLogin onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Active student streak computed from base student streak and completed tasks
  const studentStreak = (currentUser?.streak || 5) + completedTaskIds.length;

  return (
    <DifficultyProvider>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#121214] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300 antialiased overflow-x-hidden">
        <div className="flex-1 flex w-full min-h-screen overflow-hidden">
          {/* Left Dark Sidebar */}
          <LearnifySidebar
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
            {/* Top Bar with Search, Dark Mode, Profile */}
            <LearnifyHeader
              courses={allCourses}
              onSearch={setSearchFilter}
              onSelectCourse={handleSelectCourse}
              onLaunchQuiz={() => handleLaunchQuiz()}
              currentUser={currentUser}
              onLogout={handleLogout}
              streak={studentStreak}
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
                      onLaunchQuiz={handleLaunchQuiz}
                      completedTaskIds={completedTaskIds}
                      onCompleteTask={handleCompleteTask}
                      onResetTasks={handleResetTasks}
                    />
                  </motion.div>
                )}

                {currentScreen === 'quiz-workspace' && (
                  <motion.div
                    key="quiz-workspace"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex flex-col"
                  >
                    <QuizWorkspace
                      courses={allCourses}
                      activeCourseId={activeCourseId}
                      completedTaskIds={completedTaskIds}
                      onCompleteTask={handleCompleteTask}
                      onBack={() => setCurrentScreen('dashboard')}
                    />
                  </motion.div>
                )}

                {currentScreen === 'quiz-engine' && (
                  <motion.div
                    key="quiz-engine"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 flex flex-col"
                  >
                    <QuizEngine
                      courses={allCourses}
                      activeCourseId={activeCourseId}
                      completedTaskIds={completedTaskIds}
                      onCompleteTask={handleCompleteTask}
                      onSelectCourse={handleSelectCourse}
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
    </DifficultyProvider>
  );
}
