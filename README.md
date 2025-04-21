# InterMind

InterMind is a survey application designed for gathering and analyzing user feedback through various question types.

## Features

- Multiple question types: single-choice, multiple-choice, slider, text input, and info screens
- Support for image integration in questions
- Multilingual content with translation system
- User response tracking and data persistence

## Technology Stack

- React Native for mobile application
- Supabase as Backend-as-a-Service
- TypeScript for type-safe development
- Expo for streamlined development and deployment

## Development

### Prerequisites

- Node.js (16+)
- Yarn or npm
- React Native development environment

### Setup

1. Clone the repository
2. Install dependencies: `yarn install` or `npm install`
3. Start the development server: `yarn start` or `npm start`

### Documentation

InterMind uses [TypeDoc](https://typedoc.org/) to generate comprehensive API documentation from JSDoc comments in the source code.

To generate the documentation:

```bash
npm run docs
```

The documentation will be available in the `docs` directory.

#### Documentation Resources

- [API Documentation](docs/api) - API reference and integration details
- [Adding New Question Types](src/docs/developer/adding-question-types.md) - Guide for implementing new question types

#### JSDoc Format

We use a standardized JSDoc format throughout the codebase:

```typescript
/**
 * @packageDocumentation
 * @module [ModuleName]
 * 
 * @summary
 * Brief description of the component or module.
 * 
 * @remarks
 * - Additional detailed information
 * - Multiple points can be listed here
 */

/**
 * Component or function description.
 * 
 * @component or @function
 * @param {Type} name - Description of the parameter
 * @returns Description of the return value
 */
```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 