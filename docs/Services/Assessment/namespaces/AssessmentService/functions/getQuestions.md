[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / getQuestions

# Function: getQuestions()

> **getQuestions**(): `Promise`\<[`Question`](../../../../../Types/Question/interfaces/Question.md)[]\>

Defined in: [services/assessment.ts:115](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L115)

Retrieves all available questions from the database.

## Returns

`Promise`\<[`Question`](../../../../../Types/Question/interfaces/Question.md)[]\>

Array of questions ordered by creation date

## Example

```typescript
const questions = await AssessmentService.getQuestions();
console.log(`Loaded ${questions.length} questions`);
```
