#!/usr/bin/env node

/**
 * Script to capture agent logs before creating a PR
 * Usage: node scripts/capture-agent-logs.js [log-content]
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const AGENT_LOGS_FILE = 'AGENT_LOGS.md';
const timestamp = new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');

let branch = 'unknown';
let commit = 'N/A';

try {
  branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
} catch (error) {
  // Git not available or not in a repo
}

// Create logs file if it doesn't exist
if (!existsSync(AGENT_LOGS_FILE)) {
  writeFileSync(AGENT_LOGS_FILE, `# Agent Logs

This file stores agent interaction logs that are captured when creating pull requests.

---
`);
}

// Read existing content
let existingContent = '';
try {
  existingContent = readFileSync(AGENT_LOGS_FILE, 'utf-8');
} catch (error) {
  existingContent = '';
}

// Build new log entry
const logEntry = `

## Pull Request Created - ${timestamp}

**Branch:** ${branch}
**Commit:** ${commit}
${process.argv[2] ? `\n**Log Content:**\n\`\`\`\n${process.argv[2]}\n\`\`\`` : ''}

---
`;

// Write logs with new entry
writeFileSync(AGENT_LOGS_FILE, existingContent + logEntry, 'utf-8');

console.log(`✅ Agent logs captured in ${AGENT_LOGS_FILE}`);

// Clear the logs after writing (as requested)
const clearedContent = `# Agent Logs

This file stores agent interaction logs that are captured when creating pull requests.

---
`;
writeFileSync(AGENT_LOGS_FILE, clearedContent, 'utf-8');
console.log('✅ Logs cleared after capture');

