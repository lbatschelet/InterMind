[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Assessment](../../../README.md) / [AssessmentService](../README.md) / loadDraft

# Function: loadDraft()

> **loadDraft**(`assessmentId`): `Promise`\<`null` \| [`AssessmentDraft`](../../../interfaces/AssessmentDraft.md)\>

Defined in: [services/assessment.ts:421](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/assessment.ts#L421)

Loads a previously saved assessment draft.

## Parameters

### assessmentId

`string`

ID of the assessment to load

## Returns

`Promise`\<`null` \| [`AssessmentDraft`](../../../interfaces/AssessmentDraft.md)\>

The loaded draft or null if not found

## Example

```typescript
const draft = await AssessmentService.loadDraft('assessment-123');
if (draft) {
  console.log('Found draft with answers:', draft.answers);
}
```
