-- Beispielfragen einfügen
INSERT INTO "public"."questions" 
("question", "type", "options", "category") VALUES
-- Single Choice Fragen
(
    'Wie fühlst du dich heute?',
    'single_choice',
    '[
        "Sehr gut",
        "Gut",
        "Neutral",
        "Nicht so gut",
        "Schlecht"
    ]'::jsonb,
    'mood'
),
(
    'Wie war dein Schlaf letzte Nacht?',
    'single_choice',
    '[
        "Ausgezeichnet",
        "Gut",
        "Mittelmäßig",
        "Schlecht",
        "Sehr schlecht"
    ]'::jsonb,
    'sleep'
),

-- Multiple Choice Frage
(
    'Welche Aktivitäten haben dir heute geholfen?',
    'multiple_choice',
    '[
        "Sport",
        "Meditation",
        "Spaziergang",
        "Gespräch mit Freunden",
        "Musik hören",
        "Lesen"
    ]'::jsonb,
    'activities'
),

-- Slider Fragen
(
    'Wie gestresst fühlst du dich auf einer Skala?',
    'slider',
    '{
        "min": 0,
        "max": 10,
        "step": 1
    }'::jsonb,
    'stress'
),
(
    'Wie würdest du deine Energie einschätzen?',
    'slider',
    '{
        "min": 0,
        "max": 100,
        "step": 5
    }'::jsonb,
    'energy'
),

-- Text Frage
(
    'Was beschäftigt dich heute am meisten?',
    'text',
    null,
    'thoughts'
); 