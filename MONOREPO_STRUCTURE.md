# Monorepo Structure Guide

This repository is organized as a **professional monorepo** using Turborepo, with clear separation between GitHub Actions and reusable libraries.

## 📁 Directory Structure

```
.
├── actions/                      # GitHub Actions (published to GitHub)
│   ├── checkout/                # Custom checkout action
│   ├── deploy/                  # Custom deployment action
│   └── shared/                  # Shared utilities for actions
│
├── packages/                     # Reusable libraries (internal & publishable)
│   ├── providers/               # Provider-specific integrations
│   │   ├── vercel/             # Vercel deployment utilities
│   │   ├── sanity/             # Sanity CMS utilities
│   │   ├── sonarqube/          # SonarQube integration (template)
│   │   └── veracode/           # Veracode security scanning (template)
│   │
│   ├── notifications/           # Notification builders
│   │   └── e2e-builders/       # E2E test result notification builders
│   │
│   ├── git/                    # Git utilities
│   │   └── commit, branch, diff helpers
│   │
│   ├── github-app/             # GitHub API client
│   │   └── Octokit wrapper, PR/Issue helpers
│   │
│   └── utils/                  # General utilities (placeholder)
│
├── turbo.json                   # Turborepo configuration
├── tsconfig.json                # Root TypeScript config
├── package.json                 # Root workspace definition
└── .github/workflows/          # GitHub Actions workflows

```

## 🎯 Design Principles

### **Separation of Concerns**

- **actions/** - Things users *run* in workflows
  - Published as GitHub Actions
  - Have `action.yml` metadata files
  - Bundled with `ncc` for zero dependencies
  - Committed dist files for fast execution

- **packages/** - Reusable code *libraries*
  - Used by actions or other developers
  - Can be published to npm
  - TypeScript source + compiled outputs
  - Organized by purpose/provider

### **Provider Grouping**

Utilities are grouped by their external service:

```
packages/providers/
├── vercel/        # Vercel deployment SDK wrapper
├── sanity/        # Sanity headless CMS SDK wrapper
├── sonarqube/     # SonarQube quality gates integration
└── veracode/      # Veracode security scanning integration
```

Each provider package contains:
- Service-specific utilities
- Configuration helpers
- API wrappers and type definitions
- Example usage

### **Utility Packages**

General-purpose reusable code:

- **notifications** - Notification builders (E2E results, Slack, email, etc.)
- **git** - Git operations (commit, branch, diff helpers)
- **github-app** - GitHub API client (issues, PRs, deployments, checks)
- **utils** - Common utilities (string, array, object helpers)

## 🏗️ Package Structure

Each package follows the same pattern:

```
packages/notifications/
├── package.json          # Package metadata
├── tsconfig.json         # TypeScript configuration
├── src/
│   └── index.ts         # Source code (TypeScript)
└── dist/
    ├── index.js         # Compiled JavaScript
    ├── index.d.ts       # Type definitions
    ├── index.js.map     # Source map
    └── index.d.ts.map   # Type map
```

## 🚀 Building

### Build All Packages

```bash
npm run build
```

Turborepo will:
1. Build dependencies first (topological sort)
2. Build packages in parallel
3. Cache unchanged packages
4. Run actions last (they depend on packages)

### Build Specific Package

```bash
npm run build -- --filter=@providers/vercel
```

### Watch Mode

```bash
npm run dev
```

## 📦 Dependencies

### Actions Dependencies

Actions can depend on:
- Packages in `/packages` (e.g., `@actions/shared`, `@providers/vercel`)
- External packages (e.g., `@actions/core`, `@actions/github`)

Example from `actions/deploy`:
```json
{
  "dependencies": {
    "@actions/core": "^1.10.0",
    "@actions/shared": "*"
  }
}
```

### Package Dependencies

Packages can depend on:
- Other packages (e.g., `@packages/notifications` uses `@actions/core`)
- External packages

## 🔄 Workflow Files

All dist files are committed to git and pushed to the repository:

```
actions/checkout/dist/index.js    # Bundled checkout action
actions/deploy/dist/index.js      # Bundled deploy action
actions/shared/dist/index.js      # Bundled shared utilities
packages/*/dist/                  # All compiled libraries
```

**Why?** GitHub Actions runners clone the repo and run `dist/index.js` directly. No npm install needed at runtime = faster execution.

## 📝 Example: Using a Provider Package

### In an Action

```typescript
// actions/deploy/src/index.ts
import { getInput, info } from '@actions/core';
import { deployToVercel, VercelDeploymentConfig } from '@providers/vercel';

