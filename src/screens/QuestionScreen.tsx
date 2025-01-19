import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuestionFactory } from '~/src/components/questions/QuestionFactory';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { RootStackParamList } from '~/src/navigation/AppNavigator';
import { AssessmentService } from '~/src/services/assessment';
import { Question, isSliderConfig } from '~/src/types/Question';

const { width } = Dimensions.get('window');

type QuestionScreenProps = NativeStackScreenProps<RootStackParamList, 'Question'>;

const QuestionScreen = ({ route, navigation }: QuestionScreenProps) => {
    const { questionIndex, assessmentId } = route.params;
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Neue Animations-States
    const slideAnim = useState(new Animated.Value(0))[0];
    const fadeAnim = useState(new Animated.Value(1))[0];

    const animateTransition = (direction: 'forward' | 'backward') => {
        // Reset animations
        slideAnim.setValue(direction === 'forward' ? width : -width);
        fadeAnim.setValue(0);

        // Animate in
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
                velocity: direction === 'forward' ? 2 : -2
            }),
            Animated.sequence([
                Animated.delay(100),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                })
            ])
        ]).start();
    };

    // Effekt für die initiale Animation
    useEffect(() => {
        animateTransition('forward');
    }, [questionIndex]);

    // Lade nur die Fragen beim ersten Laden
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const loadedQuestions = await AssessmentService.getQuestions();
                setQuestions(loadedQuestions);
                setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden der Fragen:', error);
                setLoading(false);
            }
        };

        loadQuestions();
    }, []);

    // Lade Draft wenn verfügbar
    useEffect(() => {
        const loadDraft = async () => {
            if (assessmentId) {
                const draft = await AssessmentService.loadDraft(assessmentId);
                if (draft && !draft.completed) {
                    const numericAnswers: Record<string, any> = {};
                    Object.entries(draft.answers).forEach(([key, value]) => {
                        numericAnswers[key] = value;
                    });
                    setAnswers(numericAnswers);
                    setAnsweredQuestions(new Set(Object.keys(numericAnswers)));
                }
            }
        };
        loadDraft();
    }, [assessmentId]);

    // Speichere Draft wenn sich Antworten ändern
    useEffect(() => {
        const saveDraft = async () => {
            if (assessmentId) {
                const stringAnswers: Record<string, string | string[]> = {};
                Object.entries(answers).forEach(([key, value]) => {
                    stringAnswers[key] = value.toString();
                });
                await AssessmentService.saveDraft(assessmentId, stringAnswers);
            }
        };
        saveDraft();
    }, [assessmentId, answers]);

    if (loading || !questions.length || assessmentId === null) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Laden...</Text>
            </View>
        );
    }

    const question = questions[questionIndex];
    const isLastQuestion = questionIndex === questions.length - 1;
    const canGoBack = questionIndex > 0;
    const canGoForward = questionIndex < questions.length - 1;
    const showNextButton = answeredQuestions.has(question.id);

    const handleAutoAdvance = () => {
        if (canGoForward) {
            navigation.navigate('Question', { 
                questionIndex: questionIndex + 1,
                assessmentId 
            });
        }
    };

    const renderQuestionInput = (question: Question) => {
        const component = QuestionFactory.getComponent(question.type);
        
        if (question.type === 'slider' && isSliderConfig(question.options)) {
            const { min, max, step } = question.options;
        }
        
        return component.render({
            question,
            value: answers[question.id],
            onChange: (value) => handleAnswer(value),
            onAutoAdvance: question.autoAdvance ? handleAutoAdvance : undefined
        });
    };

    const handleAnswer = async (value: any) => {
        const isFirstAnswer = !answeredQuestions.has(question.id);
        
        setAnswers(prev => ({
            ...prev,
            [question.id]: value
        }));

        setAnsweredQuestions(prev => {
            const next = new Set(prev);
            next.add(question.id);
            return next;
        });

        if (isFirstAnswer && assessmentId) {
            await AssessmentService.saveAnswer(
                assessmentId,
                question.id,
                value,
                question.type
            );
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            handleComplete();
        } else {
            navigation.navigate('Question', { 
                questionIndex: questionIndex + 1,
                assessmentId 
            });
        }
    };

    const handleBack = () => {
        if (canGoBack) {
            navigation.navigate('Question', { 
                questionIndex: questionIndex - 1,
                assessmentId 
            });
        }
    };

    const handleComplete = async () => {
        if (assessmentId) {
            await AssessmentService.completeAssessment(assessmentId);
            navigation.navigate('Home');
        }
    };

    return (
        <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
            <Animated.View 
                className="flex-1 px-4"
                style={{
                    transform: [{ translateX: slideAnim }],
                    opacity: fadeAnim
                }}
            >
                <View className="flex-1 justify-center items-center">
                    <View className="w-full max-w-md">
                        <Text className="text-2xl font-bold mb-8 text-center">
                            {question.question}
                        </Text>
                        {renderQuestionInput(question)}
                    </View>
                </View>

                {/* Navigation Buttons - immer sichtbar */}
                <View className="flex-row justify-between items-center w-full py-4">
                    <Button
                        variant="outline"
                        onPress={handleBack}
                        disabled={!canGoBack}
                        className={!canGoBack ? "opacity-50" : ""}
                    >
                        <Text>Back</Text>
                    </Button>

                    <Button
                        variant="default"
                        className="bg-accent"
                        onPress={handleNext}
                    >
                        <Text className="text-primary">
                            {isLastQuestion ? "Complete" : "Next"}
                        </Text>
                    </Button>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

export default QuestionScreen; 