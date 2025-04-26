import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "~/src/utils/logger";
import { DEVICE_ID_KEY } from "../../constants/storageKeys";

const log = createLogger("DeviceIdService");

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

/**
 * Lean service dedicated only to device ID operations
 * Used to break circular dependencies
 */
class DeviceIdService {
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
}

export default DeviceIdService; 