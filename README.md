# Yi Culture Platform

Mobile-first workspace for Eastern Traditional Culture App.

## Structure

- **apps/mobile** – Expo mobile app (clean foundation)
- **packages/** – Shared packages (domain, iching, bazi, knowledge-contracts, ai-contracts, eval)
- **server/** – Server-side services (retrieval, ai)
- **docs/** – Documentation and migration plans

## V0.2 Features

- Three-coin I Ching casting, plus manual 6/7/8/9 input
- Original and changed hexagram diagrams, gua text, and moving-line text
- Local on-device divination history (no database)
- Classical text provenance with transcription and cross-check sources

## Quick Start

```bash
cd E:/pi/yi-culture-platform
npm install
npm run dev:mobile
```

Verification:
- `npm test`
- `npm run typecheck`
- `npm run doctor`
- `npm run web`

## Migration

See `docs/migration-plan.md` for the ordered migration sequence.

## Legacy Repo

The old `E:/pi/yi-agent-app` is treated as `LEGACY_RESEARCH_SOURCE` and is not modified.
