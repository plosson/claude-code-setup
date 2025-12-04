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

## Example: Docker

```dockerfile
FROM node:22-slim

RUN useradd -m claude
WORKDIR /workspace
USER claude

ENTRYPOINT ["sh", "-c", "npx claude-code-setup && exec \"$@\"", "--"]
CMD ["npx", "@anthropic-ai/claude-code"]
```

Run:
```bash
npx claude-code-setup env > .env
docker run -it --env-file .env -v $(pwd):/workspace myimage
```

## License

MIT
