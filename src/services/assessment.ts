import AsyncStorage from '@react-native-async-storage/async-storage';
import { debugLog } from '~/src/config/debug';
import { DeviceService } from './device';
import { LocationData } from './location';
import {
    Assessment,
    AssessmentAnswer,
    Question,
    QuestionType,
    ensureDeviceSession,
    mapDbToAssessment,
    supabase
} from './supabase';

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
    answers: Record<string, string>;  // Alles wird als String gespeichert
    lastUpdated: number;
    completed: boolean;
}

/**
 * Normalisiert einen Antwortwert für den Vergleich
 * - Arrays mit einem Wert werden zu einer einzelnen Zahl
 * - Arrays mit mehreren Werten bleiben Arrays (sortiert)
 * - Strings mit Zahlen werden zu Zahlen
 * - Strings bleiben Strings
 */
const normalizeAnswerValue = (value: any): any => {
    // Wenn es ein Array ist
    if (Array.isArray(value)) {
        const numbers = value.map(Number);
        // Wenn es nur ein Element hat, gib die Zahl zurück
        return numbers.length === 1 ? numbers[0] : numbers.sort((a, b) => a - b);
    }
    
    // Wenn es ein String ist
    if (typeof value === 'string') {
        // Wenn der String ein Array-Format hat (z.B. "1,2,3")
        if (value.includes(',')) {
            const numbers = value.split(',').map(v => Number(v.trim()));
            // Auch hier: Einzelnes Element wird zur Zahl
            return numbers.length === 1 ? numbers[0] : numbers.sort((a, b) => a - b);
        }
        // Wenn der String eine Zahl ist
        const num = Number(value);
        return isNaN(num) ? value : num;
    }
    
    return value;
};

