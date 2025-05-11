-- SCREEN CONTENT TRANSLATIONS SEED DATA
-- Translations for the About and Privacy Policy screens

-- =============================
-- ENGLISH TRANSLATIONS
-- =============================

-- About Screen - English
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'about',
  'en',
  'About InterMind',
  '**InterMind** was developed by Lukas Batschelet at the Institute of Geography, University of Bern. The app is part of a Bachelor''s thesis supervised by Prof. Dr. Carolin Schurr and Dr. Moritz Gubler. It is used exclusively for academic research to investigate how our immediate environment influences momentary wellbeing.

## What Do We Mean by Wellbeing?

Wellbeing can mean many things. Sometimes it refers to something long-term – for example, how satisfied we are with our lives, how healthy we feel, or whether we feel safe and supported in everyday life.

However, this study focuses on **momentary wellbeing**: How are you feeling **right now**, in this place, in this situation?

Wellbeing is understood holistically – it includes both **physical** aspects (e.g. fatigue, warmth, calm) and **psychological** feelings (e.g. satisfaction, safety, belonging). These impressions are often fleeting and strongly depend on where we are, what we are doing, and how we are perceived.

## Why Are We Investigating This?

How we feel in a place depends heavily on our surroundings. Some places feel calming, familiar, or welcoming. Others make us feel uneasy, excluded, or out of place.

These experiences are not the same for everyone. They may depend on how we are perceived and treated – for example, based on gender, origin, language, appearance, or other characteristics that shape our social position.

We are interested in how various characteristics – alone or in combination – affect momentary wellbeing. For example: Does a young woman with a migration background feel differently in a public space than an older man at the same place and time?

This study explores why places affect people differently. We aim to understand how feelings of belonging, safety, or exclusion arise – and how these experiences are related to everyday life, social attribution, and personal circumstances.

## How Does Participation Work?

The study lasts for one week. During this time, you will be asked to complete a short survey on your smartphone three times a day. The questions cover:

* the place you are currently in  
* what you are doing there  
* how you are feeling  
* and whether you feel a sense of belonging or exclusion

Each survey is available for one hour and then expires automatically. The time points are slightly randomized across the day to avoid repetition.

If you miss a survey, no problem – just take part in the next one.

## Licences

**App source code**  
Available on [GitHub](https://github.com/lbatschelet/InterMind)  
Licensed under the [GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html)

## Graphics

All illustrations © 2025 Katerina Limpitsouni  
from the open source project [undraw.co](https://undraw.co)'
);

-- Privacy Policy Screen - English
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'privacy',
  'en',
  'Privacy Policy',
  'InterMind is part of a scientific study conducted at the Institute of Geography, University of Bern. The app is used in the context of a Bachelor''s thesis by Lukas Batschelet, supervised by Prof. Dr. Carolin Schurr and Dr. Moritz Gubler.

This privacy policy explains what data is collected, how it is processed, and what rights you have as a participant.

## 1. Who is responsible?

The data controller is:

Institute of Geography  
University of Bern  
Hallerstrasse 12  
3012 Bern, Switzerland

For any questions or concerns, please contact:  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. What data is collected?

We collect the following information:

- Demographic data, such as age and gender identity  
- Survey responses about your emotions, thoughts, and surroundings  
- Location data (GPS) — collected only at the moment of each survey entry, not continuously

We do not collect any personally identifying information. No name, phone number, email address, or similar data is recorded.

## 3. Why do we collect this data?

The data is collected exclusively for scientific research at the Institute of Geography, University of Bern. It helps us understand how different people experience their surroundings and how these experiences relate to their sense of wellbeing.

Your data will never be used for commercial purposes.

## 4. Legal basis

This study is conducted in accordance with the Swiss Federal Act on Data Protection (FADP / DSG). All data processing is lawful, proportionate, and based on informed consent.

## 5. Data storage and retention

Your data is:

- Stored securely on a server currently located in Zurich, Switzerland  
- Hosted by the provider Supabase  
- Protected through encryption and access controls  
- Fully anonymised and cannot be linked back to you  
- Retained only as long as necessary for the research purpose

By default, your data remains stored until you actively delete it via the app settings. You may delete your data at any time. Once deleted, it cannot be recovered.

The current hosting setup may be adjusted in the future (e.g. provider or server location), but any such changes will continue to comply with Swiss data protection law and ensure the same level of data security and privacy.

## 6. Who can access your data?

Your data is:

- Used exclusively for research purposes at the University of Bern  
- Not shared with third parties outside the research team  
- Fully anonymous and cannot be traced back to you

Future research projects may reuse anonymized data within the Institute of Geography only.

## 7. Your rights

Under Swiss data protection law, you have the right to:

- Receive clear information about data processing  
- Revoke your consent at any time  
- Delete your data using the in-app option  
- Contact the project team with questions or concerns

Please note: Since your data is completely anonymised, we cannot retrieve or modify individual entries.

## 8. Changes to this policy

We may update this policy to reflect changes in the research project, infrastructure, or legal requirements. Any updates will be published in the app.

This privacy policy was last updated on 11 May 2025.'
);

