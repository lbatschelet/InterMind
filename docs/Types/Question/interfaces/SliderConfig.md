[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Types/Question](../README.md) / SliderConfig

# Interface: SliderConfig

Defined in: [types/Question.ts:80](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L80)

Configuration for slider-type questions.
Defines the range and behavior of the slider input.

## Properties

### labels?

> `optional` **labels**: `object`

Defined in: [types/Question.ts:91](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L91)

Label configuration for the slider ends

#### max?

> `optional` **max**: `string`

##### Param

Label for maximum value

#### min?

> `optional` **min**: `string`

##### Param

Label for minimum value

***

### max

> **max**: `number`

Defined in: [types/Question.ts:85](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L85)

Maximum value the slider can represent

***

### min

> **min**: `number`

Defined in: [types/Question.ts:82](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L82)

Minimum value the slider can represent

***

### step

> **step**: `number`

Defined in: [types/Question.ts:88](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/types/Question.ts#L88)

Step size between values
