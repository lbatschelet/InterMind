import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "~/src/utils/logger";
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
}

export { DeviceService };
