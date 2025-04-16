# Multi-Language Question Support Guide

This document explains how to set up multi-language questions in the database for the InterMind application.

## Overview

The InterMind app now supports multiple languages for all UI elements and survey questions. When adding questions to the database, you can provide translations for question text, options, and other relevant fields.

## Database Structure

Questions are stored in the Supabase `questions` table. The following fields support multi-language content:

- `text`: The question text shown to the user
- `title`: The title (for info screens)
- `options`: JSON field that can contain localized option labels and values

## Multi-Language Format

### Question Text and Title

To make a question text or title multi-language, instead of providing a simple string, use a JSON object with language codes as keys:

```json
{
  "en": "What is your age?",
  "de": "Wie alt sind Sie?"
}
```

### Question Options

For questions with options (single_choice, multiple_choice), the options field should contain a JSON object. For multi-language support, the option labels can also be language objects:

```json
{
  "options": [
    {
      "value": "option1",
      "label": {
        "en": "Option 1",
        "de": "Option 1 (auf Deutsch)"
      }
    },
    {
      "value": "option2",
      "label": {
        "en": "Option 2",
        "de": "Option 2 (auf Deutsch)"
      }
    }
  ],
  "showOnce": true
}
```

### For Slider Questions

For slider questions, the values array can contain localized values:

```json
{
  "values": [
    {
      "en": "Not at all",
      "de": "Überhaupt nicht"
    },
    {
      "en": "Slightly",
      "de": "Leicht"
    },
    {
      "en": "Moderately",
      "de": "Mäßig"
    },
    {
      "en": "Very",
      "de": "Sehr"
    },
    {
      "en": "Extremely",
      "de": "Extrem"
    }
  ]
}
```

### For Info Screens

Info screens can have a localized button text:

```json
{
  "buttonText": {
    "en": "Continue",
    "de": "Weiter"
  },
  "showOnce": true
}
```

## Example Questions

### Single Choice Question

```sql
INSERT INTO questions (id, type, text, options, category, sequence_number)
VALUES (
  'question_age',
  'single_choice',
  '{"en": "What is your age?", "de": "Wie alt sind Sie?"}',
  '{"options": [
    {"value": "18-24", "label": {"en": "18-24 years", "de": "18-24 Jahre"}},
    {"value": "25-34", "label": {"en": "25-34 years", "de": "25-34 Jahre"}},
    {"value": "35-44", "label": {"en": "35-44 years", "de": "35-44 Jahre"}},
    {"value": "45-54", "label": {"en": "45-54 years", "de": "45-54 Jahre"}},
    {"value": "55+", "label": {"en": "55+ years", "de": "55+ Jahre"}}
  ], "showOnce": true}',
  'demographic',
  1
);
```

### Info Screen

```sql
INSERT INTO questions (id, type, title, text, options, category, sequence_number)
VALUES (
  'welcome_screen',
  'info_screen',
  '{"en": "Welcome to the Survey", "de": "Willkommen zur Umfrage"}',
  '{"en": "Thank you for participating in our research. Your answers will help us understand more about...", "de": "Vielen Dank für Ihre Teilnahme an unserer Forschung. Ihre Antworten helfen uns, mehr zu verstehen über..."}',
  '{"buttonText": {"en": "Start Survey", "de": "Umfrage starten"}, "showOnce": false}',
  'intro',
  0
);
```

## Fallback Behavior

If a translation is not available for the user's selected language, the app will fall back to English. If English is also not available, it will use whatever string value is available.

## Adding New Languages

To add support for a new language:

1. Add the language code and translations to the locales files (`src/locales/`)
2. Update the language selection UI to include the new language
3. Add translations for each question in the database

Currently supported languages:
- English (en)
- German (de) 