-- Consent Screen - English
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'consent',
  'en',
  'Consent',
  'Before you start the survey, we ask for your consent to participate in this study.

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

Further information can be found in our [Privacy Policy](https://intermind.ch/privacy-policy.html).'
);

-- =============================
-- GERMAN TRANSLATIONS
-- =============================

-- About Screen - German
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'about',
  'de',
  'Über InterMind',
  '**InterMind** wurde von Lukas Batschelet am Geographischen Institut der Universität Bern entwickelt. Die App ist Teil einer Bachelorarbeit, betreut von Prof. Dr. Carolin Schurr und Dr. Moritz Gubler. Sie wird ausschliesslich für wissenschaftliche Forschungszwecke eingesetzt und untersucht, wie unsere unmittelbare Umgebung das momentane Wohlbefinden beeinflusst.

## Was meinen wir mit Wohlbefinden?

Wohlbefinden kann vieles bedeuten. Manchmal geht es dabei um etwas Langfristiges – zum Beispiel, wie zufrieden wir mit unserem Leben insgesamt sind, wie gesund wir uns fühlen oder ob wir uns sicher und unterstützt fühlen im Alltag.

In dieser Studie interessiert uns jedoch vor allem das **momentane Wohlbefinden**: Wie geht es Dir **jetzt gerade**, an diesem Ort, in dieser Situation?

Wohlbefinden ist dabei ganzheitlich zu verstehen – es umfasst sowohl **körperliche** Aspekte (z. B. Müdigkeit, Wärme, Ruhe), als auch **psychische** Empfindungen (z. B. Zufriedenheit, Sicherheit, Zugehörigkeit). Diese kurzfristigen Eindrücke sind oft flüchtig und hängen stark davon ab, wo wir uns aufhalten, was wir gerade tun und wie wir dort wahrgenommen werden.

## Warum untersuchen wir das?

Wie wir uns an einem Ort fühlen, hängt stark von unserer Umgebung ab. Manche Orte wirken beruhigend, vertraut oder einladend. Andere lassen uns unruhig werden, ausgegrenzt erscheinen oder fehl am Platz fühlen.

Solche Erfahrungen sind jedoch nicht für alle Menschen gleich. Sie können davon abhängen, wie wir an einem Ort wahrgenommen und behandelt werden – zum Beispiel aufgrund von Geschlecht, Herkunft, Sprache, Aussehen oder anderen Merkmalen, die unsere gesellschaftliche Position prägen.

Uns interessiert, wie sich verschiedene Merkmale – einzeln oder in Kombination – auf das momentane Wohlbefinden auswirken. Zum Beispiel: Fühlt sich eine junge Frau mit Migrationsgeschichte an einem öffentlichen Ort anders als ein älterer Mann, der sich zur gleichen Zeit am gleichen Ort aufhält?

In der Studie gehen wir der Frage nach, warum Orte auf verschiedene Menschen unterschiedlich wirken. Wir wollen besser verstehen, wie Zugehörigkeit, Sicherheit oder ein Gefühl des Nicht-Dazugehörens entstehen – und wie diese Erfahrungen mit dem Alltag, sozialen Zuschreibungen und persönlichen Lebenslagen zusammenhängen.

## Wie läuft die Teilnahme ab?

Die Studie dauert eine Woche. In dieser Zeit wirst Du dreimal täglich gebeten, eine kurze Befragung auf deinem Smartphone auszufüllen. Dabei geht es jeweils um:

