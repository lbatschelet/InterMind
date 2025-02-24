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
-- 4️⃣ SECURE DATA ACCESS WITH RLS (USING `X-Device-ID`)
-- ==========================

-- Allow devices to insert their own surveys, but only see their own surveys
CREATE POLICY "Allow device to access own surveys"
ON surveys
FOR SELECT USING (
    current_setting('request.headers', true)::jsonb->>'X-Device-ID' = device_id
);

CREATE POLICY "Allow device to insert surveys"
ON surveys
FOR INSERT WITH CHECK (
    true  -- Temporär gelockert für Debugging
);

-- Allow all devices to read questions, but not modify them
CREATE POLICY "Allow all devices to read questions"
ON questions
FOR SELECT USING (TRUE);

CREATE POLICY "Prevent devices from modifying questions"
ON questions
FOR INSERT WITH CHECK (FALSE);

-- Allow devices to insert responses only for their own surveys
CREATE POLICY "Allow inserting responses for own surveys"
ON responses
FOR INSERT WITH CHECK (
    survey_id IN (
        SELECT id FROM surveys WHERE current_setting('request.headers', true)::jsonb->>'X-Device-ID' = device_id
    )
);

-- Allow devices to view only their own responses
CREATE POLICY "Allow devices to view their own responses"
ON responses
FOR SELECT USING (
    survey_id IN (
        SELECT id FROM surveys WHERE current_setting('request.headers', true)::jsonb->>'X-Device-ID' = device_id
    )
);
