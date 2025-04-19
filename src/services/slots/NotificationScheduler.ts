import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { createLogger } from "~/src/utils/logger";
import { Slot } from "./types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages } from '../../locales';

const log = createLogger("NotificationScheduler");

// Storage keys
const NOTIFICATION_STORAGE_KEY = 'next_notification';
const LANGUAGE_STORAGE_KEY = 'app_language';

/**
 * Setup notifications globally - this should be called early in the app initialization
 * to ensure background notifications work correctly
 */
export function setupNotifications() {
  // Configure notifications handler for both foreground and background
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  log.info('Notification handler configured for all app states');
}

// Initialisiere Benachrichtigungen beim Laden des Moduls
setupNotifications();

/**
 * NotificationScheduler Interface
 */
export interface NotificationScheduler {
  schedule(slot: Slot): Promise<boolean>;
  cancelAll(): Promise<void>;
  getNextScheduledNotificationTime(): Promise<Date | null>;
  getScheduledNotificationsCount(): Promise<number>;
  requestPermissions(): Promise<boolean>;
}

/**
 * Minimale Expo-Implementierung des NotificationSchedulers für geplante Benachrichtigungen
 */
export class ExpoNotificationScheduler implements NotificationScheduler {
  /**
   * Plant eine Benachrichtigung für einen Slot
   */
  async schedule(slot: Slot): Promise<boolean> {
    try {
      // Nicht in der Vergangenheit planen
      const now = new Date();
      let notificationTime = slot.start;
      
      if (slot.start <= now) {
        log.warn('Adjusting past notification to future time');
        notificationTime = new Date(now.getTime() + 60 * 1000);
      }
      
      // Berechtigungen prüfen & Kanal sicherstellen
      if (!await this.ensurePermissions()) {
        return false;
      }
      
      // Vorhandene Benachrichtigungen überprüfen und alle löschen
      // Dies stellt sicher, dass immer nur eine Benachrichtigung aktiv ist
      await this.ensureSingleNotification();
      
      // Zeit speichern
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, notificationTime.toISOString());
      
      // Texte für aktuelle Sprache laden
      const texts = await this.getLocalizedTexts();
      
      // Benachrichtigung planen
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: texts.title,
          body: texts.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          badge: 1,
          data: { 
            type: 'slot_scheduled',
            slotData: {
              start: slot.start.toISOString(),
              end: slot.end.toISOString()
            }
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationTime,
          channelId: Platform.OS === 'android' ? 'survey-reminders' : undefined,
        },
      });
      
      // Nach dem Planen nochmal überprüfen, ob wirklich nur eine Benachrichtigung existiert
      const count = await this.getScheduledNotificationsCount();
      
      log.info('Notification scheduled', {
        identifier,
        time: notificationTime.toLocaleString(),
        totalScheduled: count
      });
      
      return true;
    } catch (error) {
      log.error('Error scheduling notification', error);
      return false;
    }
  }
  
  /**
   * Alle geplanten Benachrichtigungen abbrechen
   */
  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
    log.info('All notifications cancelled');
  }
  
  /**
   * Zeit der nächsten geplanten Benachrichtigung lesen
   */
  async getNextScheduledNotificationTime(): Promise<Date | null> {
    const timeStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return timeStr ? new Date(timeStr) : null;
  }
  
  /**
   * Gibt die Anzahl der aktuell geplanten Benachrichtigungen zurück
   */
  async getScheduledNotificationsCount(): Promise<number> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.length;
  }
  
  /**
   * Fordert Benachrichtigungsberechtigungen an und stellt sicher, dass Kanäle eingerichtet sind
   */
  async requestPermissions(): Promise<boolean> {
    try {
      return await this.ensurePermissions();
    } catch (error) {
      log.error('Error requesting permissions', error);
      return false;
    }
  }
  
  /**
   * Private Hilfsmethoden
   */
  
  /**
   * Stellt sicher, dass nur eine Benachrichtigung aktiv ist
   */
  private async ensureSingleNotification(): Promise<void> {
    try {
      const count = await this.getScheduledNotificationsCount();
      
      if (count > 0) {
        log.info(`Cancelling ${count} existing notification(s) before scheduling new one`);
        await this.cancelAll();
      }
    } catch (error) {
      log.error('Error ensuring single notification', error);
    }
  }
  
  /**
   * Stellt sicher, dass Berechtigungen vorhanden sind und auf Android der Kanal existiert
   */
  private async ensurePermissions(): Promise<boolean> {
    try {
      // Berechtigungen prüfen/anfordern
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true }
        });
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        log.warn('Notification permission not granted');
        return false;
      }
      
      // Auf Android: Kanal erstellen
      if (Platform.OS === 'android') {
        const channels = await Notifications.getNotificationChannelsAsync();
        if (!channels.some(c => c.id === 'survey-reminders')) {
          await Notifications.setNotificationChannelAsync('survey-reminders', {
            name: 'Survey Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0076FF',
            enableVibrate: true,
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          });
        }
      }
      
      return true;
    } catch (error) {
      log.error('Permission error', error);
      return false;
    }
  }
  
  /**
   * Holt lokalisierte Texte basierend auf der aktuellen Sprache
   */
  private async getLocalizedTexts() {
    try {
      // Aktuelle Sprache lesen
      const lang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
      const language = languages[lang as keyof typeof languages] || languages.en;
      
      return {
        title: language.notifications.title,
        body: language.notifications.body
      };
    } catch (error) {
      // Fallback bei Fehler
      return {
        title: "A new survey is waiting for you.",
        body: "You have one hour to complete."
      };
    }
  }
} 