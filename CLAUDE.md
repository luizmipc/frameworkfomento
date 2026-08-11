# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Django project scaffold + deploy/security infra are in place; the actual
feature (`editais` app — listagem e kanban de editais de fomento) is
mid-build, tracked in `specs/001-manage-call-for-proposals/` (Spec Kit:
spec/plan/tasks) and `KANBAN.md`. A static, non-functional prototype of
the target UI lives in `prototype/avulsa-A001/`.

### Build/lint/test

- `./run_tests.sh` (raiz do repo) — gate obrigatório antes de todo commit:
  `shortcuts/lint.sh` (`ruff check --fix` + `ruff check` em `app/`) →
  `cd app && uv run manage.py test` → `uv run python config/tests.py`
  (self-check de segurança). Carrega `.env` primeiro, se existir.
- Rodar um teste único: `cd app && uv run manage.py test
  config.tests.<TestCase>.<method>` (hoje só `config/tests.py` existe;
  quando o app `editais` nascer, mesma forma:
  `editais.tests.<TestCase>.<method>`).
- `./shortcuts/security-test.sh` — suíte de segurança separada (gitleaks,
  bandit, semgrep, deps, trivy, django-check, zap); `--list` lista os
  nomes, argumentos posicionais rodam um subconjunto.
- Dev local: `cd app && uv run manage.py runserver`. Via Docker:
  `docker compose up` (builda do `Dockerfile`, `entrypoint.sh` roda
  `migrate` e sobe `gunicorn` como PID 1).

### Arquitetura

- Projeto Django único em `app/`: `config/` (settings, urls, wsgi/asgi,
  `middleware.py` com cabeçalhos de segurança HTTP) + SQLite em dev
  (`app/db.sqlite3`). Nenhum app de feature ainda — `editais` nasce nas
  Phases 1-2 de `specs/001-manage-call-for-proposals/tasks.md`.
- Deploy: `Dockerfile` (usuário não-root `appuser`, `HEALTHCHECK`,
  `--no-dev` para excluir ferramental de lint/segurança da imagem),
  `docker-compose.yml` (variáveis via `.env`, ver `.env.example`),
  `entrypoint.sh` (raiz do repo — `migrate` + `exec gunicorn`), CI em
  `.github/workflows/ci.yml` (roda `./run_tests.sh` em push/PR para
  `main`).
- Docs vivas em `docs/` (`index.html` como hub, mais `docs/persona/`,
  `docs/qa-report/`, `docs/cybersec-report/`, `docs/deploy-report/`,
  `docs/submissions/`); specs via Spec Kit em `specs/<slug>/`; PDFs de
  referência de editais em `ref/`. Fluxo de trabalho (`/meeting`,
  `/kanban-start`, agentes) em `.claude/skills/` e `.claude/agents/` —
  ver `Workflow.md` para o passo a passo de cada fluxo (quem faz o quê,
  com quais artefatos, e por quê) sem precisar rastrear cada skill.

## Git workflow

- Antes de todo commit, rode `./run_tests.sh` a partir da raiz do repo —
  ele linta (`shortcuts/lint.sh`: `ruff check --fix` seguido de `ruff
  check`) e roda a suíte de testes Django. Se algo for sinalizado, corrija
  antes de prosseguir — só então siga para commit e push, conforme as
  regras abaixo.
- Setup único por clone: `git config core.hooksPath .githooks` — ativa o
  hook `pre-push` versionado que bloqueia localmente force-push para
  `main`, apagar migration já commitada, e um `.env`/chave privada real
  entrando no diff (backstop determinístico do "Nunca faz" de `dev.md`,
  não só prosa). O job `guardrails` em `.github/workflows/ci.yml` (via
  `shortcuts/check-guardrails.sh`) roda a mesma checagem no CI — vale
  mesmo sem o hook instalado, e também barra marcar uma task como Done
  (`[x]` em `KANBAN.md`/`tasks.md`) sem evidência de QA
  (`docs/qa-report/*.html` ou `tests.py` no mesmo diff).
- Commit messages always follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- Every commit body ends with a trailer crediting Claude as co-author: `Co-Authored-By: Claude <noreply@anthropic.com>`. Applies to every commit in this repo, including ones made inside `/kanban-start`/`/meeting`/`/quick-task` flows, not just ones following the generic commit steps.
- After committing, push right away unless the user says otherwise.
- Exception: inside the `/kanban-start` flow (and `/quick-task`, which inherits it), don't push automatically — Passo 10 of `.claude/skills/kanban-start/SKILL.md` asks explicitly, at the end of the retrospective, whether to commit-only or commit-and-push.
- Feature work happens on a branch named after the feature's slug (same name as `specs/<slug>/`), created/switched automatically — no confirmation prompt — by `/meeting`'s "Criar spec" mode (when the feature is created) and by `/kanban-start`/`/meeting`'s "Atualizar spec" mode (whenever work resumes on that feature); see "Branch da feature (canônico)" in `.claude/skills/kanban-start/SKILL.md`. Ad-hoc (`A\d{3}`) tasks always run on `main`, regardless of which feature's bucket they're grouped under in `KANBAN.md`.
- When a feature's tasks are all Done and its branch has been pushed, `/kanban-start` offers to open a PR to `main` via `gh pr create` — always via `AskUserQuestion`, never automatically, per this agent's general PR-creation permission rules.
- When the work behind a commit went through real back-and-forth (multiple approaches tried, feedback-driven pivots, a decision later reversed), the commit body is the durable record of that trail — write it in full: what was tried, why it was abandoned or changed, what the final call was and why. Don't compress a multi-decision session into a one-line summary of only the end state; a reader of `git log` later should be able to reconstruct the reasoning, not just see the diff. This applies to the body only — the subject line stays a normal single-line Conventional Commit summary.
