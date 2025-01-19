import type { QuestionType } from '~/src/services/supabase';
import type { QuestionComponent } from './QuestionComponent';
import {
    MultipleChoiceQuestion,
    SingleChoiceQuestion,
    SliderQuestion,
    TextQuestion
} from './index';

/**
 * Factory for creating question components based on their type.
 * Provides a centralized way to get the appropriate component for each question type.
 */
export const QuestionFactory = {
    /**
     * Returns the appropriate question component for the given type
     * 
     * @param type - The type of question to create
     * @returns The corresponding question component
     * @throws Error if the question type is unknown
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