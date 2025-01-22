[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Location](../../../README.md) / [LocationService](../README.md) / getCurrentLocation

# Function: getCurrentLocation()

> **getCurrentLocation**(): `Promise`\<`undefined` \| [`LocationData`](../../../interfaces/LocationData.md)\>

Defined in: [services/location.ts:68](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/location.ts#L68)

Retrieves the user's current location with reduced accuracy.

## Returns

`Promise`\<`undefined` \| [`LocationData`](../../../interfaces/LocationData.md)\>

Location data with reduced precision or undefined if permission denied

## Example

```typescript
const location = await LocationService.getCurrentLocation();
if (location) {
  console.log(`Lat: ${location.latitude}, Lon: ${location.longitude}`);
}
```
