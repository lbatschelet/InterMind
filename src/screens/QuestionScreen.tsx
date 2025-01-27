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
import { Animated, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuestionFactory } from '~/src/components/questions/QuestionFactory';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { debugLog } from '~/src/config/debug';
import { RootStackParamList } from '~/src/navigation/AppNavigator';
import { AssessmentService } from '~/src/services/assessment';
import { AnswerRecord, AnswerValue, StringAnswerRecord } from '~/src/types/questions/answers';
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
     * Navigate to next question
     * 
     * @remarks
     * Saves current progress before navigation:
     * 1. Saves draft locally
     * 2. Saves answer to database
     * 3. Navigates to next question or completes assessment
     * 
     * @returns Promise that resolves when navigation is complete
     */
    const handleNext = async () => {
        if (assessmentId && question && answeredQuestions.has(question.id)) {
            // Save draft
            const stringAnswers: StringAnswerRecord = {};
            Object.entries(answers).forEach(([key, value]) => {
                stringAnswers[key] = Array.isArray(value) 
                    ? value.join(',') 
                    : String(value ?? '');
            });
            await AssessmentService.saveDraft(assessmentId, stringAnswers);

            // Save to database
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

    /**
     * Navigate to previous question
     * 
     * @remarks
     * Saves current progress before navigation:
     * 1. Saves draft locally
     * 2. Saves answer to database
     * 3. Navigates to previous question if possible
     * 
     * @returns Promise that resolves when navigation is complete
     */
    const handleBack = async () => {
        if (assessmentId && question && answeredQuestions.has(question.id)) {
            // Save draft
            const stringAnswers: Record<string, string> = {};
            Object.entries(answers).forEach(([key, value]) => {
                stringAnswers[key] = Array.isArray(value) 
                    ? value.join(',') 
                    : String(value);
            });
            await AssessmentService.saveDraft(assessmentId, stringAnswers);

            // Save to database
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

    /**
     * Auto-advance to next question
     * 
     * @method
     * 
     * @remarks
     * Used for questions with auto-advance enabled.
     * Saves progress and automatically navigates forward.
     */
    const handleAutoAdvance = async () => {
        if (canGoForward && assessmentId) {
            // Save draft
            const stringAnswers: Record<string, string> = {};
            Object.entries(answers).forEach(([key, value]) => {
                stringAnswers[key] = Array.isArray(value) 
                    ? value.join(',') 
                    : String(value);
            });
            await AssessmentService.saveDraft(assessmentId, stringAnswers);

            // Save to database
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
     * Handles answer submission for a question.
     * Updates local state and triggers auto-advance if enabled.
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

        // Auto-advance logic
        if (question.autoAdvance && canGoForward) {
            // Save to database before navigating
            await AssessmentService.saveAnswerToDb(
                assessmentId,
                question.id,
                question.type
            );
            handleAutoAdvance();
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
        </SafeAreaView>
    );
};

export default QuestionScreen; 