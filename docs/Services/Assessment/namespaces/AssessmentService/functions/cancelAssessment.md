[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / cancelAssessment

# Function: cancelAssessment()

> **cancelAssessment**(`assessmentId`): `Promise`\<`boolean`\>

Defined in: [services/assessment.ts:513](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L513)

Cancels an assessment and removes all associated data.

## Parameters

### assessmentId

`string`

ID of the assessment to cancel

## Returns

`Promise`\<`boolean`\>

true if successful, false otherwise

## Example

```typescript
const success = await AssessmentService.cancelAssessment('assessment-123');
if (success) {
  console.log('Assessment cancelled and data removed');
}
```
