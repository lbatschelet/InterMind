# Adapting InterMind for Your Own Study

This guide outlines how to reuse the InterMind codebase for your own research project.  
InterMind is designed to be flexible, but some technical setup and administrative steps are required.

## 1. Requirements

Before starting, you should have:

- A [Supabase](https://supabase.io/) account with a new project
- Basic knowledge of TypeScript and React Native (Expo)
- A developer account for the app stores (see below)

## 2. Publishing to App Stores (as of May 2025)

### Android (Google Play)

- One-time developer registration
- A **closed testing track** is required before public release:
  - You must invite **at least 14 testers**
  - The testing phase must run for **at least 2 weeks**

### iOS (Apple App Store)

- Requires a **paid Apple Developer Account** (99 USD/year)
- App review is manual and may take several days
- TestFlight can be used for internal testing before submission

> [!WARNING]
> Expect a **minimum lead time of 1 month** to prepare and publish a functioning public version.

## 3. What You Will Need to Modify

### a. Supabase Backend

- Create your own Supabase project and configure the schema, RLS policies, and functions.
- Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your `.env` file.

### b. Survey Content

- Define your own questions in the database or load them from local files.
- Structure includes question types, translations, options, and optional media.

Supported types:
- SingleChoice
- MultipleChoice
- Slider
- TextInput
- InfoScreen

### c. Visual Identity

- Replace app icons, splash screens, and name in `app.json`
- Update content of the About and Privacy Policy screens
- Optionally update notification texts and screen colors

### d. Graphics

This project uses a custom set of illustrations from [undraw.co](https://undraw.co).  
You may use or replace them according to the [unDraw license](https://undraw.co/license).

## 4. License Obligations (AGPL)

InterMind is licensed under the **GNU AGPL v3.0**.

If you publicly deploy a modified version (e.g. in app stores), you are required to:

- Make your modified source code publicly available under the same license
- Preserve attribution and include a reference to the original repository
- Keep the AGPL license text visible in your version

> See [`LICENSE`](./LICENSE) and [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html) for details.

## 5. Getting Help

For feedback, questions, or collaboration, feel free to reach out to the author.
