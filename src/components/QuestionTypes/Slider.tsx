/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Smooth slider question component with labeled endpoints.
 * 
 * @remarks
 * - Uses a continuous scale (0.0 → 1.0).
 * - Displays only labels, no numbers.
 * - The user must confirm the selection using the "Next" button in SurveyScreen.
 * 
 * @example
 * // SQL statement to insert a new slider question into the database:
 * INSERT INTO questions (type, text, options, category) VALUES (
 *   'slider',
 *   'How satisfied are you with the service?',
 *   '{"values": ["Dissatisfied", "Neutral", "Very satisfied"]}',
 *   'feedback'
 * );
 * 
 * // Explanation:
 * // - The type must be 'slider'
 * // - options must be a JSONB with a "values" array
 * // - The values array should have minimum 2 entries (min and max labels) and maximum 3 entries
 * // - For 3 values: first is min, second is neutral/middle, third is max
 * // - The component displays only the min and max labels on the UI
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Slider } from "@miblanchard/react-native-slider"; // Bessere Slider-Implementation für Android
import { Text } from "../ui/text";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";

const log = createLogger("SliderQuestion");

// Styles für den Slider
const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: 40
  },
  labelsContainer: {
    width: "100%",
    position: "relative",
    marginTop: 10,
    height: 30,
  },
  label: {
    position: "absolute",
    textAlign: "center",
    width: 70,
    fontSize: 12
  },
  thumbStyle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196F3"
  },
  trackStyle: {
    height: 4,
    borderRadius: 2
  }
});

/**
 * Smooth slider question component.
 * 
 * @component
 * @param {QuestionComponentProps<"slider">} props - Component props.
 * @param {object} props.question - The question data.
 * @param {function} props.onNext - Function to submit the selected slider value.
 * @param {number} props.initialValue - Optional initial value for previously answered questions.
 */
export const SliderQuestion: React.FC<QuestionComponentProps<"slider"> & {
  initialValue?: number;
}> = ({ 
  question, 
  onNext,
  initialValue
}) => {
  // Validate input values
  if (!question?.options?.values || question.options.values.length < 2) {
    log.error("Invalid question data", { question });
    return null; // Prevent rendering if data is malformed
  }

  // Extract labels safely
  const labels = question.options.values;
  const minLabel = labels[0] ?? "Min"; // Default fallback
  const maxLabel = labels[labels.length - 1] ?? "Max"; // Default fallback

  // Track current question ID to prevent value leakage between questions
  const questionIdRef = useRef<string>(question.id);
  
  // Track user selection (default to center position or previous value)
  const [selectedValue, setSelectedValue] = useState<number>(
    initialValue !== undefined && questionIdRef.current === question.id
      ? initialValue 
      : 0.5
  );

  // Flag to track whether we've already sent the initial value
  const initialValueSentRef = useRef<boolean>(initialValue !== undefined);
  
  // Verwenden Sie einen Timer, um die Aktualisierungen bei Wertänderungen zu drosseln
  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update the question ID ref and reset value if question changes
  useEffect(() => {
    if (questionIdRef.current !== question.id) {
      log.debug("Question changed, resetting slider state", { 
        oldQuestionId: questionIdRef.current,
        newQuestionId: question.id
      });
      
      questionIdRef.current = question.id;
      initialValueSentRef.current = initialValue !== undefined;
      
      // Use initialValue for this specific question or default to center
      setSelectedValue(initialValue !== undefined ? initialValue : 0.5);
      
      // Only submit the initial value if it exists for this question
      if (initialValue !== undefined) {
        log.debug("Using existing value for new question", { 
          questionId: question.id,
          value: initialValue
        });
        onNext(initialValue);
      }
    }
  }, [question.id, initialValue, onNext]);

  // Submit default value (0.5) if no initial value was provided
  useEffect(() => {
    // If we haven't sent any value yet for this question, send the default
    if (!initialValueSentRef.current) {
      log.debug("Submitting default value (0.5) for slider question", { 
        questionId: question.id
      });
      onNext(selectedValue);
      initialValueSentRef.current = true;
    }
    
    // Cleanup-Timer beim Unmount
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, [question.id, selectedValue, onNext]);

  // Update parent component with current value, aber drossele die Updates
  const handleValueChange = useCallback((value: number | Array<number>) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setSelectedValue(newValue);
    
    // Löschen des vorherigen Timers
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current);
    }
    
    // Verzögere das Senden von Aktualisierungen an die übergeordnete Komponente
    changeTimeoutRef.current = setTimeout(() => {
      log.debug("Slider value updated", { questionId: question.id, value: newValue });
      onNext(newValue);
      initialValueSentRef.current = true;
    }, 50); // Kurze Verzögerung für bessere Performance
  }, [question.id, onNext]);

  // Callback für das Beenden des Slidens, sendet den endgültigen Wert
  const handleSlidingComplete = useCallback((value: number | Array<number>) => {
    const finalValue = Array.isArray(value) ? value[0] : value;
    log.debug("Sliding completed", { questionId: question.id, value: finalValue });
    onNext(finalValue);
    initialValueSentRef.current = true;
  }, [question.id, onNext]);

  return (
    <View className="w-full space-y-6">
      {/* Slider component mit verbesserter Implementation für Android */}
      <Slider
        containerStyle={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={undefined}
        value={selectedValue}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#BDBDBD"
        thumbTintColor="#2196F3"
        thumbStyle={styles.thumbStyle}
        trackStyle={styles.trackStyle}
        animateTransitions
      />

      {/* Labels on both sides */}
      <View className="flex-row justify-between px-4">
        <Text className="text-lg">{minLabel}</Text>
        <Text className="text-lg">{maxLabel}</Text>
      </View>
    </View>
  );
};

export default SliderQuestion;
