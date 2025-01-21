/**
 * Supabase Service
 * ---------------
 * This is the core service that handles all database interactions.
 * It provides:
 * 1. Database connection setup
 * 2. Type definitions for database entities
 * 3. Mapping functions between DB and app models
 * 4. Row Level Security (RLS) helpers
 * 
 * Database Structure:
 * -----------------
 * - assessments: Main table for user assessments
 * - assessment_answers: Individual answers to questions
 * - questions: Available questions for assessments
 * 
 * Security:
 * --------
 * Uses device-based authentication where each device gets a unique ID
 * that is used to control access to data through RLS policies.
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { debugLog, isDebugEnabled } from '~/src/config/debug';
import type { Question, QuestionType } from '~/src/types/Question';
import type { LocationData } from './location';

// Initialize Supabase client with environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Ensures that the device ID is properly set in the session
 * This function will retry the session check a few times if needed
 * 
 * @param deviceId - The device ID to set in the session
 * @returns Promise<void>
 * @throws Error if session could not be activated after max retries
 */
export const ensureDeviceSession = async (deviceId: string, maxRetries = 3): Promise<void> => {
    // Debug vor dem Setzen der device_id
    if (isDebugEnabled('session')) {
        const { data: beforeSession } = await supabase.rpc('debug_session');
        const { data: beforeRls } = await supabase.rpc('debug_rls');
        debugLog('session', 'Before setting device_id:', {
            session: beforeSession,
            rls: beforeRls
        });
    }

    // Setze die device_id
    await supabase.rpc('set_device_id', { device_id: deviceId });
    debugLog('database', 'Called set_device_id with:', deviceId);
    
    if (isDebugEnabled('session')) {
        // Debug direkt nach dem Setzen
        const { data: afterSession } = await supabase.rpc('debug_session');
        const { data: afterRls } = await supabase.rpc('debug_rls');
        debugLog('session', 'After setting device_id:', {
            session: afterSession,
            rls: afterRls
        });
    }
    
    // Überprüfe die Session mit Retries
    for (let i = 0; i < maxRetries; i++) {
        // Kurze Pause zwischen den Versuchen (exponentiell länger)
        if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 50));
            if (isDebugEnabled('session')) {
                // Debug nach jedem Retry
                const { data: retrySession } = await supabase.rpc('debug_session');
                const { data: retryRls } = await supabase.rpc('debug_rls');
                debugLog('session', `After retry ${i + 1}:`, {
                    session: retrySession,
                    rls: retryRls
                });
            }
        }
        
        // Überprüfe ob die Session aktiv ist
        const { error: sessionError } = await supabase
            .from('assessments')
            .select('id')
            .limit(1);
            
        if (!sessionError) {
            if (isDebugEnabled('session')) {
                // Session ist aktiv
                const { data: finalSession } = await supabase.rpc('debug_session');
                const { data: finalRls } = await supabase.rpc('debug_rls');
                debugLog('session', 'When successful:', {
                    session: finalSession,
                    rls: finalRls
                });
            }
            return;
        }
        
        debugLog('database', `Session check attempt ${i + 1} failed, retrying...`);
    }
    
    if (isDebugEnabled('session')) {
        // Debug wenn alle Versuche fehlgeschlagen sind
        const { data: failureSession } = await supabase.rpc('debug_session');
        const { data: failureRls } = await supabase.rpc('debug_rls');
        debugLog('session', 'After all retries failed:', {
            session: failureSession,
            rls: failureRls
        });
    }
    throw new Error('Could not activate device session after multiple attempts');
};

// Re-export question types from central definition
export { type Question, type QuestionType };

/**
 * Database representation of an assessment
 * This matches the structure in the 'assessments' table
 */
export interface DbAssessment {
    /** Unique identifier for the assessment */
    id: string;
    /** Device identifier that created the assessment */
    device_id: string;
    /** ISO timestamp when assessment was started */
    started_at: string;
    /** ISO timestamp when assessment was completed (if finished) */
    completed_at: string | null;
    /** ISO timestamp of record creation */
    created_at: string;
    /** Location data if available */
    location: LocationData | null;
}

/**
 * Application model for assessments
 * This is the shape we use in the app's business logic
 */
export interface Assessment {
    id: string;
    deviceId: string;
    startedAt: Date;
    completedAt: Date | null;
    location?: LocationData;
}

/**
 * Maps a database assessment to the application model
 * Converts string timestamps to Date objects and handles optional fields
 */
export const mapDbToAssessment = (dbAssessment: DbAssessment): Assessment => ({
    id: dbAssessment.id,
    deviceId: dbAssessment.device_id,
    startedAt: new Date(dbAssessment.started_at),
    completedAt: dbAssessment.completed_at ? new Date(dbAssessment.completed_at) : null,
    location: dbAssessment.location || undefined
});

/**
 * Maps an application assessment model to the database structure
 * Converts Date objects to ISO strings and handles optional fields
 */
export const mapAssessmentToDb = (assessment: Partial<Assessment>): Partial<DbAssessment> => ({
    device_id: assessment.deviceId,
    started_at: assessment.startedAt?.toISOString(),
    completed_at: assessment.completedAt?.toISOString() || null,
    location: assessment.location || null
});

/**
 * Database representation of an assessment answer
 * This matches the structure in the 'assessment_answers' table
 */
export interface AssessmentAnswer {
    /** Unique identifier for the answer */
    id: string;
    /** Reference to the parent assessment */
    assessment_id: string;
    /** Reference to the answered question */
    question_id: string;
    /** The actual answer value (can be various types) */
    answer_value: any;
    /** Type of question that was answered */
    question_type: QuestionType;
    /** ISO timestamp when answer was recorded */
    answered_at: string;
} 