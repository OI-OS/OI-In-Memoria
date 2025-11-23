import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root (two levels up from this script)
const projectRoot = path.resolve(__dirname, '../..');
const serverScript = path.join(__dirname, 'dist/index.js');

// Accept path argument or default to project root
const analyzePath = process.argv[2] || projectRoot;
const resolvedPath = path.isAbsolute(analyzePath) ? analyzePath : path.resolve(projectRoot, analyzePath);

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
                name: 'analyze_codebase',
                arguments: { 
                  path: resolvedPath,
                  includeFileContent: true
                }
              }
            };
            console.log(`\n📞 Calling analyze_codebase with path: "${resolvedPath}"`);
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
    clientInfo: { name: 'direct-analyze', version: '1.0.0' }
  }
};

console.log('🚀 Starting MCP server and calling analyze_codebase...\n');
server.stdin.write(JSON.stringify(init) + '\n');

// Timeout after 10 minutes (analysis can take time for large codebases)
setTimeout(() => {
  console.log('\n⏱️  Timeout reached (10 minutes)');
  server.kill();
  process.exit(1);
}, 600000);