async function run() {
  const config: VercelDeploymentConfig = {
    projectId: getInput('vercel-project-id'),
    token: getInput('vercel-token'),
    environment: 'production',
    version: getInput('version'),
  };
  
  await deployToVercel(config);
  info('✅ Deployment complete!');
}

run().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
```

### In Another Package

```typescript
// packages/notifications/src/index.ts
import { createE2ENotificationBuilder } from '@packages/notifications';

const builder = createE2ENotificationBuilder()
  .addTestResult({ testName: 'E2E Login', status: 'passed', duration: 1500 })
  .addTestResult({ testName: 'E2E Checkout', status: 'passed', duration: 2300 });

console.log(builder.buildSummary());
```

## 🔗 Adding New Packages

### 1. Create Package Directory

```bash
mkdir -p packages/my-provider/src
```

### 2. Create `package.json`

```json
{
  "name": "@providers/my-provider",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "echo 'Testing...'"
  },
  "dependencies": {
    "@actions/core": "^1.10.0"
  }
}
```

### 3. Create `tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create `src/index.ts`

Implement your utilities.

### 5. Update Root `package.json`

Turborepo automatically discovers packages in `packages/` and `actions/` folders, so you don't need to do anything!

## 🧪 Testing

### Run Tests (All Packages)

```bash
npm run test
```

### Run Tests for Specific Package

```bash
npm run test -- --filter=@providers/vercel
```

## 📚 Best Practices

### ✅ Do

- **Group related code** - Keep provider utilities together
- **Use descriptive names** - Package names should indicate purpose
- **Export types** - Help consumers with TypeScript definitions
- **Document APIs** - Add JSDoc comments to public functions
- **Keep packages focused** - One responsibility per package
- **Use workspace dependencies** - Reference other packages via `package.json`

### ❌ Don't

- **Mix concerns** - Don't put actions logic in packages
- **Circular dependencies** - Design to avoid them (Turborepo will warn)
- **Duplicate code** - Extract to shared packages instead
- **Hardcode secrets** - Use environment variables
- **Break TypeScript** - Use `any` sparingly, enable strict mode

## 🔐 Secrets & Environment Variables

Actions use GitHub Actions secrets:
```yaml
- uses: ./actions/deploy
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

Packages should accept configuration as function arguments:
```typescript
export async function deployToVercel(config: VercelDeploymentConfig) {
  // config.token comes from caller
}
```

## 📖 Common Tasks

### Refactor: Move Code to Package

When you have duplicate code in multiple actions:

1. Create a new package in `packages/`
2. Extract the code to that package
3. Update actions to import from package
4. Run `npm install` to link workspace dependencies

### Add New Provider

1. Create `packages/providers/new-provider/`
2. Implement provider utilities
3. Create action that uses them
4. Test via workflow

### Publish to npm

```bash
npm publish packages/notifications/
```

Note: Only do this for public packages. Internal-only packages should stay `"private": true`.

## 🔄 CI/CD Integration

The workflow `build-and-test.yml`:

1. Installs dependencies
2. Runs `npm run build` (builds all packages + actions)
3. Runs `npm run test`
4. Commits bundled action files to git

This ensures dist files are always up-to-date.

## 📚 References

- [Turborepo Documentation](https://turbo.build)
- [npm Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [Creating GitHub Actions](https://docs.github.com/en/actions/creating-actions)
- [GitHub Actions Toolkit](https://github.com/actions/toolkit)

---

**Last Updated:** 2026-11-12
**Monorepo Layout:** Turborepo v2.0+
**Node Version:** 20.x
