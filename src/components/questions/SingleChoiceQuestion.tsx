import React from 'react';
import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

export const SingleChoiceQuestion: QuestionComponent = {
    render: ({ question, value, onChange }: QuestionComponentProps) => {
        return (
            <View className="space-y-4">
                {(question.options as string[]).map((option, index) => (
                    <Button
                        key={index}
                        variant={value === index ? "default" : "outline"}
                        className={value === index ? "bg-accent" : ""}
                        onPress={() => onChange(index)}
                    >
                        <Text className={`text-lg ${value === index ? "text-primary" : "text-primary"}`}>
                            {option}
                        </Text>
                    </Button>
                ))}
            </View>
        );
    },
    validate: (value: number) => typeof value === 'number' && value >= 0,
    getInitialValue: () => null
}; 