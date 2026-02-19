# Architecture Boundaries

This document defines where code should live to maintain a clean, testable codebase.

## Directory Structure

```
src/
├── core/           # Domain logic (types, engines, stores)
│   ├── types/      # Domain interfaces and type definitions
│   ├── engine/     # Pure business logic (stateless calculations)
│   ├── store/      # React contexts for domain state (TenantContext, OKRContext)
│   └── data/       # Seed/mock data for domain entities
│
├── lib/            # Shared utilities (pure functions, no domain knowledge)
│   ├── utils.ts    # cn(), formatters, validators
│   └── integrations/ # Health, coverage, risk calculators (deterministic)
│
├── services/       # Data access layer (single gateway for mock → future API)
│                   # AuthService, DecisionService, IntegrationService, OkrService
│
├── data/           # UI catalog data (agent modules, integrations, packs)
│                   # No business rules, no React components
│
├── hooks/          # Custom React hooks (compose domain + UI logic)
│
├── contexts/       # App-level React contexts (Theme, RBAC, Pack, i18n)
│
├── components/     # Reusable UI components
│   ├── ui/         # Primitives (shadcn)
│   └── ...         # Feature components
│
├── pages/          # Route-level components (composition only)
│
├── i18n/           # Translations and language context
│
└── test/           # Test files
```

## Rules

### Pages (`src/pages/`)
- **ONLY** compose layout and components
- **NEVER** compute health scores, risk levels, coverage, or any domain metric inline
- **NEVER** contain `if (score > 60)` style business rules
- Import calculations from `core/engine/` or `lib/`

❌ Bad:
```tsx
// pages/Dashboard.tsx
const healthScore = objectives.reduce((s, o) => s + o.health_score, 0) / objectives.length;
const status = healthScore > 70 ? "green" : healthScore > 40 ? "yellow" : "red";
```

✅ Good:
```tsx
// pages/Dashboard.tsx
const { overall_score } = calculateStrategicHealthIndex(objectives);
```

### Core Engines (`src/core/engine/`)
- Pure functions with deterministic output
- No React imports, no side effects
- Must be independently testable
- Receives data as arguments, never reads global state

### Data (`src/data/`)
- Static catalog definitions (agents, integrations, packs, etc.)
- No `import React`, no JSX
- May export typed arrays/objects used by UI

### Contexts (`src/contexts/`)
- React state management only
- Delegates calculations to `core/engine/`
- Provides composed state to components

## Testing Strategy

- **Core engines**: Unit tests with deterministic inputs/outputs
- **Contexts**: Integration tests with React Testing Library (if needed)
- **Pages**: Visual/E2E tests only (no unit tests for layout)

## Type Safety

- `strict: true` is enabled in `tsconfig.app.json`
- No `as any` unless documented with a justification comment
- Prefer `unknown` over `any` for external data
- Use discriminated unions for state variants
