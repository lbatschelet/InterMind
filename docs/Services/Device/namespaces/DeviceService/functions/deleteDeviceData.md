[**serencity v1.0.0**](../../../../../README.md)

***

[serencity](../../../../../modules.md) / [Services/Device](../../../README.md) / [DeviceService](../README.md) / deleteDeviceData

# Function: deleteDeviceData()

> **deleteDeviceData**(): `Promise`\<`void`\>

Defined in: [services/device.ts:220](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/device.ts#L220)

Removes all data associated with the current device.

## Returns

`Promise`\<`void`\>

## Throws

If any deletion operation fails

## Remarks

Performs a complete cleanup of device data:
1. Retrieves all assessments for device
2. Deletes associated answers
3. Removes assessment records
4. Clears local drafts

Note: This operation is irreversible and should be used with caution.

## Example

```typescript
try {
  await DeviceService.deleteDeviceData();
  console.log('Device data cleared');
} catch (error) {
  console.error('Cleanup failed:', error);
}
```
