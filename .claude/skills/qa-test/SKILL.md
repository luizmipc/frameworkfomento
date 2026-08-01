---
name: "qa-test"
description: "Faz o subagente qa percorrer um protótipo estático (prototype/<slug-ou-avulsa>-<ID>/) verificando, critério de aceite por critério de aceite (FR-xxx de spec.md), se o protótipo demonstra que o critério é satisfazível/verificável — devolvendo um documento de conformidade (parecer por critério, gaps estruturais) salvo em docs/qa-report/. Use quando a intenção for 'quero saber se o protótipo atual sustenta os critérios de aceite da spec'. Para testar a aplicação real já implementada, use /qa-production-test."
argument-hint: "Opcional: nome da pasta do protótipo (ex.: avulsa-A001) — se vazio, detecta/pergunta"
compatibility: "Requires prototype/*/ (protótipos estáticos gerados via kanban-sync), docs/assets/ (sistema de design compartilhado) e o subagente qa em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/qa-test/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando não escreve nem corrige nada — é uma checagem honesta de
conformidade a critérios de aceite, feita contra a evidência que o
protótipo já mostra. O resultado é um relatório; agir sobre ele (corrigir
spec, implementar, ajustar UX) é sempre um comando separado
(`/quick-task`, `/docs-sync` etc.), decidido pelo usuário depois de ler o
relatório.

## Passo 1 — Escolher o protótipo

1. Rode `find prototype -mindepth 1 -maxdepth 1 -type d` para listar os
   protótipos existentes.
2. Se `$ARGUMENTS` já nomear uma pasta existente (ex.: `avulsa-A001`), use-a
   direto.
3. Se só existir uma pasta, use-a sem perguntar.
4. Se houver mais de uma e `$ARGUMENTS` não decidir, pergunte via
   `AskUserQuestion` (até 4 opções, rotuladas com o nome da pasta, descrição
   = a linha da task correspondente em `KANBAN.md` se encontrada).

