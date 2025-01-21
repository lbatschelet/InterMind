/**
 * Clean RLS Implementation
 * -----------------------
 * This migration removes all existing policies and creates a new clean set of policies.
 * We follow these principles:
 * 1. Questions are public readable (no auth needed)
 * 2. Assessments are only accessible by the device that created them
 * 3. Answers are only accessible for assessments that belong to the device
 */

-- First remove all existing policies
DROP POLICY IF EXISTS "Assessment Answers Policy" ON public.assessment_answers;
DROP POLICY IF EXISTS "Assessment Answers Access Policy" ON public.assessment_answers;
DROP POLICY IF EXISTS "Assessments Access Policy" ON public.assessments;
DROP POLICY IF EXISTS "Assessments Policy" ON public.assessments;
DROP POLICY IF EXISTS "assessments_select_policy" ON public.assessments;
DROP POLICY IF EXISTS "assessments_insert_policy" ON public.assessments;
DROP POLICY IF EXISTS "Questions sind öffentlich lesbar" ON public.questions;

-- Questions: Public readable, no auth needed
CREATE POLICY "questions_are_public_readable" 
ON public.questions 
FOR SELECT 
TO authenticated, anon 
USING (true);

-- Assessments: Device based access
-- SELECT: Device can only read own assessments
CREATE POLICY "device_can_view_own_assessments" 
ON public.assessments 
FOR SELECT 
TO authenticated, anon 
USING (device_id = current_setting('app.device_id'::text, true));

-- INSERT: Device can create assessments (device_id is set in the backend)
CREATE POLICY "device_can_create_assessments" 
ON public.assessments 
FOR INSERT 
TO authenticated, anon 
WITH CHECK (true);

-- UPDATE: Device can only update own assessments
CREATE POLICY "device_can_update_own_assessments" 
ON public.assessments 
FOR UPDATE 
TO authenticated, anon 
USING (device_id = current_setting('app.device_id'::text, true))
WITH CHECK (true);

-- DELETE: Device can only delete own assessments
CREATE POLICY "device_can_delete_own_assessments" 
ON public.assessments 
FOR DELETE 
TO authenticated, anon 
USING (device_id = current_setting('app.device_id'::text, true));

-- Assessment Answers: Based on assessment ownership
-- SELECT: Device can read answers for own assessments
CREATE POLICY "device_can_view_own_assessment_answers" 
ON public.assessment_answers 
FOR SELECT 
TO authenticated, anon 
USING (
    EXISTS (
        SELECT 1 FROM assessments a
        WHERE a.id = assessment_id
        AND a.device_id = current_setting('app.device_id'::text, true)
    )
);

-- INSERT: Device can create answers for own assessments
CREATE POLICY "device_can_create_answers_for_own_assessments" 
ON public.assessment_answers 
FOR INSERT 
TO authenticated, anon 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM assessments a
        WHERE a.id = assessment_id
        AND a.device_id = current_setting('app.device_id'::text, true)
    )
);