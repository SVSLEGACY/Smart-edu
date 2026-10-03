export type ScreenType = 'dashboard' | 'course-player' | 'quiz-engine' | 'notes' | 'messages' | 'bookmarks' | 'settings';

export type CategoryFilter = 'All courses' | 'Core & Slicing' | 'Functions & Scope' | 'Data Structures';

export interface UserProfile {
  name: string;
  handle: string;
  avatarUrl?: string;
  initials: string;
  notificationsCount: number;
}

export interface TopicQuizQuestion {
  id: string;
  question: string;
  type: 'code' | 'choice';
  codeSnippet?: string;
  options?: string[];
  correctIndex?: number;
  starterCode?: string;
  solutionHint?: string;
  explanation: string;
  concept: string;
  commonMisconception?: string;
}

export interface TopicQuiz {
  courseId: string;
  courseTitle: string;
  topicName: string;
  questions: TopicQuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  bgColorLight: string;
  bgColorDark: string;
  borderColorLight: string;
  borderColorDark: string;
  textColorLight: string;
  textColorDark: string;
  badgeBg: string;
  badgeText: string;
  progressLessons: number;
  totalLessons: number;
  enrolledStudentsCount: number;
  isBookmarked: boolean;
  quizzesCount?: number;
  instructor: {
    name: string;
    avatar: string;
    role: string;
  };
  duration: string;
  rating: number;
  reviewCount: number;
  description: string;
}

export interface SubLesson {
  id: string;
  title: string;
  duration: string;
  durationMinutes: number;
  isCompleted?: boolean;
}

export interface LessonChapter {
  id: string;
  number: string;
  title: string;
  duration: string;
  subLessons: SubLesson[];
}

export interface UpcomingLesson {
  id: string;
  number: string;
  title: string;
  courseTitle: string;
  teacherName: string;
  teacherAvatar: string;
  duration: string;
  courseId: string;
}

export interface VideoTimestamp {
  timeSeconds: number;
  displayTime: string;
  title: string;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  acceptableAnswers: string[];
  hint: string;
  progressPercent: number;
}

export interface ScheduleItem {
  id: string;
  timeSlot: string;
  subject: string;
  timeRange: string;
  colorClass: string;
  darkColorClass: string;
  duration: string;
  icon?: string;
  note?: string;
  isCompleted?: boolean;
  courseId?: string;
  lessonTitle?: string;
}
