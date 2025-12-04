#!/usr/bin/env node

const { exportEnv, setup } = require('../lib/credentials');

const command = process.argv[2];

if (command === 'env') {
  exportEnv();
} else if (!command) {
  setup();
} else {
  console.error(`Unknown command: ${command}`);
  console.error('');
  console.error('Usage:');
  console.error('  npx claude-code-setup env   Extract credentials to env vars (run on host)');
  console.error('  npx claude-code-setup       Generate config files from env vars (run in Docker)');
  process.exit(1);
}
