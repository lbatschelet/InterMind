/**
 * @packageDocumentation
 * @module Styles/InfoScreenStyles
 * 
 * @summary
 * Shared styles and layout constants for information screens.
 * 
 * @remarks
 * - Used by AboutScreen, PrivacyPolicyScreen, and InfoScreen components
 * - Provides consistent typography, spacing, and colors
 * - Includes markdown styling for content rendering
 */

import { StyleSheet } from "react-native";

/**
 * Common layout constants for information screens
 */
export const INFO_SCREEN_LAYOUT = {
  IMAGE_HEIGHT_PERCENT: 0.2,
  TITLE_FONT_SIZE: 28,
  TITLE_MARGIN_BOTTOM: 24,
  TEXT_FONT_SIZE: 16,
  TEXT_LINE_HEIGHT: 24
};

/**
 * Common markdown styles for all information screens
 */
export const markdownStyles = StyleSheet.create({
  body: {
    fontSize: INFO_SCREEN_LAYOUT.TEXT_FONT_SIZE,
    lineHeight: INFO_SCREEN_LAYOUT.TEXT_LINE_HEIGHT,
    color: '#000',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  bullet_list: {
    marginVertical: 12,
  },
  ordered_list: {
    marginVertical: 12,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet_list_content: {
    flex: 1,
  },
  ordered_list_content: {
    flex: 1,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#CCCCCC',
    paddingLeft: 8,
    marginLeft: 8,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  code_block: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
    fontFamily: 'monospace',
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: '#F5F5F5',
    fontFamily: 'monospace',
    padding: 2,
    borderRadius: 2,
  },
  hr: {
    backgroundColor: '#CCCCCC',
    height: 1,
    marginVertical: 12,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    marginVertical: 16,
    alignSelf: 'center',
  },
});

/**
 * Common styles for information screen containers and elements
 */
export const infoScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Should use theme values
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 32,
    width: '100%'
  },
  titleText: {
    fontSize: INFO_SCREEN_LAYOUT.TITLE_FONT_SIZE,
    fontWeight: 'bold',
    marginBottom: INFO_SCREEN_LAYOUT.TITLE_MARGIN_BOTTOM,
    color: '#000000', // Should use theme values
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 32,
  }
});

/**
 * Helper to get appropriate height for images based on screen height
 * 
 * @param screenHeight - Current screen height
 * @param percentage - Optional percentage override (default from layout constants)
 * @returns Calculated height for the image
 */
export function getImageHeight(screenHeight: number, percentage?: number): number {
  return screenHeight * (percentage || INFO_SCREEN_LAYOUT.IMAGE_HEIGHT_PERCENT);
} 