# Agent Logs Scripts

This directory contains scripts for capturing agent interaction logs when creating pull requests.

## Files

- `capture-agent-logs.sh` - Bash script for capturing logs
- `capture-agent-logs.js` - Node.js script for capturing logs

## Usage

### Automatic (via Git Hook)

The `pre-push` git hook (`.git/hooks/pre-push`) automatically captures logs when you push to create a PR. This runs automatically when you execute `git push`.

### Manual

You can manually capture logs before creating a PR:

**Using the Node.js script:**
```bash
node scripts/capture-agent-logs.js "Optional log content here"
```

**Using the Bash script:**
```bash
./scripts/capture-agent-logs.sh "Optional log content here"
```

**Using npm script:**
```bash
npm run capture-logs
```

## Log File

Logs are stored in `AGENT_LOGS.md` in the project root. Each PR creation appends a new entry with:
- Timestamp
- Branch name
- Commit hash
- Optional log content

## Clearing Logs

By default, logs are appended to the file. To clear logs after each PR, uncomment the clearing code in the script files.

