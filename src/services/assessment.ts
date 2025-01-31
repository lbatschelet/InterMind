/**
 * @packageDocumentation
 * @module Services/Assessment
 * 
 * @summary
 * Manages the core assessment functionality of the application.
 * 
 * @remarks
 * Handles the creation, progression, and completion of user assessments.
 * 
 * Core Concepts:
 * Assessment: A session where users answer a series of questions. Each assessment:
 * - Has a unique ID
 * - Contains multiple questions and their answers
 * - Tracks completion status
 * - Records location data
 * - Maintains draft state for incomplete sessions
 * 
 * Data Flow:
 * 1. User starts assessment → createAssessment()
 * 2. Answer changes → saveAnswerLocally()
 * 3. Navigation to next → saveAnswerToDb()
 * 4. Completion → verifyAnswers()
 * 
 * Privacy & Data Handling:
 * - Uses device-based authentication
 * - Implements local drafts for offline capability
 * - Ensures data consistency between local and remote
 * - Handles answer normalization for different question types
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { debugLog } from '~/src/config/debug';
import { AnswerValue, StringAnswerRecord } from '~/src/types/questions/answers';
import { AnyQuestion, QuestionType } from '~/src/types/questions/base';
import { QuestionOption } from '~/src/types/questions/types/choice';
import { SliderConfig } from '~/src/types/questions/types/slider';
import { DeviceService } from './device';
import { LocationData } from './location';
import {
    Assessment,
    AssessmentAnswer,
    ensureDeviceSession,
    mapDbToAssessment,
    supabase
} from './supabase';

/** @type {string} Key for storing assessment drafts in AsyncStorage */
const STORAGE_KEY = 'assessment_drafts';

interface DbQuestion {
    id: string;
    question: string;
    type: QuestionType;
    category: string;
    created_at: string;
    options: QuestionOption[] | SliderConfig;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
    imageUrl?: string;
    description?: string;
    auto_advance?: boolean;
    requiresConfirmation?: boolean;
    required?: boolean;
}

const mapDbQuestion = (dbQuestion: DbQuestion): AnyQuestion => {
    const baseQuestion = {
        id: dbQuestion.id,
        question: dbQuestion.question,
        category: dbQuestion.category,
        created_at: dbQuestion.created_at,
        imageUrl: dbQuestion.imageUrl,
        description: dbQuestion.description,
        autoAdvance: dbQuestion.auto_advance,
        requiresConfirmation: dbQuestion.requiresConfirmation,
        required: dbQuestion.required,
        validation: dbQuestion.validation
    };

    // Konvertiere String-Arrays in QuestionOption-Arrays
    const mapStringOptionsToQuestionOptions = (options: string[]): QuestionOption[] => {
        return options.map((option, index) => ({
            value: index,
            label: option
        }));
    };

    // Überprüfe und konvertiere die Optionen
    const processOptions = (options: unknown): QuestionOption[] => {
        if (Array.isArray(options)) {
            if (options.length === 0) return [];
            if (typeof options[0] === 'string') {
                return mapStringOptionsToQuestionOptions(options as string[]);
            }
            if (typeof options[0] === 'object' && options[0] !== null && 'value' in options[0]) {
                return options as QuestionOption[];
            }
        }
        return [];
    };

    switch (dbQuestion.type) {
        case 'single_choice':
        case 'multiple_choice':
            return {
                ...baseQuestion,
                type: dbQuestion.type,
                options: processOptions(dbQuestion.options)
            };
        case 'slider':
            return {
                ...baseQuestion,
                type: 'slider' as const,
                options: dbQuestion.options as SliderConfig
            };
        case 'text':
            return {
                ...baseQuestion,
                type: 'text' as const,
                options: undefined
            };
        default:
            throw new Error(`Unknown question type: ${dbQuestion.type}`);
    }
};

/**
 * Represents a locally stored draft of an assessment.
 * 
 * @typedef {Object} AssessmentDraft
 * @property {string} assessmentId Unique identifier of the assessment
 * @property {StringAnswerRecord} answers Map of question IDs to their string-formatted answers
 * @property {number} lastUpdated Unix timestamp of the last update
 * @property {boolean} completed Whether the assessment has been completed
 */
export interface AssessmentDraft {
    assessmentId: string;
    answers: StringAnswerRecord;
    lastUpdated: number;
    completed: boolean;
}

