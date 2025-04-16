-- Dieses Skript aktualisiert die bestehenden Fragen in der Datenbank mit mehrsprachigem Support
-- Führe es aus, um deutsche Übersetzungen für die vorhandenen Fragen hinzuzufügen

-- =========================================
-- 1. Schritt: Info-Screens übersetzen
-- =========================================

-- Begrüßungs-Bildschirm
UPDATE questions
SET title = '{"en": "Hi!", "de": "Hallo!"}',
    text = '{"en": "This app is designed to help you reflect on your well-being in different situations and surroundings. It will ask short questions about your daily experiences to better understand how various factors influence how you feel.\n\nYou''ll receive brief surveys a few times a day, taking only a few minutes to answer. Your responses remain confidential and will be used solely to gain insights into how different environments and personal factors affect well-being.", 
             "de": "Diese App soll dir helfen, über dein Wohlbefinden in verschiedenen Situationen und Umgebungen nachzudenken. Sie stellt kurze Fragen zu deinen täglichen Erfahrungen, um besser zu verstehen, wie verschiedene Faktoren dein Befinden beeinflussen.\n\nDu erhältst mehrmals täglich kurze Umfragen, deren Beantwortung nur wenige Minuten dauert. Deine Antworten bleiben vertraulich und werden ausschließlich genutzt, um Erkenntnisse darüber zu gewinnen, wie verschiedene Umgebungen und persönliche Faktoren das Wohlbefinden beeinflussen."}',
    options = '{"buttonText": {"en": "Next", "de": "Weiter"}, "showOnce": true}'
WHERE category = 'welcome';

-- Einwilligungsbildschirm
UPDATE questions
SET title = '{"en": "Consent to Participate", "de": "Einwilligung zur Teilnahme"}',
    text = '{"en": "Before we begin, we ask for your consent to take part in a research study.\n\nAs part of this study, we will ask you some questions—first about yourself (e.g. age, gender identity), and then about your feelings and your surrounding environment at different moments in your day. Your responses help us understand how different people experience urban spaces and how these experiences relate to wellbeing.\n\n**Participation is voluntary**. You can skip any question by selecting \"Prefer not to say.\" You can also delete all your data at any time via the app settings.\n\n## What Data Will Be Collected?\n\n- **Demographic data**, such as your age and gender identity  \n- **Survey responses** about your emotions, thoughts, and surroundings  \n- **Location data** via GPS (if you choose to allow it)\n\nWe do **not** collect your name, phone number, email address, or any other identifying information. Your responses are **completely anonymous** and **cannot be linked to you**.\n\n## How Will Your Data Be Used?\n\nYour data will be:\n\n- Used for **academic research** on wellbeing and urban space\n- Stored securely on a **password-protected server**\n- **Not shared** with third parties\n- **Anonymized** and **non-identifiable**\n- Deletable by you at any time through the app\n\n## Your Consent\n\nBy tapping **\"I Agree\"**, you confirm that:\n\n- You understand the purpose of this study\n- You agree to participate voluntarily\n- You can withdraw at any time by deleting your data in the app settings\n\nPlease read our [Privacy Policy](#) for more details.", 
             "de": "Bevor wir beginnen, bitten wir um deine Einwilligung zur Teilnahme an einer Forschungsstudie.\n\nIm Rahmen dieser Studie werden wir dir einige Fragen stellen — zunächst über dich selbst (z.B. Alter, Geschlechtsidentität) und dann über deine Gefühle und deine Umgebung zu verschiedenen Zeitpunkten deines Tages. Deine Antworten helfen uns zu verstehen, wie verschiedene Menschen städtische Räume erleben und wie diese Erfahrungen mit dem Wohlbefinden zusammenhängen.\n\n**Die Teilnahme ist freiwillig**. Du kannst jede Frage überspringen, indem du \"Keine Angabe\" wählst. Du kannst auch jederzeit alle deine Daten über die App-Einstellungen löschen.\n\n## Welche Daten werden erhoben?\n\n- **Demografische Daten** wie Alter und Geschlechtsidentität\n- **Umfrageantworten** zu deinen Emotionen, Gedanken und deiner Umgebung\n- **Standortdaten** via GPS (wenn du dies erlaubst)\n\nWir erfassen **nicht** deinen Namen, deine Telefonnummer, E-Mail-Adresse oder andere identifizierende Informationen. Deine Antworten sind **vollständig anonym** und **können nicht mit dir in Verbindung gebracht werden**.\n\n## Wie werden deine Daten verwendet?\n\nDeine Daten werden:\n\n- Für **akademische Forschung** zum Wohlbefinden und städtischen Raum verwendet\n- Sicher auf einem **passwortgeschützten Server** gespeichert\n- **Nicht** an Dritte weitergegeben\n- **Anonymisiert** und **nicht identifizierbar** sein\n- Von dir jederzeit über die App löschbar sein\n\n## Deine Einwilligung\n\nDurch Tippen auf **\"Ich stimme zu\"** bestätigst du, dass:\n\n- Du den Zweck dieser Studie verstehst\n- Du freiwillig teilnimmst\n- Du jederzeit durch Löschen deiner Daten in den App-Einstellungen zurücktreten kannst\n\nBitte lies unsere [Datenschutzrichtlinie](#) für weitere Details."}',
    options = '{"buttonText": {"en": "I Agree", "de": "Ich stimme zu"}, "showOnce": true}'
