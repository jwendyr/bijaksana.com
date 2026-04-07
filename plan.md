# bijaksana.com — Audited Domain Plan

## Current Reality
- The only concrete implementation evidence in this workspace is the shared `bijaksana-worker/` deployment.
- That Worker already defines:
  - static asset serving
  - AI binding
  - KV state
  - route handling for `bijaksana.org`
- There is not enough evidence to justify a separate full application stack for `bijaksana.com`.

## Recommended Role
- Treat `bijaksana.com` as a sibling domain of the same shared Worker-based product.
- Use it only if it has a clear purpose:
  - redirect to the canonical domain
  - alternate acquisition domain
  - language or market entrypoint using the same Worker backend

## Cloudflare Rules
- Reuse the same Worker, KV, and AI-backed control plane as the main `bijaksana` deployment.
- Do not invent a separate D1, R2, Queue, or app stack without evidence.
- Keep auth, wallet, and notification behavior centralized.

## Definition of Done
- The domain has an explicit role.
- It runs on the shared `bijaksana` Cloudflare Worker stack.
- It does not create a duplicate runtime.
