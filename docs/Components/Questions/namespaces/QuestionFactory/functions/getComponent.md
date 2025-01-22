[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Components/Questions](../../../README.md) / [QuestionFactory](../README.md) / getComponent

# Function: getComponent()

> **getComponent**(`type`): [`QuestionComponent`](../../../interfaces/QuestionComponent.md)

Defined in: [components/questions/QuestionFactory.ts:39](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionFactory.ts#L39)

Returns the appropriate question component for a given question type.

## Parameters

### type

[`QuestionType`](../../../../../Types/Question/type-aliases/QuestionType.md)

The type of question to create

## Returns

[`QuestionComponent`](../../../interfaces/QuestionComponent.md)

The corresponding question component

## Throws

If the question type is not supported