Se `prototype/` estiver vazio, informe isso ao usuário e pare — não há o
que testar ainda (protótipos nascem via `/kanban-sync` → "Criar nova
tarefa" → "Essa tarefa envolve tela/fluxo de usuário?" → "Sim").

## Passo 2 — Reunir os critérios de aceite

1. Ache a task dona do protótipo em `KANBAN.md` (procure o caminho
   `prototype/<pasta>/` nas linhas de task) — pegue a descrição completa.
2. Se a task pertencer a uma feature (`<slug>#T\d{3}`, não avulsa), leia
   `specs/<slug>/spec.md` e **liste os FR-xxx/critérios de aceite
   relevantes ao escopo deste protótipo** — não a spec inteira, só o que
   este protótipo cobre.
3. Se a task não tiver nenhum FR-xxx identificável (spec ainda não
   escrita, ou task avulsa sem critério formal), trate a descrição da task
   em `KANBAN.md` como o único critério disponível — não invente FR-xxx
   que não existem.
4. Liste os arquivos do protótipo (`index.html`, `style.css`, `script.js`
   e quaisquer outros na pasta).

## Passo 3 — Percorrer o protótipo (evidência antes do veredito)

Prefira ver o protótipo renderizado de verdade em vez de só ler o HTML. Se
ferramentas de browser (`mcp__claude-in-chrome__*`) estiverem disponíveis:
1. Carregue-as via `ToolSearch` (`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp`).
2. Abra `prototype/<pasta>/index.html` (caminho `file://` absoluto) numa
   aba nova.
3. Para cada critério do Passo 2, pergunte: "o protótipo tem os
   campos/telas/fluxo que deixam claro como esse critério seria
   exercido?" Capture screenshot de cada estado/tela relevante.
4. Anote **observações neutras por critério** (o que existe, o que falta,
   o que é ambíguo) — ainda sem veredito, isso é insumo para o Passo 4.

Se as ferramentas de browser não estiverem disponíveis, falharem depois de
2-3 tentativas, ou o protótipo não abrir, **não insista** — siga com
leitura cuidadosa de `index.html`/`style.css`/`script.js` como evidência,
e diga no relatório final que a avaliação foi por leitura de código, não
por uso ao vivo.

Lembre-se: o protótipo é declaradamente não-funcional (sem backend, sem
persistência) — um clique sem efeito real **não é, por si, uma falha de
critério**. Uma falha real aqui é **estrutural**: o critério exige um
campo/tela/estado que simplesmente não existe no protótipo, é ambíguo, ou
não há como demonstrar que seria satisfeito.

## Passo 4 — Verificação por critério (qa)

Invoque o subagente `qa` (`subagent_type: "qa"`) com um prompt que inclua:
- A lista de critérios de aceite do Passo 2 (FR-xxx + texto), caminho
  exato de `spec.md` para ele ler se quiser mais detalhe.
- O caminho da pasta do protótipo e a lista de arquivos (Passo 2.4).
- As observações da navegação (Passo 3), com a mesma ressalva de
  ao-vivo-vs-leitura-de-código.
- Instrução explícita da **lente deste comando**: isto não é um teste
  funcional (o protótipo não tem backend para rodar `uv run manage.py
  test` contra ele) — é uma checagem estrutural. Para cada critério,
  responda: o protótipo demonstra que esse critério **é satisfazível**
  (campos existem, o fluxo permite chegar lá, o estado é distinguível de
  outros estados)? Veredito por critério:
  - ✅ **passou** — o protótipo demonstra a estrutura necessária para esse
    critério (não confundir com "critério passou num teste automatizado"
    — não há teste aqui).
  - 🟡 **parcial** — parte da estrutura existe, mas algo fica ambíguo ou
    incompleto (ex.: campo existe mas não fica claro se é obrigatório).
  - 🔴 **falhou** — falta estrutura essencial para o critério (campo
    ausente, não há caminho no fluxo para chegar ao cenário, estado
    indistinguível de outro).
  - ⚪ **não aplicável** — o critério pertence a uma User Story/escopo fora
    deste protótipo específico (não é uma falha, é fora de escopo desta
    rodada).
- Instrução de honestidade: reporte só o que é observável no protótipo (ou
  lacuna clara frente ao critério escrito) — nunca invente uma falha para
  parecer mais completo, e registre também os critérios que passaram sem
  ressalva.
- O template de saída — seção **"Template do documento de relatório QA"**
  abaixo (reaproveitado por `/qa-production-test`, não duplicado).
- Peça que escreva com `Write` em
  `docs/qa-report/<pasta-do-protótipo>.html` (ex.:
  `docs/qa-report/avulsa-A001.html`) — HTML, nunca `.md`, linkando os
  assets compartilhados `../assets/style.css`/`../assets/script.js`
  (mesma convenção do resto de `docs/`, ver `docs-sync/SKILL.md`) — e que
  adicione um card apontando para esse arquivo na seção "Outras fontes" de
  `docs/index.html` (crie a seção `docs/qa-report/` como grupo se for o
  primeiro relatório de QA).

### Template do documento de relatório QA

Página HTML única por rodada de teste, no mesmo esqueleto de
`docs/index.html` (`<div class="layout">` com `<nav class="toc">` +
`<main>`), reaproveitando as classes já existentes em
`docs/assets/style.css` (`.quote`, `.kicker`, `.lede`, `.callout`,
`.badge-passed`/`.badge-medium`/`.badge-high`/`.badge-na` para veredito
por critério, `.story`/`.story-head` por critério, tabelas para o resumo
de escopo). Estrutura de conteúdo (não o HTML literal — adapte ids/âncoras
ao `nav.toc`):

1. **Cabeçalho**: título com o alvo testado como `h1` (ex.: "Conformidade
   de critérios — prototype/avulsa-A001"), uma `.lede` dizendo o que foi
   testado (protótipo ou produção), data, comando usado, e histórico de
   rodada (nº da rodada + o que mudou desde a última, mesmo padrão de
   `docs/persona/*.html`).
2. **Critérios testados**: tabela ou lista dos FR-xxx/AC em escopo nesta
   rodada, com a fonte (`spec.md`; na variante produção também `KANBAN.md`
   Done).
3. **Parecer — critério por critério**: uma `section.story` por critério,
   `.story-head` com `h3` (ex.: "FR-018 — Ignorar edital") + badge de
   veredito (`badge-passed` ✅ / `badge-medium` 🟡 / `badge-high` 🔴 /
   `badge-na` ⚪), seguido de:
   - se passou/não-aplicável: "O que foi verificado" + "Evidência" (trecho
     de teste ou descrição de screenshot);
   - se parcial/falhou: "O que aconteceu" + "Por que é um problema" +
     "Recomendação".
4. **O que funcionou bem**: breve, honesto (critérios sem ressalva).
5. **Achados fora do escopo dos critérios** *(só existe na variante
   produção de `/qa-production-test` — omita esta seção aqui)*.
6. **Para quem resolver**: uma linha por critério com problema, linkando
   `#fr-N`, roteado para `product-owner` (lacuna/ambiguidade de critério)
   ou `designer` (causa raiz visual/UX) — `qa-test` nunca roteia para
   `dev`, porque o protótipo não tem código de produção a corrigir.
7. `.page-footer` com o disclaimer padrão (ver Passo 5 abaixo).

## Passo 5 — Reportar

```
## Verificação de conformidade concluída (/qa-test)

- Protótipo testado: prototype/<pasta>/
- Critérios verificados: N (✅ X · 🟡 Y · 🔴 Z · ⚪ W)
- Documento completo: docs/qa-report/<pasta>.html

Este comando não corrige nada — se algo aqui virar trabalho, use
/quick-task ou peça ao product-owner/designer para agir sobre o parecer.
```

## Passo 6 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Protótipo a testar identificado
- [ ] Critérios de aceite relevantes (FR-xxx de `spec.md`, ou descrição da
      task se avulsa) levantados antes do teste
- [ ] Protótipo percorrido (ao vivo via browser, ou por leitura de código
      se browser não disponível) — evidência antes do veredito
- [ ] `qa` produziu `docs/qa-report/<pasta>.html` com veredito por
      critério (passou/parcial/falhou/não aplicável), evidência real e o
      que funcionou bem
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] Retrospectiva rodou ao final