export const AssessmentService = {
    /**
     * Loads all available questions from the database
     * @returns Array of questions ordered by ID
     */
    getQuestions: async (): Promise<Question[]> => {
        debugLog('database', 'Lade Fragen aus der Datenbank');
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            debugLog('database', 'Fehler beim Laden der Fragen:', error);
            return [];
        }

        debugLog('services', `${data.length} Fragen geladen`);
        
        // Transformiere die Optionen in das richtige Format
        return data.map(question => ({
            ...question,
            options: question.type === 'slider' 
                ? question.options  // Slider-Format ist bereits korrekt
                : (question.options as string[])?.map((label, index) => ({
                    value: index,
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
        try {
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            debugLog('services', 'Erstelle neues Assessment');
            const { data, error } = await supabase
                .from('assessments')
                .insert({
                    device_id: deviceId,
                    location: location || null
                })
                .select()
                .single();

            if (error) {
                debugLog('database', 'Fehler beim Erstellen des Assessments:', error);
                return null;
            }

            debugLog('services', 'Assessment erstellt:', data.id);
            return mapDbToAssessment(data);
        } catch (error) {
            debugLog('services', 'Fehler beim Assessment erstellen:', error);
            return null;
        }
    },

    /**
     * Speichert eine Antwort nur lokal im Draft
     * Wird sofort aufgerufen, wenn der User eine Antwort ändert
     */
    saveAnswerLocally: async (
        assessmentId: string,
        questionId: string,
        answerValue: number | number[] | string,
    ): Promise<void> => {
        try {
            const draft = await AssessmentService.loadDraft(assessmentId) || {
                assessmentId,
                answers: {},
                lastUpdated: Date.now(),
                completed: false
            };

            // Konvertiere den Wert zu String für die Speicherung
            const stringValue = Array.isArray(answerValue) 
                ? answerValue.join(',')
                : String(answerValue);

            draft.answers[questionId] = stringValue;
            draft.lastUpdated = Date.now();

            await AsyncStorage.setItem(
                `${STORAGE_KEY}:${assessmentId}`, 
                JSON.stringify(draft)
            );
            debugLog('ui', 'Antwort lokal gespeichert:', { questionId, answerValue });
        } catch (error) {
            debugLog('ui', 'Fehler beim lokalen Speichern:', error);
        }
    },

    /**
     * Speichert die aktuelle Antwort in der Datenbank
     * Wird aufgerufen, wenn zur nächsten Frage navigiert wird
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
                debugLog('services', 'Keine lokale Antwort gefunden für:', { assessmentId, questionId });
                return null;
            }

            const stringValue = draft.answers[questionId];
            debugLog('database', 'Speichere Antwort in DB:', { questionId, stringValue, questionType });

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
                debugLog('database', 'Fehler beim Speichern in DB:', error);
                return null;
            }

            debugLog('database', 'Antwort erfolgreich in DB gespeichert');
            return data;
        } catch (error) {
            debugLog('services', 'Fehler beim DB-Speichern:', error);
            return null;
        }
    },

    /**
     * Verifies that all answers in the local draft match the database entries
     * Called at the end of an assessment to ensure data consistency
     * 
     * @param assessmentId - ID of the assessment to verify
     * @returns true if all answers match, false if there are discrepancies
     */
    verifyAnswers: async (assessmentId: string): Promise<boolean> => {
        try {
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            // Hole lokale Antworten
            const draft = await AssessmentService.loadDraft(assessmentId);
            if (!draft) {
                debugLog('services', 'Kein lokaler Draft gefunden für Assessment:', assessmentId);
                return false;
            }

            // Hole Antworten aus der Datenbank
            const { data: dbAnswers, error } = await supabase
                .from('assessment_answers')
                .select('question_id, answer_value')
                .eq('assessment_id', assessmentId);

            if (error) {
                debugLog('database', 'Fehler beim Laden der DB-Antworten:', error);
                return false;
            }

            // Vergleiche Antworten
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
                        `Diskrepanz gefunden für Frage ${questionId}:`,
                        '\nLokal (normalisiert):', normalizedLocal,
                        '\nDB (normalisiert):', normalizedDb,
                        '\nOriginal Lokal:', localAnswer,
                        '\nOriginal DB:', dbAnswer
                    );
                    allMatch = false;
                }
            }

            if (allMatch) {
                debugLog('services', 'Alle Antworten stimmen überein');
            } else {
                debugLog('services', 'Einige Antworten stimmen nicht überein');
            }

            return allMatch;
        } catch (error) {
            debugLog('services', 'Fehler beim Verifizieren der Antworten:', error);
            return false;
        }
    },

    /**
     * Saves the current state of an assessment locally
     * This allows users to continue later if they close the app
     * 
     * @param assessmentId - ID of the assessment to save
     * @param answers - Current answers for the assessment
     */
    saveDraft: async (assessmentId: string, answers: Record<string, string>) => {
        debugLog('ui', 'Speichere Assessment-Draft:', { assessmentId, answers });
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
            debugLog('ui', 'Assessment-Draft erfolgreich gespeichert');
        } catch (error) {
            debugLog('ui', 'Fehler beim Speichern des Assessment-Entwurfs:', error);
        }
    },

    /**
     * Loads a previously saved assessment draft
     */
    loadDraft: async (assessmentId: string): Promise<AssessmentDraft | null> => {
        debugLog('ui', 'Lade Draft:', assessmentId);
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
            
            debugLog('ui', 'Draft geladen:', draft);
            return draft;
        } catch (error) {
            debugLog('ui', 'Fehler beim Laden des Drafts:', error);
            return null;
        }
    },

    /**
     * Marks an assessment as completed and removes the draft
     * 
     * @param assessmentId - ID of the assessment to complete
     */
    completeAssessment: async (assessmentId: string): Promise<boolean> => {
        try {
            debugLog('services', 'Schließe Assessment ab:', assessmentId);
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            const { error } = await supabase
                .from('assessments')
                .update({ completed_at: new Date().toISOString() })
                .eq('id', assessmentId);

            if (error) {
                debugLog('database', 'Fehler beim Abschließen des Assessments:', error);
                return false;
            }

            // Markiere den Draft als abgeschlossen
            const draft = await AssessmentService.loadDraft(assessmentId);
            if (draft) {
                draft.completed = true;
                await AsyncStorage.setItem(
                    `${STORAGE_KEY}:${assessmentId}`, 
                    JSON.stringify(draft)
                );
            }

            debugLog('services', 'Assessment erfolgreich abgeschlossen');
            return true;
        } catch (error) {
            debugLog('services', 'Fehler beim Abschließen des Assessments:', error);
            return false;
        }
    },

    /**
     * Cancels an assessment and removes its draft
     * Also logs the cancellation for analytics
     * 
     * @param assessmentId - ID of the assessment to cancel
     */
    cancelAssessment: async (assessmentId: string): Promise<boolean> => {
        try {
            debugLog('services', 'Breche Assessment ab:', assessmentId);
            const deviceId = await DeviceService.getDeviceId();
            await ensureDeviceSession(deviceId);

            // Lösche zuerst alle Antworten
            const { error: answersError } = await supabase
                .from('assessment_answers')
                .delete()
                .eq('assessment_id', assessmentId);

            if (answersError) {
                debugLog('database', 'Fehler beim Löschen der Antworten:', answersError);
                return false;
            }

            // Dann das Assessment selbst
            const { error: assessmentError } = await supabase
                .from('assessments')
                .delete()
                .eq('id', assessmentId);

            if (assessmentError) {
                debugLog('database', 'Fehler beim Löschen des Assessments:', assessmentError);
                return false;
            }

            // Lösche den lokalen Draft
            await AsyncStorage.removeItem(`${STORAGE_KEY}:${assessmentId}`);
            debugLog('services', 'Assessment erfolgreich abgebrochen');
            return true;
        } catch (error) {
            debugLog('services', 'Fehler beim Abbrechen des Assessments:', error);
            return false;
        }
    },

    
}; 