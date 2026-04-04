# Kraken DevFoundry Agent Guide

This repository is a production-oriented coding-learning platform. Treat it as a real SaaS product, not a demo or toy app.

## Product Scope

- Build for guided programming education with a professional developer-tool feel.
- Preserve the core split between a learning experience, a code editing experience, and progress/gamification.
- Prefer calm, professional UX over playful or overly gamified patterns.

## Architecture Expectations

- Frontend: React, TypeScript, Tailwind CSS, Monaco Editor.
- Backend: ASP.NET Core Minimal APIs on .NET, with clean architecture across Domain, Application, Infrastructure, and API layers.
- Treat AI assistance and code execution as service boundaries, not tightly coupled controller logic.

## Safety Constraints

- Never execute raw user code directly inside the backend application process.
- Keep code execution behind a safe abstraction, sandbox boundary, or an explicit mock implementation for MVP work.
- Do not bypass these constraints for convenience during feature work.

## Working Style

- Validate frontend and backend independently before concluding that the whole application is broken.
- Favor root-cause fixes over cosmetic patches.
- Keep changes small, consistent with existing patterns, and aligned with the current architecture.
- Do not record transient machine state in this file.

## Persistence Rule

When you learn a crucial fact that is likely to help future agents:

1. Check existing repo memory first.
2. If the fact is durable or likely to matter across follow-up tasks, persist it concisely in repo memory.
3. Do not store speculative conclusions, duplicate notes, or short-lived noise.

## What Belongs Where

- Put stable repo-wide guidance in this file.
- Put verified operational facts and near-term handoff context in repo memory.
- Keep ports, current failures, temporary workarounds, and local machine state out of this file unless they become stable project conventions.