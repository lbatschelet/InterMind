-- *******************************************************
--  Auto-generated SQL from Excel questionnaire
--  Source file : Fragenkatalog.xlsx
--  Generated   : 2025-05-09 12:12:06
--  Script      : excel_to_sql.py
-- *******************************************************

INSERT INTO translations (question_id, LANGUAGE, title, text, options_content)
VALUES ('welcome', 'de', 'Hallo!', 'Schön bist Du hier!

In dieser App wirst Du eine Woche lang drei Mal am Tag kurze Fragen zu deinem aktuellen Wohlbefinden und zu Deiner Umgebung beantworten.

Deine Antworten helfen uns dabei, besser zu verstehen, wie Menschen verschiedene Orte erleben – und wie diese Erfahrungen mit unterschiedlichen Lebenssituationen zusammenhängen.', NULL),
       ('about_this_study', 'de', 'Worum geht es in dieser Studie?', 'Wie wir uns an einem Ort fühlen, hängt stark von unserer Umgebung ab. Manche Orte wirken beruhigend, vertraut oder einladend. Andere lassen uns unruhig werden, ausgegrenzt erscheinen oder fehl am Platz fühlen.

Solche Erfahrungen sind jedoch nicht für alle Menschen gleich. Sie können davon abhängen, wie wir an einem Ort wahrgenommen und behandelt werden – zum Beispiel aufgrund von Geschlecht, Herkunft, Sprache, Aussehen oder anderen Merkmalen, die unsere gesellschaftliche Position prägen.

## Was meinen wir mit Wohlbefinden?

Wohlbefinden kann vieles bedeuten. Manchmal geht es dabei um etwas Langfristiges – zum Beispiel, wie zufrieden wir mit unserem Leben insgesamt sind, wie gesund wir uns fühlen oder ob wir uns sicher und unterstützt fühlen im Alltag.

In dieser Studie interessiert uns jedoch vor allem das **momentane Wohlbefinden**: Wie geht es Dir **jetzt gerade**, an diesem Ort, in dieser Situation?

Wohlbefinden ist dabei ganzheitlich zu verstehen – es umfasst sowohl **körperliche** Aspekte (z. B. Müdigkeit, Wärme, Ruhe), als auch **psychische** Empfindungen (z. B. Zufriedenheit, Sicherheit, Zugehörigkeit). Diese kurzfristigen Eindrücke sind oft flüchtig und hängen stark davon ab, wo wir uns aufhalten, was wir gerade tun und wie wir dort wahrgenommen werden.

## Wer führt die Studie durch?

Die Studie ist Teil einer Bachelorarbeit am Geographischen Institut der Universität Bern. Sie wird von Lukas Batschelet durchgeführt und von Prof. Dr. Carolin Schurr und Dr. Moritz Gubler betreut.

## Was ist das Ziel dieser Studie?

Uns interessiert, wie sich verschiedene Merkmale – einzeln oder in Kombination – auf das momentane Wohlbefinden auswirken. Zum Beispiel: Fühlt sich eine junge Frau mit Migrationsgeschichte an einem öffentlichen Ort anders als ein älterer Mann, der sich zur gleichen Zeit am gleichen Ort aufhält?

In der Studie gehen wir der Frage nach, warum Orte auf verschiedene Menschen unterschiedlich wirken. Wir wollen besser verstehen, wie Zugehörigkeit, Sicherheit oder ein Gefühl des Nicht-Dazugehörens entstehen – und wie diese Erfahrungen mit dem Alltag, sozialen Zuschreibungen und persönlichen Lebenslagen zusammenhängen.

## Wie läuft die Teilnahme ab?

Die Studie dauert eine Woche. In dieser Zeit wirst Du dreimal täglich gebeten, eine kurze Befragung auf deinem Smartphone auszufüllen. Dabei geht es jeweils um:

* den Ort, an dem Du dich gerade befindest
* was Du dort machst
* wie Du dich fühlst
* und ob Du dich dort zugehörig oder fremd erlebst

Jede Befragung ist jeweils für eine Stunde verfügbar und verfällt danach automatisch. Die Zeitpunkte sind leicht zufällig über den Tag verteilt, damit nicht immer zur gleichen Zeit und am gleichen Ort geantwortet wird.

Wenn Du eine Befragung verpasst, ist das kein Problem – Du kannst beim nächsten Zeitpunkt einfach wieder teilnehmen.', NULL),
       ('consent', 'de', 'Einwilligung zur Teilnahme', 'Bevor Du mit der Befragung startest, bitten wir dich um deine Zustimmung zur Teilnahme an dieser Studie.

Die Teilnahme ist freiwillig.  
Du kannst einzelne Fragen überspringen (z. B. mit "Keine Angabe") und die Teilnahme jederzeit beenden.  
In den App-Einstellungen kannst Du deine Daten auch nachträglich vollständig löschen.

## Welche Daten werden erhoben?

- Angaben zu Deiner Person (z. B. Alter, Geschlecht, Bildung)
- Antworten zu Deinem aktuellen Befinden und deinem Aufenthaltsort
- Standortdaten, sofern Du die Freigabe erteilst

## Wie gehen wir mit Deinen Daten um?

- Wir speichern keine Namen, E-Mail-Adressen oder andere persönlichen Kontaktdaten
- Deine Daten werden anonymisiert auf einem gesicherten Server der Firma Supabase in der Schweiz gespeichert
- Es werden keine Bewegungsprofile oder dauerhaft abrufbaren Standortverläufe aufgezeichnet
- Deine Daten werden ausschliesslich für wissenschaftliche Zwecke verwendet und nicht an Dritte weitergegeben

Mit "Ich stimme zu" bestätigst Du, dass Du diese Informationen gelesen und verstanden hast und freiwillig an der Studie teilnimmst. Du kannst deine Teilnahme jederzeit beenden und deine Daten über die App-Einstellungen löschen.

Weitere Informationen findest Du in unserer [Datenschutzrichtlinie](https://intermind.ch/privacy-policy.html).', NULL),
       ('notifications', 'de', 'Benachrichtigungen', 'Damit Du keine Befragung verpasst, senden wir Dir Benachrichtigungen.

Diese Erinnerungen kommen automatisch, wenn ein neuer Umfrageslot startet. Du hast dann jeweils eine Stunde Zeit, um zu antworten.

Die Benachrichtigungen sind wichtig, weil die Zeitfenster kurz sind. Du kannst sie in den Geräteeinstellungen abschalten – aber dann besteht die Gefahr, dass du Befragungen verpasst.

Wir empfehlen dir, Benachrichtigungen zuzulassen, damit du möglichst viele unterschiedliche Situationen erfassen kannst.', NULL),
       ('location_acces', 'de', 'Standort', 'Damit wir die Antworten besser verstehen und räumliche Muster erkennen können, bitten wir Dich, die Standortfreigabe zu erlauben.

So können wir z. B. sehen, ob sich das Erleben an belebten Plätzen von jenem in ruhigen Gegenden unterscheidet – ohne deinen Namen oder deine exakten Adressen zu kennen.

Der Standort hilft uns also, Deine Angaben zu Deinem Aufenthaltsort zu ergänzen, z. B. mit Infos zur Umgebung.

Deine Daten werden ausschliesslich anonymisiert gespeichert und nicht dauerhaft verfolgt.

Du kannst die Standortfreigabe jederzeit in den Einstellungen deines Geräts deaktivieren.', NULL),
       ('info_questions_about_you', 'de', 'Einige Fragen zu dir', 'Bevor wir mit den täglichen Befragungen starten, stellen wir Dir einmalig einige Fragen zu Dir selbst – zum Beispiel zu deinem Alter, Geschlecht, deiner Ausbildung und deiner Lebenssituation.

Du kannst jede Frage überspringen, wenn Du sie nicht beantworten möchtest.', NULL),
       ('age_group', 'de', 'Altersgruppe', 'In welcher Altersgruppe befindest Du dich?', '{"options": [{"value": "age_group_under_16", "label": "Unter 16"}, {"value": "age_group_1625", "label": "16-25"}, {"value": "age_group_2635", "label": "26-35"}, {"value": "age_group_3645", "label": "36-45"}, {"value": "age_group_4655", "label": "46-55"}, {"value": "age_group_5665", "label": "56-65"}, {"value": "age_group_6675", "label": "66-75"}, {"value": "age_group_75", "label": "75+"}]}'),
       ('sex', 'de', 'Biologisches Geschlecht', 'Welches Geschlecht wurde Dir bei der Geburt zugewiesen?', '{"options": [{"value": "sex_male", "label": "Weiblich"}, {"value": "sex_female", "label": "Männlich"}, {"value": "sex_inter", "label": "Inter / Variante der Geschlechtsentwicklung"}]}'),
       ('gender', 'de', 'Geschlechtsidentität', 'Mit welcher Geschlechtsidentität identifizierst Du dich?', '{"options": [{"value": "gender_female", "label": "Weiblich"}, {"value": "gender_male", "label": "Männlich"}, {"value": "gender_nonbinary_genderqueer", "label": "Nicht-binär / genderqueer"}, {"value": "gender_trans_woman", "label": "Trans Frau"}, {"value": "gender_trans_man", "label": "Trans Mann"}, {"value": "gender_agender", "label": "Agender"}, {"value": "gender_inter", "label": "Intersex"}, {"value": "gender_other", "label": "Andere"}]}'),
       ('sexual_orientation', 'de', 'Sexuelle Orientierung', 'Mit welchen Begriffen würdest du Deine sexuelle Orientierung beschreiben?', '{"options": [{"value": "sexual_orientation_straight", "label": "Heterosexuell"}, {"value": "sexual_orientation_homosexual", "label": "Homosexuell"}, {"value": "sexuql_orientation_bisexual", "label": "Bisexuell"}, {"value": "sexual_orientation_pansexual", "label": "Pansexuell"}, {"value": "sexual_orientation_asexual", "label": "Asexuell"}, {"value": "sexual_orientation_queer", "label": "Queer"}, {"value": "sexual_orientation_other", "label": "Andere"}]}'),
       ('education', 'de', 'Ausbildung', 'Was ist Dein höchster Bildungsabschluss?', '{"options": [{"value": "education_none", "label": "Noch kein Abschluss"}, {"value": "education_secondary_school", "label": "Obligatorische Schulzeit (z. B. Sek I)"}, {"value": "education_vocational_training_or_apprenticeship", "label": "Berufsausbildung (EFZ / EBA)"}, {"value": "education_maturafmshms_or_equivalent", "label": "Matura / FMS / HMS / etc."}, {"value": "education_university_of_applied_sciences_fhhf", "label": "Fachhochschule (FH) oder Höhere Fachschule (HF)"}, {"value": "education_university_degree", "label": "Universität / ETH"}]}'),
       ('household_members', 'de', 'Haushaltsgrösse', 'Wie viele Personen leben in Deinem Haushalt (einschliesslich Dir selbst)?', '{"options": [{"value": "household_members_1_living_alone", "label": "1 (lebe allein)"}, {"value": "household_members_2", "label": "2"}, {"value": "household_members_3", "label": "3"}, {"value": "household_members_4", "label": "4"}, {"value": "household_members_5", "label": "5"}, {"value": "household_members_6", "label": "6"}, {"value": "household_members_7", "label": "7"}, {"value": "household_members_8", "label": "8"}, {"value": "household_members_9", "label": "9"}, {"value": "household_members_10_or_more", "label": "10 oder mehr"}]}'),
       ('household_members_financing', 'de', 'Haushaltsfinanzierung', 'Wie viele Personen in Deinem Haushalt tragen (einschliesslich dir selbst) zum gemeinsamen Einkommen bei?', '{"options": [{"value": "household_members_financing_1_person_myself_only", "label": "1 Person (nur ich)"}, {"value": "household_members_financing_2", "label": "2 Personen"}, {"value": "household_members_financing_3", "label": "3 Personen"}, {"value": "household_members_financing_4", "label": "4 Personen"}, {"value": "household_members_financing_5", "label": "5 Personen"}, {"value": "household_members_financing_6", "label": "6 Personen"}, {"value": "household_members_financing_7", "label": "7 Personen"}, {"value": "household_members_financing_8", "label": "8 Personen"}, {"value": "household_members_financing_9", "label": "9 Personen"}, {"value": "household_members_financing_10_or_more", "label": "10 oder mehr"}]}'),
       ('monthly_household_income', 'de', 'Haushaltseinkommen', 'Wie hoch ist ungefähr Euer gemeinsames monatliches Haushaltseinkommen (nach Abzug von Steuern)?', '{"options": [{"value": "monthly_household_income_less_than_chf_1500", "label": "Unter CHF 1500"}, {"value": "monthly_household_income_chf_15003000", "label": "CHF 1500–3000"}, {"value": "monthly_household_income_chf_30004500", "label": "CHF 3000–4500"}, {"value": "monthly_household_income_chf_45006000", "label": "CHF 4500–6000"}, {"value": "monthly_household_income_chf_60007500", "label": "CHF 6000–7500"}, {"value": "monthly_household_income_chf_750010000", "label": "CHF 7500–10''000"}, {"value": "monthly_household_income_more_than_chf_10000", "label": "Mehr als CHF 10''000"}, {"value": "monthly_household_income_unknown", "label": "Weiss nicht"}]}'),
       ('employment_status', 'de', 'Beschäftigung', 'Wie ist Deine derzeitige berufliche oder schulische Situation?', '{"options": [{"value": "employment_status_pupil__student", "label": "Schüler*in / Student*in"}, {"value": "employment_status_employed", "label": "Angestellt"}, {"value": "employment_status_selfemployed", "label": "Selbstständig"}, {"value": "employment_status_retired", "label": "Pensioniert"}, {"value": "employment_status_unemployed", "label": "Arbeitslos"}]}'),
       ('disabilities', 'de', 'Beeinträchtigungen', 'Hast Du eine körperliche oder psychische Beeinträchtigung, chronische Erkrankung oder andere gesundheitliche Einschränkung, die Deinen Alltag beeinflusst?', '{"options": [{"value": "disabilities_yes", "label": "Ja"}, {"value": "disabilities_no", "label": "Nein"}]}'),
       ('different_country_than_born_in', 'de', 'Herkunftsland', 'Lebst Du in einem anderen Land, als in welchem du geboren wurdest?', '{"options": [{"value": "different_country_than_born_in_yes", "label": "Ja"}, {"value": "different_country_than_born_in_no", "label": "Nein"}]}'),
       ('axis_of_opression', 'de', 'Erlebte Diskriminierung', 'Hast Du im Alltag schon Diskriminierung aufgrund persönlicher Merkmale erlebt?', '{"options": [{"value": "axis_of_opression_yes_because_of_my_gender", "label": "Ja, wegen meines Geschlechts"}, {"value": "axis_of_opression_yes_because_of_my_age", "label": "Ja, wegen meines Alters"}, {"value": "axis_of_opression_yes_because_of_my_background", "label": "Ja, wegen meiner Herkunft"}, {"value": "axis_of_opression_yes_because_of_my_skin_colour_or_appearance", "label": "Ja, wegen meiner Hautfarbe oder meines Aussehens"}, {"value": "axis_of_opression_yes_because_of_my_language_or_accent", "label": "Ja, wegen meiner Sprache oder meines Akzents"}, {"value": "axis_of_opression_yes_because_of_my_social_or_financial_situation", "label": "Ja, wegen meiner sozialen oder finanziellen Situation"}, {"value": "axis_of_opression_yes_because_of_my_clothing_or_style", "label": "Ja, wegen meiner Kleidung oder meines Stils"}, {"value": "axis_of_opression_yes_because_of_my_sexual_orientation", "label": "Ja, wegen meiner sexuellen Orientierung"}, {"value": "axis_of_opression_yes_because_of_my_health_condition_or_a_disability", "label": "Ja, wegen meines Gesundheitszustands oder einer Behinderung"}, {"value": "axis_of_opression_yes_for_another_reason", "label": "Ja, aus einem anderen Grund"}, {"value": "axis_of_opression_no", "label": "Nein"}]}'),
       ('info_current_location', 'de', 'Dein aktueller Standort', 'Als Nächstes stellen wir Dir einige Fragen dazu, wo Du gerade bist, was Du machst und wie Deine Umgebung aussieht.', NULL),
       ('indoors_outdoors', 'de', 'Drinnen oder Draussen', 'Bist Du drinnen oder draussen?', '{"options": [{"value": "indoors_outdoors_indoors", "label": "Drinnen"}, {"value": "indoors_outdoors_outdoors", "label": "Draussen"}]}'),
       ('location_category', 'de', 'Ortskategorie', 'Wo genau befindest Du dich?', '{"options": [{"value": "location_category_at_home", "label": "Zuhause"}, {"value": "location_category_at_someone_elses_home", "label": "Bei jemand anderem zuhause"}, {"value": "location_category_workplace", "label": "Arbeitsplatz"}, {"value": "location_category_school__university", "label": "Schule / Universität"}, {"value": "location_category_shopping_or_services", "label": "Einkaufen oder Dienstleistungen"}, {"value": "location_category_café__restaurant__bar", "label": "Café / Restaurant / Bar"}, {"value": "location_category_leisure_or_sports_facility", "label": "Freizeit- oder Sporteinrichtung"}, {"value": "location_category_park_or_green_space", "label": "Park oder Grünfläche"}, {"value": "location_category_cultural_or_religious_place", "label": "Kultureller oder religiöser Ort"}, {"value": "location_category_health_or_therapy_setting", "label": "Gesundheitseinrichtung / Therapie"}, {"value": "location_category_on_the_move_walking_cycling_driving", "label": "Unterwegs (zu Fuss, Fahrrad, Auto)"}, {"value": "location_category_public_transport", "label": "Öffentlicher Verkehr"}, {"value": "location_category_other_place", "label": "Anderer Ort"}]}'),
       ('people_with_you', 'de', 'Menschen um Dich', 'Mit wem bist Du gerade zusammen?', '{"options": [{"value": "people_with_you_no_one", "label": "Niemand"}, {"value": "people_with_you_partner", "label": "Partner*in"}, {"value": "people_with_you_children", "label": "Kinder"}, {"value": "people_with_you_family", "label": "Familie"}, {"value": "people_with_you_friends", "label": "Freund*innen"}, {"value": "people_with_you_colleagues", "label": "Arbeitskolleg*innen"}, {"value": "people_with_you_acquaintances", "label": "Bekannte"}, {"value": "people_with_you_animalspets", "label": "Tiere/Haustiere"}, {"value": "people_with_you_strangers", "label": "Fremde"}, {"value": "people_with_you_other", "label": "Andere"}]}'),
       ('activity', 'de', 'Aktivität', 'Was machst Du gerade hauptsächlich?', '{"options": [{"value": "activity_leisure_or_relaxation", "label": "Freizeit oder Entspannung"}, {"value": "activity_travelling_or_commuting", "label": "Unterwegs sein oder pendeln"}, {"value": "activity_working_or_studying", "label": "Arbeiten oder studieren"}, {"value": "activity_shopping_or_running_errands", "label": "Einkaufen oder Besorgungen"}, {"value": "activity_housework_or_tidying_up", "label": "Haushalt oder Aufräumen"}, {"value": "activity_cooking_or_eating", "label": "Kochen oder Essen"}, {"value": "activity_care_responsibilities", "label": "Betreuungspflichten"}, {"value": "activity_social_activities", "label": "Soziale Aktivitäten"}, {"value": "activity_using_media", "label": "Mediennutzung"}, {"value": "activity_resting_or_sleeping", "label": "Ausruhen oder schlafen"}, {"value": "activity_other", "label": "Sonstiges"}]}'),
       ('environment_noise', 'de', 'Lautstärke', 'Wie nimmst Du die Geräuschkulisse an diesem Ort wahr?', '{"values": ["Sehr laut", "Sehr leise"]}'),
       ('environment_nature', 'de', 'Natur', 'Wie viel Natur ist an diesem Ort sichtbar?', '{"values": ["Keine Natur", "Viel Natur"]}'),
       ('environment_lively', 'de', 'Lebhaftigkeit', 'Wie lebhaft oder ruhig wirkt der Ort?', '{"values": ["Lebhaft", "Ruhig"]}'),
       ('environmen_pleasure', 'de', 'Angenehm', 'Wie angenehm empfindest Du den Ort insgesamt?', '{"values": ["Unangenehm", "Angenehm"]}'),
       ('info_wellbeing', 'de', 'Wohlbefinden', 'Zum Schluss noch einige Fragen zu Deinem aktuellen Wohlbefinden.', NULL),
       ('general_wellbeing', 'de', 'Generelles Wohlbefinden', 'Wie fühlst Du dich gerade insgesamt?', '{"values": ["Sehr unwohl", "Sehr wohl"]}'),
       ('content', 'de', 'Zufriedenheit', 'Ganz allgemein - wie zufrieden fühlst Du dich im Moment?', '{"values": ["Sehr unzufrieden", "Sehr zufrieden"]}'),
       ('tense_relaxed', 'de', 'Anspannung', 'Wie angespannt oder entspannt fühlst Du dich?', '{"values": ["Sehr angespannt", "Sehr entspannt"]}'),
       ('awake', 'de', 'Energie', 'Wie wach fühlst Du dich im Moment?', '{"values": ["Sehr müde", "Sehr wach"]}'),
       ('sense_of_belonging', 'de', 'Zugehörigkeit', 'Wie zugehörig oder fremd fühlst Du dich an diesem Ort?', '{"values": ["Sehr fremd", "Sehr zugehörig"]}'),
       ('factors_sense_of_belonging', 'de', 'Faktoren für Zugehörigkeit', 'Glaubst Du, dass dein Gefühl von Zugehörigkeit oder Fremdheit an diesem Ort damit zu tun hat, wie du als Person wahrgenommen wirst?', '{"options": [{"value": "factors_sense_of_belonging_yes_because_of_my_gender", "label": "Ja, wegen meines Geschlechts"}, {"value": "factors_sense_of_belonging_yes_because_of_my_age", "label": "Ja, wegen meines Alters"}, {"value": "factors_sense_of_belonging_yes_because_of_my_background", "label": "Ja, wegen meiner Herkunft"}, {"value": "factors_sense_of_belonging_yes_because_of_my_skin_colour_or_appearance", "label": "Ja, wegen meiner Hautfarbe oder meines Aussehens"}, {"value": "factors_sense_of_belonging_yes_because_of_my_language_or_accent", "label": "Ja, wegen meiner Sprache oder meines Akzents"}, {"value": "factors_sense_of_belonging_yes_because_of_my_social_or_financial_situation", "label": "Ja, wegen meiner sozialen oder finanziellen Situation"}, {"value": "factors_sense_of_belonging_yes_because_of_my_clothing_or_style", "label": "Ja, wegen meiner Kleidung oder meines Stils"}, {"value": "factors_sense_of_belonging_yes_because_of_my_sexual_orientation", "label": "Ja, wegen meiner sexuellen Orientierung"}, {"value": "factors_sense_of_belonging_yes_because_of_my_health_condition_or_a_disability", "label": "Ja, wegen meines Gesundheitszustands oder einer Behinderung"}, {"value": "factors_sense_of_belonging_yes_for_another_reason", "label": "Ja, aus einem anderen Grund"}, {"value": "factors_sense_of_belonging_no", "label": "Nein"}]}'),
       ('majority_comparison', 'de', 'Vergleich mit der Mehrheit', 'Verglichen mit den anderen Personen hier: Bei welchen Merkmalen fühlst Du dich der Mehrheit zugehörig?', '{"options": [{"value": "majority_comparison_in_my_gender", "label": "In meinem Geschlecht"}, {"value": "majority_comparison_in_my_age", "label": "In meinem Alter"}, {"value": "majority_comparison_in_my_background", "label": "In meiner Herkunft"}, {"value": "majority_comparison_in_my_skin_colour_or_appearance", "label": "In meiner Hautfarbe oder meines Aussehens"}, {"value": "majority_comparison_in_my_language_or_accent", "label": "In meiner Sprache oder Akzents"}, {"value": "majority_comparison_in_my_social_or_financial_situation", "label": "In meiner sozialen oder finanziellen Situation"}, {"value": "majority_comparison_in_my_clothing_or_style", "label": "In meiner Kleidung oder meinem Stil"}, {"value": "majority_comparison_in_my_sexual_orientation", "label": "In meiner sexuellen Orientierung"}, {"value": "majority_comparison_in_my_health_condition_or_a_disability", "label": "In meinem Gesundheitszustand oder einer Behinderung"}]}'),
       ('other_factors_negative', 'de', 'Andere Gründe für Unwohlsein', 'Gibt es andere Dinge die dazu führen, dass Du dich hier weniger wohl oder unwohl fühlst?', NULL),
       ('other_factors_positive', 'de', 'Andere Gründe für Wohlbefinden', 'Gibt es andere Dinge die dazu führen, dass Du dich hier wohler fühlst?', NULL);