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
  ('age_question', 'de', 'Altersgruppe', 'In welcher Altersgruppe befindest du dich?', NULL),
  
  -- Geschlecht Frage
  ('gender_question', 'de', 'Geschlechtsidentität', 'Mit welcher Geschlechtsidentität identifizierst du dich?', NULL),
  
  -- Bildungsfrage
  ('education_question', 'de', 'Bildung', 'Was ist dein höchster Bildungsabschluss?', NULL),
  
  -- Einkommensfrage
  ('income_question', 'de', 'Einkommen', 'In welcher Einkommensgruppe befindest du dich ungefähr? (monatliches Nettoeinkommen)', NULL),
  
  -- Umgebungsinfo
  ('environment_info', 'de', 'Aktuelle Umgebung', 
   'Die folgenden Fragen beziehen sich auf deine aktuelle Umgebung. Bitte wähle die Option(en), die deinen aktuellen Standort am besten beschreiben.',
   '{"buttonText": "general.continue"}'),
  
  -- Indoor/Outdoor
  ('indoor_outdoor', 'de', 'Drinnen oder draußen?', 'Bist du drinnen oder draußen?', NULL),
  
  -- Aktueller Ort
  ('current_place', 'de', 'Aktueller Ort', 'Wo genau befindest du dich?', NULL),
  
  -- Menschen in der Umgebung
  ('people_around', 'de', 'Menschen um dich herum', 'Wer ist bei dir?', NULL),
  
  -- Aktivität
  ('activity', 'de', 'Aktivität', 'Was machst du gerade?', NULL),
  
  -- Wohlbefindensinfo
  ('wellbeing_info', 'de', 'Wohlbefindensfragen', 
   'Die folgenden Fragen beziehen sich auf dein Wohlbefinden in deiner aktuellen Umgebung. Bitte wähle die Option(en), die dein aktuelles Wohlbefinden am besten beschreiben.',
   '{"buttonText": "general.continue"}'),
  
  -- Allgemeines Wohlbefinden
  ('overall_wellbeing', 'de', 'Allgemeines Wohlbefinden', 'Wie fühlst du dich insgesamt in deiner aktuellen Umgebung?', NULL),
  
  -- Sicherheitsgefühl
  ('safety', 'de', 'Sicherheit', 'Wie sicher fühlst du dich hier?', NULL),
  
  -- Soziale Faktoren
  ('social_factors', 'de', 'Soziale Faktoren', 'Welche sozialen Faktoren sind für dein Wohlbefinden in dieser Umgebung am wichtigsten?', NULL),
  
  -- Geschlechtseinfluss
  ('gender_impact', 'de', 'Einfluss des Geschlechts', 'Wie beeinflusst deine Geschlechtsidentität dein Wohlbefinden hier?', NULL),
  
  -- Alterseinfluss
  ('age_impact', 'de', 'Einfluss des Alters', 'Wie beeinflusst dein Alter oder deine Generation dein Wohlbefinden hier?', NULL),
  
  -- Einfluss der ethnischen Herkunft
  ('ethnicity_impact', 'de', 'Einfluss der Herkunft', 'Wie beeinflusst dein kultureller/ethnischer Hintergrund dein Wohlbefinden hier?', NULL),
  
  -- Finanzieller Einfluss
  ('financial_impact', 'de', 'Finanzieller Einfluss', 'Wie beeinflusst dein sozioökonomischer Status dein Wohlbefinden hier?', NULL),
  
  -- Einfluss der sexuellen Orientierung
  ('sexual_orientation_impact', 'de', 'Einfluss der sexuellen Orientierung', 'Wie beeinflusst deine sexuelle Orientierung dein Wohlbefinden hier?', NULL),
  
  -- Textliche Reflexion
  ('reflection', 'de', 'Reflexion', 'Möchtest du weitere Gedanken teilen, wie deine verschiedenen Identitätsmerkmale deine Erfahrung hier prägen?', NULL);