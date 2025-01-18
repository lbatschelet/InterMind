import React from 'react';
import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

export const MultipleChoiceQuestion: QuestionComponent = {
    render: ({ question, value = [], onChange }: QuestionComponentProps) => {
        return (
            <View className="space-y-4">
                {(question.options as string[]).map((option, index) => (
                    <Button
                        key={index}
                        variant={value.includes(index) ? "default" : "outline"}
                        className={value.includes(index) ? "bg-accent" : ""}
                        onPress={() => {
                            const newValue = value.includes(index)
                                ? value.filter((i: number) => i !== index)
                                : [...value, index];
                            onChange(newValue);
                        }}
                    >
                        <Text className="text-lg text-primary">
                            {option}
                        </Text>
                    </Button>
                ))}
            </View>
        );
    },
    validate: (value: number[]) => Array.isArray(value) && value.length > 0,
    getInitialValue: () => []
}; 