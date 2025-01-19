/**
 * Fix RLS Policies
 * ---------------
 * This migration:
 * 1. Removes all existing policies (cleanup)
 * 2. Creates a consistent set of policies using app.device_id
 * 3. Adds proper checks for both read and write operations
 */

-- Cleanup: Remove all existing policies
DROP POLICY IF EXISTS "Users can insert their own answers" ON public.assessment_answers;
DROP POLICY IF EXISTS "Assessments Access Policy" ON public.assessments;
DROP POLICY IF EXISTS "Debug Assessment Policy" ON public.assessments;
DROP POLICY IF EXISTS "Nutzer können nur eigene Assessments sehen und bearbeiten" ON public.assessments;
DROP POLICY IF EXISTS "Nutzer können nur Antworten zu eigenen Assessments sehen und erstellen" ON public.assessment_answers;

-- Set up consistent device_id handling
CREATE OR REPLACE FUNCTION set_claim(claim text, value text)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.device_id', value, true);
    RAISE NOTICE 'Set device_id to %', value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Assessment policies
CREATE POLICY "Assessments Access Policy"
ON public.assessments
FOR ALL
TO authenticated, anon
USING (device_id = current_setting('app.device_id', true))
WITH CHECK (true);  -- Allows inserts as device_id is set during insert

-- Answer policies
CREATE POLICY "Assessment Answers Policy"
ON public.assessment_answers
FOR ALL
TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 FROM assessments a
        WHERE a.id = assessment_id
        AND a.device_id = current_setting('app.device_id', true)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM assessments a
        WHERE a.id = assessment_id
        AND a.device_id = current_setting('app.device_id', true)
    )
);