# Migration Plan

This document outlines the planned asset migration from legacy repository to new workspace.

## Migration Manifest

### 1. Domain contracts ✅ COMPLETE (BASE-1B)
- OLD: lib/domain/types.ts → NEW: packages/domain/src/types.ts
- OLD: lib/application/types.ts → NEW: packages/domain/src/application.ts
- OLD: lib/application/errors.ts → NEW: packages/domain/src/errors.ts
- Behavior change: NO (same DomainId set, same capabilities, same error codes)
- Migration type: Contract-only; no runtime registry, no adapter, no router

### 2. I Ching pure engine ✅ COMPLETE (BASE-1C)
- OLD: lib/iching/types.ts → NEW: packages/iching/src/types.ts (UNCHANGED)
- OLD: lib/iching/trigrams.ts → NEW: packages/iching/src/trigrams.ts (UNCHANGED)
- OLD: lib/iching/hexagrams.ts → NEW: packages/iching/src/hexagrams.ts (UNCHANGED; LEGACY_COUPLING: identity mapping and classical text share one table)
- OLD: lib/iching/engine.ts → NEW: packages/iching/src/engine.ts (UNCHANGED)
- NEW package boundary: packages/iching/src/index.ts, package.json, tsconfig.json
- Behavior change: NO
- Old/new deterministic parity: PASS (static, one moving line, multiple moving lines; complete serialized results exact)
- Additional V0.1 helper: lib/iching/classics.ts → packages/iching/src/classics.ts (UNCHANGED; moving-line text lookup)
- V0.2: lib/iching/coin.ts → packages/iching/src/coin.ts (UNCHANGED random input adapter; Engine unchanged)
- Excluded: query.ts (query helper)

### 3. I Ching tests ✅ COMPLETE (V0.1)
- OLD: tests/engine.test.ts → NEW: packages/iching/tests/engine.test.ts
- OLD: tests/trigrams.test.ts → NEW: packages/iching/tests/trigrams.test.ts
- OLD: tests/classics.test.ts → NEW: packages/iching/tests/classics.test.ts
- Import paths adapted for package boundary; assertions unchanged
- Coverage: static/moving lines, eight trigrams, 64 unique mappings, original/changed hexagrams, gua text and moving-line text
- Result: 31 tests PASS

### V0.1 Mobile App ✅ COMPLETE
- Home → I Ching input → result flow implemented in apps/mobile/App.tsx
- Manual six-line input supports 6/7/8/9 with traditional labels
- Result displays original hexagram, diagram, moving lines and texts, changed hexagram and gua text
- Expo Doctor: 21/21 PASS
- Expo Web bundle and headless real-browser interaction: PASS

### V0.2 Productization ✅ COMPLETE
- Copper-coin journey produces six lines without requiring numeric input
- AsyncStorage history persists line values and recalculates records through the deterministic Engine
- Result displays transcription base, cross-check source, corpus scope, and variant policy
- No database, AI, RAG, Bazi, or Engine semantic changes
- Tests: 39 PASS; Expo Doctor: 21/21 PASS
- Real browser: coin casting, result/source display, history display, and reload persistence PASS

### 4. Application adapters
- lib/application/router.ts
- lib/application/types.ts

### 5. Evidence contracts
- lib/knowledge/evidence.ts
- lib/knowledge/evidence-formatter.ts

### 6. Analysis / Grounded contracts
- lib/analysis/grounded-answer.ts
- lib/analysis/analysis-context.ts

### 8. Server retrieval
- lib/analysis/grounded-answer-service.ts
- lib/knowledge/retrieval.ts

### 8. Server provider adapters
- lib/llm/providers/bailian.ts
- lib/llm/providers/openai.ts

### 12. Next.js Product UI
- DO NOT MIGRATE (DEPRECATED_AS_PRODUCT_UI)

### 14. LanceDB
- SERVER ONLY (do not move to mobile)

### 14. Bazi Calendar
- NOT IN BASE-1 (EXISTING EXPERIMENT)
- Will be evaluated in BASE-1B/0C

## Migration Principles

- Asset-by-asset migration
- Tests-first approach
- No behavior change during migration
- Clean separation of concerns
- Mobile-first architecture (apps/mobile + shared packages + server)