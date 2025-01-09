import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OurNeighborhood from '~/assets/our-neighborhood.svg';
import { MultipleChoiceQuestion } from '~/src/components/question-types/MultipleChoiceQuestion';
import { SingleChoiceQuestion } from '~/src/components/question-types/SingleChoiceQuestion';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { mockAssessment } from '~/src/mocks/questions';
import { RootStackParamList } from '~/src/navigation/AppNavigator';
import { AssessmentService } from '~/src/services/assessment';

const { width } = Dimensions.get('window');

interface QuestionScreenProps {
    route: {
        params: {
            questionIndex: number;
        };
    };
    navigation: NativeStackNavigationProp<RootStackParamList, 'Question'>;
}

const QuestionScreen = ({ route, navigation }: QuestionScreenProps) => {
    const { questionIndex } = route.params;
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const assessment = mockAssessment;
    const question = assessment.questions[questionIndex];
    
    // Load draft when screen mounts
    useEffect(() => {
        const loadDraft = async () => {
            const draft = await AssessmentService.loadDraft(assessment.id);
            if (draft && !draft.completed) {
                setAnswers(draft.answers);
                setAnsweredQuestions(new Set(Object.keys(draft.answers)));
            }
        };
        loadDraft();
    }, [assessment.id]);

    // Save draft whenever answers change
    useEffect(() => {
        const saveDraft = async () => {
            await AssessmentService.saveDraft(assessment.id, answers);
        };
        saveDraft();
    }, [assessment.id, answers]);
    
    const isLastQuestion = questionIndex === assessment.questions.length - 1;
    const canGoBack = questionIndex > 0;
    const canGoForward = questionIndex < assessment.questions.length - 1;
    const showNextButton = question.requiresConfirmation || 
                         answeredQuestions.has(question.id);

    const handleAnswer = (value: string | string[]) => {
        const isFirstAnswer = !answeredQuestions.has(question.id);
        
        setAnswers((prev: Record<string, string | string[]>) => ({
            ...prev,
            [question.id]: value
        }));
        
        setAnsweredQuestions((prev: Set<string>) => {
            const next = new Set(prev);
            next.add(question.id);
            return next;
        });

        if (!question.requiresConfirmation && isFirstAnswer && !isLastQuestion) {
            navigation.push('Question', { questionIndex: questionIndex + 1 });
        }
    };

    const handleNext = () => {
        if (canGoForward) {
            navigation.push('Question', { questionIndex: questionIndex + 1 });
        }
    };

    const handleBack = () => {
        navigation.pop();
    };

    const handleComplete = async () => {
        try {
            await AssessmentService.submitAssessment(assessment.id, answers);
            await AssessmentService.completeDraft(assessment.id);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error completing assessment:', error);
            // TODO: Fehlerbehandlung für den Benutzer hinzufügen
        }
    };

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView edges={['top']} className="flex-1">
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
                    
                    <View className="flex-1">
                        {question.type === 'single_choice' ? (
                            <SingleChoiceQuestion
                                options={question.options}
                                selectedOption={answers[question.id] as string}
                                onSelect={handleAnswer}
                            />
                        ) : (
                            <MultipleChoiceQuestion
                                options={question.options}
                                selectedOptions={answers[question.id] as string[] || []}
                                onSelect={handleAnswer}
                            />
                        )}
                    </View>

                    <View className="flex-row justify-between mb-12 mt-2 gap-x-2">
                        {canGoBack ? (
                            <Button
                                variant="outline"
                                onPress={handleBack}
                                className="flex-1"
                            >
                                <Text className="text-primary">
                                    Back
                                </Text>
                            </Button>
                        ) : <View className="flex-1" />}
                        
                        {showNextButton && (
                            <Button
                                variant="default"
                                onPress={isLastQuestion ? handleComplete : handleNext}
                                disabled={!canGoForward && !isLastQuestion}
                                className="flex-1"
                            >
                                <Text className={(!canGoForward && !isLastQuestion) ? "text-muted-foreground" : "text-primary-foreground"}>
                                    {isLastQuestion ? 'Complete' : 'Next'}
                                </Text>
                            </Button>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default QuestionScreen; 