# Mandatory pre-commit rules

Before creating any commit:
1. Detect the current branch using: `git rev-parse --abbrev-ref HEAD`
2. Sanitize the branch name (replace `/` with `-`, remove special characters)
3. Find all log files matching the current branch: `./docs/agent-logs/{branch-name}-*.md`
4. If matching logs exist:
   a. If `./AGENT_LOGS.md` doesn't exist, copy `./AGENT_LOGS.md.template` to `./AGENT_LOGS.md`
   b. Append the contents of ONLY the matching branch logs to `./AGENT_LOGS.md`
   c. Stage `./AGENT_LOGS.md` for commit
   d. Delete ONLY the consolidated branch logs from `./docs/agent-logs`
   e. Leave logs from other branches untouched in `./docs/agent-logs`

Before appending to any commit:
1. Detect the current branch using: `git rev-parse --abbrev-ref HEAD`
2. Sanitize the branch name (replace `/` with `-`, remove special characters)
3. Find all log files matching the current branch: `./docs/agent-logs/{branch-name}-*.md`
4. If matching logs exist:
   a. Append the contents of ONLY the matching branch logs to `./AGENT_LOGS.md`
   b. Stage `./AGENT_LOGS.md` for commit
   c. Delete ONLY the consolidated branch logs from `./docs/agent-logs`
   d. Leave logs from other branches untouched in `./docs/agent-logs`

