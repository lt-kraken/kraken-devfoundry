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

## Parallel Website Development

**This repository supports pair-programming workflows** with multiple agents working on independent website slices simultaneously. Use these customizations to keep sessions focused and prevent merge conflicts:

### Getting Started with a Slice

1. **Read the slice registry**: `.github/agent-context/website-slices.md` (source of truth for file ownership)
2. **Start a new slice session**: Use `/` in chat and select `start-website-slice` prompt
3. **Specify your slice**: e.g., `instruction-panel`, `editor-files`, `navigation-shell`, `execution-console`, or `integration-service`
4. **Stay within boundaries**: Edit only owned files; do not touch blocked files or shared orchestration files
5. **When done, provide a handoff**: Give the next agent a summary of what you've completed

### Resume In-Progress Work

1. **Continue a slice session**: Use `/` in chat and select `continue-website-slice` prompt
2. **Paste the prior handoff**: Include the previous agent's summary or session reference
3. **Verify current state**: Confirm files match the handoff description
4. **Continue from the next step**: Minimal context rehydration needed

### Website Slices

| Slice | Owned Files | Independence |
|-------|-----------|--------------|
| `navigation-shell` | Topbar.tsx, CourseSidebar.tsx | ⭐⭐⭐⭐ |
| `instruction-panel` | InstructionPanel.tsx | ⭐⭐⭐⭐⭐ |
| `editor-files` | CodeEditorPanel.tsx, FileExplorer.tsx | ⭐⭐⭐⭐ |
| `execution-console` | ActionBar.tsx, StatusConsole.tsx | ⭐⭐⭐⭐ |
| `integration-service` | learningService.ts, mockLesson.ts | ⭐⭐⭐ |

### Parallel Development Rules

**Respect slice ownership**: Each slice owns its files. Do not edit files outside your slice unless explicitly permitted by the session prompt.

**No unrelated conflict resolution**: If you find code outside your slice that looks incomplete or has conflicts, ignore it. It likely belongs to another active session. Only fix conflicts in your owned files.

**Do not "helpfully" refactor adjacent systems**: Do not optimize, reformat, or improve code in other slices. Stay focused on your slice's task goal.

**Escalate shared-file changes**: If your task requires modifying shared files (`frontend/src/types/learning.ts`, `frontend/src/hooks/useLessonWorkspace.ts`, `frontend/src/features/course/LessonWorkspace.tsx`, `frontend/src/services/learningService.ts`), stop and request a contract-change session rather than pushing through opportunistic edits.

**Handoff cleanly**: When your session ends, provide a brief summary: what you completed, current state of files, next steps, any blockers. The next agent will use this to resume with minimal rework.

### Customization Files

- **Slice Registry**: `.github/agent-context/website-slices.md` — file ownership, boundaries, responsibilities
- **Start Session Prompt**: `.github/prompts/start-website-slice.prompt.md` — bootstrap a focused slice session
- **Continue Session Prompt**: `.github/prompts/continue-website-slice.prompt.md` — resume from a prior handoff
- **Slice Implementer Agent**: `.github/agents/website-slice-implementer.agent.md` — focused coding agent for one slice
- **Slice Scout Agent**: `.github/agents/website-slice-scout.agent.md` — read-only discovery before implementation
- **Auto-Reminder Hook**: `.github/hooks/pair-programming-context.json` — lightweight reminder at session start