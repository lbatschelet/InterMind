[**serencity v1.0.0**](../../README.md)

***

[serencity](../../modules.md) / Types/Question

# Types/Question

Question Type Definitions
-----------------------
Core type definitions for the assessment system's questions.
These types define the structure and behavior of different
question types throughout the application.

Question Types:
-------------
1. Single Choice: One answer from multiple options
2. Multiple Choice: Multiple answers from options
3. Slider: Numeric value within a range
4. Text: Free-form text input

Type Hierarchy:
-------------
- QuestionType (type)
  └─ Defines available question types

- Question (interface)
  ├─ Core properties
  ├─ UI/UX settings
  └─ Validation rules

- Supporting Types:
  ├─ QuestionOption: Choice option structure
  └─ SliderConfig: Slider settings

## Example

```typescript
const question: Question = {
  id: '1',
  type: 'single_choice',
  question: 'Select one:',
  options: [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' }
  ]
};
```

## Interfaces

- [Question](interfaces/Question.md)
- [QuestionOption](interfaces/QuestionOption.md)
- [SliderConfig](interfaces/SliderConfig.md)

## Type Aliases

- [QuestionType](type-aliases/QuestionType.md)

## Functions

- [isChoiceOptions](functions/isChoiceOptions.md)
- [isSliderConfig](functions/isSliderConfig.md)
