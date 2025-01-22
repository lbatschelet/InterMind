/**
 * Question Type Definitions
 * -----------------------
 * Core type definitions for the assessment system's questions.
 * These types define the structure and behavior of different
 * question types throughout the application.
 * 
 * Question Types:
 * -------------
 * 1. Single Choice: One answer from multiple options
 * 2. Multiple Choice: Multiple answers from options
 * 3. Slider: Numeric value within a range
 * 4. Text: Free-form text input
 * 
 * Type Hierarchy:
 * -------------
 * - QuestionType (type)
 *   └─ Defines available question types
 * 
 * - Question (interface)
 *   ├─ Core properties
 *   ├─ UI/UX settings
 *   └─ Validation rules
 * 
 * - Supporting Types:
 *   ├─ QuestionOption: Choice option structure
 *   └─ SliderConfig: Slider settings
 * 
 * @example
 * ```typescript
 * const question: Question = {
 *   id: '1',
 *   type: 'single_choice',
 *   question: 'Select one:',
 *   options: [
 *     { value: 1, label: 'Option 1' },
 *     { value: 2, label: 'Option 2' }
 *   ]
 * };
 * ```
 * 
 * @packageDocumentation
 * @module Types/Question
 */

/**
 * Defines all possible question types in the application.
 * 
 * @remarks
 * - single_choice: One answer from multiple options
 * - multiple_choice: Multiple answers from options
 * - slider: Numeric value within a range
 * - text: Free-form text input
 */
export type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

/**
 * Represents an option in a choice-based question.
 * Used for both single and multiple choice questions.
 */
export interface QuestionOption {
    /** 
     * Internal value of the option.
     * - Number: Used for analytics and scoring
     * - String: Used for text-based answers
     */
    value: string | number;

    /** 
     * Display text shown to the user.
     * Should be clear and concise.
     */
    label: string;
}

/**
 * Configuration for slider-type questions.
 * Defines the range and behavior of the slider input.
 */
export interface SliderConfig {
    /** Minimum value the slider can represent */
    min: number;

    /** Maximum value the slider can represent */
    max: number;

    /** Step size between values */
    step: number;

    /** Label configuration for the slider ends */
    labels?: {
        /** @param [min] Label for minimum value */
        min?: string;
        /** @param [max] Label for maximum value */
        max?: string;
    };
}

/**
 * Comprehensive question interface that covers both UI and database requirements.
 * 
 * @remarks
 * This interface defines the complete structure of a question, including:
 * - Database properties
 * - UI/UX settings
 * - Validation rules
 * - Type-specific configurations
 */
export interface Question {
    /** Unique identifier for the question */
    id: string;

    /** The actual question text shown to the user */
    question: string;

    /** Type of question, determines input method */
    type: QuestionType;

    /** Category for grouping and analysis */
    category: string;

    /** ISO timestamp of creation */
    created_at: string;
    
    /** 
     * Question options or slider configuration.
     * Type varies based on question type:
     * - Choice questions: QuestionOption[]
     * - Slider questions: SliderConfig
     */
    options: QuestionOption[] | SliderConfig;
    
    /** @param [imageUrl] Optional URL for question-related image */
    imageUrl?: string;

    /** @param [description] Additional explanatory text */
    description?: string;

    /** @param [requiresConfirmation] Whether user must confirm their answer */
    requiresConfirmation?: boolean;

    /** @param [autoAdvance] Whether to advance automatically after answer */
    autoAdvance?: boolean;
    
    /** @param [required] Whether an answer is required */
    required?: boolean;

    /** 
     * @param [validation] Validation rules for the answer:
     * - min: Minimum selections for multiple choice
     * - max: Maximum selections for multiple choice
     * - pattern: Regex pattern for text validation
     */
    validation?: {
        /** Minimum value for numeric inputs or minimum selections for multiple choice questions */
        min?: number;
        /** Maximum value for numeric inputs or maximum selections for multiple choice questions */
        max?: number;
        /** Regular expression pattern for validating text input responses */
        pattern?: string;
    };
}

/**
 * Type guard to check if options are for choice-based questions.
 * 
 * @param options - The options to check
 * @returns True if options are for choice questions
 * 
 * @example
 * ```typescript
 * if (isChoiceOptions(question.options)) {
 *   // Handle choice options
 * }
 * ```
 */
export function isChoiceOptions(options: Question['options']): options is QuestionOption[] {
    return Array.isArray(options);
}

/**
 * Type guard to check if options are for slider questions.
 * 
 * @param options - The options to check  
 * @returns True if options are for slider questions
 * 
 * @example
 * ```typescript
 * if (isSliderConfig(question.options)) {
 *   // Handle slider config
 * }
 * ```
 */
export function isSliderConfig(options: Question['options']): options is SliderConfig {
    return !Array.isArray(options) && 'min' in options && 'max' in options;
}

/**
 * Validation configuration for questions.
 * 
 * @typedef {Object} QuestionValidation
 * @property {number} [min] Minimum value for numeric inputs or minimum selections for choices
 * @property {number} [max] Maximum value for numeric inputs or maximum selections for choices  
 * @property {string} [pattern] Regular expression pattern for text validation
 */ 