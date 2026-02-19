#!/usr/bin/env bash
# Pre/post-edit hook: Scan for hardcoded secrets
# Source: CLAUDE.md - "NEVER hardcode API keys, secrets, or credentials in source files"

set -euo pipefail

FILE_PATH="${TOOL_INPUT_file_path:-${TOOL_INPUT_FILE_PATH:-}}"

# Skip if no file path or not a source file
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only scan source files
case "$FILE_PATH" in
  *.ts|*.js|*.json)
    ;;
  *)
    exit 0
    ;;
esac

# Skip config/type definition files that reference env vars by design
case "$FILE_PATH" in
  *config.ts|*verify-controller.ts|*.env*|*settings.json)
    exit 0
    ;;
esac

# Check for common secret patterns in the new content
if [ -f "$FILE_PATH" ]; then
  MATCHES=$(grep -nEi '(password|secret|api_key|apikey|token)\s*[:=]\s*["\x27][^"\x27]{4,}' "$FILE_PATH" 2>/dev/null | grep -viE '(process\.env|env\.|getenv|config\.|\.password|\.secret|\.token|type\b|interface\b|:\s*string)' || true)
  if [ -n "$MATCHES" ]; then
    echo "[SECRET-SCAN] Potential hardcoded secrets detected in $FILE_PATH:"
    echo "$MATCHES"
    echo "[SECRET-SCAN] Use environment variables instead."
  fi
fi
