[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Database/Supabase](../README.md) / AssessmentAnswer

# Interface: AssessmentAnswer

Defined in: [services/supabase.ts:254](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L254)

Database schema type for assessment answers.

 AssessmentAnswer

## Properties

### answer\_value

> **answer\_value**: `any`

Defined in: [services/supabase.ts:265](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L265)

Answer value (type varies by question type)

***

### answered\_at

> **answered\_at**: `string`

Defined in: [services/supabase.ts:271](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L271)

ISO timestamp of answer submission

***

### assessment\_id

> **assessment\_id**: `string`

Defined in: [services/supabase.ts:259](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L259)

Reference to parent assessment

***

### id

> **id**: `string`

Defined in: [services/supabase.ts:256](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L256)

Unique identifier for the answer record

***

### question\_id

> **question\_id**: `string`

Defined in: [services/supabase.ts:262](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L262)

Reference to answered question

***

### question\_type

> **question\_type**: [`QuestionType`](../../../Types/Question/type-aliases/QuestionType.md)

Defined in: [services/supabase.ts:268](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L268)

Type of question answered
