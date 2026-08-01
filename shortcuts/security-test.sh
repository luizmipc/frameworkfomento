#!/usr/bin/env bash
# Suite de testes de segurança do frameworkfomento — /cybersecurity-check.
# Uso:
#   ./shortcuts/security-test.sh              roda tudo, na ordem abaixo
#   ./shortcuts/security-test.sh gitleaks trivy   roda só os testes listados
#   ./shortcuts/security-test.sh --list       lista os nomes de teste válidos
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$REPO_ROOT/app"

# Ordem deliberada: segredo vazado é o achado mais barato de checar e mais
# crítico se existir (roda primeiro, contra o repo inteiro) → SAST (código) →
# SCA (dependências/imagem) → configuração da aplicação → DAST (mais lento,
# depende de servidor + Docker + rede, roda por último).
ORDER=(gitleaks bandit semgrep deps trivy django-check zap)

usage() {
  cat <<EOF
Uso: $(basename "$0") [teste ...]

Sem argumentos, roda todos os testes nesta ordem:
  gitleaks      segredos vazados (histórico completo do git)
  bandit        SAST — código Python (app/)
  semgrep       SAST — regras OWASP Top 10 (app/)
  deps          SCA — dependências Python (uv audit / pip-audit)
  trivy         SCA + IaC — dependências e Dockerfile/docker-compose.yml
  django-check  configuração de deploy (manage.py check --deploy)
  zap           DAST — OWASP ZAP Baseline Scan contra o dev server

Passe um ou mais nomes acima para rodar só esses testes, ex.:
  $(basename "$0") gitleaks trivy
EOF
}

run_gitleaks() {
  echo "==> gitleaks (segredos vazados, inclusive em histórico do git)"
  if ! command -v docker &>/dev/null; then
    echo "docker não encontrado — pulando gitleaks." >&2
    return
  fi
  docker run --rm -v "$REPO_ROOT:/repo:ro" zricethezav/gitleaks:latest \
    detect --source /repo -v --exit-code 0 || true
}

run_bandit() {
  echo "==> bandit (SAST — OWASP Top 10, código Python)"
  (cd "$APP_DIR" && uv run bandit -q -r . -x ./.venv) || true
}

run_semgrep() {
  echo "==> semgrep (SAST — regras OWASP Top 10)"
  (cd "$APP_DIR" && uv run semgrep --config p/owasp-top-ten --error --quiet .) || true
}

run_deps() {
  echo "==> auditoria de dependências (OWASP A06:2021 — Vulnerable and Outdated Components)"
  cd "$APP_DIR"
  if uv audit --help &>/dev/null; then
    uv audit || true
  else
    echo "uv audit indisponível nesta versão do uv ($(uv --version)) — usando pip-audit via 'uv export'."
    uv export --no-hashes -q -o /tmp/cyberblue-requirements.txt
    uv run --with pip-audit pip-audit -r /tmp/cyberblue-requirements.txt || true
  fi
}

run_trivy() {
  echo "==> trivy (SCA + IaC — dependências e Dockerfile/docker-compose.yml)"
  if ! command -v docker &>/dev/null; then
    echo "docker não encontrado — pulando trivy." >&2
    return
  fi
  docker run --rm -v "$REPO_ROOT:/repo:ro" aquasec/trivy:latest \
    fs --scanners vuln,misconfig /repo || true
}

run_django_check() {
  echo "==> manage.py check --deploy (OWASP A05:2021 — Security Misconfiguration)"
  (cd "$APP_DIR" && uv run manage.py check --deploy) || true
}

run_zap() {
  echo "==> OWASP ZAP Baseline Scan (DAST — OWASP Top 10)"
  if ! command -v docker &>/dev/null; then
    echo "docker não encontrado — pulando o scan dinâmico OWASP ZAP Baseline." >&2
    return
  fi

  (cd "$APP_DIR" && uv run manage.py runserver 0.0.0.0:8000) &>/tmp/cyberblue-django-server.log &
  local server_pid=$!
  trap 'kill "$server_pid" 2>/dev/null || true' RETURN

  local ready=""
  for _ in $(seq 1 20); do
    if curl -sf -o /dev/null http://localhost:8000/admin/login/; then
      ready=1
      break
    fi
    sleep 0.5
  done

  if [ -z "$ready" ]; then
    echo "servidor de dev não respondeu a tempo — pulando o scan ZAP." >&2
    return
  fi

  mkdir -p "$REPO_ROOT/docs/cybersec-report/zap"
  docker run --rm --network host \
    -v "$REPO_ROOT/docs/cybersec-report/zap:/zap/wrk/:rw" \
    zaproxy/zap-stable zap-baseline.py \
    -t http://localhost:8000/ -r "zap-baseline-$(date +%F).html" || true
}

if [ "${1:-}" = "--list" ] || [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if [ "$#" -eq 0 ]; then
  SELECTED=("${ORDER[@]}")
else
  for name in "$@"; do
    valid=""
    for candidate in "${ORDER[@]}"; do
      [ "$name" = "$candidate" ] && valid=1 && break
    done
    if [ -z "$valid" ]; then
      echo "Teste desconhecido: '$name'" >&2
      usage >&2
      exit 1
    fi
  done
  SELECTED=("$@")
fi

for test_name in "${ORDER[@]}"; do
  for selected in "${SELECTED[@]}"; do
    if [ "$test_name" = "$selected" ]; then
      "run_${test_name//-/_}"
      break
    fi
  done
done
