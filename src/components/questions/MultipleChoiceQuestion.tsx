import React from 'react';
import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import type { QuestionOption } from '~/src/types/Question';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

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
            // Prüfe Validation Limits
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

export const MultipleChoiceQuestion: QuestionComponent = {
    render: (props: QuestionComponentProps) => <MultipleChoiceQuestionContent {...props} />,
    validate: (value: number[]) => Array.isArray(value) && value.length > 0,
    getInitialValue: () => []
}; 