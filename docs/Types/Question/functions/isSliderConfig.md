[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Types/Question](../README.md) / isSliderConfig

# Function: isSliderConfig()

> **isSliderConfig**(`options`): `options is SliderConfig`

Defined in: [types/Question.ts:194](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L194)

Type guard to check if options are for slider questions.

## Parameters

### options

The options to check

[`QuestionOption`](../interfaces/QuestionOption.md)[] | [`SliderConfig`](../interfaces/SliderConfig.md)

## Returns

`options is SliderConfig`

True if options are for slider questions

## Example

```typescript
if (isSliderConfig(question.options)) {
  // Handle slider config
}
```
