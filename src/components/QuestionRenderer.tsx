import React from "react";
import { Text } from "react-native";
import SingleChoice from "./QuestionTypes/SingleChoice";
import MultipleChoice from "./QuestionTypes/MultipleChoice";
import { SliderQuestion } from "./QuestionTypes/Slider";
import TextInputQuestion from "./QuestionTypes/TextInput";
import { Question, QuestionComponentProps } from "../types/question";
import { createLogger } from "~/src/utils/logger";

const log = createLogger("QuestionRenderer");

/**
 * Renders the appropriate UI component for a given question.
 * - Dynamically selects the correct question type.
 * - Ensures type safety for `onNext` responses.
 */
const QuestionRenderer = ({ question, onNext }: { 
  question: Question;
  onNext: (response: string | string[] | number) => void;
}) => {
  log.debug("Rendering question", question);

  switch (question.type) {
    case "single_choice":
      return <SingleChoice question={question} onNext={onNext as (value: string) => void} />;

    case "multiple_choice":
      return <MultipleChoice question={question} onNext={onNext as (value: string[]) => void} />;

    case "slider":
      return <SliderQuestion question={question} onNext={onNext as (value: number) => void} />;

    case "text":
      return <TextInputQuestion question={question} onNext={onNext as (value: string) => void} />;

    default:
      log.error("Unknown question type", question);
      return <Text>Error: Unknown question type</Text>;
  }
};



export default QuestionRenderer;
