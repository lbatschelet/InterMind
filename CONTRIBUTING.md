# Contributing to InterMind

Thank you for your interest in contributing to **InterMind**!

This project began as part of a Bachelor's thesis at the University of Bern and is being gradually generalized for broader use. Contributions are welcome in many forms — whether you're improving code, writing documentation, or sharing ideas.

## 1. Code Structure and Conventions

- The codebase is written in **TypeScript** using **React Native** (with Expo).
- Components are located in `src/` and organized by purpose (questions, screens, services, etc.).
- Please follow consistent naming and structure.
- Use **JSDoc** to document your functions, components, and types.

If you're adding a **new question type**, please:

1. Create a component under `src/components/questions/`
2. Extend the type definitions in `src/types/questions.ts`
3. Add it to the question renderer in `SurveyScreen`
4. Document it in `src/docs/developer/adding-question-types.md`

## 2. Documentation

We use [TypeDoc](https://typedoc.org/) to generate API documentation:

```bash
npm run docs
```

Output will appear in the `docs/` directory. Additional technical notes live in `src/docs/`.

## 3. Submitting Pull Requests

* Fork the repo and create a branch from `main`
* Keep commits focused and clear
* Ensure your code builds and runs
* Open a Pull Request with a short summary and motivation

If you're unsure where to start, feel free to open a draft PR or start a discussion.

## 4. Good First Ideas

Some areas that need improvement or extension:

1. **Refactoring:**
   Several parts of the codebase are still messy or inconsistent. The goal is to move toward clean, modular structure following the **SOLID principles**.

2. **Testing:**
   Only a few unit tests exist. Improving test coverage and creating a robust testing setup would be a great contribution.

3. **Conditional Logic Between Questions:**
   Currently, there’s no way to show/hide questions based on previous answers (e.g. “If selected option A, then skip next question”).
   Adding support for **question branching/logic rules** would be a major improvement.

## 5. License and Contribution Terms

This project is licensed under the **GNU AGPL v3.0**.

By contributing:

* You agree to publish your code under the same license
* You retain authorship and will be credited in the repo history
* Please avoid submitting code with AGPL-incompatible dependencies without discussion