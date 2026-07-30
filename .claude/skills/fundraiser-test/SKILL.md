---
name: "fundraiser-test"
description: "Faz o subagente fundraiser vestir a pele de um captador de recursos real e testar um protótipo estático (prototype/<slug-ou-avulsa>-<ID>/), devolvendo um documento de Persona (canvas completo + parecer/dores sobre o protótipo) salvo em docs/persona/. Use quando a intenção for 'quero saber que dores um captador de recursos sentiria usando o protótipo atual'. Para testar a aplicação real já implementada, use /fundraiser-production-test."
argument-hint: "Opcional: nome da pasta do protótipo (ex.: avulsa-A001) — se vazio, detecta/pergunta"
compatibility: "Requires prototype/*/ (protótipos estáticos gerados via kanban-sync), docs/assets/ (sistema de design compartilhado) e o subagente fundraiser em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/fundraiser-test/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando não escreve nem corrige nada — é um teste de usabilidade
honesto, feito de dentro da pele de quem vai usar o framework de verdade.
O resultado é um relatório; agir sobre ele (corrigir spec, ajustar UX,
implementar) é sempre um comando separado (`/quick-task`, `/docs-sync`
etc.), decidido pelo usuário depois de ler o relatório.

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

## Passo 2 — Reunir o contexto real da task

1. Ache a task dona do protótipo em `KANBAN.md` (procure o caminho
   `prototype/<pasta>/` nas linhas de task) — pegue a descrição completa.
2. Se a task pertencer a uma feature (`<slug>#T\d{3}`, não avulsa), leia
   `specs/<slug>/spec.md` (user stories, cenários de aceite, personas já
   levantadas) — isso é insumo, não verdade absoluta: o `fundraiser` deve
   testar essas personas/cenários contra a experiência real, não apenas
   confirmá-los.
3. Liste os arquivos do protótipo (`index.html`, `style.css`, `script.js`
   e quaisquer outros na pasta).

## Passo 3 — Percorrer o protótipo (evidência antes do julgamento)

Prefira ver o protótipo renderizado de verdade em vez de só ler o HTML —
um captador real experimenta layout, contraste e hierarquia visual, não
markup. Se ferramentas de browser (`mcp__claude-in-chrome__*`) estiverem
disponíveis:
1. Carregue-as via `ToolSearch` (`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp`).
2. Abra `prototype/<pasta>/index.html` (caminho `file://` absoluto) numa
   aba nova.
3. Tente, como um captador real tentaria, as ações que a descrição da task
   sugere (ex.: localizar editais com prazo próximo, abrir/mover um card no
   quadro, procurar onde cadastraria um edital novo). Capture screenshot de
   cada estado/tela relevante.
4. Anote **observações neutras** (o que está na tela, o que reage a clique
   e o que não reage, o que fica confuso ou escondido) — ainda sem
   julgamento de negócio, isso é insumo para o Passo 4.

Se as ferramentas de browser não estiverem disponíveis, falharem depois de
2-3 tentativas, ou o protótipo não abrir (ex.: sandbox sem acesso a
arquivo local), **não insista** — siga com leitura cuidadosa de
`index.html`/`style.css`/`script.js` como evidência, e diga no relatório
final que a avaliação foi por leitura de código, não por uso ao vivo.

Lembre-se: o comentário no topo do `index.html` já identifica o protótipo
como não-funcional — cliques que não fazem nada (sem persistência real,
sem backend) **não são uma dor** por si só; são esperados. Uma dor real é
sobre fluxo, clareza, terminologia, campos faltando ou passos que um
captador de verdade precisaria e o protótipo não deixa claro como fazer.

## Passo 4 — Persona e teste (fundraiser)

Invoque o subagente `fundraiser` (`subagent_type: "fundraiser"`) com um
prompt que inclua:
- A descrição da task (Passo 2.1) e, se houver, o resumo da spec/user
  stories/personas relevantes (Passo 2.2) — caminho exato do
  `spec.md` para ele ler se quiser mais detalhe.
- O caminho da pasta do protótipo e a lista de arquivos (Passo 2.3).
- As observações da navegação (Passo 3), se houve — screenshots descritas
  em texto ou achados de leitura de código, e se a avaliação foi ao vivo ou
  por leitura de código.
