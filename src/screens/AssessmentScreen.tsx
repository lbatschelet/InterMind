// src/screens/AssessmentScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OurNeighborhood from '~/assets/our-neighborhood.svg';
import { Button } from '~/src/components/ui/button';
import { Label } from '~/src/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/src/components/ui/radio-group';
import { Text } from '~/src/components/ui/text';
import { ArrowLeft } from '~/src/lib/icons/ArrowLeft';
import { MOCK_QUESTION, Question } from '~/src/types/assessment';
import type { RootStackParamList } from '../navigation/AppNavigator';

type AssessmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Assessment'>;

interface AssessmentScreenProps {
    navigation: AssessmentScreenNavigationProp;
}

const { width } = Dimensions.get('window');

function RadioGroupItemWithLabel({
  value,
  label,
  onLabelPress,
}: {
  value: string;
  label: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={'flex-row gap-2 items-center'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {label}
      </Label>
    </View>
  );
}

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ navigation }) => {
    const [mood, setMood] = useState<string | undefined>(undefined);
    const question: Question = MOCK_QUESTION;

    function onLabelPress(value: string) {
        return () => {
            setMood(value);
        };
    }

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
                    <Text className="text-xl font-bold mb-6 text-primary pt-12">
                        {question.questionText}
                    </Text>
                    
                    <View className="items-center mb-8">
                        <OurNeighborhood 
                            width={width * 0.8}
                            height={width * 0.8 * (628.236 / 763.895)}
                        />
                    </View>
                    
                    <View className="flex-1 justify-end mb-12 items-center pb-12">
                        <RadioGroup value={mood} onValueChange={setMood} className="gap-4">
                            {question.options.map(option => (
                                <RadioGroupItemWithLabel 
                                    key={option.value}
                                    value={option.value}
                                    label={option.label}
                                    onLabelPress={onLabelPress(option.value)}
                                />
                            ))}
                        </RadioGroup>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default AssessmentScreen;
