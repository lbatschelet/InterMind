import en from './en';
import de from './de';
import fr from './fr';

export type TranslationKeys = typeof en;

export const languages = {
  en,
  de,
  fr
};

export const languageNames = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français'
};

export type LanguageCode = keyof typeof languages; 