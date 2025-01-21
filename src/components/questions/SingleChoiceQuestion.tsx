import React from 'react';
import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import type { QuestionOption } from '~/src/types/Question';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

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
}: QuestionComponentProps) => {
    const options = question.options as QuestionOption[];
    
    const handleOptionPress = (index: number) => {
        const isFirstSelection = value === undefined || value === null;
        onChange(index);
        
        if (isFirstSelection && question.autoAdvance && onAutoAdvance) {
            onAutoAdvance();
        }
    };

    return (
        <View className="space-y-4">
            {options.map((option, index) => {
                // Sicherstellen, dass option.value existiert und konvertierbar ist
                const key = option.value != null ? option.value.toString() : index.toString();
                
                return (
                    <Button
                        key={key}
                        variant={value === index ? "default" : "outline"}
                        className={value === index ? "bg-accent" : ""}
                        onPress={() => handleOptionPress(index)}
                    >
                        <Text className={`text-lg ${value === index ? "text-primary" : "text-primary"}`}>
                            {option.label}
                        </Text>
                    </Button>
                );
            })}
        </View>
    );
});

/**
 * Single choice question implementation.
 * Handles selection of one option from multiple choices.
 */
export const SingleChoiceQuestion: QuestionComponent = {
    /**
     * Renders the single choice question component
     * @param props - Component props including question data and handlers
     */
    render: (props: QuestionComponentProps) => <SingleChoiceQuestionContent {...props} />,

    /**
     * Validates the selected option
     * @param value - The selected option index
     * @returns True if a valid option is selected
     */
    validate: (value: number) => typeof value === 'number' && value >= 0,

    /**
     * Provides the initial value
     * @returns null as initial value
     */
    getInitialValue: () => null
}; 