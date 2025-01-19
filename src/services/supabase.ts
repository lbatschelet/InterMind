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
 * Sets the device ID in the Supabase session context
 * This is used by Row Level Security policies to control data access
 * 
 * @param deviceId - The unique identifier for the current device
 */
export const setDeviceId = async (deviceId: string) => {
    await supabase.rpc('set_claim', {
        claim: 'device_id',
        value: deviceId
    });
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
    /** User identifier (same as device_id in our case) */
    user_id: string;
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
    userId: string;
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
    userId: dbAssessment.user_id || dbAssessment.device_id,
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
    user_id: assessment.userId || assessment.deviceId,
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