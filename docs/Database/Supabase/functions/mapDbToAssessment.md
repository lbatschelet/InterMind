[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Database/Supabase](../README.md) / mapDbToAssessment

# Function: mapDbToAssessment()

> **mapDbToAssessment**(`dbAssessment`): [`Assessment`](../interfaces/Assessment.md)

Defined in: [services/supabase.ts:222](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L222)

Converts a database assessment record to the application model.

## Parameters

### dbAssessment

[`DbAssessment`](../interfaces/DbAssessment.md)

Raw database record

## Returns

[`Assessment`](../interfaces/Assessment.md)

Formatted application model

## Remarks

Handles:
- Date string to Date object conversion
- Snake case to camel case property mapping
- Optional field handling

## Example

```typescript
const dbRecord = await supabase.from('assessments').select().single();
const assessment = mapDbToAssessment(dbRecord.data);
```
