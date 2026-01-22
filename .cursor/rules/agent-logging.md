# Mandatory Agent Session Logging

You are operating under a **mandatory logging requirement**.

## Automatic Initialization

**At the start of every chat session, BEFORE processing any user requests:**

1. Detect the current git branch using: `git rev-parse --abbrev-ref HEAD`
2. Sanitize the branch name (replace `/` with `-`, remove special characters)
3. Check if a log file exists for the current session in `docs/agent-logs/`
4. If no log file exists, automatically create one using the format `{branch-name}-YYYY-MM-DD-HHMM.md`
5. Initialize the log file with session metadata (Date, Start Time, Branch, Agent Role, Workspace)
6. Set up all required sections (User Prompts, Agent Responses, Files Read, Files Modified/Created, Commands Run, Assumptions/Uncertainties/Tradeoffs)

**This initialization must happen automatically - no user prompt is required.**

For the duration of this chat session:


## What must be logged


You MUST log the following, in order:


1. Every user prompt that initiates work
2. Every agent response that contains reasoning, planning, or decisions
3. Every file you read, modify, create, or delete
4. Every command you run
5. Every assumption, uncertainty, or tradeoff you identify


## Log format

- Logs must be written in **Markdown**
- One log file per session
- Use this naming format:
```
docs/agent-logs/{branch-name}-YYYY-MM-DD-HHMM.md
```
- Branch name is detected via: `git rev-parse --abbrev-ref HEAD`
- Branch name must be sanitized: replace `/` with `-`, remove special characters

## Required structure of the log file

Each log file MUST contain the following sections:
```
# Agent Session Log

## Session Metadata
- Date:
- Start Time:
- Branch:
- Agent Role:
- Workspace:

## User Prompts

(Chronological, verbatim)

## Agent Responses

(Chronological, verbatim)
```

## Behavioral constraints

- Logging is **not optional** and must be **automatically initialized** at session start
- Logging must be **updated incrementally**, not only at the end
- If you are unsure whether something should be logged, **log it**
- If logging fails, stop work and report the failure
- **Never wait for a user prompt to start logging** - it must happen automatically

A task is considered **incomplete** unless the log is written.