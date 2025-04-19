import { TranslationKeys } from './index';

const de: TranslationKeys = {
  general: {
    agree: "Ich stimme zu",
    continue: "Weiter",
    cancel: "Abbrechen",
    close: "Schließen",
    save: "Speichern",
    delete: "Löschen",
    yes: "Ja",
    no: "Nein",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolg",
    retry: "Wiederholen",
    reset: "Zurücksetzen",
    confirmation: "Bestätigung",
    warning: "Warnung",
    understand: "Ich verstehe",
    tryAgain: "Erneut versuchen",
    noDataAvailable: "Keine Daten verfügbar",
    unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
    ok: "OK"
  },
  settings: {
    title: "Einstellungen",
    language: "Sprache",
    languageSelection: "Sprachauswahl",
    showDeviceId: "Geräte-ID anzeigen",
    privacyPolicy: "Datenschutzrichtlinie",
    about: "Über",
    deleteAllData: "Alle Daten löschen",
    deleteConfirmTitle: "Alle Daten löschen?",
    deleteConfirmText: "Diese Aktion ist unwiderruflich. Alle gesammelten Umfragedaten werden dauerhaft von unseren Servern und deinem Gerät gelöscht.",
    deleteSuccess: "Daten gelöscht",
    deleteError: "Fehler beim Löschen der Daten",
    notifications: "Benachrichtigungen",
    deleteData: "Meine Daten löschen",
    resetQuestions: "Beantwortete Fragen zurücksetzen",
    dataManagement: "Datenverwaltung",
    generalSettings: "Allgemein",
    advancedSettings: "Erweitert",
    appearance: "Erscheinungsbild",
    debug: "Debug-Funktionen",
    consent: "Einwilligung"
  },
  home: {
    title: "InterMind",
    welcome: "Willkommen bei InterMind!",
    startSurvey: "Umfrage starten",
    surveyAvailable: "Eine Umfrage ist jetzt verfügbar! Du hast eine Stunde Zeit zum Ausfüllen.",
    surveyNotAvailable: "Umfrage nicht verfügbar",
    nextSurveyIn: "Nächste Umfrage in",
    nextSurveyAt: "Nächste Umfrage um",
    tomorrow: "Nächste Umfrage morgen um",
    hours: "Stunden",
    minutes: "Minuten",
    noUpcomingSurvey: "Keine Umfrage geplant",
    unavailable: "Derzeit keine Umfrage verfügbar"
  },
  survey: {
    deviceId: "Geräte-ID",
    deviceIdDesc: "Diese ID wird von Ihrem Gerät generiert und für pseudonymisierte Datenerfassung verwendet.",
    copyDeviceId: "ID kopieren",
    back: "Zurück",
    next: "Weiter",
    submit: "Absenden",
    exitTitle: "Umfrage verlassen?",
    exitMessage: "Dein Fortschritt geht verloren, wenn du jetzt gehst.",
    continueSurvey: "Umfrage fortsetzen",
    exitSurvey: "Umfrage verlassen",
    complete: "Umfrage abgeschlossen",
    completeMessage: "Vielen Dank für das Ausfüllen dieser Umfrage!",
    errorSubmitting: "Fehler beim Absenden der Umfrage",
    errorLoading: "Fehler beim Laden der Umfrage",
    dataDeleteConfirm: "Möchtest du wirklich alle Umfragedaten löschen?",
    dataDeleteSuccess: "Alle Umfragedaten wurden gelöscht",
    dataDeleteError: "Fehler beim Löschen der Umfragedaten",
    optional: "Optional",
    start: "Umfrage starten",
    title: "Umfrage"
  },
  notifications: {
    title: "Eine neue Umfrage wartet auf dich.",
    body: "Du hast eine Stunde Zeit zum Ausfüllen.",
    permission: "Bitte aktiviere Benachrichtigungen, um Umfrage-Erinnerungen zu erhalten.",
    permissionDenied: "Benachrichtigungen sind deaktiviert. Du kannst sie in den Geräteeinstellungen aktivieren.",
  },
  about: {
    title: "Über InterMind",
    version: "Version",
    description: "InterMind ist eine Forschungs-App zur Untersuchung des Einflusses städtischer Umgebungen auf das Wohlbefinden.",
    contact: "Kontakt",
    team: "Team",
    license: "Lizenz",
    thankYou: "Vielen Dank für deine Teilnahme an unserer Forschung!",
    content: `**InterMind** ist eine Forschungs-App, die von Lukas Batschelet am Geographischen Institut der Universität Bern entwickelt wurde. Sie dient der Erhebung von Wohlbefinden aus einer intersektionalen und raumbezogenen Perspektive. Die App ist Teil einer Bachelorarbeit und wird ausschliesslich zu wissenschaftlichen Zwecken eingesetzt.

## Lizenzen

**App-Quellcode**  
Lizenziert unter der GNU AGPL 3.0  
Verfügbar unter: [github.com/lbatschelet/InterMind](https://github.com/lbatschelet/InterMind)

**Veröffentlichungen**  
Lizenziert unter Creative Commons CC BY-SA-NC 4.0  
Verfügbar unter: [intermind.ch](https://intermind.ch)

## Grafiken

Alle Illustrationen © 2025 Katerina Limpitsouni  
aus dem Open-Source-Projekt [undraw.co](https://undraw.co)

## Version

App-Version: 0.2.5
`
  },
  privacy: {
    title: "Datenschutzrichtlinie",
    content: `**InterMind** ist eine Forschungs-App, die im Rahmen einer Bachelorarbeit am Geographischen Institut der Universität Bern entwickelt wurde. Das Projekt wird betreut von Prof. Dr. Carolin Schurr und Dr. Moritz Gubler. Diese Datenschutzerklärung erläutert, welche Daten erhoben werden, wie sie verarbeitet werden und welche Rechte Sie als teilnehmende Person haben.


## 1. Verantwortliche Stelle

Verantwortlich für die Datenbearbeitung ist:

**Geographisches Institut**  
Universität Bern  
Hallerstrasse 12  
3012 Bern, Schweiz

Bei Fragen oder Anliegen wenden Sie sich bitte an:  
[lukas.batschelet@unibe.ch](mailto:lukas.batschelet@unibe.ch)

## 2. Welche Daten werden erhoben?

Wir erfassen folgende Informationen:

- **Demografische Angaben**, wie Alter und Geschlechtsidentität  
- **Antworten auf Umfragen** zu Ihrem Wohlbefinden, Ihren Gedanken und Ihrer Umgebung  
- **Standortdaten** (per GPS), jedoch **nur im Moment der Umfrage**, nicht dauerhaft oder im Hintergrund

Wir erfassen **keine** Daten, die Rückschlüsse auf Ihre Identität erlauben (z. B. Name, Telefonnummer, E-Mail-Adresse).

## 3. Zweck der Datenerhebung

Die Daten werden **ausschliesslich zu wissenschaftlichen Forschungszwecken** am Geographischen Institut der Universität Bern erhoben. Sie helfen uns zu verstehen, wie Menschen Stadträume wahrnehmen und wie diese Wahrnehmungen mit dem Wohlbefinden zusammenhängen.

Die Daten werden **nicht kommerziell genutzt**.

## 4. Rechtliche Grundlage

Die Datenverarbeitung erfolgt gemäss dem **Bundesgesetz über den Datenschutz (DSG)**. Die Bearbeitung ist rechtmässig, verhältnismässig und erfolgt auf Grundlage Ihrer freiwilligen Einwilligung.

## 5. Speicherung und Aufbewahrung

Ihre Daten werden:

- Sicher gespeichert auf einem Server mit **aktuellem Standort in Zürich, Schweiz**
- Gehostet durch den Anbieter **Supabase**
- Durch Verschlüsselung und Zugriffskontrollen geschützt
- **Anonymisiert**, sodass kein Rückschluss auf Ihre Person möglich ist
- **Nur so lange aufbewahrt, wie sie für den Forschungszweck notwendig sind**

Standardmässig bleiben Ihre Daten gespeichert, **bis Sie sie aktiv in den App-Einstellungen löschen**. Die Löschung erfolgt sofort und unwiderruflich.

Der aktuelle Serverstandort und Anbieter können zukünftig angepasst werden. In jedem Fall wird weiterhin der Schutz Ihrer Daten gemäss dem DSG gewährleistet.

## 6. Wer hat Zugriff auf die Daten?

Ihre Daten werden:

- **Nur** innerhalb des Forschungsteams der Universität Bern verwendet  
- **Nicht an Dritte** ausserhalb des Instituts weitergegeben  
- **Anonym** analysiert und **nicht rückverfolgbar** gespeichert

Eine Wiederverwendung anonymisierter Daten für zukünftige Forschungsprojekte am Institut ist möglich.

## 7. Ihre Rechte

Gemäss dem DSG haben Sie das Recht:

- Klar informiert zu werden, wie Ihre Daten verarbeitet werden  
- Ihre Einwilligung jederzeit zu widerrufen  
- Ihre Daten über die App-Einstellungen vollständig zu löschen  
- Uns bei Fragen oder Beschwerden zu kontaktieren

Da die Daten vollständig anonymisiert sind, können wir Ihnen keine personenbezogenen Auskünfte oder Korrekturen anbieten.

## 8. Änderungen dieser Datenschutzerklärung

Diese Datenschutzerklärung kann bei Änderungen im Projekt, der Infrastruktur oder der Gesetzeslage angepasst werden. Die jeweils aktuelle Version ist in der App einsehbar.

Letzte Aktualisierung: 17. April 2025
`
  },
  permissions: {
    allowNotifications: "Benachrichtigungen erlauben",
    allowLocation: "Standortzugriff erlauben",
    denyNotifications: "Nicht jetzt",
    denyLocation: "Nicht jetzt"
  },
  languages: {
    en: "Englisch",
    de: "Deutsch",
    fr: "Französisch"
  },
  validation: {
    required: "Dieses Feld ist erforderlich",
    invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein",
    invalidNumber: "Bitte gib eine gültige Zahl ein"
  },
  errors: {
    connectionError: "Verbindungsfehler. Bitte überprüfe deine Internetverbindung und versuche es erneut.",
    serverError: "Serverfehler. Bitte versuche es später noch einmal.",
    permissionDenied: "Berechtigung verweigert",
    notFound: "Nicht gefunden",
    unknownError: "Unbekannter Fehler"
  },
  consent: {
    title: "Einwilligung",
    content: `Im Rahmen dieser Studie stellen wir dir einige Fragen – zunächst über dich selbst (z.B. Alter, Geschlechtsidentität) und dann über deine Gefühle und deine Umgebung zu verschiedenen Zeitpunkten deines Tages. Deine Antworten helfen uns zu verstehen, wie verschiedene Menschen städtische Räume erleben und wie diese Erfahrungen mit dem Wohlbefinden zusammenhängen.

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

Bitte lies unsere [Datenschutzrichtlinie](https://intermind.ch/privacy-policy.html) für weitere Details.`
  }
};

export default de; 








