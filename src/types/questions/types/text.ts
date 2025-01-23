import { BaseQuestion } from '../base';
import { QuestionUIConfig } from '../ui';
import { ValidationRules } from '../validation';

export interface TextQuestion extends BaseQuestion, QuestionUIConfig {
    type: 'text';
    options?: never;
    validation?: ValidationRules & {
        pattern?: string; // Regex pattern for validation
    };
} 