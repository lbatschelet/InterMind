/**
 * Answer Type Definitions
 * ---------------------
 * Defines the types for question answers and their storage.
 * 
 * @module Types/Questions/Answers
 */

import { QuestionType } from './base';

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
 * Union type of all possible answer values
 */
export type AnswerValue = QuestionValueTypes[QuestionType];

/**
 * Type for storing answers with question IDs as keys
 */
export type AnswerRecord = Record<string, AnswerValue>;

/**
 * Type for storing answers in string format for persistence
 */
export type StringAnswerRecord = Record<string, string>; 