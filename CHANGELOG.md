# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-01

### Added

- `SmartState` component with 9 built-in states: `loading`, `error`, `empty`, `offline`, `unauthorized`, `forbidden`, `notFound`, `maintenance`, and `success`
- Priority-based state resolution (maintenance → offline → unauthorized → forbidden → notFound → loading → error → empty → success)
- Default accessible UI for every state (`role="alert"`, `role="status"`, `aria-busy`, `aria-live`)
- Full TypeScript support with generics (`<SmartState<TData>`)
- `useSmartState` hook for programmatic state derivation
- `isEmptyValue` utility — detects empty `null`, `undefined`, `""`, `[]`, `{}`, `Map`, `Set`
- `resolveState` utility — resolves state name from options
- `mergeStates` utility — merges multiple state option objects
- `getErrorMessage` utility — extracts string message from `Error`, `string`, or `boolean`
- `createSmartState` factory — creates pre-configured `SmartState` instances with default props
- Custom component overrides for every state (`loadingComponent`, `errorComponent`, etc.)
- Custom empty detection via `isEmpty` prop
- Dark mode support via CSS `@media (prefers-color-scheme: dark)`
- SSR / Next.js App Router compatible (`"use client"` banner injected automatically)
- Default styles available via `@libster/smart-state/styles`
