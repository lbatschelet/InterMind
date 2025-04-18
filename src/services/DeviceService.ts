import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "~/src/utils/logger";
import { supabase } from "../lib/supabase";
import AnsweredQuestionsService from "./AnsweredQuestionsService";
import { resetSlotSystem } from "./slots";

const log = createLogger("DeviceService");

const DEVICE_ID_KEY = "device_id";

/**
 * Generates a human-readable unique device identifier.
 * The format follows: XXXX-XXXX-XXXX (alphanumeric).
 * @returns {string} A newly generated device ID.
 */
const generateReadableId = (): string => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array(3)
    .fill(0)
    .map(() =>
      Array(4)
        .fill(0)
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join("")
    )
    .join("-");
};

class DeviceService {
  /**
   * Retrieves the stored device ID or generates a new one if not found.
   * @returns {Promise<string>} The device ID.
   * @throws {Error} If retrieving the device ID fails.
   */
  static async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!deviceId) {
        deviceId = generateReadableId();
        await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
        log.info(`Generated new device ID: ${deviceId}`);
      } else {
        log.debug(`Using existing device ID: ${deviceId}`);
      }
      return deviceId;
    } catch (error) {
      log.error("Error retrieving device ID", error);
      throw new Error("Failed to retrieve device ID");
    }
  }

  /**
   * Deletes all device data from the database and resets local storage.
   * This will also reset all answered questions so they will be shown again.
   */
  static async deleteDeviceData(): Promise<boolean> {
    try {
      // Get current device ID
      const deviceId = await this.getDeviceId();
      log.info(`Deleting all data for device: ${deviceId}`);

      // Delete all device data from database
      const { error } = await supabase
        .from("surveys")
        .delete()
        .eq("device_id", deviceId);

      if (error) {
        log.error("Error deleting device data from database", error);
        return false;
      }

      // Reset answered questions in AsyncStorage
      await AnsweredQuestionsService.resetAnsweredQuestions();
      log.info("Reset answered questions after data deletion");

      // Reset slot system (handles notification cancellation, and slot storage)
      await resetSlotSystem();
      log.info("Slot system reset completed after data deletion");
      
      // Generate a new device ID
      const newDeviceId = generateReadableId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);
      log.info(`Generated new device ID after data deletion: ${newDeviceId}`);

      return true;
    } catch (error) {
      log.error("Failed to delete device data", error);
      return false;
    }
  }
}

export { DeviceService };
