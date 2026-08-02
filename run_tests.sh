#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Load the same .env docker-compose uses (KEY=VALUE, not shell script -
# values may contain characters like & ( ) that `source` would choke on),
# so local runs get DJANGO_DEBUG=True instead of falling back to the
# production-safe (and here, too strict) defaults.
if [ -f .env ]; then
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    export "$key=$value"
  done < .env
fi

echo "==> shortcuts/lint.sh"
./shortcuts/lint.sh

echo "==> testes Django"
cd app && uv run manage.py test
