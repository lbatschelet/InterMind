[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Device](../../../README.md) / [DeviceService](../README.md) / getCurrentDeviceId

# Function: getCurrentDeviceId()

> **getCurrentDeviceId**(): `Promise`\<`null` \| `string`\>

Defined in: [services/device.ts:165](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/device.ts#L165)

Retrieves the current device ID without generation.

## Returns

`Promise`\<`null` \| `string`\>

Current device ID or null if not set

## Remarks

Unlike getDeviceId(), this method will not generate a new ID
if none exists. Useful for checking device registration status.

## Example

```typescript
const currentId = await DeviceService.getCurrentDeviceId();
if (currentId) {
  console.log('Device is registered');
}
```
