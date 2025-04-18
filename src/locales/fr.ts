export default {
  general: {
    agree: "J'accepte",
    continue: "Continuer",
    cancel: "Annuler",
    close: "Fermer",
    save: "Enregistrer",
    delete: "Supprimer",
    yes: "Oui",
    no: "Non",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
  },
  settings: {
    title: "Paramètres",
    language: "Langue",
    languageSelection: "Sélection de la langue",
    showUserId: "Afficher l'ID utilisateur",
    privacyPolicy: "Politique de confidentialité",
    about: "À propos",
    deleteAllData: "Supprimer toutes les données",
    deleteConfirmTitle: "Supprimer toutes les données ?",
    deleteConfirmText: "Cette action est irréversible. Toutes les données d'enquête collectées seront définitivement supprimées.",
    deleteSuccess: "Données supprimées",
    deleteError: "Erreur lors de la suppression des données",
  },
  home: {
    title: "InterMind",
    startSurvey: "Démarrer l'enquête",
    surveyAvailable: "Une enquête est disponible maintenant ! Vous avez une heure pour la compléter.",
    surveyNotAvailable: "Enquête non disponible",
    nextSurveyIn: "Prochaine enquête dans",
    nextSurveyAt: "Prochaine enquête à",
    tomorrow: "Prochaine enquête demain à",
    hours: "heures",
    minutes: "minutes",
  },
  survey: {
    userId: "ID utilisateur",
    userIdDesc: "Cet ID est généré à partir de votre appareil et utilisé pour la collecte de données pseudonymisées.",
    copyId: "Copier l'ID",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre",
    exitTitle: "Quitter l'enquête ?",
    exitMessage: "Votre progression sera sauvegardée, mais vous quitterez l'enquête. Êtes-vous sûr de vouloir quitter ?",
    continueSurvey: "Continuer l'enquête",
    exitSurvey: "Quitter l'enquête",
  },
  notifications: {
    title: "Une nouvelle enquête est disponible.",
    body: "Vous avez une heure pour la compléter.",
    permission: "Veuillez activer les notifications pour recevoir des rappels d'enquêtes.",
    permissionDenied: "Les notifications sont désactivées. Vous pouvez les activer dans les paramètres de votre appareil.",
  },
  about: {
    title: "À propos",
    content: `**InterMind** est une application de recherche développée par Lukas Batschelet à l’Institut de géographie de l’Université de Berne. Elle permet de collecter des données sur le bien-être dans une perspective intersectionnelle et spatiale. L’application fait partie d’un travail de bachelor et est utilisée exclusivement à des fins scientifiques.

## Licences

**Code source de l’application**  
Sous licence GNU AGPL 3.0  
Disponible sur : [github.com/lbatschelet/InterMind](https://github.com/lbatschelet/InterMind)

**Publications**  
Sous licence Creative Commons CC BY-SA-NC 4.0  
Disponible sur : [intermind.ch](https://intermind.ch)

## Illustrations

Toutes les illustrations © 2025 Katerina Limpitsouni  
du projet open source [undraw.co](https://undraw.co)

## Version
Version: 0.1.0
`
  },
  privacy: {
    title: "Politique de confidentialité",
    content: `**InterMind** est une application de recherche développée dans le cadre d’un travail de Bachelor à l’Institut de géographie de l’Université de Berne. Le projet est supervisé par la Prof. Dr Carolin Schurr et le Dr Moritz Gubler. Cette politique de confidentialité explique quelles données sont collectées, comment elles sont traitées et quels sont vos droits en tant que participant·e.

## 1. Responsable du traitement

Le responsable du traitement est :

**Institut de géographie**  
Université de Berne  
Hallerstrasse 12  
3012 Berne, Suisse

Pour toute question ou remarque :  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. Données collectées

Nous collectons les données suivantes :

- **Données démographiques**, telles que l’âge et l’identité de genre  
- **Réponses aux questionnaires** concernant vos émotions, pensées et votre environnement  
- **Données de localisation** (GPS), **uniquement au moment de chaque réponse**, et non de manière continue

Nous **ne collectons pas** d’informations permettant de vous identifier personnellement (nom, numéro de téléphone, adresse e-mail, etc.).

## 3. Finalité de la collecte

Les données sont collectées **uniquement à des fins de recherche scientifique** au sein de l’Institut de géographie de l’Université de Berne. Elles nous aident à mieux comprendre comment différentes personnes perçoivent l’espace urbain et comment cela influence leur bien-être.

Les données **ne seront jamais utilisées à des fins commerciales**.

## 4. Base légale

Le traitement des données est effectué conformément à la **Loi fédérale sur la protection des données (LPD / FADP)**. Le traitement est légal, proportionné et repose sur votre **consentement éclairé**.

## 5. Stockage et durée de conservation

Vos données sont :

- Stockées en toute sécurité sur un serveur situé **actuellement à Zurich, en Suisse**
- Hébergées par le prestataire **Supabase**
- Protégées par des mécanismes de chiffrement et de contrôle d’accès
- **Anonymisées**, donc non identifiables
- Conservées **aussi longtemps que nécessaire aux fins de recherche**

Par défaut, vos données sont conservées **jusqu’à ce que vous les supprimiez activement** via les paramètres de l’application. La suppression est immédiate et irréversible.

Le lieu de stockage et le fournisseur peuvent être modifiés à l’avenir. Toute modification respectera les exigences de la LPD en matière de sécurité et de confidentialité.


## 6. Accès aux données

Vos données :

- Sont utilisées **exclusivement** à des fins de recherche à l’Université de Berne  
- **Ne sont pas transmises** à des tiers en dehors de l’équipe de recherche  
- Sont traitées de manière **anonyme** et **non traçable**

Les données anonymisées peuvent être réutilisées dans le cadre de futurs projets de recherche au sein de l’Institut.

## 7. Vos droits

Conformément à la LPD, vous avez le droit :

- D’être informé·e de manière transparente sur le traitement de vos données  
- De retirer votre consentement à tout moment  
- De supprimer vos données via les paramètres de l’application  
- De nous contacter pour toute question ou remarque

Note : comme vos données sont entièrement anonymisées, il n’est pas possible de vous fournir des informations personnelles ou de corriger vos données.

## 8. Modifications de la politique de confidentialité

Cette politique pourra être mise à jour en fonction de l’évolution du projet, des infrastructures techniques ou du cadre légal. La version à jour est toujours accessible dans l’application.


**Dernière mise à jour : 17 avril 2025**
`
  }
}; 