* den Ort, an dem Du dich gerade befindest  
* was Du dort machst  
* wie Du dich fühlst  
* und ob Du dich dort zugehörig oder fremd erlebst

Jede Befragung ist jeweils für eine Stunde verfügbar und verfällt danach automatisch. Die Zeitpunkte sind leicht zufällig über den Tag verteilt, damit nicht immer zur gleichen Zeit und am gleichen Ort geantwortet wird.

Wenn Du eine Befragung verpasst, ist das kein Problem – Du kannst beim nächsten Zeitpunkt einfach wieder teilnehmen.

## Lizenzen

**Quellcode der App**  
Verfügbar auf [GitHub](https://github.com/lbatschelet/InterMind)  
Lizenziert unter der [GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html)

## Grafiken

Alle Illustrationen © 2025 Katerina Limpitsouni  
aus dem Open-Source-Projekt [undraw.co](https://undraw.co)'
);

-- Privacy Policy Screen - German
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'privacy',
  'de',
  'Datenschutzerklärung',
  'InterMind ist Teil einer wissenschaftlichen Studie am Geographischen Institut der Universität Bern. Die App wird im Rahmen einer Bachelorarbeit von Lukas Batschelet eingesetzt, die von Prof. Dr. Carolin Schurr und Dr. Moritz Gubler betreut wird.

Diese Datenschutzrichtlinie erklärt, welche Daten erhoben werden, wie sie verarbeitet werden und welche Rechte dir als teilnehmende Person zustehen.

## 1. Wer ist verantwortlich?

Verantwortlich für die Datenverarbeitung ist:

Geographisches Institut  
Universität Bern  
Hallerstrasse 12  
3012 Bern, Schweiz

Bei Fragen oder Anliegen kannst du dich an folgende Adresse wenden:  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. Welche Daten werden erhoben?

Wir erfassen folgende Informationen:

- Soziodemografische Angaben, wie Alter und Geschlechtsidentität  
- Antworten auf Fragen zu deinen Gefühlen, Gedanken und deiner Umgebung  
- Standortdaten (GPS) – erhoben nur zum Zeitpunkt der Umfrage, nicht kontinuierlich

Es werden keine personenbezogenen Daten wie Name, Telefonnummer oder E-Mail-Adresse erfasst.

## 3. Warum erheben wir diese Daten?

Die Daten dienen ausschliesslich der wissenschaftlichen Forschung am Geographischen Institut der Universität Bern. Sie helfen uns zu verstehen, wie Menschen ihre Umgebung wahrnehmen und wie diese Wahrnehmung mit dem momentanen Wohlbefinden zusammenhängt.

Deine Daten werden niemals für kommerzielle Zwecke verwendet.

## 4. Rechtliche Grundlage

Diese Studie erfolgt gemäss dem Schweizer Datenschutzgesetz (DSG). Alle Datenverarbeitungen sind rechtmässig, verhältnismässig und basieren auf deiner Einwilligung.

## 5. Speicherung und Aufbewahrung der Daten

Deine Daten werden:

- Sicher gespeichert auf einem Server mit Standort in Zürich, Schweiz  
- Verwaltet durch den Anbieter Supabase  
- Geschützt durch Verschlüsselung und Zugriffskontrollen  
- Vollständig anonymisiert und nicht rückverfolgbar gespeichert  
- Nur so lange aufbewahrt, wie sie für den Forschungszweck erforderlich sind

Standardmässig bleiben deine Daten gespeichert, bis du sie in den App-Einstellungen selbst löschst. Du kannst deine Daten jederzeit löschen – danach sind sie unwiderruflich entfernt.

Die aktuelle Hosting-Infrastruktur kann sich in Zukunft ändern (z. B. Anbieter oder Serverstandort). Solche Änderungen werden weiterhin den Anforderungen des Schweizer Datenschutzrechts entsprechen.

## 6. Wer hat Zugriff auf deine Daten?

Deine Daten werden:

- Ausschliesslich zu Forschungszwecken an der Universität Bern verwendet  
- Nicht an Dritte ausserhalb des Forschungsteams weitergegeben  
- Vollständig anonym und nicht auf dich zurückführbar gespeichert

Zukünftige Forschungsprojekte am Geographischen Institut können anonymisierte Daten weiterverwenden.

## 7. Deine Rechte

Nach Schweizer Datenschutzrecht hast du das Recht:

- Klar über die Datenverarbeitung informiert zu werden  
- Deine Einwilligung jederzeit zu widerrufen  
- Deine Daten über die App zu löschen  
- Das Forschungsteam bei Fragen oder Anliegen zu kontaktieren

Wichtig: Da deine Daten vollständig anonymisiert sind, können einzelne Einträge weder eingesehen noch verändert werden.

## 8. Änderungen an dieser Richtlinie

Diese Datenschutzrichtlinie kann aktualisiert werden, wenn sich das Forschungsprojekt, die technische Infrastruktur oder rechtliche Vorgaben ändern. Alle Änderungen werden in der App veröffentlicht.

Diese Datenschutzrichtlinie wurde zuletzt am 11. Mai 2025 aktualisiert.'
);

