import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Assessment, AssessmentAnswer, Question } from './supabase';
import { supabase } from './supabase';
import { UserService } from './user';

const STORAGE_KEY = 'assessment_drafts';

interface AssessmentDraft {
    assessmentId: string;
    answers: Record<string, string | string[]>;
    lastUpdated: number;
    completed: boolean;
}

export const AssessmentService = {
    /**
     * Lädt alle verfügbaren Fragen aus der Supabase-Datenbank
     */
    getQuestions: async (): Promise<Question[]> => {
        console.log('Lade Fragen aus der Datenbank...');
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('id');

        if (error) {
            console.error('Fehler beim Laden der Fragen:', error);
            return [];
        }

        console.log(`${data.length} Fragen erfolgreich geladen`);
        return data;
    },

    /**
     * Speichert den aktuellen Zustand eines Assessments im lokalen Speicher
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
     * Lädt einen Entwurf aus dem lokalen Speicher
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
     * Erstellt ein neues Assessment in Supabase
     */
    createAssessment: async (): Promise<Assessment | null> => {
        console.log('Erstelle neues Assessment...');
        
        // Hole die User-ID
        const userId = await UserService.getUserId();
        console.log('Erstelle Assessment für User:', userId);

        const { data, error } = await supabase
            .from('assessments')
            .insert([{
                user_id: userId,
                device_id: userId // Verwende die gleiche ID
            }])
            .select()
            .single();

        if (error) {
            console.error('Fehler beim Erstellen des Assessments:', error);
            return null;
        }

        console.log('Assessment erfolgreich erstellt:', data);
        return data;
    },

    /**
     * Speichert eine Antwort in Supabase
     */
    saveAnswer: async (assessmentId: number, questionId: number, selectedOption: number): Promise<AssessmentAnswer | null> => {
        console.log('Speichere Antwort:', { assessmentId, questionId, selectedOption });

        const { data, error } = await supabase
            .from('assessment_answers')
            .insert([{
                assessment_id: assessmentId,
                question_id: questionId,
                selected_option: selectedOption
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
     * Schließt ein Assessment ab
     */
    completeAssessment: async (assessmentId: number) => {
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
     * Bricht ein Assessment ab und löscht den Draft
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
     * Löscht alle Daten eines Benutzers aus der Datenbank
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