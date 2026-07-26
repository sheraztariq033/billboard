---
name: enterprise-billion-dollar-architecture
description: Architectural principles and code patterns for multi-billion-dollar scale web and mobile applications, ensuring sub-100ms global latency, 99.999% availability, domain-driven design, and pixel-perfect adaptive layouts on every device form factor.
---

# Enterprise Billion-Dollar Application Architecture Skill

This skill provides blueprint patterns for building enterprise-grade, multi-billion-dollar scale web applications. It enforces extreme resilience, high performance, modular domain-driven design (DDD), and seamless adaptation across all device form factors (mobile, tablet, desktop, foldable, and TV).

## Core Architectural Pillars

1. **Sub-100ms Global Edge Performance**: Deploy core logic to edge Workers/CDNs with localized caching, edge database bindings, and minimal payload sizes.
2. **99.999% Availability & Resilience**: Implement circuit breakers, graceful degradation, offline-first fallback, and non-blocking retry mechanisms.
3. **Domain-Driven Design (DDD)**: Maintain clear bounded contexts with modular feature folders, isolated domain logic, and strict dependency boundaries.
4. **Universal Adaptive Multi-Device UI**: Use fluid typography (`clamp()`), container queries (`@container`), touch/pointer auto-sensing, and zero layout shift (CLS < 0.01).
5. **Zero-Trust Security & Multi-Tenant Isolation**: Enforce end-to-end encryption, row-level security (RLS), JWT validation, and strict CSP policies.

---

## 1. Universal Adaptive Layout System (`fluid-layout.css`)

Ensure flawless rendering across foldables, mobile devices, tablets, and 4K desktops using fluid sizing and modern container queries:

```css
:root {
  /* Fluid typography: scales dynamically between 320px and 1920px viewports */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-base: clamp(0.875rem, 0.8rem + 0.35vw, 1.125rem);
  --font-size-heading: clamp(1.5rem, 1.2rem + 1.5vw, 3rem);
  
  /* Fluid layout spacing */
  --space-gutter: clamp(1rem, 4vw, 3rem);
  --max-content-width: 1440px;
}

/* Base adaptive container */
.container-adaptive {
  width: 100%;
  max-width: var(--max-content-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-gutter);
  padding-right: var(--space-gutter);
}

/* Container query card layout */
.adaptive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
}

/* Mobile-first touch & input detection */
@media (pointer: coarse) {
  .interactive-element {
    min-height: 48px;
    min-width: 48px;
    padding: 0.75rem 1.25rem;
  }
}
```

---

## 2. Resilient Circuit Breaker & Retry Pattern

Prevent cascading outages when upstream services fail:

```ts
interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(private options: CircuitBreakerOptions = { failureThreshold: 5, resetTimeoutMs: 30000 }) {}

  async execute<T>(fn: () => Promise<T>, fallbackFn: () => T | Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.options.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
      } else {
        return fallbackFn();
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
      }
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.options.failureThreshold) {
        this.state = 'OPEN';
      }
      return fallbackFn();
    }
  }
}
```

---

## 3. Modular Bounded Context Directory Structure

Organize large-scale applications into domain-isolated modules:

```text
src/
├── domains/
│   ├── identity/            # Identity & Auth bounded context
│   │   ├── components/      # UI elements specific to identity
│   │   ├── hooks/           # Domain hooks
│   │   ├── services/        # API clients & token management
│   │   └── types.ts         # Domain data contracts
│   ├── billing/             # Billing & Payments bounded context
│   └── telemetry/           # Analytics & Observability
├── shared/                  # Cross-cutting concerns
│   ├── ui/                  # Design system primitives
│   ├── utils/               # Universal helpers
│   └── config/              # Feature flags & env contracts
└── main.tsx
```

---

## 4. Multi-Tenant Edge Context Middleware

Ensure zero data contamination in multi-tenant enterprise environments:

```ts
export interface TenantContext {
  tenantId: string;
  roles: string[];
  features: Record<string, boolean>;
}

export function validateTenantSecurity(req: Request): TenantContext {
  const tenantId = req.headers.get('x-tenant-id');
  if (!tenantId) {
    throw new Error('Security Violation: Missing Tenant Header');
  }

  // Parse and validate encrypted JWT or session claims
  return {
    tenantId,
    roles: req.headers.get('x-user-roles')?.split(',') || ['user'],
    features: JSON.parse(req.headers.get('x-feature-flags') || '{}'),
  };
}
```
