/**
 * Slider Question Component
 * ----------------------
 * Implements a slider question type where users can select
 * a numeric value within a defined range.
 * 
 * Features:
 * - Range-based input
 * - Min/max validation
 * - Step size control
 * - Custom labels
 * 
 * @module Components/Questions
 */

import Slider from '@react-native-community/slider';
import React from 'react';
import { View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import type { SliderQuestion as SliderQuestionType } from '~/src/types/questions';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

type SliderValue = number | null;

interface SliderQuestionProps extends Omit<QuestionComponentProps<SliderQuestionType, SliderValue>, 'question' | 'value' | 'onChange'> {
    question: SliderQuestionType;
    value: SliderValue;
    onChange: (value: SliderValue) => void;
}

/**
 * Component for rendering slider questions.
 * 
 * @component
 */
const SliderQuestionContent = React.memo(({ 
    question, 
    value, 
    onChange,
    onAutoAdvance 
}: SliderQuestionProps) => {
    const { min, max, step, labels } = question.options;
    
    const handleValueChange = (newValue: number) => {
        onChange(newValue);
        
        // Auto-advance wenn der Wert innerhalb der Validierungsgrenzen liegt
        if (question.autoAdvance && onAutoAdvance) {
            const isValid = (!question.validation?.min || newValue >= question.validation.min) &&
                          (!question.validation?.max || newValue <= question.validation.max);
            if (isValid) {
                onAutoAdvance();
            }
        }
    };

    return (
        <View className="space-y-6">
            <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">
                    {labels?.min ?? min}
                </Text>
                <Text className="text-sm text-gray-500">
                    {labels?.max ?? max}
                </Text>
            </View>
            
            <Slider
                value={value ?? min}
                onValueChange={handleValueChange}
                minimumValue={min}
                maximumValue={max}
                step={step}
                minimumTrackTintColor="#2563eb"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#2563eb"
            />
            
            <Text className="text-center text-lg">
                {value !== null ? value : 'Wählen Sie einen Wert'}
            </Text>
        </View>
    );
});

SliderQuestionContent.displayName = 'SliderQuestionContent';

/**
 * Slider question component.
 * 
 * Implements {@link QuestionComponent}
 * 
 * @remarks
 * Renders a slider input for numeric range selection.
 * Handles min/max validation and step size.
 */
export const SliderQuestion: QuestionComponent<SliderQuestionType, SliderValue> = {
    /**
     * Renders the slider question component
     * @param {QuestionComponentProps<SliderQuestionType, SliderValue>} props - Component properties
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps<SliderQuestionType, SliderValue>) => {
        if (props.question.type !== 'slider') {
            throw new Error('SliderQuestion can only render slider questions');
        }
        return <SliderQuestionContent {...props} />;
    },

    /**
     * Validates the slider value
     * @param {SliderValue} value - The selected numeric value
     * @param {SliderQuestionType} question - The question being validated
     * @returns {boolean} True if value is within valid range
     */
    validate: (value: SliderValue, question?: SliderQuestionType): boolean => {
        if (value === null) return false;
        if (typeof value !== 'number') return false;
        
        // Prüfe min/max Validierung falls vorhanden
        if (question?.validation?.min !== undefined && value < question.validation.min) return false;
        if (question?.validation?.max !== undefined && value > question.validation.max) return false;
        
        // Prüfe ob der Wert innerhalb der Slider-Grenzen liegt
        if (question?.options) {
            if (value < question.options.min || value > question.options.max) return false;
        }
        
        return true;
    },

    /**
     * Provides the initial value
     * @returns {SliderValue} null as initial value
     */
    getInitialValue: () => null
}; 