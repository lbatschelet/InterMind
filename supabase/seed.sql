-- Hauptseed-Datei
-- Alle SQL-Anweisungen in einer Datei

-- ================================================
-- TEIL 1: BASISSTRUKTUR (FRAGEN)
-- ================================================

-- Fragen-Metadaten (ohne sprachabhängige Inhalte)
INSERT INTO questions (id, type, category, sequence_number, image_source, options_structure) VALUES
  -- Willkommensbildschirm
  ('welcome_screen', 'info_screen', 'welcome', 0, NULL, '{"buttonText": "Next", "showOnce": true}'),
  
  -- Einwilligungsbildschirm
  ('consent_screen', 'info_screen', 'demographic', 10, 'contract', '{"buttonText": "I Agree", "showOnce": true}'),
  
  -- Altersgruppen Frage
  ('age_question', 'single_choice', 'demographic', 100, NULL, 
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
    ], "showOnce": true, "autoAdvance": true}'),
  
  -- Geschlecht Frage
  ('gender_question', 'single_choice', 'demographic', 110, NULL,
   '{"options": [
        {"value": "female", "label": "Female"},
        {"value": "male", "label": "Male"},
        {"value": "diverse", "label": "Diverse"},
        {"value": "other", "label": "Other"},
        {"value": "no_answer", "label": "No answer"}
    ], "showOnce": true, "autoAdvance": true}'),
  
  -- Bildungsstand
  ('education_question', 'single_choice', 'demographic', 120, NULL,
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
    ], "showOnce": true, "autoAdvance": true}'),
  
  -- Einkommen (optional)
  ('income_question', 'single_choice', 'demographic', 130, NULL,
   '{"options": [
        {"value": "below_1500", "label": "Below CHF 1.500"},
        {"value": "1500_3000", "label": "CHF 1.500 - 3.000"},
        {"value": "3000_4500", "label": "CHF 3.000 - 4.500"},
        {"value": "4500_6000", "label": "CHF 4.500 - 6.000"},
        {"value": "6000_7500", "label": "CHF 6.000 - 7.500"},
        {"value": "above_7500", "label": "Above CHF 7.500"},
        {"value": "no_answer", "label": "No answer"}
    ], "showOnce": true, "autoAdvance": true}'),

  -- Info Screen für Umgebungsfragen
  ('environment_info', 'info_screen', 'well-being', 200, 'our-neighborhood', '{"buttonText": "Next", "showOnce": false}'),

  -- Indoor oder Outdoor
  ('indoor_outdoor', 'single_choice', 'well-being', 210, NULL,
   '{"options": [
        {"value": "indoor", "label": "Indoors"},
        {"value": "outdoor", "label": "Outdoors"}
    ], "showOnce": false, "autoAdvance": true}'),

  -- Aktueller Ort
  ('current_place', 'single_choice', 'well-being', 220, NULL,
   '{"options": [
        {"value": "home", "label": "Home"},
        {"value": "work", "label": "Work"},
        {"value": "school", "label": "School/University"},
        {"value": "public_space", "label": "Public place (e.g. shop, bar, etc.)"},
        {"value": "public_transport", "label": "Public transport"},
        {"value": "park", "label": "Park"},
        {"value": "other", "label": "Other"}
    ], "showOnce": false, "autoAdvance": true}'),

  -- Menschen in der Umgebung
  ('people_around', 'multiple_choice', 'well-being', 230, NULL,
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
    ], "showOnce": false, "autoAdvance": false}'),

  -- Aktivität
  ('activity', 'single_choice', 'well-being', 240, NULL,
   '{"options": [
        {"value": "leisure", "label": "Leisure/Relaxation"},
        {"value": "traveling", "label": "Traveling"},
        {"value": "working", "label": "Working/Studying"},
        {"value": "shopping", "label": "Shopping"},
        {"value": "housework", "label": "Housework"},
        {"value": "other", "label": "Other"}
    ], "showOnce": false, "autoAdvance": false}'),

  -- Info Screen für Wohlbefindensfragen
  ('wellbeing_info', 'info_screen', 'well-being', 300, 'undraw_relaxation_ies6', '{"buttonText": "Next", "showOnce": false}'),

  -- Allgemeines Wohlbefinden
  ('overall_wellbeing', 'single_choice', 'well-being', 310, NULL,
   '{"options": [
        {"value": "very_good", "label": "Very good"},
        {"value": "good", "label": "Good"},
        {"value": "neutral", "label": "Neutral"},
        {"value": "bad", "label": "Bad"},
        {"value": "very_bad", "label": "Very bad"}
    ], "autoAdvance": true}'),

  -- Sicherheitsgefühl
  ('safety', 'single_choice', 'well-being', 320, NULL,
   '{"options": [
        {"value": "very_safe", "label": "Very safe"},
        {"value": "safe", "label": "Safe"},
        {"value": "neutral", "label": "Neutral"},
        {"value": "unsafe", "label": "Unsafe"},
        {"value": "very_unsafe", "label": "Very unsafe"}
    ], "autoAdvance": true}'),

  -- Soziale Faktoren
  ('social_factors', 'multiple_choice', 'well-being', 330, NULL,
   '{"options": [
        {"value": "gender", "label": "Gender identity"},
        {"value": "age", "label": "Age / generation"},
        {"value": "ethnicity", "label": "Ethnicity / origin"},
        {"value": "finance", "label": "Socioeconomic status"},
        {"value": "sexuality", "label": "Sexual orientation"},
        {"value": "none", "label": "None / Not sure"}
    ]}'),

  -- Geschlechtseinfluss
  ('gender_impact', 'slider', 'well-being', 340, NULL,
   '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}'),

  -- Alterseinfluss
  ('age_impact', 'slider', 'well-being', 350, NULL,
   '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}'),

  -- Einfluss der ethnischen Herkunft
  ('ethnicity_impact', 'slider', 'well-being', 360, NULL,
   '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}'),

  -- Finanzieller Einfluss
  ('financial_impact', 'slider', 'well-being', 370, NULL,
   '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}'),

  -- Einfluss der sexuellen Orientierung
  ('sexual_orientation_impact', 'slider', 'well-being', 380, NULL,
   '{"values": ["Negative impact", "No or neutral impact", "Positive impact"]}'),

  -- Textliche Reflexion
  ('reflection', 'text', 'well-being', 500, NULL, NULL);

