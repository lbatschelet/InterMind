// src/screens/AssessmentScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { mockAssessment } from '~/src/mocks/questions';
import type { RootStackParamList } from '../navigation/AppNavigator';

type AssessmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Assessment'>;

interface AssessmentScreenProps {
    navigation: AssessmentScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ navigation }) => {
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const assessment = mockAssessment;

    useEffect(() => {
        // Direkt zum ersten Question Screen navigieren
        navigation.replace('Question', { questionIndex: 0 });
    }, []);

    return null;
};

export default AssessmentScreen;