/**
 * Normalizes answer values for consistent comparison and storage.
 * 
 * @param value - The answer value to normalize
 * @returns Normalized value
 * 
 * @example
 * ```typescript
 * normalizeAnswerValue([1])        // → 1
 * normalizeAnswerValue([2,1])      // → [1,2]
 * normalizeAnswerValue("1,2,3")    // → [1,2,3]
 * normalizeAnswerValue("42")       // → 42
 * normalizeAnswerValue("text")     // → "text"
 * ```
 */
const normalizeAnswerValue = (value: unknown): AnswerValue => {
    if (Array.isArray(value)) {
        const numbers = value.map(Number);
        return numbers.length === 1 ? numbers[0] : numbers.sort((a, b) => a - b);
    }
    
    if (typeof value === 'string') {
        if (value.includes(',')) {
            const numbers = value.split(',').map(v => Number(v.trim()));
            return numbers.length === 1 ? numbers[0] : numbers.sort((a, b) => a - b);
        }
        const num = Number(value);
        return isNaN(num) ? value : num;
    }
    
    if (typeof value === 'number') {
        return value;
    }
    
    return null;
};

/**
 * Service providing assessment management functionality.
 * 
 * @namespace
 */
export const AssessmentService = {
    /**
     * Retrieves all available questions from the database.
     * 
     * @returns Array of questions ordered by creation date
     * 
     * @example
     * ```typescript
     * const questions = await AssessmentService.getQuestions();
     * console.log(`Loaded ${questions.length} questions`);
     * ```
     */
    getQuestions: async (): Promise<AnyQuestion[]> => {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            debugLog('database', 'Error loading questions:', error);
            return [];
        }

        debugLog('database', 'Raw questions from DB:', data);
        
        // Ensure options are properly parsed if they're stored as a string
        const parsedData = data.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));
        
        const mappedQuestions = parsedData.map(mapDbQuestion);
        debugLog('database', 'Mapped questions:', mappedQuestions);
        return mappedQuestions;
    },

    /**
     * Creates a new assessment instance.
     * 
     * @param [location] - Optional location data to associate
     * @returns Created assessment or null if creation failed
     * 
     * @example
     * ```typescript
     * const location = await LocationService.getCurrentLocation();
     * const assessment = await AssessmentService.createAssessment(location);
     * if (assessment) {
     *   console.log('Started assessment:', assessment.id);
     * }
     * ```
     */
    createAssessment: async (location?: LocationData): Promise<Assessment | null> => {
        try {
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            debugLog('services', 'Creating new assessment');
            const { data, error } = await supabase
                .from('assessments')
                .insert({
                    device_id: deviceId,
                    location: location || null
                })
                .select()
                .single();

            if (error) {
                debugLog('database', 'Error creating assessment:', error);
                return null;
            }

            debugLog('services', 'Assessment created:', data.id);
            return mapDbToAssessment(data);
        } catch (error) {
            debugLog('services', 'Error in assessment creation:', error);
            return null;
        }
    },

    /**
     * Saves an answer to local storage as a draft.
     * 
     * @param assessmentId - ID of the assessment
     * @param questionId - ID of the question being answered
     * @param answerValue - The user's answer
     * 
     * @example
     * ```typescript
     * await AssessmentService.saveAnswerLocally(
     *   'assessment-123',
     *   'question-1',
     *   42
     * );
     * ```
     */
    saveAnswerLocally: async (
        assessmentId: string,
        questionId: string,
        answerValue: AnswerValue,
    ): Promise<void> => {
        try {
            const draft = await AssessmentService.loadDraft(assessmentId) || {
                assessmentId,
                answers: {},
                lastUpdated: Date.now(),
                completed: false
            };

            const stringValue = Array.isArray(answerValue) 
                ? answerValue.join(',')
                : String(answerValue ?? '');

            draft.answers[questionId] = stringValue;
            draft.lastUpdated = Date.now();

            await AsyncStorage.setItem(
                `${STORAGE_KEY}:${assessmentId}`, 
                JSON.stringify(draft)
            );
            debugLog('ui', 'Answer saved locally:', { questionId, answerValue });
        } catch (error) {
            debugLog('ui', 'Error saving local answer:', error);
        }
    },

    /**
     * Persists an answer to the database.
     * 
     * @param assessmentId - ID of the assessment
     * @param questionId - ID of the question
     * @param questionType - Type of question for formatting
     * @returns Saved answer or null if failed
     * 
     * @example
     * ```typescript
     * const answer = await AssessmentService.saveAnswerToDb(
     *   'assessment-123',
     *   'question-1',
     *   'single_choice'
     * );
     * ```
     */
    saveAnswerToDb: async (
        assessmentId: string,
        questionId: string,
        questionType: QuestionType
    ): Promise<AssessmentAnswer | null> => {
        try {
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            const draft = await AssessmentService.loadDraft(assessmentId);
            if (!draft || !draft.answers[questionId]) {
                debugLog('services', 'No local answer found for:', { assessmentId, questionId });
                return null;
            }

            const stringValue = draft.answers[questionId];
            debugLog('database', 'Saving answer to DB:', { questionId, stringValue, questionType });

            let formattedValue: string | number | number[];
            if (questionType === 'multiple_choice') {
                formattedValue = stringValue.split(',').map(Number);
            } else if (questionType === 'slider' || questionType === 'single_choice') {
                formattedValue = Number(stringValue);
            } else {
                formattedValue = stringValue;
            }

            const { data, error } = await supabase
                .from('assessment_answers')
                .upsert({
                    assessment_id: assessmentId,
                    question_id: questionId,
                    answer_value: formattedValue,
                    question_type: questionType,
                    answered_at: new Date().toISOString()
                }, {
                    onConflict: 'assessment_id,question_id'
                })
                .select()
                .single();

            if (error) {
                debugLog('database', 'Error saving to DB:', error);
                return null;
            }

            debugLog('database', 'Answer successfully saved to DB');
            return data;
        } catch (error) {
            debugLog('services', 'Error in DB save:', error);
            return null;
        }
    },

    /**
     * Verifies data consistency between local and remote answers.
     * 
     * @param assessmentId - ID of the assessment to verify
     * @returns true if consistent, false if discrepancies found
     * 
     * @example
     * ```typescript
     * const isConsistent = await AssessmentService.verifyAnswers('assessment-123');
     * if (!isConsistent) {
     *   console.log('Found answer discrepancies');
     * }
     * ```
     */
    verifyAnswers: async (assessmentId: string): Promise<boolean> => {
        try {
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            // Get local answers
            const draft = await AssessmentService.loadDraft(assessmentId);
            if (!draft) {
                debugLog('services', 'No local draft found for assessment:', assessmentId);
                return false;
            }

            // Get answers from database
            const { data: dbAnswers, error } = await supabase
                .from('assessment_answers')
                .select('question_id, answer_value')
                .eq('assessment_id', assessmentId);

            if (error) {
                debugLog('database', 'Error loading DB answers:', error);
                return false;
            }

            // Compare answers
            const dbAnswersMap = Object.fromEntries(
                dbAnswers.map(answer => [answer.question_id, answer.answer_value])
            );

            let allMatch = true;
            for (const [questionId, localAnswer] of Object.entries(draft.answers)) {
                const dbAnswer = dbAnswersMap[questionId];
                const normalizedLocal = normalizeAnswerValue(localAnswer);
                const normalizedDb = normalizeAnswerValue(dbAnswer);
                
                if (JSON.stringify(normalizedLocal) !== JSON.stringify(normalizedDb)) {
                    debugLog('services', 
                        `Discrepancy found for question ${questionId}:`,
                        '\nLocal (normalized):', normalizedLocal,
                        '\nDB (normalized):', normalizedDb,
                        '\nOriginal Local:', localAnswer,
                        '\nOriginal DB:', dbAnswer
                    );
                    allMatch = false;
                }
            }

            if (allMatch) {
                debugLog('services', 'All answers match');
            } else {
                debugLog('services', 'Some answers do not match');
            }

            return allMatch;
        } catch (error) {
            debugLog('services', 'Error verifying answers:', error);
            return false;
        }
    },

    /**
     * Saves the current state of an assessment locally.
     * 
     * @param assessmentId - ID of the assessment to save
     * @param answers - Current answers for the assessment
     * 
     * @example
     * ```typescript
     * await AssessmentService.saveDraft(
     *   'assessment-123',
     *   { 'question-1': '42', 'question-2': '1,2,3' }
     * );
     * ```
     */
    saveDraft: async (assessmentId: string, answers: Record<string, string>) => {
        debugLog('ui', 'Saving assessment draft:', { assessmentId, answers });
        try {
            const draft: AssessmentDraft = {
                assessmentId,
                answers,
                lastUpdated: Date.now(),
                completed: false
            };
            
            await AsyncStorage.setItem(
                `${STORAGE_KEY}:${assessmentId}`, 
                JSON.stringify(draft)
            );
            debugLog('ui', 'Assessment draft successfully saved');
        } catch (error) {
            debugLog('ui', 'Error saving assessment draft:', error);
        }
    },

    /**
     * Loads a previously saved assessment draft.
     * 
     * @param assessmentId - ID of the assessment to load
     * @returns The loaded draft or null if not found
     * 
     * @example
     * ```typescript
     * const draft = await AssessmentService.loadDraft('assessment-123');
     * if (draft) {
     *   console.log('Found draft with answers:', draft.answers);
     * }
     * ```
     */
    loadDraft: async (assessmentId: string): Promise<AssessmentDraft | null> => {
        debugLog('ui', 'Loading draft:', assessmentId);
        try {
            const stored = await AsyncStorage.getItem(`${STORAGE_KEY}:${assessmentId}`);
            if (!stored) return null;
            
            const parsed = JSON.parse(stored);
            
            const answers: Record<string, string> = {};
            for (const [key, value] of Object.entries(parsed.answers)) {
                answers[key] = Array.isArray(value) 
                    ? value.join(',') 
                    : String(value);
            }
            
            const draft: AssessmentDraft = {
                assessmentId: parsed.assessmentId,
                answers,
                lastUpdated: parsed.lastUpdated,
                completed: parsed.completed
            };
            
            debugLog('ui', 'Draft loaded:', draft);
            return draft;
        } catch (error) {
            debugLog('ui', 'Error loading draft:', error);
            return null;
        }
    },

    /**
     * Marks an assessment as completed and removes the draft.
     * 
     * @param assessmentId - ID of the assessment to complete
     * @returns true if successful, false otherwise
     * 
     * @example
     * ```typescript
     * const success = await AssessmentService.completeAssessment('assessment-123');
     * if (success) {
     *   console.log('Assessment completed successfully');
     * }
     * ```
     */
    completeAssessment: async (assessmentId: string): Promise<boolean> => {
        try {
            debugLog('services', 'Completing assessment:', assessmentId);
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            const { error } = await supabase
                .from('assessments')
                .update({ completed_at: new Date().toISOString() })
                .eq('id', assessmentId);

            if (error) {
                debugLog('database', 'Error completing assessment:', error);
                return false;
            }

            // Mark draft as completed
            const draft = await AssessmentService.loadDraft(assessmentId);
            if (draft) {
                draft.completed = true;
                await AsyncStorage.setItem(
                    `${STORAGE_KEY}:${assessmentId}`, 
                    JSON.stringify(draft)
                );
            }

            debugLog('services', 'Assessment completed successfully');
            return true;
        } catch (error) {
            debugLog('services', 'Error completing assessment:', error);
            return false;
        }
    },

    /**
     * Cancels an assessment and removes all associated data.
     * 
     * @param assessmentId - ID of the assessment to cancel
     * @returns true if successful, false otherwise
     * 
     * @example
     * ```typescript
     * const success = await AssessmentService.cancelAssessment('assessment-123');
     * if (success) {
     *   console.log('Assessment cancelled and data removed');
     * }
     * ```
     */
    cancelAssessment: async (assessmentId: string): Promise<boolean> => {
        try {
            debugLog('services', 'Cancelling assessment:', assessmentId);
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            // Delete all answers first
            const { error: answersError } = await supabase
                .from('assessment_answers')
                .delete()
                .eq('assessment_id', assessmentId);

            if (answersError) {
                debugLog('database', 'Error deleting answers:', answersError);
                return false;
            }

            // Then delete the assessment itself
            const { error: assessmentError } = await supabase
                .from('assessments')
                .delete()
                .eq('id', assessmentId);

            if (assessmentError) {
                debugLog('database', 'Error deleting assessment:', assessmentError);
                return false;
            }

            // Remove local draft
            await AsyncStorage.removeItem(`${STORAGE_KEY}:${assessmentId}`);
            debugLog('services', 'Assessment cancelled successfully');
            return true;
        } catch (error) {
            debugLog('services', 'Error cancelling assessment:', error);
            return false;
        }
    },

    
}; 