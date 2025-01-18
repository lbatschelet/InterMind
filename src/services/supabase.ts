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

export type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

export interface Question {
    id: string;
    question: string;
    type: QuestionType;
    options: any;
    category: string;
    created_at: string;
}

export interface Assessment {
    id: string;
    user_id: string;
    device_id: string;
    started_at: string;
    completed_at: string | null;
    created_at: string;
}

export interface AssessmentAnswer {
    id: string;
    assessment_id: string;
    question_id: string;
    answer_value: any;
    question_type: QuestionType;
    answered_at: string;
} 