-- ================================================
-- TEIL 2: ENGLISCHE ÜBERSETZUNGEN
-- ================================================

INSERT INTO translations (question_id, language, title, text, options_content) VALUES
  -- Willkommensbildschirm
  ('welcome_screen', 'en', 'Hi!', 
   'This app is designed to help you reflect on your well-being in different situations and surroundings. It will ask short questions about your daily experiences to better understand how various factors influence how you feel.

You''ll receive brief surveys a few times a day, taking only a few minutes to answer. Your responses remain confidential and will be used solely to gain insights into how different environments and personal factors affect well-being.',
   '{"buttonText": "Next"}'),
  
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
   '{"buttonText": "I Agree"}'),
  
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
   '{"buttonText": "Next"}'),
  
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
   '{"buttonText": "Next"}'),
  
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

-- ================================================
-- TEIL 3: DEUTSCHE ÜBERSETZUNGEN
-- ================================================

INSERT INTO translations (question_id, language, title, text, options_content) VALUES
  -- Willkommensbildschirm
  ('welcome_screen', 'de', 'Hallo!', 
   'Diese App soll dir helfen, über dein Wohlbefinden in verschiedenen Situationen und Umgebungen nachzudenken. Sie stellt kurze Fragen zu deinen täglichen Erfahrungen, um besser zu verstehen, wie verschiedene Faktoren dein Befinden beeinflussen.

Du erhältst mehrmals täglich kurze Umfragen, deren Beantwortung nur wenige Minuten dauert. Deine Antworten bleiben vertraulich und werden ausschließlich genutzt, um Erkenntnisse darüber zu gewinnen, wie verschiedene Umgebungen und persönliche Faktoren das Wohlbefinden beeinflussen.',
   '{"buttonText": "Weiter"}'),
  
  -- Einwilligungsbildschirm
  ('consent_screen', 'de', 'Einwilligung zur Teilnahme', 
   'Bevor wir beginnen, bitten wir dich um deine Einwilligung zur Teilnahme an einer Forschungsstudie.

Im Rahmen dieser Studie werden wir dir einige Fragen stellen – zunächst zu deiner Person (z.B. Alter, Geschlechtsidentität) und dann zu deinen Gefühlen und deiner Umgebung zu verschiedenen Zeitpunkten deines Tages. Deine Antworten helfen uns zu verstehen, wie verschiedene Menschen städtische Räume erleben und wie diese Erfahrungen mit dem Wohlbefinden zusammenhängen.

**Die Teilnahme ist freiwillig**. Du kannst jede Frage überspringen, indem du "Keine Angabe" auswählst. Du kannst auch jederzeit alle deine Daten über die App-Einstellungen löschen.

## Welche Daten werden erhoben?

- **Demografische Daten** wie Alter und Geschlechtsidentität
- **Umfrageantworten** zu deinen Emotionen, Gedanken und Umgebungen
- **Standortdaten** per GPS (wenn du dies erlaubst)

Wir erheben **nicht** deinen Namen, deine Telefonnummer, E-Mail-Adresse oder andere identifizierende Informationen. Deine Antworten sind **vollständig anonym** und **können nicht mit dir in Verbindung gebracht werden**.

## Wie werden deine Daten verwendet?

Deine Daten werden:

- Für **akademische Forschung** zu Wohlbefinden und städtischem Raum verwendet
- Sicher auf einem **passwortgeschützten Server** gespeichert
- **Nicht an Dritte weitergegeben**
- **Anonymisiert** und **nicht identifizierbar** sein
- Jederzeit durch dich über die App löschbar sein

## Deine Einwilligung

Durch Tippen auf **"Ich stimme zu"** bestätigst du, dass:

- Du den Zweck dieser Studie verstehst
- Du freiwillig teilnimmst
- Du jederzeit zurücktreten kannst, indem du deine Daten in den App-Einstellungen löschst

Bitte lies unsere [Datenschutzrichtlinie](#) für weitere Details.',
   '{"buttonText": "Ich stimme zu"}'),
  
  -- Altersgruppe Frage
  ('age_question', 'de', 'Altersgruppe', 'In welcher Altersgruppe befindest du dich?', 
   '{"options": [
        {"value": "0-17", "label": "Unter 16"},
        {"value": "18-24", "label": "16-25"},
        {"value": "25-34", "label": "26-35"},
        {"value": "35-44", "label": "36-45"},
        {"value": "45-54", "label": "46-55"},
        {"value": "55-64", "label": "56-65"},
        {"value": "65-74", "label": "66-75"},
        {"value": "75+", "label": "75+"},
        {"value": "no_answer", "label": "Keine Angabe"}
    ]}'),
  
  -- Geschlecht Frage
  ('gender_question', 'de', 'Geschlechtsidentität', 'Mit welcher Geschlechtsidentität identifizierst du dich?',
   '{"options": [
        {"value": "female", "label": "Weiblich"},
        {"value": "male", "label": "Männlich"},
        {"value": "diverse", "label": "Divers"},
        {"value": "other", "label": "Andere"},
        {"value": "no_answer", "label": "Keine Angabe"}
    ]}'),
  
  -- Bildungsfrage
  ('education_question', 'de', 'Bildung', 'Was ist dein höchster Bildungsabschluss?',
   '{"options": [
        {"value": "none", "label": "Kein Abschluss"},
        {"value": "primary", "label": "Grundschule"},
        {"value": "secondary", "label": "Sekundarschule"},
        {"value": "highschool", "label": "Gymnasium/Abitur"},
        {"value": "apprenticeship", "label": "Berufsausbildung"},
        {"value": "bachelor", "label": "Bachelor"},
        {"value": "master", "label": "Master"},
        {"value": "phd", "label": "Promotion"},
        {"value": "no_answer", "label": "Keine Angabe"}
    ]}'),
  
  -- Einkommensfrage
  ('income_question', 'de', 'Einkommen', 'In welcher Einkommensgruppe befindest du dich ungefähr? (monatliches Nettoeinkommen)',
   '{"options": [
        {"value": "below_1500", "label": "Unter CHF 1.500"},
        {"value": "1500_3000", "label": "CHF 1.500 - 3.000"},
        {"value": "3000_4500", "label": "CHF 3.000 - 4.500"},
        {"value": "4500_6000", "label": "CHF 4.500 - 6.000"},
        {"value": "6000_7500", "label": "CHF 6.000 - 7.500"},
        {"value": "above_7500", "label": "Über CHF 7.500"},
        {"value": "no_answer", "label": "Keine Angabe"}
    ]}'),
  
  -- Umgebungsinfo
  ('environment_info', 'de', 'Aktuelle Umgebung', 
   'Die folgenden Fragen beziehen sich auf deine aktuelle Umgebung. Bitte wähle die Option(en), die deinen aktuellen Standort am besten beschreibt/beschreiben.',
   '{"buttonText": "Weiter"}'),
  
  -- Indoor/Outdoor
  ('indoor_outdoor', 'de', 'Drinnen oder draußen?', 'Befindest du dich drinnen oder draußen?',
   '{"options": [
        {"value": "indoor", "label": "Drinnen"},
        {"value": "outdoor", "label": "Draußen"}
    ]}'),
  
  -- Aktueller Ort
  ('current_place', 'de', 'Aktueller Ort', 'Wo bist du genau?',
   '{"options": [
        {"value": "home", "label": "Zuhause"},
        {"value": "work", "label": "Arbeitsplatz"},
        {"value": "school", "label": "Schule/Universität"},
        {"value": "public_space", "label": "Öffentlicher Ort (z.B. Geschäft, Bar, usw.)"},
        {"value": "public_transport", "label": "Öffentlicher Verkehr"},
        {"value": "park", "label": "Park"},
        {"value": "other", "label": "Andere"}
    ]}'),
  
  -- Menschen in der Umgebung
  ('people_around', 'de', 'Menschen um dich herum', 'Wer ist bei dir?',
   '{"options": [
        {"value": "nobody", "label": "Niemand"},
        {"value": "acquaintances", "label": "Bekannte"},
        {"value": "colleagues", "label": "Kollegen"},
        {"value": "family", "label": "Familie"},
        {"value": "partner", "label": "Partner(in)"},
        {"value": "children", "label": "Kinder"},
        {"value": "friends", "label": "Freunde"},
        {"value": "pets", "label": "Haustiere"},
        {"value": "strangers", "label": "Fremde"},
        {"value": "other", "label": "Andere"}
    ]}'),
  
  -- Aktivität
  ('activity', 'de', 'Aktivität', 'Was machst du gerade?',
   '{"options": [
        {"value": "leisure", "label": "Freizeit/Entspannung"},
        {"value": "traveling", "label": "Unterwegs sein"},
        {"value": "working", "label": "Arbeiten/Studieren"},
        {"value": "shopping", "label": "Einkaufen"},
        {"value": "housework", "label": "Hausarbeit"},
        {"value": "other", "label": "Anderes"}
    ]}'),
  
  -- Wohlbefindensinfo
  ('wellbeing_info', 'de', 'Fragen zum Wohlbefinden', 
   'Die folgenden Fragen beziehen sich auf dein Wohlbefinden in deiner aktuellen Umgebung. Bitte wähle die Option(en), die dein aktuelles Wohlbefinden am besten beschreibt/beschreiben.',
   '{"buttonText": "Weiter"}'),
  
  -- Allgemeines Wohlbefinden
  ('overall_wellbeing', 'de', 'Allgemeines Wohlbefinden', 'Wie fühlst du dich insgesamt in deiner aktuellen Umgebung?',
   '{"options": [
        {"value": "very_good", "label": "Sehr gut"},
        {"value": "good", "label": "Gut"},
        {"value": "neutral", "label": "Neutral"},
        {"value": "bad", "label": "Schlecht"},
        {"value": "very_bad", "label": "Sehr schlecht"}
    ]}'),
  
  -- Sicherheitsgefühl
  ('safety', 'de', 'Sicherheit', 'Wie sicher fühlst du dich hier?',
   '{"options": [
        {"value": "very_safe", "label": "Sehr sicher"},
        {"value": "safe", "label": "Sicher"},
        {"value": "neutral", "label": "Neutral"},
        {"value": "unsafe", "label": "Unsicher"},
        {"value": "very_unsafe", "label": "Sehr unsicher"}
    ]}'),
  
  -- Soziale Faktoren
  ('social_factors', 'de', 'Soziale Faktoren', 'Welche sozialen Faktoren sind am wichtigsten für dein Wohlbefinden in dieser Umgebung?',
   '{"options": [
        {"value": "gender", "label": "Geschlechtsidentität"},
        {"value": "age", "label": "Alter / Generation"},
        {"value": "ethnicity", "label": "Ethnizität / Herkunft"},
        {"value": "finance", "label": "Sozioökonomischer Status"},
        {"value": "sexuality", "label": "Sexuelle Orientierung"},
        {"value": "none", "label": "Keine / Nicht sicher"}
    ]}'),
  
  -- Geschlechtseinfluss
  ('gender_impact', 'de', 'Geschlechtseinfluss', 'Wie beeinflusst deine Geschlechtsidentität dein Wohlbefinden hier?',
   '{"values": ["Negative Auswirkung", "Keine oder neutrale Auswirkung", "Positive Auswirkung"]}'),
  
  -- Alterseinfluss
  ('age_impact', 'de', 'Alterseinfluss', 'Wie beeinflusst dein Alter oder deine Generation dein Wohlbefinden hier?',
   '{"values": ["Negative Auswirkung", "Keine oder neutrale Auswirkung", "Positive Auswirkung"]}'),
  
  -- Einfluss der ethnischen Herkunft
  ('ethnicity_impact', 'de', 'Einfluss der Herkunft', 'Wie beeinflusst dein kultureller/ethnischer Hintergrund dein Wohlbefinden hier?',
   '{"values": ["Negative Auswirkung", "Keine oder neutrale Auswirkung", "Positive Auswirkung"]}'),
  
  -- Finanzieller Einfluss
  ('financial_impact', 'de', 'Finanzieller Einfluss', 'Wie beeinflusst dein sozioökonomischer Status dein Wohlbefinden hier?',
   '{"values": ["Negative Auswirkung", "Keine oder neutrale Auswirkung", "Positive Auswirkung"]}'),
  
  -- Einfluss der sexuellen Orientierung
  ('sexual_orientation_impact', 'de', 'Einfluss der sexuellen Orientierung', 'Wie beeinflusst deine sexuelle Orientierung dein Wohlbefinden hier?',
   '{"values": ["Negative Auswirkung", "Keine oder neutrale Auswirkung", "Positive Auswirkung"]}'),
  
  -- Textliche Reflexion
  ('reflection', 'de', 'Reflexion', 'Möchtest du Gedanken dazu teilen, wie deine sich überschneidenden Identitäten deine Erfahrung hier prägen?', NULL); 