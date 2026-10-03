/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, Course, UpcomingLesson, DifficultyLevel } from './types';
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
import { StreakActivityModal } from './components/desktop/StreakActivityModal';
import { getStoredStudentSession, removeStudentSession } from './data/studentAccounts';
import { UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredStudentSession());
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string>('course-python-syntax');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);

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
    // CSV Track 1: Syntax & Indentation
    'q-m1-indentation': 'course-python-syntax',
    'q-m2-equality': 'course-python-syntax',
    'q-m10-type-coercion': 'course-python-syntax',
    'q-correct-accumulator': 'course-python-syntax',
    'topic-complete-course-python-syntax': 'course-python-syntax',
    // CSV Track 2: Sequences, Indexing & String Immutability
    'q-m4-string-immutability': 'course-python-slicing',
    'q-m9-index-boundary': 'course-python-slicing',
    'q-slice-exclusive-stop': 'course-python-slicing',
    'q-slice-step-reversal': 'course-python-slicing',
    'topic-complete-course-python-slicing': 'course-python-slicing',
    // CSV Track 3: Memory References, Copies & Math
    'q-m7-list-copy': 'course-python-comprehensions',
    'q-m8-integer-division': 'course-python-comprehensions',
    'q-comp-dict-inversion': 'course-python-comprehensions',
    'topic-complete-course-python-comprehensions': 'course-python-comprehensions',
    // CSV Track 4: Scopes & Mutable Defaults
    'q-m3-mutable-defaults': 'course-python-functions',
    'q-m5-scope-confusion': 'course-python-functions',
    'q-func-late-binding': 'course-python-functions',
    'topic-complete-course-python-functions': 'course-python-functions',
  };

  const getCourseForTask = (taskId: string): string => {
    if (
      taskId.includes('M1_') ||
      taskId.includes('M2_') ||
      taskId.includes('M10_') ||
      taskId.includes('M8_') ||
      taskId.includes('syntax')
    ) {
      return 'course-python-syntax';
    }
    if (
      taskId.includes('M4_') ||
      taskId.includes('M7_') ||
      taskId.includes('M9_') ||
      taskId.includes('comprehensions')
    ) {
      return 'course-python-comprehensions';
    }
    if (
      taskId.includes('M3_') ||
      taskId.includes('M5_') ||
      taskId.includes('functions')
    ) {
      return 'course-python-functions';
    }
    return taskCourseMap[taskId] || 'course-python-syntax';
  };

  const handleCompleteTask = (taskId: string, courseId?: string) => {
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
      (taskId) => getCourseForTask(taskId) === course.id
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

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | undefined>(undefined);

  const handleSelectCourse = (courseId: string, level?: DifficultyLevel) => {
    setActiveCourseId(courseId);
    if (level) {
      setSelectedDifficulty(level);
    }
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
              completedTaskIds={completedTaskIds}
              onOpenStreak={() => setShowStreakModal(true)}
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

      {/* Global Student Activity Heatmap & Streak Calendar Modal */}
      <StreakActivityModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        currentStreak={studentStreak}
        completedTaskIds={completedTaskIds}
        currentUser={currentUser}
        onLaunchPractice={handleLaunchQuiz}
      />
    </DifficultyProvider>
  );
}
