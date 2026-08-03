---
name: "coordenador-edital-fit"
description: "Faz o subagente coordenador-de-pesquisa avaliar se um edital de fomento real vale a pena perseguir do ponto de vista da instituição — cruza a extração literal do Regulamento/Anexos com sinal informal/de relacionamento que o USUÁRIO fornecer sobre o financiador (nunca inventado) e com a agenda estratégica de pesquisa do instituto, devolvendo um veredito (perseguir / não perseguir / perseguir com ressalvas) em docs/edital-fit/. Use quando a intenção for 'quero saber se este edital realmente serve aos interesses do nosso instituto, além do que está escrito'. Para criar o checklist de submissão de um edital já decidido, use /fundraiser-submission-timeline — este comando é sobre DECIDIR se vale perseguir, não sobre como preencher."
argument-hint: "<pasta-de-referência-do-edital> — ex.: ref/finep-digital/"
compatibility: "Requires .claude/agents/coordenador-de-pesquisa.md e uma pasta com os PDFs do Regulamento/Anexos do edital"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/coordenador-edital-fit/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando não escreve nem submete nada — o entregável é um parecer de
oportunidade em `docs/edital-fit/`. Zero invenção: toda extração do
Regulamento tem âncora de item; todo sinal informal é atribuído
explicitamente ao usuário e datado, nunca apresentado como fato do agente.

## Passo 0 — Garantir a agenda institucional (bootstrap)

Rode `find docs/persona -maxdepth 1 -name 'coordenador-instituto.html'`. Se
ausente, siga o mesmo bootstrap do Passo 0 de `coordenador-test/SKILL.md`
(pergunta via `AskUserQuestion`, cria o doc canônico) antes de prosseguir —
sem essa agenda, não há contra o que confrontar o edital. Se já existir,
siga direto ao Passo 1.

## Passo 1 — Ingestão

1. Se `$ARGUMENTS` já traz a pasta de referência, use-a direto. Senão, rode
   `ls ref/` — as subpastas de `ref/` são o local canônico dos PDFs de
   edital; se houver uma candidata óbvia, confirme com o usuário via
   `AskUserQuestion`; senão, pergunte o caminho direto.
2. Rode `ls` na pasta de referência para listar os PDFs disponíveis
   (Regulamento, Anexos, histórico de edições anteriores se houver).
3. Se a pasta não existir ou estiver vazia, informe isso ao usuário e pare
   — não há o que avaliar ainda.

## Passo 2 — Extração literal

Leia o Regulamento e os Anexos **por completo** (`Read` com `pages`,
paginando conforme necessário) e extraia, cada afirmação com a âncora do
item de origem:

- Órgão financiador, programa, linhas temáticas nomeadas (nome oficial de
  cada uma, não só o rótulo I/II/III).
- Prioridades declaradas do edital — o que ele diz explicitamente estar
  buscando (tipo de proponente, tipo de projeto, impacto esperado).
- Histórico do financiador com este tipo de edital, se os documentos
  mencionarem (edições anteriores, valores historicamente aprovados).
- Valores mínimo/máximo, percentual de contrapartida, prazo máximo de
  execução — dados que pesam na análise de capacidade/viabilidade.

Marque `[?]` em qualquer ponto que o documento-fonte não esclarece — nunca
inventar.

## Passo 3 — Coleta de sinal informal (o passo central deste comando)

Pergunte via `AskUserQuestion` (texto livre): **"Você tem algum
conhecimento de bastidor sobre este financiador — contatos, conversas em
eventos, edições anteriores que participou, sinais informais sobre o que
eles realmente priorizam além do texto do edital?"**

