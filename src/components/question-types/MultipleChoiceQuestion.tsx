import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Checkbox } from '~/src/components/ui/checkbox';
import { Text } from '~/src/components/ui/text';
import { Question } from '~/src/types/assessment';

interface MultipleChoiceQuestionProps {
    options: Question['options'];
    selectedOptions: string[];
    onToggle: (value: string) => void;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
    options,
    selectedOptions,
    onToggle
}) => {
    return (
        <View className="w-full" testID="multiple-choice-question">
            {options.map((option, index: number) => (
                <View key={option.value}>
                    <Button
                        variant={selectedOptions.includes(option.value) ? "default" : "outline"}
                        className={`w-full py-6 rounded-none border-0 flex-row justify-between items-center ${
                            selectedOptions.includes(option.value)
                                ? "bg-primary" 
                                : "bg-background"
                        }`}
                        onPress={() => onToggle(option.value)}
                    >
                        <Text 
                            className={`text-lg ${
                                selectedOptions.includes(option.value)
                                    ? "text-background font-bold" 
                                    : "text-primary"
                            }`}
                        >
                            {option.label}
                        </Text>
                        <Checkbox 
                            checked={selectedOptions.includes(option.value)}
                            onCheckedChange={() => onToggle(option.value)}
                            className={selectedOptions.includes(option.value) ? "border-background" : ""}
                        />
                    </Button>
                    {index < options.length - 1 && (
                        <View className="h-[1px] bg-border" />
                    )}
                </View>
            ))}
        </View>
    );
}; 