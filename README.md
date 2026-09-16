# Yi Culture Platform

Mobile-first workspace for Eastern Traditional Culture App.

## Structure

- **apps/mobile** – Expo mobile app (clean foundation)
- **packages/** – Shared packages (domain, iching, bazi, knowledge-contracts, ai-contracts, eval)
- **server/** – Server-side services (retrieval, ai)
- **docs/** – Documentation and migration plans

## Quick Start

```bash
cd /e/pi/yi-culture-platform
npm install
```

Then:
- `cd apps/mobile && npx expo doctor` – verify Expo setup
- `cd packages/* && npm run build` – build shared packages
- `cd server/retrieval && npm run build` – build server side

## Migration

See `docs/migration-plan.md` for the ordered migration sequence.

## Legacy Repo

The old `E:/pi/yi-agent-app` is treated as `LEGACY_RESEARCH_SOURCE` and is not modified.
