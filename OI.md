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
./brain-trust4 call in-memoria get_project_blueprint '{"path": "."}'

# ⚠️ FALLBACK: Natural language (may timeout or fail parameter extraction)
./oi "in-memoria get project blueprint"
```

For AI agents using OI OS, execute the following commands:

```bash
# 1. Install the server
./oi install https://github.com/pi22by7/In-Memoria.git

# 2. Fix missing schema file (if build failed)
cd MCP-servers/In-Memoria
mkdir -p dist/storage
cp src/storage/schema.sql dist/storage/schema.sql

# 3. Connect the server to OI OS
cd ../../
./brain-trust4 connect in-memoria node -- "$(pwd)/MCP-servers/In-Memoria/dist/index.js" server

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
```

---

## Prerequisites

- **Node.js 18+** - Required for running the MCP server
- **OI OS / Brain Trust 4** - The OI OS platform
- **SQLite3** - For database operations (usually pre-installed)
- **Optional: Rust 1.70+** - For building from source (not required for basic functionality)

---

## Full Installation Steps

### Step 1: Install the Server

```bash
# From your OI OS project root
./oi install https://github.com/pi22by7/In-Memoria.git
```

**Note:** The `oi install` command will clone the repository and install npm dependencies, but may fail at the connection step. This is normal - proceed with manual connection.

### Step 2: Fix Missing Files (if build failed)

If the build failed (e.g., Rust/Cargo not installed), you may need to manually copy the schema file:

```bash
cd MCP-servers/In-Memoria
mkdir -p dist/storage
cp src/storage/schema.sql dist/storage/schema.sql
```

### Step 3: Verify Installation

```bash
cd MCP-servers/In-Memoria
ls -la dist/index.js
# Ensure the built file exists
```

---

## Connecting to OI OS

### Step 1: Connect the Server

From your OI OS project root:

```bash
./brain-trust4 connect in-memoria node -- "$(pwd)/MCP-servers/In-Memoria/dist/index.js" server
```

**Note:** The server will automatically initialize its database on first run. The database file (`in-memoria.db`) will be created in the `MCP-servers/In-Memoria/` directory.

### Step 2: Verify Connection

```bash
./oi list
# Should show "in-memoria" in the server list

./oi status in-memoria
# Should show server status and capabilities

# Test with direct call (most reliable method)
./brain-trust4 call in-memoria get_project_blueprint '{"path": "."}'
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

## Configuring Parameter Extractors

Parameter extractors allow OI OS to automatically extract tool parameters from natural language queries.

**⚠️ CRITICAL: File Loading Priority**

OI OS loads parameter extractors from `parameter_extractors.toml.default` in the project root, **not** from `parameter_extractors.toml`. The system prioritizes the `.default` file, so patterns must be added there for them to be loaded.

### Location

Add to: `parameter_extractors.toml.default` in your OI OS project root.

### In-Memoria Parameter Extractors

Append the following patterns to `parameter_extractors.toml.default`:

