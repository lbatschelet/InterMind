[**serencity v1.0.0**](../../README.md)

***

[serencity](../../modules.md) / Services/Device

# Services/Device

## Remarks

Each device receives a human-readable unique identifier that enables
data access and synchronization.

Device ID Format:
- Format: XXXX-XXXX-XXXX (e.g., "ABC1-2DEF-3GHI")
- 12 alphanumeric characters
- Grouped in blocks of 4
- Separated by hyphens

Benefits of Readable IDs:
- Human-readable for support and debugging
- Easy to communicate verbally
- Memorable format similar to product keys
- Sufficient uniqueness for app purposes

Lifecycle Management:
1. First Launch:
   - Generate new device ID
   - Store in AsyncStorage
   - Initialize device session

2. Subsequent Launches:
   - Retrieve stored ID
   - Validate format
   - Regenerate if invalid

3. Data Management:
   - Associates assessments with device
   - Enables data cleanup
   - Supports device reset

Privacy Considerations:
- IDs are device-specific, not user-specific
- No personal data in ID format
- Resettable for privacy needs

## Namespaces

- [DeviceService](namespaces/DeviceService/README.md)
