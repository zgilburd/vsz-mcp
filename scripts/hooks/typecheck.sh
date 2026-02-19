#!/usr/bin/env bash
# Post-edit hook: TypeScript type checking
# Only runs if tsconfig.json and node_modules exist (project is set up)
# Source: CLAUDE.md - "ALWAYS run tests after making code changes"

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Skip if project not yet set up
if [ ! -f "$PROJECT_ROOT/tsconfig.json" ] || [ ! -d "$PROJECT_ROOT/node_modules" ]; then
  exit 0
fi

# Only check if the edited file is in src/
FILE_PATH="${TOOL_INPUT_file_path:-${TOOL_INPUT_FILE_PATH:-}}"
if [ -n "$FILE_PATH" ] && [[ "$FILE_PATH" != */src/* ]]; then
  exit 0
fi

cd "$PROJECT_ROOT"
npx tsc --noEmit 2>&1 | tail -20 || true
