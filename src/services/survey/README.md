# Survey System Documentation

## Overview

The survey system is designed with modular, maintainable architecture following SOLID principles. It consists of three main components:

1. **Service Layer** - Core business logic separated by responsibility
2. **Custom Hooks** - React state management and service integration
3. **Components** - UI elements for rendering survey questions

## Service Architecture

The system implements the following services, each with a specific responsibility:

### SurveyQuestionService

**Primary Responsibility**: Question management, filtering, and conditional logic.

```typescript
interface ISurveyQuestionService {
  getQuestionsForSurvey(includeAnsweredOnceQuestions?: boolean, language?: LanguageCode): Promise<Question[]>;
  filterQuestionsBasedOnResponses(questions: Question[], responses: Record<string, unknown>): Question[];
  findAppropriateQuestionIndex(filteredQuestions: Question[], currentQuestion: Question | undefined, fallbackIndex?: number): number;
}
```

**Key Features**:
- Fetches questions from repository
- Filters questions based on previous answers (showOnce logic)
- Implements conditional branching logic based on question responses
- Handles question sorting and navigation index calculation

### SurveyResponseService

**Primary Responsibility**: Managing survey responses and applying conditional logic.

```typescript
interface ISurveyResponseService {
  submitResponse(surveyId: string, questionId: string, response: unknown): Promise<void>;
  markShowOnceQuestionsAsAnswered(questionIds: string[]): Promise<void>;
  getResponsesForSurvey(surveyId: string): Promise<Record<string, unknown>>;
  processResponse(surveyId: string, questionId: string, response: unknown, allQuestions: Question[], currentResponses: Record<string, unknown>): 
    Promise<{ filteredQuestions: Question[]; updatedResponses: Record<string, unknown>; }>;
}
```

**Key Features**:
- Submits responses to database
- Retrieves responses for a survey
- Processes conditional logic when responses change
- Marks questions that should only be shown once as answered

### SurveyNavigationService

**Primary Responsibility**: Handling navigation between survey questions.

```typescript
interface ISurveyNavigationService {
  calculateNextIndex(currentIndex: number, questions: Question[]): number;
  calculatePreviousIndex(currentIndex: number, questions: Question[]): number;
  shouldCompleteOnNext(currentIndex: number, questions: Question[]): boolean;
  handleFilteredQuestionsUpdate(allQuestions: Question[], filteredQuestions: Question[], currentIndex: number, currentQuestion: Question | undefined): number;
}
```

**Key Features**:
- Calculates indices for next/previous navigation
- Determines when a survey should be completed
- Handles navigation index updates when question list changes due to conditional logic

## Conditional Branching Logic

The system implements conditional branching via the `hideQuestions` property on question options:

```typescript
interface OptionType {
  value: string;
  label: string;
  hideQuestions?: string[];  // IDs of questions to hide when this option is selected
}
```

### Implementation Details:

1. **Single-Choice Questions**: When an option is selected, any questions in its `hideQuestions` array will be hidden.

2. **Multiple-Choice Questions**: Uses XOR logic - only the last selected option's `hideQuestions` array is applied, allowing for dynamic changes based on the most recent selection.

3. **Question Filtering Process**:
   - When a response is submitted, the `processResponse` method in `SurveyResponseService` is called
   - This calls `filterQuestionsBasedOnResponses` in `SurveyQuestionService`
   - Hidden questions are collected in a Set to avoid duplicates
   - Questions are filtered out if their ID is in the hidden set
   - Filtered questions are sorted by sequence number

4. **Navigation Adjustment**:
   - When questions are filtered, navigation indices may need adjustment
   - `findAppropriateQuestionIndex` method determines the correct index after filtering
   - If the current question becomes hidden, finds the next visible question based on sequence number

## React Hooks

### useSurveyNavigation

Manages navigation state and integrates with `SurveyNavigationService`.

```typescript
function useSurveyNavigation(initialQuestions: Question[]) {
  // Returns navigation state and methods
  return {
    allQuestions, filteredQuestions, currentIndex, currentQuestion, isAnimating,
    isQuestionAnswered, updateQuestions, navigateNext, navigateBack,
    shouldCompleteSurvey, markQuestionAsAnswered, finishAnimation, setCurrentIndex
  };
}
```

**Key Features**:
- Tracks current question index and animation state
- Maintains filtered question list
- Provides navigation methods (next/previous)
- Handles index adjustment when filtered questions change

### useSurveyResponses

Manages response state and integrates with `SurveyResponseService`.

```typescript
function useSurveyResponses(surveyId: string, initialQuestions: Question[]) {
  // Returns response state and methods
  return {
    responses, filteredQuestions,
    updateResponse, loadResponses, getResponse, hasResponse
  };
}
```

**Key Features**:
- Maintains local response cache
- Submits responses to backend
- Applies conditional logic when responses change
- Provides methods to access and update responses

## Usage in SurveyScreen

The `SurveyScreen` component uses both hooks to create a clean, maintainable interface:

```typescript
const SurveyScreen = ({ navigation }) => {
  // Navigation hook
  const {
    filteredQuestions, currentIndex, currentQuestion, isAnimating,
    navigateNext, navigateBack, shouldCompleteSurvey, markQuestionAsAnswered,
    finishAnimation, updateQuestions
  } = useSurveyNavigation(allQuestions);

  // Responses hook
  const {
    responses, updateResponse, getResponse
  } = useSurveyResponses(surveyId || '', allQuestions);
  
  // ... rest of component
}
```

## Component Hierarchy

1. **SurveyScreen**: Main container, handles survey flow and animations
2. **QuestionRenderer**: Factory component that renders the appropriate question type
3. **Question Type Components**: Specialized components for each question type:
   - SingleChoiceQuestion
   - MultipleChoiceQuestion
   - SliderQuestion
   - TextQuestion
   - InfoScreen

## Dependency Management

The system uses singleton instances for services to facilitate dependency injection and testing:

```typescript
export const questionService = new SurveyQuestionService();
export const responseService = new SurveyResponseService();
export const navigationService = new SurveyNavigationService();
```

These are accessed via:

```typescript
import { questionService, responseService, navigationService } from '../services/survey';
```

## Survey Question Types

The system supports the following question types:

1. **single_choice**: Single-selection options
2. **multiple_choice**: Multiple-selection options
3. **slider**: Continuous value selection
4. **text**: Free-form text input
5. **info_screen**: Informational screens (non-question)

Each question type has a specific structure defined in the `Question` type union.

## Advantages of the Architecture

1. **Separation of Concerns**: Each service has a clear, single responsibility
2. **Testability**: Services can be tested independently
3. **Maintainability**: Logic is isolated in appropriate services
4. **Extensibility**: New question types or logic can be added with minimal changes
5. **Type Safety**: TypeScript interfaces ensure correct implementation

## Future Improvements

1. **Advanced Conditional Logic**: Support more complex rules beyond simple hiding
2. **Question Groups**: Group questions for better organization
3. **Dependency Injection**: Further formalize DI with a container
4. **Progressive Loading**: Load questions in batches for very large surveys 