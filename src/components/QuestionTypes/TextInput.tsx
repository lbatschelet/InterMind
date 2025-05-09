/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Free-text input question component.
 * 
 * @remarks
 * - Users enter a free-text response.
 * - The response is submitted with the "Next" button in SurveyScreen.
 */

import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { Input } from "~/src/components/ui/input";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";
import { useLanguage } from "~/src/contexts/LanguageContext";

// Logger for debugging purposes
const log = createLogger("TextInputQuestion");

/**
 * Free-text input question component.
 * 
 * @component
 * @param {QuestionComponentProps<"text">} props - Component props.
 * @param {object} props.question - The question data.
 * @param {function} props.onNext - Function to submit the entered text.
 * @param {string} props.initialValue - Optional initial text for previously answered questions.
 */
const TextInputQuestion: React.FC<QuestionComponentProps<"text"> & {
  initialValue?: string;
}> = ({ 
  question, 
  onNext,
  initialValue
}) => {
  // Initialize with previous answer if available
  const [text, setText] = useState(initialValue || "");
  const { t } = useLanguage();

  // Submit the initial value if one exists
  useEffect(() => {
    if (initialValue) {
      log.debug("Restoring previous text input", { 
        questionId: question.id, 
        text: initialValue 
      });
      onNext(initialValue);
    }
  }, [initialValue, onNext, question.id]);

  // Update parent with current text whenever it changes
  const handleTextChange = (newText: string) => {
    setText(newText);
    log.debug("Text updated", { questionId: question.id, text: newText });
    onNext(newText);
  };

  return (
    <View className="space-y-4 w-full">
      {/* Texteingabefeld darunter */}
      <Input
        placeholder={t('survey.textInputPlaceholder')}
        value={text}
        onChangeText={handleTextChange}
        multiline={true}
        numberOfLines={4}
        className="min-h-[100px] text-base p-3"
        textAlignVertical="top"
      />
    </View>
  );
};

export default TextInputQuestion;
