/**
 * Represents a question type in the assessment.
 */
export type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

/**
 * Represents an option in a question.
 */
export interface QuestionOption {
    value: string | number;
    label: string;
}

/**
 * Represents a question in the assessment.
 */
export interface Question {
    id: string;
    questionText: string;
    type: QuestionType;
    requiresConfirmation: boolean;
    options: QuestionOption[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
}

/**
 * Represents an answer to a question.
 */
export interface AssessmentAnswer {
    id: string;
    assessmentId: string;
    questionId: string;
    value: string | number | Array<string | number>;
    createdAt: string;
}

/**
 * Represents an assessment session.
 */
export interface Assessment {
    id: string;
    deviceId: string;
    location: {
        latitude: number;
        longitude: number;
        accuracy?: number;
    } | null;
    createdAt: string;
    completedAt: string | null;
    answers: AssessmentAnswer[];
} 