- Se o usuário responder com algo substantivo, registre-o literalmente como
  **"informação informal fornecida por você em `<data via date -u
  +%Y-%m-%d>`"** — nunca reformule como se fosse conhecimento do agente.
- Se o usuário não tiver nada, marque `[sem sinal informal disponível]` e
  siga adiante — este passo nunca bloqueia o parecer, só o deixa mais ou
  menos informado (e o documento final declara isso explicitamente).

## Passo 4 — Confronto com a agenda institucional

Leia `docs/persona/coordenador-instituto.html` § "Interesses estratégicos
de pesquisa" e § "Critérios de aprovação/risco institucional" — essa é a
fonte de verdade da agenda do instituto para este parecer.

## Passo 5 — Parecer (coordenador-de-pesquisa)

Invoque o subagente `coordenador-de-pesquisa`
(`subagent_type: "coordenador-de-pesquisa"`) com um prompt que inclua:
- A extração literal do Passo 2 (com âncoras) e os caminhos dos PDFs-fonte
  para ele reconferir por conta própria.
- O sinal informal do Passo 3, exatamente como registrado (atribuído e
  datado, ou `[sem sinal informal disponível]`).
- O caminho de `docs/persona/coordenador-instituto.html`.
- Pedido explícito de veredito: **perseguir** / **não perseguir** /
  **perseguir com ressalvas**, com racional explícito cruzando os três
  insumos (texto do edital, sinal informal, agenda institucional), e
  riscos institucionais identificados (concentração, capacidade,
  reputacional).

## Passo 6 — Publicação

Com `Write`, crie `docs/edital-fit/<slug-do-edital>.html` — HTML
self-contained, mesmo esqueleto de `docs/index.html`
(`<div class="layout">` com `<nav class="toc">` + `<main>`, classes já
existentes em `docs/assets/style.css`). Estrutura de conteúdo:

1. **Cabeçalho**: nome do edital como `h1`, `.lede` com órgão financiador,
   data da avaliação, comando usado.
2. **Veredito**: destaque visual (badge) — perseguir / não perseguir /
   perseguir com ressalvas.
3. **O que o edital diz buscar**: extração literal do Passo 2, com âncoras.
4. **Sinal informal considerado**: o texto exato do Passo 3, atribuído e
   datado, ou a declaração explícita de ausência.
5. **Confronto com a agenda do instituto**: como isso se encaixa (ou não)
   nas linhas de pesquisa prioritárias e no apetite a risco de
   `coordenador-instituto.html`.
6. **Riscos institucionais**: concentração, capacidade de execução,
   reputacional.
7. **Racional do veredito**: síntese final.

Se `specs/<slug>/spec.md` já existir para este edital, adicione só uma
referência/link ao parecer — não edite o conteúdo da spec, isso é do
`product-owner`.

Adicione um card apontando para esse arquivo na seção "Outras fontes" de
`docs/index.html` (grupo `docs/edital-fit/`, criado se for o primeiro
parecer), e uma linha em `docs/persona/coordenador-instituto.html` §
"Histórico de avaliações de edital" (edital, veredito, data, link).

## Passo 7 — Reportar

```
## Parecer de oportunidade concluído (/coordenador-edital-fit)

- Edital: <órgão/programa>
- Veredito: <perseguir | não perseguir | perseguir com ressalvas>
- Sinal informal considerado: <sim, atribuído a você em <data> | nenhum disponível>
- Documento completo: docs/edital-fit/<slug>.html

Este comando não decide sozinho — é insumo para a decisão final, que é sua.
```

## Passo 8 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] `docs/persona/coordenador-instituto.html` existe (bootstrap rodou se
      era a primeira vez)
- [ ] Regulamento/Anexos lidos por completo, com âncoras de item
- [ ] Usuário foi explicitamente perguntado sobre sinal informal, resposta
      registrada com atribuição e data (ou ausência declarada)
- [ ] `coordenador-de-pesquisa` produziu veredito com racional cruzando os
      três insumos (edital, sinal informal, agenda institucional)
- [ ] `docs/edital-fit/<slug>.html` criado
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] `docs/persona/coordenador-instituto.html` § "Histórico de avaliações
      de edital" ganhou uma linha nova
- [ ] Retrospectiva rodou ao final
