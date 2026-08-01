# Examples

These examples show how to integrate `@libster/smart-state` in different scenarios.

| File | Description |
|---|---|
| `basic-fetch.tsx` | Plain `fetch` + `useState` |
| `tanstack-query.tsx` | TanStack Query — `useQuery`, `useMutation`, stale state, and retry |
| `swr.tsx` | SWR — basic fetch, background revalidation, and manual refresh |
| `redux-rtk-query.tsx` | Redux Toolkit Query — `useQuery` with API slice setup |
| `apollo-graphql.tsx` | Apollo Client — `useQuery` with GraphQL |
| `nextjs.tsx` | Next.js App Router (client component) and Pages Router patterns |
| `remix.tsx` | Remix — `useLoaderData`, `useNavigation`, and `ErrorBoundary` |
| `react-router.tsx` | React Router v6+ — data loaders, `useNavigation`, and `errorElement` |
| `dashboard.tsx` | Multiple concurrent flags (offline, maintenance, error) with toggle controls |
| `table.tsx` | Sortable data table with loading, error, and empty states |
| `search-results.tsx` | Custom `emptyComponent` that shows the search query |
| `infinite-scroll.tsx` | Custom `isEmpty` function with paginated data loading |
| `chat.tsx` | Messaging UI — loading history, offline detection, and empty conversation |
| `use-smart-state-hook.tsx` | `useSmartState` hook for fully custom rendering without the component |
| `custom-state.tsx` | `createSmartState` for app-wide custom default overrides |

## Running an example

These are standalone component files. To run them, copy the component into a Vite or Create React App project and render it as the root:

```tsx
// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import DashboardExample from './examples/dashboard';

createRoot(document.getElementById('root')!).render(<DashboardExample />);
```

Then:

```bash
npm install
npm run dev
```

## Installing peer dependencies

Some examples require additional packages:

| Example | Install |
|---|---|
| `tanstack-query.tsx` | `npm install @tanstack/react-query` |
| `swr.tsx` | `npm install swr` |
| `redux-rtk-query.tsx` | `npm install @reduxjs/toolkit react-redux` |
| `apollo-graphql.tsx` | `npm install @apollo/client graphql` |
| `remix.tsx` | `npm install @remix-run/react @remix-run/node` |
| `react-router.tsx` | `npm install react-router-dom` |
