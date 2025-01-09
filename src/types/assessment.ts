/**
 * Defines the available types of questions in the assessment.
 */
export type QuestionType = 'single_choice' | 'multiple_choice';

/**
 * Interface for a question in the assessment.
 * 
 * @interface
 * @property {string} id - Unique identifier for the question
 * @property {string} questionText - The text content of the question
 * @property {string} [imageUrl] - Optional URL for an associated image
 * @property {QuestionType} type - Type of question (single or multiple choice)
 * @property {boolean} requiresConfirmation - Whether the question needs manual confirmation to proceed
 * @property {Array<{value: string, label: string}>} options - Available answer options
 */
export interface Question {
    id: string;
    questionText: string;
    imageUrl?: string;
    type: QuestionType;
    requiresConfirmation: boolean;
    options: Array<{
        value: string;
        label: string;
    }>;
}

/**
 * Represents a sequence of questions in an assessment
 */
export interface Assessment {
    id: string;
    title: string;
    questions: Question[];
    currentQuestionIndex?: number;
} 