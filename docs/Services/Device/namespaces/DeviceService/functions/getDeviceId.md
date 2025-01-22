[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Device](../../../README.md) / [DeviceService](../README.md) / getDeviceId

# Function: getDeviceId()

> **getDeviceId**(): `Promise`\<`string`\>

Defined in: [services/device.ts:129](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/device.ts#L129)

Retrieves or generates the device identifier.

## Returns

`Promise`\<`string`\>

Device ID in format XXXX-XXXX-XXXX

## Remarks

This is the primary method for getting a device's ID. It will:
1. Check AsyncStorage for existing ID
2. Validate the format if found
3. Generate new ID if none exists or invalid
4. Store and return the final ID

## Example

```typescript
const deviceId = await DeviceService.getDeviceId();
console.log(`Using device: ${deviceId}`);
```
