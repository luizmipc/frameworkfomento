#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../app"
uv run ruff check --fix .
uv run ruff check .
