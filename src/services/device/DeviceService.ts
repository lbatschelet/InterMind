import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "~/src/utils/logger";
import { supabase } from "../../lib/supabase";
import { DEVICE_ID_KEY, FIRST_SURVEY_CHECKED_KEY } from "../../constants/storageKeys";
import { DataResetService } from "../reset";
import { slotService } from "../slot-scheduling";

const log = createLogger("DeviceService");

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
      if (!DEVICE_ID_KEY) {
        throw new Error("DEVICE_ID_KEY is not defined");
      }
      
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
   * Generates a new device ID and saves it.
   * @returns {Promise<string>} The newly generated device ID.
   */
  static async generateNewDeviceId(): Promise<string> {
    if (!DEVICE_ID_KEY) {
      throw new Error("DEVICE_ID_KEY is not defined");
    }
    
    const newDeviceId = generateReadableId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);
    log.info(`Generated new device ID: ${newDeviceId}`);
    return newDeviceId;
  }

  /**
   * Deletes all device data from the database and resets local storage.
   * This will also reset all answered questions so they will be shown again.
   */
  static async deleteDeviceData(): Promise<boolean> {
    try {
      // Get current device ID
      const deviceId = await this.getDeviceId();
      
      // Use the DataResetService to perform the data deletion with a callback for device ID generation
      return await DataResetService.deleteAllUserData(deviceId, () => this.generateNewDeviceId());
    } catch (error) {
      log.error("Failed to delete device data", error);
      return false;
    }
  }
}

export default DeviceService; 