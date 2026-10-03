import { UserProfile } from '../types';

export interface StudentAccount {
  rollNumber: string;
  password: string;
  name: string;
  handle: string;
  department: string;
  batch: string;
  initials: string;
  streak: number;
}

export const registeredStudents: StudentAccount[] = [
  {
    rollNumber: 'PY-2026-042',
    password: 'python123',
    name: 'Kacie Velasquez',
    handle: '@k_velasquez',
    department: 'Computer Science & Engineering',
    batch: 'Class of 2026',
    initials: 'KV',
    streak: 8,
  },
  {
    rollNumber: 'PY-2026-108',
    password: 'python123',
    name: 'Aarav Sharma',
    handle: '@aarav_s',
    department: 'AI & Data Engineering',
    batch: 'Class of 2026',
    initials: 'AS',
    streak: 12,
  },
  {
    rollNumber: 'PY-2026-077',
    password: 'python123',
    name: 'Elena Vance',
    handle: '@elena_v',
    department: 'Software Architecture',
    batch: 'Class of 2027',
    initials: 'EV',
    streak: 5,
  },
  {
    rollNumber: 'PY-2026-015',
    password: 'python123',
    name: 'Marcus Chen',
    handle: '@m_chen',
    department: 'Distributed Systems',
    batch: 'Class of 2025',
    initials: 'MC',
    streak: 14,
  },
];

const SESSION_STORAGE_KEY = 'relearn_student_session';

export function getStoredStudentSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading student session:', err);
    return null;
  }
}

export function saveStudentSession(user: UserProfile, remember: boolean = true): void {
  if (typeof window === 'undefined') return;
  try {
    if (remember) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed saving student session:', err);
  }
}

export function removeStudentSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed removing student session:', err);
  }
}

export function authenticateStudentCredentials(
  rollInput: string,
  passInput: string
): { success: boolean; error?: string; user?: UserProfile } {
  const cleanRoll = rollInput.trim();
  const cleanPass = passInput.trim();

  if (!cleanRoll) {
    return { success: false, error: 'Please enter your student Roll Number.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Please enter your password.' };
  }
  if (cleanPass.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  // Check known accounts (case-insensitive roll number)
  const matched = registeredStudents.find(
    (s) => s.rollNumber.toLowerCase() === cleanRoll.toLowerCase()
  );

  if (matched) {
    if (matched.password !== cleanPass) {
      return {
        success: false,
        error: 'Incorrect password for Roll Number ' + matched.rollNumber + '. (Hint: demo password is python123)',
      };
    }

    return {
      success: true,
      user: {
        name: matched.name,
        handle: matched.handle,
        rollNumber: matched.rollNumber,
        department: matched.department,
        batch: matched.batch,
        initials: matched.initials,
        notificationsCount: 3,
        streak: matched.streak || 5,
      },
    };
  }

  // If a student enters their own roll number, allow automatic enrollment/login
  const formattedName = cleanRoll.toUpperCase();
  const initials = cleanRoll.slice(0, 2).toUpperCase() || 'ST';

  return {
    success: true,
    user: {
      name: `Student (${cleanRoll.toUpperCase()})`,
      handle: `@${cleanRoll.toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
      rollNumber: cleanRoll.toUpperCase(),
      department: 'Python Academy',
      batch: 'Class of 2026',
      initials,
      notificationsCount: 1,
      streak: 3,
    },
  };
}
