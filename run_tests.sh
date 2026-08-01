#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "==> shortcuts/lint.sh"
./shortcuts/lint.sh

echo "==> testes Django"
cd app && uv run manage.py test
