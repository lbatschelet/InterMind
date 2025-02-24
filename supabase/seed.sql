-- ==========================
-- Insert Sample Questions (One Per Type)
-- ==========================

INSERT INTO questions (type, text, options) VALUES
  ('single_choice', 'What is your favorite color?', 
   '[{"value": "red", "label": "Red"}, {"value": "blue", "label": "Blue"}, {"value": "green", "label": "Green"}]'),
  
  ('multiple_choice', 'Which activities do you enjoy?', 
   '[{"value": "reading", "label": "Reading"}, {"value": "sports", "label": "Sports"}, {"value": "music", "label": "Music"}]'),
  
  ('slider', 'How do you feel today?', 
   '{"values": ["Unwell", "Neutral", "Very Well"]}'), -- ✅ Uses labeled steps

  ('text', 'Describe your mood in a few words.', NULL);
