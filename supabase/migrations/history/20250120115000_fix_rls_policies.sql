-- Bestehende Policies entfernen
DROP POLICY IF EXISTS "questions_public_readable" ON public.questions;
DROP POLICY IF EXISTS "device_assessments_policy" ON public.assessments;
DROP POLICY IF EXISTS "assessments_device_policy" ON public.assessments;
DROP POLICY IF EXISTS "device_answers_policy" ON public.assessment_answers;
DROP POLICY IF EXISTS "answers_device_policy" ON public.assessment_answers;
DROP POLICY IF EXISTS "device_can_delete_own_assessments" ON public.assessments;
DROP POLICY IF EXISTS "device_can_update_own_assessments" ON public.assessments;
DROP POLICY IF EXISTS "device_can_view_own_assessments" ON public.assessments;

-- Force RLS auch für Superuser
ALTER TABLE public.questions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.assessments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers FORCE ROW LEVEL SECURITY;

-- Neue Policies erstellen
CREATE POLICY "questions_public_readable" ON public.questions
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "assessments_device_policy" ON public.assessments
    FOR ALL
    TO anon, authenticated
    USING (
        CASE
            WHEN current_setting('app.device_id', TRUE) IS NULL THEN false
            ELSE device_id = current_setting('app.device_id', TRUE)
        END
    )
    WITH CHECK (
        CASE
            WHEN current_setting('app.device_id', TRUE) IS NULL THEN false
            ELSE device_id = current_setting('app.device_id', TRUE)
        END
    );

CREATE POLICY "answers_device_policy" ON public.assessment_answers
    FOR ALL
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM assessments a
            WHERE a.id = assessment_answers.assessment_id
            AND CASE
                WHEN current_setting('app.device_id', TRUE) IS NULL THEN false
                ELSE a.device_id = current_setting('app.device_id', TRUE)
            END
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM assessments a
            WHERE a.id = assessment_answers.assessment_id
            AND CASE
                WHEN current_setting('app.device_id', TRUE) IS NULL THEN false
                ELSE a.device_id = current_setting('app.device_id', TRUE)
            END
        )
    );

-- Verbesserte Debug-Funktion
DROP FUNCTION IF EXISTS debug_session();
CREATE OR REPLACE FUNCTION debug_session()
RETURNS TABLE (
    device_id text,
    current_session_user text,
    is_rls_enabled boolean
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        current_setting('app.device_id'::text),
        current_user::text,
        EXISTS (
            SELECT 1 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'assessments' 
            AND rowsecurity = true
        );
END;
$$ LANGUAGE plpgsql;
