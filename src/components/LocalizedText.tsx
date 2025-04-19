import React from 'react';
import { Text } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface LocalizedTextProps {
  id: string;
  style?: any;
}

/**
 * Komponente zur Anzeige von lokalisierten Texten
 * 
 * @param id Der Übersetzungsschlüssel in der Form "namespace.key"
 * @param style Optionale Styling-Properties für den Text
 */
export const LocalizedText: React.FC<LocalizedTextProps> = ({ id, style }) => {
  const { t } = useLanguage();
  
  return (
    <Text style={style}>
      {t(id)}
    </Text>
  );
}; 