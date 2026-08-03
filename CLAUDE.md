# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is a fresh scaffold — it currently contains only a README and no source code, build tooling, or dependencies. There is no established architecture, commands, or conventions to follow yet.

When code is added to this repo, update this file with:
- Build/lint/test commands (and how to run a single test)
- The high-level architecture once it exists

## Git workflow

- Antes de todo commit, rode `./run_tests.sh` a partir da raiz do repo —
  ele linta (`shortcuts/lint.sh`: `ruff check --fix` seguido de `ruff
  check`) e roda a suíte de testes Django. Se algo for sinalizado, corrija
  antes de prosseguir — só então siga para commit e push, conforme as
  regras abaixo.
- Commit messages always follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- Every commit body ends with a trailer crediting Claude as co-author: `Co-Authored-By: Claude <noreply@anthropic.com>`. Applies to every commit in this repo, including ones made inside `/kanban-start`/`/kanban-sync`/`/quick-task` flows, not just ones following the generic commit steps.
- After committing, push right away unless the user says otherwise.
- Exception: inside the `/kanban-start` flow (and `/quick-task`, which inherits it), don't push automatically — Passo 10 of `.claude/skills/kanban-start/SKILL.md` asks explicitly, at the end of the retrospective, whether to commit-only or commit-and-push.
- Feature work happens on a branch named after the feature's slug (same name as `specs/<slug>/`), created/switched automatically — no confirmation prompt — by `/kanban-sync`'s "Começar feature grande (spec completa)" mode (when the feature is created) and by `/kanban-start`/`/kanban-sync`'s "Atualizar spec" mode (whenever work resumes on that feature); see "Branch da feature (canônico)" in `.claude/skills/kanban-start/SKILL.md`. Ad-hoc (`A\d{3}`) tasks always run on `main`, regardless of which feature's bucket they're grouped under in `KANBAN.md`.
- When a feature's tasks are all Done and its branch has been pushed, `/kanban-start` offers to open a PR to `main` via `gh pr create` — always via `AskUserQuestion`, never automatically, per this agent's general PR-creation permission rules.
- When the work behind a commit went through real back-and-forth (multiple approaches tried, feedback-driven pivots, a decision later reversed), the commit body is the durable record of that trail — write it in full: what was tried, why it was abandoned or changed, what the final call was and why. Don't compress a multi-decision session into a one-line summary of only the end state; a reader of `git log` later should be able to reconstruct the reasoning, not just see the diff. This applies to the body only — the subject line stays a normal single-line Conventional Commit summary.
