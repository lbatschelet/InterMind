export type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

export interface BaseQuestion {
    id: string;
    question: string;
    type: QuestionType;
    category: string;
    created_at: string;
} 

import { MultipleChoiceQuestion, SingleChoiceQuestion } from './types/choice';
import { SliderQuestion } from './types/slider';
import { TextQuestion } from './types/text';

export type AnyQuestion = 
    | SingleChoiceQuestion 
    | MultipleChoiceQuestion 
    | SliderQuestion 
    | TextQuestion; 