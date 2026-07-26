---
name: react-best-practices
description: Performance optimization, React 18/19 hooks utilization, state management patterns, code splitting, memoization, bundle size management, and error boundary patterns.
---

# React Best Practices & Performance Optimization Skill

This skill outlines guidelines and code structures for building fast, robust, and scalable React applications.

## Key Architecture Rules

1. **State Locality**: Keep state as close to where it is used as possible. Avoid pushing transient state (like dropdown toggles or input text drafts) into global stores.
2. **Memoization Discipline**: Use `useMemo` and `useCallback` for expensive computations, large list transformations, or function props passed to memoized components (`React.memo`).
3. **Lazy Loading & Code Splitting**: Split page-level routes with `React.lazy()` and `Suspense` to optimize initial bundle size for PWA performance.
4. **Stable Keys in Render Lists**: Always use unique, stable IDs (never array index) as `key` props when rendering lists.

---

## 1. Route-Level Code Splitting Pattern

```tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## 2. React Error Boundary Pattern

Prevent complete white-screen crashes by wrapping component trees in Error Boundaries:

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 m-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300">
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm">{this.state.error?.message}</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-500"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

---

## 3. Custom Hook Pattern for API State Management

```ts
import { useState, useEffect, useCallback } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(fetchFn: () => Promise<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
```
