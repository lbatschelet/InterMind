/**
 * Question Type Mappers
 * -------------------
 * Provides utility functions to map between different question type representations.
 * 
 * @module Types/Questions/Mappers
 */

import { AnyQuestion } from '../../components/questions/QuestionComponent';
import { Question as LegacyQuestion } from '../Question';
import { QuestionOption } from './types/choice';
import { SliderConfig } from './types/slider';

/**
 * Maps a legacy question to the new question type structure.
 * 
 * @param {LegacyQuestion} question - The legacy question to convert
 * @returns {AnyQuestion} The converted question
 */
export const mapLegacyQuestion = (question: LegacyQuestion): AnyQuestion => {
    const baseQuestion = {
        id: question.id,
        question: question.question,
        type: question.type,
        category: question.category,
        created_at: question.created_at,
        imageUrl: question.imageUrl,
        description: question.description,
        autoAdvance: question.autoAdvance,
        requiresConfirmation: question.requiresConfirmation,
        required: question.required,
        validation: question.validation,
    };

    switch (question.type) {
        case 'single_choice':
        case 'multiple_choice':
            return {
                ...baseQuestion,
                type: question.type,
                options: question.options as QuestionOption[]
            };
        case 'slider':
            return {
                ...baseQuestion,
                type: 'slider',
                options: question.options as SliderConfig
            };
        case 'text':
            return {
                ...baseQuestion,
                type: 'text',
                options: undefined
            };
        default:
            throw new Error(`Unknown question type: ${question.type}`);
    }
}; 