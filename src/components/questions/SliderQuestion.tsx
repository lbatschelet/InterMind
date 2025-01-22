/**
 * Slider Question Component
 * ----------------------
 * Implements a slider question type where users can select
 * a value within a defined range using a slider control.
 * 
 * Features:
 * - Continuous value selection
 * - Min/Max range support
 * - Step size configuration
 * - Real-time value updates
 * 
 * @module Components/Questions
 */

import Slider from '@react-native-community/slider';
import React from 'react';
import { View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import type { SliderConfig } from '~/src/types/Question';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

/**
 * Component for rendering slider-based questions.
 * Allows users to select a value within a specified range.
 * 
 * @component
 */
const SliderQuestionContent = React.memo(({ 
    question, 
    value = 0, 
    onChange,
    onAutoAdvance 
}: QuestionComponentProps) => {
    const config = question.options as SliderConfig;

    return (
        <View className="space-y-4">
            <Text className="text-center text-lg text-primary">
                {value}
            </Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                value={value}
                onValueChange={onChange}
                minimumValue={config.min}
                maximumValue={config.max}
                step={config.step}
                minimumTrackTintColor="#2563eb"
                maximumTrackTintColor="#94a3b8"
            />
            {config.labels && (
                <View className="flex-row justify-between px-2">
                    {config.labels.min && (
                        <Text className="text-sm text-gray-500">{config.labels.min}</Text>
                    )}
                    {config.labels.max && (
                        <Text className="text-sm text-gray-500">{config.labels.max}</Text>
                    )}
                </View>
            )}
        </View>
    );
});

/**
 * Slider question component.
 * 
 * Implements {@link QuestionComponent}
 * 
 * @remarks
 * Renders a slider input with configurable range and step size.
 * Supports labels and validation of min/max values.
 */
export const SliderQuestion: QuestionComponent = {
    /**
     * Renders the slider question component
     * @param {QuestionComponentProps} props - Component props including question data and handlers
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps) => <SliderQuestionContent {...props} />,

    /**
     * Validates the slider value
     * @param {number} value - The selected numeric value
     * @returns {boolean} True if the value is a valid number
     */
    validate: (value: number) => typeof value === 'number',

    /**
     * Provides the initial value for the slider
     * @returns {number} The default slider value (0)
     */
    getInitialValue: () => 0
}; 