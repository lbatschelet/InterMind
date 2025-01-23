export * from './base';
export * from './types/choice';
export * from './types/slider';
export * from './types/text';
export * from './ui';
export * from './validation';

// Temporärer Re-export für Abwärtskompatibilität
import { BaseQuestion } from './base';
import { QuestionOption } from './types/choice';
import { SliderConfig } from './types/slider';
import { QuestionUIConfig } from './ui';
import { ValidationRules } from './validation';

export interface Question extends BaseQuestion, QuestionUIConfig {
    validation?: ValidationRules;
    options: QuestionOption[] | SliderConfig;
} 