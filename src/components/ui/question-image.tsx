/**
 * @packageDocumentation
 * @module Components/UI
 * 
 * @summary
 * Component for displaying images in questions.
 * 
 * @remarks
 * - Supports both local SVGs and URL images
 * - Adapts responsively to screen size
 * - Provides fallback for images not found
 */

import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { getImage, isImageUrl, isRegisteredImage } from '~/src/lib/images';

// Get screen width for responsive sizing
const screenWidth = Dimensions.get('window').width;

interface QuestionImageProps {
  /**
   * Name of the image in the registry or URL of the image
   */
  imageSource: string;
  
  /**
   * Optional height of the image, default is 40% of screen width
   */
  imageHeight?: number;
  
  /**
   * Optional width of the image, default is 80% of screen width
   */
  imageWidth?: number;
  
  /**
   * Optional classes for the container element
   */
  className?: string;
}

/**
 * Component for displaying images in questions.
 * 
 * @param props - Component props
 * @returns JSX Element
 */
const QuestionImage: React.FC<QuestionImageProps> = ({ 
  imageSource, 
  imageHeight = screenWidth * 0.4, 
  imageWidth = screenWidth * 0.8,
  className = "my-4"
}) => {
  // If no image source is provided, don't render anything
  if (!imageSource) return null;

  // Check if it's a registered image in our registry
  if (isRegisteredImage(imageSource)) {
    const SvgComponent = getImage(imageSource);
    if (SvgComponent) {
      return (
        <View className={`items-center justify-center ${className}`}>
          <SvgComponent width={imageWidth} height={imageHeight} />
        </View>
      );
    }
  }
  
  // If it's a URL, display as an image
  if (isImageUrl(imageSource)) {
    return (
      <View className={`items-center justify-center ${className}`}>
        <Image
          source={{ uri: imageSource }}
          style={{ width: imageWidth, height: imageHeight, resizeMode: 'contain' }}
        />
      </View>
    );
  }
  
  // Fallback if the image was not found
  return null;
};

export default QuestionImage; 