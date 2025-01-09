/**
 * Component for rendering multiple-choice questions in assessments.
 * @module
 */

import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { Check } from '~/src/lib/icons/Check';
import type { Question } from '~/src/types/assessment';

/**
 * Base props that all question components share.
 */
interface QuestionComponentProps {
    options: Question['options'];
    onSelect: (value: string) => void;
}

/**
 * Props for the MultipleChoiceQuestion component.
 * 
 * @interface
 * @extends {QuestionComponentProps}
 * @property {string[]} selectedOptions - Array of currently selected option values
 */
interface MultipleChoiceQuestionProps extends QuestionComponentProps {
    selectedOptions: string[];
}

/**
 * A component that renders a multiple-choice question with multiple selectable options.
 * Each option can be independently selected/deselected and shows a checkbox indicator.
 * 
 * @component
 * @example
 * ```tsx
 * const options = [
 *   { value: 'option1', label: 'First Option' },
 *   { value: 'option2', label: 'Second Option' }
 * ];
 * 
 * <MultipleChoiceQuestion
 *   options={options}
 *   selectedOptions={['option1']}
 *   onSelect={(value) => {
 *     // Toggle the selected value
 *     const newSelected = selectedOptions.includes(value)
 *       ? selectedOptions.filter(v => v !== value)
 *       : [...selectedOptions, value];
 *     setSelectedOptions(newSelected);
 *   }}
 * />
 * ```
 */
export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
    options,
    selectedOptions,
    onSelect
}) => {
    if (!onSelect) {
        console.warn('MultipleChoiceQuestion: onSelect prop is required');
        return null;
    }

    return (
        <View className="w-full" testID="multiple-choice-question">
            {options.map((option: Question['options'][0], index: number) => (
                <View key={option.value}>
                    <Button
                        variant={selectedOptions.includes(option.value) ? "default" : "outline"}
                        className={`w-full py-6 rounded-none border-0 ${
                            selectedOptions.includes(option.value)
                                ? "bg-primary"
                                : "bg-background"
                        }`}
                        onPress={() => onSelect(option.value)}
                    >
                        <View className="flex-row items-center justify-between w-full">
                            <Text
                                className={`text-lg ${
                                    selectedOptions.includes(option.value)
                                        ? "text-background font-bold"
                                        : "text-primary"
                                }`}
                            >
                                {option.label}
                            </Text>
                            {selectedOptions.includes(option.value) && (
                                <Check className="text-background" size={24} />
                            )}
                        </View>
                    </Button>
                    {index < options.length - 1 && (
                        <View className="h-[1px] bg-border" />
                    )}
                </View>
            ))}
        </View>
    );
}; 