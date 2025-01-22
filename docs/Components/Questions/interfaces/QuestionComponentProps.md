[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Components/Questions](../README.md) / QuestionComponentProps

# Interface: QuestionComponentProps

Defined in: [components/questions/QuestionComponent.ts:19](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L19)

Props interface for question components.
All question type implementations must accept these props.

 QuestionComponentProps

## Properties

### isValid?

> `optional` **isValid**: `boolean`

Defined in: [components/questions/QuestionComponent.ts:27](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L27)

Optional validation state

***

### onAutoAdvance()?

> `optional` **onAutoAdvance**: () => `void`

Defined in: [components/questions/QuestionComponent.ts:29](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L29)

Optional callback for automatic question advancement

#### Returns

`void`

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [components/questions/QuestionComponent.ts:25](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L25)

Callback function when answer changes

#### Parameters

##### value

`any`

#### Returns

`void`

***

### question

> **question**: [`Question`](../../../Types/Question/interfaces/Question.md)

Defined in: [components/questions/QuestionComponent.ts:21](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L21)

The question object containing all question data

***

### value

> **value**: `any`

Defined in: [components/questions/QuestionComponent.ts:23](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/components/questions/QuestionComponent.ts#L23)

Current answer value