-- Consent Screen - German
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'consent',
  'de',
  'Einwilligung',
  'Bevor Du mit der Befragung startest, bitten wir dich um deine Zustimmung zur Teilnahme an dieser Studie.

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

Weitere Informationen findest Du in unserer [Datenschutzrichtlinie](https://intermind.ch/privacy-policy.html).'
);

-- =============================
-- FRENCH TRANSLATIONS
-- =============================

-- About Screen - French
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'about',
  'fr',
  'À propos d''InterMind',
  '**InterMind** a été développée par Lukas Batschelet à l''Institut de géographie de l''Université de Berne. L''application fait partie d''un travail de bachelor supervisé par la prof. Dr Carolin Schurr et le Dr Moritz Gubler. Elle est utilisée exclusivement à des fins de recherche scientifique pour étudier comment notre environnement immédiat influence le bien-être momentané.

## Que signifie le bien-être ?

Le bien-être peut avoir de nombreuses significations. Il peut s''agir de quelque chose de durable – par exemple, de notre satisfaction générale dans la vie, de notre santé ou du sentiment de sécurité et de soutien dans la vie quotidienne.

Dans cette étude, nous nous intéressons principalement au **bien-être momentané** : Comment vous sentez-vous **à cet instant précis**, à cet endroit, dans cette situation ?

Le bien-être est compris de manière holistique – il englobe des aspects **physiques** (par exemple fatigue, chaleur, calme) et des ressentis **psychiques** (par exemple satisfaction, sécurité, appartenance). Ces impressions sont souvent éphémères et dépendent fortement du lieu, de l''activité en cours et de la manière dont nous sommes perçu·e·s.

## Pourquoi cette étude ?

La façon dont nous nous sentons dans un lieu dépend fortement de notre environnement. Certains lieux paraissent apaisants, familiers ou accueillants. D''autres peuvent provoquer un malaise ou un sentiment d''exclusion.

Mais ces expériences ne sont pas les mêmes pour tout le monde. Elles peuvent dépendre de la manière dont nous sommes perçu·e·s et traité·e·s – par exemple en fonction du genre, de l''origine, de la langue, de l''apparence ou d''autres caractéristiques liées à notre position sociale.

Nous cherchons à comprendre comment différentes caractéristiques – isolées ou combinées – influencent le bien-être momentané. Par exemple : Une jeune femme ayant une histoire migratoire ressent-elle un lieu public différemment qu''un homme plus âgé au même endroit et au même moment ?

Cette étude explore pourquoi les lieux affectent les personnes différemment. Elle vise à mieux comprendre comment se forment les sentiments d''appartenance, de sécurité ou d''exclusion – et en quoi ils sont liés à la vie quotidienne, aux catégorisations sociales et aux conditions de vie personnelles.

## Comment se déroule la participation ?

L''étude dure une semaine. Pendant cette période, vous serez invité·e trois fois par jour à répondre à une courte enquête sur votre smartphone. Chaque enquête porte sur :

* le lieu où vous vous trouvez  
* ce que vous y faites  
* ce que vous ressentez  
* et si vous vous y sentez à votre place ou non

Chaque enquête est disponible pendant une heure, puis elle expire automatiquement. Les moments sont répartis de manière légèrement aléatoire dans la journée.

Si vous manquez une enquête, ce n''est pas grave – vous pourrez simplement participer à la suivante.

## Licences

