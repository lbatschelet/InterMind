[**serencity v1.0.0**](../../README.md)

***

[serencity](../../modules.md) / Services/Location

# Services/Location

## Remarks

This service is designed with privacy as a core principle, implementing
various measures to protect user location data while still providing
sufficient accuracy for the assessment context.

Privacy Measures:
- Uses low accuracy mode (100-500m radius)
- Rounds coordinates to reduce precision (~100m)
- Single location fix (no continuous tracking)
- Permission-based access

## Example

```typescript
const location = await LocationService.getCurrentLocation();
if (location) {
  // Location available with reduced precision
} else {
  // Permission denied or error occurred
}
```

## Namespaces

- [LocationService](namespaces/LocationService/README.md)

## Interfaces

- [LocationData](interfaces/LocationData.md)
