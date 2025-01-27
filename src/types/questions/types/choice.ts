import { BaseQuestion } from '../base';
import { QuestionUIConfig } from '../ui';
import { ValidationRules } from '../validation';

export interface QuestionOption {
    value: string | number;
    label: string;
}

interface BaseChoiceQuestion extends BaseQuestion, QuestionUIConfig {
    options: QuestionOption[];
    validation?: ValidationRules & {
        min?: number;
        max?: number;
    };
}

export interface SingleChoiceQuestion extends BaseChoiceQuestion {
    type: 'single_choice';
}

export interface MultipleChoiceQuestion extends BaseChoiceQuestion {
    type: 'multiple_choice';
}

export type ChoiceQuestion = SingleChoiceQuestion | MultipleChoiceQuestion; 