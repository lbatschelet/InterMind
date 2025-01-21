-- Enum für Fragetypen
CREATE TYPE "public"."question_type" AS ENUM (
    'single_choice',
    'multiple_choice',
    'slider',
    'text'
);

-- Tabellen erstellen
CREATE TABLE "public"."questions" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "question" text NOT NULL,
    "type" question_type NOT NULL,
    "options" jsonb, -- Flexibles Format für verschiedene Fragetypen
    "category" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- options Schema validieren basierend auf type
    CONSTRAINT "valid_options" CHECK (
        CASE
            WHEN type = 'single_choice' THEN 
                jsonb_typeof(options) = 'array' 
                AND jsonb_array_length(options) > 0
            WHEN type = 'multiple_choice' THEN 
                jsonb_typeof(options) = 'array' 
                AND jsonb_array_length(options) > 0
            WHEN type = 'slider' THEN 
                options ? 'min' 
                AND options ? 'max' 
                AND options ? 'step'
            WHEN type = 'text' THEN 
                options IS NULL
            ELSE false
        END
    )
);

CREATE TABLE "public"."assessments" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" text NOT NULL,
    "device_id" text NOT NULL,
    "started_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE "public"."assessment_answers" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "assessment_id" uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    "question_id" uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    "answer_value" jsonb NOT NULL,
    "question_type" question_type NOT NULL, -- Speichere den Typ direkt in der Antwort
    "answered_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "unique_answer_per_question" UNIQUE (assessment_id, question_id),
    CONSTRAINT "valid_answer" CHECK (
        CASE
            WHEN question_type = 'single_choice' THEN 
                jsonb_typeof(answer_value) = 'number'
            WHEN question_type = 'multiple_choice' THEN 
                jsonb_typeof(answer_value) = 'array'
            WHEN question_type = 'slider' THEN 
                jsonb_typeof(answer_value) = 'number'
            WHEN question_type = 'text' THEN 
                jsonb_typeof(answer_value) = 'string'
            ELSE false
        END
    )
);

-- Trigger um question_type automatisch zu setzen
CREATE OR REPLACE FUNCTION set_question_type()
RETURNS TRIGGER AS $$
BEGIN
    NEW.question_type := (SELECT type FROM questions WHERE id = NEW.question_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_question_type_trigger
    BEFORE INSERT OR UPDATE ON assessment_answers
    FOR EACH ROW
    EXECUTE FUNCTION set_question_type();

-- Indizes
CREATE INDEX "idx_questions_category" ON "public"."questions" USING btree ("category");
CREATE INDEX "idx_questions_type" ON "public"."questions" USING btree ("type");
CREATE INDEX "idx_assessments_user_id" ON "public"."assessments" USING btree ("user_id");
CREATE INDEX "idx_assessments_device_id" ON "public"."assessments" USING btree ("device_id");
CREATE INDEX "idx_assessment_answers_assessment_id" ON "public"."assessment_answers" USING btree ("assessment_id");
CREATE INDEX "idx_assessment_answers_question_id" ON "public"."assessment_answers" USING btree ("question_id");

-- RLS aktivieren
ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."assessment_answers" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Questions sind öffentlich lesbar"
ON "public"."questions"
AS PERMISSIVE
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Nutzer können nur eigene Assessments sehen und bearbeiten"
ON "public"."assessments"
AS PERMISSIVE
FOR ALL
TO authenticated, anon
USING (device_id = current_setting('app.device_id', TRUE))
WITH CHECK (device_id = current_setting('app.device_id', TRUE));

CREATE POLICY "Nutzer können nur Antworten zu eigenen Assessments sehen und erstellen"
ON "public"."assessment_answers"
AS PERMISSIVE
FOR ALL
TO authenticated, anon
USING (
    assessment_id IN (
        SELECT id 
        FROM assessments 
        WHERE device_id = current_setting('app.device_id', TRUE)
    )
)
WITH CHECK (
    assessment_id IN (
        SELECT id 
        FROM assessments 
        WHERE device_id = current_setting('app.device_id', TRUE)
    )
);