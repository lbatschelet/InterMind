export type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

/**
 * Interface for a question in the assessment session.
 */
export interface Question {
    id: string;
    question: string;
    type: QuestionType;
    options: any;
    category: string;
    created_at: string;
    imageUrl?: string;
}

/**
 * Represents the UI state of an assessment session
 */
export interface AssessmentSession {
    id: string;
    title: string;
    questions: Question[];
    currentQuestionIndex?: number;
} 