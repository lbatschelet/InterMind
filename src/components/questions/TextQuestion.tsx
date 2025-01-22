/**
 * Text Question Component
 * --------------------
 * Implements a text question type where users can enter
 * free-form text responses.
 * 
 * Features:
 * - Multi-line text input
 * - Real-time validation
 * - Pattern matching support
 * - Keyboard handling
 * 
 * @module Components/Questions
 */

import React from 'react';
import { Keyboard, Text, View } from 'react-native';
import { TextArea } from '~/src/components/ui/textarea';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

/**
 * Component for rendering text-based questions.
 * Provides a text input field with keyboard handling.
 * 
 * @component
 */
const TextQuestionContent = React.memo(({ 
    question, 
    value = '', 
    onChange,
    onAutoAdvance 
}: QuestionComponentProps) => {
    const currentValue = value || '';

    /**
     * Handles the completion of text input
     * Dismisses keyboard and advances to next question if text is not empty
     */
    const handleDone = () => {
        Keyboard.dismiss();
        if (currentValue.trim().length > 0 && question.autoAdvance && onAutoAdvance) {
            onAutoAdvance();
        }
    };

    const isValid = !question.validation?.pattern || 
        new RegExp(question.validation.pattern).test(currentValue);

    return (
        <View className="space-y-4 flex-1" onTouchStart={Keyboard.dismiss}>
            {question.description && (
                <Text className="text-sm text-gray-500">
                    {question.description}
                </Text>
            )}
            <TextArea
                value={currentValue}
                onChangeText={onChange}
                placeholder="Type your answer here..."
                className="min-h-[120px] text-base"
                multiline
                returnKeyType="done"
                onSubmitEditing={handleDone}
                blurOnSubmit
                autoComplete="off"
                autoCorrect={false}
                style={!isValid ? { borderColor: 'red' } : undefined}
            />
        </View>
    );
});

/**
 * Text question component.
 * 
 * Implements {@link QuestionComponent}
 * 
 * @remarks
 * Renders a text input field with configurable validation.
 * Supports pattern matching and length limits.
 */
export const TextQuestion: QuestionComponent = {
    /**
     * Renders the text question component
     * @param {QuestionComponentProps} props - Component props including question data and handlers
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps) => <TextQuestionContent {...props} />,

    /**
     * Validates the text input
     * @param {string} value - The entered text
     * @returns {boolean} True if the text is non-empty after trimming
     */
    validate: (value: string) => {
        return typeof value === 'string' && value.trim().length > 0;
    },

    /**
     * Provides the initial value for the text input
     * @returns {string} An empty string as the default value
     */
    getInitialValue: () => ''
}; 