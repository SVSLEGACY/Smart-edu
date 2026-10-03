-- ====================================================================
-- Re:Learn Supabase / PostgreSQL Learner Model Schema Migration
-- ====================================================================

-- 1. Create or ensure Difficulty Level ENUM / Constraint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level_type') THEN
    CREATE TYPE difficulty_level_type AS ENUM ('Easy', 'Medium', 'Difficult');
  END IF;
END $$;

-- 2. Create / Update the `attempts` Table
-- Stores granular diagnostic evaluation attempts submitted by students
CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id VARCHAR(100) NOT NULL,
  concept VARCHAR(150) NOT NULL,
  difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('Easy', 'Medium', 'Difficult')),
  submitted_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  classification VARCHAR(30) NOT NULL CHECK (classification IN ('correct', 'slip', 'misconception')),
  misconception_diagnosed TEXT,
  evidence TEXT,
  feedback_intervention TEXT,
  hint_level SMALLINT DEFAULT 0 CHECK (hint_level BETWEEN 0 AND 3),
  reassessment_served TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure difficulty_level column exists if attempts table already existed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'attempts' 
      AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE public.attempts 
    ADD COLUMN difficulty_level VARCHAR(20) NOT NULL DEFAULT 'Medium' 
    CHECK (difficulty_level IN ('Easy', 'Medium', 'Difficult'));
  END IF;
END $$;

-- Indexing for rapid queries by user and concept difficulty
CREATE INDEX IF NOT EXISTS idx_attempts_user_difficulty 
  ON public.attempts (user_id, difficulty_level);

CREATE INDEX IF NOT EXISTS idx_attempts_concept_misconception 
  ON public.attempts (concept, classification);

-- 3. Create / Update `misconceptions_profile` Table
-- Tracks recurring student misconceptions mapped to specific difficulty levels
CREATE TABLE IF NOT EXISTS public.misconceptions_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  misconception_name VARCHAR(255) NOT NULL,
  concept VARCHAR(150) NOT NULL,
  difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('Easy', 'Medium', 'Difficult')),
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  last_evidence TEXT,
  last_diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_misconception_difficulty UNIQUE (user_id, misconception_name, difficulty_level)
);

-- Ensure difficulty_level column exists if table pre-existed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'misconceptions_profile' 
      AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE public.misconceptions_profile 
    ADD COLUMN difficulty_level VARCHAR(20) NOT NULL DEFAULT 'Medium' 
    CHECK (difficulty_level IN ('Easy', 'Medium', 'Difficult'));
  END IF;
END $$;

-- Indexing for profile lookups by user and resolution state
CREATE INDEX IF NOT EXISTS idx_misconceptions_user_unresolved 
  ON public.misconceptions_profile (user_id, resolved) 
  WHERE resolved = FALSE;

-- 4. Trigger function: Auto-update learner misconception profile on attempt insert
CREATE OR REPLACE FUNCTION public.handle_attempt_misconception_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- If attempt was classified as a misconception, update or insert into profile
  IF NEW.classification = 'misconception' AND NEW.misconception_diagnosed IS NOT NULL THEN
    INSERT INTO public.misconceptions_profile (
      user_id,
      misconception_name,
      concept,
      difficulty_level,
      occurrence_count,
      resolved,
      last_evidence,
      last_diagnosed_at
    )
    VALUES (
      NEW.user_id,
      NEW.misconception_diagnosed,
      NEW.concept,
      NEW.difficulty_level,
      1,
      FALSE,
      NEW.evidence,
      NEW.created_at
    )
    ON CONFLICT (user_id, misconception_name, difficulty_level)
    DO UPDATE SET
      occurrence_count = public.misconceptions_profile.occurrence_count + 1,
      resolved = FALSE,
      last_evidence = EXCLUDED.last_evidence,
      last_diagnosed_at = EXCLUDED.last_diagnosed_at;

  -- If student submitted a correct answer on this concept and difficulty, mark prior related misconceptions as resolved
  ELSIF NEW.is_correct = TRUE THEN
    UPDATE public.misconceptions_profile
    SET 
      resolved = TRUE,
      resolved_at = NEW.created_at
    WHERE user_id = NEW.user_id 
      AND concept = NEW.concept 
      AND difficulty_level = NEW.difficulty_level
      AND resolved = FALSE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to attempts table
DROP TRIGGER IF EXISTS trg_track_attempt_misconceptions ON public.attempts;
CREATE TRIGGER trg_track_attempt_misconceptions
  AFTER INSERT ON public.attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_attempt_misconception_tracking();

-- 5. Row Level Security (RLS)
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.misconceptions_profile ENABLE ROW LEVEL SECURITY;

-- Learners can read and insert their own attempts
CREATE POLICY "Learners can view their own attempts"
  ON public.attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Learners can record their own attempts"
  ON public.attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Learners can view their own misconceptions profile
CREATE POLICY "Learners can view their misconceptions profile"
  ON public.misconceptions_profile FOR SELECT
  USING (auth.uid() = user_id);
