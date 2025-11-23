#!/bin/bash
# Direct MCP server call to auto-learn codebase
# This script calls the OI-In-Memoria server directly without OI or brain-trust4
# Usage: ./auto-learn.sh [project_path]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_PATH="${1:-$SCRIPT_DIR/../..}"
cd "$SCRIPT_DIR" || exit 1

# Resolve absolute path
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Error: Path does not exist: $PROJECT_PATH"
    exit 1
fi

RESOLVED_PATH=$(cd "$PROJECT_PATH" && pwd)
echo "🚀 Starting In-Memoria auto-learn for: $RESOLVED_PATH"
echo ""

node "$SCRIPT_DIR/auto-learn.js" "$RESOLVED_PATH"

