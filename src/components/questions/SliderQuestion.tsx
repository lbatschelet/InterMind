import Slider from '@react-native-community/slider';
import React from 'react';
import { View } from 'react-native';
import { Text } from '~/src/components/ui/text';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

export const SliderQuestion: QuestionComponent = {
    render: ({ question, value = 0, onChange }: QuestionComponentProps) => {
        const options = question.options as { min: number; max: number; step: number };
        return (
            <View className="space-y-4">
                <Text className="text-center text-lg text-primary">
                    {value}
                </Text>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={options.min}
                    maximumValue={options.max}
                    step={options.step}
                    value={value}
                    onValueChange={onChange}
                    minimumTrackTintColor="#2563eb"
                    maximumTrackTintColor="#94a3b8"
                />
            </View>
        );
    },
    validate: (value: number) => typeof value === 'number',
    getInitialValue: () => 0
}; 