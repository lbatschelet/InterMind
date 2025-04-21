import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "../../types/slots";
import { createLogger } from "../../utils/logger";
import { languages } from "../../locales";

/* -------------------------------------------------------------------------
 * NotificationScheduler – single‑responsibility: exactly **one** scheduled
 * push that fires at the slot start. Public surface identical to legacy ⇢
 * schedule() · cancelAll() · getNextScheduledNotificationTime() ·
 * getScheduledNotificationsCount() · requestPermissions().
 * -------------------------------------------------------------------------*/

const log = createLogger("NotificationScheduler");

const NEXT_NOTIFICATION_KEY = "next_notification";
const LANGUAGE_KEY = "app_language";
const ANDROID_CHANNEL_ID = "survey-reminders";

/** Must be called once during app bootstrap. */
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

export interface NotificationScheduler {
  schedule(slot: Slot): Promise<boolean>;
  cancelAll(): Promise<void>;
  getNextScheduledNotificationTime(): Promise<Date | null>;
  getScheduledNotificationsCount(): Promise<number>;
  requestPermissions(): Promise<boolean>;
}

export class ExpoNotificationScheduler implements NotificationScheduler {
  /* ─────────────────────────────  schedule  ─────────────────────────── */
  async schedule(slot: Slot): Promise<boolean> {
    try {
      const now = Date.now();
      let trigger = slot.start.getTime();
      if (trigger <= now) trigger = now + 60_000; // +1 min if in the past

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

  /* ────────────────────────────  cancelAll  ─────────────────────────── */
  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NEXT_NOTIFICATION_KEY);
  }

  /* ────────────────────  getNextScheduledNotificationTime  ──────────── */
  async getNextScheduledNotificationTime(): Promise<Date | null> {
    const s = await AsyncStorage.getItem(NEXT_NOTIFICATION_KEY);
    return s ? new Date(s) : null;
  }

  /* ──────────────────  getScheduledNotificationsCount  ──────────────── */
  async getScheduledNotificationsCount(): Promise<number> {
    return (await Notifications.getAllScheduledNotificationsAsync()).length;
  }

  /* ────────────────────────  requestPermissions  ────────────────────── */
  async requestPermissions(): Promise<boolean> {
    return this.ensurePermissions();
  }

  /* ──────────────────────────  Internal helpers  ────────────────────── */

  private async ensureSingle(): Promise<void> {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    if (all.length) await this.cancelAll();
  }

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

  private async getTexts() {
    const lang = (await AsyncStorage.getItem(LANGUAGE_KEY)) || "en";
    const { notifications } = languages[lang as keyof typeof languages] || languages.en;
    return { title: notifications.title, body: notifications.body };
  }
}
