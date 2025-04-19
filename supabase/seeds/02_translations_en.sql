-- ================================================
-- TEIL 2: ENGLISCHE ÜBERSETZUNGEN
-- ================================================

INSERT INTO translations (question_id, language, title, text, options_content) VALUES
  -- Willkommensbildschirm
  ('welcome_screen', 'en', 'Hi!', 
   'This app is designed to help you reflect on your well-being in different situations and surroundings. It will ask short questions about your daily experiences to better understand how various factors influence how you feel.

You''ll receive brief surveys a few times a day, taking only a few minutes to answer. Your responses remain confidential and will be used solely to gain insights into how different environments and personal factors affect well-being.',
   '{"buttonText": "general.continue"}'),
  
  -- Einwilligungsbildschirm
  ('consent_screen', 'en', 'Consent to Participate', 
   'Before we begin, we ask for your consent to take part in a research study.

As part of this study, we will ask you some questions—first about yourself (e.g. age, gender identity), and then about your feelings and your surrounding environment at different moments in your day. Your responses help us understand how different people experience urban spaces and how these experiences relate to wellbeing.

**Participation is voluntary**. You can skip any question by selecting "Prefer not to say." You can also delete all your data at any time via the app settings.

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

By tapping **"I Agree"**, you confirm that:

- You understand the purpose of this study
- You agree to participate voluntarily
- You can withdraw at any time by deleting your data in the app settings

Please read our [Privacy Policy](#) for more details.',
   '{"buttonText": "general.agree"}'),
   
  -- Benachrichtigungsberechtigungen-Screen (neu)
  ('notifications_permission', 'en', 'Notifications', 
   'To participate effectively in this study, we need to send you notifications when a new survey is available.

These notifications will:
- Alert you when a new survey is ready to complete
- Only be sent a few times per day
- Help you provide data at different times and environments

Notifications are essential for receiving timely surveys throughout the day. Without them, you might miss opportunities to participate.',
   '{"buttonText": "general.ok"}'),
   
  -- Standortberechtigungen-Screen (neu)
  ('location_permission', 'en', 'Location Access', 
   'Understanding your surroundings is an important part of this study. We request access to your location to:

- Associate your responses with the places you visit
- Understand how different environments affect wellbeing
- Map urban experiences across different locations

Your location data is:
- Only collected when you actively complete a survey
- Never tracked continuously in the background
- Anonymous and cannot be linked to your identity',
   '{"buttonText": "general.ok"}'),
  
  -- Altersgruppe Frage
  ('age_question', 'en', 'Age Group', 'In which age group do you find yourself?', NULL),
  
  -- Geschlecht Frage
  ('gender_question', 'en', 'Gender Identity', 'With which gender identity do you identify?', NULL),
  
  -- Bildungsfrage
  ('education_question', 'en', 'Education', 'What is your highest level of education?', NULL),
  
  -- Einkommensfrage
  ('income_question', 'en', 'Income', 'In which income group do you roughly find yourself? (monthly net income)', NULL),
  
  -- Umgebungsinfo
  ('environment_info', 'en', 'Current environment', 
   'The following questions are about your current surroundings. Please select the option(s) that best describes your current location.',
   '{"buttonText": "general.continue"}'),
  
  -- Indoor/Outdoor
  ('indoor_outdoor', 'en', 'Indoor or Outdoor?', 'Are you indoors or outdoors?', NULL),
  
  -- Aktueller Ort
  ('current_place', 'en', 'Current Place', 'Where are you exactly?', NULL),
  
  -- Menschen in der Umgebung
  ('people_around', 'en', 'People around you', 'Who is with you?', NULL),
  
  -- Aktivität
  ('activity', 'en', 'Activity', 'What are you doing?', NULL),
  
  -- Wohlbefindensinfo
  ('wellbeing_info', 'en', 'Well-Being Questions', 
   'The following questions are about your well-being in your current surroundings. Please select the option(s) that best describes your current well-being.',
   '{"buttonText": "general.continue"}'),
  
  -- Allgemeines Wohlbefinden
  ('overall_wellbeing', 'en', 'Overall Well-Being', 'How do you feel overall in your current surroundings?', NULL),
  
  -- Sicherheitsgefühl
  ('safety', 'en', 'Safety', 'How safe do you feel here?', NULL),
  
  -- Soziale Faktoren
  ('social_factors', 'en', 'Social Factors', 'Which social factors matter most to your comfort in these surroundings?', NULL),
  
  -- Geschlechtseinfluss
  ('gender_impact', 'en', 'Gender Impact', 'How does your gender identity impact your well-being here?', NULL),
  
  -- Alterseinfluss
  ('age_impact', 'en', 'Age Impact', 'How does your age or generation impact your well-being here?', NULL),
  
  -- Einfluss der ethnischen Herkunft
  ('ethnicity_impact', 'en', 'Ethnicity Impact', 'How does your cultural/ethnic background impact your well-being here?', NULL),
  
  -- Finanzieller Einfluss
  ('financial_impact', 'en', 'Financial Impact', 'How does your socioeconomic status impact your well-being here?', NULL),
  
  -- Einfluss der sexuellen Orientierung
  ('sexual_orientation_impact', 'en', 'Sexual Orientation Impact', 'How does your sexual orientation impact your well-being here?', NULL),
  
  -- Textliche Reflexion
  ('reflection', 'en', 'Reflection', 'Would you like to share any thoughts on how your intersecting identities shape your experience here?', NULL);