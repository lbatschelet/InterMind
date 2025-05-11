# Survey System Architecture

## Overview

The survey system is organized into specialized services, each with a specific responsibility in the survey lifecycle. The services work together to provide a complete survey management solution.

## Service Architecture

```
                            +------------------+
                            |   SurveyService  |
                            |     (Facade)     |
                            +------------------+
                                    |
                                    | Delegates to
                                    v
+------------------+      +------------------+      +---------------------+
| SurveyLifecycle  |<---->| SurveyNavigation |<---->| SurveyAvailability  |
|    Service       |      |    Service       |      |      Service        |
+------------------+      +------------------+      +---------------------+
        |                         |                          |
        v                         v                          v
+------------------+      +------------------+      +---------------------+
|  SurveySession   |<---->|  SurveyQuestion  |<---->|   SurveyResponse    |
|    Service       |      |     Service      |      |      Service        |
+------------------+      +------------------+      +---------------------+
        |                         |                          |
        v                         v                          v
+------------------+      +------------------+      +---------------------+
|  SurveyDatai     |      | SurveyAnswered   |      |   SurveyLocation    |
|    Service       |<---->| QuestionsService |<---->|      Service        |
+------------------+      +------------------+      +---------------------+
        |                         |
        v                         v
+------------------+      +------------------+
|    Repository    |      |    Repository    |
|      Layer       |<---->|      Layer       |
+------------------+      +------------------+
        |                         |
        v                         v
+------------------+      +------------------+
|    Database      |      |    Local         |
|    (Supabase)    |<---->|    Storage       |
+------------------+      +------------------+
```

## Service Responsibilities

### 1. SurveyService (Facade)
- Provides a unified API for the survey system
- Delegates specific operations to specialized services
- Maintains backward compatibility for legacy code

### 2. Core Services
- **SurveyQuestionService**: Manages questions, filtering, and conditional logic
- **SurveyResponseService**: Handles submission and retrieval of survey responses
- **SurveyNavigationService**: Controls survey navigation, question sequencing, and branching
- **SurveyLifecycleService**: Manages survey lifecycle events (creation, completion, expiration)

### 3. Supporting Services
- **SurveySessionService**: Manages survey sessions
- **SurveyAnsweredQuestionsService**: Tracks which questions have been answered
- **SurveyAvailabilityService**: Determines when surveys are available to users
- **SurveyDataService**: Handles data management operations
- **SurveyLocationService**: Manages location-based survey functionality

### 4. Data Layer
- **Repository Interfaces**: Define data access contracts
- **Repository Implementations**: Handle data retrieval, caching, and persistence
- **Database Access**: Encapsulated within repositories

## Design Principles

1. **Single Responsibility Principle**: Each service has a clearly defined responsibility
2. **Dependency Inversion**: Services depend on abstractions rather than concrete implementations
3. **Interface Segregation**: Clear interfaces define service responsibilities
4. **Separation of Concerns**: Services are organized by functional area
5. **Loose Coupling**: Services interact through well-defined interfaces

## Instance Management

Each service is implemented as a singleton accessible through the SurveyService facade:

```typescript
// Example: Accessing services through the facade
import { 
  questionService, 
  navigationService, 
  responseService 
} from './services/survey';

// Use services
const questions = await questionService.getQuestionsForSurvey();
const nextIndex = navigationService.calculateNextIndex(currentIndex, questions);
await responseService.submitResponse(surveyId, questionId, answer);
```

## Data Flow

1. **Survey Creation**: SurveySessionService → QuestionService → Repository
2. **Question Navigation**: NavigationService → QuestionService
3. **Response Submission**: ResponseService → Repository → AnsweredQuestionsService
4. **Survey Completion**: SessionService → LifecycleService → Repository
