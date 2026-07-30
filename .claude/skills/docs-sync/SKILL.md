---
name: "docs-sync"
description: "Revisa e incrementa a documentação viva em docs/index.html (página HTML única, com seções, sem .md) com base no estado real do projeto (specs/, plan.md, código em app/, KANBAN.md) — sem inventar conteúdo além do que já existe ou foi decidido."
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

**Convenção do site (leia antes de tudo)**: `docs/` é **uma página HTML
única**, `docs/index.html` — não uma coleção de páginas por tópico e não
markdown. Cada tópico é uma `<section id="...">` dentro dela (ex.: `#fr`
Requisitos Funcionais, `#arch` Arquitetura e Tecnologias), navegável pela
sidebar vertical (`nav.toc`) que faz scroll até a seção ao clicar — não abre
outra página. CSS/JS ficam só em `docs/assets/style.css`/`script.js`,
nunca inline na página. Não existe `.md` fonte por trás — o HTML É a fonte,
editado diretamente. Exceção: `docs/communications/pitch/` e
`docs/communications/onepage/` continuam como páginas HTML próprias, fora
de `docs/index.html` (decks fechados, com CSS/JS próprios, apenas linkados
a partir da seção "Outras fontes").

## Passo 1 — Escopo

Pergunte via `AskUserQuestion` (4 opções): **"O que sincronizar em
docs/?"**
- **"Tudo"** — os 3 grupos abaixo.
- **"Só docs do product-owner"** — seções `#fr` (Requisitos Funcionais),
  `#br` (Regras de Negócio), `#sl` (Escopo e Limitações), `#nfr`
  (Requisitos Não Funcionais), `#pf` (Fluxograma de Processo).
- **"Só docs do dev"** — seções `#arch` (Arquitetura e Tecnologias), `#cd`
  (Diagrama de Classes).
- **"Só docs do qa"** — seção `#ac` (Critérios de Aceite).

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
- Liste exatamente quais `<section id="...">` de `docs/index.html` ele é
  dono e deve revisar (ver ids no Passo 1);
- Resuma o que foi encontrado no Passo 2 (ou diga explicitamente que nada
  novo foi encontrado);
- Instrua: **fundamente o conteúdo só no que foi encontrado** — nunca invente
  requisitos, arquitetura ou critérios que não existam em `specs/`, código ou
  decisões já tomadas. Se não houver nada novo para uma seção, deixe-a como
  está (o texto "a preencher" continua correto até haver conteúdo real).
- Reforce as regras abaixo.

### Regras de edição de `docs/index.html`

- **Um único arquivo**: edite a `<section>` correspondente dentro de
  `docs/index.html` — nunca crie uma página nova (`docs/<nome>/index.html`,
  `docs/<nome>.html`) nem um `.md`. Se um tópico novo surgir (ex.: uma
  segunda feature), adicione uma `<section id="...">` nova e um `<a
  href="#...">` correspondente em `nav.toc`, mantendo a ordem por grupo
  (`product-owner` → `dev` → `qa` → "Outras fontes").
- **IDs únicos**: cada `<section>`/heading com `id` precisa de um id que não
  colida com nenhum outro na página inteira — use o prefixo do tópico (ex.
  `fr-`, `br-`, `arch-`, `ac-`) em qualquer subseção interna.
- **Hierarquia de heading**: `h1` é só o título da página
  ("Documentação", já existe, não duplicar). Cada tópico é `h2`. Subseções
  de um tópico (ex.: "Feature: ...") são `h3`. Detalhes dentro de uma
  subseção (ex.: cada User Story) são `h4`.
- CSS e JS **nunca inline e nunca duplicados** — tudo vive em
  `docs/assets/style.css`/`docs/assets/script.js`, linkados uma vez no
  `<head>`/fim do `<body>` de `docs/index.html`. Só edite esses dois
  arquivos se precisar de uma regra/comportamento novo e genérico —
  reaproveite as classes já definidas (`.kicker`, `.callout`, `.badge`/
  `.badge-*`, `.story`/`.story-head`, tabelas, `.uml-class`, etc.) em vez de
  inventar novas regras.
- Seção sem conteúdo real ainda usa um `<div class="callout">` dizendo
  explicitamente "a preencher" e por quê — nunca invente conteúdo só para a
  seção não ficar vazia.
- **Atualize `nav.toc`** sempre que uma seção for criada/removida, para que
  a sidebar continue batendo 1:1 com as seções da página.

## Passo 4 — Reportar

```
## docs/ sincronizado

- Seções atualizadas: [lista de #ids com uma frase do que mudou, ou "nenhuma"]
- Continuam "a preencher" (nada novo encontrado): [lista ou "nenhuma"]
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
- [ ] Cada seção em escopo foi revisada pelo dono correto, sem conteúdo
      inventado, dentro do único `docs/index.html`, ligada aos assets
      compartilhados
- [ ] `nav.toc` reflete exatamente as seções existentes, sem ids duplicados
- [ ] Relatório de sincronização emitido
- [ ] Retrospectiva rodou ao final
