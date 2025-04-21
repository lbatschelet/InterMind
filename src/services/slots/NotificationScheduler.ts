/**
 * @packageDocumentation
 * @module Services/Slots
 * @summary Manages notification scheduling for the slot-based survey system.
 * @category Core Services
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "../../types/slots";
import { createLogger } from "../../utils/logger";
import { languages } from "../../locales";

/**
 * NotificationScheduler - Responsible for managing exactly one scheduled
 * push notification that fires at the slot start time.
 * 
 * Public API:
 * - schedule() - Schedules a notification for a slot
 * - cancelAll() - Cancels all scheduled notifications
 * - getNextScheduledNotificationTime() - Gets the time of the next notification
 * - getScheduledNotificationsCount() - Counts scheduled notifications
 * - requestPermissions() - Requests notification permissions
 * 
 * @category Core Documentation
 */

const log = createLogger("NotificationScheduler");

/**
 * Key used to store the next notification time
 * @category Configuration
 */
const NEXT_NOTIFICATION_KEY = "next_notification";

/**
 * Key used to store the user's language preference
 * @category Configuration
 */
const LANGUAGE_KEY = "app_language";

/**
 * Android notification channel identifier
 * @category Configuration
 */
const ANDROID_CHANNEL_ID = "survey-reminders";

/** 
 * Sets up the notification handler for the application.
 * Must be called once during app bootstrap.
 * 
 * @category Setup
 */
export function setupNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  log.info("Notification handler registered");
}

setupNotifications();

/**
 * Interface defining the notification scheduling capabilities.
 * Provides methods to schedule, cancel, and query notification status.
 * 
 * @category Interface
 */
export interface NotificationScheduler {
  /**
   * Schedules a notification for when a slot starts.
   * 
   * @param slot - The slot to schedule notification for
   * @returns Promise resolving to true if scheduling was successful
   * 
   * @example
   * ```typescript
   * const scheduler = new ExpoNotificationScheduler();
   * const success = await scheduler.schedule({
   *   start: new Date(Date.now() + 3600000), // 1 hour from now
   *   end: new Date(Date.now() + 7200000)    // 2 hours from now
   * });
   * ```
   */
  schedule(slot: Slot): Promise<boolean>;
  
  /**
   * Cancels all scheduled notifications.
   * 
   * @returns Promise that resolves when cancellation is complete
   * 
   * @example
   * ```typescript
   * await scheduler.cancelAll();
   * ```
   */
  cancelAll(): Promise<void>;
  
  /**
   * Gets the time of the next scheduled notification.
   * 
   * @returns Promise resolving to the Date of the next notification or null if none
   * 
   * @example
   * ```typescript
   * const nextTime = await scheduler.getNextScheduledNotificationTime();
   * if (nextTime) {
   *   console.log(`Next notification at: ${nextTime.toLocaleString()}`);
   * }
   * ```
   */
  getNextScheduledNotificationTime(): Promise<Date | null>;
  
  /**
   * Counts how many notifications are currently scheduled.
   * 
   * @returns Promise resolving to the number of scheduled notifications
   * 
   * @example
   * ```typescript
   * const count = await scheduler.getScheduledNotificationsCount();
   * console.log(`${count} notifications scheduled`);
   * ```
   */
  getScheduledNotificationsCount(): Promise<number>;
  
  /**
   * Requests notification permissions from the user.
   * 
   * @returns Promise resolving to true if permissions were granted
   * 
   * @example
   * ```typescript
   * if (await scheduler.requestPermissions()) {
   *   console.log('User granted notification permissions');
   * } else {
   *   console.log('User denied notification permissions');
   * }
   * ```
   */
  requestPermissions(): Promise<boolean>;
}

/**
 * Implementation of NotificationScheduler using Expo Notifications.
 * Handles scheduling, cancellation, and permission management.
 * 
 * @category Implementation
 * 
 * @example
 * ```typescript
 * // Create a scheduler
 * const scheduler = new ExpoNotificationScheduler();
 * 
 * // Schedule a notification for a slot
 * const slot = { start: new Date(...), end: new Date(...) };
 * await scheduler.schedule(slot);
 * ```
 */