- Instrução explícita: **encarne uma persona concreta e plausível** de
  captador de recursos (não um usuário genérico) — dê um contexto real:
  tipo de organização (ONG pequena, coletivo cultural, pesquisador
  independente etc.), quantos editais acompanha hoje, o que usa atualmente
  (planilha, e-mail, grupo de WhatsApp, Trello) e por quê. Ancorado nessa
  persona, execute mentalmente 3-5 tarefas realistas com o protótipo (ex.:
  "preciso saber quais editais fecham essa semana", "acabei de descobrir
  um edital novo e quero registrá-lo antes de esquecer", "quero saber em
  que pé está cada proposta que já comecei"). Para cada tarefa, registre
  onde a persona hesitaria, erraria, ou desistiria — e por quê, na
  perspectiva dela, não na do time que construiu o protótipo.
- Instrução explícita de honestidade: **documento verdadeiro, não uma
  lista de desejos** — só reporte dores que decorrem de algo realmente
  observável no protótipo (ou de uma lacuna clara frente ao processo real
  de um edital de fomento), nunca invente friction para parecer mais
  completo. Se algo funcionou bem, diga também — um documento só de
  reclamações não é mais confiável, é menos.
- O template de saída — seção **"Template do documento de persona"**
  abaixo (o mesmo formato é reaproveitado por `/fundraiser-production-test`
  para não divergir entre os dois comandos).
- Peça que ele escreva o arquivo com `Write` em
  `docs/persona/<pasta-do-protótipo>.html` (ex.:
  `docs/persona/avulsa-A001.html`) — HTML, nunca `.md`, linkando os assets
  compartilhados `../assets/style.css`/`../assets/script.js` (mesma
  convenção do resto de `docs/`, ver `docs-sync/SKILL.md`) — e que
  adicione um card apontando para esse arquivo na seção "Outras fontes" de
  `docs/index.html` (crie a seção `docs/persona/` como grupo se for a
  primeira persona).

### Template do documento de persona

Página HTML única por pessoa testada, no mesmo esqueleto de
`docs/index.html` (`<div class="layout">` com `<nav class="toc">` +
`<main>`), reaproveitando as classes já existentes em
`docs/assets/style.css` (`.quote`, `.kicker`, `.lede`, `.callout`,
`.badge-high`/`.badge-medium`/`.badge-low` para severidade, `.story`/
`.story-head` para cada dor, tabelas para o resumo da persona). Estrutura
de conteúdo (não o HTML literal — adapte ids/âncoras ao `nav.toc`):

1. **Cabeçalho**: nome da persona como `h1`, uma citação representativa
   dela em `.quote`, e uma linha `.lede` dizendo o que foi testado
   (protótipo ou produção, data, comando usado).
2. **Quem é essa persona** (canvas): tabela ou lista com papel/cargo,
   organização (tipo/porte), quantos editais acompanha hoje, ferramentas
   que usa atualmente, nível de familiaridade técnica; depois duas listas
   — Objetivos e Frustrações atuais (as dores que ela já tinha *antes* de
   usar o que está sendo testado, para dar contexto real).
3. **Tarefas testadas**: lista numerada das 3-5 tarefas tentadas.
4. **Parecer — dores identificadas**: uma seção por dor, com badge de
   severidade (`badge-high` 🔴 / `badge-medium` 🟡 / `badge-low` 🟢), "O
   que aconteceu", "Por que é um problema" (na perspectiva da persona) e
   "Recomendação" quando houver uma óbvia.
5. **O que funcionou bem**: breve, honesto.
6. **Para quem resolver**: uma linha por dor relevante — lacuna de
   requisito → `product-owner`; UX/visual → `designer`; ambos quando for o
   caso.

## Passo 5 — Reportar

```
## Teste de usabilidade concluído (/fundraiser-test)

- Protótipo testado: prototype/<pasta>/
- Persona: <nome + uma linha de contexto>
- Dores encontradas: N (🔴 X · 🟡 Y · 🟢 Z)
- Documento completo: docs/persona/<pasta>.html

Este comando não corrige nada — se algo aqui virar trabalho, use
/quick-task (ajuste pontual) ou peça ao product-owner/designer para agir
sobre o parecer.
```

## Passo 6 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Protótipo a testar identificado
- [ ] Contexto real da task (e da spec, se houver) levantado antes do teste
- [ ] Protótipo percorrido (ao vivo via browser, ou por leitura de código
      se browser não disponível) — evidência antes do julgamento
- [ ] `fundraiser` produziu `docs/persona/<pasta>.html` com canvas de
      persona completo, dores reais (não inventadas) e o que funcionou bem
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] Retrospectiva rodou ao final
