import { createLogger } from "~/src/utils/logger";
import { supabase } from "../../lib/supabase";
import DeviceIdService from "../device/DeviceIdService";

const log = createLogger("AuthService");

/**
 * Service to handle authentication with Supabase
 * Supports anonymous sign-ins while maintaining device IDs
 */
class AuthService {
  /**
   * Sign in anonymously
   * If already signed in, just returns the current session
   * @returns {Promise<string>} The anonymous user ID
   */
  static async signInAnonymously(): Promise<string> {
    try {
      // Check if we already have a session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session) {
        log.debug("Already have an active session", {
          userId: sessionData.session.user.id.substring(0, 8) + '...',
        });
        return sessionData.session.user.id;
      }
      
      // No session, perform anonymous sign-in
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        log.error("Failed to sign in anonymously", error);
        throw new Error("Anonymous sign-in failed");
      }
      
      if (!data?.user) {
        log.error("No user returned from anonymous sign-in");
        throw new Error("Anonymous sign-in failed - no user");
      }
      
      log.info("Signed in anonymously", {
        userId: data.user.id.substring(0, 8) + '...'
      });
      
      return data.user.id;
    } catch (error) {
      log.error("Error in signInAnonymously", error);
      throw error;
    }
  }
  
  /**
   * Get the current user's ID or null if not signed in
   */
  static async getCurrentUserId(): Promise<string | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session?.user?.id || null;
    } catch (error) {
      log.error("Error getting current user ID", error);
      return null;
    }
  }
  
  /**
   * Checks if the current user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    return userId !== null;
  }
  
  /**
   * Signs out the current user
   */
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        log.error("Failed to sign out", error);
        throw error;
      }
      
      log.info("User signed out");
    } catch (error) {
      log.error("Error signing out", error);
      throw error;
    }
  }
}

export default AuthService; 