export default {
  general: {
    agree: "I Agree",
    continue: "Continue",
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    delete: "Delete",
    yes: "Yes",
    no: "No",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    retry: "Retry",
    reset: "Reset",
    confirmation: "Confirmation",
    warning: "Warning",
    understand: "I Understand",
    tryAgain: "Try Again",
    noDataAvailable: "No data available",
    unexpectedError: "An unexpected error occurred",
    ok: "OK"
  },
  settings: {
    title: "Settings",
    language: "Language",
    languageSelection: "Language Selection",
    showDeviceId: "Show Device ID",
    privacyPolicy: "Privacy Policy",
    about: "About",
    deleteAllData: "Delete All Data",
    deleteConfirmTitle: "Delete All Data?",
    deleteConfirmText: "This action is irreversible. All collected survey data will be permanently deleted from our servers as well as your device.",
    deleteSuccess: "Data Deleted",
    deleteError: "Error Deleting Data",
    notifications: "Notifications",
    deleteData: "Delete My Data",
    resetQuestions: "Reset Answered Questions",
    dataManagement: "Data Management",
    generalSettings: "General",
    advancedSettings: "Advanced",
    appearance: "Appearance",
    debug: "Debug Functions",
    consent: "Consent"
  },
  home: {
    title: "InterMind",
    startSurvey: "Start Survey",
    surveyAvailable: "A survey is available now! You have one hour to complete it.",
    surveyNotAvailable: "Survey Not Available",
    nextSurveyIn: "Next survey in",
    nextSurveyAt: "Next survey at",
    tomorrow: "Next survey tomorrow at",
    hours: "hours",
    minutes: "minutes",
    noUpcomingSurvey: "No upcoming surveys scheduled yet. Please check back later.",
    welcome: "Welcome to InterMind!",
    unavailable: "No survey available right now"
  },
  survey: {
    deviceId: "Device ID",
    deviceIdDesc: "This ID is generated from your device and used for pseudonymized data collection.",
    copyDeviceId: "Copy ID",
    back: "Back",
    next: "Next",
    submit: "Submit",
    exitTitle: "Exit Survey?",
    exitMessage: "Your progress will be saved, but you will exit the survey. Are you sure you want to exit?",
    continueSurvey: "Continue Survey",
    exitSurvey: "Exit Survey",
    start: "Start Survey",
    title: "Survey",
    optional: "Optional",
    complete: "Survey Completed",
    completeMessage: "Thank you for completing this survey!",
    errorSubmitting: "Error submitting survey",
    errorLoading: "Error loading survey",
    dataDeleteConfirm: "Are you sure you want to delete all survey data?",
    dataDeleteSuccess: "All survey data has been deleted",
    dataDeleteError: "Error deleting survey data"
  },
  notifications: {
    title: "A new survey is waiting for you.",
    body: "You have one hour to complete.",
    permission: "Please enable notifications to receive survey reminders.",
    permissionDenied: "Notifications are disabled. You can enable them in the device settings.",
  },
  about: {
    title: "About InterMind",
    content: `**InterMind** is a research app developed by Lukas Batschelet at the Institute of Geography, University of Bern. It collects data on wellbeing from an intersectional and spatial perspective. The app is part of a Bachelor's thesis and is used exclusively for academic research.

## Licences

**App source code**  
Licensed under the GNU AGPL 3.0  
Available at: [github.com/lbatschelet/InterMind](https://github.com/lbatschelet/InterMind)

**Publications**  
Licensed under Creative Commons CC BY-SA-NC 4.0  
Available at: [intermind.ch](https://intermind.ch)

## Graphics

All illustrations © 2025 Katerina Limpitsouni  
from the open source project [undraw.co](https://undraw.co)

## Version
Version: 0.3.1
`,
    version: "Version",
    description: "InterMind is a research app designed to understand how urban environments affect wellbeing.",
    contact: "Contact",
    team: "Team",
    license: "License",
    thankYou: "Thank you for participating in our research!"
  },
  privacy: {
    title: "Privacy Policy",
    content: `**InterMind** is a research app developed as part of a Bachelor's thesis at the Institute of Geography, University of Bern. The project is supervised by Prof. Dr. Carolin Schurr and Dr. Moritz Gubler. This Privacy Policy explains what data we collect, how it is processed, and your rights as a participant.

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
`
  },
  permissions: {
    allowNotifications: "Allow Notifications",
    allowLocation: "Allow Location Access",
    denyNotifications: "Not Now",
    denyLocation: "Not Now"
  },
  languages: {
    en: "English",
    de: "Deutsch",
    fr: "Français"
  },
  validation: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidNumber: "Please enter a valid number"
  },
  errors: {
    connectionError: "Connection error. Please check your internet connection and try again.",
    serverError: "Server error. Please try again later.",
    permissionDenied: "Permission denied",
    notFound: "Not found",
    unknownError: "Unknown error"
  },
  consent: {
    title: "Consent",
    content: `As part of this study, we will ask you some questions—first about yourself (e.g. age, gender identity), and then about your feelings and your surrounding environment at different moments in your day. Your responses help us understand how different people experience urban spaces and how these experiences relate to wellbeing.

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

Please read our [Privacy Policy](https://intermind.ch/privacy-policy.html) for more details.`
  }
};