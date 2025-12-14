#!/bin/bash

# Script to manually capture agent logs before creating a PR
# Usage: ./scripts/capture-agent-logs.sh [log-content]

AGENT_LOGS_FILE="AGENT_LOGS.md"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# Create logs file if it doesn't exist
if [ ! -f "$AGENT_LOGS_FILE" ]; then
    cat > "$AGENT_LOGS_FILE" << 'EOF'
# Agent Logs

This file stores agent interaction logs that are captured when creating pull requests.

---
EOF
fi

# Append log entry
{
    echo ""
    echo "## Pull Request Created - $TIMESTAMP"
    echo ""
    echo "**Branch:** $BRANCH"
    echo "**Commit:** $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
    
    # If log content provided as argument, include it
    if [ -n "$1" ]; then
        echo ""
        echo "**Log Content:**"
        echo '```'
        echo "$1"
        echo '```'
    fi
    
    echo ""
    echo "---"
} >> "$AGENT_LOGS_FILE"

echo "✅ Agent logs captured in $AGENT_LOGS_FILE"

# Clear the logs after writing (as requested)
cat > "$AGENT_LOGS_FILE" << 'EOF'
# Agent Logs

This file stores agent interaction logs that are captured when creating pull requests.

---
EOF
echo "✅ Logs cleared after capture"