WHERE category = 'demographic' AND type = 'info_screen';

-- Umgebungsfragen-Intro
UPDATE questions
SET title = '{"en": "Current environment", "de": "Aktuelle Umgebung"}',
    text = '{"en": "The following questions are about your current surroundings. Please select the option(s) that best describes your current location.", 
             "de": "Die folgenden Fragen betreffen deine aktuelle Umgebung. Bitte wähle die Option(en), die deinen aktuellen Standort am besten beschreiben."}',
    options = '{"buttonText": {"en": "Next", "de": "Weiter"}, "showOnce": false}'
WHERE category = 'well-being' AND sequence_number = 200;

-- Wohlbefindens-Intro
UPDATE questions
SET title = '{"en": "Well-Being Questions", "de": "Fragen zum Wohlbefinden"}',
    text = '{"en": "The following questions are about your well-being in your current surroundings. Please select the option(s) that best describes your current well-being.", 
             "de": "Die folgenden Fragen betreffen dein Wohlbefinden in deiner aktuellen Umgebung. Bitte wähle die Option(en), die dein aktuelles Wohlbefinden am besten beschreiben."}',
    options = '{"buttonText": {"en": "Next", "de": "Weiter"}, "showOnce": false}'
WHERE category = 'well-being' AND sequence_number = 300;

-- =========================================
-- 2. Schritt: Demografische Fragen
-- =========================================

-- Altersgruppe
UPDATE questions
SET title = '{"en": "Age Group", "de": "Altersgruppe"}',
    text = '{"en": "In which age group do you find yourself?", "de": "In welcher Altersgruppe befindest du dich?"}',
    options = '{"options": [
        {"value": "0-17", "label": {"en": "Below 16", "de": "Unter 16"}},
        {"value": "18-24", "label": {"en": "16-25", "de": "16-25"}},
        {"value": "25-34", "label": {"en": "26-35", "de": "26-35"}},
        {"value": "35-44", "label": {"en": "36-45", "de": "36-45"}},
        {"value": "45-54", "label": {"en": "46-55", "de": "46-55"}},
        {"value": "55-64", "label": {"en": "56-65", "de": "56-65"}},
        {"value": "65-74", "label": {"en": "66-75", "de": "66-75"}},
        {"value": "75+", "label": {"en": "75+", "de": "75+"}},
        {"value": "no_answer", "label": {"en": "No answer", "de": "Keine Angabe"}}
    ], "showOnce": true, "autoAdvance": true}'
WHERE category = 'demographic' AND sequence_number = 100;

-- Geschlecht
UPDATE questions
SET title = '{"en": "Gender Identity", "de": "Geschlechtsidentität"}',
    text = '{"en": "With which gender identity do you identify?", "de": "Mit welcher Geschlechtsidentität identifizierst du dich?"}',
    options = '{"options": [
        {"value": "female", "label": {"en": "Female", "de": "Weiblich"}},
        {"value": "male", "label": {"en": "Male", "de": "Männlich"}},
        {"value": "diverse", "label": {"en": "Diverse", "de": "Divers"}},
        {"value": "other", "label": {"en": "Other", "de": "Andere"}},
        {"value": "no_answer", "label": {"en": "No answer", "de": "Keine Angabe"}}
    ], "showOnce": true, "autoAdvance": true}'
