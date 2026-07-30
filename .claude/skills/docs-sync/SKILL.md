---
name: "docs-sync"
description: "Revisa e incrementa os arquivos vivos em docs/ com base no estado real do projeto (specs/, plan.md, código em app/, KANBAN.md) — sem inventar conteúdo além do que já existe ou foi decidido."
argument-hint: "Opcional: qual grupo sincronizar (product-owner, dev, qa) — padrão: pergunta no chat"
compatibility: "Requires docs/ (ver kanban-sync/SKILL.md, item 0) e os subagentes product-owner/dev/qa em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/docs-sync/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Se `$ARGUMENTS` já indicar claramente um grupo (`product-owner`, `dev` ou
`qa`), pule o Passo 1 e use esse grupo direto.

## Passo 1 — Escopo

Pergunte via `AskUserQuestion` (4 opções): **"O que sincronizar em
docs/?"**
- **"Tudo"** — os 3 grupos abaixo.
- **"Só docs do product-owner"** — `functional-requirements.md`,
  `non-functional-requirements.md`, `business-rules.md`,
  `scope-and-limitations.md`, `process-flowchart.md`.
- **"Só docs do dev"** — `architecture-and-tech.md`, `class-diagram.md`.
- **"Só docs do qa"** — `acceptance-criteria.md`.

## Passo 2 — Reunir a realidade atual (antes de delegar)

Para cada grupo em escopo, leia as fontes relevantes:

- **product-owner**: `specs/*/spec.md` (se existirem features), `README.md`,
  `KANBAN.md` (tarefas avulsas, notas de desvio de escopo).
- **dev**: estrutura de `app/` (`find app -name "*.py"` ou similar),
  `app/pyproject.toml`, `Dockerfile`/`docker-compose.yml` (raiz),
  `specs/*/plan.md` (se existirem).
- **qa**: seções de critérios de aceite em `specs/*/spec.md`, testes
  existentes em `app/` (`grep -rl "class.*Test\|def test_" app/`), coluna
  `## Done` de `KANBAN.md`.

Se uma fonte não existir ainda (ex.: `specs/` vazio, nenhum teste em `app/`),
isso não é erro — apenas significa que não há nada de novo para esse grupo
nesta rodada.

## Passo 3 — Delegar a atualização

Para cada grupo em escopo, invoque o subagente dono (tool de subagentes,
`subagent_type: "product-owner"` / `"dev"` / `"qa"`) com um prompt que:
- Liste exatamente quais arquivos `docs/*.md` ele é dono e deve revisar;
- Resuma o que foi encontrado no Passo 2 (ou diga explicitamente que nada
  novo foi encontrado);
- Instrua: **fundamente o conteúdo só no que foi encontrado** — nunca invente
  requisitos, arquitetura ou critérios que não existam em `specs/`, código ou
  decisões já tomadas. Se não houver nada novo para um arquivo, deixe-o como
  está (esqueleto "A preencher" continua correto até haver conteúdo real).

## Passo 4 — Reportar

```
## docs/ sincronizado

- Atualizados: [lista de arquivos com uma frase do que mudou, ou "nenhum"]
- Continuam esqueleto (nada novo encontrado): [lista ou "nenhum"]
```

## Passo 5 — Retrospectiva

Rode o mesmo procedimento canônico descrito em `kanban-start/SKILL.md`
(seção "Retrospectiva" — não duplicado aqui): pergunte via `AskUserQuestion`
se algo deu errado nesta sincronização e, se sim, registre uma lição
aprendida no arquivo de agente/skill responsável (nunca em `speckit-*`/
`.specify/`).

## Done When

- [ ] Escopo (grupo a sincronizar) determinado
- [ ] Cada grupo em escopo teve sua realidade atual levantada antes de
      delegar
- [ ] Cada arquivo `docs/*.md` em escopo foi revisado pelo dono correto, sem
      conteúdo inventado
- [ ] Relatório de sincronização emitido
- [ ] Retrospectiva rodou ao final
