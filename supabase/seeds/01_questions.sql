-- Hauptseed-Datei
-- Alle SQL-Anweisungen in einer Datei

-- ================================================
-- TEIL 1: BASISSTRUKTUR (FRAGEN)
-- ================================================

-- Fragen-Metadaten (ohne sprachabhängige Inhalte)
INSERT INTO questions (id, type, category, sequence_number, image_source, options_structure) VALUES
  -- Willkommensbildschirm
  ('welcome_screen', 'info_screen', 'welcome', 0, NULL, '{"buttonText": "general.continue", "showOnce": true}'),
  
  -- Einwilligungsbildschirm
  ('consent_screen', 'info_screen', 'welcome', 10, 'contract', '{"buttonText": "general.agree", "showOnce": true}'),
  
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
  ('environment_info', 'info_screen', 'well-being', 200, 'our-neighborhood', '{"buttonText": "general.continue", "showOnce": false}'),

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
    ], "showOnce": false, "autoAdvance": true}'),

  -- Info Screen für Wohlbefindensfragen
  ('wellbeing_info', 'info_screen', 'well-being', 300, 'relaxation', '{"buttonText": "general.continue", "showOnce": false}'),

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