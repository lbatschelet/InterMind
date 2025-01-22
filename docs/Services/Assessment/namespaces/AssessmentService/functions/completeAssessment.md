[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / completeAssessment

# Function: completeAssessment()

> **completeAssessment**(`assessmentId`): `Promise`\<`boolean`\>

Defined in: [services/assessment.ts:465](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L465)

Marks an assessment as completed and removes the draft.

## Parameters

### assessmentId

`string`

ID of the assessment to complete

## Returns

`Promise`\<`boolean`\>

true if successful, false otherwise

## Example

```typescript
const success = await AssessmentService.completeAssessment('assessment-123');
if (success) {
  console.log('Assessment completed successfully');
}
```
