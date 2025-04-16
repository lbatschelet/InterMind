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
 * The showOnce flag indicates if the question should only be shown once across all surveys.
 */
export type Question =
  | {
      id: string;
      type: "single_choice";
      text: string;
      options: { value: string; label: string }[];
      category?: string; // Kategorie der Frage (z.B. "demographic", "mood", etc.)
      autoAdvance?: boolean;
      showOnce?: boolean; // If true, question is only shown once per device
      sequence_number?: number; // Für die Sortierung der Fragen
      imageSource?: string; // Name des Bildes in der Grafik-Registry oder URL
    }
  | {
      id: string;
      type: "multiple_choice";
      text: string;
      options: { value: string; label: string }[];
      category?: string; // Kategorie der Frage (z.B. "demographic", "mood", etc.)
      showOnce?: boolean; // If true, question is only shown once per device
      sequence_number?: number; // Für die Sortierung der Fragen
      imageSource?: string; // Name des Bildes in der Grafik-Registry oder URL
    }
  | {
      id: string;
      type: "slider";
      text: string;
      options: { values: string[] };
      category?: string; // Kategorie der Frage (z.B. "demographic", "mood", etc.)
      showOnce?: boolean; // If true, question is only shown once per device
      sequence_number?: number; // Für die Sortierung der Fragen
      imageSource?: string; // Name des Bildes in der Grafik-Registry oder URL
    }
  | {
      id: string;
      type: "text";
      text: string;
      options: null;
      category?: string; // Kategorie der Frage (z.B. "demographic", "mood", etc.)
      showOnce?: boolean; // If true, question is only shown once per device
      sequence_number?: number; // Für die Sortierung der Fragen
      imageSource?: string; // Name des Bildes in der Grafik-Registry oder URL
    }
  | {
      id: string;
      type: "info_screen"; // For non-question screens that present information
      title: string; // The title/heading of the information screen
      text: string; // The main content text
      buttonText?: string; // Optional custom button text (default: "Continue")
      category?: string; // Can be used to associate with specific section (e.g., "demographic_intro")
      showOnce?: boolean; // If true, this info screen is only shown once per device
      sequence_number?: number; // Für die Sortierung der Fragen
      imageSource?: string; // Name des Bildes in der Grafik-Registry oder URL
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
  : T extends "info_screen"
  ? { question: Extract<Question, { type: "info_screen" }>; onNext: () => void }
  : { question: Extract<Question, { type: "single_choice" }>; onNext: (value: string) => void };






