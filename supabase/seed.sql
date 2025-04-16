-- Informationen zu demografischen Fragen (wird vor den demografischen Fragen angezeigt)
INSERT INTO questions (type, title, text, options, category, sequence_number) VALUES
  ('info_screen',
  'Hi!',
  'This app is designed to help you reflect on your well-being in different situations and surroundings. It will ask short questions about your daily experiences to better understand how various factors influence how you feel.

You''ll receive brief surveys a few times a day, taking only a few minutes to answer. Your responses remain confidential and will be used solely to gain insights into how different environments and personal factors affect well-being.',
  '{"buttonText": "Next", "showOnce": true}',
  'welcome',
  0);

  INSERT INTO questions (type, title, text, options, category, sequence_number, image_source) VALUES
  
  ('info_screen',
   'Consent to Participate',
   'Before we begin, we ask for your consent to take part in a research study.

As part of this study, we will ask you some questions—first about yourself (e.g. age, gender identity), and then about your feelings and your surrounding environment at different moments in your day. Your responses help us understand how different people experience urban spaces and how these experiences relate to wellbeing.

**Participation is voluntary**. You can skip any question by selecting “Prefer not to say.” You can also delete all your data at any time via the app settings.

## What Data Will Be Collected?

- **Demographic data**, such as your age and gender identity  
- **Survey responses** about your emotions, thoughts, and surroundings  
- **Location data** via GPS (if you choose to allow it)

We do **not** collect your name, phone number, email address, or any other identifying information. Your responses are **completely anonymous** and **cannot be linked to you**.

## How Will Your Data Be Used?

Your data will be:

- Used for **academic research** on wellbeing and urban space
- Stored securely on a **password-protected server**
- **Not shared** with third parties
- **Anonymized** and **non-identifiable**
- Deletable by you at any time through the app

## Your Consent

By tapping **“I Agree”**, you confirm that:

- You understand the purpose of this study
- You agree to participate voluntarily
- You can withdraw at any time by deleting your data in the app settings

Please read our [Privacy Policy](#) for more details.',
   '{"buttonText": "I Agree", "showOnce": true}',
   'demographic',
   10,
   'contract');
   

INSERT INTO questions (type, title, text, options, category, sequence_number) VALUES
  -- Altersgruppen Frage
  ('single_choice', 
   'Age Group', 
   'In which age group do you find yourself?',
   '{"options": [
        {"value": "0-17", "label": "Below 16"},
        {"value": "18-24", "label": "16-25"},
        {"value": "25-34", "label": "26-35"},
        {"value": "35-44", "label": "36-45"},
        {"value": "45-54", "label": "46-55"},
        {"value": "55-64", "label": "56-65"},
        {"value": "65-74", "label": "66-75"},
        {"value": "75+", "label": "75+"},
        {"value": "no_answer", "label": "No answer"}
    ], "showOnce": true,
    "autoAdvance": true}',
    'demographic',
    100),

  -- Geschlecht Frage
  ('single_choice', 
   'Gender Identity', 
   'With which gender identity do you identify?',
   '{"options": [
        {"value": "female", "label": "Female"},
        {"value": "male", "label": "Male"},
        {"value": "diverse", "label": "Diverse"},
        {"value": "other", "label": "Other"},
        {"value": "no_answer", "label": "No answer"}
    ], "showOnce": true,
    "autoAdvance": true}',
    'demographic',
    110),

  -- Bildungsstand
  ('single_choice', 
   'Education', 
   'What is your highest level of education?',
   '{"options": [
        {"value": "none", "label": "No degree"},
        {"value": "primary", "label": "Primary school"},
        {"value": "secondary", "label": "Secondary school"},
        {"value": "highschool", "label": "High school"},
        {"value": "apprenticeship", "label": "Apprenticeship"},
        {"value": "bachelor", "label": "Bachelor"},
        {"value": "master", "label": "Master"},
        {"value": "phd", "label": "Promotion"},
        {"value": "no_answer", "label": "No answer"}
    ], "showOnce": true,
    "autoAdvance": true}',
    'demographic',
    120),

  -- Einkommen (optional)
  ('single_choice', 
   'Income', 
   'In which income group do you roughly find yourself? (monthly net income)',
   '{"options": [
        {"value": "below_1500", "label": "Below CHF 1.500"},
        {"value": "1500_3000", "label": "CHF 1.500 - 3.000"},
        {"value": "3000_4500", "label": "CHF 3.000 - 4.500"},
        {"value": "4500_6000", "label": "CHF 4.500 - 6.000"},
        {"value": "6000_7500", "label": "CHF 6.000 - 7.500"},
        {"value": "above_7500", "label": "Above CHF 7.500"},
        {"value": "no_answer", "label": "No answer"}
    ], "showOnce": true,
    "autoAdvance": true}',
    'demographic',
    130);



-- ==========================
-- REPEATED QUESTIONS ABOUT CURRENT SURROUNDINGS
-- ==========================



INSERT INTO questions (type, title, text, options, category, sequence_number, image_source) VALUES
-- Current Place

('info_screen',
 'Current environment',
 'The following questions are about your current surroundings. Please select the option(s) that best describes your current location.',
 '{"buttonText": "Next", "showOnce": false}',
 'well-being',
 200,
 'our-neighborhood');

 INSERT INTO questions (type, title, text, options, category, sequence_number) VALUES

