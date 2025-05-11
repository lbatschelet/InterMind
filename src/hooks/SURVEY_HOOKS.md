# Survey Hooks Documentation

This document explains how to use the custom React hooks for the survey system.

## Overview

The survey system provides two main custom hooks that encapsulate all the logic needed for managing surveys:

1. `useSurveyNavigation` - Manages navigation between questions
2. `useSurveyResponses` - Manages question responses and conditional logic

These hooks work together to provide a clean, maintainable way to implement survey functionality in your components.

## useSurveyNavigation

### Purpose

This hook manages the state related to navigating through survey questions, including:
- Tracking the current question index
- Handling navigation between questions
- Managing filtered questions based on conditional logic
- Handling animation states during transitions

### Usage

```typescript
import { useSurveyNavigation } from '../hooks';

// Inside your component
const {
  // State
  allQuestions,        // Original unfiltered questions
  filteredQuestions,   // Questions after applying conditional logic
  currentIndex,        // Current question index
  currentQuestion,     // The current question object
  isAnimating,         // Whether a transition animation is in progress
  
  // Actions
  navigateNext,        // Go to next question
  navigateBack,        // Go to previous question
  updateQuestions,     // Update questions list when it changes
  markQuestionAsAnswered, // Mark a question as answered
  
  // Helpers
  shouldCompleteSurvey, // Check if the survey should be completed
  isQuestionAnswered,  // Check if a question has been answered
  finishAnimation,     // Signal that an animation has completed
} = useSurveyNavigation(initialQuestions);
```

### Example

```typescript
import React from 'react';
import { View, Button } from 'react-native';
import { useSurveyNavigation } from '../hooks';
import QuestionRenderer from '../components/QuestionRenderer';

const SurveyComponent = ({ questions }) => {
  const {
    filteredQuestions,
    currentIndex,
    currentQuestion,
    navigateNext,
    navigateBack,
    shouldCompleteSurvey,
    isAnimating,
    finishAnimation
  } = useSurveyNavigation(questions);

  // Handle navigation to next question
  const handleNext = () => {
    if (shouldCompleteSurvey()) {
      // Complete the survey
      console.log('Survey completed!');
    } else {
      navigateNext();
    }
  };

  // Handle navigation to previous question
  const handleBack = () => {
    navigateBack();
  };

  // Animation completed callback
  const handleAnimationComplete = () => {
    finishAnimation();
  };

  return (
    <View>
      {currentQuestion && (
        <QuestionRenderer 
          question={currentQuestion}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      
      <View>
        <Button 
          disabled={isAnimating} 
          onPress={handleBack} 
          title="Back" 
        />
        <Button 
          disabled={isAnimating} 
          onPress={handleNext} 
          title={shouldCompleteSurvey() ? "Complete" : "Next"} 
        />
      </View>
    </View>
  );
};
```

## useSurveyResponses

### Purpose

This hook manages the state related to survey responses, including:
- Storing responses locally
- Submitting responses to the backend
- Applying conditional logic based on responses
- Providing filtered questions based on current responses

### Usage

```typescript
import { useSurveyResponses } from '../hooks';

// Inside your component
const {
  // State
  responses,          // Current response data (record of questionId -> response)
  filteredQuestions,  // Questions filtered based on responses
  
  // Actions
  updateResponse,     // Update a response for a question
  loadResponses,      // Load all responses for the current survey
  
  // Helpers
  getResponse,        // Get response for a specific question
  hasResponse         // Check if a response exists for a question
} = useSurveyResponses(surveyId, allQuestions);
```

### Example

```typescript
import React from 'react';
import { View } from 'react-native';
import { useSurveyResponses } from '../hooks';
import SingleChoiceQuestion from '../components/QuestionTypes/SingleChoiceQuestion';

const QuestionComponent = ({ surveyId, question, questions, onComplete }) => {
  const {
    responses,
    updateResponse,
    getResponse
  } = useSurveyResponses(surveyId, questions);

  // Handle response submission
  const handleSubmit = async (response) => {
    // Update the response in the database and apply conditional logic
    const updatedQuestions = await updateResponse(question.id, response);
    
    // Notify parent component that response is complete
    onComplete(updatedQuestions);
  };

  return (
    <View>
      <SingleChoiceQuestion
        question={question}
        value={getResponse(question.id)}
        onSubmit={handleSubmit}
      />
    </View>
  );
};
```

