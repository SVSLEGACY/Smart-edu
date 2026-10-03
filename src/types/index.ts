export type ScreenType = 'dashboard' | 'quiz-workspace' | 'quiz-engine' | 'notes' | 'messages' | 'bookmarks' | 'settings';

export type CategoryFilter = 'All topics' | 'Core & Slicing' | 'Functions & Scope' | 'Data Structures';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Difficult';

export interface UserProfile {
  name: string;
  handle: string;
  rollNumber?: string;
  batch?: string;
  department?: string;
  avatarUrl?: string;
  initials: string;
  notificationsCount: number;
  streak?: number;
}

export interface TopicQuizQuestion {
  id: string;
  question: string;
  type: 'code' | 'choice';
  difficulty?: DifficultyLevel;
  difficultyNum?: number;
  codeSnippet?: string;
  correctAnswer?: string;
  options?: string[];
  correctIndex?: number;
  starterCode?: string;
  solutionHint?: string;
  explanation: string;
  concept: string;
  misconceptionId?: string;
  misconceptionLabel?: string;
  commonMisconception?: string;
  learnerFlawedCode?: string;
  errorTrace?: string;
  studentExplanation?: string;
  teachingGuide?: {
    overview: string;
    whyItHappens: string;
    mentalModel: string;
    keyTakeaway: string;
  };
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

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'python-core' | 'python-syntax' | 'algorithms' | 'streak' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  icon: string;
  symbol: string;
  color: string;
  xpReward: number;
  requiredTopicId?: string;
  requiredTaskIds: string[];
  courseId?: string;
  courseTitle?: string;
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
  difficulty?: DifficultyLevel;
  isCompleted?: boolean;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  question: string;
  acceptableAnswers: string[];
  hint: string;
  progressPercent: number;
  difficulty?: DifficultyLevel;
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
