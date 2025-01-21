-- Bestehende Policies entfernen
DROP POLICY IF EXISTS "Nutzer können nur eigene Assessments sehen und bearbeiten" ON "public"."assessments";
DROP POLICY IF EXISTS "Nutzer können nur Antworten zu eigenen Assessments sehen und erstellen" ON "public"."assessment_answers";

-- Neue Policy für Assessments
CREATE POLICY "Assessments Access Policy"
ON "public"."assessments"
AS PERMISSIVE
FOR ALL
TO authenticated, anon
USING (
    device_id = current_setting('app.device_id', TRUE)
    OR device_id IS NULL
)
WITH CHECK (true);

-- Neue Policy für Assessment Answers
CREATE POLICY "Assessment Answers Access Policy"
ON "public"."assessment_answers"
AS PERMISSIVE
FOR ALL
TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 
        FROM assessments a 
        WHERE a.id = assessment_id 
        AND a.device_id = current_setting('app.device_id', TRUE)
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM assessments a 
        WHERE a.id = assessment_id 
        AND a.device_id = current_setting('app.device_id', TRUE)
    )
);

-- Funktion zum Setzen der Session-Variable verbessern
CREATE OR REPLACE FUNCTION set_claim(claim text, value text)
RETURNS void AS $$
BEGIN
    -- Füge 'app.' Prefix hinzu, falls nicht vorhanden
    IF NOT claim LIKE 'app.%' THEN
        claim := 'app.' || claim;
    END IF;
    PERFORM set_config(claim, value, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;