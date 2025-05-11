# InterMind

[![Expo](https://img.shields.io/badge/built%20with-Expo-1f2026?logo=expo)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/backend-Supabase-3ecf8e?logo=supabase)](https://supabase.io/)
[![License: AGPL v3](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html)
[![TypeScript](https://img.shields.io/badge/code-TypeScript-3178c6?logo=typescript)](https://www.typescriptlang.org/)

**InterMind** is a mobile survey tool developed as part of a Bachelor's thesis at the Institute of Geography, University of Bern. The app is designed to collect repeated, location-based responses to a variety of question types and supports multilingual content structures.

> [!NOTE] 
> A more generic version of InterMind is planned to make it easily reusable for other studies. Currently, the code is tailored to the needs of the "InterMind" study.

> [!WARNING]
> Due to App store review processes and technical setup, releasing a publicly available version typically requires **at least one month** of lead time.

## Features

- Repeated survey prompts with geolocation
- Supports single-choice, multiple-choice, sliders, free-text input, and info screens
- Optional image integration in questions
- Translation system for multilingual surveys
- Response tracking and anonymous persistence using Supabase

## Technology Stack

- [Expo](https://docs.expo.dev/) for React Native development
- [TypeScript](https://www.typescriptlang.org/) for safe and scalable code
- [Supabase](https://supabase.io/) for backend, database, and authentication
- [EAS Build](https://docs.expo.dev/build/introduction/) for app publishing

## Getting Started

To run the app locally, you will need:

- [Node.js (≥16)](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A configured [Supabase project](https://supabase.com/docs/guides/getting-started)

See [Expo’s Getting Started Guide](https://docs.expo.dev/get-started/installation/) for setup instructions.

## Contributing & Reuse

InterMind is licensed under the [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html), which means that any public use of a modified version (e.g. hosted as a web service or app) must also make its source code available under the same license.

### Adapting for Your Own Study

If you would like to use InterMind for a different research project:

- See [ADAPTING.md](ADAPTING.md) for guidance on customization and setup
- You are free to fork and modify the project under the terms of the AGPL license
- If you publish a hosted version, you must make your code available as well

### Contributing Code

We welcome improvements and extensions to the base project.

- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on code contributions, documentation, and structure
- If you adapt this project for your own study, please provide appropriate attribution.
