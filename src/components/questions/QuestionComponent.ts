/**
 * Question Component Module
 * -----------------------
 * Defines the base interfaces for all question components.
 * Provides a standardized way to handle different question types
 * while ensuring consistent behavior and validation.
 * 
 * @module Components/Questions
 */

import type { ChoiceQuestion, SliderQuestion, TextQuestion } from '~/src/types/questions';

export type AnyQuestion = ChoiceQuestion | SliderQuestion | TextQuestion;

/**
 * Type mapping für Frage-Typen zu ihren Antwort-Typen
 */
export interface QuestionValueTypes {
    'single_choice': number | null;
    'multiple_choice': number[];
    'slider': number | null;
    'text': string | null;
}

/**
 * Props interface for question components.
 * All question type implementations must accept these props.
 * 
 * @interface QuestionComponentProps
 */
export interface QuestionComponentProps<
    Q extends AnyQuestion = AnyQuestion,
    V extends QuestionValueTypes[Q['type']] = QuestionValueTypes[Q['type']]
> {
    /** The question object containing all question data */
    question: Q;
    /** Current answer value */
    value: V;
    /** Callback function when answer changes */
    onChange: (value: V) => void;
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
export interface QuestionComponent<
    Q extends AnyQuestion = AnyQuestion,
    V extends QuestionValueTypes[Q['type']] = QuestionValueTypes[Q['type']]
> {
    /**
     * Renders the question component
     * @param {QuestionComponentProps<Q, V>} props - Component properties
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps<Q, V>) => JSX.Element;

    /**
     * Validates the current answer value
     * @param {V} value - Value to validate
     * @returns {boolean} True if value is valid
     */
    validate: (value: V) => boolean;

    /**
     * Provides the initial value for this question type
     * @returns {V} Initial value for the question
     */
    getInitialValue: () => V;
} 