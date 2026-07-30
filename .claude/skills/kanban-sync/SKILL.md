---
name: "kanban-sync"
description: "Reunião de scrum: sincroniza o quadro Kanban local (KANBAN.md) a partir dos checkboxes de todos os specs/*/tasks.md, ou cria uma nova tarefa avulsa (descrita manualmente ou extraída das dores de um teste de persona em docs/persona/) e a aloca no quadro."
argument-hint: "Opcional: slug/caminho de uma feature para sincronizar só ela, ou a descrição de uma tarefa nova a criar"
compatibility: "Requires specs/*/tasks.md no formato gerado por speckit-tasks, e docs/ (ver item 0 do plano de implementação)"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/kanban-sync/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Esta é a "reunião de scrum": ou uma sincronização de acompanhamento do quadro
real de tasks, ou a criação de uma tarefa nova avulsa. Nunca dispara sozinha
por inferência do modelo — só quando o usuário digitar `/kanban-sync`.

**Duas formas de usar este arquivo:**
- **Ritual completo** (`/kanban-sync` chamado pelo usuário, ou por
  `/quick-task`/`/feature-start`): Passo 0 → um dos dois Modos → termina em
  Retrospectiva. Faz a pergunta de tipo de reunião e a checagem de escopo.
- **Sub-rotina "Sincronização"** (usada internamente por `/kanban-start` e
  `/quick-task` só para atualizar `KANBAN.md` a partir de `tasks.md`, sem
  ritual): rode **apenas** a seção `## Sincronização` abaixo — sem Passo 0,
  sem checagem de escopo, sem Retrospectiva. Quem invocar deve pedir
  explicitamente só essa sub-rotina, não o "modo Acompanhamento" inteiro.

## Passo 0 — Tipo de reunião

Pergunte via `AskUserQuestion` (2 opções): **"Que tipo de reunião de scrum é
essa?"**
- **"Acompanhamento"** — sincronizar o quadro a partir do estado real das
  tasks.
- **"Criar nova tarefa"** — descrever uma tarefa nova e alocá-la no quadro.

Se `$ARGUMENTS` já contiver claramente uma descrição de tarefa nova (frase em
linguagem natural, não um slug/caminho existente), pule esta pergunta e siga
direto para o modo "Criar nova tarefa" com essa descrição.

## Modo "Acompanhamento"

1. Rode a **Sincronização** (seção abaixo).
2. Antes de escrever `KANBAN.md`, releia as seções `#sl` e `#fr` de
   `docs/index.html`. Se ainda estiverem no texto inicial ("A preencher"),
   não há nada para comparar — siga sem checagem. Caso contrário, avalie
   (por julgamento, não regra determinística) se alguma task reconciliada
   parece ter saído do escopo documentado. Se sim, rode a **Checagem de
   escopo** antes de continuar.
3. Escreva `KANBAN.md` e reporte contagens/anomalias.
4. Rode a **Retrospectiva**.

## Modo "Criar nova tarefa"

