#!/usr/bin/env node

const { exportEnv, setup } = require('../lib/credentials');

const args = process.argv.slice(2);
const command = args.find(arg => !arg.startsWith('-'));
const hasForceFlag = args.includes('--force') || args.includes('-f');

if (command === 'env') {
  exportEnv();
} else if (!command) {
  setup(hasForceFlag);
} else {
  console.error(`Unknown command: ${command}`);
  console.error('');
  console.error('Usage:');
  console.error('  npx claude-code-setup env          Extract credentials to env vars (run on host)');
  console.error('  npx claude-code-setup [--force]    Generate config files from env vars (run in Docker)');
  console.error('');
  console.error('Options:');
  console.error('  --force, -f    Overwrite existing .claude.json if it exists');
  process.exit(1);
}
