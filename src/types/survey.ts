import { Question } from "./question";

/**
 * Represents a survey containing multiple questions.
 */
export interface Survey {
    id: string;
    questions: Question[];
}