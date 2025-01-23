/**
 * Question Factory Module
 * ---------------------
 * Factory pattern implementation for creating question components.
 * Manages the instantiation of different question types and ensures
 * type safety and consistent component creation.
 * 
 * @module Components/Questions
 */

import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { AnyQuestion, QuestionComponent, QuestionValueTypes } from './QuestionComponent';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { SliderQuestion } from './SliderQuestion';
import { TextQuestion } from './TextQuestion';

type QuestionComponents = {
    'single_choice': typeof SingleChoiceQuestion;
    'multiple_choice': typeof MultipleChoiceQuestion;
    'slider': typeof SliderQuestion;
    'text': typeof TextQuestion;
};

/**
 * Question Factory
 * 
 * Provides a centralized way to create question components based on their type.
 * Implements the Factory pattern to encapsulate component creation logic.
 * 
 * Features:
 * - Type-safe component creation
 * - Centralized component mapping
 * - Error handling for unknown types
 * 
 * @namespace QuestionFactory
 */
export const QuestionFactory = {
    /**
     * Returns the appropriate question component for a given question.
     * 
     * @param {AnyQuestion} question - The question to get a component for
     * @returns {QuestionComponent} The corresponding question component
     * @throws {Error} If the question type is not supported
     */
    getComponent: <Q extends AnyQuestion>(question: Q): QuestionComponent<Q, QuestionValueTypes[Q['type']]> => {
        const components: QuestionComponents = {
            'single_choice': SingleChoiceQuestion,
            'multiple_choice': MultipleChoiceQuestion,
            'slider': SliderQuestion,
            'text': TextQuestion
        };

        const component = components[question.type];
        if (!component) {
            throw new Error(`Unknown question type: ${question.type}`);
        }

        return component as unknown as QuestionComponent<Q, QuestionValueTypes[Q['type']]>;
    }
}; 