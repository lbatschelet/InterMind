[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Components/Questions](../README.md) / QuestionComponent

# Interface: QuestionComponent

Defined in: [components/questions/QuestionComponent.ts:38](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L38)

Base interface for question components.
Defines required methods that each question type must implement.

 QuestionComponent

## Properties

### getInitialValue()

> **getInitialValue**: () => `any`

Defined in: [components/questions/QuestionComponent.ts:57](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L57)

Provides the initial value for this question type

#### Returns

`any`

Initial value for the question

***

### render()

> **render**: (`props`) => `Element`

Defined in: [components/questions/QuestionComponent.ts:44](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L44)

Renders the question component

#### Parameters

##### props

[`QuestionComponentProps`](QuestionComponentProps.md)

Component properties

#### Returns

`Element`

Rendered question component

***

### validate()

> **validate**: (`value`) => `boolean`

Defined in: [components/questions/QuestionComponent.ts:51](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L51)

Validates the current answer value

#### Parameters

##### value

`any`

Value to validate

#### Returns

`boolean`

True if value is valid