1. **Origem da(s) descrição(ões)**:
   - Se `$ARGUMENTS` já trouxer a descrição da tarefa em linguagem natural,
     pule a pergunta abaixo — origem é "manual", uma única descrição, use
     `$ARGUMENTS` como texto.
   - Caso contrário, pergunte via `AskUserQuestion` (2 opções): **"Como você
     quer criar essa tarefa nova?"**
     - **"Descrever manualmente"** (Recomendado) — pergunte no chat (texto
       livre): "Qual a descrição dessa tarefa nova?". Uma única descrição.
     - **"A partir de um teste de persona (docs/persona/)"** — rode a
       sub-rotina **Origem: docs/persona/** (abaixo); ela devolve uma lista
       de uma ou mais descrições (uma por dor escolhida).
   - Repita os passos 2 a 6 abaixo **para cada descrição** da lista resultante,
     na ordem, antes de seguir ao passo 7 (uma única Sincronização/Retrospectiva
     no final, mesmo que várias tarefas tenham sido criadas).
2. **Checagem de escopo**: releia as seções `#sl` e `#fr` de
   `docs/index.html`. Se ainda estiverem no texto inicial ("A preencher"),
   siga sem checagem. Caso contrário, avalie se a descrição parece não bater
   com o que está documentado (ex.: menciona um tipo de integração, edital ou
   funcionalidade que os docs listam como fora de escopo). Se sim, rode a
   **Checagem de escopo** (abaixo) antes de prosseguir.
3. Descubra as features existentes: `find specs -mindepth 1 -maxdepth 1 -type d`
   (pode não existir nenhuma ainda). Pergunte via `AskUserQuestion` (até 4
   opções): **"Onde alocar essa tarefa?"** — uma opção por feature existente
   (rotulada com o slug), mais uma opção fixa **"Tarefa avulsa (sem
   feature)"**. Se houver mais de 3 features, mostre as 3 primeiras + a opção
   fixa de avulsa (o usuário pode digitar outro slug via "Other").
4. Gere o próximo ID avulso: leia `KANBAN.md` (se existir), encontre o maior
   `A\d{3}` já usado, e use o próximo (`A001` se nenhum existir). IDs `A\d{3}`
   nunca colidem com `T\d{3}` (gerados por `speckit-tasks`) — são namespaces
   diferentes.
5. Adicione a tarefa à seção `## To Do` de `KANBAN.md`, sob a feature
   escolhida (ou sob `### (avulsas)` se "sem feature"). Tarefas `A\d{3}` não
   têm `tasks.md` correspondente — existem só em `KANBAN.md` (ver formato em
   `KANBAN.md` — Formato, e nota em `docs/index.html` (seção `#arch`) se
   relevante).
6. Pergunte via `AskUserQuestion` (2 opções): **"Essa tarefa envolve
   tela/fluxo de usuário?"**
   - **"Sim"** — acione o subagente `designer` (tool de subagentes,
     `subagent_type: "designer"`) pedindo a criação de um protótipo estático
     em `prototype/<slug-ou-avulsa>-<ID>/` com `index.html`, `style.css` e
     `script.js` (HTML/CSS/JS puro, sem framework, sem lógica real, com um
     comentário no topo do HTML identificando-o como protótipo
     não-funcional), refletindo a descrição da tarefa. Registre o caminho do
     protótipo junto da linha da task em `KANBAN.md`.
   - **"Não"** — pule esta etapa.
7. Rode a **Sincronização** (para também atualizar as tasks reais de
   `specs/*/tasks.md`, preservando a(s) tarefa(s) avulsa(s) recém-criada(s)).
8. Rode a **Retrospectiva**.

## Origem: docs/persona/

Sub-rotina do Modo "Criar nova tarefa" (passo 1) — transforma dores
documentadas em `docs/persona/*.html` (geradas por `/fundraiser-test` ou
`/fundraiser-production-test`) em uma ou mais descrições de tarefa avulsa.
Não corrige nada nem edita o arquivo de persona — só lê.

1. Liste os arquivos: `find docs/persona -maxdepth 1 -name '*.html'`. Se
   nenhum existir, informe "Nenhum teste de persona encontrado em
   docs/persona/ ainda — rode /fundraiser-test ou /fundraiser-production-test
   primeiro." e volte à pergunta do passo 1 do Modo "Criar nova tarefa" (o
   usuário escolhe manual ou desiste).
2. Se houver mais de um arquivo, pergunte via `AskUserQuestion` (até 4
   opções, rotuladas pelo nome do arquivo sem extensão) qual usar. Se houver
   só um, use-o direto sem perguntar.
3. Leia o arquivo escolhido e extraia cada dor da seção `#dores` (um
   `<section class="story" id="dor-N">` por dor, com título em `<h3>` e o
   texto de "Por que é um problema"). Se existir uma seção "Para quem
   resolver" (`#resolver`), use-a para já saber o dono provável de cada dor
   (`designer`, `product-owner`, `dev`).
4. Ofereça as dores via `AskUserQuestion` (`multiSelect: true`) para o
   usuário escolher quais viram tarefa — mesma paginação do Passo 2 de
   `kanban-start/SKILL.md`: até 4 por chamada (3 primeiras + "Ver mais
   dores" se houver mais de 4), rótulo = título curto da dor (`Dor N —
   <título>`), descrição = resumo de 1 frase de "Por que é um problema".
5. Para cada dor selecionada, monte a descrição da tarefa: `<título da dor>
   (via teste de persona docs/persona/<arquivo>#dor-N)` — o suficiente para
   quem for implementar abrir o link e ler o parecer completo; não copie o
   parecer inteiro para dentro do `KANBAN.md`.
6. Devolva a lista de descrições montadas ao passo 1 do Modo "Criar nova
   tarefa".

## Checagem de escopo

Informe ao usuário, em prosa, o que motivou a suspeita de desvio de escopo
(ex.: "essa tarefa parece adicionar um tipo de integração que a seção `#sl`
de `docs/index.html` lista como fora de escopo"). Depois pergunte
via `AskUserQuestion` (2 opções): **"O que você quer fazer?"**
- **"Abandonar"** — não cria a tarefa (modo criar-tarefa) ou não inclui essa
  task normalmente no quadro, deixando uma nota para discussão (modo
  acompanhamento). Não mexa em `docs/`. Pare aqui (não roda Retrospectiva
  neste caso — não houve reunião de fato concluída).
- **"Atualizar o docs e continuar"** — acione o subagente `product-owner`
  (tool de subagentes, `subagent_type: "product-owner"`) para atualizar a(s)
  seção(ões) `#sl`/`#fr` de `docs/index.html` refletindo a mudança. Depois,
  retome o fluxo normal de onde parou.

## Sincronização

1. Descubra `specs/*/tasks.md`: `find specs -mindepth 2 -maxdepth 2 -name tasks.md`.
   Se nenhum existir, trate só as tarefas avulsas já presentes em `KANBAN.md`
   (se houver) — não é erro, apenas não há features via Spec Kit ainda.
2. Leia o `KANBAN.md` anterior, se existir. Para cada task-key (`<slug>#T\d{3}`
   ou `avulsa#A\d{3}` / `<slug>#A\d{3}`), extraia sua coluna atual — é o
   `estado_anterior`, necessário para preservar In Progress e todas as tasks
   `A\d{3}` (que não têm fonte em nenhum `tasks.md`). Se `KANBAN.md` não
   existir, `estado_anterior` começa vazio.
