[**serencity v1.0.0**](../../README.md)

***

[serencity](../../modules.md) / Services/Assessment

# Services/Assessment

## Remarks

Handles the creation, progression, and completion of user assessments.

Core Concepts:
Assessment: A session where users answer a series of questions. Each assessment:
- Has a unique ID
- Contains multiple questions and their answers
- Tracks completion status
- Records location data
- Maintains draft state for incomplete sessions

Data Flow:
1. User starts assessment → createAssessment()
2. Answer changes → saveAnswerLocally()
3. Navigation to next → saveAnswerToDb()
4. Completion → verifyAnswers()

Privacy & Data Handling:
- Uses device-based authentication
- Implements local drafts for offline capability
- Ensures data consistency between local and remote
- Handles answer normalization for different question types