**Code source de l''application**  
Disponible sur [GitHub](https://github.com/lbatschelet/InterMind)  
Sous licence [GNU AGPL 3.0](https://www.gnu.org/licenses/agpl-3.0.html)

## Graphiques

Toutes les illustrations © 2025 Katerina Limpitsouni  
issues du projet open source [undraw.co](https://undraw.co)'
);

-- Privacy Policy Screen - French
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'privacy',
  'fr',
  'Politique de Confidentialité',
  'InterMind fait partie d''une étude scientifique menée à l''Institut de géographie de l''Université de Berne. L''application est utilisée dans le cadre d''un travail de bachelor réalisé par Lukas Batschelet, sous la supervision de la prof. Dr Carolin Schurr et du Dr Moritz Gubler.

La présente politique de confidentialité explique quelles données sont collectées, comment elles sont traitées et quels sont vos droits en tant que personne participante.

## 1. Qui est responsable ?

Le responsable du traitement des données est :

Institut de géographie  
Université de Berne  
Hallerstrasse 12  
3012 Berne, Suisse

Pour toute question ou remarque, veuillez contacter :  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. Quelles données sont collectées ?

Nous collectons les informations suivantes :

- Données démographiques, telles que l''âge et l''identité de genre  
- Réponses aux enquêtes sur vos émotions, pensées et environnement  
- Données de localisation (GPS) – collectées uniquement au moment de chaque enquête, jamais en continu

Nous ne collectons aucune information permettant de vous identifier personnellement. Aucun nom, numéro de téléphone, e-mail ou autre donnée similaire n''est enregistré.

## 3. Pourquoi collectons-nous ces données ?

Les données sont collectées exclusivement à des fins de recherche scientifique à l''Institut de géographie de l''Université de Berne. Elles nous aident à comprendre comment différentes personnes perçoivent leur environnement et comment ces perceptions influencent leur bien-être.

Vos données ne seront jamais utilisées à des fins commerciales.

## 4. Base légale

Cette étude est menée conformément à la Loi fédérale sur la protection des données (LPD / FADP). Le traitement des données est licite, proportionné et repose sur votre consentement éclairé.

## 5. Stockage et conservation des données

Vos données sont :

- Stockées de manière sécurisée sur un serveur situé actuellement à Zurich, Suisse  
- Hébergées par le fournisseur Supabase  
- Protégées par des mesures de cryptage et de contrôle d''accès  
- Entièrement anonymisées et non traçables  
- Conservées uniquement pendant la durée nécessaire à la recherche

Par défaut, vos données restent enregistrées jusqu''à ce que vous les supprimiez activement dans les paramètres de l''application. Une fois supprimées, elles ne peuvent plus être récupérées.

L''infrastructure d''hébergement peut être modifiée à l''avenir (p. ex. changement de fournisseur ou de lieu du serveur). Toute modification continuera de respecter la législation suisse sur la protection des données.

## 6. Qui peut accéder à vos données ?

Vos données sont :

- Utilisées exclusivement à des fins de recherche à l''Université de Berne  
- Non partagées avec des tiers extérieurs à l''équipe de recherche  
- Entièrement anonymes et non traçables

D''autres projets de recherche de l''Institut de géographie peuvent réutiliser ces données de manière anonymisée.

## 7. Vos droits

Conformément à la législation suisse sur la protection des données, vous avez le droit :

- De recevoir des informations claires sur le traitement de vos données  
- De retirer votre consentement à tout moment  
- De supprimer vos données via l''application  
- De contacter l''équipe de recherche pour toute question

Veuillez noter : comme vos données sont totalement anonymisées, nous ne pouvons ni consulter ni modifier des entrées individuelles.

## 8. Modifications de cette politique

Cette politique de confidentialité peut être mise à jour en fonction de l''évolution du projet, de l''infrastructure technique ou des exigences légales. Toute modification sera publiée dans l''application.

Cette politique de confidentialité a été mise à jour pour la dernière fois le 11 mai 2025.'
);

-- Consent Screen - French
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'consent',
  'fr',
  'Consentement à la participation', 'Avant de commencer l''enquête, nous te demandons ton accord pour participer à cette étude.

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

Tu trouveras plus d''informations dans notre [Politique de confidentialité](https://intermind.ch/privacy-policy.html).'
); 