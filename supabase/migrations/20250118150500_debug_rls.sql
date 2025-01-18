-- Temporär die bestehende Policy entfernen
DROP POLICY IF EXISTS "Nutzer können nur eigene Assessments sehen und bearbeiten" ON "public"."assessments";

-- Neue, sehr offene Policy zum Testen
CREATE POLICY "Debug Assessment Policy"
ON "public"."assessments"
AS PERMISSIVE
FOR ALL
TO authenticated, anon
USING (true)  -- Erlaubt Lesen aller Einträge
WITH CHECK (true);  -- Erlaubt alle Inserts/Updates

-- Debug-Funktion zum Prüfen der Session-Variablen
CREATE OR REPLACE FUNCTION debug_session()
RETURNS TABLE (
    setting_name text,
    setting_value text
) AS $$
BEGIN
    RETURN QUERY
    SELECT name::text, setting::text
    FROM pg_settings
    WHERE name LIKE 'app.%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 