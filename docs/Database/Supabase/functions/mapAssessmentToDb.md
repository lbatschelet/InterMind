[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Database/Supabase](../README.md) / mapAssessmentToDb

# Function: mapAssessmentToDb()

> **mapAssessmentToDb**(`assessment`): `Partial`\<[`DbAssessment`](../interfaces/DbAssessment.md)\>

Defined in: [services/supabase.ts:242](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L242)

Converts an application assessment model to database format.

## Parameters

### assessment

`Partial`\<[`Assessment`](../interfaces/Assessment.md)\>

Application model

## Returns

`Partial`\<[`DbAssessment`](../interfaces/DbAssessment.md)\>

Database-ready record

## Remarks

Handles:
- Date object to ISO string conversion
- Camel case to snake case property mapping
- Null/undefined field normalization
