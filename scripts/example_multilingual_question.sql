-- Beispiel für eine neue mehrsprachige Frage
-- Dies zeigt, wie neue Fragen mit mehrsprachiger Unterstützung erstellt werden können

-- Beispiel 1: Single-Choice Frage
INSERT INTO questions (id, type, title, text, options, category, sequence_number)
VALUES (
    'mood_assessment',  -- Eindeutige ID
    'single_choice',    -- Fragetyp
    '{"en": "Mood Assessment", "de": "Stimmungsbewertung"}',  -- Mehrsprachiger Titel
    '{"en": "How would you describe your current mood?", "de": "Wie würdest du deine aktuelle Stimmung beschreiben?"}',  -- Mehrsprachiger Text
    '{"options": [
        {"value": "very_happy", "label": {"en": "Very happy", "de": "Sehr glücklich"}},
        {"value": "happy", "label": {"en": "Happy", "de": "Glücklich"}},
        {"value": "neutral", "label": {"en": "Neutral", "de": "Neutral"}},
        {"value": "sad", "label": {"en": "Sad", "de": "Traurig"}},
        {"value": "very_sad", "label": {"en": "Very sad", "de": "Sehr traurig"}}
    ], "autoAdvance": true, "showOnce": false}',  -- Mehrsprachige Optionen
    'mood',             -- Kategorie
    400                 -- Sequenznummer für die Sortierung
);

-- Beispiel 2: Info-Screen
INSERT INTO questions (id, type, title, text, options, category, sequence_number, image_source)
VALUES (
    'mindfulness_intro',  -- Eindeutige ID
    'info_screen',        -- Fragetyp
    '{"en": "Mindfulness Moment", "de": "Achtsamkeitsmoment"}',  -- Mehrsprachiger Titel
    '{"en": "Take a moment to be fully present and aware of your surroundings. Notice the sights, sounds, and sensations around you without judgment.", 
      "de": "Nimm dir einen Moment Zeit, um vollständig präsent zu sein und deine Umgebung wahrzunehmen. Beachte die Bilder, Geräusche und Empfindungen um dich herum ohne zu urteilen."}',  -- Mehrsprachiger Text
    '{"buttonText": {"en": "I am present", "de": "Ich bin präsent"}, "showOnce": false}',  -- Mehrsprachiger Button-Text
    'mindfulness',      -- Kategorie
    250,                -- Sequenznummer für die Sortierung
    'meditation'        -- Bildquelle (optional)
);

-- Beispiel 3: Slider-Frage
INSERT INTO questions (id, type, title, text, options, category, sequence_number)
VALUES (
    'stress_level',     -- Eindeutige ID
    'slider',           -- Fragetyp
    '{"en": "Stress Level", "de": "Stresslevel"}',  -- Mehrsprachiger Titel
    '{"en": "How would you rate your current level of stress?", "de": "Wie würdest du deinen aktuellen Stresslevel bewerten?"}',  -- Mehrsprachiger Text
    '{"values": [
        {"en": "Not at all stressed", "de": "Überhaupt nicht gestresst"},
        {"en": "Slightly stressed", "de": "Leicht gestresst"},
        {"en": "Moderately stressed", "de": "Mäßig gestresst"},
        {"en": "Very stressed", "de": "Sehr gestresst"},
        {"en": "Extremely stressed", "de": "Extrem gestresst"}
    ]}',  -- Mehrsprachige Werte für den Slider
    'stress',           -- Kategorie
    410                 -- Sequenznummer für die Sortierung
);

-- Beispiel 4: Multiple-Choice Frage
INSERT INTO questions (id, type, title, text, options, category, sequence_number)
VALUES (
    'coping_strategies',  -- Eindeutige ID
    'multiple_choice',    -- Fragetyp
    '{"en": "Coping Strategies", "de": "Bewältigungsstrategien"}',  -- Mehrsprachiger Titel
    '{"en": "Which strategies do you use to manage stress in this environment?", "de": "Welche Strategien verwendest du, um Stress in dieser Umgebung zu bewältigen?"}',  -- Mehrsprachiger Text
    '{"options": [
        {"value": "deep_breathing", "label": {"en": "Deep breathing", "de": "Tiefes Atmen"}},
        {"value": "physical_activity", "label": {"en": "Physical activity", "de": "Körperliche Aktivität"}},
        {"value": "social_support", "label": {"en": "Talking to others", "de": "Mit anderen sprechen"}},
        {"value": "mindfulness", "label": {"en": "Mindfulness or meditation", "de": "Achtsamkeit oder Meditation"}},
        {"value": "music", "label": {"en": "Listening to music", "de": "Musik hören"}},
        {"value": "nature", "label": {"en": "Spending time in nature", "de": "Zeit in der Natur verbringen"}},
        {"value": "none", "label": {"en": "None of these", "de": "Keine davon"}}
    ]}',  -- Mehrsprachige Optionen
    'coping',             -- Kategorie
    420                   -- Sequenznummer für die Sortierung
);

-- Beispiel 5: Textfrage
INSERT INTO questions (id, type, title, text, options, category, sequence_number)
VALUES (
    'personal_reflection',  -- Eindeutige ID
    'text',                 -- Fragetyp
    '{"en": "Personal Reflection", "de": "Persönliche Reflexion"}',  -- Mehrsprachiger Titel
    '{"en": "Is there anything specific about this place that influences your well-being positively or negatively?", 
      "de": "Gibt es etwas Bestimmtes an diesem Ort, das dein Wohlbefinden positiv oder negativ beeinflusst?"}',  -- Mehrsprachiger Text
    NULL,                  -- Keine Optionen für Textfragen
    'reflection',          -- Kategorie
    430                    -- Sequenznummer für die Sortierung
); 