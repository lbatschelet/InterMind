-- ================================================
-- TEIL 3: DEUTSCHE ÜBERSETZUNGEN
-- ================================================

INSERT INTO translations (question_id, language, title, text, options_content) VALUES
  -- Willkommensbildschirm
  ('welcome_screen', 'de', 'Hallo!', 
   'Diese App hilft dir, dein Wohlbefinden in verschiedenen Situationen und Umgebungen zu reflektieren. Sie stellt kurze Fragen zu deinen täglichen Erfahrungen, um besser zu verstehen, wie verschiedene Faktoren dein Wohlbefinden beeinflussen.

Du erhältst mehrmals täglich kurze Umfragen, die nur wenige Minuten zum Beantworten benötigen. Deine Antworten bleiben vertraulich und werden ausschließlich genutzt, um Erkenntnisse darüber zu gewinnen, wie unterschiedliche Umgebungen und persönliche Faktoren das Wohlbefinden beeinflussen.',
   '{"buttonText": "general.continue"}'),
  
  -- Einwilligungsbildschirm
  ('consent_screen', 'de', 'Einwilligung zur Teilnahme', 
   'Bevor wir beginnen, bitten wir um deine Einwilligung zur Teilnahme an einer Forschungsstudie.

Im Rahmen dieser Studie stellen wir dir einige Fragen – zunächst über dich selbst (z.B. Alter, Geschlechtsidentität) und dann über deine Gefühle und deine Umgebung zu verschiedenen Zeitpunkten deines Tages. Deine Antworten helfen uns zu verstehen, wie verschiedene Menschen städtische Räume erleben und wie diese Erfahrungen mit dem Wohlbefinden zusammenhängen.

**Die Teilnahme ist freiwillig**. Du kannst jede Frage überspringen, indem du "Keine Angabe" auswählst. Du kannst auch jederzeit alle deine Daten über die App-Einstellungen löschen.

## Welche Daten werden erfasst?

- **Demografische Daten** wie Alter und Geschlechtsidentität
- **Umfrageantworten** zu deinen Emotionen, Gedanken und deiner Umgebung
- **Standortdaten** via GPS (wenn du dies erlaubst)

Wir erfassen **nicht** deinen Namen, deine Telefonnummer, E-Mail-Adresse oder andere identifizierende Informationen. Deine Antworten sind **völlig anonym** und **können nicht mit dir in Verbindung gebracht werden**.

## Wie werden deine Daten verwendet?

Deine Daten werden:

- Für **wissenschaftliche Forschung** zu Wohlbefinden im städtischen Raum verwendet
- Sicher auf einem **passwortgeschützten Server** gespeichert
- **Nicht an Dritte weitergegeben**
- **Anonymisiert** und **nicht identifizierbar** gehalten
- Jederzeit über die App von dir löschbar sein

## Deine Einwilligung

Durch Tippen auf **"Ich stimme zu"** bestätigst du, dass:

- Du den Zweck dieser Studie verstehst
- Du freiwillig an der Teilnahme einwilligst
- Du jederzeit durch Löschen deiner Daten in den App-Einstellungen zurücktreten kannst

Bitte lies unsere [Datenschutzrichtlinie](#) für weitere Details.',
   '{"buttonText": "general.agree"}'),
   
  -- Benachrichtigungsberechtigungen-Screen (neu)
  ('notifications_permission', 'de', 'Benachrichtigungen', 
   'Um effektiv an dieser Studie teilzunehmen, müssen wir dir Benachrichtigungen senden können, wenn eine neue Umfrage verfügbar ist.

Diese Benachrichtigungen werden:
- Dich informieren, wenn eine neue Umfrage bereit ist
- Nur wenige Male pro Tag gesendet
- Dir helfen, Daten zu verschiedenen Zeiten und in verschiedenen Umgebungen bereitzustellen

Benachrichtigungen sind wichtig, um rechtzeitig an den Umfragen teilnehmen zu können. Ohne sie könntest du Teilnahmemöglichkeiten verpassen.',
   '{"buttonText": "general.ok"}'),
   
  -- Standortberechtigungen-Screen (neu)
  ('location_permission', 'de', 'Standortzugriff', 
   'Das Verständnis deiner Umgebung ist ein wichtiger Teil dieser Studie. Wir bitten um Zugriff auf deinen Standort, um:

- Deine Antworten mit den Orten zu verknüpfen, die du besuchst
- Zu verstehen, wie verschiedene Umgebungen das Wohlbefinden beeinflussen
- Städtische Erfahrungen an verschiedenen Orten zu erfassen

Deine Standortdaten werden:
- Nur erfasst, wenn du aktiv eine Umfrage ausfüllst
- Niemals kontinuierlich im Hintergrund verfolgt
- Anonym behandelt und können nicht mit deiner Identität verknüpft werden',
   '{"buttonText": "general.ok"}'),
  
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
        {"value": "highschool", "label": "Abitur/Matura"},
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
   'Die folgenden Fragen beziehen sich auf deine aktuelle Umgebung. Bitte wähle die Option(en), die deinen aktuellen Standort am besten beschreiben.',
   '{"buttonText": "general.continue"}'),
  
  -- Indoor/Outdoor
  ('indoor_outdoor', 'de', 'Drinnen oder draußen?', 'Bist du drinnen oder draußen?',
   '{"options": [
        {"value": "indoor", "label": "Drinnen"},
        {"value": "outdoor", "label": "Draußen"}
    ]}'),
  
  -- Aktueller Ort
  ('current_place', 'de', 'Aktueller Ort', 'Wo genau befindest du dich?',
   '{"options": [
        {"value": "home", "label": "Zuhause"},
        {"value": "work", "label": "Arbeitsplatz"},
        {"value": "school", "label": "Schule/Universität"},
        {"value": "public_space", "label": "Öffentlicher Ort (z.B. Geschäft, Bar, etc.)"},
        {"value": "public_transport", "label": "Öffentlicher Verkehr"},
        {"value": "park", "label": "Park"},
        {"value": "other", "label": "Anderer Ort"}
    ]}'),
  
  -- Menschen in der Umgebung
  ('people_around', 'de', 'Menschen um dich herum', 'Wer ist bei dir?',
   '{"options": [
        {"value": "nobody", "label": "Niemand"},
        {"value": "acquaintances", "label": "Bekannte"},
        {"value": "colleagues", "label": "Kollegen"},
        {"value": "family", "label": "Familie"},
        {"value": "partner", "label": "Partner/in"},
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
        {"value": "other", "label": "Andere Aktivität"}
    ]}'),
  
  -- Wohlbefindensinfo
  ('wellbeing_info', 'de', 'Wohlbefindensfragen', 
   'Die folgenden Fragen beziehen sich auf dein Wohlbefinden in deiner aktuellen Umgebung. Bitte wähle die Option(en), die dein aktuelles Wohlbefinden am besten beschreiben.',
   '{"buttonText": "general.continue"}'),
  
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
  ('social_factors', 'de', 'Soziale Faktoren', 'Welche sozialen Faktoren sind für dein Wohlbefinden in dieser Umgebung am wichtigsten?',
   '{"options": [
        {"value": "gender", "label": "Geschlechtsidentität"},
        {"value": "age", "label": "Alter / Generation"},
        {"value": "ethnicity", "label": "Ethnische Herkunft"},
        {"value": "finance", "label": "Sozioökonomischer Status"},
        {"value": "sexuality", "label": "Sexuelle Orientierung"},
        {"value": "none", "label": "Keine / Nicht sicher"}
    ]}'),
  
  -- Geschlechtseinfluss
  ('gender_impact', 'de', 'Einfluss des Geschlechts', 'Wie beeinflusst deine Geschlechtsidentität dein Wohlbefinden hier?',
   '{"values": ["Negativer Einfluss", "Kein oder neutraler Einfluss", "Positiver Einfluss"]}'),
  
  -- Alterseinfluss
  ('age_impact', 'de', 'Einfluss des Alters', 'Wie beeinflusst dein Alter oder deine Generation dein Wohlbefinden hier?',
   '{"values": ["Negativer Einfluss", "Kein oder neutraler Einfluss", "Positiver Einfluss"]}'),
  
  -- Einfluss der ethnischen Herkunft
  ('ethnicity_impact', 'de', 'Einfluss der Herkunft', 'Wie beeinflusst dein kultureller/ethnischer Hintergrund dein Wohlbefinden hier?',
   '{"values": ["Negativer Einfluss", "Kein oder neutraler Einfluss", "Positiver Einfluss"]}'),
  
  -- Finanzieller Einfluss
  ('financial_impact', 'de', 'Finanzieller Einfluss', 'Wie beeinflusst dein sozioökonomischer Status dein Wohlbefinden hier?',
   '{"values": ["Negativer Einfluss", "Kein oder neutraler Einfluss", "Positiver Einfluss"]}'),
  
  -- Einfluss der sexuellen Orientierung
  ('sexual_orientation_impact', 'de', 'Einfluss der sexuellen Orientierung', 'Wie beeinflusst deine sexuelle Orientierung dein Wohlbefinden hier?',
   '{"values": ["Negativer Einfluss", "Kein oder neutraler Einfluss", "Positiver Einfluss"]}'),
  
  -- Textliche Reflexion
  ('reflection', 'de', 'Reflexion', 'Möchtest du weitere Gedanken teilen, wie deine verschiedenen Identitätsmerkmale deine Erfahrung hier prägen?', NULL);