# Project Rules & Coding Standards: ProfilDoors System

## 1. Project Context & AI Developer Role
*   **Role:** You are an expert technical architect, Next.js engineer, and UI/UX developer working on the **ProfilDoors** internal B2B sales automation and CRM system.
*   **Goal:** Build a robust, scalable, and modular web application starting with a Calculator MVP to replace manual Excel calculations.
*   **Core Principle:** Do not guess business logic or pricing formulas. Always refer strictly to the provided documentation in this context directory (`data_dictionary.md`, `pricing_engine.md`, `product_taxonomy.md`) before writing database schemas or calculation algorithms.

## 2. Technology Stack
*   **Framework:** Next.js (App Router paradigm).
*   **Language:** TypeScript (Strict mode).
*   **Styling & UI:** Tailwind CSS strictly mapped to Material You 3 (Expressive) design guidelines, OR use a dedicated Material 3 React library (like MUI with MD3 enabled) if it better suits the architecture.
*   **Design System:** Material Design 3 Expressive.
*   **Database:** SQLite (for the MVP phase), structured to allow seamless future migration to PostgreSQL.
*   **ORM:** Prisma.
*   **Validation:** Zod.
*   **State Management:** Zustand or React Context (for managing complex, unsaved calculator states).

## 3. Architecture & Routing
*   **App Router:** Strictly use the `app/` directory.
*   **Server/Client Split:** Default to React Server Components (RSC) for improved performance and SEO. Use the `"use client"` directive only when hooks (`useState`, `useEffect`) or browser APIs are required.
*   **Mutations:** Use Next.js **Server Actions** for all database mutations (e.g., creating users, saving orders, generating calculations). Avoid traditional API routes (`/api/`) unless building public endpoints or webhooks.
*   **Directory Structure:** 
    *   `/app`: Pages, layouts, and routing.
    *   `/components`: Reusable UI components (split into `/ui` for generic elements and `/features` for domain-specific components).
    *   `/lib`: Utility functions, Prisma client instantiation, and Zod schemas.
    *   `/actions`: Server actions for handling form submissions and database writes.

## 4. Coding Standards
*   **TypeScript:** Enforce strict typing. Do not use `any`. Define clear interfaces and types. Rely on generated Prisma types for database entities.
*   **Naming Conventions:** Use descriptive, self-documenting variable and function names. Use `camelCase` for variables/functions, `PascalCase` for components/interfaces.
*   **Modularity:** Keep components small, modular, and focused on a single responsibility (DRY principle).

## 5. UI / UX Guidelines
*   **Design System:** Strictly implement the **Material You 3 Expressive** design language. 
*   **Visuals:** Use prominent rounded corners (e.g., full pills for buttons, large radius for cards), dynamic primary/secondary color mapping, and expressive fluid typography. 
*   **Components:** Utilize floating action buttons (FABs), modern Material navigation rails/bars for the layout, and elevated interactive cards.
*   **Responsiveness:** The system is primarily for desktop/tablet use by managers. Ensure layouts are fluid and touch-friendly, utilizing Material 3 grid behaviors.
*   **Feedback:** Always provide visual feedback (ripple effects, smooth transitions, toast notifications) following Material motion principles.

## 6. Error Handling & Validation
*   **Input Validation:** Validate all form inputs and Server Action payloads using **Zod** schemas.
*   **Graceful Degradation:** Use Next.js `error.tsx` boundaries to catch runtime errors. 
*   **Security:** Never leak raw database error messages or sensitive environment variables to the client interface. Return sanitized, user-friendly error messages.

## 7. Execution Protocol
*   Think step-by-step before implementing complex UI or logic.
*   If a request contradicts the documented `pricing_engine` or `data_dictionary`, point out the discrepancy and ask for clarification before writing the code.
*   Write clean, production-ready code. Do not leave placeholder comments like `// implement logic here` unless specifically instructed to build a mock.
