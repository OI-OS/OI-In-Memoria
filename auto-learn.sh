#!/bin/bash
# Direct MCP server call to auto-learn codebase
# This script calls the OI-In-Memoria server directly without OI or brain-trust4

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.." || exit 1

node "$SCRIPT_DIR/auto-learn.js"

