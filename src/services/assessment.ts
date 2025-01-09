import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'assessment_drafts';

interface AssessmentDraft {
    assessmentId: string;
    answers: Record<string, string | string[]>;
    lastUpdated: number;
    completed: boolean;
}

export const AssessmentService = {
    /**
     * Saves the current state of an assessment to AsyncStorage
     */
    saveDraft: async (assessmentId: string, answers: Record<string, string | string[]>) => {
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
        } catch (error) {
            console.error('Error saving assessment draft:', error);
        }
    },

    /**
     * Loads a draft assessment from AsyncStorage
     */
    loadDraft: async (assessmentId: string): Promise<AssessmentDraft | null> => {
        try {
            const stored = await AsyncStorage.getItem(`${STORAGE_KEY}:${assessmentId}`);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading assessment draft:', error);
            return null;
        }
    },

    /**
     * Marks an assessment as completed and removes it from drafts
     */
    completeDraft: async (assessmentId: string) => {
        try {
            await AsyncStorage.removeItem(`${STORAGE_KEY}:${assessmentId}`);
        } catch (error) {
            console.error('Error completing assessment draft:', error);
        }
    },

    /**
     * Submits the assessment to the backend (to be implemented)
     */
    submitAssessment: async (assessmentId: string, answers: Record<string, string | string[]>) => {
        // TODO: Implement API call
        console.log('Submitting assessment:', { assessmentId, answers });
    },

    /**
     * Löscht den Draft und loggt den Abbruch
     */
    cancelAssessment: async (assessmentId: string) => {
        try {
            // Draft löschen
            await AsyncStorage.removeItem(`${STORAGE_KEY}:${assessmentId}`);
            
            // Abbruch loggen
            const cancelLog = {
                assessmentId,
                timestamp: Date.now(),
                action: 'cancelled',
            };
            
            const existingLogs = await AsyncStorage.getItem('assessment_cancellations') || '[]';
            const logs = JSON.parse(existingLogs);
            logs.push(cancelLog);
            
            await AsyncStorage.setItem('assessment_cancellations', JSON.stringify(logs));
            
            console.log('Assessment cancelled:', cancelLog);
        } catch (error) {
            console.error('Error cancelling assessment:', error);
        }
    },
}; 