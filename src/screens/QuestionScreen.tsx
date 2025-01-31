/**
 * @packageDocumentation
 * @module Screens/Question
 * 
 * @summary
 * Handles the display and interaction of assessment questions.
 * 
 * @remarks
 * Manages question navigation, answer submission, and progress tracking.
 * 
 * Core Features:
 * - Dynamic question rendering based on type
 * - Answer validation and storage
 * - Smooth transitions between questions
 * - Progress persistence via drafts
 * - Auto-advance capability
 * 
 * State Management:
 * - Questions array
 * - Current answers
 * - Answered questions tracking
 * - Loading states
 * - Animation controls
 * 
 * Data Flow:
 * 1. Load questions from AssessmentService
 * 2. Load existing draft if available
 * 3. Handle user input with immediate UI updates
 * 4. Save answers locally and to database
 * 5. Handle navigation between questions
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Dimensions, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuestionFactory } from '~/src/components/questions/QuestionFactory';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { debugLog } from '~/src/config/debug';
import { RootStackParamList } from '~/src/navigation/AppNavigator';
import { AssessmentService } from '~/src/services/assessment';
import { AnswerRecord, AnswerValue } from '~/src/types/questions/answers';
import { AnyQuestion } from '~/src/types/questions/base';

/** @type {number} Screen width used for animations */
const { width } = Dimensions.get('window');

/** Navigation and route props for the Question screen */
type QuestionScreenProps = NativeStackScreenProps<RootStackParamList, 'Question'>;

/**
 * Question Screen Component
 * 
 * @param route - Route parameters from React Navigation
 * @param navigation - Navigation object for screen transitions
 * 
 * @remarks
 * Renders the main question interface and handles all question-related
 * interactions including navigation, answer submission, and progress tracking.
 * 
 * @example
 * ```tsx
 * <QuestionScreen route={route} navigation={navigation} />
 * ```
 */
export const QuestionScreen: React.FC<QuestionScreenProps> = ({ route, navigation }) => {
    const { questionIndex, assessmentId } = route.params;
    
    /** State management */
    const [questions, setQuestions] = useState<AnyQuestion[]>([]);
    const [answers, setAnswers] = useState<AnswerRecord>({});
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [debouncedValue, setDebouncedValue] = useState<AnswerValue | null>(null);
    const [slideAnim] = useState(() => new Animated.Value(0));
    const [fadeAnim] = useState(() => new Animated.Value(1));

    /**
     * Controls animation between questions
     * 
     * @param direction - Direction of transition ('forward' | 'backward')
     * 
     * @remarks
     * Uses spring animation for slide and fade effects
     */
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

    /** Load questions */
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const loadedQuestions = await AssessmentService.getQuestions();
                setQuestions(loadedQuestions);
                setLoading(false);
            } catch (error) {
                console.error('Error loading questions:', error);
                setLoading(false);
            }
        };
        loadQuestions();
    }, []);

    /** Load draft */
    useEffect(() => {
        const loadDraft = async () => {
            if (assessmentId) {
                const draft = await AssessmentService.loadDraft(assessmentId);
                if (draft && !draft.completed) {
                    const numericAnswers: AnswerRecord = {};
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

    /** Start animation */
    useEffect(() => {
        animateTransition('forward');
    }, [questionIndex, animateTransition]);

    /** Save debounced answer */
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

    /** Loading state */
    if (loading || !questions.length || assessmentId === null) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    /** Navigation state */
    const question = questions[questionIndex];
    const isLastQuestion = questionIndex === questions.length - 1;
    const canGoBack = questionIndex > 0;
    const canGoForward = questionIndex < questions.length - 1;

    /**
     * Auto-advance to next question
     * 
     * @method
     * 
     * @remarks
     * Used for questions with auto-advance enabled.
     * Navigates immediately and saves in the background.
     */
    const handleAutoAdvance = () => {
        if (canGoForward && assessmentId && question) {
            // Navigate immediately for better UX
            navigation.navigate('Question', { 
                questionIndex: questionIndex + 1,
                assessmentId 
            });

            // Save to database in the background
            AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            ).catch(error => {
                debugLog('ui', 'Error during background save:', error);
                // Hier könnten wir einen Toast/Notification anzeigen wenn die Speicherung fehlschlägt
            });
        }
    };

    /**
     * Handles answer submission for a question.
     * Updates local state immediately.
     * 
     * @async
     * @param {AnswerValue} value - The answer value to be saved
     */
    const handleAnswer = async (value: AnswerValue) => {
        if (!question || !assessmentId) return;

        // Update local state immediately
        setAnswers(prev => ({
            ...prev,
            [question.id]: value
        }));
        setAnsweredQuestions(prev => new Set(prev).add(question.id));

        // Save answer locally
        await AssessmentService.saveAnswerLocally(
            assessmentId, 
            question.id, 
            value
        );

        // For text and slider: Set debounced value for UI updates
        if (question.type === 'text' || question.type === 'slider') {
            setDebouncedValue(value);
        }
    };

    /**
     * Navigate to next question
     * 
     * @remarks
     * Navigates immediately and saves in background
     * 
     * @returns Promise that resolves when navigation is complete
     */
    const handleNext = () => {
        if (assessmentId && question && answeredQuestions.has(question.id)) {
            if (isLastQuestion) {
                handleComplete();
                return;
            }

            // Navigate immediately
            navigation.navigate('Question', { 
                questionIndex: questionIndex + 1,
                assessmentId 
            });

            // Save in background
            AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            ).catch(error => {
                debugLog('ui', 'Error during background save:', error);
            });
        } else {
            // Wenn keine Antwort ausgewählt wurde
            navigation.navigate('Question', { 
                questionIndex: questionIndex + 1,
                assessmentId 
            });
        }
    };

    /**
     * Navigate to previous question
     * 
     * @remarks
     * Navigates immediately and saves in background if needed
     */
    const handleBack = () => {
        if (assessmentId && question && answeredQuestions.has(question.id)) {
            // Save in background if there's an answer
            AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            ).catch(error => {
                debugLog('ui', 'Error during background save:', error);
            });
        }

        if (canGoBack) {
            navigation.navigate('Question', { 
                questionIndex: questionIndex - 1,
                assessmentId 
            });
        }
    };

    /**
     * Handles assessment completion.
     * Marks the assessment as complete and navigates back to home.
     * 
     * @async
     */
    const handleComplete = async () => {
        if (assessmentId) {
            await AssessmentService.completeAssessment(assessmentId);
            navigation.navigate('Home');
        }
    };

    /**
     * Renders the appropriate question input component.
     * Uses QuestionFactory to get the correct component based on question type.
     * 
     * @param {AnyQuestion} question - The question to render
     * @returns {JSX.Element | null} The rendered question component
     */
    const renderQuestionInput = (question: AnyQuestion) => {
        if (!question) return null;
        
        debugLog('ui', 'Rendering question:', question);
        const component = QuestionFactory.getComponent(question);
        const currentValue = answers[question.id] ?? component.getInitialValue();
        
        debugLog('ui', 'Component props:', {
            question,
            value: currentValue,
            hasAutoAdvance: !!question.autoAdvance
        });
        
        return component.render({
            question,
            value: currentValue,
            onChange: (value) => handleAnswer(value),
            onAutoAdvance: question.autoAdvance ? handleAutoAdvance : undefined
        });
    };

    return (
        <SafeAreaView edges={['bottom']} className="flex-1 bg-background">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

                    {/* Navigation Buttons - always visible */}
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
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default QuestionScreen; 