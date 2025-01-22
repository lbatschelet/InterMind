/**
 * Question Factory Module
 * ---------------------
 * Factory pattern implementation for creating question components.
 * Manages the instantiation of different question types and ensures
 * type safety and consistent component creation.
 * 
 * @module Components/Questions
 */

import { QuestionType } from '~/src/types/Question';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { QuestionComponent } from './QuestionComponent';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { SliderQuestion } from './SliderQuestion';
import { TextQuestion } from './TextQuestion';

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
     * Returns the appropriate question component for a given question type.
     * 
     * @param {QuestionType} type - The type of question to create
     * @returns {QuestionComponent} The corresponding question component
     * @throws {Error} If the question type is not supported
     */
    getComponent: (type: QuestionType): QuestionComponent => {
        switch (type) {
            case 'single_choice':
                return SingleChoiceQuestion;
            case 'multiple_choice':
                return MultipleChoiceQuestion;
            case 'slider':
                return SliderQuestion;
            case 'text':
                return TextQuestion;
            default:
                throw new Error(`Unknown question type: ${type}`);
        }
    }
}; 