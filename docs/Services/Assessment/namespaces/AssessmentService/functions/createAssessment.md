[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / createAssessment

# Function: createAssessment()

> **createAssessment**(`location`?): `Promise`\<`null` \| [`Assessment`](../../../../../Database/Supabase/interfaces/Assessment.md)\>

Defined in: [services/assessment.ts:155](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L155)

Creates a new assessment instance.

## Parameters

### location?

[`LocationData`](../../../../Location/interfaces/LocationData.md)

Optional location data to associate

## Returns

`Promise`\<`null` \| [`Assessment`](../../../../../Database/Supabase/interfaces/Assessment.md)\>

Created assessment or null if creation failed

## Example

```typescript
const location = await LocationService.getCurrentLocation();
const assessment = await AssessmentService.createAssessment(location);
if (assessment) {
  console.log('Started assessment:', assessment.id);
}
```
