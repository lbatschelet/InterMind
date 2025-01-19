-- Füge location Spalte zur assessments Tabelle hinzu
ALTER TABLE "public"."assessments"
ADD COLUMN IF NOT EXISTS "location" jsonb;

COMMENT ON COLUMN "public"."assessments"."location" IS 'Stores location data as {lat: number, lng: number, accuracy?: number, timestamp: number}'; 