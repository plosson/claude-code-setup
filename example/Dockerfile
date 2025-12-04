FROM node:22-slim

RUN useradd -m -s /bin/bash claude
WORKDIR /workspace
RUN chown claude:claude /workspace

USER claude

ENTRYPOINT ["sh", "-c", "npx -y claude-code-setup && exec \"$@\"", "--"]
CMD ["npx", "-y", "@anthropic-ai/claude-code", "-p", "Say 'Claude Code is working!' and nothing else"]
