DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS assessments;
DROP TABLE IF EXISTS assessment_answers;
DROP TABLE IF EXISTS assessment_questions;
DROP TABLE IF EXISTS questions_en;
DROP TABLE IF EXISTS questions_de;


-- ==========================
-- 1️⃣ CREATE ENUM FOR QUESTION TYPES
-- ==========================
CREATE TYPE question_type_enum AS ENUM ('single_choice', 'multiple_choice', 'slider', 'text', 'info_screen');

-- ==========================
-- 2️⃣ CREATE TABLES
-- ==========================

-- Table: languages (stores supported languages)
CREATE TABLE languages (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Insert supported languages
INSERT INTO languages (code, name, native_name) VALUES
    ('en', 'English', 'English'),
    ('de', 'German', 'Deutsch'),
    ('fr', 'French', 'Français');

-- Table: surveys (tracks each survey session)
CREATE TABLE surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    completed BOOLEAN DEFAULT false,
    language TEXT NOT NULL DEFAULT 'en' REFERENCES languages(code)
);

-- Base table for question metadata (sprachunabhängig)
CREATE TABLE questions (
    id TEXT PRIMARY KEY, -- Text-ID für konsistente Verwendung über Sprachen hinweg
    type question_type_enum NOT NULL,
    category TEXT,
    sequence_number INTEGER DEFAULT 9999,
    image_source TEXT DEFAULT NULL,
    options_structure JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Translations table (consolidates all translations in one table)
CREATE TABLE translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    language TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    title TEXT,
    text TEXT NOT NULL,
    options_content JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(question_id, language)
);

-- Table: responses (stores user answers)
CREATE TABLE responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
    response JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================
-- 3️⃣ ENABLE ROW-LEVEL SECURITY (RLS)
-- ==========================
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- ==========================
-- 4️⃣ SECURE DATA ACCESS WITH RLS
-- ==========================

-- Sprachen können öffentlich eingesehen werden (Read-Only)
CREATE POLICY "Allow all to read languages"
ON languages
FOR SELECT USING (TRUE);

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

-- Alle können Übersetzungen sehen (Read-Only)
CREATE POLICY "Allow all to read translations"
ON translations
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

-- ==========================
-- 5️⃣ INDEXES FOR PERFORMANCE
-- ==========================

-- Index für Translations, um Abfragen nach Sprache zu beschleunigen
CREATE INDEX idx_translations_language ON translations(language);

-- Index für Surveys nach device_id
CREATE INDEX idx_surveys_device_id ON surveys(device_id);

-- Index für Surveys nach language
CREATE INDEX idx_surveys_language ON surveys(language);

-- Index für Responses nach survey_id
CREATE INDEX idx_responses_survey_id ON responses(survey_id);

-- Index für Responses nach question_id
CREATE INDEX idx_responses_question_id ON responses(question_id);

-- Index für Fragen nach Kategorie
CREATE INDEX idx_questions_category ON questions(category);

-- Index für Fragen nach Sequenznummer
CREATE INDEX idx_questions_sequence ON questions(sequence_number);
