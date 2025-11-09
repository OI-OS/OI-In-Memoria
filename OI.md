# In-Memoria MCP Server - OI OS Installation Guide

This guide provides comprehensive installation instructions for AI agents installing the In-Memoria MCP server in OI OS (Brain Trust 4) environments, as well as end-user setup instructions.

## Table of Contents

1. [AI Agent Quick Installation](#ai-agent-quick-installation)
2. [Prerequisites](#prerequisites)
3. [Full Installation Steps](#full-installation-steps)
4. [Connecting to OI OS](#connecting-to-oi-os)
5. [Creating Intent Mappings](#creating-intent-mappings)
6. [Creating Parameter Rules](#creating-parameter-rules)
7. [End User Setup](#end-user-setup)
8. [Verification & Testing](#verification--testing)
9. [Troubleshooting](#troubleshooting)
10. [Available Tools Reference](#available-tools-reference)

---

## AI Agent Quick Installation

**⚠️ For AI Agents: Use Direct Calls for Reliability**

AI agents should prefer **direct `brain-trust4 call` commands** over natural language queries for maximum reliability. Natural language commands can timeout or have parameter extraction issues. Direct calls bypass intent mapping and parameter extraction, providing consistent results.

**Example:**
```bash
# ✅ RECOMMENDED for AI agents: Direct call
./brain-trust4 call OI-In-Memoria get_project_blueprint '{"path": "."}'

# ⚠️ FALLBACK: Natural language (may timeout or fail parameter extraction)
./oi "in-memoria get project blueprint"
```

For AI agents using OI OS, execute the following commands:

```bash
# 1. Install the server
./oi install https://github.com/OI-OS/OI-In-Memoria.git

# 2. Build the project
cd MCP-servers/OI-In-Memoria
npm install
npm run build

# Note: Pre-built binaries are automatically installed via npm install.
# Rust is only needed if pre-built binaries aren't available for your platform.
# The build will skip the Rust step if Cargo is not available.

# 4. Connect the server to OI OS
cd ../../
./brain-trust4 connect OI-In-Memoria node -- "$(pwd)/MCP-servers/OI-In-Memoria/dist/index.js" server

# 4. Create intent mappings and parameter rules (single optimized transaction)
sqlite3 brain-trust4.db << 'SQL'
BEGIN TRANSACTION;

-- Intent mappings for In-Memoria MCP server (most common operations)
INSERT OR REPLACE INTO intent_mappings (keyword, server_name, tool_name, priority) VALUES 
('in-memoria get blueprint', 'in-memoria', 'get_project_blueprint', 10),
('in-memoria blueprint', 'in-memoria', 'get_project_blueprint', 10),
('in-memoria project blueprint', 'in-memoria', 'get_project_blueprint', 10),
('in-memoria analyze codebase', 'in-memoria', 'analyze_codebase', 10),
('in-memoria analyze', 'in-memoria', 'analyze_codebase', 10),
('in-memoria search codebase', 'in-memoria', 'search_codebase', 10),
('in-memoria search', 'in-memoria', 'search_codebase', 10),
('in-memoria learn', 'in-memoria', 'learn_codebase_intelligence', 10),
('in-memoria learn codebase', 'in-memoria', 'learn_codebase_intelligence', 10),
('in-memoria auto learn', 'in-memoria', 'auto_learn_if_needed', 10),
('in-memoria predict approach', 'in-memoria', 'predict_coding_approach', 10),
('in-memoria predict', 'in-memoria', 'predict_coding_approach', 10),
('in-memoria get patterns', 'in-memoria', 'get_pattern_recommendations', 10),
('in-memoria patterns', 'in-memoria', 'get_pattern_recommendations', 10),
('in-memoria semantic insights', 'in-memoria', 'get_semantic_insights', 10),
('in-memoria insights', 'in-memoria', 'get_semantic_insights', 10),
('in-memoria developer profile', 'in-memoria', 'get_developer_profile', 10),
('in-memoria profile', 'in-memoria', 'get_developer_profile', 10),
('in-memoria system status', 'in-memoria', 'get_system_status', 10),
('in-memoria status', 'in-memoria', 'get_system_status', 10),
('in-memoria health', 'in-memoria', 'health_check', 10),
('in-memoria health check', 'in-memoria', 'health_check', 10);

-- Parameter rules for In-Memoria MCP server
-- get_project_blueprint: no required fields (path is optional)
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'get_project_blueprint', 'in-memoria::get_project_blueprint', '[]',
'{"path": {"FromQuery": "in-memoria::get_project_blueprint.path"}, "includeFeatureMap": {"FromQuery": "in-memoria::get_project_blueprint.includeFeatureMap"}}', '[]');

-- analyze_codebase: path is REQUIRED
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'analyze_codebase', 'in-memoria::analyze_codebase', '["path"]',
'{"path": {"FromQuery": "in-memoria::analyze_codebase.path"}, "includeFileContent": {"FromQuery": "in-memoria::analyze_codebase.includeFileContent"}}', '[]');

-- search_codebase: query is REQUIRED
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'search_codebase', 'in-memoria::search_codebase', '["query"]',
'{"query": {"FromQuery": "in-memoria::search_codebase.query"}, "type": {"FromQuery": "in-memoria::search_codebase.type"}, "limit": {"FromQuery": "in-memoria::search_codebase.limit"}}', '[]');

-- learn_codebase_intelligence: path is REQUIRED
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'learn_codebase_intelligence', 'in-memoria::learn_codebase_intelligence', '["path"]',
'{"path": {"FromQuery": "in-memoria::learn_codebase_intelligence.path"}, "force": {"FromQuery": "in-memoria::learn_codebase_intelligence.force"}}', '[]');

-- auto_learn_if_needed: no required fields
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'auto_learn_if_needed', 'in-memoria::auto_learn_if_needed', '[]',
'{"path": {"FromQuery": "in-memoria::auto_learn_if_needed.path"}, "force": {"FromQuery": "in-memoria::auto_learn_if_needed.force"}, "skipLearning": {"FromQuery": "in-memoria::auto_learn_if_needed.skipLearning"}, "includeSetupSteps": {"FromQuery": "in-memoria::auto_learn_if_needed.includeSetupSteps"}}', '[]');

-- predict_coding_approach: problemDescription is REQUIRED
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'predict_coding_approach', 'in-memoria::predict_coding_approach', '["problemDescription"]',
'{"problemDescription": {"FromQuery": "in-memoria::predict_coding_approach.problemDescription"}, "context": {"FromQuery": "in-memoria::predict_coding_approach.context"}, "includeFileRouting": {"FromQuery": "in-memoria::predict_coding_approach.includeFileRouting"}}', '[]');

-- get_pattern_recommendations: problemDescription is REQUIRED
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'get_pattern_recommendations', 'in-memoria::get_pattern_recommendations', '["problemDescription"]',
'{"problemDescription": {"FromQuery": "in-memoria::get_pattern_recommendations.problemDescription"}, "currentFile": {"FromQuery": "in-memoria::get_pattern_recommendations.currentFile"}, "includeRelatedFiles": {"FromQuery": "in-memoria::get_pattern_recommendations.includeRelatedFiles"}}', '[]');

-- get_semantic_insights: no required fields
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'get_semantic_insights', 'in-memoria::get_semantic_insights', '[]',
'{"query": {"FromQuery": "in-memoria::get_semantic_insights.query"}, "conceptType": {"FromQuery": "in-memoria::get_semantic_insights.conceptType"}, "limit": {"FromQuery": "in-memoria::get_semantic_insights.limit"}}', '[]');

-- get_developer_profile: no required fields
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'get_developer_profile', 'in-memoria::get_developer_profile', '[]',
'{"includeRecentActivity": {"FromQuery": "in-memoria::get_developer_profile.includeRecentActivity"}, "includeWorkContext": {"FromQuery": "in-memoria::get_developer_profile.includeWorkContext"}}', '[]');

-- get_system_status: no required fields
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'get_system_status', 'in-memoria::get_system_status', '[]', '{}', '[]');

-- health_check: no required fields
INSERT OR REPLACE INTO parameter_rules (server_name, tool_name, tool_signature, required_fields, field_generators, patterns) VALUES
('in-memoria', 'health_check', 'in-memoria::health_check', '[]', '{}', '[]');

COMMIT;
SQL

# 5. Add parameter extractors to TOML (already in parameter_extractors.toml.default)
# The extractors for all In-Memoria tools are already configured
# See "Parameter Extractors" section for complete list

# 6. Verify installation
./oi list | grep in-memoria
./brain-trust4 call OI-In-Memoria get_project_blueprint '{"path": "."}'
./oi "in-memoria get blueprint"
```

---

## Prerequisites

- **Node.js 18+** - Required for running the MCP server
- **OI OS / Brain Trust 4** - The OI OS platform
- **SQLite3** - For database operations (usually pre-installed)
- **Rust 1.70+** - **Optional** (only needed if pre-built binaries aren't available)
  - Pre-built binaries are automatically installed via `npm install` for supported platforms
  - Supported platforms: `darwin-x64`, `darwin-arm64`, `linux-x64`, `win32-x64`
  - Rust is only needed if:
    - Your platform isn't supported by pre-built binaries
    - You want to build from source
    - You're developing/contributing to the project

---

## Full Installation Steps

### Step 1: Install the Server

```bash
# From your OI OS project root
./oi install https://github.com/OI-OS/OI-In-Memoria.git
```

**Note:** The `oi install` command will clone the repository and install npm dependencies, but may fail at the connection step. This is normal - proceed with manual connection.

### Step 2: Build the Project

**Note:** Pre-built binaries are automatically installed via `npm install` for supported platforms:
- `darwin-x64` (Intel Mac)
- `darwin-arm64` (Apple Silicon Mac)
- `linux-x64`
- `win32-x64`

Rust is **not required** for normal installation. The build will automatically use pre-built binaries if available.

```bash
cd MCP-servers/OI-In-Memoria
npm install
npm run build
```

If the build fails due to missing schema file, manually copy it:

```bash
mkdir -p dist/storage
cp src/storage/schema.sql dist/storage/schema.sql
```

### Step 3: Verify Installation

```bash
cd MCP-servers/OI-In-Memoria
ls -la dist/index.js
# Ensure the built file exists
```

---

## Connecting to OI OS

### Step 1: Connect the Server

From your OI OS project root:

```bash
./brain-trust4 connect OI-In-Memoria node -- "$(pwd)/MCP-servers/OI-In-Memoria/dist/index.js" server
```

**Note:** The server will automatically initialize its database on first run. The database file (`in-memoria.db`) will be created in the `MCP-servers/OI-In-Memoria/` directory.

### Step 2: Verify Connection

```bash
./oi list
# Should show "in-memoria" in the server list

./oi status OI-In-Memoria
# Should show server status and capabilities

# Test with direct call (most reliable method)
./brain-trust4 call OI-In-Memoria get_project_blueprint '{"path": "."}'
```

---

## Creating Intent Mappings

Intent mappings allow OI OS to route natural language queries to In-Memoria tools. The mappings are created in the `brain-trust4.db` database.

See the [AI Agent Quick Installation](#ai-agent-quick-installation) section for the complete SQL script to create all intent mappings.

**Key Intent Mappings:**
- `in-memoria get blueprint` → `get_project_blueprint`
- `in-memoria analyze codebase` → `analyze_codebase`
- `in-memoria search` → `search_codebase`
- `in-memoria learn` → `learn_codebase_intelligence`
- `in-memoria predict` → `predict_coding_approach`
- `in-memoria patterns` → `get_pattern_recommendations`

---

## Creating Parameter Rules

Parameter rules define required fields and extraction patterns for each tool. These are created in the `brain-trust4.db` database.

See the [AI Agent Quick Installation](#ai-agent-quick-installation) section for the complete SQL script to create all parameter rules.

**Key Parameter Rules:**
- `get_project_blueprint`: No required fields (path is optional)
- `analyze_codebase`: `path` is required
- `search_codebase`: `query` is required
- `learn_codebase_intelligence`: `path` is required
- `predict_coding_approach`: `problemDescription` is required
- `get_pattern_recommendations`: `problemDescription` is required

---

## Parameter Extractors

Parameter extractors are configured in `parameter_extractors.toml.default`. The following extractors are available for In-Memoria tools:

**Path Extractors:**
- `in-memoria::get_project_blueprint.path` - Extract file/directory path
- `in-memoria::analyze_codebase.path` - Extract path for analysis
- `in-memoria::learn_codebase_intelligence.path` - Extract path for learning
- `in-memoria::auto_learn_if_needed.path` - Extract path for auto-learning

**Query Extractors:**
- `in-memoria::search_codebase.query` - Extract search query text
- `in-memoria::get_semantic_insights.query` - Extract semantic query

**Problem Description Extractors:**
- `in-memoria::predict_coding_approach.problemDescription` - Extract problem/feature description
- `in-memoria::get_pattern_recommendations.problemDescription` - Extract pattern recommendation request

**Type and Limit Extractors:**
- `in-memoria::search_codebase.type` - Extract search type (semantic/text/pattern)
- `in-memoria::search_codebase.limit` - Extract numeric limit
- `in-memoria::get_semantic_insights.limit` - Extract limit for insights
- `in-memoria::get_semantic_insights.conceptType` - Extract concept type

**Flag Extractors:**
- `in-memoria::get_project_blueprint.includeFeatureMap` - Extract feature map flag
- `in-memoria::analyze_codebase.includeFileContent` - Extract file content flag
- `in-memoria::predict_coding_approach.includeFileRouting` - Extract file routing flag
- `in-memoria::get_pattern_recommendations.includeRelatedFiles` - Extract related files flag
- `in-memoria::get_developer_profile.includeRecentActivity` - Extract recent activity flag
- `in-memoria::get_developer_profile.includeWorkContext` - Extract work context flag
- `in-memoria::auto_learn_if_needed.includeSetupSteps` - Extract setup steps flag
- `in-memoria::learn_codebase_intelligence.force` - Extract force flag
- `in-memoria::auto_learn_if_needed.force` - Extract force flag
- `in-memoria::auto_learn_if_needed.skipLearning` - Extract skip learning flag

**Context Extractors:**
- `in-memoria::predict_coding_approach.context` - Extract context information
- `in-memoria::get_pattern_recommendations.currentFile` - Extract current file path

**Note:** All extractors are already configured in `parameter_extractors.toml.default`. No additional configuration is needed.

---

## End User Setup

### First-Time Learning

Before using In-Memoria tools, you should learn your codebase. The database will be created automatically in `MCP-servers/OI-In-Memoria/in-memoria.db`.

**Option 1: Auto-learn (Recommended)**

```bash
# Using direct MCP call (most reliable)
./brain-trust4 call OI-In-Memoria auto_learn_if_needed '{"path": "./"}'

# Or use the auto-learn script (includes 25-minute timeout)
./MCP-servers/OI-In-Memoria/auto-learn.sh
```

**Option 2: Force Learning**

```bash
./brain-trust4 call OI-In-Memoria learn_codebase_intelligence '{"path": "./", "force": true}'
```

**Important Notes:**
- Use `"./"` (with quotes) for the current directory path, not `"."` without quotes
- Learning time varies:
  - Small projects (< 50 files): 30-60 seconds
  - Medium projects (50-200 files): 2-5 minutes
  - Large projects (200+ files): 5-20 minutes
- The system has a 20-minute timeout for semantic analysis
- The database is stored in `MCP-servers/OI-In-Memoria/in-memoria.db` (not in project root)
- The system will automatically detect if learning is needed when you call other tools

### Using Natural Language Queries

After setup, you can use natural language queries:

```bash
# Get project blueprint
./oi "in-memoria get blueprint"

# Analyze a specific file
./oi "in-memoria analyze src/index.ts"

# Search codebase
./oi "in-memoria search authentication"

# Predict coding approach
./oi "in-memoria predict add password reset functionality"
```

**Database Location:**
The database file (`in-memoria.db`) is stored in the `MCP-servers/OI-In-Memoria/` directory, not in the project root. This ensures all intelligence data is centralized in the server directory.

---

## Verification & Testing

### Test 1: Check Server Connection

```bash
./oi status OI-In-Memoria
```

Should show:
- Server status: Connected
- Tools: 14
- Resources: 0
- Prompts: 0

### Test 2: Get Project Blueprint

```bash
./brain-trust4 call OI-In-Memoria get_project_blueprint '{"path": "./"}'
```

Should return project blueprint with tech stack, entry points, and learning status.

**Path Format:** Always use `"./"` (with quotes) for the current directory path in JSON arguments, not `"."` without quotes.

### Test 3: System Status

```bash
./brain-trust4 call OI-In-Memoria get_system_status '{}'
```

Should return system health information.

### Test 4: Health Check

```bash
./brain-trust4 call OI-In-Memoria health_check '{}'
```

Should verify setup and configuration.

### Test 5: Direct MCP Server Call (Without OI/Brain-Trust4)

You can call the server directly using the MCP protocol without OI or brain-trust4:

**Option 1: Using the provided shell script (recommended):**

```bash
# From project root
./MCP-servers/OI-In-Memoria/auto-learn.sh
```

**Option 2: Using Node.js directly:**

```bash
# From project root
node MCP-servers/OI-In-Memoria/auto-learn.js
```

**What it does:**
- Spawns the MCP server process directly
- Initializes MCP protocol connection
- Calls `auto_learn_if_needed` with `path: "./"`
- Waits up to 25 minutes for completion (matches 20-minute server timeout)
- Displays the result

**Important Notes:**
- Use `path: "./"` (with quotes) for current directory, not `"."`
- The server communicates via JSON-RPC 2.0 over stdio
- Responses are sent as JSON on stdout
- Server logs/errors are sent to stderr
- Learning operations can take 2-5+ minutes for large codebases
- The script is located in `MCP-servers/OI-In-Memoria/auto-learn.js` (JavaScript) and `auto-learn.sh` (shell wrapper)

---

## Troubleshooting

### Server Won't Connect

**Error:** "Server closed connection" or "Initialization failed"

**Solutions:**
1. Verify `dist/index.js` exists: `ls -la MCP-servers/OI-In-Memoria/dist/index.js`
2. Check `dist/storage/schema.sql` exists: `ls -la MCP-servers/OI-In-Memoria/dist/storage/schema.sql`
3. If schema.sql is missing, copy it: `cd MCP-servers/OI-In-Memoria && cp src/storage/schema.sql dist/storage/schema.sql`
4. Check Node.js is installed: `node --version` (should be 18+)
5. Check database initialization: Look for `in-memoria.db` in `MCP-servers/OI-In-Memoria/`

### Database Initialization Fails

**Error:** "Failed to initialize SQLite database" or "ENOENT: no such file or directory, open '.../schema.sql'"

**Solution:**
```bash
cd MCP-servers/OI-In-Memoria
mkdir -p dist/storage
cp src/storage/schema.sql dist/storage/schema.sql
```

### Tools Not Available

**Error:** "Tool not found" or tools list is empty

**Solutions:**
1. Verify server connection: `./oi status OI-In-Memoria`
2. Restart server connection: `./brain-trust4 connect OI-In-Memoria node -- "$(pwd)/MCP-servers/OI-In-Memoria/dist/index.js" server`
3. Check server logs for errors

### Learning Fails or Takes Too Long

**Error:** Learning times out or fails

**Solutions:**
1. Check codebase size - very large codebases may take longer (5-20 minutes for 200+ files)
2. Try with `force: false` first: `auto_learn_if_needed`
3. Check database permissions: Ensure write access to `MCP-servers/OI-In-Memoria/`
4. Verify database location: The database is stored in `MCP-servers/OI-In-Memoria/in-memoria.db`, not in the project root
5. Check disk space: Learning creates database files
6. For very large codebases, use `maxFiles` to limit processing:
   ```bash
   ./brain-trust4 call OI-In-Memoria learn_codebase_intelligence '{"path": "./", "maxFiles": 100}'
   ```

### Learning Timeout Errors

**Error:** "Semantic analysis timed out after 20 minutes" or "Learning process timed out"

**Solutions:**
1. For very large codebases, use `maxFiles` parameter to limit processing:
   ```bash
   ./brain-trust4 call OI-In-Memoria learn_codebase_intelligence '{"path": "./", "maxFiles": 100}'
   ```
2. Learn specific directories first, then expand:
   ```bash
   ./brain-trust4 call OI-In-Memoria learn_codebase_intelligence '{"path": "./src"}'
   ```
3. The timeout is set to 20 minutes. For extremely large projects, you may need to process in chunks.

### Native Binary Loading Errors

**Error:** "Failed to load native binary" or "Unsupported platform"

**Solutions:**
1. Verify pre-built binaries are installed:
   ```bash
   ls -la MCP-servers/OI-In-Memoria/node_modules/@in-memoria/
   ```
2. Reinstall dependencies:
   ```bash
   cd MCP-servers/OI-In-Memoria
   npm install
   ```
3. If your platform isn't supported, you can build from source (requires Rust):
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
   source "$HOME/.cargo/env"
   
   # Build from source
   cd MCP-servers/OI-In-Memoria
   npm run build
   ```

**Note:** For most users, pre-built binaries are automatically installed and Rust is not needed.

---

## Available Tools Reference

In-Memoria provides 14 tools organized into categories:

### Core Intelligence Tools (10)

1. **`get_project_blueprint`** - Get instant project context
   - **Required:** None
   - **Optional:** `path`, `includeFeatureMap`
   - **Returns:** Tech stack, entry points, architecture, learning status

2. **`analyze_codebase`** - Analyze files or directories
   - **Required:** `path`
   - **Optional:** `includeFileContent`
   - **Returns:** Language, concepts, patterns, complexity

3. **`search_codebase`** - Search code (semantic/text/pattern)
   - **Required:** `query`
   - **Optional:** `type` (semantic/text/pattern), `limit`
   - **Returns:** Scored results with context

4. **`learn_codebase_intelligence`** - Deep learning from codebase
   - **Required:** `path`
   - **Optional:** `force`
   - **Returns:** Blueprint, concepts learned, patterns discovered

5. **`auto_learn_if_needed`** - Smart auto-learning
   - **Required:** None
   - **Optional:** `path`, `force`, `skipLearning`, `includeSetupSteps`
   - **Returns:** Action taken, intelligence status, setup steps

6. **`predict_coding_approach`** - Implementation guidance
   - **Required:** `problemDescription`
   - **Optional:** `context`, `includeFileRouting`
   - **Returns:** Approach, patterns, complexity, target files

7. **`get_pattern_recommendations`** - Pattern suggestions
   - **Required:** `problemDescription`
   - **Optional:** `currentFile`, `includeRelatedFiles`
   - **Returns:** Patterns, examples, confidence, related files

8. **`get_semantic_insights`** - Query learned concepts
   - **Required:** None
   - **Optional:** `query`, `conceptType`, `limit`
   - **Returns:** Concepts, relationships, usage contexts

9. **`get_developer_profile`** - Coding style and conventions
   - **Required:** None
   - **Optional:** `includeRecentActivity`, `includeWorkContext`
   - **Returns:** Naming conventions, structural patterns, expertise

10. **`contribute_insights`** - Record architectural decisions
    - **Required:** `type`, `content`, `confidence`, `sourceAgent`
    - **Returns:** Success, insight ID

### Monitoring Tools (4)

11. **`get_system_status`** - System health check
12. **`get_intelligence_metrics`** - Concept/pattern metrics
13. **`get_performance_status`** - Performance diagnostics
14. **`health_check`** - Setup verification

**Note:** See full tool list with `./brain-trust4 tools in-memoria`

---

## Additional Resources

- **In-Memoria Repository:** https://github.com/pi22by7/In-Memoria
- **In-Memoria Documentation:** See `AGENT.md` in the repository for detailed tool usage
- **OI OS Documentation:** See `docs/` directory in your OI OS installation
- **MCP Protocol Specification:** https://modelcontextprotocol.io/

---

## Support

For issues specific to:
- **In-Memoria MCP Server:** Open an issue at https://github.com/pi22by7/In-Memoria
- **OI OS Integration:** Check OI OS documentation or repository
- **General MCP Issues:** See MCP documentation at https://modelcontextprotocol.io/

---

**Last Updated:** 2025-01-08  
**Compatible With:** OI OS / Brain Trust 4, Claude Desktop, Cursor  
**Server Version:** 0.5.8

