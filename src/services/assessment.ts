import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData } from './location';
import {
    Assessment,
    AssessmentAnswer,
    Question,
    QuestionType,
    mapDbToAssessment,
    supabase
} from './supabase';
import { UserService } from './user';

/**
 * This service handles all assessment-related operations.
 * 
 * What is an Assessment?
 * ---------------------
 * Think of an assessment as a survey or questionnaire that users fill out.
 * It starts when a user begins answering questions and includes:
 * - The questions and their answers
 * - When it was started/completed
 * - Where it was taken (location)
 * - A draft system to save progress
 * 
 * Main Features:
 * -------------
 * 1. Creating new assessments
 * 2. Saving answers
 * 3. Auto-saving drafts
 * 4. Loading saved progress
 * 5. Completing assessments
 * 6. Managing user data
 */

const STORAGE_KEY = 'assessment_drafts';

/**
 * Structure for storing assessment progress locally
 */
interface AssessmentDraft {
    assessmentId: string;
    answers: Record<string, string | string[]>;
    lastUpdated: number;
    completed: boolean;
}

export const AssessmentService = {
    /**
     * Loads all available questions from the database
     * @returns Array of questions ordered by ID
     */
    getQuestions: async (): Promise<Question[]> => {
        console.log('Loading questions from database...');
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('id');

        if (error) {
            console.error('Error loading questions:', error);
            return [];
        }

        console.log(`Successfully loaded ${data.length} questions`);

        // Transform options format
        return data.map(question => ({
            ...question,
            options: question.type === 'slider' 
                ? question.options  // Slider format is already correct
                : (question.options as string[])?.map((label, index) => ({
                    value: (index + 1).toString(),
                    label
                })) || []
        }));
    },

    /**
     * Creates a new assessment with optional location data
     * This is called when a user starts a new assessment
     * 
     * @param location - Optional location data from the device
     * @returns The created assessment or null if creation failed
     */
    createAssessment: async (location?: LocationData): Promise<Assessment | null> => {
        const deviceId = await UserService.getUserId();
        
        // Erst device_id in Session setzen
        await supabase.rpc('set_device_id', { device_id: deviceId });
        
        // Dann Assessment erstellen
        const { data, error } = await supabase
            .from('assessments')
            .insert({
                device_id: deviceId,
                user_id: deviceId,
                started_at: new Date(),
                location
            })
            .select()
            .single();
        
        if (error) {
            console.error('Error creating assessment:', error);
            return null;
        }

        return mapDbToAssessment(data);
    },

    /**
     * Saves an answer for a specific question
     * Only saves the first answer to prevent multiple submissions
     * 
     * @param assessmentId - ID of the current assessment
     * @param questionId - ID of the answered question
     * @param answerValue - The user's answer (can be number, array, or string)
     * @param questionType - Type of question (single_choice, multiple_choice, etc.)
     */
    saveAnswer: async (
        assessmentId: string,
        questionId: string,
        answerValue: number | number[] | string,
        questionType: QuestionType
    ): Promise<AssessmentAnswer | null> => {
        console.log('Speichere Antwort:', { assessmentId, questionId, answerValue, questionType });

        // Hole die device_id des Assessments
        const { data: assessment } = await supabase
            .from('assessments')
            .select('device_id')
            .eq('id', assessmentId)
            .single();

        if (assessment) {
            // Setze die device_id in der Session
            await supabase.rpc('set_claim', {
                claim: 'device_id',
                value: assessment.device_id
            });
        }

        const { data, error } = await supabase
            .from('assessment_answers')
            .insert([{
                assessment_id: assessmentId,
                question_id: questionId,
                answer_value: answerValue,
                question_type: questionType
            }])
            .select()
            .single();

        if (error) {
            console.error('Fehler beim Speichern der Antwort:', error);
            return null;
        }

        console.log('Antwort erfolgreich gespeichert:', data);
        return data;
    },

    /**
     * Saves the current state of an assessment locally
     * This allows users to continue later if they close the app
     * 
     * @param assessmentId - ID of the assessment to save
     * @param answers - Current answers for the assessment
     */
    saveDraft: async (assessmentId: string, answers: Record<string, string | string[]>) => {
        console.log('Speichere Assessment-Draft:', { assessmentId, answers });
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
            console.log('Assessment-Draft erfolgreich gespeichert');
        } catch (error) {
            console.error('Fehler beim Speichern des Assessment-Entwurfs:', error);
        }
    },

    /**
     * Loads a previously saved assessment draft
     * 
     * @param assessmentId - ID of the assessment to load
     * @returns The saved draft or null if none exists
     */
    loadDraft: async (assessmentId: string): Promise<AssessmentDraft | null> => {
        console.log('Lade Assessment-Draft:', assessmentId);
        try {
            const stored = await AsyncStorage.getItem(`${STORAGE_KEY}:${assessmentId}`);
            const draft = stored ? JSON.parse(stored) : null;
            console.log('Geladener Draft:', draft);
            return draft;
        } catch (error) {
            console.error('Fehler beim Laden des Assessment-Entwurfs:', error);
            return null;
        }
    },

    /**
     * Marks an assessment as completed and removes the draft
     * 
     * @param assessmentId - ID of the assessment to complete
     */
    completeAssessment: async (assessmentId: string) => {
        console.log('Schließe Assessment ab:', assessmentId);

        const { error } = await supabase
            .from('assessments')
            .update({ 
                completed_at: new Date().toISOString()
            })
            .eq('id', assessmentId);

        if (error) {
            console.error('Fehler beim Abschließen des Assessments:', error);
            return;
        }

        // Lösche den lokalen Draft
        try {
            await AsyncStorage.removeItem(`${STORAGE_KEY}:${assessmentId}`);
            console.log('Assessment erfolgreich abgeschlossen und Draft gelöscht');
        } catch (error) {
            console.error('Fehler beim Löschen des Assessment-Entwurfs:', error);
        }
    },

    /**
     * Cancels an assessment and removes its draft
     * Also logs the cancellation for analytics
     * 
     * @param assessmentId - ID of the assessment to cancel
     */
    cancelAssessment: async (assessmentId: string) => {
        console.log('Breche Assessment ab:', assessmentId);
        try {
            await AsyncStorage.removeItem(`${STORAGE_KEY}:${assessmentId}`);
            
            const cancelLog = {
                assessmentId,
                timestamp: Date.now(),
                action: 'cancelled',
            };
            
            const existingLogs = await AsyncStorage.getItem('assessment_cancellations') || '[]';
            const logs = JSON.parse(existingLogs);
            logs.push(cancelLog);
            
            await AsyncStorage.setItem('assessment_cancellations', JSON.stringify(logs));
            console.log('Assessment erfolgreich abgebrochen:', cancelLog);
        } catch (error) {
            console.error('Fehler beim Abbrechen des Assessments:', error);
        }
    },

    /**
     * Deletes all data associated with a user
     * This includes assessments, answers, and local drafts
     * 
     * @param userId - ID of the user whose data should be deleted
     */
    deleteUserData: async (userId: string): Promise<void> => {
        console.log('Lösche alle Daten für User:', userId);
        
        try {
            // Hole zuerst alle Assessments des Users
            const { data: assessments, error: assessmentError } = await supabase
                .from('assessments')
                .select('id')
                .eq('user_id', userId);

            if (assessmentError) {
                console.error('Fehler beim Laden der Assessments:', assessmentError);
                throw assessmentError;
            }

            const assessmentIds = assessments?.map(a => a.id) || [];
            console.log('Gefundene Assessment IDs:', assessmentIds);

            // Lösche alle zugehörigen Antworten
            if (assessmentIds.length > 0) {
                const { error: answersError } = await supabase
                    .from('assessment_answers')
                    .delete()
                    .in('assessment_id', assessmentIds);

                if (answersError) {
                    console.error('Fehler beim Löschen der Antworten:', answersError);
                    throw answersError;
                }
                console.log('Alle Antworten gelöscht');
            }

            // Lösche alle Assessments des Users
            const { error: deleteError } = await supabase
                .from('assessments')
                .delete()
                .eq('user_id', userId);

            if (deleteError) {
                console.error('Fehler beim Löschen der Assessments:', deleteError);
                throw deleteError;
            }
            console.log('Alle Assessments gelöscht');

            // Lösche lokale Drafts
            const keys = await AsyncStorage.getAllKeys();
            const draftKeys = keys.filter(key => key.startsWith(STORAGE_KEY));
            await AsyncStorage.multiRemove(draftKeys);
            console.log('Lokale Drafts gelöscht');

            console.log('Alle Benutzerdaten erfolgreich gelöscht');
        } catch (error) {
            console.error('Fehler beim Löschen der Benutzerdaten:', error);
            throw error;
        }
    }
}; 