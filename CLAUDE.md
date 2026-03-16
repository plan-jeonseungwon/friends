# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 3000
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Type-check with tsc --noEmit
npm run clean     # Remove dist/
```

No test runner is configured.

## Architecture

Single-page React + TypeScript app (Vite), deployed to GitHub Pages at `/friends/`.

**All application logic lives in `src/App.tsx`** — a single monolithic component (~1200 lines). There is no routing library; navigation is driven by a `currentView` state string. All state is local to the root `App` component (no Redux, Context, or external state management).

### Views

`currentView` determines what's rendered:
- `home` — dashboard with step counter and friend ranking widget
- `challenge`, `rewards`, `play`, `feeds` — secondary tabs
- `friends_main` — friend list + friend requests summary
- `ranking` — weekly leaderboard
- `friendManagement` — add friends by recommendation code
- `friendRequests` — incoming requests
- `settings` — permissions, notifications, friend management options

Navigation: 5-tab bottom bar (Home, Challenge, Rewards, Play, Feeds). Friend-related views are pushed from the Home tab header icons.

### Data

Mock data lives in `src/data.json` (myProfile, friends, mockUsers, friendRequests). No real backend — `express` and `better-sqlite3` are listed as deps but not used in the frontend bundle.

### Key Libraries

- **motion** (Framer Motion) — `AnimatePresence` + spring physics for bottom sheets and transitions
- **lucide-react** — icons
- **@google/genai** — Gemini API (build-time key injected via `GEMINI_API_KEY` env var)

### Environment

Copy `.env.example` to `.env` and set:
- `GEMINI_API_KEY` — required for Gemini AI features
- `APP_URL` — app URL for self-referential links

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds on push to `main` and deploys to GitHub Pages. The `GEMINI_API_KEY` secret must be set in the repo settings.
