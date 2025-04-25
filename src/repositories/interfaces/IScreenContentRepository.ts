/**
 * Interface for the Screen Content Repository
 */

/**
 * Screen content structure
 */
export interface ScreenContent {
  id: string;
  type: string;
  imageKey: string;
  title: string;
  content: string;
}

/**
 * Repository for managing screen content from the database
 */
export interface IScreenContentRepository {
  /**
   * Gets content for a specific screen in the specified language
   * @param contentId The content ID to retrieve (e.g., "about", "privacy")
   * @param language The language code to retrieve content for
   * @returns The content object or null if not found
   */
  getScreenContent(contentId: string, language: string): Promise<ScreenContent | null>;
  
  /**
   * Gets all available content IDs
   * @returns List of content IDs
   */
  getAllContentIds(): Promise<string[]>;
} 