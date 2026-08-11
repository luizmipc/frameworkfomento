#!/usr/bin/env bash
# Deterministic backstop for three dev.md "Nunca faz" rules (force-push is
# checked separately, before this script runs) — no deleting a committed
# migration, no committing real credentials/prod config — plus the
# mandatory QA gate before Done. Checked as a diff between two refs. Used
# by both .githooks/pre-push (local) and the `guardrails` CI job, so the
# rule holds whether or not the hook is installed.
#
# Usage: check-guardrails.sh <base-ref> <head-ref>
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $(basename "$0") <base-ref> <head-ref>" >&2
  exit 2
fi

base="$1"
head="$2"
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

fail=0

# --- dev.md "Nunca faz": apagar migration já commitada ---
deleted_migrations=$(git diff --name-status "$base" "$head" \
  | awk '$1 == "D" && $2 ~ /migrations\/[0-9].*\.py$/ { print $2 }')
if [ -n "$deleted_migrations" ]; then
  echo "error: a committed migration was deleted (dev.md 'Nunca faz'):" >&2
  echo "$deleted_migrations" | sed 's/^/  /' >&2
  fail=1
fi

# --- dev.md "Nunca faz": tocar credencial/config de produção ---
# Catches the real .env (and common private-key files) landing in a commit
# — whether via `git add -f` past .gitignore or a rename/copy. Not a
# secret-content scanner (gitleaks in shortcuts/security-test.sh already
# does that, deliberately kept out of this fast/mandatory gate); this is
# narrower: it just refuses to let the credential-shaped *file* through.
credential_files=$(git diff --name-status "$base" "$head" \
  | awk '{print $NF}' \
  | grep -E '(^|/)\.env$|\.(pem|key|p12|pfx)$|(^|/)id_rsa(\.pub)?$' || true)
if [ -n "$credential_files" ]; then
  echo "error: a credential/production-config file is in this diff (dev.md 'Nunca faz'):" >&2
  echo "$credential_files" | sed 's/^/  /' >&2
  fail=1
fi

# --- QA gate before Done: a task can't flip to [x] with zero QA evidence ---
task_files=(KANBAN.md)
for f in specs/*/tasks.md; do
  [ -f "$f" ] && task_files+=("$f")
done
done_lines=$(git diff "$base" "$head" -- "${task_files[@]}" 2>/dev/null \
  | grep -E '^\+.*\[x\]' || true)
if [ -n "$done_lines" ]; then
  evidence=$(git diff --name-only "$base" "$head" \
    | grep -E 'docs/qa-report/.*\.html$|/tests\.py$' || true)
  if [ -z "$evidence" ]; then
    echo "error: a task was marked Done with no QA evidence in this diff" >&2
    echo "       (expected a docs/qa-report/*.html or a changed tests.py" >&2
    echo "       alongside it — see qa.md's mandatory gate)." >&2
    fail=1
  fi
fi

exit "$fail"
