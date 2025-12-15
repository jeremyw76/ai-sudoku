# Mandatory Agent Session Logging

You are operating under a **mandatory logging requirement**.


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
docs/agent-logs/YYYY-MM-DD-HHMM-session.md
```

## Required structure of the log file

Each log file MUST contain the following sections:
```
# Agent Session Log

## Session Metadata
- Date:
- Start Time:
- Agent Role:
- Workspace:
- User Prompts

(Chronological, verbatim)

- Agent Responses

(Chronological, verbatim)
```

## Behavioral constraints

- Logging is **not optional**
- Logging must be **updated incrementally**, not only at the end
- If you are unsure whether something should be logged, **log it**
- If logging fails, stop work and report the failure


A task is considered **incomplete** unless the log is written.