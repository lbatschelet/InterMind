import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuestionComponentProps } from '~/src/components/questions/QuestionComponent';
import { QuestionFactory } from '~/src/components/questions/QuestionFactory';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { RootStackParamList } from '~/src/navigation/AppNavigator';
import { AssessmentService } from '~/src/services/assessment';
import { Question } from '~/src/types/Question';

const { width } = Dimensions.get('window');

type QuestionScreenProps = NativeStackScreenProps<RootStackParamList, 'Question'>;

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ route, navigation }) => {
    const { questionIndex, assessmentId } = route.params;
    
    // Alle State-Hooks am Anfang
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [debouncedValue, setDebouncedValue] = useState<any>(null);
    const [slideAnim] = useState(() => new Animated.Value(0));
    const [fadeAnim] = useState(() => new Animated.Value(1));

    const animateTransition = useCallback((direction: 'forward' | 'backward') => {
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
    }, [slideAnim, fadeAnim]);

    // Fragen laden
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

    // Draft laden
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

    // Animation
    useEffect(() => {
        animateTransition('forward');
    }, [questionIndex, animateTransition]);

    // Debounced Antwort speichern
    useEffect(() => {
        const saveAnswer = async () => {
            if (debouncedValue !== null && assessmentId && questions[questionIndex]) {
                await AssessmentService.saveAnswerLocally(
                    assessmentId,
                    questions[questionIndex].id,
                    debouncedValue
                );
            }
        };
        saveAnswer();
    }, [debouncedValue, assessmentId, questionIndex, questions]);

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

    const handleNext = async () => {
        if (assessmentId && question && answeredQuestions.has(question.id)) {
            // Speichere Draft
            const stringAnswers: Record<string, string> = {};
            Object.entries(answers).forEach(([key, value]) => {
                stringAnswers[key] = Array.isArray(value) 
                    ? value.join(',') 
                    : String(value);
            });
            await AssessmentService.saveDraft(assessmentId, stringAnswers);

            // Speichere in DB
            await AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            );
        }

        if (isLastQuestion) {
            handleComplete();
        } else {
            navigation.navigate('Question', { 
                questionIndex: questionIndex + 1,
                assessmentId 
            });
        }
    };

    const handleBack = async () => {
        if (assessmentId && question && answeredQuestions.has(question.id)) {
            // Speichere Draft
            const stringAnswers: Record<string, string> = {};
            Object.entries(answers).forEach(([key, value]) => {
                stringAnswers[key] = Array.isArray(value) 
                    ? value.join(',') 
                    : String(value);
            });
            await AssessmentService.saveDraft(assessmentId, stringAnswers);

            // Speichere in DB
            await AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            );
        }

        if (canGoBack) {
            navigation.navigate('Question', { 
                questionIndex: questionIndex - 1,
                assessmentId 
            });
        }
    };

    const handleAutoAdvance = async () => {
        if (canGoForward && assessmentId) {
            // Speichere Draft
            const stringAnswers: Record<string, string> = {};
            Object.entries(answers).forEach(([key, value]) => {
                stringAnswers[key] = Array.isArray(value) 
                    ? value.join(',') 
                    : String(value);
            });
            await AssessmentService.saveDraft(assessmentId, stringAnswers);

            // Speichere in DB
            await AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            );

            navigation.navigate('Question', { 
                questionIndex: questionIndex + 1,
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

    const handleAnswer = async (value: any) => {
        if (!question || !assessmentId) return;

        // Aktualisiere den lokalen State sofort
        setAnswers(prev => ({
            ...prev,
            [question.id]: value
        }));
        setAnsweredQuestions(prev => new Set(prev).add(question.id));

        // Speichere die Antwort lokal
        await AssessmentService.saveAnswerLocally(
            assessmentId, 
            question.id, 
            value
        );

        // Bei Text und Slider: Setze den debounced Wert für UI-Updates
        if (question.type === 'text' || question.type === 'slider') {
            setDebouncedValue(value);
        }

        // Auto-advance Logik
        if (question.autoAdvance && canGoForward) {
            // Speichere in DB bevor wir weiternavigieren
            await AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            );
            handleAutoAdvance();
        }
    };

    const renderQuestionInput = (question: Question) => {
        if (!question) return null;
        
        const component = QuestionFactory.getComponent(question.type);
        const currentValue = answers[question.id];
        
        return component.render({
            question,
            value: currentValue,
            onChange: (value) => handleAnswer(value),
            onAutoAdvance: question.autoAdvance ? handleAutoAdvance : undefined
        } as QuestionComponentProps);
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