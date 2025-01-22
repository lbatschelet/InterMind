[**serencity v1.0.0**](../../README.md)

***

[serencity](../../modules.md) / Database/Supabase

# Database/Supabase

## Remarks

Handles all database operations, authentication, and data mapping between
application and database models.

Database Schema:
- assessments: Core assessment records
- assessment_answers: Individual question responses
- questions: Assessment question definitions

Security Model:
- Device-based authentication with unique identifiers
- Row Level Security (RLS) policies control data access
- Session management ensures proper authorization

Data Flow:
1. Device Authentication:
   - Device ID verification
   - Session establishment
   - RLS policy activation

2. Data Operations:
   - Type-safe database interactions
   - Automatic data mapping
   - Error handling

Error Handling:
- Connection issues trigger retries
- Authentication failures are logged
- Data validation errors are captured

## Interfaces

- [Assessment](interfaces/Assessment.md)
- [AssessmentAnswer](interfaces/AssessmentAnswer.md)
- [DbAssessment](interfaces/DbAssessment.md)

## Variables

- [supabase](variables/supabase.md)

## Functions

- [ensureDeviceSession](functions/ensureDeviceSession.md)
- [mapAssessmentToDb](functions/mapAssessmentToDb.md)
- [mapDbToAssessment](functions/mapDbToAssessment.md)
