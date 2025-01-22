[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Types/Question](../README.md) / QuestionOption

# Interface: QuestionOption

Defined in: [types/Question.ts:61](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L61)

Represents an option in a choice-based question.
Used for both single and multiple choice questions.

## Properties

### label

> **label**: `string`

Defined in: [types/Question.ts:73](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L73)

Display text shown to the user.
Should be clear and concise.

***

### value

> **value**: `string` \| `number`

Defined in: [types/Question.ts:67](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L67)

Internal value of the option.
- Number: Used for analytics and scoring
- String: Used for text-based answers
