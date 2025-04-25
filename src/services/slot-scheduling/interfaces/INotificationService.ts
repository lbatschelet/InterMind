/**
 * @packageDocumentation
 * @module SlotScheduling/Interfaces
 * 
 * @summary
 * Interface für den Benachrichtigungsdienst.
 */

import { ISlot } from "./ISlot";

/**
 * Service für Benachrichtigungen
 * Zuständig für die Verwaltung von Push-Benachrichtigungen
 */
export interface INotificationService {
  /**
   * Plant eine Benachrichtigung für einen Slot
   * 
   * @param slot Der Slot, für den die Benachrichtigung geplant werden soll
   * @returns Promise mit der ID der geplanten Benachrichtigung
   */
  scheduleNotification(slot: ISlot): Promise<string>;
  
  /**
   * Bricht alle geplanten Benachrichtigungen ab
   * 
   * @returns Promise, das aufgelöst wird, wenn alle Benachrichtigungen abgebrochen wurden
   */
  cancelAllNotifications(): Promise<void>;
} 