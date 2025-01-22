[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Types/Question](../README.md) / isChoiceOptions

# Function: isChoiceOptions()

> **isChoiceOptions**(`options`): `options is QuestionOption[]`

Defined in: [types/Question.ts:177](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L177)

Type guard to check if options are for choice-based questions.

## Parameters

### options

The options to check

[`QuestionOption`](../interfaces/QuestionOption.md)[] | [`SliderConfig`](../interfaces/SliderConfig.md)

## Returns

`options is QuestionOption[]`

True if options are for choice questions

## Example

```typescript
if (isChoiceOptions(question.options)) {
  // Handle choice options
}
```
