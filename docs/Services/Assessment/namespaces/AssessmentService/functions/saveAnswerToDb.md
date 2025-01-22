[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / saveAnswerToDb

# Function: saveAnswerToDb()

> **saveAnswerToDb**(`assessmentId`, `questionId`, `questionType`): `Promise`\<`null` \| [`AssessmentAnswer`](../../../../../Database/Supabase/interfaces/AssessmentAnswer.md)\>

Defined in: [services/assessment.ts:246](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L246)

Persists an answer to the database.

## Parameters

### assessmentId

`string`

ID of the assessment

### questionId

`string`

ID of the question

### questionType

[`QuestionType`](../../../../../Types/Question/type-aliases/QuestionType.md)

Type of question for formatting

## Returns

`Promise`\<`null` \| [`AssessmentAnswer`](../../../../../Database/Supabase/interfaces/AssessmentAnswer.md)\>

Saved answer or null if failed

## Example

```typescript
const answer = await AssessmentService.saveAnswerToDb(
  'assessment-123',
  'question-1',
  'single_choice'
);
```
