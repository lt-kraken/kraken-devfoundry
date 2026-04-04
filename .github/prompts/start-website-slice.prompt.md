---
description: "Start a new website slice session with focused scope and boundaries"
argument-hint: "slice-name, task-goal, optional-verification-steps"
agent: "agent"
---

# Start Website Slice Session

**Slice Registry**: `.github/agent-context/website-slices.md` (read this first)  
**Customization**: Use this prompt to bootstrap a focused agent session for one vertical slice.

## Input Parameters

Replace these placeholders with your specific slice and task:

- **Slice Name**: (e.g., `instruction-panel`, `editor-files`, `navigation-shell`, `execution-console`, `integration-service`)
- **Task Goal**: (e.g., "Add collapsible step groups", "Wire console output rendering", "Implement Monaco syntax highlighting")
- **Optional Verification**: (e.g., "Verify responsive layout on mobile", "Test error state rendering")

---

## Your Mission

You are assigned to the **{{SLICE_NAME}}** slice of the kraken-devfoundry website. Your job is to deliver the specific task goal for your slice while respecting strict file ownership boundaries.

### Slice Ownership

Read `.github/agent-context/website-slices.md` and confirm:
1. **Owned files** for this slice (you can edit these freely)
2. **Blocked files** for this slice (do not edit these)
3. **Shared dependencies** this slice reads but does not change

### Task Scope

**Goal**: {{TASK_GOAL}}

**Owned Files**: (from registry)
- Listed below by the slice definition; start by inspecting only these files.

**Blocked Files**: (do not edit)
- You may reference these files to understand types and interfaces, but you must not modify them.

**Verification Steps** (if provided): {{OPTIONAL_VERIFICATION}}

### Collaboration Rules

1. **Inspect only your slice first**: Do a targeted read of your owned files. Do not perform a broad repo scan or pull in unrelated context.

2. **Ignore unrelated changes**: If you find dirty worktree state, incomplete code, or conflicts in files outside your slice, ignore them. They belong to other active sessions.

3. **Do not "helpfully" clean up**: You are not responsible for refactoring adjacent systems, fixing formatting in other files, or resolving conflicts outside your slice. Stay focused on your task.

4. **Respect shared file boundaries**: If your task requires editing a blocked file or shared file, **STOP** and tell the user you need a contract-change session. Do not proceed with uncoordinated edits.

5. **Use types as defined**: Use `frontend/src/types/learning.ts` as the contract. If you discover a type mismatch, stop and ask whether new types should be added in a separate session.

### Approach

1. **Confirm slice scope**: Restate the owned files, blocked files, and task goal back to the user.
2. **Inspect owned files**: Read the current state of your slice's files.
3. **Identify next step**: Describe what you will do next and what verification will confirm success.
4. **Perform the work**: Implement the task within your slice boundary.
5. **Verify completion**: Run the verification steps or manual checks to confirm the task is complete.
6. **Handoff summary**: When done (or if blocked), provide a brief summary:
   - What was completed
   - Current state of files in your slice
   - Any next steps or blockers
   - Instructions for the next agent to resume (if applicable)

### Output Format (First Reply)

```
## Scope Confirmation
- **Slice**: {{SLICE_NAME}}
- **Owned Files**: (list from registry)
- **Blocked Files**: (list from registry)
- **Task**: {{TASK_GOAL}}

## Files to Inspect
- (list the files you will read first)

## Immediate Next Step
(describe what you will do first)

## Out of Scope
(explicitly list what is NOT part of this session)
```

---

## Key Constraints

- **No broad repo scan**: Avoid searching the entire codebase. Stay in your slice.
- **No unrelated refactoring**: Do not fix linting errors, reformat code, or optimize systems outside your slice.
- **No speculative improvements**: Only implement the stated task goal.
- **No automatic conflict resolution**: If other work has left the worktree dirty, describe it but do not fix it unless it blocks your task directly.

---

## When to Escalate

Stop and ask for user confirmation if:
- Your task requires editing a blocked file (e.g., to change a type signature)
- You discover a blocker that requires a shared-file contract change
- The task goal conflicts with constraints from another slice
- You need to add new dependencies or types that affect multiple slices

---

## Handoff Template (When Stopping)

Include this in your final message when your session ends:

```
## Handoff Summary
- **Slice**: {{SLICE_NAME}}
- **Completed**: (what was done)
- **Current State**: (brief description of files after changes)
- **Next Steps**: (what the next agent should do)
- **Blockers**: (if any)
- **Verification**: (how to confirm this work is correct)
```
