import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root (two levels up from this script)
const projectRoot = path.resolve(__dirname, '../..');
const serverScript = path.join(__dirname, 'dist/index.js');

// Accept path argument or default to project root
const learnPath = process.argv[2] || projectRoot;
const resolvedPath = path.isAbsolute(learnPath) ? learnPath : path.resolve(projectRoot, learnPath);

const server = spawn('node', [serverScript, 'server'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: projectRoot
});

let requestId = 1;
let initialized = false;

// Handle stdout (MCP messages)
let buffer = '';
server.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  
  lines.forEach(line => {
    if (line.trim()) {
      try {
        const msg = JSON.parse(line);
        
        if (msg.id === 1 && msg.result) {
          console.log('✅ Server initialized:', msg.result.serverInfo.name, msg.result.serverInfo.version);
          // Send initialized notification
          const initNotify = {
            jsonrpc: '2.0',
            method: 'notifications/initialized'
          };
          server.stdin.write(JSON.stringify(initNotify) + '\n');
          initialized = true;
          
          // Now call the tool
          setTimeout(() => {
            const toolCall = {
              jsonrpc: '2.0',
              id: 2,
              method: 'tools/call',
              params: {
                name: 'auto_learn_if_needed',
                arguments: { path: resolvedPath }
              }
            };
            console.log(`\n📞 Calling auto_learn_if_needed with path: "${resolvedPath}"`);
            server.stdin.write(JSON.stringify(toolCall) + '\n');
          }, 500);
        } else if (msg.id === 2) {
          console.log('\n📤 Tool response:');
          if (msg.result) {
            console.log(JSON.stringify(msg.result, null, 2));
          } else if (msg.error) {
            console.error('❌ Error:', JSON.stringify(msg.error, null, 2));
          }
          server.kill();
          process.exit(0);
        }
      } catch (e) {
        // Ignore parse errors for non-JSON lines
      }
    }
  });
});

// Handle stderr (server logs)
server.stderr.on('data', (data) => {
  const output = data.toString();
  // Only show important messages
  if (output.includes('error') || output.includes('Error') || output.includes('✅') || output.includes('🚀')) {
    process.stderr.write(output);
  }
});

// Send initialize request
const init = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'direct-test', version: '1.0.0' }
  }
};

console.log('🚀 Starting MCP server and calling auto_learn_if_needed...\n');
server.stdin.write(JSON.stringify(init) + '\n');

// Handle any other messages
server.stdout.on('data', (data) => {
  const output = data.toString();
  // Check for any JSON responses we might have missed
  const lines = output.split('\n');
  lines.forEach(line => {
    if (line.trim() && line.startsWith('{')) {
      try {
        const msg = JSON.parse(line);
        if (msg.id === 2 && !msg.result && !msg.error) {
          // Might be a progress update or partial response
          console.log('📊 Progress:', line.substring(0, 100) + '...');
        }
      } catch (e) {
        // Not JSON
      }
    }
  });
});

// Timeout after 25 minutes (learning can take time for large codebases, server has 20 min timeout)
setTimeout(() => {
  console.log('\n⏱️  Timeout reached (25 minutes)');
  server.kill();
  process.exit(1);
}, 1500000);

