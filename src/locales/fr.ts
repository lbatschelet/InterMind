import { TranslationKeys } from './index';

const fr: TranslationKeys = {
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
    retry: "Réessayer",
    reset: "Réinitialiser",
    confirmation: "Confirmation",
    warning: "Avertissement",
    understand: "Je comprends",
    tryAgain: "Réessayer",
    noDataAvailable: "Aucune donnée disponible",
    unexpectedError: "Une erreur inattendue s'est produite",
    ok: "OK"
  },
  settings: {
    title: "Paramètres",
    language: "Langue",
    languageSelection: "Sélection de la langue",
    showDeviceId: "Afficher l'ID du dispositif",
    privacyPolicy: "Politique de confidentialité",
    about: "À propos",
    deleteAllData: "Supprimer toutes les données",
    deleteConfirmTitle: "Supprimer toutes les données ?",
    deleteConfirmText: "Cette action est irréversible. Toutes les données d'enquête collectées seront définitivement supprimées de nos serveurs et de votre appareil.",
    deleteSuccess: "Données supprimées",
    deleteError: "Erreur lors de la suppression des données",
    notifications: "Notifications",
    deleteData: "Supprimer mes données",
    resetQuestions: "Réinitialiser les questions répondues",
    dataManagement: "Gestion des données",
    generalSettings: "Général",
    advancedSettings: "Avancé",
    appearance: "Apparence",
    debug: "Fonctions de débogage",
    consent: "Consentement"
  },
  home: {
    title: "InterMind",
    welcome: "Bienvenue sur InterMind!",
    startSurvey: "Commencer le sondage",
    surveyAvailable: "Un sondage est disponible maintenant! Vous avez une heure pour le compléter.",
    surveyNotAvailable: "Sondage non disponible",
    nextSurveyIn: "Prochain sondage dans",
    nextSurveyAt: "Prochain sondage à",
    tomorrow: "Prochain sondage demain à",
    hours: "heures",
    minutes: "minutes",
    noUpcomingSurvey: "Aucun sondage planifié",
    unavailable: "Aucun sondage disponible actuellement"
  },
  survey: {
    deviceId: "ID du dispositif",
    deviceIdDesc: "Cet ID est généré à partir de votre appareil et utilisé pour la collecte de données pseudonymisées.",
    copyDeviceId: "Copier l'ID",
    back: "Retour",
    next: "Suivant",
    submit: "Soumettre",
    exitTitle: "Quitter le sondage?",
    exitMessage: "Votre progression sera perdue si vous quittez maintenant.",
    continueSurvey: "Continuer le sondage",
    exitSurvey: "Quitter le sondage",
    complete: "Sondage terminé",
    completeMessage: "Merci d'avoir complété ce sondage!",
    errorSubmitting: "Erreur lors de la soumission du sondage",
    errorLoading: "Erreur lors du chargement du sondage",
    dataDeleteConfirm: "Êtes-vous sûr de vouloir supprimer toutes les données du sondage?",
    dataDeleteSuccess: "Toutes les données du sondage ont été supprimées",
    dataDeleteError: "Erreur lors de la suppression des données du sondage",
    optional: "Optionnel",
    start: "Commencer le sondage",
    title: "Sondage"
  },
  notifications: {
    title: "Un nouveau sondage vous attend.",
    body: "Vous avez une heure pour le compléter.",
    permission: "Veuillez activer les notifications pour recevoir des rappels de sondage.",
    permissionDenied: "Les notifications sont désactivées. Vous pouvez les activer dans les paramètres de l'appareil."
  },
  permissions: {
    allowNotifications: "Autoriser les notifications",
    allowLocation: "Autoriser l'accès à la localisation",
    denyNotifications: "Pas maintenant",
    denyLocation: "Pas maintenant"
  },
  about: {
    title: "À propos d'InterMind",
    version: "Version",
    description: "InterMind est une application de recherche conçue pour comprendre comment les environnements urbains affectent le bien-être.",
    contact: "Contact",
    team: "Équipe",
    license: "Licence",
    thankYou: "Merci de participer à notre recherche!",
    content: `**InterMind** est une application de recherche développée par Lukas Batschelet à l'Institut de géographie de l'Université de Berne. Elle collecte des données sur le bien-être dans une perspective intersectionnelle et spatiale. L'application fait partie d'un travail de Bachelor et est utilisée exclusivement à des fins de recherche académique.

## Licences

**Code source de l'application**  
Sous licence GNU AGPL 3.0  
Disponible sur : [github.com/lbatschelet/InterMind](https://github.com/lbatschelet/InterMind)

**Publications**  
Sous licence Creative Commons CC BY-SA-NC 4.0  
Disponible sur : [intermind.ch](https://intermind.ch)

## Graphiques

Toutes les illustrations © 2025 Katerina Limpitsouni  
du projet open source [undraw.co](https://undraw.co)

## Version
Version: 0.2.3
`
  },
  privacy: {
    title: "Politique de confidentialité",
    content: `**InterMind** est une application de recherche développée dans le cadre d'un travail de Bachelor à l'Institut de géographie de l'Université de Berne. Le projet est supervisé par la Prof. Dr Carolin Schurr et le Dr Moritz Gubler. Cette politique de confidentialité explique quelles données sont collectées, comment elles sont traitées et quels sont vos droits en tant que participant·e.

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

- **Données démographiques**, telles que l'âge et l'identité de genre  
- **Réponses aux questionnaires** concernant vos émotions, pensées et votre environnement  
- **Données de localisation** (GPS), **uniquement au moment de chaque réponse**, et non de manière continue

Nous **ne collectons pas** d'informations permettant de vous identifier personnellement (nom, numéro de téléphone, adresse e-mail, etc.).

## 3. Finalité de la collecte

Les données sont collectées **uniquement à des fins de recherche scientifique** au sein de l'Institut de géographie de l'Université de Berne. Elles nous aident à mieux comprendre comment différentes personnes perçoivent l'espace urbain et comment cela influence leur bien-être.

Les données **ne seront jamais utilisées à des fins commerciales**.

## 4. Base légale

Le traitement des données est effectué conformément à la **Loi fédérale sur la protection des données (LPD / FADP)**. Le traitement est légal, proportionné et repose sur votre **consentement éclairé**.

## 5. Stockage et durée de conservation

Vos données sont :

- Stockées en toute sécurité sur un serveur situé **actuellement à Zurich, en Suisse**
- Hébergées par le prestataire **Supabase**
- Protégées par des mécanismes de chiffrement et de contrôle d'accès
- **Anonymisées**, donc non identifiables
- Conservées **aussi longtemps que nécessaire aux fins de recherche**

Par défaut, vos données sont conservées **jusqu'à ce que vous les supprimiez activement** via les paramètres de l'application. La suppression est immédiate et irréversible.

Le lieu de stockage et le fournisseur peuvent être modifiés à l'avenir. Toute modification respectera les exigences de la LPD en matière de sécurité et de confidentialité.


## 6. Accès aux données

Vos données :

- Sont utilisées **exclusivement** à des fins de recherche à l'Université de Berne  
- **Ne sont pas transmises** à des tiers en dehors de l'équipe de recherche  
- Sont traitées de manière **anonyme** et **non traçable**

Les données anonymisées peuvent être réutilisées dans le cadre de futurs projets de recherche au sein de l'Institut.

## 7. Vos droits

Conformément à la LPD, vous avez le droit :

- D'être informé·e de manière transparente sur le traitement de vos données  
- De retirer votre consentement à tout moment  
- De supprimer vos données via les paramètres de l'application  
- De nous contacter pour toute question ou remarque

Note : comme vos données sont entièrement anonymisées, il n'est pas possible de vous fournir des informations personnelles ou de corriger vos données.

## 8. Modifications de la politique de confidentialité

Cette politique pourra être mise à jour en fonction de l'évolution du projet, des infrastructures techniques ou du cadre légal. La version à jour est toujours accessible dans l'application.


**Dernière mise à jour : 17 avril 2025**
`
  },
  languages: {
    en: "Anglais",
    de: "Allemand",
    fr: "Français"
  },
  validation: {
    required: "Ce champ est obligatoire",
    invalidEmail: "Veuillez entrer une adresse e-mail valide",
    invalidNumber: "Veuillez entrer un nombre valide"
  },
  errors: {
    connectionError: "Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.",
    serverError: "Erreur du serveur. Veuillez réessayer plus tard.",
    permissionDenied: "Permission refusée",
    notFound: "Non trouvé",
    unknownError: "Erreur inconnue"
  },
  consent: {
    title: "Consentement",
    content: `Dans le cadre de cette étude, nous vous poserons quelques questions—d''abord sur vous-même (par exemple, âge, identité de genre), puis sur vos sentiments et votre environnement à différents moments de votre journée. Vos réponses nous aident à comprendre comment différentes personnes vivent les espaces urbains et comment ces expériences sont liées au bien-être.

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

Veuillez lire notre [politique de confidentialité](https://intermind.ch/privacy-policy.html) pour plus de détails.`
  }
};

export default fr; 