-- *******************************************************
--  Auto-generated SQL from Excel questionnaire
--  Source file : Fragenkatalog.xlsx
--  Generated   : 2025-05-09 12:12:06
--  Script      : excel_to_sql.py
-- *******************************************************

INSERT INTO translations (question_id, LANGUAGE, title, text, options_content)
VALUES ('welcome', 'fr', 'Bonjour !', 'Heureux-se de te voir ici !

Dans cette application, tu répondras trois fois par jour pendant une semaine à de courtes questions sur ton bien-être actuel et sur ton environnement.

Tes réponses nous aideront à mieux comprendre comment les gens vivent différents lieux - et comment ces expériences sont liées à différentes situations de vie.', NULL),
       ('about_this_study', 'fr', 'Quel est l''objet de cette étude ?', 'La manière dont nous nous sentons dans un lieu dépend fortement de notre environnement. Certains lieux sont apaisants, familiers ou accueillants. D''autres nous mettent mal à l''aise, nous donnent l''impression d''être exclus ou de ne pas être à notre place.

De telles expériences ne sont toutefois pas identiques pour tout le monde. Elles peuvent dépendre de la manière dont nous sommes perçus et traités dans un lieu - par exemple en raison de notre sexe, de notre origine, de notre langue, de notre apparence ou d''autres caractéristiques qui déterminent notre position sociale.

## Qu''entendons-nous par bien-être ?

Le bien-être peut signifier beaucoup de choses. Parfois, il s''agit de quelque chose à long terme - par exemple, à quel point nous sommes satisfaits de notre vie en général, à quel point nous nous sentons en bonne santé ou si nous nous sentons en sécurité et soutenus au quotidien.

Dans cette étude, nous nous intéressons toutefois surtout au **bien-être momentané** : Comment te sens-tu **en ce moment**, à cet endroit, dans cette situation ?

Le bien-être doit être compris de manière globale - il comprend aussi bien des aspects **corporels** (p. ex. fatigue, chaleur, calme) que des sensations **psychiques** (p. ex. satisfaction, sécurité, appartenance). Ces impressions à court terme sont souvent fugaces et dépendent fortement de l''endroit où nous nous trouvons, de ce que nous sommes en train de faire et de la manière dont nous y sommes perçus.

## Qui mène l''étude ?

L''étude fait partie d''un travail de bachelor à l''Institut de géographie de l''Université de Berne. Elle est menée par Lukas Batschelet et encadrée par le professeur Dr Carolin Schurr et le Dr Moritz Gubler.

## Quel est l''objectif de cette étude ?

Nous nous intéressons à l''impact de différentes caractéristiques - seules ou combinées - sur le bien-être momentané. Par exemple : une jeune femme issue de l''immigration se sent-elle différente dans un lieu public qu''un homme plus âgé qui se trouve au même endroit au même moment ?

Dans cette étude, nous nous penchons sur la question de savoir pourquoi les lieux ont un effet différent sur différentes personnes. Nous voulons mieux comprendre comment naissent l''appartenance, la sécurité ou le sentiment de ne pas être à sa place - et comment ces expériences sont liées au quotidien, aux attributions sociales et aux situations de vie personnelles.

## Comment se déroule la participation ?

L''étude dure une semaine. Pendant cette période, on te demandera trois fois par jour de remplir un bref questionnaire sur ton smartphone. Il s''agit à chaque fois de

* de l''endroit où tu te trouves actuellement
* ce que tu y fais
* comment tu te sens
* et si tu t''y sens à ta place ou non.

Chaque enquête est disponible pendant une heure et expire ensuite automatiquement. Les moments sont répartis de manière légèrement aléatoire au cours de la journée, afin que les réponses ne soient pas toujours données au même moment et au même endroit.

Si tu manques une enquête, ce n''est pas un problème - tu peux simplement participer à l''heure suivante.', NULL),
       ('consent', 'fr', 'Consentement à la participation', 'Avant de commencer l''enquête, nous te demandons ton accord pour participer à cette étude.

La participation est volontaire.  
Tu peux ignorer certaines questions (par exemple en répondant "pas d''indication") et mettre fin à ta participation à tout moment.  
Dans les paramètres de l''application, tu peux aussi effacer complètement tes données ultérieurement.

## Quelles données sont collectées ?

- Données te concernant (par ex. âge, sexe, formation).
- Réponses sur ton état actuel et ton lieu de séjour
- données de localisation, si tu en donnes l''autorisation

## Comment utilisons-nous tes données ?

- Nous n''enregistrons pas de noms, d''adresses e-mail ou d''autres données de contact personnelles.
- Tes données sont stockées de manière anonyme sur un serveur sécurisé de la société Supabase en Suisse.
- Aucun profil de déplacement ou historique de localisation consultable en permanence n''est enregistré.
- Tes données sont utilisées exclusivement à des fins scientifiques et ne sont pas transmises à des tiers.

En cliquant sur "J''accepte", tu confirmes que tu as lu et compris ces informations et que tu participes volontairement à l''étude. Tu peux mettre fin à ta participation à tout moment et supprimer tes données via les paramètres de l''application.

Tu trouveras plus d''informations dans notre [Politique de confidentialité](https://intermind.ch/privacy-policy.html).', NULL),
       ('notifications', 'fr', 'Notifications', 'Pour que tu ne manques aucun entretien, nous t''envoyons des notifications.

Ces rappels arrivent automatiquement lorsqu''un nouveau créneau d''enquête démarre. Tu as alors une heure pour répondre.

Les notifications sont importantes parce que les créneaux horaires sont courts. Tu peux les désactiver dans les paramètres de l''appareil - mais tu risques alors de manquer des enquêtes.

Nous te recommandons d''autoriser les notifications pour que tu puisses saisir le plus de situations différentes possible.', NULL),
       ('location_acces', 'fr', 'Site', 'Pour nous permettre de mieux comprendre les réponses et d''identifier les modèles spatiaux, nous te demandons d''autoriser le partage de l''emplacement.

Nous pourrons ainsi voir, par exemple, si l''expérience vécue dans des lieux animés diffère de celle vécue dans des zones calmes - sans connaître ton nom ou tes adresses exactes.

La localisation nous aide donc à compléter tes informations sur le lieu où tu te trouves, par exemple avec des informations sur les environs.

Tes données sont exclusivement enregistrées de manière anonyme et ne sont pas suivies à long terme.

Tu peux à tout moment désactiver le partage de la localisation dans les paramètres de ton appareil.', NULL),
       ('info_questions_about_you', 'fr', 'Quelques questions à ton sujet', 'Avant de commencer les enquêtes quotidiennes, nous te posons une fois quelques questions sur toi-même - par exemple sur ton âge, ton sexe, ta formation et ta situation de vie.

Tu peux passer chaque question si tu ne souhaites pas y répondre.', NULL),
       ('age_group', 'fr', 'Groupe d''âge', 'Dans quelle tranche d''âge te trouves-tu ?', '{"options": [{"value": "age_group_under_16", "label": "Moins de 16 ans"}, {"value": "age_group_1625", "label": "16-25"}, {"value": "age_group_2635", "label": "26-35"}, {"value": "age_group_3645", "label": "36-45"}, {"value": "age_group_4655", "label": "46-55"}, {"value": "age_group_5665", "label": "56-65"}, {"value": "age_group_6675", "label": "66-75"}, {"value": "age_group_75", "label": "75+"}]}'),
       ('sex', 'fr', 'Sexe biologique', 'Quel sexe t''a été attribué à la naissance ?', '{"options": [{"value": "sex_male", "label": "Femme"}, {"value": "sex_female", "label": "Homme"}, {"value": "sex_inter", "label": "Inter / variante du développement sexuel"}]}'),
       ('gender', 'fr', 'Identité de genre', 'A quelle identité de genre t''identifies-tu ?', '{"options": [{"value": "gender_female", "label": "Femme"}, {"value": "gender_male", "label": "Homme"}, {"value": "gender_nonbinary_genderqueer", "label": "Non binaire / genderqueer"}, {"value": "gender_trans_woman", "label": "Femme trans"}, {"value": "gender_trans_man", "label": "Homme trans"}, {"value": "gender_agender", "label": "Agender"}, {"value": "gender_inter", "label": "Intersexe"}, {"value": "gender_other", "label": "Autre"}]}'),
       ('sexual_orientation', 'fr', 'Orientation sexuelle', 'Quels sont les termes que tu utiliserais pour décrire ton orientation sexuelle ?', '{"options": [{"value": "sexual_orientation_straight", "label": "Hétérosexuel"}, {"value": "sexual_orientation_homosexual", "label": "Homosexuel"}, {"value": "sexuql_orientation_bisexual", "label": "Bisexuel"}, {"value": "sexual_orientation_pansexual", "label": "Pansexuel"}, {"value": "sexual_orientation_asexual", "label": "Asexuel"}, {"value": "sexual_orientation_queer", "label": "Queer"}, {"value": "sexual_orientation_other", "label": "Autres"}]}'),
       ('education', 'fr', 'Formation', 'Quel est ton diplôme le plus élevé ?', '{"options": [{"value": "education_none", "label": "Pas encore terminé"}, {"value": "education_secondary_school", "label": "Scolarité obligatoire (p. ex. secondaire I)"}, {"value": "education_vocational_training_or_apprenticeship", "label": "Formation professionnelle (CFC / AFP)"}, {"value": "education_maturafmshms_or_equivalent", "label": "Maturité / ECG / ECS / etc."}, {"value": "education_university_of_applied_sciences_fhhf", "label": "Haute école spécialisée (HES) ou école supérieure (ES)"}, {"value": "education_university_degree", "label": "Université / EPF"}]}'),
       ('household_members', 'fr', 'Taille du ménage', 'Combien de personnes vivent dans ton ménage (y compris toi-même) ?', '{"options": [{"value": "household_members_1_living_alone", "label": "1 (vivre seul)"}, {"value": "household_members_2", "label": "2"}, {"value": "household_members_3", "label": "3"}, {"value": "household_members_4", "label": "4"}, {"value": "household_members_5", "label": "5"}, {"value": "household_members_6", "label": "6"}, {"value": "household_members_7", "label": "7"}, {"value": "household_members_8", "label": "8"}, {"value": "household_members_9", "label": "9"}, {"value": "household_members_10_or_more", "label": "10 ou plus"}]}'),
       ('household_members_financing', 'fr', 'Financement du budget', 'Combien de personnes dans ton ménage contribuent (y compris toi-même) au revenu commun ?', '{"options": [{"value": "household_members_financing_1_person_myself_only", "label": "1 personne (seulement moi)"}, {"value": "household_members_financing_2", "label": "2 personnes"}, {"value": "household_members_financing_3", "label": "3 personnes"}, {"value": "household_members_financing_4", "label": "4 personnes"}, {"value": "household_members_financing_5", "label": "5 personnes"}, {"value": "household_members_financing_6", "label": "6 personnes"}, {"value": "household_members_financing_7", "label": "7 personnes"}, {"value": "household_members_financing_8", "label": "8 personnes"}, {"value": "household_members_financing_9", "label": "9 personnes"}, {"value": "household_members_financing_10_or_more", "label": "10 ou plus"}]}'),
       ('monthly_household_income', 'fr', 'Revenu du ménage', 'Quel est approximativement le revenu mensuel commun de votre ménage (après déduction des impôts) ?', '{"options": [{"value": "monthly_household_income_less_than_chf_1500", "label": "Moins de 1500 CHF"}, {"value": "monthly_household_income_chf_15003000", "label": "CHF 1500-3000"}, {"value": "monthly_household_income_chf_30004500", "label": "CHF 3000-4500"}, {"value": "monthly_household_income_chf_45006000", "label": "CHF 4500-6000"}, {"value": "monthly_household_income_chf_60007500", "label": "CHF 6000-7500"}, {"value": "monthly_household_income_chf_750010000", "label": "CHF 7500-10''000"}, {"value": "monthly_household_income_more_than_chf_10000", "label": "Plus de 10 000 CHF"}, {"value": "monthly_household_income_unknown", "label": "Ne sait pas"}]}'),
       ('employment_status', 'fr', 'Emploi', 'Quelle est ta situation professionnelle ou scolaire actuelle ?', '{"options": [{"value": "employment_status_pupil__student", "label": "élève* / étudiant"}, {"value": "employment_status_employed", "label": "Employé"}, {"value": "employment_status_selfemployed", "label": "Indépendant"}, {"value": "employment_status_retired", "label": "Retraité"}, {"value": "employment_status_unemployed", "label": "Au chômage"}]}'),
       ('disabilities', 'fr', 'Dégradations', 'Tu as un handicap physique ou psychique, une maladie chronique ou un autre problème de santé qui affecte ton quotidien ?', '{"options": [{"value": "disabilities_yes", "label": "Oui"}, {"value": "disabilities_no", "label": "Non"}]}'),
       ('different_country_than_born_in', 'fr', 'Pays d''origine', 'Vis-tu dans un autre pays que celui où tu es né ?', '{"options": [{"value": "different_country_than_born_in_yes", "label": "Oui"}, {"value": "different_country_than_born_in_no", "label": "Non"}]}'),
       ('axis_of_opression', 'fr', 'Discrimination vécue', 'As-tu déjà été victime de discrimination au quotidien en raison de caractéristiques personnelles ?', '{"options": [{"value": "axis_of_opression_yes_because_of_my_gender", "label": "Oui, à cause de mon sexe"}, {"value": "axis_of_opression_yes_because_of_my_age", "label": "Oui, à cause de mon âge"}, {"value": "axis_of_opression_yes_because_of_my_background", "label": "Oui, à cause de mes origines"}, {"value": "axis_of_opression_yes_because_of_my_skin_colour_or_appearance", "label": "Oui, à cause de la couleur de ma peau ou de mon apparence physique"}, {"value": "axis_of_opression_yes_because_of_my_language_or_accent", "label": "Oui, à cause de ma langue ou de mon accent"}, {"value": "axis_of_opression_yes_because_of_my_social_or_financial_situation", "label": "Oui, à cause de ma situation sociale ou financière"}, {"value": "axis_of_opression_yes_because_of_my_clothing_or_style", "label": "Oui, à cause de mes vêtements ou de mon style"}, {"value": "axis_of_opression_yes_because_of_my_sexual_orientation", "label": "Oui, à cause de mon orientation sexuelle"}, {"value": "axis_of_opression_yes_because_of_my_health_condition_or_a_disability", "label": "Oui, en raison de mon état de santé ou d''un handicap"}, {"value": "axis_of_opression_yes_for_another_reason", "label": "Oui, pour une autre raison"}, {"value": "axis_of_opression_no", "label": "Non"}]}'),
       ('info_current_location', 'fr', 'Ta position actuelle', 'Ensuite, nous allons te poser quelques questions sur l''endroit où tu te trouves, ce que tu fais et à quoi ressemble ton environnement.', NULL),
       ('indoors_outdoors', 'fr', 'À l''intérieur ou à l''extérieur', 'Es-tu à l''intérieur ou à l''extérieur ?', '{"options": [{"value": "indoors_outdoors_indoors", "label": "A l''intérieur"}, {"value": "indoors_outdoors_outdoors", "label": "Dehors"}]}'),
       ('location_category', 'fr', 'Catégorie de lieu', 'Où es-tu exactement ?', '{"options": [{"value": "location_category_at_home", "label": "À la maison"}, {"value": "location_category_at_someone_elses_home", "label": "Chez quelqu''un d''autre"}, {"value": "location_category_workplace", "label": "Lieu de travail"}, {"value": "location_category_school__university", "label": "École / Université"}, {"value": "location_category_shopping_or_services", "label": "Achats ou services"}, {"value": "location_category_café__restaurant__bar", "label": "Café / Restaurant / Bar"}, {"value": "location_category_leisure_or_sports_facility", "label": "Établissement de loisirs ou de sport"}, {"value": "location_category_park_or_green_space", "label": "Parc ou espace vert"}, {"value": "location_category_cultural_or_religious_place", "label": "Lieu culturel ou religieux"}, {"value": "location_category_health_or_therapy_setting", "label": "Établissement de santé / thérapie"}, {"value": "location_category_on_the_move_walking_cycling_driving", "label": "En déplacement (à pied, à vélo, en voiture)"}, {"value": "location_category_public_transport", "label": "Transports publics"}, {"value": "location_category_other_place", "label": "Autre lieu"}]}'),
       ('people_with_you', 'fr', 'Des gens autour de toi', 'Avec qui es-tu en ce moment ?', '{"options": [{"value": "people_with_you_no_one", "label": "Personne"}, {"value": "people_with_you_partner", "label": "Partenaire"}, {"value": "people_with_you_children", "label": "Enfants"}, {"value": "people_with_you_family", "label": "Famille"}, {"value": "people_with_you_friends", "label": "Amis"}, {"value": "people_with_you_colleagues", "label": "Collègues de travail"}, {"value": "people_with_you_acquaintances", "label": "Connu"}, {"value": "people_with_you_animalspets", "label": "Animaux/Animaux de compagnie"}, {"value": "people_with_you_strangers", "label": "Étranger"}, {"value": "people_with_you_other", "label": "Autres"}]}'),
       ('activity', 'fr', 'Activité', 'Qu''est-ce que tu fais principalement en ce moment ?', '{"options": [{"value": "activity_leisure_or_relaxation", "label": "Loisirs ou détente"}, {"value": "activity_travelling_or_commuting", "label": "Se déplacer ou faire la navette"}, {"value": "activity_working_or_studying", "label": "Travailler ou étudier"}, {"value": "activity_shopping_or_running_errands", "label": "Faire des achats ou des courses"}, {"value": "activity_housework_or_tidying_up", "label": "Ménage ou rangement"}, {"value": "activity_cooking_or_eating", "label": "Cuisiner ou manger"}, {"value": "activity_care_responsibilities", "label": "Obligations d''assistance"}, {"value": "activity_social_activities", "label": "Activités sociales"}, {"value": "activity_using_media", "label": "Utilisation des médias"}, {"value": "activity_resting_or_sleeping", "label": "Se reposer ou dormir"}, {"value": "activity_other", "label": "Autres"}]}'),
       ('environment_noise', 'fr', 'Volume sonore', 'Comment perçois-tu l''environnement sonore de ce lieu ?', '{"values": ["Très bruyant", "Très silencieux"]}'),
       ('environment_nature', 'fr', 'Nature', 'Quelle est la part de nature visible dans ce lieu ?', '{"values": ["Pas de nature", "Beaucoup de nature"]}'),
       ('environment_lively', 'fr', 'Vivacité', 'L''endroit paraît-il animé ou calme ?', '{"values": ["Vivant", "Tranquille"]}'),
       ('environmen_pleasure', 'fr', 'Agréable', 'Dans l''ensemble, est-ce que tu trouves l''endroit agréable ?', '{"values": ["Désagréable", "Agréable"]}'),
       ('info_wellbeing', 'fr', 'Bien-être', 'Pour finir, quelques questions sur ton bien-être actuel.', NULL),
       ('general_wellbeing', 'fr', 'Bien-être général', 'Comment te sens-tu en ce moment ?', '{"values": ["Très mal à l''aise", "Très bien"]}'),
       ('content', 'fr', 'Satisfaction', 'D''une manière générale, à quel point te sens-tu satisfait en ce moment ?', '{"values": ["Très insatisfait", "Très satisfait"]}'),
       ('tense_relaxed', 'fr', 'Tension', 'À quel point te sens-tu tendu ou détendu ?', '{"values": ["Très tendu", "Très détendu"]}'),
       ('awake', 'fr', 'Énergie', 'À quel point te sens-tu éveillé en ce moment ?', '{"values": ["Très fatigué", "Très éveillé"]}'),
       ('sense_of_belonging', 'fr', 'Appartenance', 'Quel est ton sentiment d''appartenance ou d''étrangeté dans ce lieu ?', '{"values": ["Très étranger", "Très proche"]}'),
       ('factors_sense_of_belonging', 'fr', 'Facteurs d''appartenance', 'Penses-tu que ton sentiment d''appartenance ou d''étrangeté dans ce lieu est lié à la manière dont tu es perçu en tant que personne ?', '{"options": [{"value": "factors_sense_of_belonging_yes_because_of_my_gender", "label": "Oui, à cause de mon sexe"}, {"value": "factors_sense_of_belonging_yes_because_of_my_age", "label": "Oui, à cause de mon âge"}, {"value": "factors_sense_of_belonging_yes_because_of_my_background", "label": "Oui, à cause de mes origines"}, {"value": "factors_sense_of_belonging_yes_because_of_my_skin_colour_or_appearance", "label": "Oui, à cause de la couleur de ma peau ou de mon apparence physique"}, {"value": "factors_sense_of_belonging_yes_because_of_my_language_or_accent", "label": "Oui, à cause de ma langue ou de mon accent"}, {"value": "factors_sense_of_belonging_yes_because_of_my_social_or_financial_situation", "label": "Oui, à cause de ma situation sociale ou financière"}, {"value": "factors_sense_of_belonging_yes_because_of_my_clothing_or_style", "label": "Oui, à cause de mes vêtements ou de mon style"}, {"value": "factors_sense_of_belonging_yes_because_of_my_sexual_orientation", "label": "Oui, à cause de mon orientation sexuelle"}, {"value": "factors_sense_of_belonging_yes_because_of_my_health_condition_or_a_disability", "label": "Oui, en raison de mon état de santé ou d''un handicap"}, {"value": "factors_sense_of_belonging_yes_for_another_reason", "label": "Oui, pour une autre raison"}, {"value": "factors_sense_of_belonging_no", "label": "Non"}]}'),
       ('majority_comparison', 'fr', 'Comparaison avec la majorité', 'Comparé aux autres personnes ici présentes : Pour quelles caractéristiques te sens-tu appartenir à la majorité ?', '{"options": [{"value": "majority_comparison_in_my_gender", "label": "Dans mon sexe"}, {"value": "majority_comparison_in_my_age", "label": "Dans mon âge"}, {"value": "majority_comparison_in_my_background", "label": "Dans mes origines"}, {"value": "majority_comparison_in_my_skin_colour_or_appearance", "label": "Dans ma couleur de peau ou mon apparence"}, {"value": "majority_comparison_in_my_language_or_accent", "label": "Dans ma langue ou mes accents"}, {"value": "majority_comparison_in_my_social_or_financial_situation", "label": "Dans ma situation sociale ou financière"}, {"value": "majority_comparison_in_my_clothing_or_style", "label": "Dans mes vêtements ou mon style"}, {"value": "majority_comparison_in_my_sexual_orientation", "label": "Dans mon orientation sexuelle"}, {"value": "majority_comparison_in_my_health_condition_or_a_disability", "label": "Dans mon état de santé ou d''un handicap"}]}'),
       ('other_factors_negative', 'fr', 'Autres causes de malaise', 'Y a-t-il d''autres choses qui font que tu te sens moins bien ou mal à l''aise ici ?', NULL),
       ('other_factors_positive', 'fr', 'Autres raisons de se sentir bien', 'Y a-t-il d''autres choses qui te font te sentir mieux ici ?', NULL);