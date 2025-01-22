[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / saveDraft

# Function: saveDraft()

> **saveDraft**(`assessmentId`, `answers`): `Promise`\<`void`\>

Defined in: [services/assessment.ts:387](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L387)

Saves the current state of an assessment locally.

## Parameters

### assessmentId

`string`

ID of the assessment to save

### answers

`Record`\<`string`, `string`\>

Current answers for the assessment

## Returns

`Promise`\<`void`\>

## Example

```typescript
await AssessmentService.saveDraft(
  'assessment-123',
  { 'question-1': '42', 'question-2': '1,2,3' }
);
```
