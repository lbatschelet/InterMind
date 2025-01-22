/**
 * Question Component Module
 * -----------------------
 * Defines the base interfaces for all question components.
 * Provides a standardized way to handle different question types
 * while ensuring consistent behavior and validation.
 * 
 * @module Components/Questions
 */

import type { Question } from '~/src/types/Question';

/**
 * Props interface for question components.
 * All question type implementations must accept these props.
 * 
 * @interface QuestionComponentProps
 */
export interface QuestionComponentProps {
    /** The question object containing all question data */
    question: Question;
    /** Current answer value */
    value: any;
    /** Callback function when answer changes */
    onChange: (value: any) => void;
    /** Optional validation state */
    isValid?: boolean;
    /** Optional callback for automatic question advancement */
    onAutoAdvance?: () => void;
}

/**
 * Base interface for question components.
 * Defines required methods that each question type must implement.
 * 
 * @interface QuestionComponent
 */
export interface QuestionComponent {
    /**
     * Renders the question component
     * @param {QuestionComponentProps} props - Component properties
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps) => JSX.Element;

    /**
     * Validates the current answer value
     * @param {any} value - Value to validate
     * @returns {boolean} True if value is valid
     */
    validate: (value: any) => boolean;

    /**
     * Provides the initial value for this question type
     * @returns {any} Initial value for the question
     */
    getInitialValue: () => any;
} 