```toml
# ============================================================================
# IN-MEMORIA MCP SERVER EXTRACTION PATTERNS
# ============================================================================

# Path - Extract file or directory path
"path" = "regex:(?:path|file|directory|dir)\\s+(?:is|:|=)?\\s*([\\w./-]+|[\"'][\\w./-]+[\"'])"
"in-memoria::get_project_blueprint.path" = "regex:(?:path|in|for|from)\\s+(?:is|:|=)?\\s*([\\w./-]+|[\"'][\\w./-]+[\"'])"
"in-memoria::analyze_codebase.path" = "regex:(?:analyze|check|examine|look at|path|file|directory)\\s+(?:is|:|=)?\\s*([\\w./-]+|[\"'][\\w./-]+[\"'])"
"in-memoria::learn_codebase_intelligence.path" = "regex:(?:learn|analyze|path|from|in)\\s+(?:is|:|=)?\\s*([\\w./-]+|[\"'][\\w./-]+[\"'])"
"in-memoria::auto_learn_if_needed.path" = "regex:(?:path|in|for|from)\\s+(?:is|:|=)?\\s*([\\w./-]+|[\"'][\\w./-]+[\"'])"

# Query - Extract search query
"query" = "keyword:after_query"
"in-memoria::search_codebase.query" = "transform:regex:(?:search|find|look for|query)\\s+(?:for|is|:|=)?\\s*(.+?)(?:\\s+type|\\s+limit|$)|trim"
"in-memoria::get_semantic_insights.query" = "transform:regex:(?:query|search|find|insights?)\\s+(?:for|is|:|=)?\\s*(.+?)(?:\\s+type|\\s+limit|$)|trim"

# Problem Description - Extract problem/feature description
"problemDescription" = "keyword:after_description"
"in-memoria::predict_coding_approach.problemDescription" = "transform:regex:(?:predict|approach|how|implement|add|create|build)\\s+(.+?)(?:\\s+with|\\s+context|\\s+include|$)|trim"
"in-memoria::get_pattern_recommendations.problemDescription" = "transform:regex:(?:pattern|recommend|suggest|need|want|implement|add|create)\\s+(.+?)(?:\\s+current|\\s+include|$)|trim"

# Type - Extract search type (semantic/text/pattern)
"type" = "regex:(semantic|text|pattern)"
"in-memoria::search_codebase.type" = "regex:(?:type|search type|using)\\s+(semantic|text|pattern)"

# Limit - Extract numeric limit
"limit" = "regex:\\b(\\d+)\\b"
"in-memoria::search_codebase.limit" = "regex:(?:limit|max|top)\\s+(\\d+)"
"in-memoria::get_semantic_insights.limit" = "regex:(?:limit|max|top)\\s+(\\d+)"

# Include flags - Extract boolean flags
"includeFeatureMap" = "regex:(?:include|with)\\s+feature\\s+map"
"in-memoria::get_project_blueprint.includeFeatureMap" = "regex:(?:include|with)\\s+feature\\s+map"

"includeFileContent" = "regex:(?:include|with)\\s+file\\s+content"
"in-memoria::analyze_codebase.includeFileContent" = "regex:(?:include|with)\\s+file\\s+content"

"includeFileRouting" = "regex:(?:include|with)\\s+file\\s+routing"
"in-memoria::predict_coding_approach.includeFileRouting" = "regex:(?:include|with)\\s+file\\s+routing"

"includeRelatedFiles" = "regex:(?:include|with)\\s+related\\s+files"
"in-memoria::get_pattern_recommendations.includeRelatedFiles" = "regex:(?:include|with)\\s+related\\s+files"

"includeRecentActivity" = "regex:(?:include|with)\\s+recent\\s+activity"
"in-memoria::get_developer_profile.includeRecentActivity" = "regex:(?:include|with)\\s+recent\\s+activity"

"includeWorkContext" = "regex:(?:include|with)\\s+work\\s+context"
"in-memoria::get_developer_profile.includeWorkContext" = "regex:(?:include|with)\\s+work\\s+context"

"includeSetupSteps" = "regex:(?:include|with)\\s+setup\\s+steps"
"in-memoria::auto_learn_if_needed.includeSetupSteps" = "regex:(?:include|with)\\s+setup\\s+steps"

# Force flag
"force" = "regex:(?:force|forced|yes|true)"
"in-memoria::learn_codebase_intelligence.force" = "regex:(?:force|forced|yes|true)"
"in-memoria::auto_learn_if_needed.force" = "regex:(?:force|forced|yes|true)"

# Skip learning flag
"skipLearning" = "regex:(?:skip|without)\\s+learning"
"in-memoria::auto_learn_if_needed.skipLearning" = "regex:(?:skip|without)\\s+learning"

# Current file
"currentFile" = "regex:(?:current|in|file)\\s+(?:is|:|=)?\\s*([\\w./-]+|[\"'][\\w./-]+[\"'])"
"in-memoria::get_pattern_recommendations.currentFile" = "regex:(?:current|in|file)\\s+(?:is|:|=)?\\s*([\\w./-]+|[\"'][\\w./-]+[\"'])"

# Concept type
"conceptType" = "regex:(?:concept|type)\\s+(?:is|:|=)?\\s*(\\w+)"
"in-memoria::get_semantic_insights.conceptType" = "regex:(?:concept|type)\\s+(?:is|:|=)?\\s*(\\w+)"

# Context (JSON object - complex, may need manual handling)
"context" = "keyword:after_context"
"in-memoria::predict_coding_approach.context" = "transform:regex:(?:context|with|using)\\s+(.+?)(?:\\s+include|$)|trim"
```

**Note:** These patterns have already been added to your `parameter_extractors.toml.default` file during installation. If you need to add them manually, append the above content to the file.

---

## End User Setup

### First-Time Learning

Before using In-Memoria tools, you should learn your codebase:

```bash
# Option 1: Auto-learn (recommended - smart detection)
./brain-trust4 call in-memoria auto_learn_if_needed '{"path": "."}'

# Option 2: Force learning
./brain-trust4 call in-memoria learn_codebase_intelligence '{"path": ".", "force": true}'

# Option 3: For large projects (OI OS) - limit files to avoid timeout
./brain-trust4 call in-memoria learn_codebase_intelligence '{"path": ".", "force": true, "maxFiles": 1000}'
```

**Note:** Learning takes 30-60 seconds depending on codebase size. The system will automatically detect if learning is needed when you call other tools.

**⚠️ IMPORTANT: Large Projects (OI OS Project)**
- **This project only**: The OI OS codebase is very large and learning can take 2-5+ minutes
- The `brain-trust4 call` command has a 30-second timeout, which will cause learning to fail on large projects
- **New Feature**: Use `maxFiles` parameter to limit processing (e.g., `{"maxFiles": 1000}`)
- **Workaround**: Learn smaller directories first, or run learning in background:

