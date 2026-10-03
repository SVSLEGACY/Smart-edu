import { DifficultyLevel } from './index';

export interface DiagnosticPayload {
  current_concept: string;
  original_question: string;
  student_code: string;
  attempt_number: number;
  mastery_streak: number;
  mastery_target: number;
  misconception_history: string[];
  concepts_remaining: string[];
  difficulty?: DifficultyLevel;
}

export interface DiagnosticResult {
  is_correct: boolean;
  classification: 'correct' | 'slip' | 'misconception';
  misconception_diagnosed: string | null;
  evidence: string | null;
  feedback_intervention: string;
  hint_level: 0 | 1 | 2 | 3;
  next_action: 'advance' | 'reassess' | 'review_prerequisite';
  next_question: string;
  reassessment_question?: string;
  difficulty?: DifficultyLevel;
  mastery_streak: number;
  loop_status: 'continue' | 'complete';
}

export interface TutorSessionState {
  attempt_number: number;
  mastery_streak: number;
  misconception_history: string[];
  current_concept: string;
  current_question: string;
  concepts_remaining: string[];
  mastery_target: number;
  submissions_count: number;
  is_complete: boolean;
  difficulty: DifficultyLevel;
}

export interface ConceptCurriculum {
  id: string;
  name: string;
  description: string;
  category: string;
  firstQuestion: string;
  starterCode: string;
  prerequisite: string;
  difficulty?: DifficultyLevel;
  sampleMisconceptions: {
    label: string;
    code: string;
    expectedMisconception: string;
  }[];
}
