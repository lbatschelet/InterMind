import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { createLogger } from "~/src/utils/logger";
import { Slot } from "./types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../../locales/en';

const log = createLogger("NotificationScheduler");

// Storage key für die nächste geplante Benachrichtigung
const NOTIFICATION_STORAGE_KEY = 'next_notification';

/**
 * NotificationScheduler Interface
 * ------------------------------
 * 
 * Zuständig für die Planung und Ausführung von Benachrichtigungen
 * für aktive Umfrage-Slots.
 */
export interface NotificationScheduler {
  /**
   * Plant eine Benachrichtigung für den Anfang eines Slots
   * @param slot Der Slot, für den die Benachrichtigung geplant werden soll
   */
  schedule(slot: Slot): Promise<boolean>;
  
  /**
   * Sendet sofort eine Benachrichtigung, dass eine Umfrage verfügbar ist
   */
  sendSurveyAvailableNotification(): Promise<boolean>;
  
  /**
   * Bricht alle geplanten Benachrichtigungen ab
   */
  cancelAll(): Promise<void>;
  
  /**
   * Fordert Benachrichtigungsberechtigungen an (falls noch nicht erteilt)
   */
  requestPermissions(): Promise<boolean>;
  
  /**
   * Liest die Zeit der nächsten geplanten Benachrichtigung
   * @returns Das Datum der nächsten Benachrichtigung oder null, wenn keine geplant ist
   */
  getNextScheduledNotificationTime(): Promise<Date | null>;
}

/**
 * Expo-Implementierung des NotificationSchedulers
 */
export class ExpoNotificationScheduler implements NotificationScheduler {
  /**
   * Schedules a notification for the start of a slot
   * @param slot The slot to schedule a notification for
   */
  async schedule(slot: Slot): Promise<boolean> {
    try {
      log.info('Scheduling notification', {
        slotStart: slot.start.toLocaleString(),
        slotEnd: slot.end.toLocaleString(),
      });

      // Don't schedule in the past
      const now = new Date();
      let notificationTime = slot.start;
      
      if (slot.start <= now) {
        log.warn('Attempted to schedule a notification in the past, adjusting to future time', {
          slotStart: slot.start.toLocaleString(),
          now: now.toLocaleString(),
        });
        // If the slot is in the past, schedule the notification for 60 seconds from now
        notificationTime = new Date(now.getTime() + 60 * 1000);
      }

      // Calculate time until notification in seconds
      const timeUntilNotification = Math.floor((notificationTime.getTime() - now.getTime()) / 1000);
      
      // IMPORTANT: Don't schedule notifications that are too soon - this prevents immediate notifications
      const MIN_NOTIFICATION_SECONDS = 300; // 5 minutes
      if (timeUntilNotification < MIN_NOTIFICATION_SECONDS) {
        log.warn(`Notification time too close (${timeUntilNotification} seconds away). Skipping to prevent immediate triggering.`, {
          notificationTime: notificationTime.toLocaleString(),
          now: now.toLocaleString()
        });
        return false;
      }
      
      log.info('Time until notification', { 
        seconds: timeUntilNotification,
        minutes: Math.floor(timeUntilNotification / 60),
        notificationTime: notificationTime.toLocaleString(),
        now: now.toLocaleString()
      });
      
      // Store the slot for later reference
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, notificationTime.toISOString());

      // Check if we have permission
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        log.warn('No notification permission, cannot schedule');
        return false;
      }

      // Plane the notification for the slot start
      // We use a custom notification type "slot_scheduled" 
      // to distinguish it from immediate notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title: en.notifications.title,
          body: en.notifications.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          // Structured data for the notification
          data: { 
            type: 'slot_scheduled',
            notificationType: 'future',
            slotData: {
              start: slot.start.toISOString(),
              end: slot.end.toISOString()
            }
          },
        },
        trigger: {
          seconds: timeUntilNotification,
          channelId: 'survey-reminders',
        },
      });
      
      log.info('Notification scheduled successfully', {
        time: notificationTime.toLocaleString(),
        timeFromNow: `${Math.floor(timeUntilNotification / 60)} minutes, ${timeUntilNotification % 60} seconds`
      });
      
      return true;
    } catch (error) {
      log.error('Error scheduling notification', error);
      return false;
    }
  }
  
  /**
   * Sendet sofort eine Benachrichtigung, dass eine Umfrage verfügbar ist
   */
  async sendSurveyAvailableNotification(): Promise<boolean> {
    try {
      // Überprüfe Berechtigungen
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        log.warn('Cannot send notification, permission not granted');
        return false;
      }
      
      // Sende sofort eine Benachrichtigung
      await Notifications.scheduleNotificationAsync({
        content: {
          title: en.notifications.title,
          body: en.notifications.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { 
            type: 'survey_available',
            notificationType: 'immediate',
            timestamp: new Date().toISOString()
          },
        },
        trigger: null, // Sende sofort
      });
      
      log.info('Sent immediate survey available notification');
      return true;
    } catch (error) {
      log.error('Error sending survey available notification', error);
      return false;
    }
  }
  
  /**
   * Fordert Benachrichtigungsberechtigungen an (falls noch nicht erteilt)
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        return false;
      }
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('survey-reminders', {
          name: 'Survey Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      return true;
    } catch (error) {
      log.error('Error requesting notification permissions', error);
      return false;
    }
  }
  
  /**
   * Bricht alle geplanten Benachrichtigungen ab und löscht die Speicherinformationen
   */
  async cancelAll(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
      log.info('Cancelled all scheduled notifications');
    } catch (error) {
      log.error('Error cancelling notifications', error);
    }
  }
  
  /**
   * Liest die Zeit der nächsten geplanten Benachrichtigung
   */
  async getNextScheduledNotificationTime(): Promise<Date | null> {
    try {
      const nextNotificationStr = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (!nextNotificationStr) {
        return null;
      }
      
      return new Date(nextNotificationStr);
    } catch (error) {
      log.error('Error getting next scheduled notification time', error);
      return null;
    }
  }
} 