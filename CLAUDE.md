# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is a fresh scaffold — it currently contains only a README and no source code, build tooling, or dependencies. There is no established architecture, commands, or conventions to follow yet.

When code is added to this repo, update this file with:
- Build/lint/test commands (and how to run a single test)
- The high-level architecture once it exists

## Git workflow

- Commit messages always follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- After committing, push right away unless the user says otherwise.
- Exception: inside the `/kanban-start` flow (and `/quick-task`, which inherits it), don't push automatically — Passo 10 of `.claude/skills/kanban-start/SKILL.md` asks explicitly, at the end of the retrospective, whether to commit-only or commit-and-push.
