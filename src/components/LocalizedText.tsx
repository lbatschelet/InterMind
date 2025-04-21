/**
 * @packageDocumentation
 * @module Components
 * 
 * @summary
 * Component for displaying localized text.
 * 
 * @remarks
 * Uses the LanguageContext to translate text keys into the current language.
 */

import React from 'react';
import { Text } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface LocalizedTextProps {
  /**
   * Translation key in the format "namespace.key"
   */
  id: string;
  
  /**
   * Optional styling properties for the text
   */
  style?: any;
}

/**
 * Component for displaying localized text based on translation keys.
 *
 * @param props - Component props
 * @param props.id - Translation key in the format "namespace.key"
 * @param props.style - Optional styling properties for the text
 * @returns JSX Element
 */
export const LocalizedText: React.FC<LocalizedTextProps> = ({ id, style }) => {
  const { t } = useLanguage();
  
  return (
    <Text style={style}>
      {t(id)}
    </Text>
  );
}; 