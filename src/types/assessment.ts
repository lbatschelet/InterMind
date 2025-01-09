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
 * @property {Array<{value: string, label: string}>} options - Available answer options
 */
export interface Question {
    id: string;
    questionText: string;
    imageUrl?: string;
    type: QuestionType;
    options: Array<{
        value: string;
        label: string;
    }>;
}

/**
 * Example of a single-choice question about sleep quality.
 */
export const MOCK_SLEEP_QUESTION: Question = {
    id: '1',
    type: 'single_choice',
    questionText: 'How would you rate the quality of your sleep last night?',
    imageUrl: 'our-neighborhood',
    options: [
        { value: 'very_poor', label: 'Very poor' },
        { value: 'poor', label: 'Poor' },
        { value: 'average', label: 'Average' },
        { value: 'good', label: 'Good' },
        { value: 'very_good', label: 'Very good' }
    ]
};

/**
 * Example of a multiple-choice question about symptoms.
 */
export const MOCK_SYMPTOMS_QUESTION: Question = {
    id: '2',
    type: 'multiple_choice',
    questionText: 'Which symptoms did you experience today?',
    imageUrl: 'our-neighborhood',
    options: [
        { value: 'headache', label: 'Headache' },
        { value: 'fatigue', label: 'Fatigue' },
        { value: 'nausea', label: 'Nausea' },
        { value: 'dizziness', label: 'Dizziness' },
        { value: 'none', label: 'None of the above' }
    ]
}; 