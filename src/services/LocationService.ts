import * as Location from "expo-location";
import { createLogger } from "~/src/utils/logger";
const log = createLogger("LocationService");

class LocationService {
  /**
   * Fetches the current GPS location of the device.
   * If permission is denied, returns a default location.
   * @returns {Promise<{ lat: number; lng: number }>} The latitude and longitude.
   */
  static async getLocation(): Promise<{ lat: number; lng: number }> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        log.warn("Location permission denied");
        return { lat: 0, lng: 0 };
      }

      const location = await Location.getCurrentPositionAsync({});
      log.info("Fetched device location", { lat: location.coords.latitude, lng: location.coords.longitude });
      return { lat: location.coords.latitude, lng: location.coords.longitude };
    } catch (error) {
      log.error("Error retrieving location", error);
      return { lat: 0, lng: 0 };
    }
  }
}

export { LocationService };
