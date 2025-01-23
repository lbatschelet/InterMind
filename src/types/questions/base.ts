export type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

export interface BaseQuestion {
    id: string;
    question: string;
    type: QuestionType;
    category: string;
    created_at: string;
} 