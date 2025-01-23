import { BaseQuestion } from '../base';
import { QuestionUIConfig } from '../ui';
import { ValidationRules } from '../validation';

export interface SliderConfig {
    min: number;
    max: number;
    step: number;
    labels?: {
        min?: string;
        max?: string;
    };
}

export interface SliderQuestion extends BaseQuestion, QuestionUIConfig {
    type: 'slider';
    options: SliderConfig;
    validation?: ValidationRules & {
        min?: number; // Minimum allowed value
        max?: number; // Maximum allowed value
    };
} 