# OMNI-GRID PAKISTAN — Project Rules

## ⚠️ MANDATORY: Read the Platform Blueprint First

Before making ANY changes to this codebase, you MUST read:

**[PLATFORM_BLUEPRINT.md](./PLATFORM_BLUEPRINT.md)**

This is the master engineering document containing:
- Honest assessment of current build state
- 32-module roadmap with acceptance criteria
- Database schema (complete)
- Sprint plan and build order
- Architecture decisions

## Key Architecture Decisions (Locked)

1. **Backend**: Cloudflare Workers + Hono.js + D1 SQLite + R2 Storage
2. **Frontend**: React + Vite + Leaflet/OpenStreetMap
3. **Auth**: Better-Auth (real sessions, not localStorage)
4. **Payments**: Manual bank transfer first, gateway stubs for JazzCash/Easypaisa/Raast
5. **Maps**: Leaflet + OpenStreetMap (free)
6. **UI**: Full rebuild from scratch — new design system (not the old glassmorphism mockups)

## Build Rules

1. **ONE MODULE AT A TIME**: Each module is a complete vertical slice (DB → API → Frontend → Tests). Finish one before starting the next.
2. **NO MOCK DATA**: Every number on screen must come from the database via an API call. Zero hardcoded values.
3. **FRONTEND MUST CALL BACKEND**: The frontend (`packages/app`) must fetch all data from the backend (`packages/template-core`) API. They are not separate apps.
4. **INPUT VALIDATION**: Every API endpoint must validate input with Zod schemas.
5. **ERROR HANDLING**: Every API call in the frontend must handle loading, success, and error states.
6. **MOBILE FIRST**: All UI must be responsive, designed mobile-first.

## Current Sprint Progress

Track progress in the sprint task file and update as modules are completed.
