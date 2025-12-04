# claude-code-setup

Export and configure Claude Code credentials for Docker/CI usage.

## Usage

### On your host machine: Export credentials

```bash
npx claude-code-setup env > .env
```

This extracts your Claude Code OAuth credentials from:
- macOS Keychain (if on macOS)
- `~/.claude/.credentials.json` (fallback)

### In Docker: Generate config files

```bash
npx claude-code-setup
```

This reads environment variables and generates:
- `~/.claude/.credentials.json` - OAuth credentials
- `~/.claude.json` - Config with `/workspace` pre-trusted

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CLAUDE_OAUTH_ACCESS_TOKEN` | Yes | OAuth access token |
| `CLAUDE_OAUTH_REFRESH_TOKEN` | Yes | OAuth refresh token |
| `CLAUDE_OAUTH_EXPIRES_AT` | No | Token expiration timestamp |

## Example

See the `example/` directory for a complete Docker setup:

```bash
# Export credentials
npx claude-code-setup env > example/.env

# Build and run
./example/run.sh
```

Or manually:

```bash
docker build -t claude-code-example example/
docker run -it --rm --env-file example/.env -v $(pwd):/workspace claude-code-example
```

## License

MIT
