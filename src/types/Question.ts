/**
 * Defines all possible question types in the application
 */
export type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

/**
 * Represents an option in a choice-based question
 */
export interface QuestionOption {
    value: string | number;
    label: string;
}

/**
 * Configuration for slider questions
 */
export interface SliderConfig {
    min: number;
    max: number;
    step: number;
    labels?: {
        min?: string;
        max?: string;
    };
}

/**
 * Comprehensive question interface that covers both UI and DB requirements
 */
export interface Question {
    // Core properties (DB)
    id: string;
    question: string;
    type: QuestionType;
    category: string;
    created_at: string;
    
    // Options handling
    options: QuestionOption[] | SliderConfig;  // Typisiert statt 'any'
    
    // UI/UX properties
    imageUrl?: string;
    description?: string;
    requiresConfirmation?: boolean;
    autoAdvance?: boolean;
    
    // Validation
    required?: boolean;
    validation?: {
        min?: number;        // Mindestanzahl bei multiple_choice
        max?: number;        // Maximalanzahl bei multiple_choice
        pattern?: string;    // Regex für text
    };
}

/**
 * Type guard to check if options are for a choice-based question
 */
export function isChoiceOptions(options: Question['options']): options is QuestionOption[] {
    return Array.isArray(options);
}

/**
 * Type guard to check if options are for a slider question
 */
export function isSliderConfig(options: Question['options']): options is SliderConfig {
    return !Array.isArray(options) && 'min' in options && 'max' in options;
} 