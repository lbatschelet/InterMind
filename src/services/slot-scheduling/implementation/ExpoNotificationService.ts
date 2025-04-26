/**
 * @packageDocumentation
 * @module SlotScheduling/Implementation
 * 
 * @summary
 * Implementierung des Benachrichtigungsdienstes mit Expo.
 */

import * as Notifications from "expo-notifications";
import { ISlot } from "../interfaces/ISlot";
import { INotificationService } from "../interfaces/INotificationService";
import { createLogger } from "../../../utils/logger";

const log = createLogger("ExpoNotificationService");

/**
 * Implementierung des Benachrichtigungsdienstes mit Expo Notifications
 */
export class ExpoNotificationService implements INotificationService {
  /**
   * Konstruktor, der die Standardkonfiguration für Benachrichtigungen setzt
   */
  constructor() {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
  
  /**
   * Plant eine Benachrichtigung für einen Slot
   * 
   * @param slot Der Slot, für den die Benachrichtigung geplant werden soll
   * @returns Promise mit der ID der geplanten Benachrichtigung
   */
  async scheduleNotification(slot: ISlot): Promise<string> {
    try {
      const title = "Umfrage verfügbar";
      const body = "Eine neue Umfrage ist jetzt verfügbar!";
      
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { slotId: slot.id }
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: slot.start
        }
      });
      
      log.info("Notification scheduled", { 
        slotId: slot.id, 
        scheduledFor: slot.start.toISOString(),
        notificationId: id
      });
      
      return id;
    } catch (e) {
      log.error("Failed to schedule notification", e);
      return "";
    }
  }
  
  /**
   * Bricht alle geplanten Benachrichtigungen ab
   * 
   * @returns Promise, das aufgelöst wird, wenn alle Benachrichtigungen abgebrochen wurden
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      log.info("All notifications cancelled");
    } catch (e) {
      log.error("Failed to cancel notifications", e);
      throw e;
    }
  }
} 