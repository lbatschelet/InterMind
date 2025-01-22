[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Device](../../../README.md) / [DeviceService](../README.md) / resetDeviceId

# Function: resetDeviceId()

> **resetDeviceId**(): `Promise`\<`string`\>

Defined in: [services/device.ts:189](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/device.ts#L189)

Generates and sets a new device identifier.

## Returns

`Promise`\<`string`\>

Newly generated device ID

## Remarks

WARNING: This operation disconnects the device from its previous data.
Use with caution as it effectively creates a new device identity.

Common use cases:
- Privacy resets
- Troubleshooting
- Testing scenarios

## Example

```typescript
const newId = await DeviceService.resetDeviceId();
console.log(`Device reset to: ${newId}`);
```