3. Para cada `tasks.md` encontrado (respeitando um filtro de slug em
   `$ARGUMENTS`, se dado no modo Acompanhamento): leia linha a linha.
   - Detecte cabeçalhos de fase `^## Phase \d+: (.+)$` e associe a task
     seguinte a essa fase, até o próximo cabeçalho.
   - Aplique a regex `- \[([ x])\] (T\d{3}) ?(\[P\])? ?(\[US\d+\])? (.*)` a
     cada linha candidata; ignore linhas que não batam (títulos, texto
     livre, `**Checkpoint**:`).
4. Classifique cada task:
   - Com backing em `tasks.md`: `[x]` → **Done** (sempre, mesmo que estivesse
     em In Progress); `[ ]` e já em In Progress no `estado_anterior` →
     **In Progress**; `[ ]` novo → **To Do**.
   - `A\d{3}` (avulsa, sem backing): **preserva a coluna do `estado_anterior`
     sem alteração** — só muda quando `/kanban-start` (ou edição manual)
     mexer nela.
5. Detecte anomalias para reportar (não travam a sincronização):
   - Chaves em `estado_anterior` como In Progress que não aparecem mais em
     nenhum `tasks.md` desta rodada — descarte do quadro, mas reporte.
   - Tasks novas que não existiam na versão anterior de `KANBAN.md`.
6. Escreva `KANBAN.md` na raiz do repo (formato em `KANBAN.md` — Formato,
   arquivo de referência do projeto). Pegue o timestamp com
   `date -u +"%Y-%m-%dT%H:%MZ"`. Ordene features por nome de diretório
   (o prefixo `NNN-` já ordena cronologicamente); dentro de cada feature,
   preserve a ordem de `tasks.md`. Omita o cabeçalho de uma feature numa
   coluna se ela não tiver task ali.
7. Reporte:
   ```
   ## Kanban sincronizado

   - Features verificadas: N
   - To Do: X tasks | In Progress: Y | Done: Z
   - Novas tasks detectadas: [lista ou "nenhuma"]
   - In Progress descartadas (sumiram de tasks.md): [lista ou "nenhuma"]

   KANBAN.md atualizado em <caminho absoluto>.
   ```

## Retrospectiva

Procedimento canônico definido em `kanban-start/SKILL.md`, seção
"Retrospectiva" — não duplicado aqui. Pergunte da mesma forma ("Como foi essa
reunião?" em vez de "Está funcionando?") e, se houver problema reportado,
registre a lição aprendida no arquivo correto (um agente em
`.claude/agents/*.md`, ou uma das nossas skills — `kanban-sync`,
`kanban-start`, `docs-sync`, `feature-start`, `quick-task` — nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Tipo de reunião determinado (acompanhamento ou criar tarefa)
- [ ] Se "criar tarefa": origem escolhida (manual ou docs/persona/) e
      `KANBAN.md` reflete o estado atual com a(s) tarefa(s) nova(s)
      adicionada(s)
- [ ] Checagem de escopo rodou quando havia sinal de desvio, e foi respeitada
      a escolha do usuário (abandonar ou atualizar docs)
- [ ] Retrospectiva rodou e, se houve problema reportado, o arquivo correto
      foi atualizado com uma lição aprendida
