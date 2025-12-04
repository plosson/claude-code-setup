#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found"
    echo ""
    echo "Create it with:"
    echo "  npx claude-code-setup env > example/.env"
    exit 1
fi

docker build -t claude-code-example "$SCRIPT_DIR"
docker run -it --rm --env-file "$ENV_FILE" -v "$(pwd):/workspace" claude-code-example "$@"
