/**
 * Minimal RLS Setup
 * ----------------
 * Start with absolute basics:
 * 1. Questions are public readable
 * 2. One simple policy for assessments
 * 3. One simple policy for answers
 */

-- Remove all existing policies
DROP POLICY IF EXISTS "Assessment Answers Policy" ON public.assessment_answers;
DROP POLICY IF EXISTS "Assessment Answers Access Policy" ON public.assessment_answers;
DROP POLICY IF EXISTS "Assessments Access Policy" ON public.assessments;
DROP POLICY IF EXISTS "Assessments Policy" ON public.assessments;
DROP POLICY IF EXISTS "assessments_select_policy" ON public.assessments;
DROP POLICY IF EXISTS "assessments_insert_policy" ON public.assessments;
DROP POLICY IF EXISTS "Questions sind öffentlich lesbar" ON public.questions;
DROP POLICY IF EXISTS "device_assessments_policy" ON public.assessments;
DROP POLICY IF EXISTS "device_assessment_answers_policy" ON public.assessment_answers;
DROP POLICY IF EXISTS "questions_are_public_readable" ON public.questions;

-- Basic Policies
CREATE POLICY "allow_public_questions_select"
ON public.questions FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "allow_all_assessments"
ON public.assessments FOR ALL 
TO authenticated, anon
USING (true);

CREATE POLICY "allow_all_answers"
ON public.assessment_answers FOR ALL
TO authenticated, anon
USING (true);