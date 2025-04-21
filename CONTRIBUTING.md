# Contributing to InterMind

Thank you for your interest in contributing to InterMind! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Adding New Features](#adding-new-features)

## Code of Conduct

We expect all contributors to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please make sure you read and understand it.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/InterMind.git`
3. Create a branch for your work: `git checkout -b your-feature-name`
4. Set up the development environment (see below)

## Development Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

The repository is organized as follows:

- `/src` - Source code
  - `/components` - React components
    - `/ui` - UI components
    - `/QuestionTypes` - Question type components
  - `/contexts` - React contexts
  - `/hooks` - Custom hooks
  - `/lib` - Utility libraries
  - `/screens` - Screen components
  - `/services` - Backend service integrations
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions

## Coding Standards

- Use TypeScript for all new code
- Follow the existing coding style in the project
- Use JSDoc comments for all public functions, classes, and interfaces
- Use named exports instead of default exports when possible
- Write tests for all new features

## Documentation

Documentation is a critical part of the project. Please follow these guidelines:

1. Use JSDoc comments for all public API elements
2. Document all components, props, and state
3. Include examples where appropriate
4. Update docs when you change code

Example JSDoc format:

```typescript
/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Brief description of the component.
 * 
 * @remarks
 * - More detailed information
 * - Multiple bullet points for key information
 */

/**
 * Component description.
 * 
 * @component
 * @param {ComponentProps} props - Component props
 * @param {string} props.id - Description of the id prop
 * @returns JSX Element
 */
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add detailed description of changes
4. Link to any relevant issues
5. Get at least one review before merging

## Adding New Features

For adding major features or new question types, please refer to:

- [Adding New Question Types](src/docs/developer/adding-question-types.md)

Thank you for contributing! 