-- Function zum Setzen von Session-Parametern
CREATE OR REPLACE FUNCTION set_claim(claim text, value text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.' || claim, value, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Modifiziere die bestehende Policy für Assessments
DROP POLICY IF EXISTS "Nutzer können nur eigene Assessments sehen und bearbeiten" ON "public"."assessments";

CREATE POLICY "Nutzer können nur eigene Assessments sehen und bearbeiten"
ON "public"."assessments"
AS PERMISSIVE
FOR ALL
TO authenticated, anon
USING (
    device_id = current_setting('app.device_id', TRUE)
)
WITH CHECK (true);  -- Erlaubt alle Inserts, da wir den device_id bereits im Insert setzen