---
name: "feature-start"
description: "Orquestra o fluxo completo do Spec Kit para uma feature grande/nova: specify → clarify → checklist → plan → tasks → kanban-sync, deixando as tasks prontas no quadro para /kanban-start. Use quando a intenção for 'quero começar uma feature nova que merece spec própria'."
argument-hint: "Descrição da feature nova (linguagem natural) — se vazio, pergunta no chat"
compatibility: "Requires .specify/ (Spec Kit), os subagentes product-owner/dev em .claude/agents/, e a skill kanban-sync"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/feature-start/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando é o ponto de entrada para o caminho "feature grande" descrito no
README: `speckit-specify → speckit-clarify → speckit-plan → speckit-tasks →
kanban-sync`. Para ajustes pequenos e pontuais sem spec formal, use
`/quick-task` em vez deste.

## Passo 1 — Descrição da feature

Se `$ARGUMENTS` não trouxer uma descrição clara, pergunte no chat (texto
livre): "Qual a descrição dessa feature nova?"

## Passo 2 — Spec (product-owner)

Invoque o subagente `product-owner` (tool de subagentes, `subagent_type:
"product-owner"`) com a descrição, pedindo que rode em sequência:
1. `speckit-specify` com a descrição — cria/atualiza `specs/<slug>/spec.md`.
2. `speckit-clarify` — resolve ambiguidades; não deve sobrar marcador
   `[NEEDS CLARIFICATION]`.
3. `speckit-checklist` — seu próprio gate de Definition-of-Ready.

Só considere este passo concluído quando o `product-owner` reportar a spec
limpa (clarify sem pendências, checklist passando ou com exceções
documentadas). Se ele reportar bloqueio, repasse ao usuário em vez de seguir
para o Passo 3.

## Passo 3 — Plano e tasks (dev)

Invoque o subagente `dev` (`subagent_type: "dev"`) com o caminho exato de
`specs/<slug>/spec.md` gerado no Passo 2, pedindo que rode em sequência:
1. `speckit-plan` — produz `plan.md`.
2. `speckit-tasks` — produz `tasks.md`.

## Passo 4 — Carregar no quadro

Rode **apenas a sub-rotina "Sincronização"** de `kanban-sync/SKILL.md` (a
seção `## Sincronização`, sem perguntas nem Retrospectiva própria — essa vem
só ao final deste comando) para carregar as tasks novas em `KANBAN.md`.

## Passo 5 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim, registre
a lição aprendida no arquivo de agente/skill responsável.

## Completion Report

```
## Feature iniciada via /feature-start

- Feature: specs/<slug>/ (spec.md, plan.md, tasks.md)
- Tasks geradas: N (agora em To Do no KANBAN.md)

Rode /kanban-start para começar a implementar a primeira tarefa.
```

## Done When

- [ ] `specs/<slug>/spec.md` existe, limpo em clarify/checklist
- [ ] `plan.md` e `tasks.md` existem
- [ ] `KANBAN.md` reflete as tasks novas em To Do
- [ ] Retrospectiva rodou ao final