WHERE category = 'demographic' AND sequence_number = 110;

-- Bildung
UPDATE questions
SET title = '{"en": "Education", "de": "Bildung"}',
    text = '{"en": "What is your highest level of education?", "de": "Was ist dein höchster Bildungsabschluss?"}',
    options = '{"options": [
        {"value": "none", "label": {"en": "No degree", "de": "Kein Abschluss"}},
        {"value": "primary", "label": {"en": "Primary school", "de": "Grundschule"}},
        {"value": "secondary", "label": {"en": "Secondary school", "de": "Sekundarschule"}},
        {"value": "highschool", "label": {"en": "High school", "de": "Gymnasium/Abitur"}},
        {"value": "apprenticeship", "label": {"en": "Apprenticeship", "de": "Berufsausbildung"}},
        {"value": "bachelor", "label": {"en": "Bachelor", "de": "Bachelor"}},
        {"value": "master", "label": {"en": "Master", "de": "Master"}},
        {"value": "phd", "label": {"en": "Promotion", "de": "Promotion"}},
        {"value": "no_answer", "label": {"en": "No answer", "de": "Keine Angabe"}}
    ], "showOnce": true, "autoAdvance": true}'
WHERE category = 'demographic' AND sequence_number = 120;

-- Einkommen
UPDATE questions
SET title = '{"en": "Income", "de": "Einkommen"}',
    text = '{"en": "In which income group do you roughly find yourself? (monthly net income)", "de": "In welcher Einkommensgruppe befindest du dich ungefähr? (monatliches Nettoeinkommen)"}',
    options = '{"options": [
        {"value": "below_1500", "label": {"en": "Below CHF 1.500", "de": "Unter CHF 1.500"}},
        {"value": "1500_3000", "label": {"en": "CHF 1.500 - 3.000", "de": "CHF 1.500 - 3.000"}},
        {"value": "3000_4500", "label": {"en": "CHF 3.000 - 4.500", "de": "CHF 3.000 - 4.500"}},
        {"value": "4500_6000", "label": {"en": "CHF 4.500 - 6.000", "de": "CHF 4.500 - 6.000"}},
        {"value": "6000_7500", "label": {"en": "CHF 6.000 - 7.500", "de": "CHF 6.000 - 7.500"}},
        {"value": "above_7500", "label": {"en": "Above CHF 7.500", "de": "Über CHF 7.500"}},
        {"value": "no_answer", "label": {"en": "No answer", "de": "Keine Angabe"}}
    ], "showOnce": true, "autoAdvance": true}'
WHERE category = 'demographic' AND sequence_number = 130;

-- =========================================
-- 3. Schritt: Umgebungsfragen
-- =========================================

-- Drinnen oder Draußen
UPDATE questions
SET title = '{"en": "Indoor or Outdoor?", "de": "Drinnen oder Draußen?"}',
    text = '{"en": "Are you indoors or outdoors?", "de": "Bist du drinnen oder draußen?"}',
    options = '{"options": [
        {"value": "indoor", "label": {"en": "Indoors", "de": "Drinnen"}},
        {"value": "outdoor", "label": {"en": "Outdoors", "de": "Draußen"}}
    ], "showOnce": false, "autoAdvance": true}'
WHERE category = 'well-being' AND sequence_number = 210;

-- Aktueller Ort
UPDATE questions
SET title = '{"en": "Current Place", "de": "Aktueller Ort"}',
    text = '{"en": "Where are you exactly?", "de": "Wo bist du genau?"}',
    options = '{"options": [
        {"value": "home", "label": {"en": "Home", "de": "Zuhause"}},
        {"value": "work", "label": {"en": "Work", "de": "Arbeitsplatz"}},
        {"value": "school", "label": {"en": "School/University", "de": "Schule/Universität"}},
        {"value": "public_space", "label": {"en": "Public place (e.g. shop, bar, etc.)", "de": "Öffentlicher Ort (z.B. Geschäft, Bar, usw.)"}},
        {"value": "public_transport", "label": {"en": "Public transport", "de": "Öffentlicher Verkehr"}},
        {"value": "park", "label": {"en": "Park", "de": "Park"}},
        {"value": "other", "label": {"en": "Other", "de": "Andere"}}
    ], "showOnce": false, "autoAdvance": true}'
WHERE category = 'well-being' AND sequence_number = 220;