export class ExpoNotificationScheduler implements NotificationScheduler {
  /**
   * Schedules a notification for when a slot starts.
   * Ensures only one notification is active at a time.
   * 
   * @param slot - The slot to schedule notification for
   * @returns Promise resolving to true if scheduling was successful
   * 
   * @remarks
   * If the slot start time is in the past, the notification will be scheduled
   * for 1 minute from now.
   */
  async schedule(slot: Slot): Promise<boolean> {
    try {
      const now = Date.now();
      let trigger = slot.start.getTime();
      if (trigger <= now) trigger = now + 60_000; // +1 min if in the past

      if (!(await this.ensurePermissions())) return false;

      await this.ensureSingle();
      await AsyncStorage.setItem(NEXT_NOTIFICATION_KEY, new Date(trigger).toISOString());

      const { title, body } = await this.getTexts();

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          badge: 1,
          data: { type: "slot_scheduled", slotData: slot },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(trigger),
          channelId: Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
        },
      });

      log.info("Notification scheduled", { id, at: new Date(trigger).toISOString() });
      return true;
    } catch (e) {
      log.error("schedule failed", e);
      return false;
    }
  }

  /**
   * Cancels all scheduled notifications and clears stored notification data.
   * 
   * @returns Promise that resolves when cancellation is complete
   * 
   * @remarks
   * This clears both the actual scheduled notifications and the stored metadata.
   */
  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NEXT_NOTIFICATION_KEY);
  }

  /**
   * Gets the time of the next scheduled notification.
   * 
   * @returns Promise resolving to the Date of the next notification or null if none
   * 
   * @remarks
   * This reads the stored notification time from AsyncStorage.
   */
  async getNextScheduledNotificationTime(): Promise<Date | null> {
    const s = await AsyncStorage.getItem(NEXT_NOTIFICATION_KEY);
    return s ? new Date(s) : null;
  }

  /**
   * Counts how many notifications are currently scheduled.
   * 
   * @returns Promise resolving to the number of scheduled notifications
   * 
   * @remarks
   * This queries the actual scheduled notifications rather than using
   * stored metadata.
   */
  async getScheduledNotificationsCount(): Promise<number> {
    return (await Notifications.getAllScheduledNotificationsAsync()).length;
  }

  /**
   * Requests notification permissions from the user.
   * 
   * @returns Promise resolving to true if permissions were granted
   * 
   * @remarks
   * Delegates to the internal ensurePermissions method.
   */
  async requestPermissions(): Promise<boolean> {
    return this.ensurePermissions();
  }

  /* ──────────────────────────  Internal helpers  ────────────────────── */

  /**
   * Ensures only one notification is scheduled at a time.
   * Cancels any existing notifications before scheduling a new one.
   * 
   * @private
   */
  private async ensureSingle(): Promise<void> {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    if (all.length) await this.cancelAll();
  }

  /**
   * Ensures notification permissions are granted and Android channel is created.
   * 
   * @returns Promise resolving to true if permissions are granted
   * @private
   */
  private async ensurePermissions(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    let final = status;
    if (status !== "granted") {
      ({ status: final } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      }));
    }
    if (final !== "granted") return false;

    if (Platform.OS === "android") {
      const channels = await Notifications.getNotificationChannelsAsync();
      if (!channels.some((c) => c.id === ANDROID_CHANNEL_ID)) {
        await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
          name: "Survey Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#0076FF",
          enableVibrate: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }
    }
    return true;
  }

  /**
   * Gets localized notification text based on the user's language preference.
   * 
   * @returns Object containing title and body text for the notification
   * @private
   */
  private async getTexts() {
    const lang = (await AsyncStorage.getItem(LANGUAGE_KEY)) || "en";
    const { notifications } = languages[lang as keyof typeof languages] || languages.en;
    return { title: notifications.title, body: notifications.body };
  }
}
