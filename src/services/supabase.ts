import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL und Anon Key müssen in den Umgebungsvariablen definiert sein');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Question {
    id: number;
    question: string;
    options: string[];
    category: string;
    created_at: string;
}

export interface Assessment {
    id: number;
    user_id: string;
    device_id: string;
    started_at: string;
    completed_at: string | null;
    created_at: string;
}

export interface AssessmentAnswer {
    id: number;
    assessment_id: number;
    question_id: number;
    selected_option: number;
    answered_at: string;
} 