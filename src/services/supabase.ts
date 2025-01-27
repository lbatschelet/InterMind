/**
 * @packageDocumentation
 * @module Database/Supabase
 * 
 * @summary
 * Core database integration layer providing type-safe access to the Supabase backend.
 * 
 * @remarks
 * Handles all database operations, authentication, and data mapping between
 * application and database models.
 * 
 * Database Schema:
 * - assessments: Core assessment records
 * - assessment_answers: Individual question responses
 * - questions: Assessment question definitions
 * 
 * Security Model:
 * - Device-based authentication with unique identifiers
 * - Row Level Security (RLS) policies control data access
 * - Session management ensures proper authorization
 * 
 * Data Flow:
 * 1. Device Authentication:
 *    - Device ID verification
 *    - Session establishment
 *    - RLS policy activation
 * 
 * 2. Data Operations:
 *    - Type-safe database interactions
 *    - Automatic data mapping
 *    - Error handling
 * 
 * Error Handling:
 * - Connection issues trigger retries
 * - Authentication failures are logged
 * - Data validation errors are captured
 */

import { createClient } from '@supabase/supabase-js';
import { debugLog, isDebugEnabled } from '~/src/config/debug';
import type { Question, QuestionType } from '~/src/types/Question';
import type { LocationData } from './location';

/** Required environment variables for Supabase connection */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

/**
 * Global Supabase client instance.
 * Initialized with environment-specific configuration.
 * 
 * @type {SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Ensures proper device authentication in the current session.
 * 
 * @param deviceId - The device identifier to authenticate with
 * @param [maxRetries=3] - Maximum number of retry attempts
 * @returns Promise that resolves when session is activated
 * @throws {Error} When session activation fails after all retries
 * 
 * @remarks
 * This method:
 * 1. Sets the device ID in the session
 * 2. Verifies session activation
 * 3. Retries on failure with exponential backoff
 * 4. Provides detailed debug information when enabled
 * 
 * This is an asynchronous operation that may take several seconds
 * to complete due to retry attempts.
 * 
 * @example
 * ```typescript
 * try {
 *   await ensureDeviceSession('ABC1-2DEF-3GHI');
 *   console.log('Device authenticated');
 * } catch (error) {
 *   console.error('Authentication failed:', error);
 * }
 * ```
 */
export const ensureDeviceSession = async (deviceId: string, maxRetries = 3): Promise<void> => {
    if (isDebugEnabled('session')) {
        const { data: beforeSession } = await supabase.rpc('debug_session');
        const { data: beforeRls } = await supabase.rpc('debug_rls');
        debugLog('session', 'Session state before authentication:', {
            session: beforeSession,
            rls: beforeRls
        });
    }

    await supabase.rpc('set_device_id', { device_id: deviceId });
    debugLog('database', 'Device ID set in session:', deviceId);
    
    if (isDebugEnabled('session')) {
        const { data: afterSession } = await supabase.rpc('debug_session');
        const { data: afterRls } = await supabase.rpc('debug_rls');
        debugLog('session', 'Session state after authentication:', {
            session: afterSession,
            rls: afterRls
        });
    }
    
    for (let i = 0; i < maxRetries; i++) {
        if (i > 0) {
            const delay = Math.pow(2, i) * 50;
            await new Promise(resolve => setTimeout(resolve, delay));
            debugLog('database', `Retry attempt ${i + 1} after ${delay}ms delay`);
            
            if (isDebugEnabled('session')) {
                const { data: retrySession } = await supabase.rpc('debug_session');
                const { data: retryRls } = await supabase.rpc('debug_rls');
                debugLog('session', `Session state after retry ${i + 1}:`, {
                    session: retrySession,
                    rls: retryRls
                });
            }
        }
        
        const { error: sessionError } = await supabase
            .from('assessments')
            .select('id')
            .limit(1);
            
        if (!sessionError) {
            if (isDebugEnabled('session')) {
                const { data: finalSession } = await supabase.rpc('debug_session');
                const { data: finalRls } = await supabase.rpc('debug_rls');
                debugLog('session', 'Final successful session state:', {
                    session: finalSession,
                    rls: finalRls
                });
            }
            return;
        }
        
        debugLog('database', `Session verification attempt ${i + 1} failed`);
    }
    
    if (isDebugEnabled('session')) {
        const { data: failureSession } = await supabase.rpc('debug_session');
        const { data: failureRls } = await supabase.rpc('debug_rls');
        debugLog('session', 'Session state after all retries failed:', {
            session: failureSession,
            rls: failureRls
        });
    }
    throw new Error('Device session activation failed after maximum retry attempts');
};

