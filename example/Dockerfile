FROM node:22-slim

RUN useradd -m -s /bin/bash claude
WORKDIR /workspace
RUN chown claude:claude /workspace

USER claude

ENTRYPOINT ["sh", "-c", "npx -y claude-code-setup > /dev/null 2>&1 && exec \"$@\"", "--"]
CMD ["npx", "-y", "@anthropic-ai/claude-code", "-p", "Generate an ASCII art banner that says 'All Good' in a fancy style, then introduce yourself as Claude Code running in Docker in 1-2 sentences."]
