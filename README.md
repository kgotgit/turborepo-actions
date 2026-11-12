# GitHub Actions Monorepo with Turborepo

```
my-actions/
├── packages/
│   ├── shared/              # Shared utilities
│   ├── action-checkout/     # Action 1
│   ├── action-deploy/       # Action 2
│   └── action-notify/       # Action 3
├── .github/workflows/
├── turbo.json               # Turborepo config
├── tsconfig.json            # Shared TS config
└── package.json
```

## Key Benefits

1. **Cached builds** — Turborepo caches task outputs, skips unchanged packages
2. **Parallel execution** — Builds independent actions simultaneously
3. **Dependency graph** — Auto-runs dependencies (e.g., build shared lib first)
4. **Reduced duplication** — Share code, config, and workflows

## Build Flow

```
build command
├── build shared/
├── build action-checkout/ (depends on shared)
├── build action-deploy/ (depends on shared)
└── build action-notify/ (depends on shared)
```

All cached if inputs haven't changed.
