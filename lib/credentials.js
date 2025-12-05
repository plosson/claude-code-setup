const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// === EXPORT MODE: Extract credentials from host ===

function getCredentialsFromKeychain() {
  try {
    const result = execSync(
      'security find-generic-password -s "Claude Code-credentials" -w',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return result.trim();
  } catch {
    return null;
  }
}

function getCredentialsFromFile() {
  const credPath = path.join(os.homedir(), '.claude', '.credentials.json');
  if (fs.existsSync(credPath)) {
    return fs.readFileSync(credPath, 'utf8');
  }
  return null;
}

function getClaudeConfig() {
  const configPath = path.join(os.homedir(), '.claude.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {
      return null;
    }
  }
  return null;
}

function parseCredentials(raw) {
  try {
    const data = JSON.parse(raw);
    const oauth = data.claudeAiOauth;
    if (!oauth) return null;
    return {
      accessToken: oauth.accessToken,
      refreshToken: oauth.refreshToken,
      expiresAt: oauth.expiresAt
    };
  } catch {
    return null;
  }
}

function exportEnv() {
  let raw = null;

  if (process.platform === 'darwin') {
    raw = getCredentialsFromKeychain();
  }
  if (!raw) {
    raw = getCredentialsFromFile();
  }
  if (!raw) {
    console.error('Error: No credentials found. Run "claude" and complete the login flow first.');
    process.exit(1);
  }

  const creds = parseCredentials(raw);
  if (!creds) {
    console.error('Error: Could not parse credentials.');
    process.exit(1);
  }

  const config = getClaudeConfig();

  const lines = [
    `CLAUDE_OAUTH_ACCESS_TOKEN=${creds.accessToken}`,
    `CLAUDE_OAUTH_REFRESH_TOKEN=${creds.refreshToken}`
    //`CLAUDE_OAUTH_EXPIRES_AT=${creds.expiresAt || 0}`
  ];

  if (config?.accountUuid) {
    lines.push(`CLAUDE_ACCOUNT_UUID=${config.accountUuid}`);
  }
  if (config?.organizationUuid) {
    lines.push(`CLAUDE_ORGANIZATION_UUID=${config.organizationUuid}`);
  }

  console.log(lines.join('\n'));
}

// === SETUP MODE: Generate config files from env vars ===

function setup(force = false) {
  const accessToken = process.env.CLAUDE_OAUTH_ACCESS_TOKEN;
  const refreshToken = process.env.CLAUDE_OAUTH_REFRESH_TOKEN;
  const expiresAt = process.env.CLAUDE_OAUTH_EXPIRES_AT || '0';

  if (!accessToken) {
    console.error('Error: CLAUDE_OAUTH_ACCESS_TOKEN is required');
    process.exit(1);
  }
  if (!refreshToken) {
    console.error('Error: CLAUDE_OAUTH_REFRESH_TOKEN is required');
    process.exit(1);
  }

  const homeDir = os.homedir();
  const claudeDir = path.join(homeDir, '.claude');

  // Create .claude directory
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Generate .credentials.json
  const credentials = {
    claudeAiOauth: {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAt, 10),
      scopes: ['user:inference'],
      subscriptionType: null
    }
  };
  const credPath = path.join(claudeDir, '.credentials.json');
  fs.writeFileSync(credPath, JSON.stringify(credentials));
  fs.chmodSync(credPath, 0o600);

  // Generate .claude.json with /workspace trusted
  const config = {
    numStartups: 1,
    installMethod: 'unknown',
    autoUpdates: false,
    hasCompletedOnboarding: true,
    lastOnboardingVersion: '2.0.58',
    projects: {
      '/workspace': {
        allowedTools: [],
        hasTrustDialogAccepted: true
      }
    }
  };
  const configPath = path.join(homeDir, '.claude.json');

  // Check if .claude.json already exists
  if (fs.existsSync(configPath) && !force) {
    console.error('Error: .claude.json already exists. Use --force or -f to overwrite.');
    process.exit(1);
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log('Claude Code setup complete.');
}

module.exports = { exportEnv, setup };
