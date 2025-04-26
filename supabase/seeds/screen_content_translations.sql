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
  '**InterMind** is a research app developed by Lukas Batschelet at the Institute of Geography, University of Bern. It collects data on wellbeing from an intersectional and spatial perspective. The app is part of a Bachelor''s thesis and is used exclusively for academic research.

## Licences

**App source code**  
Licensed under the GNU AGPL 3.0  
Available at: [github.com/lbatschelet/InterMind](https://github.com/lbatschelet/InterMind)

**Publications**  
Licensed under Creative Commons CC BY-SA-NC 4.0  
Available at: [intermind.ch](https://intermind.ch)

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
  '**InterMind** is a research app developed as part of a Bachelor''s thesis at the Institute of Geography, University of Bern. The project is supervised by Prof. Dr. Carolin Schurr and Dr. Moritz Gubler. This Privacy Policy explains what data we collect, how it is processed, and your rights as a participant.

## 1. Who Is Responsible?

The data controller is:

**Institute of Geography**  
University of Bern  
Hallerstrasse 12  
3012 Bern, Switzerland

For any questions or concerns, please contact:  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. What Data Is Collected?

We collect the following information:

- **Demographic data**, such as age and gender identity  
- **Survey responses** about your emotions, thoughts, and surroundings  
- **Location data** (GPS) — collected **only at the moment** of each survey entry, not continuously

We do **not** collect any personally identifying information. No name, phone number, email address or similar data is recorded.

## 3. Why Do We Collect This Data?

The data is collected exclusively for **scientific research** at the Institute of Geography, University of Bern. It helps us understand how different people experience urban space and how these experiences relate to wellbeing.

Your data will **never** be used for commercial purposes.

## 4. Legal Basis

This study is conducted in accordance with the **Swiss Federal Act on Data Protection (FADP / DSG)**. All data processing is lawful, proportional, and based on informed consent.

## 5. Data Storage and Retention

Your data is:

- Stored securely on a server **currently located in Zurich, Switzerland**
- Hosted by the provider **Supabase**
- Protected through encryption and access controls
- Fully **anonymised** and cannot be linked back to you
- Retained **only as long as necessary for the research purpose**

By default, your data remains stored **until you actively delete it** via the app settings. You may delete your data at any time. Once deleted, it cannot be recovered.

The current hosting setup may be adjusted in the future (e.g. provider or server location), but any such changes will continue to comply with Swiss data protection law and ensure the same level of data security and privacy.

## 6. Who Can Access Your Data?

Your data is:

- Used **exclusively** for research purposes at the University of Bern  
- **Not shared** with third parties outside the research team  
- Fully **anonymous** and cannot be traced back to you

Future research projects may reuse anonymized data within the Institute of Geography only.

## 7. Your Rights

Under Swiss data protection law, you have the right to:

- Receive clear information about data processing  
- Revoke your consent at any time  
- Delete your data using the in-app option  
- Contact the project team with questions or concerns

Please note: Since your data is completely anonymised, we cannot retrieve or modify individual entries.

## 8. Changes to This Policy

We may update this policy to reflect changes in the research project, infrastructure, or legal requirements. Any updates will be published in the app.

**This Privacy Policy was last updated on 17 April 2025.**
'
);

-- Consent Screen - English
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'consent',
  'en',
  'Consent',
  'As part of this study, we will ask you some questions—first about yourself (e.g. age, gender identity), and then about your feelings and your surrounding environment at different moments in your day. Your responses help us understand how different people experience urban spaces and how these experiences relate to wellbeing.

**Participation is voluntary**. You can skip any question by selecting "Prefer not to say." You can also delete all your data at any time via the app settings.

## What Data Will Be Collected?

- **Demographic data**, such as your age and gender identity  
- **Survey responses** about your emotions, thoughts, and surroundings  
- **Location data** via GPS (if you choose to allow it)

We do **not** collect your name, phone number, email address, or any other identifying information. Your responses are **completely anonymous** and **cannot be linked to you**.

## How Will Your Data Be Used?

Your data will be:

- Used for **academic research** on wellbeing and urban space
- Stored securely on a **password-protected server**
- **Not shared** with third parties
- **Anonymized** and **non-identifiable**
- Deletable by you at any time through the app

## Your Consent

By tapping **"I Agree"**, you confirm that:

- You understand the purpose of this study
- You agree to participate voluntarily
- You can withdraw at any time by deleting your data in the app settings

Please read our [Privacy Policy](https://intermind.ch/privacy-policy.html) for more details.'
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
  '**InterMind** ist eine Forschungs-App, die von Lukas Batschelet am Institut für Geographie der Universität Bern entwickelt wurde. Sie sammelt Daten zum Wohlbefinden aus einer intersektionalen und räumlichen Perspektive. Die App ist Teil einer Bachelorarbeit und wird ausschließlich für akademische Forschung verwendet.

## Lizenzen

**App-Quellcode**  
Lizenziert unter GNU AGPL 3.0  
Verfügbar unter: [github.com/lbatschelet/InterMind](https://github.com/lbatschelet/InterMind)

**Publikationen**  
Lizenziert unter Creative Commons CC BY-SA-NC 4.0  
Verfügbar unter: [intermind.ch](https://intermind.ch)

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
  '**InterMind** ist eine Forschungs-App, die im Rahmen einer Bachelorarbeit am Institut für Geographie der Universität Bern entwickelt wurde. Das Projekt wird von Prof. Dr. Carolin Schurr und Dr. Moritz Gubler betreut. Diese Datenschutzerklärung erläutert, welche Daten wir erheben, wie sie verarbeitet werden und welche Rechte Sie als Teilnehmer haben.

## 1. Wer ist verantwortlich?

Verantwortlich für die Datenverarbeitung ist:

**Institut für Geographie**  
Universität Bern  
Hallerstrasse 12  
3012 Bern, Schweiz

Bei Fragen oder Anliegen kontaktieren Sie bitte:  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. Welche Daten werden erhoben?

Wir erheben folgende Informationen:

- **Demografische Daten** wie Alter und Geschlechtsidentität  
- **Umfrageantworten** zu Ihren Emotionen, Gedanken und Ihrer Umgebung  
- **Standortdaten** (GPS) — werden **nur zum Zeitpunkt** jeder Umfrageeingabe erfasst, nicht kontinuierlich

Wir erheben **keine** persönlich identifizierenden Informationen. Name, Telefonnummer, E-Mail-Adresse oder ähnliche Daten werden nicht erfasst.

## 3. Warum erheben wir diese Daten?

Die Daten werden ausschließlich für **wissenschaftliche Forschung** am Institut für Geographie der Universität Bern erhoben. Sie helfen uns zu verstehen, wie verschiedene Menschen den städtischen Raum erleben und wie diese Erfahrungen mit dem Wohlbefinden zusammenhängen.

Ihre Daten werden **niemals** für kommerzielle Zwecke verwendet.

## 4. Rechtsgrundlage

Diese Studie wird in Übereinstimmung mit dem **Schweizerischen Bundesgesetz über den Datenschutz (DSG)** durchgeführt. Alle Datenverarbeitungen sind rechtmäßig, verhältnismäßig und basieren auf einer informierten Einwilligung.

## 5. Datenspeicherung und -aufbewahrung

Ihre Daten werden:

- Sicher auf einem Server gespeichert, der sich **derzeit in Zürich, Schweiz** befindet
- Beim Anbieter **Supabase** gehostet
- Durch Verschlüsselung und Zugriffskontrollen geschützt
- Vollständig **anonymisiert** und können nicht auf Sie zurückgeführt werden
- **Nur so lange aufbewahrt, wie für den Forschungszweck nötig**

Standardmäßig bleiben Ihre Daten gespeichert, **bis Sie sie aktiv über die App-Einstellungen löschen**. Sie können Ihre Daten jederzeit löschen. Einmal gelöscht, können sie nicht wiederhergestellt werden.

Die aktuelle Hosting-Konfiguration kann in Zukunft angepasst werden (z.B. Anbieter oder Serverstandort), aber solche Änderungen werden weiterhin dem Schweizer Datenschutzrecht entsprechen und dasselbe Niveau an Datensicherheit und Datenschutz gewährleisten.

## 6. Wer kann auf Ihre Daten zugreifen?

Ihre Daten werden:

- **Ausschließlich** für Forschungszwecke an der Universität Bern verwendet  
- **Nicht an Dritte** außerhalb des Forschungsteams weitergegeben  
- Vollständig **anonym** gehalten und können nicht auf Sie zurückgeführt werden

Zukünftige Forschungsprojekte dürfen anonymisierte Daten nur innerhalb des Instituts für Geographie wiederverwenden.

## 7. Ihre Rechte

Nach Schweizer Datenschutzrecht haben Sie das Recht:

- Klare Informationen über die Datenverarbeitung zu erhalten  
- Ihre Einwilligung jederzeit zu widerrufen  
- Ihre Daten über die In-App-Option zu löschen  
- Das Projektteam bei Fragen oder Bedenken zu kontaktieren

Bitte beachten Sie: Da Ihre Daten vollständig anonymisiert sind, können wir einzelne Einträge nicht abrufen oder ändern.

## 8. Änderungen dieser Erklärung

Wir können diese Erklärung aktualisieren, um Änderungen im Forschungsprojekt, in der Infrastruktur oder in den rechtlichen Anforderungen widerzuspiegeln. Alle Aktualisierungen werden in der App veröffentlicht.

**Diese Datenschutzerklärung wurde zuletzt am 17. April 2025 aktualisiert.**
'
);

-- Consent Screen - German
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'consent',
  'de',
  'Einwilligung',
  'Im Rahmen dieser Studie stellen wir dir einige Fragen – zunächst über dich selbst (z.B. Alter, Geschlechtsidentität) und dann über deine Gefühle und deine Umgebung zu verschiedenen Zeitpunkten deines Tages. Deine Antworten helfen uns zu verstehen, wie verschiedene Menschen städtische Räume erleben und wie diese Erfahrungen mit dem Wohlbefinden zusammenhängen.

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

Bitte lies unsere [Datenschutzrichtlinie](https://intermind.ch/privacy-policy.html) für weitere Details.'
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
  '**InterMind** est une application de recherche développée par Lukas Batschelet à l''Institut de Géographie de l''Université de Berne. Elle collecte des données sur le bien-être dans une perspective intersectionnelle et spatiale. L''application fait partie d''une thèse de bachelor et est utilisée exclusivement pour la recherche académique.

## Licences

**Code source de l''application**  
Sous licence GNU AGPL 3.0  
Disponible sur: [github.com/lbatschelet/InterMind](https://github.com/lbatschelet/InterMind)

**Publications**  
Sous licence Creative Commons CC BY-SA-NC 4.0  
Disponible sur: [intermind.ch](https://intermind.ch)

## Graphiques

Toutes les illustrations © 2025 Katerina Limpitsouni  
du projet open source [undraw.co](https://undraw.co)'
);

-- Privacy Policy Screen - French
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'privacy',
  'fr',
  'Politique de Confidentialité',
  '**InterMind** est une application de recherche développée dans le cadre d''une thèse de bachelor à l''Institut de Géographie de l''Université de Berne. Le projet est supervisé par Prof. Dr. Carolin Schurr et Dr. Moritz Gubler. Cette politique de confidentialité explique quelles données nous collectons, comment elles sont traitées et quels sont vos droits en tant que participant.

## 1. Qui est responsable?

Le responsable du traitement des données est:

**Institut de Géographie**  
Université de Berne  
Hallerstrasse 12  
3012 Berne, Suisse

Pour toute question ou préoccupation, veuillez contacter:  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. Quelles données sont collectées?

Nous collectons les informations suivantes:

- **Données démographiques**, comme l''âge et l''identité de genre  
- **Réponses aux enquêtes** concernant vos émotions, pensées et environnements  
- **Données de localisation** via GPS (si vous choisissez de l''autoriser)

Nous ne collectons **pas** votre nom, numéro de téléphone, adresse e-mail ou toute autre information permettant de vous identifier. Vos réponses sont **complètement anonymes** et **ne peuvent pas être liées à vous**.

## 3. Pourquoi collectons-nous ces données?

Les données sont collectées exclusivement pour la **recherche scientifique** à l''Institut de Géographie de l''Université de Berne. Elles nous aident à comprendre comment différentes personnes vivent l''espace urbain et comment ces expériences sont liées au bien-être.

Vos données ne seront **jamais** utilisées à des fins commerciales.

## 4. Base légale

Cette étude est menée conformément à la **Loi fédérale suisse sur la protection des données (LPD / DSG)**. Tout traitement de données est légal, proportionnel et basé sur un consentement éclairé.

## 5. Stockage et conservation des données

Vos données sont:

- Stockées en toute sécurité sur un serveur **actuellement situé à Zurich, Suisse**
- Hébergées par le fournisseur **Supabase**
- Protégées par cryptage et contrôles d''accès
- Entièrement **anonymisées** et ne peuvent pas être reliées à vous
- Conservées **uniquement aussi longtemps que nécessaire pour la recherche**

Par défaut, vos données restent stockées **jusqu''à ce que vous les supprimiez activement** via les paramètres de l''application. Vous pouvez supprimer vos données à tout moment. Une fois supprimées, elles ne peuvent pas être récupérées.

La configuration d''hébergement actuelle peut être ajustée à l''avenir (par exemple, fournisseur ou emplacement du serveur), mais ces changements continueront à se conformer à la loi suisse sur la protection des données et à assurer le même niveau de sécurité et de confidentialité des données.

## 6. Qui peut accéder à vos données?

Vos données sont:

- Utilisées **exclusivement** à des fins de recherche à l''Université de Berne  
- **Non partagées** avec des tiers en dehors de l''équipe de recherche  
- Entièrement **anonymes** et ne peuvent pas être retracées jusqu''à vous

Les futurs projets de recherche peuvent réutiliser les données anonymisées uniquement au sein de l''Institut de Géographie.

## 7. Vos droits

Selon la loi suisse sur la protection des données, vous avez le droit de:

- Recevoir des informations claires sur le traitement des données  
- Révoquer votre consentement à tout moment  
- Supprimer vos données à l''aide de l''option dans l''application  
- Contacter l''équipe du projet pour toute question ou préoccupation

Veuillez noter: Comme vos données sont complètement anonymisées, nous ne pouvons pas récupérer ou modifier des entrées individuelles.

## 8. Modifications de cette politique

Nous pouvons mettre à jour cette politique pour refléter des changements dans le projet de recherche, l''infrastructure ou les exigences légales. Toutes les mises à jour seront publiées dans l''application.

**Cette politique de confidentialité a été mise à jour pour la dernière fois le 17 avril 2025.**
'
);

-- Consent Screen - French
INSERT INTO screen_content_translations (content_id, language, title, content)
VALUES (
  'consent',
  'fr',
  'Consentement',
  'Dans le cadre de cette étude, nous vous poserons quelques questions—d''abord sur vous-même (par exemple, âge, identité de genre), puis sur vos sentiments et votre environnement à différents moments de votre journée. Vos réponses nous aident à comprendre comment différentes personnes vivent les espaces urbains et comment ces expériences sont liées au bien-être.

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

Veuillez lire notre [politique de confidentialité](https://intermind.ch/privacy-policy.html) pour plus de détails.'
); 