# Contributing Guide - SharkType 🦈

Thank you for your interest in contributing to **SharkType**! This document details the technical architecture and how you can help improve the project.

---

## 🏗️ Architecture and Project Structure

SharkType is built using **Next.js 15+** with the **App Router**, following a modular architecture based on hooks and context providers.

### Directory Structure

| Directory | Description |
|-----------|-------------|
| `app/` | Contains application routes, pages, and API endpoints (Next.js App Router). |
| `components/` | Reusable React components, divided by functionality (auth, typing, stats, three). |
| `components/three/` | 3D visual effects implementations using **React Three Fiber** and **Three.js**. |
| `components/typing/` | Core components of the typing interface (TypingArea, Toolbar, ResultScreen). |
| `data/` | Content library. Contains code snippets organized by language/technology. |
| `hooks/` | State and effect logic encapsulated in Custom Hooks (e.g., `useTypingEngine`, `useProgress`). |
| `lib/` | Utilities, type definitions, constants, and **Supabase** client configurations. |
| `public/` | Static assets like icons and manifests. |

---

## ⚙️ Internal Workings

### 1. Typing Engine (`useTypingEngine`)
The core logic resides in the `useTypingEngine.ts` hook. It manages:
- User input state.
- Real-time character validation (`pending`, `correct`, `incorrect`).
- Calculation of metrics like **WPM** (Words Per Minute) and **Accuracy**.
- Session state control (`idle`, `running`, `finished`).

### 2. Persistence and Authentication
We use **Supabase** for:
- **Auth:** User and session management (Google/GitHub/Email).
- **Database:** Storage of user progress, records, and statistics.
- **Middleware:** Route protection and server state synchronization.

### 3. Visuals and Experience
- **Styling:** Tailwind CSS 4 for a modern and responsive design.
- **Animations:** Framer Motion for smooth transitions.
- **3D Effects:** Immersive backgrounds with particles and orbs generated via WebGL.

---

## 🛠️ Development Guide

### Adding New Languages
To add a new programming language:
1. Create a new file in `data/language-name.ts`.
2. Follow the `Snippet` interface defined in `lib/types.ts`.
3. Register the new language in the `data/index.ts` file.

### Coding Standards
- Use **TypeScript** for all new features.
- Document complex functions using **JSDoc**.
- Follow React component conventions (Functional Components + Hooks).

---

## 🌐 Internationalization (i18n)
The project supports multiple languages (PT-BR, EN). Translation logic is managed via `lib/i18n.ts` and the `LocaleProvider.tsx` component.

---

## 🚀 How to Contribute
1. **Fork** the project.
2. Create a **Branch** for your feature (`git checkout -b feature/new-feature`).
3. **Commit** your changes (`git commit -m 'Add: new feature'`).
4. **Push** to the branch (`git push origin feature/new-feature`).
5. Open a **Pull Request**.
