-- *******************************************************
--  Auto-generated SQL from Excel questionnaire
--  Source file : Fragenkatalog.xlsx
--  Generated   : 2025-05-09 12:12:06
--  Script      : excel_to_sql.py
-- *******************************************************

INSERT INTO translations (question_id, LANGUAGE, title, text, options_content)
VALUES ('welcome', 'en', 'Hello!', 'We’re glad to have you here!

In this app, you will answer short questions about your current well-being and your surroundings three times a day for one week.

Your answers will help us to better understand how people experience different places - and how these experiences relate to different life situations.', NULL),
       ('about_this_study', 'en', 'What is this study about?', 'How we feel in a place depends heavily on our surroundings. Some places have a calming, familiar or inviting effect. Others make us feel uneasy, marginalized or out of place.

However, these experiences are not the same for everyone. They can depend on how we are perceived and treated in a place - for example, based on gender, origin, language, appearance or other characteristics that shape our social position.

## What do we mean by wellbeing?

Wellbeing can mean many things. Sometimes it''s about something long-term - for example, how satisfied we are with our lives overall, how healthy we feel or whether we feel safe and supported in our everyday lives.

In this study, however, we are primarily interested in **momentary well-being**: How are you feeling **right now**, in this place, in this situation?

Well-being is to be understood holistically - it includes both **physical** aspects (e.g. tiredness, warmth, calm) and **psychological** sensations (e.g. satisfaction, security, a sense of belonging). These short-term impressions are often fleeting and depend heavily on where we are, what we are doing and how we are perceived there.

## Who is conducting the study?

The study is part of a Bachelor''s thesis at the Institute of Geography at the University of Bern. It is being carried out by Lukas Batschelet and supervised by Prof. Dr. Carolin Schurr and Dr. Moritz Gubler.

## What is the aim of this study?

We are interested in how various characteristics - individually or in combination - affect current well-being. For example: Does a young woman with a history of migration feel differently in a public place than an older man who is in the same place at the same time?

In the study, we are investigating the question of why places have different effects on different people. We want to better understand how belonging, security or a feeling of not belonging arise - and how these experiences are linked to everyday life, social attributions and personal circumstances.

## How does participation work?

The study lasts one week. During this time, you will be asked to complete a short survey on your smartphone three times a day. Each time it is about:

* the place you are currently in
* what you are doing there
* how you feel
* and whether you feel like you belong or are a stranger there

Each survey is available for one hour and then expires automatically. The times are distributed slightly randomly throughout the day so that answers are not always given at the same time and in the same place.

If you miss a survey, it''s no problem - you can simply take part again at the next time.', NULL),
       ('consent', 'en', 'Consent to participation', 'Before you start the survey, we ask for your consent to participate in this study.

Participation is voluntary.  
You can skip individual questions (e.g. with "No response") and end your participation at any time.  
You can also delete your data completely later in the app settings.

## What data is collected?

- Personal details (e.g. age, gender, education)
- Answers about your current state of health and location
- Location data, provided you give your consent

## How do we handle your data?

- We do not store names, email addresses or other personal contact details
- Your data is stored anonymously on a secure Supabase server in Switzerland
- No movement profiles or permanently retrievable location histories are recorded
- Your data will only be used for scientific purposes and will not be passed on to third parties

By clicking "I agree", you confirm that you have read and understood this information and are voluntarily participating in the study. You can end your participation at any time and delete your data via the app settings.

Further information can be found in our [Privacy Policy](https://intermind.ch/privacy-policy.html).', NULL),
       ('notifications', 'en', 'Notifications', 'We will send you notifications so that you never miss a survey.

These reminders come automatically when a new survey slot starts. You then have one hour to respond.

The notifications are important because the time slots are short. You can switch them off in the device settings - but then you run the risk of missing surveys.

We recommend that you allow notifications so that you can cover as many different situations as possible.', NULL),
       ('location_acces', 'en', 'Location', 'So that we can better understand the answers and recognize spatial patterns, we ask you to allow location sharing.

This allows us to see, for example, whether the experience in busy places differs from that in quiet areas - without knowing your name or your exact addresses.

The location therefore helps us to supplement your information about your whereabouts, e.g. with information about the surrounding area.

Your data is only stored anonymously and is not permanently tracked.

You can deactivate location sharing at any time in your device settings.', NULL),
       ('info_questions_about_you', 'en', 'Some questions about you', 'Before we start the daily surveys, we ask you a few questions about yourself - for example about your age, gender, education and living situation.

You can skip any question if you don''t want to answer it.', NULL),
       ('age_group', 'en', 'Age group', 'What age group are you in?', '{"options": [{"value": "age_group_under_16", "label": "Under 16"}, {"value": "age_group_1625", "label": "16-25"}, {"value": "age_group_2635", "label": "26-35"}, {"value": "age_group_3645", "label": "36-45"}, {"value": "age_group_4655", "label": "46-55"}, {"value": "age_group_5665", "label": "56-65"}, {"value": "age_group_6675", "label": "66-75"}, {"value": "age_group_75", "label": "75+"}]}'),
       ('sex', 'en', 'Biological gender', 'What sex were you assigned at birth?', '{"options": [{"value": "sex_male", "label": "Female"}, {"value": "sex_female", "label": "Male"}, {"value": "sex_inter", "label": "Inter / variant of sexual development"}]}'),
       ('gender', 'en', 'Gender identity', 'What is your gender identity?', '{"options": [{"value": "gender_female", "label": "Female"}, {"value": "gender_male", "label": "Male"}, {"value": "gender_nonbinary_genderqueer", "label": "Non-binary / genderqueer"}, {"value": "gender_trans_woman", "label": "Trans woman"}, {"value": "gender_trans_man", "label": "Trans man"}, {"value": "gender_agender", "label": "Agender"}, {"value": "gender_inter", "label": "Intersex"}, {"value": "gender_other", "label": "Other"}]}'),
       ('sexual_orientation', 'en', 'Sexual orientation', 'How would you describe your sexual orientation?', '{"options": [{"value": "sexual_orientation_straight", "label": "Heterosexual"}, {"value": "sexual_orientation_homosexual", "label": "Homosexual"}, {"value": "sexuql_orientation_bisexual", "label": "Bisexual"}, {"value": "sexual_orientation_pansexual", "label": "Pansexual"}, {"value": "sexual_orientation_asexual", "label": "Asexual"}, {"value": "sexual_orientation_queer", "label": "Queer"}, {"value": "sexual_orientation_other", "label": "Other"}]}'),
       ('education', 'en', 'Education', 'What is your highest educational qualification?', '{"options": [{"value": "education_none", "label": "No formal qualification yet"}, {"value": "education_secondary_school", "label": "Compulsory schooling (e.g. Sek I)"}, {"value": "education_vocational_training_or_apprenticeship", "label": "Vocational training (EFZ / EBA)"}, {"value": "education_maturafmshms_or_equivalent", "label": "Matura / FMS / HMS / etc."}, {"value": "education_university_of_applied_sciences_fhhf", "label": "University of Applied Sciences (FH / HF)"}, {"value": "education_university_degree", "label": "University / ETH"}]}'),
       ('household_members', 'en', 'Household size', 'How many people live in your household (including yourself)?', '{"options": [{"value": "household_members_1_living_alone", "label": "1 (live alone)"}, {"value": "household_members_2", "label": "2"}, {"value": "household_members_3", "label": "3"}, {"value": "household_members_4", "label": "4"}, {"value": "household_members_5", "label": "5"}, {"value": "household_members_6", "label": "6"}, {"value": "household_members_7", "label": "7"}, {"value": "household_members_8", "label": "8"}, {"value": "household_members_9", "label": "9"}, {"value": "household_members_10_or_more", "label": "10 or more"}]}'),
       ('household_members_financing', 'en', 'Budget financing', 'How many people in your household (including yourself) contribute to the joint income?', '{"options": [{"value": "household_members_financing_1_person_myself_only", "label": "1 person (only me)"}, {"value": "household_members_financing_2", "label": "2 persons"}, {"value": "household_members_financing_3", "label": "3 persons"}, {"value": "household_members_financing_4", "label": "4 persons"}, {"value": "household_members_financing_5", "label": "5 persons"}, {"value": "household_members_financing_6", "label": "6 persons"}, {"value": "household_members_financing_7", "label": "7 persons"}, {"value": "household_members_financing_8", "label": "8 persons"}, {"value": "household_members_financing_9", "label": "9 persons"}, {"value": "household_members_financing_10_or_more", "label": "10 or more"}]}'),
       ('monthly_household_income', 'en', 'Household income', 'Approximately what is your joint monthly household income (after tax)?', '{"options": [{"value": "monthly_household_income_less_than_chf_1500", "label": "Under CHF 1500"}, {"value": "monthly_household_income_chf_15003000", "label": "CHF 1500-3000"}, {"value": "monthly_household_income_chf_30004500", "label": "CHF 3000-4500"}, {"value": "monthly_household_income_chf_45006000", "label": "CHF 4500-6000"}, {"value": "monthly_household_income_chf_60007500", "label": "CHF 6000-7500"}, {"value": "monthly_household_income_chf_750010000", "label": "CHF 7500-10''000"}, {"value": "monthly_household_income_more_than_chf_10000", "label": "More than CHF 10,000"}, {"value": "monthly_household_income_unknown", "label": "Don''t know"}]}'),
       ('employment_status', 'en', 'Employment', 'What is your current professional or educational situation?', '{"options": [{"value": "employment_status_pupil__student", "label": "Pupil / Student"}, {"value": "employment_status_employed", "label": "Employed"}, {"value": "employment_status_selfemployed", "label": "Self-employed"}, {"value": "employment_status_retired", "label": "Retired"}, {"value": "employment_status_unemployed", "label": "Unemployed"}]}'),
       ('disabilities', 'en', 'Impairments', 'Do you have a physical or mental impairment, chronic illness or other health restriction that affects your everyday life?', '{"options": [{"value": "disabilities_yes", "label": "Yes"}, {"value": "disabilities_no", "label": "No"}]}'),
       ('different_country_than_born_in', 'en', 'Country of origin', 'Do you live in a country other than the one in which you were born?', '{"options": [{"value": "different_country_than_born_in_yes", "label": "Yes"}, {"value": "different_country_than_born_in_no", "label": "No"}]}'),
       ('axis_of_opression', 'en', 'Experienced discrimination', 'Have you experienced discrimination on the basis of personal characteristics in your everyday life?', '{"options": [{"value": "axis_of_opression_yes_because_of_my_gender", "label": "Yes, due to my gender"}, {"value": "axis_of_opression_yes_because_of_my_age", "label": "Yes, due to my age"}, {"value": "axis_of_opression_yes_because_of_my_background", "label": "Yes, due to my origins"}, {"value": "axis_of_opression_yes_because_of_my_skin_colour_or_appearance", "label": "Yes, due to the color of my skin or my appearance"}, {"value": "axis_of_opression_yes_because_of_my_language_or_accent", "label": "Yes, due to my language or my accent"}, {"value": "axis_of_opression_yes_because_of_my_social_or_financial_situation", "label": "Yes, due to my social or financial situation"}, {"value": "axis_of_opression_yes_because_of_my_clothing_or_style", "label": "Yes, due to my clothes or my style"}, {"value": "axis_of_opression_yes_because_of_my_sexual_orientation", "label": "Yes, due to my sexual orientation"}, {"value": "axis_of_opression_yes_because_of_my_health_condition_or_a_disability", "label": "Yes, due to my state of health or a disability"}, {"value": "axis_of_opression_yes_for_another_reason", "label": "Yes, due to another reason"}, {"value": "axis_of_opression_no", "label": "No"}]}'),
       ('info_current_location', 'en', 'Your current location', 'The next questions concern your current location, activity, and surroundings.', NULL),
       ('indoors_outdoors', 'en', 'Indoors or outdoors', 'Are you indoors or outdoors?', '{"options": [{"value": "indoors_outdoors_indoors", "label": "Inside"}, {"value": "indoors_outdoors_outdoors", "label": "Outside"}]}'),
       ('location_category', 'en', 'Location category', 'Where exactly are you?', '{"options": [{"value": "location_category_at_home", "label": "At home"}, {"value": "location_category_at_someone_elses_home", "label": "At someone else''s home"}, {"value": "location_category_workplace", "label": "Workplace"}, {"value": "location_category_school__university", "label": "School / University"}, {"value": "location_category_shopping_or_services", "label": "Shopping or services"}, {"value": "location_category_café__restaurant__bar", "label": "Café / Restaurant / Bar"}, {"value": "location_category_leisure_or_sports_facility", "label": "Leisure or sports facility"}, {"value": "location_category_park_or_green_space", "label": "Park or green space"}, {"value": "location_category_cultural_or_religious_place", "label": "Cultural or religious place"}, {"value": "location_category_health_or_therapy_setting", "label": "Healthcare facility / therapy"}, {"value": "location_category_on_the_move_walking_cycling_driving", "label": "On the move (on foot, by bike, by car)"}, {"value": "location_category_public_transport", "label": "Public transportation"}, {"value": "location_category_other_place", "label": "Other place"}]}'),
       ('people_with_you', 'en', 'People around you', 'Who are you with at the moment?', '{"options": [{"value": "people_with_you_no_one", "label": "Nobody"}, {"value": "people_with_you_partner", "label": "Partner"}, {"value": "people_with_you_children", "label": "Children"}, {"value": "people_with_you_family", "label": "Family"}, {"value": "people_with_you_friends", "label": "Friends"}, {"value": "people_with_you_colleagues", "label": "Work colleagues"}, {"value": "people_with_you_acquaintances", "label": "Known"}, {"value": "people_with_you_animalspets", "label": "Animals/Pets"}, {"value": "people_with_you_strangers", "label": "Strangers"}, {"value": "people_with_you_other", "label": "Other"}]}'),
       ('activity', 'en', 'Activity', 'What are you mainly doing right now?', '{"options": [{"value": "activity_leisure_or_relaxation", "label": "Leisure or relaxation"}, {"value": "activity_travelling_or_commuting", "label": "Being on the road or commuting"}, {"value": "activity_working_or_studying", "label": "Work or study"}, {"value": "activity_shopping_or_running_errands", "label": "Shopping or errands"}, {"value": "activity_housework_or_tidying_up", "label": "Household or tidying up"}, {"value": "activity_cooking_or_eating", "label": "Cooking or eating"}, {"value": "activity_care_responsibilities", "label": "Care obligations"}, {"value": "activity_social_activities", "label": "Social activities"}, {"value": "activity_using_media", "label": "Media use"}, {"value": "activity_resting_or_sleeping", "label": "Rest or sleep"}, {"value": "activity_other", "label": "Miscellaneous"}]}'),
       ('environment_noise', 'en', 'Volume', 'How do you perceive the background noise in this place?', '{"values": ["Very loud", "Very quiet"]}'),
       ('environment_nature', 'en', 'Nature', 'How much nature is visible in this place?', '{"values": ["No nature", "Lots of nature"]}'),
       ('environment_lively', 'en', 'Liveliness', 'How lively or quiet is the place?', '{"values": ["Lively", "Quiet"]}'),
       ('environmen_pleasure', 'en', 'Pleasant', 'How pleasant do you find the place overall?', '{"values": ["Unpleasant", "Pleasant"]}'),
       ('info_wellbeing', 'en', 'Well-being', 'Finally, a few questions about your current well-being.', NULL),
       ('general_wellbeing', 'en', 'General well-being', 'How do you feel overall right now?', '{"values": ["Very unwell", "Very well"]}'),
       ('content', 'en', 'Satisfaction', 'In general - how satisfied do you feel at the moment?', '{"values": ["Very dissatisfied", "Very satisfied"]}'),
       ('tense_relaxed', 'en', 'Tension', 'How tense or relaxed do you feel?', '{"values": ["Very tense", "Very relaxed"]}'),
       ('awake', 'en', 'Energy', 'How awake do you feel at the moment?', '{"values": ["Very tired", "Very awake"]}'),
       ('sense_of_belonging', 'en', 'Affiliation', 'How much do you feel like you belong or feel like a stranger in this place?', '{"values": ["Very foreign", "Very belonging"]}'),
       ('factors_sense_of_belonging', 'en', 'Factors for affiliation', 'Do you think your sense of belonging or otherness in this place has to do with how you are perceived as a person?', '{"options": [{"value": "factors_sense_of_belonging_yes_because_of_my_gender", "label": "Yes, due to my gender"}, {"value": "factors_sense_of_belonging_yes_because_of_my_age", "label": "Yes, due to my age"}, {"value": "factors_sense_of_belonging_yes_because_of_my_background", "label": "Yes, due to my origins"}, {"value": "factors_sense_of_belonging_yes_because_of_my_skin_colour_or_appearance", "label": "Yes, due to the color of my skin or my appearance"}, {"value": "factors_sense_of_belonging_yes_because_of_my_language_or_accent", "label": "Yes, due to my language or my accent"}, {"value": "factors_sense_of_belonging_yes_because_of_my_social_or_financial_situation", "label": "Yes, due to my social or financial situation"}, {"value": "factors_sense_of_belonging_yes_because_of_my_clothing_or_style", "label": "Yes, due to my clothes or my style"}, {"value": "factors_sense_of_belonging_yes_because_of_my_sexual_orientation", "label": "Yes, due to my sexual orientation"}, {"value": "factors_sense_of_belonging_yes_because_of_my_health_condition_or_a_disability", "label": "Yes, due to my state of health or a disability"}, {"value": "factors_sense_of_belonging_yes_for_another_reason", "label": "Yes, due to another reason"}, {"value": "factors_sense_of_belonging_no", "label": "No"}]}'),
       ('majority_comparison', 'en', 'Comparison with the majority', 'Compared to the other people here: In which characteristics do you feel you belong to the majority?', '{"options": [{"value": "majority_comparison_in_my_gender", "label": "In my gender"}, {"value": "majority_comparison_in_my_age", "label": "At my age"}, {"value": "majority_comparison_in_my_background", "label": "In my origin"}, {"value": "majority_comparison_in_my_skin_colour_or_appearance", "label": "In the color of my skin or my appearance"}, {"value": "majority_comparison_in_my_language_or_accent", "label": "In my language or accent"}, {"value": "majority_comparison_in_my_social_or_financial_situation", "label": "In my social or financial situation"}, {"value": "majority_comparison_in_my_clothing_or_style", "label": "In my clothes or my style"}, {"value": "majority_comparison_in_my_sexual_orientation", "label": "In my sexual orientation"}, {"value": "majority_comparison_in_my_health_condition_or_a_disability", "label": "In my state of health or disability"}]}'),
       ('other_factors_negative', 'en', 'Other reasons for feeling unwell', 'Are there other things that make you feel less comfortable or uncomfortable here?', NULL),
       ('other_factors_positive', 'en', 'Other reasons for well-being', 'Are there other things that make you feel more comfortable here?', NULL);