// Re-export question types from central definition
export { type Question, type QuestionType };

/**
 * Database schema type for assessment records.
 * 
 * @typedef {Object} DbAssessment
 * @property {string} id Unique identifier for the assessment
 * @property {string} device_id Device identifier that created the assessment
 * @property {string} started_at ISO timestamp when assessment was started
 * @property {string | null} completed_at ISO timestamp when assessment was completed
 * @property {string} created_at ISO timestamp of record creation
 * @property {LocationData | null} location Location data if available
 */
export interface DbAssessment {
    id: string;
    device_id: string;
    started_at: string;
    completed_at: string | null;
    created_at: string;
    location: LocationData | null;
}

/**
 * Application model for assessment data.
 * 
 * @typedef {Object} Assessment
 * @property {string} id Unique identifier matching database record
 * @property {string} deviceId Associated device identifier
 * @property {Date} startedAt JavaScript Date object of start time
 * @property {Date | null} completedAt JavaScript Date object of completion time
 * @property {LocationData} [location] Optional location data
 * 
 * @remarks
 * This interface represents the assessment data structure used
 * throughout the application's business logic, with proper
 * type conversion from database types.
 */
export interface Assessment {
    id: string;
    deviceId: string;
    startedAt: Date;
    completedAt: Date | null;
    location?: LocationData;
}

/**
 * Converts a database assessment record to the application model.
 * 
 * @param dbAssessment Raw database record
 * @returns Formatted application model
 * 
 * @remarks
 * Handles:
 * - Date string to Date object conversion
 * - Snake case to camel case property mapping
 * - Optional field handling
 * 
 * @example
 * ```typescript
 * const dbRecord = await supabase.from('assessments').select().single();
 * const assessment = mapDbToAssessment(dbRecord.data);
 * ```
 */
export const mapDbToAssessment = (dbAssessment: DbAssessment): Assessment => ({
    id: dbAssessment.id,
    deviceId: dbAssessment.device_id,
    startedAt: new Date(dbAssessment.started_at),
    completedAt: dbAssessment.completed_at ? new Date(dbAssessment.completed_at) : null,
    location: dbAssessment.location || undefined
});

/**
 * Converts an application assessment model to database format.
 * 
 * @param assessment Application model
 * @returns Database-ready record
 * 
 * @remarks
 * Handles:
 * - Date object to ISO string conversion
 * - Camel case to snake case property mapping
 * - Null/undefined field normalization
 */
export const mapAssessmentToDb = (assessment: Partial<Assessment>): Partial<DbAssessment> => ({
    device_id: assessment.deviceId,
    started_at: assessment.startedAt?.toISOString(),
    completed_at: assessment.completedAt?.toISOString() || null,
    location: assessment.location || null
});

/**
 * Database schema type for assessment answers.
 * 
 * @interface AssessmentAnswer
 */
export interface AssessmentAnswer {
    /** Unique identifier for the answer record */
    id: string;
    
    /** Reference to parent assessment */
    assessment_id: string;
    
    /** Reference to answered question */
    question_id: string;
    
    /** Answer value (string, number, or array of numbers) */
    answer_value: string | number | number[];
    
    /** Type of question answered */
    question_type: QuestionType;
    
    /** ISO timestamp of answer submission */
    answered_at: string;
} 