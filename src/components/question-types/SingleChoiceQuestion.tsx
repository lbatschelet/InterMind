import { View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { Question } from '~/src/types/assessment';

interface SingleChoiceQuestionProps {
    options: Question['options'];
    selectedOption?: string;
    onSelect: (value: string) => void;
}

export const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
    options,
    selectedOption,
    onSelect
}) => {
    return (
        <View className="w-full" testID="single-choice-question">
            {options.map((option, index: number) => (
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