-- Menschen in der Umgebung
UPDATE questions
SET title = '{"en": "People around you", "de": "Menschen um dich herum"}',
    text = '{"en": "Who is with you?", "de": "Wer ist bei dir?"}',
    options = '{"options": [
        {"value": "nobody", "label": {"en": "Nobody", "de": "Niemand"}},
        {"value": "acquaintances", "label": {"en": "Acquaintances", "de": "Bekannte"}},
        {"value": "colleagues", "label": {"en": "Colleagues", "de": "Kollegen"}},
        {"value": "family", "label": {"en": "Family", "de": "Familie"}},
        {"value": "partner", "label": {"en": "Partner", "de": "Partner(in)"}},
        {"value": "children", "label": {"en": "Children", "de": "Kinder"}},
        {"value": "friends", "label": {"en": "Friends", "de": "Freunde"}},
        {"value": "pets", "label": {"en": "Pets", "de": "Haustiere"}},
        {"value": "strangers", "label": {"en": "Strangers", "de": "Fremde"}},
        {"value": "other", "label": {"en": "Other", "de": "Andere"}}
    ], "showOnce": false, "autoAdvance": false}'
WHERE category = 'well-being' AND sequence_number = 230;

-- Aktivität
UPDATE questions
SET title = '{"en": "Activity", "de": "Aktivität"}',
    text = '{"en": "What are you doing?", "de": "Was machst du gerade?"}',
    options = '{"options": [
        {"value": "leisure", "label": {"en": "Leisure/Relaxation", "de": "Freizeit/Entspannung"}},
        {"value": "traveling", "label": {"en": "Traveling", "de": "Unterwegs sein"}},
        {"value": "working", "label": {"en": "Working/Studying", "de": "Arbeiten/Studieren"}},
        {"value": "shopping", "label": {"en": "Shopping", "de": "Einkaufen"}},
        {"value": "housework", "label": {"en": "Housework", "de": "Hausarbeit"}},
        {"value": "other", "label": {"en": "Other", "de": "Anderes"}}
    ], "showOnce": false, "autoAdvance": false}'
WHERE category = 'well-being' AND sequence_number = 240;

-- =========================================
-- 4. Schritt: Wohlbefindensfragen
-- =========================================

-- Allgemeines Wohlbefinden
UPDATE questions
SET title = '{"en": "Overall Well-Being", "de": "Allgemeines Wohlbefinden"}',
    text = '{"en": "How do you feel overall in your current surroundings?", "de": "Wie fühlst du dich insgesamt in deiner aktuellen Umgebung?"}',
    options = '{"options": [
        {"value": "very_good", "label": {"en": "Very good", "de": "Sehr gut"}},
        {"value": "good", "label": {"en": "Good", "de": "Gut"}},
        {"value": "neutral", "label": {"en": "Neutral", "de": "Neutral"}},
        {"value": "bad", "label": {"en": "Bad", "de": "Schlecht"}},
        {"value": "very_bad", "label": {"en": "Very bad", "de": "Sehr schlecht"}}
    ], "autoAdvance": true}'
WHERE category = 'well-being' AND sequence_number = 310;

-- Sicherheitsgefühl
UPDATE questions
SET title = '{"en": "Safety", "de": "Sicherheit"}',
    text = '{"en": "How safe do you feel here?", "de": "Wie sicher fühlst du dich hier?"}',
    options = '{"options": [
        {"value": "very_safe", "label": {"en": "Very safe", "de": "Sehr sicher"}},
        {"value": "safe", "label": {"en": "Safe", "de": "Sicher"}},
        {"value": "neutral", "label": {"en": "Neutral", "de": "Neutral"}},
        {"value": "unsafe", "label": {"en": "Unsafe", "de": "Unsicher"}},
        {"value": "very_unsafe", "label": {"en": "Very unsafe", "de": "Sehr unsicher"}}
    ], "autoAdvance": true}'
WHERE category = 'well-being' AND sequence_number = 320;

