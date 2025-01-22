[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Types/Question](../README.md) / Question

# Interface: Question

Defined in: [types/Question.ts:109](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L109)

Comprehensive question interface that covers both UI and database requirements.

## Remarks

This interface defines the complete structure of a question, including:
- Database properties
- UI/UX settings
- Validation rules
- Type-specific configurations

## Properties

### autoAdvance?

> `optional` **autoAdvance**: `boolean`

Defined in: [types/Question.ts:143](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L143)

#### Param

Whether to advance automatically after answer

***

### category

> **category**: `string`

Defined in: [types/Question.ts:120](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L120)

Category for grouping and analysis

***

### created\_at

> **created\_at**: `string`

Defined in: [types/Question.ts:123](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L123)

ISO timestamp of creation

***

### description?

> `optional` **description**: `string`

Defined in: [types/Question.ts:137](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L137)

#### Param

Additional explanatory text

***

### id

> **id**: `string`

Defined in: [types/Question.ts:111](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L111)

Unique identifier for the question

***

### imageUrl?

> `optional` **imageUrl**: `string`

Defined in: [types/Question.ts:134](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L134)

#### Param

Optional URL for question-related image

***

### options

> **options**: [`QuestionOption`](QuestionOption.md)[] \| [`SliderConfig`](SliderConfig.md)

Defined in: [types/Question.ts:131](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L131)

Question options or slider configuration.
Type varies based on question type:
- Choice questions: QuestionOption[]
- Slider questions: SliderConfig

***

### question

> **question**: `string`

Defined in: [types/Question.ts:114](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L114)

The actual question text shown to the user

***

### required?

> `optional` **required**: `boolean`

Defined in: [types/Question.ts:146](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L146)

#### Param

Whether an answer is required

***

### requiresConfirmation?

> `optional` **requiresConfirmation**: `boolean`

Defined in: [types/Question.ts:140](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L140)

#### Param

Whether user must confirm their answer

***

### type

> **type**: [`QuestionType`](../type-aliases/QuestionType.md)

Defined in: [types/Question.ts:117](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L117)

Type of question, determines input method

***

### validation?

> `optional` **validation**: `object`

Defined in: [types/Question.ts:154](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L154)

#### max?

> `optional` **max**: `number`

Maximum value for numeric inputs or maximum selections for multiple choice questions

#### min?

> `optional` **min**: `number`

Minimum value for numeric inputs or minimum selections for multiple choice questions

#### pattern?

> `optional` **pattern**: `string`

Regular expression pattern for validating text input responses

#### Param

Validation rules for the answer:
- min: Minimum selections for multiple choice
- max: Maximum selections for multiple choice
- pattern: Regex pattern for text validation
