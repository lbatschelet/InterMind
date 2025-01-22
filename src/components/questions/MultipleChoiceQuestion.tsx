/**
 * Multiple Choice Question Component
 * -------------------------------
 * Implements a multiple-choice question type where users can select
 * multiple options from a list of choices.
 * 
 * Features:
 * - Checkbox style selection
 * - Multiple selection support
 * - Array-based value handling
 * - Accessible button controls
 * 
 * @module Components/Questions
 */

import React from 'react';
import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import type { QuestionOption } from '~/src/types/Question';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

/**
 * Component for rendering multiple choice questions.
 * Supports selection of multiple options with validation limits.
 * 
 * @component
 */
const MultipleChoiceQuestionContent = React.memo(({ 
    question, 
    value = [], 
    onChange 
}: QuestionComponentProps) => {
    const options = question.options as QuestionOption[];
    const selectedIndices = new Set(value as number[]);

    const handleOptionPress = (index: number) => {
        const newSelection = new Set(selectedIndices);
        if (newSelection.has(index)) {
            newSelection.delete(index);
        } else {
            // Check validation limits
            if (question.validation?.max && newSelection.size >= question.validation.max) {
                return;
            }
            newSelection.add(index);
        }
        onChange(Array.from(newSelection));
    };

    return (
        <View className="space-y-4">
            {options.map((option, index) => (
                <Button
                    key={option.value.toString()}
                    variant={selectedIndices.has(index) ? "default" : "outline"}
                    className={selectedIndices.has(index) ? "bg-accent" : ""}
                    onPress={() => handleOptionPress(index)}
                >
                    <Text className={`text-lg ${selectedIndices.has(index) ? "text-primary" : "text-primary"}`}>
                        {option.label}
                    </Text>
                </Button>
            ))}
        </View>
    );
});

/**
 * Multiple choice question component.
 * 
 * Implements {@link QuestionComponent}
 * 
 * @remarks
 * Renders a list of options where multiple can be selected.
 * Handles validation of minimum/maximum selections.
 */
export const MultipleChoiceQuestion: QuestionComponent = {
    /**
     * Renders the multiple choice question component
     * @param {QuestionComponentProps} props - Component properties
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps) => <MultipleChoiceQuestionContent {...props} />,

    /**
     * Validates the selected options
     * @param {number[]} value - Array of selected option indices
     * @returns {boolean} True if at least one option is selected
     */
    validate: (value: number[]) => Array.isArray(value) && value.length > 0,

    /**
     * Provides the initial value
     * @returns {Array} Empty array as initial value
     */
    getInitialValue: () => []
}; 