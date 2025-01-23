/**
 * Single Choice Question Component
 * ------------------------------
 * Implements a single-choice question type where users can select
 * exactly one option from a list of choices.
 * 
 * Features:
 * - Radio button style selection
 * - Auto-advance support
 * - Immediate feedback
 * - Accessible button controls
 * 
 * @module Components/Questions
 */

import React from 'react';
import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { debugLog } from '~/src/config/debug';
import type { QuestionOption, SingleChoiceQuestion as SingleChoiceQuestionType } from '~/src/types/questions';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

type SingleChoiceValue = number | null;

interface SingleChoiceProps extends Omit<QuestionComponentProps<SingleChoiceQuestionType, SingleChoiceValue>, 'question' | 'value' | 'onChange'> {
    question: SingleChoiceQuestionType;
    value: SingleChoiceValue;
    onChange: (value: SingleChoiceValue) => void;
}

/**
 * Component for rendering single choice questions.
 * Automatically advances to next question on first selection.
 * 
 * @component
 */
const SingleChoiceQuestionContent = React.memo(({ 
    question, 
    value, 
    onChange,
    onAutoAdvance 
}: SingleChoiceProps) => {
    debugLog('ui', 'SingleChoiceQuestion received:', {
        questionType: question.type,
        options: question.options,
        value
    });

    const handleOptionPress = (index: number) => {
        const isFirstSelection = value === null;
        onChange(index);
        
        if (isFirstSelection && question.autoAdvance && onAutoAdvance) {
            onAutoAdvance();
        }
    };

    if (!Array.isArray(question.options)) {
        debugLog('services', 'Options are not an array:', question.options);
        return null;
    }

    return (
        <View className="space-y-4">
            {question.options.map((option: QuestionOption, index: number) => {
                debugLog('ui', 'Rendering option:', { index, option });
                const key = option.value != null ? option.value.toString() : index.toString();
                
                return (
                    <Button
                        key={key}
                        variant={value === index ? "default" : "outline"}
                        className={value === index ? "bg-accent" : ""}
                        onPress={() => handleOptionPress(index)}
                    >
                        <Text className="text-lg">
                            {option.label || 'Keine Beschriftung'}
                        </Text>
                    </Button>
                );
            })}
        </View>
    );
});

SingleChoiceQuestionContent.displayName = 'SingleChoiceQuestionContent';

/**
 * Single choice question component.
 * 
 * Implements {@link QuestionComponent}
 * 
 * @remarks
 * Renders a list of options where exactly one can be selected.
 * Handles validation and auto-advance on selection.
 */
export const SingleChoiceQuestion: QuestionComponent<SingleChoiceQuestionType, SingleChoiceValue> = {
    /**
     * Renders the single choice question component
     * @param {QuestionComponentProps<SingleChoiceQuestionType, SingleChoiceValue>} props - Component properties
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps<SingleChoiceQuestionType, SingleChoiceValue>) => {
        if (props.question.type !== 'single_choice') {
            throw new Error('SingleChoiceQuestion can only render single choice questions');
        }
        return <SingleChoiceQuestionContent {...props} />;
    },

    /**
     * Validates the selected option
     * @param {SingleChoiceValue} value - The selected option index
     * @returns {boolean} True if a valid option is selected
     */
    validate: (value: SingleChoiceValue): boolean => {
        if (value === null) return false;
        if (typeof value !== 'number' || value < 0) return false;
        return true;
    },

    /**
     * Provides the initial value
     * @returns {SingleChoiceValue} null as initial value
     */
    getInitialValue: () => null
}; 