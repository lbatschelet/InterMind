import { createClient } from "@supabase/supabase-js";
import { DeviceService } from "../services/DeviceService";
import { createLogger } from "~/src/utils/logger";

const log = createLogger("Supabase");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ Supabase mit globalen Headers erstellen
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (url, options) => {
      const deviceId = await DeviceService.getDeviceId();
      log.debug("Attaching X-Device-ID header:", deviceId);
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          "X-Device-ID": deviceId,
        },
      });
    },
  },
});
