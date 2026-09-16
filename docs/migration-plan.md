# Migration Plan

This document outlines the planned asset migration from legacy repository to new workspace.

## Migration Manifest

### 1. Domain contracts ✅ COMPLETE (BASE-1B)
- OLD: lib/domain/types.ts → NEW: packages/domain/src/types.ts
- OLD: lib/application/types.ts → NEW: packages/domain/src/application.ts
- OLD: lib/application/errors.ts → NEW: packages/domain/src/errors.ts
- Behavior change: NO (same DomainId set, same capabilities, same error codes)
- Migration type: Contract-only; no runtime registry, no adapter, no router

### 2. I Ching pure engine
- lib/iching/engine.ts

### 3. I Ching tests
- tests/iching-analyze.test.ts
- tests/iching-command.test.ts

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