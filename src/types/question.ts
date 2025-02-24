/**
 * @packageDocumentation
 * @module Types/Question
 * 
 * @summary
 * Defines the structure of survey questions and their properties.
 * 
 * @remarks
 * - Uses a discriminated union for type safety.
 * - Ensures only relevant properties exist per question type.
 * - Supports different question formats (single-choice, multiple-choice, slider, text).
 */

/**
 * Represents a survey question.
 * 
 * @remarks
 * Each question type has a specific structure to ensure correctness.
 */
export type Question =
  | {
      id: string;
      type: "single_choice";
      text: string;
      options: { value: string; label: string }[];
      autoAdvance?: boolean;
    }
  | {
      id: string;
      type: "multiple_choice";
      text: string;
      options: { value: string; label: string }[];
    }
  | {
      id: string;
      type: "slider";
      text: string;
      options: { values: string[] };
    }
  | {
      id: string;
      type: "text";
      text: string;
      options: null;
    };

/**
 * Props for question components.
 * 
 * @template T The type of the question (e.g., "single_choice", "slider").
 * 
 * Ensures that each question component receives only the properties relevant to its type.
 */
export type QuestionComponentProps<T extends Question["type"]> = T extends "multiple_choice"
  ? { question: Extract<Question, { type: "multiple_choice" }>; onNext: (value: string[]) => void }
  : T extends "slider"
  ? { question: Extract<Question, { type: "slider" }>; onNext: (value: number) => void }
  : T extends "text"
  ? { question: Extract<Question, { type: "text" }>; onNext: (value: string) => void }
  : { question: Extract<Question, { type: "single_choice" }>; onNext: (value: string) => void };






