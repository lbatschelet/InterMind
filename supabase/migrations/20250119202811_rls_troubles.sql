-- Separate policies for different operations
DROP POLICY IF EXISTS "Assessments Access Policy" ON public.assessments;

-- Policy für SELECT/UPDATE/DELETE
CREATE POLICY "assessments_select_policy" 
ON public.assessments
FOR SELECT
TO authenticated, anon
USING (device_id = current_setting('app.device_id', true));

-- Policy für INSERT
CREATE POLICY "assessments_insert_policy"
ON public.assessments
FOR INSERT
TO authenticated, anon
WITH CHECK (true);  -- Erlaubt alle Inserts, da device_id beim Insert gesetzt wird

-- Debug-Funktion
CREATE OR REPLACE FUNCTION debug_rls() 
RETURNS TABLE (
    current_device_id text,
    current_claims jsonb
) AS $$
BEGIN
    RETURN QUERY SELECT 
        current_setting('app.device_id', true),
        current_setting('request.jwt.claims', true)::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;