[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / verifyAnswers

# Function: verifyAnswers()

> **verifyAnswers**(`assessmentId`): `Promise`\<`boolean`\>

Defined in: [services/assessment.ts:314](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L314)

Verifies data consistency between local and remote answers.

## Parameters

### assessmentId

`string`

ID of the assessment to verify

## Returns

`Promise`\<`boolean`\>

true if consistent, false if discrepancies found

## Example

```typescript
const isConsistent = await AssessmentService.verifyAnswers('assessment-123');
if (!isConsistent) {
  console.log('Found answer discrepancies');
}
```
