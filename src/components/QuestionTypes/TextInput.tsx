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

import React, { useState } from "react";
import { TextInput, View } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";

// Logger for debugging purposes
const log = createLogger("TextInputQuestion");

/**
 * Free-text input question component.
 * 
 * @component
 * @param {QuestionComponentProps<"text">} props - Component props.
 * @param {object} props.question - The question data.
 * @param {function} props.onNext - Function to submit the entered text.
 */
const TextInputQuestion: React.FC<QuestionComponentProps<"text">> = ({ question, onNext }) => {
  const [text, setText] = useState("");

  // Update parent with current text whenever it changes
  const handleTextChange = (newText: string) => {
    setText(newText);
    log.debug("Text updated", { questionId: question.id, text: newText });
    onNext(newText);
  };

  return (
    <View className="space-y-4">
      {/* Text Input */}
      <TextInput
        className="border p-2 rounded-md"
        placeholder="Enter your response..."
        value={text}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

export default TextInputQuestion;
