# Upgrade Path to Node 22 and Complete Renovate Updates

This document outlines the steps needed to fully implement the remaining dependency updates from Renovate PR #66.

## Current Status

✅ **Completed**: Partial dependency updates that are compatible with Node 20 and React 18
❌ **Pending**: Updates that require Node 22 and/or React 19

## Remaining Updates Requiring Node 22

The following packages from the Renovate PR require Node >=22.15.1:

1. `@stanlemon/server-with-auth`: ^0.3.34 → ^0.4.7 (requires Node >=22.15.1)  
2. `@stanlemon/webdev`: ^0.2.28 → ^0.2.51 (requires Node >=22.15.1 + React DOM >=19.1.0)

## Upgrade Steps

To complete the full dependency update:

### 1. Upgrade to Node 22

```bash
# Update .nvmrc
echo "v22.17.1" > .nvmrc

# Update GitHub workflow
sed -i 's/node-version: "20.19.4"/node-version: "22.17.1"/' .github/workflows/test.yml

# Update package.json engine requirement
sed -i 's/"node": ">=20.0"/"node": ">=22.0"/' package.json
```

### 2. Choose React Strategy

**Option A: Keep React 18** (Recommended)
- Update `@stanlemon/webdev` to ^0.2.48 (last version supporting React 18)
- Update `@stanlemon/server-with-auth` to ^0.4.7

**Option B: Upgrade to React 19**
- Update React and React DOM to ^19.1.1
- Update all @stanlemon packages to latest versions
- Test all components for React 19 compatibility

### 3. Recommended Commands

For Option A (React 18 + Node 22):

```bash
# Update dependencies
npm install @stanlemon/server-with-auth@^0.4.7 @stanlemon/webdev@^0.2.48

# Test the build
npm run lint
npm test
npm run webpack:build
```

For Option B (React 19 + Node 22):

```bash
# Update React first
npm install react@^19.1.1 react-dom@^19.1.1

# Update @stanlemon packages
npm install @stanlemon/server-with-auth@^0.4.7 @stanlemon/webdev@^0.2.51

# Test extensively
npm run lint
npm test
npm run webpack:build
```

## Testing Requirements

After upgrading:

1. ✅ Linting passes
2. ✅ Unit tests pass  
3. ✅ Webpack build succeeds
4. ⚠️ Manual testing of the application
5. ⚠️ End-to-end testing if available

## Notes

- Node 22.17.1 is the current LTS version
- React 19 is stable but represents a major version change
- Consider the impact on production deployment environments
- Test thoroughly before merging to main branch

## Rollback Plan

If issues arise:
1. Revert to this commit: `6719315`
2. The partial updates provide most benefits with minimal risk
3. Defer Node 22 upgrade to a separate dedicated effort