# AppEasy Codebase Explanation

This document explains how your AppEasy (Next.js Job Tracker) codebase works, what each part does, and how Next.js operates—using simple, clear language.

---

## What is Next.js?
- **Next.js** is a framework built on top of React. It makes it easy to build web apps with pages, routing, server-side logic, and more.
- You write your app in React, but Next.js handles routing, server-side rendering, API endpoints, and optimization for you.

---

## Project Structure (Folders)

- **/src/pages/** – Each file here is a route (webpage or API endpoint).
  - `index.tsx` – The main dashboard page (your job tracker UI).
  - `login.tsx` – The login page.
  - `signup.tsx` – The sign-up page.
  - `/api/` – API endpoints (e.g., `/api/jobs` for job data, `/api/analyze-job` for AI analysis).
- **/src/components/** – Reusable UI building blocks (buttons, forms, cards, etc.).
- **/src/hooks/** – Custom React hooks for data fetching and logic (e.g., `useJobs`, `useDeleteJob`).
- **/src/lib/** – Utility code (OpenAI integration, in-memory storage, helper functions).
- **/src/styles/** – CSS and Tailwind styles.
- **/src/types/** – TypeScript types (for strong typing and autocomplete).
- **/server/** – Script to start the Next.js server (for custom setups).

---

## How Next.js Routing Works
- Any file in `/src/pages` becomes a route.
  - `src/pages/index.tsx` → `/` (homepage)
  - `src/pages/login.tsx` → `/login`
  - `src/pages/api/jobs/index.ts` → `/api/jobs` (API endpoint)
- API routes (in `/pages/api/`) let you write backend code (like Express) right in your app.

---

## Key Files Explained

### 1. `src/pages/index.tsx` (Dashboard)
- The main UI for tracking jobs.
- Lets you add, edit, delete, and view job applications.
- Shows stats, search/filter, and AI job analysis.
- Uses React hooks to manage state and fetch data.

### 2. `src/pages/login.tsx` and `src/pages/signup.tsx`
- Simple forms for user authentication (email/password, stored in localStorage).
- Redirects users based on login state.

### 3. `src/pages/api/jobs/index.ts` and `[id].ts`
- Handle job data (CRUD: create, read, update, delete) in memory.
- Respond to frontend requests for job data.

### 4. `src/pages/api/analyze-job.ts`
- Receives a job description, sends it to OpenAI, and returns a summary + skills.

### 5. `src/components/ui/`
- Contains UI elements (Button, Input, Card, Select, etc.) used throughout the app.
- These are styled with Tailwind CSS and are reusable.

### 6. `src/hooks/use-jobs.ts`
- Custom hooks for fetching, creating, updating, and deleting jobs.
- Uses React Query for data management and caching.

### 7. `src/lib/openai.ts`
- Handles communication with the OpenAI API for job analysis.

### 8. `src/lib/storage.ts`
- In-memory storage for jobs (for demo/dev; swap for a real DB in production).

### 9. `src/styles/globals.css`
- Global styles for the app, including background image and Tailwind base styles.

### 10. `server/index.ts`
- Starts the Next.js server on a custom port (for local development or custom hosting).

---

## How Data Flows
1. **User fills out a form** (add job, login, etc.).
2. **Form data is validated** (with Zod and React Hook Form).
3. **Frontend calls an API route** (e.g., `/api/jobs`).
4. **API route processes the request** (reads/writes to in-memory storage or calls OpenAI).
5. **Frontend updates UI** (using React Query to fetch and cache data).

---

## How Authentication Works
- Simple local auth: email/password are saved in `localStorage`.
- App checks login state on every page load and redirects if needed.
- No real user accounts or sessions (for demo purposes).

---

## How AI Analysis Works
- User pastes a job description and clicks "Analyze Job".
- The app sends the text to `/api/analyze-job`.
- The backend calls OpenAI, gets a summary and skills, and returns them.
- The frontend shows the results in a modal.

---

## How to Add Features or Debug
- Add new pages in `/src/pages` for new routes.
- Add new API endpoints in `/src/pages/api`.
- Add new UI components in `/src/components`.
- Use hooks in `/src/hooks` for shared logic.
- Use the README for setup and running instructions.

---

## Summary
- **Next.js** makes routing, SSR, and API endpoints easy.
- **React** handles UI and state.
- **Tailwind CSS** makes styling fast and consistent.
- **OpenAI** adds smart job analysis.
- The codebase is modular, easy to extend, and ready for real-world deployment. 