-- Soziale Faktoren
UPDATE questions
SET title = '{"en": "Social Factors", "de": "Soziale Faktoren"}',
    text = '{"en": "Which social factors matter most to your comfort in these surroundings?", "de": "Welche sozialen Faktoren sind am wichtigsten für dein Wohlbefinden in dieser Umgebung?"}',
    options = '{"options": [
        {"value": "gender", "label": {"en": "Gender identity", "de": "Geschlechtsidentität"}},
        {"value": "age", "label": {"en": "Age / generation", "de": "Alter / Generation"}},
        {"value": "ethnicity", "label": {"en": "Ethnicity / origin", "de": "Ethnizität / Herkunft"}},
        {"value": "finance", "label": {"en": "Socioeconomic status", "de": "Sozioökonomischer Status"}},
        {"value": "sexuality", "label": {"en": "Sexual orientation", "de": "Sexuelle Orientierung"}},
        {"value": "none", "label": {"en": "None / Not sure", "de": "Keine / Nicht sicher"}}
    ]}'
WHERE category = 'well-being' AND sequence_number = 330;

-- Geschlechtseinfluss
UPDATE questions
SET title = '{"en": "Gender Impact", "de": "Geschlechtseinfluss"}',
    text = '{"en": "How does your gender identity impact your well-being here?", "de": "Wie beeinflusst deine Geschlechtsidentität dein Wohlbefinden hier?"}',
    options = '{"values": [
        {"en": "Negative impact", "de": "Negative Auswirkung"},
        {"en": "No or neutral impact", "de": "Keine oder neutrale Auswirkung"},
        {"en": "Positive impact", "de": "Positive Auswirkung"}
    ]}'
WHERE category = 'well-being' AND sequence_number = 340;

-- Alterseinfluss
UPDATE questions
SET title = '{"en": "Age Impact", "de": "Alterseinfluss"}',
    text = '{"en": "How does your age or generation impact your well-being here?", "de": "Wie beeinflusst dein Alter oder deine Generation dein Wohlbefinden hier?"}',
    options = '{"values": [
        {"en": "Negative impact", "de": "Negative Auswirkung"},
        {"en": "No or neutral impact", "de": "Keine oder neutrale Auswirkung"},
        {"en": "Positive impact", "de": "Positive Auswirkung"}
    ]}'
WHERE category = 'well-being' AND sequence_number = 350;

-- Einfluss der ethnischen Herkunft
UPDATE questions
SET title = '{"en": "Ethnicity Impact", "de": "Einfluss der Herkunft"}',
    text = '{"en": "How does your cultural/ethnic background impact your well-being here?", "de": "Wie beeinflusst dein kultureller/ethnischer Hintergrund dein Wohlbefinden hier?"}',
    options = '{"values": [
        {"en": "Negative impact", "de": "Negative Auswirkung"},
        {"en": "No or neutral impact", "de": "Keine oder neutrale Auswirkung"},
        {"en": "Positive impact", "de": "Positive Auswirkung"}
    ]}'
WHERE category = 'well-being' AND sequence_number = 360;

-- Finanzieller Einfluss
UPDATE questions
SET title = '{"en": "Financial Impact", "de": "Finanzieller Einfluss"}',
    text = '{"en": "How does your socioeconomic status impact your well-being here?", "de": "Wie beeinflusst dein sozioökonomischer Status dein Wohlbefinden hier?"}',
    options = '{"values": [
        {"en": "Negative impact", "de": "Negative Auswirkung"},
        {"en": "No or neutral impact", "de": "Keine oder neutrale Auswirkung"},
        {"en": "Positive impact", "de": "Positive Auswirkung"}
    ]}'
WHERE category = 'well-being' AND sequence_number = 370;

-- Einfluss der sexuellen Orientierung
UPDATE questions
SET title = '{"en": "Sexual Orientation Impact", "de": "Einfluss der sexuellen Orientierung"}',
    text = '{"en": "How does your sexual orientation impact your well-being here?", "de": "Wie beeinflusst deine sexuelle Orientierung dein Wohlbefinden hier?"}',
    options = '{"values": [
        {"en": "Negative impact", "de": "Negative Auswirkung"},
        {"en": "No or neutral impact", "de": "Keine oder neutrale Auswirkung"},
        {"en": "Positive impact", "de": "Positive Auswirkung"}
    ]}'
WHERE category = 'well-being' AND sequence_number = 380;

-- Textliche Reflexion
UPDATE questions
SET title = '{"en": "Reflection", "de": "Reflexion"}',
    text = '{"en": "Would you like to share any thoughts on how your intersecting identities shape your experience here?", "de": "Möchtest du Gedanken dazu teilen, wie deine sich überschneidenden Identitäten deine Erfahrung hier prägen?"}'
WHERE category = 'well-being' AND sequence_number = 500; 