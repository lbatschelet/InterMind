/**
 * Component for rendering single-choice questions in assessments.
 * @module
 */

import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import type { Question } from '~/src/types/assessment';

/**
 * Base props that all question components share.
 */
interface QuestionComponentProps {
    options: Question['options'];
    onSelect: (value: string) => void;
}

/**
 * Props for the SingleChoiceQuestion component.
 * 
 * @interface
 * @extends {QuestionComponentProps}
 * @property {string} [selectedOption] - Currently selected option's value (if any)
 */
interface SingleChoiceQuestionProps extends QuestionComponentProps {
    selectedOption?: string;
}

/**
 * A component that renders a single-choice question with multiple options.
 * 
 * @component
 * @example
 * ```tsx
 * const options = [
 *   { value: 'option1', label: 'First Option' },
 *   { value: 'option2', label: 'Second Option' }
 * ];
 * 
 * <SingleChoiceQuestion
 *   options={options}
 *   selectedOption="option1"
 *   onSelect={(value) => console.log(`Selected: ${value}`)}
 * />
 * ```
 */
export const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
    options,
    selectedOption,
    onSelect
}) => {
    if (!onSelect) {
        console.warn('SingleChoiceQuestion: onSelect prop is required');
        return null;
    }
    
    return (
        <View className="w-full" testID="single-choice-question">
            {options.map((option: Question['options'][0], index: number) => (
                <View key={option.value}>
                    <Button
                        variant={selectedOption === option.value ? "default" : "outline"}
                        className={`w-full py-6 rounded-none border-0 ${
                            selectedOption === option.value 
                                ? "bg-primary" 
                                : "bg-background"
                        }`}
                        onPress={() => onSelect(option.value)}
                    >
                        <Text 
                            className={`text-lg ${
                                selectedOption === option.value 
                                    ? "text-background font-bold" 
                                    : "text-primary"
                            }`}
                        >
                            {option.label}
                        </Text>
                    </Button>
                    {index < options.length - 1 && (
                        <View className="h-[1px] bg-border" />
                    )}
                </View>
            ))}
        </View>
    );
}; 