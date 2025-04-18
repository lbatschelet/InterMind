-- ================================================
-- TEIL 3: FRANZÖSISCHE ÜBERSETZUNGEN
-- ================================================

INSERT INTO translations (question_id, language, title, text, options_content) VALUES
  -- Willkommensbildschirm
  ('welcome_screen', 'fr', 'Bonjour !', 
   'Cette application est conçue pour vous aider à réfléchir à votre bien-être dans différentes situations et environnements. Elle vous posera de courtes questions sur vos expériences quotidiennes afin de mieux comprendre comment divers facteurs influencent votre ressenti.

Vous recevrez de brèves enquêtes plusieurs fois par jour, ne prenant que quelques minutes à répondre. Vos réponses restent confidentielles et seront utilisées uniquement pour obtenir des informations sur la façon dont différents environnements et facteurs personnels affectent le bien-être.',
   '{"buttonText": "general.continue"}'),
  
  -- Einwilligungsbildschirm
  ('consent_screen', 'fr', 'Consentement à participer', 
   'Avant de commencer, nous vous demandons votre consentement pour participer à une étude de recherche.

Dans le cadre de cette étude, nous vous poserons quelques questions—d''abord sur vous-même (par exemple, âge, identité de genre), puis sur vos sentiments et votre environnement à différents moments de votre journée. Vos réponses nous aident à comprendre comment différentes personnes vivent les espaces urbains et comment ces expériences sont liées au bien-être.

**La participation est volontaire**. Vous pouvez ignorer n''importe quelle question en sélectionnant "Je préfère ne pas répondre". Vous pouvez également supprimer toutes vos données à tout moment via les paramètres de l''application.

## Quelles données seront collectées ?

- **Données démographiques**, comme votre âge et votre identité de genre
- **Réponses aux enquêtes** sur vos émotions, pensées et environnements
- **Données de localisation** via GPS (si vous choisissez de l''autoriser)

Nous ne collectons **pas** votre nom, numéro de téléphone, adresse e-mail ou toute autre information permettant de vous identifier. Vos réponses sont **complètement anonymes** et **ne peuvent pas être liées à vous**.

## Comment vos données seront-elles utilisées ?

Vos données seront :

- Utilisées pour la **recherche académique** sur le bien-être et l''espace urbain
- Stockées de manière sécurisée sur un **serveur protégé par mot de passe**
- **Non partagées avec des tiers**
- **Anonymisées** et **non identifiables**
- Supprimables par vous à tout moment via l''application

## Votre consentement

En appuyant sur **"J''accepte"**, vous confirmez que :

- Vous comprenez l''objectif de cette étude
- Vous participez volontairement
- Vous pouvez vous retirer à tout moment en supprimant vos données dans les paramètres de l''application

Veuillez lire notre [politique de confidentialité](#) pour plus de détails.',
   '{"buttonText": "general.agree"}'),
  
  -- Altersgruppe Frage
  ('age_question', 'fr', 'Groupe d''âge', 'Dans quel groupe d''âge vous situez-vous ?', 
   '{"options": [
        {"value": "0-17", "label": "Moins de 16"},
        {"value": "18-24", "label": "16-25"},
        {"value": "25-34", "label": "26-35"},
        {"value": "35-44", "label": "36-45"},
        {"value": "45-54", "label": "46-55"},
        {"value": "55-64", "label": "56-65"},
        {"value": "65-74", "label": "66-75"},
        {"value": "75+", "label": "75+"},
        {"value": "no_answer", "label": "Pas de réponse"}
    ]}'),
  
  -- Geschlecht Frage
  ('gender_question', 'fr', 'Identité de genre', 'À quelle identité de genre vous identifiez-vous ?',
   '{"options": [
        {"value": "female", "label": "Femme"},
        {"value": "male", "label": "Homme"},
        {"value": "diverse", "label": "Non-binaire"},
        {"value": "other", "label": "Autre"},
        {"value": "no_answer", "label": "Pas de réponse"}
    ]}'),
  
  -- Bildungsfrage
  ('education_question', 'fr', 'Éducation', 'Quel est votre niveau d''éducation le plus élevé ?',
   '{"options": [
        {"value": "none", "label": "Aucun diplôme"},
        {"value": "primary", "label": "École primaire"},
        {"value": "secondary", "label": "Collège"},
        {"value": "highschool", "label": "Lycée"},
        {"value": "apprenticeship", "label": "Apprentissage"},
        {"value": "bachelor", "label": "Licence"},
        {"value": "master", "label": "Master"},
        {"value": "phd", "label": "Doctorat"},
        {"value": "no_answer", "label": "Pas de réponse"}
    ]}'),
  
  -- Einkommensfrage
  ('income_question', 'fr', 'Revenu', 'Dans quelle tranche de revenu vous situez-vous approximativement ? (revenu mensuel net)',
   '{"options": [
        {"value": "below_1500", "label": "Moins de CHF 1.500"},
        {"value": "1500_3000", "label": "CHF 1.500 - 3.000"},
        {"value": "3000_4500", "label": "CHF 3.000 - 4.500"},
        {"value": "4500_6000", "label": "CHF 4.500 - 6.000"},
        {"value": "6000_7500", "label": "CHF 6.000 - 7.500"},
        {"value": "above_7500", "label": "Plus de CHF 7.500"},
        {"value": "no_answer", "label": "Pas de réponse"}
    ]}'),
  
  -- Umgebungsinfo
  ('environment_info', 'fr', 'Environnement actuel', 
   'Les questions suivantes concernent votre environnement actuel. Veuillez sélectionner la ou les options qui décrivent le mieux votre emplacement actuel.',
   '{"buttonText": "general.continue"}'),
  
  -- Indoor/Outdoor
  ('indoor_outdoor', 'fr', 'À l''intérieur ou à l''extérieur ?', 'Êtes-vous à l''intérieur ou à l''extérieur ?',
   '{"options": [
        {"value": "indoor", "label": "À l''intérieur"},
        {"value": "outdoor", "label": "À l''extérieur"}
    ]}'),
  
  -- Aktueller Ort
  ('current_place', 'fr', 'Lieu actuel', 'Où êtes-vous exactement ?',
   '{"options": [
        {"value": "home", "label": "À la maison"},
        {"value": "work", "label": "Au travail"},
        {"value": "school", "label": "À l''école/université"},
        {"value": "public_space", "label": "Dans un lieu public (ex. magasin, bar, etc.)"},
        {"value": "public_transport", "label": "Dans les transports publics"},
        {"value": "park", "label": "Dans un parc"},
        {"value": "other", "label": "Autre"}
    ]}'),
  
  -- Menschen in der Umgebung
  ('people_around', 'fr', 'Personnes autour de vous', 'Qui est avec vous ?',
   '{"options": [
        {"value": "nobody", "label": "Personne"},
        {"value": "acquaintances", "label": "Connaissances"},
        {"value": "colleagues", "label": "Collègues"},
        {"value": "family", "label": "Famille"},
        {"value": "partner", "label": "Partenaire"},
        {"value": "children", "label": "Enfants"},
        {"value": "friends", "label": "Amis"},
        {"value": "pets", "label": "Animaux de compagnie"},
        {"value": "strangers", "label": "Étrangers"},
        {"value": "other", "label": "Autres"}
    ]}'),
  
  -- Aktivität
  ('activity', 'fr', 'Activité', 'Que faites-vous en ce moment ?',
   '{"options": [
        {"value": "leisure", "label": "Loisirs/Détente"},
        {"value": "traveling", "label": "En déplacement"},
        {"value": "working", "label": "Travail/Études"},
        {"value": "shopping", "label": "Achats"},
        {"value": "housework", "label": "Tâches ménagères"},
        {"value": "other", "label": "Autre"}
    ]}'),
  
  -- Wohlbefindensinfo
  ('wellbeing_info', 'fr', 'Questions sur le bien-être', 
   'Les questions suivantes concernent votre bien-être dans votre environnement actuel. Veuillez sélectionner la ou les options qui décrivent le mieux votre bien-être actuel.',
   '{"buttonText": "general.continue"}'),
  
  -- Allgemeines Wohlbefinden
  ('overall_wellbeing', 'fr', 'Bien-être général', 'Comment vous sentez-vous globalement dans votre environnement actuel ?',
   '{"options": [
        {"value": "very_good", "label": "Très bien"},
        {"value": "good", "label": "Bien"},
        {"value": "neutral", "label": "Neutre"},
        {"value": "bad", "label": "Mal"},
        {"value": "very_bad", "label": "Très mal"}
    ]}'),
  
  -- Sicherheitsgefühl
  ('safety', 'fr', 'Sécurité', 'À quel point vous sentez-vous en sécurité ici ?',
   '{"options": [
        {"value": "very_safe", "label": "Très en sécurité"},
        {"value": "safe", "label": "En sécurité"},
        {"value": "neutral", "label": "Neutre"},
        {"value": "unsafe", "label": "Peu en sécurité"},
        {"value": "very_unsafe", "label": "Pas du tout en sécurité"}
    ]}'),
  
  -- Soziale Faktoren
  ('social_factors', 'fr', 'Facteurs sociaux', 'Quels facteurs sociaux sont les plus importants pour votre bien-être dans cet environnement ?',
   '{"options": [
        {"value": "gender", "label": "Identité de genre"},
        {"value": "age", "label": "Âge / génération"},
        {"value": "ethnicity", "label": "Ethnicité / origine"},
        {"value": "finance", "label": "Statut socio-économique"},
        {"value": "sexuality", "label": "Orientation sexuelle"},
        {"value": "none", "label": "Aucun / Pas sûr"}
    ]}'),
  
  -- Geschlechtseinfluss
  ('gender_impact', 'fr', 'Impact du genre', 'Comment votre identité de genre influence-t-elle votre bien-être ici ?',
   '{"values": ["Impact négatif", "Pas d''impact ou impact neutre", "Impact positif"]}'),
  
  -- Alterseinfluss
  ('age_impact', 'fr', 'Impact de l''âge', 'Comment votre âge ou votre génération influence-t-il votre bien-être ici ?',
   '{"values": ["Impact négatif", "Pas d''impact ou impact neutre", "Impact positif"]}'),
  
  -- Einfluss der ethnischen Herkunft
  ('ethnicity_impact', 'fr', 'Impact de l''origine', 'Comment votre origine culturelle/ethnique influence-t-elle votre bien-être ici ?',
   '{"values": ["Impact négatif", "Pas d''impact ou impact neutre", "Impact positif"]}'),
  
  -- Finanzieller Einfluss
  ('financial_impact', 'fr', 'Impact financier', 'Comment votre statut socio-économique influence-t-il votre bien-être ici ?',
   '{"values": ["Impact négatif", "Pas d''impact ou impact neutre", "Impact positif"]}'),
  
  -- Einfluss der sexuellen Orientierung
  ('sexual_orientation_impact', 'fr', 'Impact de l''orientation sexuelle', 'Comment votre orientation sexuelle influence-t-elle votre bien-être ici ?',
   '{"values": ["Impact négatif", "Pas d''impact ou impact neutre", "Impact positif"]}'),
  
  -- Textliche Reflexion
  ('reflection', 'fr', 'Réflexion', 'Souhaitez-vous partager des réflexions sur la façon dont vos identités croisées façonnent votre expérience ici ?', NULL); 