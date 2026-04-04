---
description: "Resume a website slice session from a prior agent's handoff"
argument-hint: "slice-name, prior-handoff-summary, or paste-handoff-block"
agent: "agent"
---

# Continue Website Slice Session

**Slice Registry**: `.github/agent-context/website-slices.md` (read this first)  
**When to Use**: Another agent left a handoff summary; you are resuming their work.

## Input: Prior Handoff Summary

Paste or reference the prior agent's handoff summary below. It should contain:
- Slice name
- What was completed
- Current state of files
- Next steps
- Any blockers or constraints

```
## Prior Handoff
(paste the handoff summary here)
```

---

## Your Mission

You are resuming work on an in-progress slice. Your job is to verify the prior state, understand the next steps, and continue the work with minimal context overhead.

### Quick Start

1. **Confirm the slice**: Read the prior handoff summary and verify the slice name and current state against `.github/agent-context/website-slices.md`.
2. **Inspect only the relevant files**: Do not re-scan the whole repo. Read only the files listed in the handoff or the slice definition.
3. **Verify the current state**: Confirm that the files match the description from the handoff.
4. **Identify the next immediate step**: Clarify what you will do next based on the handoff's "Next Steps" section.
5. **Continue the work**: Proceed with the task, staying within the same slice boundaries.

### Collaboration Rules

1. **Respect prior session boundaries**: The prior agent limited their changes to slice-owned files. Continue respecting those boundaries.

2. **Ignore unrelated changes**: If you find new dirty state or conflicts outside the slice, check whether it is documented in the handoff. If not documented, ignore it; do not attempt cleanup.

3. **Inherit slice ownership**: Use the same owned/blocked/shared file list from the handoff or slice registry. Do not create new exceptions.

4. **Maintain consistency**: If the prior session made architectural decisions (e.g., how to structure state, naming conventions), continue in the same style.

### Approach

1. **Restate understanding**: Summarize the prior handoff and the next steps back to the user.
2. **Verify current state**: Read the owned files and confirm they match the prior state description.
3. **Identify next action**: Clearly describe the immediate next step and how you will measure success.
4. **Execute**: Perform the work within the slice boundary.
5. **Handoff again** (if stopping): Provide a new handoff summary with updated progress.

### Output Format (First Reply)

```
## Handoff Confirmation
- **Slice**: (name)
- **Prior State**: (summary of what was completed)
- **Current File State**: (verify files match handoff description)
- **Next Steps**: (what the prior agent said to do next)

## Verification
(confirm files are in the expected state)

## Immediate Next Action
(describe the first thing you will do)

## Out of Scope
(inherited from prior session)
```

---

## Verification Checklist

Before proceeding, confirm:
- [ ] Owned files exist and contain the code described in the handoff
- [ ] Blocked files were not edited by the prior session (random spot-check)
- [ ] No new dependencies or types were added outside the slice (unless documented)
- [ ] The task goal remains clear and achievable within the slice boundary

---

## When to Escalate

Stop and ask for user confirmation if:
- The prior handoff is ambiguous or incomplete
- The current state of files does not match the handoff description
- A new blocker has appeared that was not in the prior handoff
- You discover the task cannot be completed within the slice boundary

---

## Handoff Template (When Your Session Ends)

Include this when you stop:

```
## Handoff Summary
- **Slice**: (name)
- **Completed This Session**: (what you added)
- **Current State**: (brief description of files now)
- **Next Steps**: (what the next agent should do)
- **Blockers**: (if any)
- **Verification**: (how to confirm this work)
```

---

## Example Handoff Flow

**Prior Agent Handoff:**
```
## Handoff Summary
- **Slice**: instruction-panel
- **Completed**: Added step list component with checkbox state tracking
- **Current State**: InstructionPanel.tsx now renders step items with checked/unchecked styling
- **Next Steps**: Add hint accordion trigger and expand/collapse logic
- **Blockers**: None
- **Verification**: Verify steps render correctly and checkboxes toggle without errors
```

**Your Continuation:**
```
## Handoff Confirmation
- **Slice**: instruction-panel
- **Prior State**: Step list with checkboxes implemented and working
- **Current File State**: InstructionPanel.tsx shows step rendering code, all checkboxes functional
- **Next Steps**: Add hint accordion component

## Immediate Next Action
1. Read InstructionPanel.tsx to understand current step structure
2. Identify where to add hint accordion JSX
3. Implement accordion expand/collapse logic
4. Wire hint data from hook into accordion display
```

(Continue your work...)
```

## Handoff Summary
- **Slice**: instruction-panel
- **Completed This Session**: Implemented hint accordion with smooth expand/collapse
- **Current State**: InstructionPanel.tsx now includes steps (prior) + accordion (new)
- **Next Steps**: Add XP reward summary section below accordion
- **Blockers**: None
- **Verification**: Accordion opens/closes smoothly; hint text displays correctly
```
