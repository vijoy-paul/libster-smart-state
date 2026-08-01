# @libster/smart-state

A production-ready React component that automatically renders the correct UI based on application state — loading, error, empty, offline, unauthorized, forbidden, not-found, maintenance, or success.

[![npm version](https://img.shields.io/npm/v/@libster/smart-state?color=cb3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@libster/smart-state)
[![CI](https://github.com/vijoy-paul/libster-smart-state/actions/workflows/ci.yml/badge.svg)](https://github.com/vijoy-paul/libster-smart-state/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![Bundle Size](https://img.shields.io/badge/minzipped-~7KB-blue)](https://bundlephobia.com/package/@libster/smart-state)

---

## Why

Every data-fetching component ends up writing the same boilerplate:

```tsx
if (loading) return <Spinner />;
if (error)   return <ErrorPage />;
if (!data)   return <Empty />;
return <Content />;
```

Multiply that by dozens of components, add offline detection, auth guards, and maintenance windows, and it becomes a maintenance burden. `SmartState` centralises all of it into a single declarative component with accessible defaults out of the box.

---

## Table of Contents

- [Why](#why)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Supported States](#supported-states)
- [Props API](#props-api)
- [Hook: useSmartState](#hook-usesmartstate)
- [Utilities](#utilities)
- [Customization](#customization)
- [Dark Mode](#dark-mode)
- [SSR / Next.js](#ssr--nextjs)
- [Examples](#examples)
  - [Basic Fetch](#basic-fetch)
  - [TanStack Query](#tanstack-query)
  - [SWR](#swr)
  - [Redux / RTK Query](#redux--rtk-query)
  - [Apollo GraphQL](#apollo-graphql)
  - [Next.js](#nextjs)
  - [Remix](#remix)
  - [Dashboard](#dashboard)
  - [Infinite Scroll](#infinite-scroll)
  - [Search Results](#search-results)
  - [React Router](#react-router)
  - [Table](#table)
  - [Chat](#chat)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Migration Guide](#migration-guide)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
npm install @libster/smart-state
# or
yarn add @libster/smart-state
# or
pnpm add @libster/smart-state
```

Optionally import the default styles:

```ts
import '@libster/smart-state/styles';
```

---

## Quick Start

Instead of writing:

```tsx
if (loading) return <Spinner />;
if (error) return <ErrorPage error={error} />;
if (!users.length) return <EmptyState />;
return <UserTable users={users} />;
```

Write:

```tsx
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <SmartState loading={loading} error={error} data={users}>
      <UserTable users={users} />
    </SmartState>
  );
}
```

`SmartState` automatically picks the right state to render, in priority order.

---

## How It Works

`SmartState` evaluates all props and renders the **first matching state** in this priority order:

| Priority | State          | Trigger                     |
| -------- | -------------- | --------------------------- |
| 1        | `maintenance`  | `maintenance={true}`        |
| 2        | `offline`      | `offline={true}`            |
| 3        | `unauthorized` | `unauthorized={true}`       |
| 4        | `forbidden`    | `forbidden={true}`          |
| 5        | `notFound`     | `notFound={true}`           |
| 6        | `loading`      | `loading={true}`            |
| 7        | `error`        | `error` is truthy           |
| 8        | `empty`        | `data` is empty             |
| 9        | `success`      | All above conditions are false |

---

## Supported States

| State          | Default UI                   | Accessible Role   |
| -------------- | ---------------------------- | ----------------- |
| `loading`      | Spinner + "Loading…"         | `role="status"` + `aria-busy` |
| `error`        | ⚠️ Error message             | `role="alert"`    |
| `empty`        | 📭 "Nothing here yet"        | `role="status"`   |
| `offline`      | 📡 "You're offline"          | `aria-live="polite"` |
| `unauthorized` | 🔐 "Sign in required"        | `role="alert"`    |
| `forbidden`    | 🚫 "Access denied"           | `role="alert"`    |
| `notFound`     | 🔍 "Not found"               | `role="status"`   |
| `maintenance`  | 🛠️ "Under maintenance"      | `aria-live="polite"` |
| `success`      | Children rendered            | —                 |

---

## Props API

```tsx
<SmartState<TData>
  // ── State flags ──────────────────────────────────────────────────
  loading?: boolean
  error?: Error | string | boolean | null
  data?: TData
  offline?: boolean
  unauthorized?: boolean
  forbidden?: boolean
  notFound?: boolean
  maintenance?: boolean

  // ── Custom empty detection ───────────────────────────────────────
  isEmpty?: (data: TData) => boolean

  // ── Custom state components (ReactNode or ComponentType) ─────────
  loadingComponent?: ReactNode | ComponentType
  errorComponent?: ReactNode | ComponentType
  emptyComponent?: ReactNode | ComponentType
  offlineComponent?: ReactNode | ComponentType
  unauthorizedComponent?: ReactNode | ComponentType
  forbiddenComponent?: ReactNode | ComponentType
  notFoundComponent?: ReactNode | ComponentType
  maintenanceComponent?: ReactNode | ComponentType

  // ── Custom "catch-all" component for success state ───────────────
  customComponent?: ReactNode | ComponentType

  // ── Wrapper ──────────────────────────────────────────────────────
  className?: string
  style?: React.CSSProperties

  // ── Children (rendered on success) ──────────────────────────────
  children: ReactNode
>
```

### Props Table

| Prop                    | Type                              | Default         | Description                                             |
| ----------------------- | --------------------------------- | --------------- | ------------------------------------------------------- |
| `children`              | `ReactNode`                       | required        | Rendered when state is `success`                        |
| `loading`               | `boolean`                         | `false`         | Triggers loading state                                  |
| `error`                 | `Error \| string \| boolean \| null` | `null`        | Triggers error state                                    |
| `data`                  | `TData`                           | —               | Evaluated for emptiness                                 |
| `offline`               | `boolean`                         | `false`         | Triggers offline state                                  |
| `unauthorized`          | `boolean`                         | `false`         | Triggers unauthorized state                             |
| `forbidden`             | `boolean`                         | `false`         | Triggers forbidden state                                |
| `notFound`              | `boolean`                         | `false`         | Triggers not-found state                                |
| `maintenance`           | `boolean`                         | `false`         | Triggers maintenance state                              |
| `isEmpty`               | `(data: TData) => boolean`        | built-in        | Custom empty detection                                  |
| `loadingComponent`      | `ReactNode \| ComponentType`      | `DefaultLoading`  | Override loading UI                                     |
| `errorComponent`        | `ReactNode \| ComponentType`      | `DefaultError`    | Override error UI                                       |
| `emptyComponent`        | `ReactNode \| ComponentType`      | `DefaultEmpty`    | Override empty UI                                       |
| `offlineComponent`      | `ReactNode \| ComponentType`      | `DefaultOffline`  | Override offline UI                                     |
| `unauthorizedComponent` | `ReactNode \| ComponentType`      | `DefaultUnauthorized` | Override unauthorized UI                           |
| `forbiddenComponent`    | `ReactNode \| ComponentType`      | `DefaultForbidden`    | Override forbidden UI                              |
| `notFoundComponent`     | `ReactNode \| ComponentType`      | `DefaultNotFound`     | Override not-found UI                              |
| `maintenanceComponent`  | `ReactNode \| ComponentType`      | `DefaultMaintenance`  | Override maintenance UI                            |
| `customComponent`       | `ReactNode \| ComponentType`      | —               | Replaces children in success state                      |
| `className`             | `string`                          | —               | CSS class on the success wrapper                        |
| `style`                 | `React.CSSProperties`             | —               | Inline style on the success wrapper                     |

---

## Hook: useSmartState

Derive state programmatically without rendering a component:

```tsx
import { useSmartState } from '@libster/smart-state';

function Dashboard() {
  const { state, isLoading, isEmpty, isError, isSuccess } = useSmartState({
    loading,
    error,
    data: users,
  });

  return (
    <div>
      <StatusBar state={state} />
      {isSuccess && <UserTable users={users} />}
      {isEmpty && <EmptyPrompt />}
    </div>
  );
}
```

### Hook Return Value

| Field            | Type      | Description                          |
| ---------------- | --------- | ------------------------------------ |
| `state`          | `SmartStateName` | Resolved state name             |
| `isLoading`      | `boolean` | `state === 'loading'`                |
| `isError`        | `boolean` | `state === 'error'`                  |
| `isEmpty`        | `boolean` | `state === 'empty'`                  |
| `isSuccess`      | `boolean` | `state === 'success'`                |
| `isOffline`      | `boolean` | `state === 'offline'`                |
| `isUnauthorized` | `boolean` | `state === 'unauthorized'`           |
| `isForbidden`    | `boolean` | `state === 'forbidden'`              |
| `isNotFound`     | `boolean` | `state === 'notFound'`               |
| `isMaintenance`  | `boolean` | `state === 'maintenance'`            |

---

## Utilities

### `isEmptyValue(value)`

Detects emptiness for `null`, `undefined`, `""`, `[]`, `{}`, `Map`, and `Set`.

```ts
import { isEmptyValue } from '@libster/smart-state';

isEmptyValue([]);          // true
isEmptyValue(new Map());   // true
isEmptyValue([1, 2]);      // false
```

### `resolveState(options, hasData)`

Resolves the state name from a set of options. Useful for testing or building custom logic.

```ts
import { resolveState } from '@libster/smart-state';

resolveState({ loading: true }, false);     // 'loading'
resolveState({ data: [] }, true);           // 'empty'
resolveState({ data: [1] }, true);          // 'success'
```

### `mergeStates(...options)`

Merges multiple state option objects (last wins).

```ts
import { mergeStates } from '@libster/smart-state';

const merged = mergeStates(
  { loading: false, offline: true },
  { loading: true }
);
// { loading: true, offline: true }
```

### `getErrorMessage(error)`

Extracts a string message from `Error`, `string`, or `boolean`.

```ts
import { getErrorMessage } from '@libster/smart-state';

getErrorMessage(new Error('Not found')); // 'Not found'
getErrorMessage('Rate limited');          // 'Rate limited'
getErrorMessage(true);                    // 'An unexpected error occurred.'
```

### `createSmartState(SmartState, defaults)`

Creates a pre-configured `SmartState` with default props merged in — ideal for setting app-wide overrides.

```tsx
import { SmartState, createSmartState } from '@libster/smart-state';

const AppState = createSmartState(SmartState, {
  loadingComponent: <MySpinner />,
  emptyComponent: <MyEmptyUI />,
});

// Use everywhere:
<AppState loading={loading} data={data}>
  <Content />
</AppState>
```

---

## Customization

### Custom components as JSX

```tsx
<SmartState
  loading={loading}
  data={users}
  loadingComponent={<div className="my-spinner">Loading users…</div>}
  emptyComponent={
    <div className="my-empty">
      <img src="/empty.svg" alt="No users" />
      <p>No users found. <button>Invite one!</button></p>
    </div>
  }
>
  <UserTable users={users} />
</SmartState>
```

### Custom components as ComponentType

```tsx
function MyLoader() {
  return <div className="skeleton-loader" aria-busy="true" />;
}

<SmartState loading={loading} loadingComponent={MyLoader} data={users}>
  <UserTable users={users} />
</SmartState>
```

### Custom empty detection

```tsx
<SmartState
  data={users}
  isEmpty={(users) => users.filter((u) => u.active).length === 0}
>
  <UserTable users={users} />
</SmartState>
```

---

## Dark Mode

The package uses CSS `@media (prefers-color-scheme: dark)` automatically. No extra setup required when using the default styles.

For custom themes:

```css
.smart-state {
  --smart-state-text: #374151;
  --smart-state-muted: #6b7280;
  --smart-state-accent: #6366f1;
}

@media (prefers-color-scheme: dark) {
  .smart-state {
    --smart-state-text: #f9fafb;
    --smart-state-muted: #9ca3af;
    --smart-state-accent: #818cf8;
  }
}
```

---

## SSR / Next.js

`SmartState` is SSR-safe. The `"use client"` directive is injected into the bundle banner so it works out of the box with Next.js App Router.

```tsx
// app/users/page.tsx
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

export default async function UsersPage() {
  const users = await fetchUsers();
  return (
    <SmartState data={users}>
      <UserTable users={users} />
    </SmartState>
  );
}
```

---

## Examples

### Basic Fetch

```tsx
import { useState, useEffect } from 'react';
import { SmartState } from '@libster/smart-state';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SmartState loading={loading} error={error} data={users}>
      <UserTable users={users} />
    </SmartState>
  );
}
```

### TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { SmartState } from '@libster/smart-state';

function UserList() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then((r) => r.json()),
  });

  return (
    <SmartState loading={isLoading} error={error} data={users}>
      <UserTable users={users} />
    </SmartState>
  );
}
```

### SWR

```tsx
import useSWR from 'swr';
import { SmartState } from '@libster/smart-state';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function UserList() {
  const { data: users, error, isLoading } = useSWR('/api/users', fetcher);

  return (
    <SmartState loading={isLoading} error={error} data={users}>
      <UserTable users={users ?? []} />
    </SmartState>
  );
}
```

### Redux / RTK Query

```tsx
import { useGetUsersQuery } from './api/usersApi';
import { SmartState } from '@libster/smart-state';

function UserList() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();

  return (
    <SmartState loading={isLoading} error={error} data={users}>
      <UserTable users={users} />
    </SmartState>
  );
}
```

### Apollo GraphQL

```tsx
import { useQuery, gql } from '@apollo/client';
import { SmartState } from '@libster/smart-state';

const GET_USERS = gql`query { users { id name } }`;

function UserList() {
  const { data, loading, error } = useQuery(GET_USERS);

  return (
    <SmartState loading={loading} error={error} data={data?.users}>
      <UserTable users={data?.users ?? []} />
    </SmartState>
  );
}
```

### Next.js

```tsx
// app/dashboard/page.tsx
'use client';
import { useState } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

export default function DashboardPage() {
  const { data, isLoading, error } = useData();

  return (
    <main>
      <h1>Dashboard</h1>
      <SmartState loading={isLoading} error={error} data={data}>
        <DashboardContent data={data!} />
      </SmartState>
    </main>
  );
}
```

### Remix

```tsx
import { useLoaderData, useNavigation } from '@remix-run/react';
import { SmartState } from '@libster/smart-state';

export default function UsersRoute() {
  const { users } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';

  return (
    <SmartState loading={loading} data={users}>
      <UserTable users={users} />
    </SmartState>
  );
}
```

### Dashboard

```tsx
import { SmartState } from '@libster/smart-state';

function Dashboard({ stats, loading, error, offline, maintenance }) {
  return (
    <SmartState
      loading={loading}
      error={error}
      offline={offline}
      maintenance={maintenance}
      data={stats}
    >
      <DashboardGrid stats={stats} />
    </SmartState>
  );
}
```

### Infinite Scroll

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { SmartState } from '@libster/smart-state';

function Feed() {
  const { data, isLoading, error, fetchNextPage } = useInfiniteQuery({...});
  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <SmartState
      loading={isLoading}
      error={error}
      data={items}
      isEmpty={(d) => d.length === 0}
    >
      <>
        {items.map((item) => <FeedItem key={item.id} item={item} />)}
        <LoadMoreButton onClick={fetchNextPage} />
      </>
    </SmartState>
  );
}
```

### Search Results

```tsx
import { SmartState } from '@libster/smart-state';

function SearchResults({ query, results, loading, error }) {
  return (
    <SmartState
      loading={loading}
      error={error}
      data={results}
      emptyComponent={
        <div>No results for "<strong>{query}</strong>"</div>
      }
    >
      <ResultsList results={results} />
    </SmartState>
  );
}
```

### React Router

Use `useLoaderData` for data and `useNavigation` for the in-flight loading state. Attach a `PostsError` component as the route's `errorElement` to handle thrown responses and errors consistently.

```tsx
import { useLoaderData, useNavigation, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { SmartState } from '@libster/smart-state';

// Loader (attach to the route definition):
// export async function postsLoader() {
//   const res = await fetch('/api/posts');
//   if (!res.ok) throw new Response('Not Found', { status: 404 });
//   return res.json();
// }

export function PostsPage() {
  const posts = useLoaderData() as Post[];
  const navigation = useNavigation();

  // navigation.state is 'loading' while the next route's loader runs
  const loading = navigation.state === 'loading';

  return (
    <SmartState loading={loading} data={posts}>
      <PostList posts={posts} />
    </SmartState>
  );
}

// Attach as errorElement on the route:
export function PostsError() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error ? error.message : 'Something went wrong.';

  return (
    <SmartState notFound={is404} error={is404 ? undefined : message}>
      <span />
    </SmartState>
  );
}
```

### Table

Wrap a sortable table in `SmartState` to automatically handle loading, error, and empty states. Use a custom `emptyComponent` to guide users when the table has no rows.

```tsx
import { useEffect, useState } from 'react';
import { SmartState } from '@libster/smart-state';

function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SmartState
      loading={loading}
      error={error}
      data={users}
      isEmpty={(d) => d.length === 0}
      emptyComponent={
        <div>
          <p>No users found.</p>
          <button onClick={() => openInviteDialog()}>Invite a user</button>
        </div>
      }
    >
      <SortableTable rows={users} />
    </SmartState>
  );
}
```

### Chat

Wrap the message list in `SmartState` to handle the initial history fetch, an offline connection drop, and the empty state for a brand-new conversation.

```tsx
import { useEffect, useState } from 'react';
import { SmartState } from '@libster/smart-state';

function ChatWindow({ conversationId }: { conversationId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}/messages`)
      .then((r) => r.json())
      .then(setMessages)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [conversationId]);

  return (
    <SmartState
      loading={loading}
      error={error}
      offline={offline}
      data={messages}
      isEmpty={(msgs) => msgs.length === 0}
      emptyComponent={<p>No messages yet. Say hello! 👋</p>}
    >
      <MessageList messages={messages} />
    </SmartState>
  );
}
```

---

## FAQ

**Do I need to import CSS?**
No, but the default state UIs won't be styled without it. Import `@libster/smart-state/styles` or bring your own styles.

**Can I use it without data?**
Yes. Omitting `data` skips empty detection — the component goes straight to `success` unless another flag is set.

**Does it work with TypeScript generics?**
Yes: `<SmartState<User[]> data={users} isEmpty={(d) => d.length === 0}>`.

**Can I use async components (React Suspense) inside children?**
Yes. Each state is already wrapped in a `Suspense` boundary.

**Is it SSR-compatible?**
Yes. It renders correctly on the server and hydrates without mismatches.

**What counts as "empty"?**
`null`, `undefined`, `""` (or whitespace), `[]`, `{}`, empty `Map`, empty `Set`.

---

## Troubleshooting

**Children render even though data is empty**
Make sure you're passing the `data` prop. Without it, empty detection is skipped.

**Custom `isEmpty` not working**
Ensure `data` is also provided — `isEmpty` only runs when the `data` key is present in props.

**TypeScript error on `data` type**
Use the generic: `<SmartState<YourType[]> data={yourData}>`.

**Styles not applying**
Import `'@libster/smart-state/styles'` at the root of your app.

---

## Migration Guide

### v0.x → v1.0

- `resolveState` signature changed: now accepts `(options, hasData: boolean)` instead of a single options object with a `'data' in options` check.
- `createSmartState` now requires the `SmartState` component as the first argument to avoid circular imports.

---

## Contributing

1. Fork and clone the repo
2. `npm install`
3. Make changes in `src/`
4. `npm test` — all tests must pass
5. `npm run type-check` — must be error-free
6. Add a changeset: `npx changeset`
7. Open a PR

---

## License

MIT © Vijoy Paul
