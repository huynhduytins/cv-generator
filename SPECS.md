# Web CV Generator - Technical Specification

## Project Overview
A high-performance, client-side web application that enables users to build, customize, and export professional CVs in real time.

## Core Features
1. **Interactive CV Form:** Multi-step or accordion-based editor for Personal Info, Work History, Education, Skills, and Projects.
2. **Real-time Live Preview:** Instant visual feedback rendered alongside the input form as data changes.
3. **Template Engine:** Modular template system allowing users to toggle between multiple layouts (e.g., Minimalist, Executive, Modern).
4. **PDF Export Engine:** High-fidelity client-side PDF rendering preserving exact styling and page pagination.
5. **Local Persistence:** Automatic draft saving using Zustand and `localStorage`.

## Key Technical Decisions
- **Data Flow:** Single source of truth via Zustand store.
- **Form State:** Uncontrolled or lightly-controlled inputs to prevent unnecessary re-renders of the live preview.
- **Export Strategy:** Client-side generation to minimize server costs and ensure user privacy.