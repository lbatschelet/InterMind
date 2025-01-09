// src/screens/AssessmentScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OurNeighborhood from '~/assets/our-neighborhood.svg';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { ArrowLeft } from '~/src/lib/icons/ArrowLeft';
import { MOCK_SYMPTOMS_QUESTION, Question } from '~/src/types/assessment';
import { MultipleChoiceQuestion } from '../components/question-types/MultipleChoiceQuestion';
import { SingleChoiceQuestion } from '../components/question-types/SingleChoiceQuestion';
import type { RootStackParamList } from '../navigation/AppNavigator';

type AssessmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Assessment'>;

interface AssessmentScreenProps {
    navigation: AssessmentScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ navigation }) => {
    const [singleChoice, setSingleChoice] = useState<string>();
    const [multipleChoice, setMultipleChoice] = useState<string[]>([]);
    const question: Question = MOCK_SYMPTOMS_QUESTION;

    const handleMultipleChoice = (value: string) => {
        setMultipleChoice(prev => 
            prev.includes(value) 
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-4 py-2">
                    <Button
                        variant="ghost"
                        className="h-10 w-10 rounded-full"
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft className="text-primary" size={24} />
                    </Button>
                    <Text className="flex-1 text-center text-xl font-bold text-primary mr-10">
                        Assessment
                    </Text>
                </View>

                <View className="flex-1 px-4">
                    <Text className="text-xl font-bold mb-6 text-primary">
                        {question.questionText}
                    </Text>
                    
                    <View className="items-center mb-8">
                        <OurNeighborhood 
                            width={width * 0.8}
                            height={width * 0.8 * (628.236 / 763.895)}
                        />
                    </View>
                    
                    <View className="flex-1 justify-end">
                        {question.type === 'single_choice' ? (
                            <SingleChoiceQuestion
                                options={question.options}
                                selectedOption={singleChoice}
                                onSelect={setSingleChoice}
                            />
                        ) : (
                            <MultipleChoiceQuestion
                                options={question.options}
                                selectedOptions={multipleChoice}
                                onToggle={handleMultipleChoice}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default AssessmentScreen;
