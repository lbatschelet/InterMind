-- Remove all existing policies
DROP POLICY IF EXISTS "allow_public_questions_select" ON public.questions;
DROP POLICY IF EXISTS "allow_all_assessments" ON public.assessments;
DROP POLICY IF EXISTS "allow_all_answers" ON public.assessment_answers;
DROP POLICY IF EXISTS "questions_public_readable" ON public.questions;
DROP POLICY IF EXISTS "device_can_read_own_assessments" ON public.assessments;
DROP POLICY IF EXISTS "device_can_create_assessments" ON public.assessments;
DROP POLICY IF EXISTS "device_can_read_own_answers" ON public.assessment_answers;
DROP POLICY IF EXISTS "device_can_create_answers" ON public.assessment_answers;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;

-- 1. Questions: Public readable (keine Änderung nötig, war korrekt)
CREATE POLICY "questions_public_readable"
ON public.questions
FOR SELECT TO anon, authenticated
USING (true);

-- 2. Assessments: Kombinierte Policy für bessere Performance
CREATE POLICY "device_assessments_policy"
ON public.assessments
FOR ALL TO anon, authenticated
USING (
    (select current_setting('app.device_id'::text, true)) = device_id
)
WITH CHECK (
    (select current_setting('app.device_id'::text, true)) = device_id
);

-- 3. Answers: Kombinierte Policy mit optimierter Abfrage
CREATE POLICY "device_answers_policy"
ON public.assessment_answers
FOR ALL TO anon, authenticated
USING (
    assessment_id IN (
        SELECT id FROM assessments 
        WHERE device_id = (select current_setting('app.device_id'::text, true))
    )
)
WITH CHECK (
    assessment_id IN (
        SELECT id FROM assessments 
        WHERE device_id = (select current_setting('app.device_id'::text, true))
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