('single_choice',
 'Indoor or Outdoor?',
 'Are you indoors or outdoors?',
 '{"options": [
  {"value": "indoor", "label": "Indoors"},
  {"value": "outdoor", "label": "Outdoors"}
 ], "showOnce": false, "autoAdvance": true}',
 'well-being',
 210),


-- Current Place
('single_choice',
 'Current Place',
 'Where are you exactly?',
 '{"options": [
  {"value": "home", "label": "Home"},
  {"value": "work", "label": "Work"},
  {"value": "school", "label": "School/University"},
  {"value": "public_space", "label": "Public place (e.g. shop, bar, etc.)"},
  {"value": "public_transport", "label": "Public transport"},
  {"value": "park", "label": "Park"},
  {"value": "other", "label": "Other"}
 ], "showOnce": false, "autoAdvance": true}',
 'well-being',
 220),

 -- Current Situation
 ('multiple_choice',
  'People around you',
  'Who is with you?',
  '{"options": [
   {"value": "nobody", "label": "Nobody"},
   {"value": "acquaintances", "label": "Acquaintances"},
   {"value": "colleagues", "label": "Colleagues"},
   {"value": "family", "label": "Family"},
   {"value": "partner", "label": "Partner"},
   {"value": "children", "label": "Children"},
   {"value": "friends", "label": "Friends"},
   {"value": "pets", "label": "Pets"},
   {"value": "strangers", "label": "Strangers"},
   {"value": "other", "label": "Other"}
  ], "showOnce": false, "autoAdvance": false}',
  'well-being',
  230),

  -- Current Situation
 ('single_choice',
  'Activity',
  'What are you doing?',
  '{"options": [
   {"value": "leisure", "label": "Leisure/Relaxation"},
   {"value": "traveling", "label": "Traveling"},
   {"value": "working", "label": "Working/Studying"},
   {"value": "shopping", "label": "Shopping"},
   {"value": "housework", "label": "Housework"},
   {"value": "other", "label": "Other"}
  ], "showOnce": false, "autoAdvance": false}',
  'well-being',
  240);

-- ==========================
-- REPEATED QUESTIONS ABOUT WELL-BEING
-- ==========================

INSERT INTO questions (type, title, text, options, category, sequence_number, image_source) VALUES

-- Introduction to the Well-Being Questions
('info_screen',
 'Well-Being Questions',
 'The following questions are about your well-being in your current surroundings. Please select the option(s) that best describes your current well-being.',
 '{"buttonText": "Next", "showOnce": false}',
 'well-being',
 300,
 'undraw_relaxation_ies6');

 INSERT INTO questions (type, title, text, options, category, sequence_number) VALUES


-- A) Overall Well-Being (single_choice)
('single_choice',
 'Overall Well-Being',
 'How do you feel overall in your current surroundings?',
 '{
   "options": [
     { "value": "very_good", "label": "Very good" },
     { "value": "good",      "label": "Good" },
     { "value": "neutral",   "label": "Neutral" },
     { "value": "bad",       "label": "Bad" },
     { "value": "very_bad",  "label": "Very bad" }
   ],
   "autoAdvance": true
 }',
 'well-being',
 310),

-- B) Sense of Safety (single_choice)
('single_choice',
 'Safety',
 'How safe do you feel here?',
 '{
   "options": [
     { "value": "very_safe",   "label": "Very safe" },
     { "value": "safe",        "label": "Safe" },
     { "value": "neutral",     "label": "Neutral" },
     { "value": "unsafe",      "label": "Unsafe" },
     { "value": "very_unsafe", "label": "Very unsafe" }
   ],
   "autoAdvance": true
 }',
 'well-being',
 320),

-- C) Relevant Social Factors (multiple_choice)
('multiple_choice',
 'Social Factors',
 'Which social factors matter most to your comfort in these surroundings?',
 '[{"value": "gender",    "label": "Gender identity"},
   {"value": "age",       "label": "Age / generation"},
   {"value": "ethnicity", "label": "Ethnicity / origin"},
   {"value": "finance",   "label": "Socioeconomic status"},
   {"value": "sexuality", "label": "Sexual orientation"},
   {"value": "none",      "label": "None / Not sure"}]',
 'well-being',
 330),

-- D) Gender Impact (slider)
('slider',
 'Gender Impact',
 'How does your gender identity impact your well-being here?',
 '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}',
 'well-being',
 340),

-- E) Age Impact (slider)
('slider',
 'Age Impact',
 'How does your age or generation impact your well-being here?',
 '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}',
 'well-being',
 350),

-- F) Ethnicity Impact (slider)
('slider',
 'Ethnicity Impact',
 'How does your cultural/ethnic background impact your well-being here?',
 '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}',
 'well-being',
 360),

-- G) Financial Impact (slider)
('slider',
 'Financial Impact',
 'How does your socioeconomic status impact your well-being here?',
 '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}',
 'well-being',
 370),

-- H) Sexual Orientation Impact (slider)
('slider',
 'Sexual Orientation Impact',
 'How does your sexual orientation impact your well-being here?',
 '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}',
 'well-being',
 380),

-- I) Text Reflection
('text',
 'Reflection',
 'Would you like to share any thoughts on how your intersecting identities shape your experience here?',
 NULL,
 'well-being',
 500);

