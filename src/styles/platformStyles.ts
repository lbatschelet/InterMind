/**
 * Platform-specific styles
 * 
 * This module provides platform-specific style configurations to handle 
 * UI differences between iOS and Android.
 */

import { Platform } from 'react-native';

/**
 * Platform-specific style values
 */
export const platformStyles = {
  /**
   * Margin top for content screens with full-width images at the top
   * - On iOS: uses negative margin to optimize space usage
   * - On Android: uses positive margin to prevent header overlap
   */
  contentScrollViewMarginTop: Platform.OS === 'ios' ? '-mt-16' : 'mt-2',
  
  /**
   * Additional margin adjustments for screens with different header configurations
   */
  headerImageMarginTop: Platform.OS === 'ios' ? 'mt-0' : 'mt-4',
}; 