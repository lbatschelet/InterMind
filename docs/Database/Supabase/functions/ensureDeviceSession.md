[**serencity v1.0.0**](../../../README.md)

***

[serencity](../../../modules.md) / [Database/Supabase](../README.md) / ensureDeviceSession

# Function: ensureDeviceSession()

> **ensureDeviceSession**(`deviceId`, `maxRetries`?): `Promise`\<`void`\>

Defined in: [services/supabase.ts:89](https://github.com/lbatschelet/SerenCity/blob/4245c36d3a680a78ab22610b245af81b1a0977ec/src/services/supabase.ts#L89)

Ensures proper device authentication in the current session.

## Parameters

### deviceId

`string`

The device identifier to authenticate with

### maxRetries?

`number` = `3`

Maximum number of retry attempts

## Returns

`Promise`\<`void`\>

Promise that resolves when session is activated

## Throws

When session activation fails after all retries

## Remarks

This method:
1. Sets the device ID in the session
2. Verifies session activation
3. Retries on failure with exponential backoff
4. Provides detailed debug information when enabled

This is an asynchronous operation that may take several seconds
to complete due to retry attempts.

## Example

```typescript
try {
  await ensureDeviceSession('ABC1-2DEF-3GHI');
  console.log('Device authenticated');
} catch (error) {
  console.error('Authentication failed:', error);
}
```
