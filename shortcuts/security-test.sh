#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../app"

echo "==> bandit (SAST — OWASP Top 10, código Python)"
uv run bandit -q -r . -x ./.venv || true

echo "==> auditoria de dependências (OWASP A06:2021 — Vulnerable and Outdated Components)"
if uv audit --help &>/dev/null; then
  uv audit || true
else
  echo "uv audit indisponível nesta versão do uv ($(uv --version)) — usando pip-audit via 'uv export'."
  uv export --no-hashes -q -o /tmp/cyberblue-requirements.txt
  uv run --with pip-audit pip-audit -r /tmp/cyberblue-requirements.txt || true
fi

echo "==> manage.py check --deploy (OWASP A05:2021 — Security Misconfiguration)"
uv run manage.py check --deploy || true

echo "==> OWASP ZAP Baseline Scan (DAST — OWASP Top 10)"
if command -v docker &>/dev/null; then
  uv run manage.py runserver 0.0.0.0:8000 &>/tmp/cyberblue-django-server.log &
  SERVER_PID=$!
  trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

  READY=""
  for _ in $(seq 1 20); do
    if curl -sf -o /dev/null http://localhost:8000/admin/login/; then
      READY=1
      break
    fi
    sleep 0.5
  done

  if [ -z "$READY" ]; then
    echo "servidor de dev não respondeu a tempo — pulando o scan ZAP." >&2
  else
    mkdir -p ../docs/cybersec-report/zap
    docker run --rm --network host \
      -v "$(pwd)/../docs/cybersec-report/zap:/zap/wrk/:rw" \
      zaproxy/zap-stable zap-baseline.py \
      -t http://localhost:8000/ -r "zap-baseline-$(date +%F).html" || true
  fi
else
  echo "docker não encontrado — pulando o scan dinâmico OWASP ZAP Baseline." >&2
fi
