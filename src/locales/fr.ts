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
    ok: "OK",
    goBack: "Retour"
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
    title: "Sondage",
    loading: "Chargement...",
    loadingDescription: "Veuillez patienter pendant que nous préparons vos questions de sondage...",
    textInputPlaceholder: "Entrez votre réponse..."
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
    content: ""
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
    connectionErrorMessage: "Veuillez vérifier votre connexion internet et réessayer.",
    connectionError: "Erreur de connexion",
    serverError: "Erreur du serveur. Veuillez réessayer plus tard.",
    permissionDenied: "Permission refusée",
    notFound: "Non trouvé",
    unknownError: "Erreur inconnue",
    contentNotFound: "Contenu non trouvé",
    contentLoadFailed: "Impossible de charger le contenu du serveur. Veuillez réessayer plus tard."
  },
  consent: {
    title: "Consentement",
    content: ""
  },
  privacy: {
    title: "Politique de confidentialité",
    content: ""
  },
  thankyou: {
    title: "Merci !",
    message: "Merci de votre participation à notre étude ! Toutes les périodes d'enquête sont terminées. Nous apprécions vos précieuses contributions à notre recherche."
  }
};

export default fr; 