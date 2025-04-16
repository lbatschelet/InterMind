/**
 * @packageDocumentation
 * @module Components
 * 
 * @summary
 * Komponente zur Anzeige von Bildern in Fragen.
 * 
 * @remarks
 * - Unterstützt sowohl lokale SVGs als auch URL-Bilder
 * - Passt sich responsiv an die Bildschirmgröße an
 * - Fallback für nicht gefundene Bilder
 */

import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { getImage, isImageUrl, isRegisteredImage } from '~/src/lib/images';

// Holt Bildschirmbreite für responsive Größe
const screenWidth = Dimensions.get('window').width;

interface QuestionImageProps {
  /**
   * Name des Bildes in der Registry oder URL des Bildes
   */
  imageSource: string;
  
  /**
   * Optionale Höhe des Bildes, Standard ist 40% der Bildschirmbreite
   */
  imageHeight?: number;
  
  /**
   * Optionale Breite des Bildes, Standard ist 80% der Bildschirmbreite
   */
  imageWidth?: number;
  
  /**
   * Optionale Klassen für das Container-Element
   */
  className?: string;
}

/**
 * Komponente zur Anzeige von Bildern in Fragen.
 * 
 * @param props - Komponentenprops
 * @returns JSX-Element
 */
const QuestionImage: React.FC<QuestionImageProps> = ({ 
  imageSource, 
  imageHeight = screenWidth * 0.4, 
  imageWidth = screenWidth * 0.8,
  className = "my-4"
}) => {
  // Wenn keine Bildquelle vorhanden, nichts anzeigen
  if (!imageSource) return null;

  // Prüfen, ob es ein registriertes Bild ist
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
  
  // Falls es eine URL ist, als Bild anzeigen
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
  
  // Fallback, wenn das Bild nicht gefunden wurde
  return null;
};

export default QuestionImage; 