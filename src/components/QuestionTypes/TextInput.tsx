/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Free-text input question component.
 * 
 * @remarks
 * - Users enter a free-text response.
 * - The response is submitted only after confirming with the "Next" button.
 */

import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";

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

  return (
    <View className="space-y-4">
      {/* Question text */}
      <Text className="text-lg font-medium text-center">{question.text}</Text>

      {/* Text Input */}
      <TextInput
        className="border p-2 rounded-md"
        placeholder="Enter your response..."
        value={text}
        onChangeText={setText} // Updates local state only
      />

      {/* Next Button */}
      <Button onPress={() => onNext(text)}>Next</Button>
    </View>
  );
};

export default TextInputQuestion;
