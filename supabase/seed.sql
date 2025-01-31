INSERT INTO "public"."questions" (question, type, options, category, auto_advance) VALUES
-- Single Choice Questions
(
    'How are you feeling today?',
    'single_choice',
    '[
        "Very good",
        "Good",
        "Neutral",
        "Not so good",
        "Bad"
    ]'::jsonb,
    'mood',
    true
),
(
    'How did you sleep last night?',
    'single_choice',
    '[
        "Excellent",
        "Good",
        "Average",
        "Poor",
        "Very poor"
    ]'::jsonb,
    'sleep',
    true
),

-- Multiple Choice Question
(
    'Which activities helped you today?',
    'multiple_choice',
    '[
        "Exercise",
        "Meditation",
        "Walking",
        "Talking with friends",
        "Listening to music",
        "Reading"
    ]'::jsonb,
    'activities',
    false
),

-- Slider Questions
(
    'How stressed do you feel on a scale?',
    'slider',
    '{
        "min": 0,
        "max": 10,
        "step": 1
    }'::jsonb,
    'stress',
    false
),
(
    'How would you rate your energy level?',
    'slider',
    '{
        "min": 0,
        "max": 100,
        "step": 5
    }'::jsonb,
    'energy',
    false
),

-- Text Question
(
    'What is on your mind today?',
    'text',
    NULL,
    'thoughts',
    false
);
