-- Remove all existing policies
DROP POLICY IF EXISTS "allow_public_questions_select" ON public.questions;
DROP POLICY IF EXISTS "allow_all_assessments" ON public.assessments;
DROP POLICY IF EXISTS "allow_all_answers" ON public.assessment_answers;
DROP POLICY IF EXISTS "questions_public_readable" ON public.questions;
DROP POLICY IF EXISTS "device_can_read_own_assessments" ON public.assessments;
DROP POLICY IF EXISTS "device_can_create_assessments" ON public.assessments;
DROP POLICY IF EXISTS "device_can_read_own_answers" ON public.assessment_answers;
DROP POLICY IF EXISTS "device_can_create_answers" ON public.assessment_answers;

-- 1. Questions: Public readable
CREATE POLICY "questions_public_readable"
ON public.questions
FOR SELECT TO anon, authenticated
USING (true);

-- 2. Assessments: Separate policies für read/write
CREATE POLICY "device_can_read_own_assessments"
ON public.assessments
FOR SELECT TO anon, authenticated
USING (device_id = current_setting('app.device_id'::text, true));

CREATE POLICY "device_can_create_assessments"
ON public.assessments
FOR INSERT TO anon, authenticated
WITH CHECK (device_id = current_setting('app.device_id'::text, true));

-- 3. Answers: Separate policies für read/write
CREATE POLICY "device_can_read_own_answers"
ON public.assessment_answers
FOR SELECT TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM assessments a
        WHERE a.id = assessment_id
        AND a.device_id = current_setting('app.device_id'::text, true)
    )
);

CREATE POLICY "device_can_create_answers"
ON public.assessment_answers
FOR INSERT TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM assessments a
        WHERE a.id = assessment_id
        AND a.device_id = current_setting('app.device_id'::text, true)
    )
);

-- Helper zum Debuggen der Session
DROP FUNCTION IF EXISTS debug_session();

CREATE OR REPLACE FUNCTION debug_session()
RETURNS TABLE (
    device_id text,
    current_session_user text
) AS $$
BEGIN
    RETURN QUERY SELECT 
        current_setting('app.device_id'::text, true),
        current_user::text;
END;
$$ LANGUAGE plpgsql;