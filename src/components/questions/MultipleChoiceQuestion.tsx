/**
 * Multiple Choice Question Component
 * ------------------------------
 * Implements a multiple-choice question type where users can select
 * multiple options from a list of choices.
 * 
 * Features:
 * - Checkbox style selection
 * - Validation for min/max selections
 * - Immediate feedback
 * - Accessible button controls
 * 
 * @module Components/Questions
 */

import React from 'react';
import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import type { MultipleChoiceQuestion as MultipleChoiceQuestionType, QuestionOption } from '~/src/types/questions';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

type MultipleChoiceValue = number[];

interface MultipleChoiceProps extends Omit<QuestionComponentProps<MultipleChoiceQuestionType, MultipleChoiceValue>, 'question' | 'value' | 'onChange'> {
    question: MultipleChoiceQuestionType;
    value: MultipleChoiceValue;
    onChange: (value: MultipleChoiceValue) => void;
}

/**
 * Component for rendering multiple choice questions.
 * 
 * @component
 */
const MultipleChoiceQuestionContent = React.memo(({ 
    question, 
    value, 
    onChange,
    onAutoAdvance 
}: MultipleChoiceProps) => {
    const handleOptionPress = (index: number) => {
        const newValue = value.includes(index)
            ? value.filter(v => v !== index)
            : [...value, index];
        
        onChange(newValue);
        
        // Auto-advance wenn die maximale Anzahl erreicht ist
        if (question.validation?.max && newValue.length === question.validation.max && onAutoAdvance) {
            onAutoAdvance();
        }
    };

    return (
        <View className="space-y-4">
            {question.options.map((option: QuestionOption, index: number) => {
                const isSelected = value.includes(index);
                const key = option.value != null ? option.value.toString() : index.toString();
                
                return (
                    <Button
                        key={key}
                        variant={isSelected ? "default" : "outline"}
                        className={isSelected ? "bg-accent" : ""}
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

MultipleChoiceQuestionContent.displayName = 'MultipleChoiceQuestionContent';

/**
 * Multiple choice question component.
 * 
 * Implements {@link QuestionComponent}
 * 
 * @remarks
 * Renders a list of options where multiple can be selected.
 * Handles validation for minimum and maximum selections.
 */
export const MultipleChoiceQuestion: QuestionComponent<MultipleChoiceQuestionType, MultipleChoiceValue> = {
    /**
     * Renders the multiple choice question component
     * @param {QuestionComponentProps<MultipleChoiceQuestionType, MultipleChoiceValue>} props - Component properties
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps<MultipleChoiceQuestionType, MultipleChoiceValue>) => {
        if (props.question.type !== 'multiple_choice') {
            throw new Error('MultipleChoiceQuestion can only render multiple choice questions');
        }
        return <MultipleChoiceQuestionContent {...props} />;
    },

    /**
     * Validates the selected options
     * @param {MultipleChoiceValue} value - The selected option indices
     * @param {MultipleChoiceQuestionType} question - The question being validated
     * @returns {boolean} True if selection count is within valid range
     */
    validate: (value: MultipleChoiceValue, question?: MultipleChoiceQuestionType): boolean => {
        if (!Array.isArray(value)) return false;
        if (value.some(v => typeof v !== 'number' || v < 0)) return false;
        
        // Prüfe min/max Validierung falls vorhanden
        const min = question?.validation?.min ?? 1;
        const max = question?.validation?.max;
        
        if (value.length < min) return false;
        if (max !== undefined && value.length > max) return false;
        
        return true;
    },

    /**
     * Provides the initial value
     * @returns {MultipleChoiceValue} Empty array as initial value
     */
    getInitialValue: () => []
}; 