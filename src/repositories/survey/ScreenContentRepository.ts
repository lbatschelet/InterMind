import { createLogger } from "~/src/utils/logger";
import { IDatabaseClient } from "../interfaces";
import { IScreenContentRepository, ScreenContent } from "../interfaces/IScreenContentRepository";
import { databaseClient } from "../database";
import { supabase } from "~/src/lib/supabase";
import { AuthService } from "~/src/services/auth";

const log = createLogger("ScreenContentRepository");

/**
 * Repository for managing screen content in the database
 */
export class ScreenContentRepository implements IScreenContentRepository {
  // Cache for screen content to reduce database queries
  private contentCache: Record<string, ScreenContent> = {};
  
  /**
   * Creates a new instance of ScreenContentRepository
   * @param dbClient Database client for DB access
   */
  constructor(private readonly dbClient: IDatabaseClient = databaseClient) {}

  /**
   * Gets content for a specific screen in the specified language
   * @param contentId The content ID to retrieve (e.g., "about", "privacy")
   * @param language The language code to retrieve content for
   * @returns The content object or null if not found
   */
  async getScreenContent(contentId: string, language: string): Promise<ScreenContent | null> {
    try {
      // Check if we have this content in cache
      const cacheKey = `${contentId}_${language}`;
      if (this.contentCache[cacheKey]) {
        log.debug("Using cached screen content", { contentId, language });
        return this.contentCache[cacheKey];
      }
      
      // Ensure we're authenticated
      const isAuthenticated = await AuthService.isAuthenticated();
      if (!isAuthenticated) {
        log.info("Not authenticated, signing in anonymously");
        await AuthService.signInAnonymously();
      }
      
      // Query the database for screen content with translations using direct supabase client
      const { data, error } = await supabase
        .from('screen_content')
        .select(`
          id, 
          type, 
          image_key,
          screen_content_translations!inner(title, content)
        `)
        .eq('id', contentId)
        .eq('screen_content_translations.language', language)
        .eq('is_active', true)
        .single();
        
      if (error) {
        log.error("Error fetching screen content", { error, contentId, language });
        return null;
      }
      
      // If no data found, return null
      if (!data || !data.screen_content_translations || 
          data.screen_content_translations.length === 0) {
        log.warn("No screen content found", { contentId, language });
        return null;
      }
      
      // Transform the data to the expected format
      const screenContent: ScreenContent = {
        id: data.id,
        type: data.type,
        imageKey: data.image_key,
        title: data.screen_content_translations[0].title,
        content: data.screen_content_translations[0].content
      };
      
      // Cache the content
      this.contentCache[cacheKey] = screenContent;
      
      return screenContent;
    } catch (error) {
      log.error("Error in getScreenContent", error);
      return null;
    }
  }
  
  /**
   * Gets all available content IDs
   * @returns List of content IDs
   */
  async getAllContentIds(): Promise<string[]> {
    try {
      // Ensure we're authenticated
      const isAuthenticated = await AuthService.isAuthenticated();
      if (!isAuthenticated) {
        log.info("Not authenticated, signing in anonymously");
        await AuthService.signInAnonymously();
      }
      
      // Use direct supabase client
      const { data, error } = await supabase
        .from('screen_content')
        .select('id')
        .eq('is_active', true);
        
      if (error) {
        log.error("Error fetching content IDs", error);
        return [];
      }
      
      return (data || []).map((item: { id: string }) => item.id);
    } catch (error) {
      log.error("Error in getAllContentIds", error);
      return [];
    }
  }
  
  /**
   * Clears the content cache
   */
  clearCache(): void {
    this.contentCache = {};
    log.debug("Screen content cache cleared");
  }
}

// Singleton instance for the entire application
export const screenContentRepository = new ScreenContentRepository(); 