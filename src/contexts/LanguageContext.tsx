import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode, TranslationKeys, languages } from '../locales';
import { NativeModules, Platform } from 'react-native';
import { createLogger } from '~/src/utils/logger';

const log = createLogger("LanguageContext");

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string) => string;
};

const DEFAULT_LANGUAGE: LanguageCode = 'en';
const LANGUAGE_STORAGE_KEY = 'app_language';

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
  children: ReactNode;
};

/**
 * Detects the system language of the device.
 * @returns The language code (if supported) or the default language.
 */
const getSystemLanguage = (): LanguageCode => {
  try {
    // Systemsprache ermitteln je nach Plattform
    let deviceLanguage;
    
    if (Platform.OS === 'ios') {
      // Sichere Überprüfung, ob SettingsManager existiert (kann in Expo oder Tests null sein)
      if (NativeModules.SettingsManager && NativeModules.SettingsManager.settings) {
        deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale || 
                        (NativeModules.SettingsManager.settings.AppleLanguages && 
                         NativeModules.SettingsManager.settings.AppleLanguages[0]);
      } else {
        log.warn("iOS SettingsManager not available, falling back to default language");
        return DEFAULT_LANGUAGE;
      }
    } else if (Platform.OS === 'android') {
      // Sichere Überprüfung für Android
      if (NativeModules.I18nManager) {
        deviceLanguage = NativeModules.I18nManager.localeIdentifier;
      } else {
        log.warn("Android I18nManager not available, falling back to default language");
        return DEFAULT_LANGUAGE;
      }
    } else {
      // Für andere Plattformen (z.B. Web)
      log.warn("Unsupported platform, falling back to default language");
      return DEFAULT_LANGUAGE;
    }

    // Sicherstellen, dass wir eine gültige Spracheinstellung haben
    if (!deviceLanguage) {
      log.warn("Could not detect device language, falling back to default");
      return DEFAULT_LANGUAGE;
    }

    // Konvertieren zu zweistelligem Sprachcode (z.B. "en-US" -> "en")
    const languageCode = deviceLanguage.split(/[-_]/)[0];
    
    log.debug("Detected system language", { deviceLanguage, languageCode });
    
    // Prüfen, ob die Sprache unterstützt wird
    if (Object.keys(languages).includes(languageCode)) {
      return languageCode as LanguageCode;
    }
    
    log.debug("System language not supported, using default", { 
      detected: languageCode, 
      default: DEFAULT_LANGUAGE 
    });
    return DEFAULT_LANGUAGE;
  } catch (error) {
    log.error("Error detecting system language", error);
    return DEFAULT_LANGUAGE;
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  // Load saved language preference on startup
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        // Gespeicherte Spracheinstellung prüfen
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        
        if (savedLanguage && Object.keys(languages).includes(savedLanguage)) {
          log.debug("Using saved language preference", { language: savedLanguage });
          setLanguageState(savedLanguage as LanguageCode);
        } else {
          // Keine gespeicherte Sprache - Systemsprache verwenden
          const systemLanguage = getSystemLanguage();
          log.debug("No saved language, using system language", { language: systemLanguage });
          setLanguageState(systemLanguage);
          // Systemsprache speichern
          await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, systemLanguage);
        }
      } catch (error) {
        log.error('Error loading language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  // Set language and save to storage
  const setLanguage = async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      log.debug("Language changed", { newLanguage: lang });
    } catch (error) {
      log.error('Error saving language preference:', error);
    }
  };

  // Translate function to get text based on key path
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = languages[language];
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    
    return value === undefined ? key : value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 