## Combining Both Hooks

For a complete survey implementation, you'll typically use both hooks together:

```typescript
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSurveyNavigation, useSurveyResponses } from '../hooks';
import { SurveyService } from '../services';
import QuestionRenderer from '../components/QuestionRenderer';

const SurveyScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [surveyId, setSurveyId] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  
  // Load the survey
  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setIsLoading(true);
        const { surveyId, questions } = await SurveyService.startSurvey();
        setSurveyId(surveyId);
        setAllQuestions(questions);
      } catch (error) {
        console.error('Failed to load survey:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSurvey();
  }, []);
  
  // Use the navigation hook
  const {
    filteredQuestions,
    currentIndex,
    currentQuestion,
    navigateNext,
    navigateBack,
    updateQuestions,
    shouldCompleteSurvey,
    markQuestionAsAnswered
  } = useSurveyNavigation(allQuestions);
  
  // Use the responses hook
  const {
    responses,
    updateResponse,
    getResponse
  } = useSurveyResponses(surveyId, allQuestions);
  
  // Handle question submission
  const handleQuestionSubmit = async (questionId, response) => {
    // 1. Mark the question as answered
    markQuestionAsAnswered(questionId);
    
    // 2. Submit the response and apply conditional logic
    const { filteredQuestions: updatedQuestions } = 
      await updateResponse(questionId, response);
    
    // 3. Update the navigation with the new filtered questions
    updateQuestions(allQuestions, updatedQuestions);
    
    // 4. Navigate to the next question
    navigateNext();
  };
  
  // Handle survey completion
  const handleComplete = async () => {
    await SurveyService.completeSurvey(surveyId, filteredQuestions);
    // Navigate to completion screen or next step
  };
  
  if (isLoading) {
    return <ActivityIndicator />;
  }
  
  return (
    <View>
      {currentQuestion && (
        <QuestionRenderer
          question={currentQuestion}
          value={getResponse(currentQuestion.id)}
          onSubmit={(response) => handleQuestionSubmit(currentQuestion.id, response)}
        />
      )}
      
      {/* Navigation buttons */}
      <View>
        <Button 
          onPress={navigateBack} 
          title="Back" 
          disabled={currentIndex === 0} 
        />
        
        {shouldCompleteSurvey() ? (
          <Button 
            onPress={handleComplete} 
            title="Complete Survey" 
          />
        ) : (
          <Button 
            onPress={navigateNext} 
            title="Skip" 
          />
        )}
      </View>
    </View>
  );
};
```

## Best Practices

1. **Separate Data and Navigation Logic**: Use `useSurveyResponses` for data management and `useSurveyNavigation` for navigation.

2. **Update Questions After Responses**: Always call `updateQuestions` after updating responses to ensure navigation is in sync.

3. **Handle Animation States**: Use `isAnimating` and `finishAnimation` to prevent multiple rapid navigation actions.

4. **Conditional Logic**: The hooks automatically handle conditional question display - you don't need to implement filtering logic yourself.

5. **Error Handling**: Add appropriate error handling around service calls to ensure a good user experience even when network issues occur.

## Advanced Usage

### Custom Navigation Rules

You can implement custom navigation rules by manipulating the navigation index directly:

```typescript
const { setCurrentIndex, filteredQuestions } = useSurveyNavigation(questions);

// Jump to a specific question
const jumpToQuestion = (questionId) => {
  const index = filteredQuestions.findIndex(q => q.id === questionId);
  if (index !== -1) {
    setCurrentIndex(index);
  }
};
```

### Offline Support

The hooks have built-in resilience for offline scenarios:

```typescript
const { updateResponse } = useSurveyResponses(surveyId, questions);

const handleSubmit = async (questionId, response) => {
  try {
    await updateResponse(questionId, response);
  } catch (error) {
    // Even if the database update fails, the local state will still be updated
    // and conditional logic will still be applied
    console.warn('Failed to save response, will retry later:', error);
  }
};
```

### Question Filtering

For advanced filtering beyond the built-in conditional logic:

```typescript
const { allQuestions, updateQuestions } = useSurveyNavigation(questions);

// Apply custom filter (e.g., by category)
const showOnlyCategory = (category) => {
  const filtered = allQuestions.filter(q => q.category === category);
  updateQuestions(allQuestions, filtered);
};
``` 