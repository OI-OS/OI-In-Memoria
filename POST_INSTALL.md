# Post-Installation: Auto-Learn Your Codebase

After installing OI-In-Memoria, you should run the auto-learn script to build the codebase intelligence database.

## Quick Start

```bash
# From the OI project root
cd MCP-servers/OI-In-Memoria
./auto-learn.sh [project_path]
```

**Default behavior:**
- If no path is provided, it defaults to the OI project root (`../..`)
- The script runs in the background and bypasses the 30-second MCP client timeout
- Progress is shown in real-time

## Examples

```bash
# Learn the current OI project
./auto-learn.sh

# Learn a specific project
./auto-learn.sh /path/to/your/project

# Learn from the OI project root (explicit)
./auto-learn.sh ../..
```

## What It Does

The `auto-learn.sh` script:
1. Connects directly to the In-Memoria MCP server (bypasses bt4 timeout)
2. Calls `auto_learn_if_needed` with the specified path
3. Shows real-time progress (discovery, semantic analysis, etc.)
4. Completes in 30-60 seconds for small projects, 2-5+ minutes for large projects

## Background Execution

The script runs synchronously and shows progress. For very large codebases, you can run it in the background:

```bash
nohup ./auto-learn.sh > auto-learn.log 2>&1 &
tail -f auto-learn.log
```

## Next Steps

After auto-learning completes, you can use In-Memoria tools:
- `oi "in-memoria get blueprint"` - Get project blueprint
- `oi "in-memoria analyze codebase"` - Analyze codebase
- `oi "in-memoria search codebase"` - Search codebase
- `oi "in-memoria predict approach"` - Predict coding approach

