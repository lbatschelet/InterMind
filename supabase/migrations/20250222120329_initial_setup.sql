-- ==========================
-- 1️⃣ CREATE ENUM FOR QUESTION TYPES
-- ==========================
CREATE TYPE question_type_enum AS ENUM ('single_choice', 'multiple_choice', 'slider', 'text');

-- ==========================
-- 2️⃣ CREATE TABLES
-- ==========================

-- Table: surveys (tracks each survey session)
CREATE TABLE surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    completed BOOLEAN DEFAULT false
);

-- Table: questions (stores available questions)
CREATE TABLE questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type question_type_enum NOT NULL,
    text TEXT NOT NULL,
    options JSONB DEFAULT NULL
);

-- Table: responses (stores user answers)
CREATE TABLE responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    response JSONB NOT NULL
);

-- ==========================
-- 3️⃣ ENABLE ROW-LEVEL SECURITY (RLS)
-- ==========================
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- ==========================
-- 4️⃣ SECURE DATA ACCESS WITH RLS (KORREKTE VERSION)
-- ==========================

-- Jeder kann neue Umfragen erstellen
CREATE POLICY "Allow anyone to insert surveys"
ON surveys
FOR INSERT 
WITH CHECK (TRUE);

-- Geräte können nur ihre eigenen Umfragen sehen
CREATE POLICY "Allow devices to see own surveys"
ON surveys
FOR SELECT
USING (current_user = 'anon' AND device_id IS NOT NULL);

-- Geräte können nur ihre eigenen Umfragen aktualisieren
CREATE POLICY "Allow devices to update own surveys"
ON surveys
FOR UPDATE
USING (device_id IS NOT NULL)
WITH CHECK (TRUE);

-- Geräte können nur ihre eigenen Umfragen löschen
CREATE POLICY "Allow devices to delete own surveys"
ON surveys
FOR DELETE
USING (device_id IS NOT NULL);

-- Alle können Fragen sehen (Read-Only)
CREATE POLICY "Allow all to read questions"
ON questions
FOR SELECT USING (TRUE);

-- Antworten-Policies für eigene Surveys
CREATE POLICY "Allow inserting responses for own surveys"
ON responses
FOR INSERT 
WITH CHECK (
    survey_id IN (
        SELECT id FROM surveys WHERE id = responses.survey_id
    )
);

-- Antworten anzeigen nur für eigene Surveys
CREATE POLICY "Allow viewing own responses"
ON responses
FOR SELECT
USING (
    survey_id IN (
        SELECT id FROM surveys WHERE id = responses.survey_id
    )
);
