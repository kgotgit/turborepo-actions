# GitHub Actions Monorepo with Turborepo

Real-world example of a **Turborepo-based GitHub Actions monorepo** with multiple reusable actions.

## 📁 Structure

```
turborepo-actions/
├── packages/
│   ├── shared/              # Shared utilities (@actions/core wrappers)
│   ├── action-checkout/     # Checkout action
│   └── action-deploy/       # Deploy action (with environment support)
├── .github/workflows/
│   ├── build-and-test.yml   # CI: Build & test all actions
│   └── deploy.yml           # Real-world deploy pipeline
├── turbo.json               # Turborepo config
├── tsconfig.json            # Shared TS config
└── package.json
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build all actions (Turborepo handles order & caching)
npm run build

# Run tests
npm run test

# Watch mode
npm run dev
```

## 🎯 Real-World Workflow

The `deploy.yml` workflow demonstrates:

1. **Checkout & Build** → Extracts version, builds all actions with Turborepo
2. **Deploy to Staging** → Uses `action-deploy` to deploy to staging
3. **Deploy to Production** → Triggered only on git tags, uses `action-deploy` for prod

### Usage Example:

```yaml
- name: Deploy to Staging
  uses: ./packages/action-deploy@main
  with:
    environment: staging
    version: 1.0.0
```

## ⚡ Turborepo Benefits

| Feature | Without Turborepo | With Turborepo |
|---------|------------------|----------------|
| **Build Time** (first run) | ~6s | ~6s |
| **Build Time** (cached) | ~6s | ~0.1s |
| **Parallel Builds** | Manual | Automatic |
| **Dependency Order** | Manual | Automatic |
| **Code Sharing** | Manual setup | Built-in |

### Cache Example:

```bash
$ npm run build
✓ shared (3s)
✓ action-checkout (2s)  ← depends on shared
✓ action-deploy (2s)    ← depends on shared
Total: 3s (parallel)

$ npm run build  # Second time
✓ shared (CACHED)
✓ action-checkout (CACHED)
✓ action-deploy (CACHED)
Total: 0.1s
```

## 📦 Shared Utilities

All actions use `@actions/shared`:

```typescript
import { getInput, setOutput, logInfo, logError } from '@actions/shared';

logInfo('Deploying...');
const env = getInput('environment');
setOutput('status', 'success');
```

## 🔄 CI/CD Pipeline

Two workflows included:

1. **`build-and-test.yml`** — Runs on every push/PR
   - Installs dependencies
   - Runs `turbo run build` (orchestrates all builds)
   - Runs tests
   - Shows cache benefit on second build

2. **`deploy.yml`** — Real-world deployment pipeline
   - Checkout & extract version
   - Deploy to staging (always)
   - Deploy to production (only on version tags)

## 🏗️ How to Extend

Add a new action:

```bash
mkdir -p packages/action-notify/src
```

Create `packages/action-notify/package.json`:
```json
{
  "name": "action-notify",
  "scripts": {
    "build": "tsc && ncc build dist/index.js -o dist"
  },
  "dependencies": {
    "@actions/shared": "*"
  }
}
```

Create `packages/action-notify/src/index.ts`:
```typescript
import { getInput, setOutput, logInfo } from '@actions/shared';

async function run() {
  const channel = getInput('channel');
  logInfo(`Notifying #${channel}...`);
  setOutput('status', 'sent');
}

run();
```

Run `npm run build` — Turborepo automatically builds the new action! 🎉
