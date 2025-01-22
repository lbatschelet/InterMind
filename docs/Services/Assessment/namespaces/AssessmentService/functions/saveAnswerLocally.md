[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / saveAnswerLocally

# Function: saveAnswerLocally()

> **saveAnswerLocally**(`assessmentId`, `questionId`, `answerValue`): `Promise`\<`void`\>

Defined in: [services/assessment.ts:199](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L199)

Saves an answer to local storage as a draft.

## Parameters

### assessmentId

`string`

ID of the assessment

### questionId

`string`

ID of the question being answered

### answerValue

The user's answer

`string` | `number` | `number`[]

## Returns

`Promise`\<`void`\>

## Example

```typescript
await AssessmentService.saveAnswerLocally(
  'assessment-123',
  'question-1',
  42
);
```