```bash
# Learn a specific directory (faster)
./brain-trust4 call in-memoria learn_codebase_intelligence '{"path": "MCP-servers", "force": true}'

# Or run in background to avoid timeout
nohup bash -c './brain-trust4 call in-memoria learn_codebase_intelligence '"'"'{"path": "./", "force": true}'"'"' > /tmp/in-memoria-learn.log 2>&1' &
tail -f /tmp/in-memoria-learn.log
```

- Check if learning completed: `./brain-trust4 call in-memoria get_project_blueprint '{"path": "./"}'`
- Look for `learningStatus.recommendation: "ready"` to confirm completion

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

---

## Verification & Testing

### Test 1: Check Server Connection

```bash
./oi status in-memoria
```

Should show:
- Server status: Connected
- Tools: 14
- Resources: 0
- Prompts: 0

### Test 2: Get Project Blueprint

```bash
./brain-trust4 call in-memoria get_project_blueprint '{"path": "."}'
```

Should return project blueprint with tech stack, entry points, and learning status.

### Test 3: System Status

```bash
./brain-trust4 call in-memoria get_system_status '{}'
```

Should return system health information.

### Test 4: Health Check

```bash
./brain-trust4 call in-memoria health_check '{}'
```

Should verify setup and configuration.

---

## Troubleshooting

### Server Won't Connect

**Error:** "Server closed connection" or "Initialization failed"

**Solutions:**
1. Verify `dist/index.js` exists: `ls -la MCP-servers/In-Memoria/dist/index.js`
2. Check `dist/storage/schema.sql` exists: `ls -la MCP-servers/In-Memoria/dist/storage/schema.sql`
3. If schema.sql is missing, copy it: `cp src/storage/schema.sql dist/storage/schema.sql`
4. Check Node.js is installed: `node --version` (should be 18+)
5. Check database initialization: Look for `in-memoria.db` in `MCP-servers/In-Memoria/`

### Database Initialization Fails

**Error:** "Failed to initialize SQLite database" or "ENOENT: no such file or directory, open '.../schema.sql'"

**Solution:**
```bash
cd MCP-servers/In-Memoria
mkdir -p dist/storage
cp src/storage/schema.sql dist/storage/schema.sql
```

### Tools Not Available

**Error:** "Tool not found" or tools list is empty

**Solutions:**
1. Verify server connection: `./oi status in-memoria`
2. Restart server connection: `./brain-trust4 connect in-memoria node -- "$(pwd)/MCP-servers/In-Memoria/dist/index.js" server`
3. Check server logs for errors

### Learning Fails or Takes Too Long

**Error:** Learning times out after 30 seconds or fails

**Root Cause:** The `brain-trust4 call` command has a 30-second timeout. Large codebases (like the OI OS project) can take 2-5+ minutes to learn.

**Solutions:**
1. **Use maxFiles parameter** (new feature for large projects):
   ```bash
   # Limit to first 1000 files to avoid timeout
   ./brain-trust4 call in-memoria learn_codebase_intelligence '{"path": "./", "force": true, "maxFiles": 1000}'
   
   # Or use excludePatterns to skip large directories
   ./brain-trust4 call in-memoria learn_codebase_intelligence '{"path": "./", "force": true, "excludePatterns": ["**/node_modules/**", "**/dist/**", "**/build/**"]}'
   ```

2. **Learn smaller directories first** (recommended for large projects):
   ```bash
   # Learn specific subdirectories
   ./brain-trust4 call in-memoria learn_codebase_intelligence '{"path": "MCP-servers", "force": true}'
   ./brain-trust4 call in-memoria learn_codebase_intelligence '{"path": "ID MAPPING", "force": true}'
   ```

3. **Run learning in background** to avoid timeout:
   ```bash
   nohup bash -c './brain-trust4 call in-memoria learn_codebase_intelligence '"'"'{"path": "./", "force": true}'"'"' > /tmp/in-memoria-learn.log 2>&1' &
   tail -f /tmp/in-memoria-learn.log
   ```

4. **Check if learning completed**:
   ```bash
   ./brain-trust4 call in-memoria get_project_blueprint '{"path": "./"}'
   # Look for: "recommendation": "ready" (learning complete)
   # Or: "recommendation": "learning_recommended" (still needs learning)
   ```

5. Check database permissions: Ensure write access to `MCP-servers/In-Memoria/`
6. Check disk space: Learning creates database files
7. **Note**: This is specific to very large projects like OI OS. Smaller projects typically complete within the 30-second timeout.

### Rust Build Errors (Optional)

**Error:** "spawn cargo" or "ENOENT: cargo"

**Note:** Rust/Cargo is **optional** for basic functionality. The server works with pre-compiled TypeScript. If you want full performance:

1. Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. Rebuild: `cd MCP-servers/In-Memoria && npm run build`

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

