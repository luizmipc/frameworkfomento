---
name: "kanban-sync"
description: "Reunião de scrum: sincroniza o quadro Kanban local (KANBAN.md) a partir dos checkboxes de todos os specs/*/tasks.md, cria uma nova tarefa avulsa (descrita manualmente ou extraída das dores de um teste de persona em docs/persona/) e a aloca no quadro, formaliza um gap/insight como requisito real em spec.md via product-owner, ou roda o fluxo completo do Spec Kit (specify→clarify→checklist→plan→tasks) para uma feature nova que merece spec própria."
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

Esta é a "reunião de scrum": uma sincronização de acompanhamento do quadro
real de tasks, a criação de uma tarefa nova avulsa, ou a formalização de um
gap como requisito em `spec.md`. Nunca dispara sozinha por inferência do
modelo — só quando o usuário digitar `/kanban-sync`.

**Duas formas de usar este arquivo:**
- **Ritual completo** (`/kanban-sync` chamado pelo usuário, ou por
  `/quick-task`): Passo 0 → um dos quatro Modos → termina em Retrospectiva.
  Faz a pergunta de tipo de reunião e a checagem de escopo.
- **Sub-rotina "Sincronização"** (usada internamente por `/kanban-start` e
  `/quick-task` só para atualizar `KANBAN.md` a partir de `tasks.md`, sem
  ritual): rode **apenas** a seção `## Sincronização` abaixo — sem Passo 0,
  sem checagem de escopo, sem Retrospectiva. Quem invocar deve pedir
  explicitamente só essa sub-rotina, não o "modo Acompanhamento" inteiro.

## Passo 0 — Tipo de reunião

Pergunte via `AskUserQuestion` (4 opções): **"Que tipo de reunião de scrum é
essa?"**
- **"Acompanhamento"** — sincronizar o quadro a partir do estado real das
  tasks.
- **"Criar nova tarefa"** — descrever uma tarefa nova e alocá-la no quadro.
- **"Atualizar spec"** — descrever um gap/insight (de um teste de persona,
  de observação direta do quadro, ou de qualquer outra origem) e formalizá-lo
  como requisito em `spec.md`, sem necessariamente criar task avulsa junto.
- **"Ver mais opções"** — mostra as duas opções restantes (abaixo), fora do
  limite de 4 do `AskUserQuestion`: pergunte de novo via `AskUserQuestion`
  (2 opções): **"Que tipo de reunião de scrum é essa?"**
  - **"Começar feature grande (spec completa)"** — rodar o fluxo completo do
    Spec Kit (specify→clarify→checklist→plan→tasks) para uma feature nova
    que merece spec própria, carregando as tasks geradas direto no quadro.
  - **"Reunião estratégica (coordenador de pesquisa)"** — leitura holística
    e periódica do projeto inteiro pela lente do `coordenador-de-pesquisa`
    (portfólio, alinhamento com a agenda de pesquisa do instituto, risco
    institucional/reputacional) — nível estratégico, não tático/operacional
    (isso é do modo "Acompanhamento") nem sobre uma task específica.

Se `$ARGUMENTS` já contiver claramente uma descrição de tarefa nova (frase em
linguagem natural, não um slug/caminho existente), pule esta pergunta e siga
direto para o modo "Criar nova tarefa" com essa descrição — "Atualizar spec",
"Começar feature grande (spec completa)" e "Reunião estratégica" só são
alcançados escolhendo explicitamente na pergunta, nunca por inferência do
`$ARGUMENTS` (texto livre não distingue de forma confiável um ajuste pequeno
de uma feature grande ou de uma leitura estratégica).

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

## Modo "Atualizar spec"

Formaliza um gap ou insight como requisito real em `spec.md` — o mesmo
movimento que rodar `product-owner` manualmente para transformar uma dor de
persona ou um pedido direto em FR/User Story, só que como caminho suportado
do `/kanban-sync` em vez de uma ação avulsa.

1. Se `$ARGUMENTS` não trouxer a descrição do gap, pergunte no chat (texto
   livre): "Qual o gap ou insight que deve virar requisito formal? Descreva
   o que motivou (teste de persona, observação direta, pedido do usuário
   etc.) e o comportamento esperado."
2. Descubra as features existentes: `find specs -mindepth 1 -maxdepth 1 -type d`.
   - Nenhuma: informe que ainda não há `spec.md` (rode `/speckit-specify`
     primeiro) e pare — não há o que atualizar.
   - Uma: use-a direto.
   - Mais de uma: pergunte via `AskUserQuestion` (até 4 opções, rotuladas
     pelo slug) qual `spec.md` atualizar.
3. Rode o procedimento canônico **Branch da feature** de
   `kanban-start/SKILL.md` (seção "Branch da feature (canônico)"), com alvo
   o slug resolvido no passo anterior — troca automática, sem perguntar.
4. Acione o subagente `product-owner` (`subagent_type: "product-owner"`)
   com: a descrição do gap, o caminho exato de `spec.md` e `docs/index.html`,
   e instrução para decidir a forma certa de formalizar — novo FR isolado,
   extensão de um FR existente, ou nova User Story, critério dele, mas
   documentando brevemente a decisão no próprio texto do requisito — mantendo
   o padrão de numeração/estilo já usado no arquivo, e sincronizando
   `docs/index.html`. Reforce explicitamente: **não** deve tocar
   `tasks.md`/`KANBAN.md`/`plan.md` nem nada em `prototype/`/`app/` — isso é
   decisão separada, do passo 5 abaixo.
5. Quando o `product-owner` terminar, pergunte via `AskUserQuestion`
   (2 opções): **"Requisito formalizado em spec.md. Criar já uma tarefa
   avulsa para isso (protótipo e/ou lembrete de implementação)?"**
   - **"Sim"** — vá para o **Modo "Criar nova tarefa"**, a partir do passo 2
     (a origem já está resolvida: "manual", com uma descrição que referencia
     o FR/User Story recém-formalizado; o passo 2 de lá já troca de volta
     para `main` automaticamente, mesmo que este modo tenha deixado o branch
     na feature no passo 3 acima). Ao terminar aquele modo, não rode a
     Retrospectiva de novo — ela já roda uma vez só, no passo 6 abaixo.
   - **"Não"** — siga direto ao passo 6.
6. Rode a **Retrospectiva**.

## Modo "Começar feature grande (spec completa)"

Fluxo completo do Spec Kit para uma feature nova que merece spec própria:
specify → clarify → checklist → plan → tasks, carregando as tasks geradas
direto no quadro. Equivalente ao antigo `/feature-start`, agora como um
caminho suportado do `/kanban-sync` em vez de comando próprio.

1. Se `$ARGUMENTS` não trouxer uma descrição clara da feature, pergunte no
   chat (texto livre): "Qual a descrição dessa feature nova?"
2. Acione o subagente `product-owner` (`subagent_type: "product-owner"`) com
   a descrição, pedindo que rode em sequência:
   - `speckit-specify` com a descrição — cria/atualiza
     `specs/<slug>/spec.md`.
   - `speckit-clarify` — resolve ambiguidades; não deve sobrar marcador
     `[NEEDS CLARIFICATION]`.
   - `speckit-checklist` — seu próprio gate de Definition-of-Ready.

   Só considere este passo concluído quando o `product-owner` reportar a
   spec limpa (clarify sem pendências, checklist passando ou com exceções
   documentadas). Se ele reportar bloqueio, repasse ao usuário e **pare
   aqui** — não rode Sincronização nem Retrospectiva (a reunião não chegou
   a se concluir), mesmo padrão do ramo "Abandonar" da Checagem de escopo.
3. Rode o procedimento canônico **Branch da feature** de
   `kanban-start/SKILL.md` (seção "Branch da feature (canônico)"), com alvo
   o slug gerado no passo 2 — cria o branch (ainda não existe, feature nova)
   e troca para ele, sem perguntar confirmação.
4. Acione o subagente `dev` (`subagent_type: "dev"`) com o caminho exato de
   `specs/<slug>/spec.md` gerado no passo 2, pedindo que rode em sequência:
   `speckit-plan` (produz `plan.md`) e `speckit-tasks` (produz `tasks.md`).
5. Rode a **Sincronização** (para carregar as tasks novas em `KANBAN.md`).
6. Rode a **Retrospectiva**.

## Modo "Reunião estratégica (coordenador de pesquisa)"

Ao contrário de todos os outros modos, este nunca cria, edita nem move
nenhuma task — é uma leitura consultiva do projeto inteiro, nunca um gate.

1. **Checagem de estado vazio**: se não existir `KANBAN.md` **e**
   `find specs -mindepth 1 -maxdepth 1 -type d` não achar nada, informe
   "Ainda não há board nem specs para uma leitura estratégica — rode
   `/kanban-sync` → Acompanhamento ou comece uma feature primeiro." e
   **pare aqui** (sem Retrospectiva — mesmo padrão do ramo "Abandonar" da
   Checagem de escopo, a reunião não chegou a acontecer).
2. **Reúna o contexto holístico** (só leitura, nenhuma edição neste passo):
   - `KANBAN.md` inteiro (todas as features/tasks, todas as colunas).
   - `docs/index.html` (`#sl`, `#fr`).
   - Cada `specs/<slug>/spec.md` existente.
   - Todos os `docs/persona/*.html` (fundraiser + coordenador), listando
     dores por severidade sem reabrir o parecer inteiro de cada um.
   - O relatório mais recente de cada tipo, se existir: `docs/qa-report/`,
     `docs/cybersec-report/`, `docs/deploy-report/`, `docs/edital-fit/`
     (mais recente por data no nome do arquivo).
   - `docs/persona/coordenador-instituto.html` § "Interesses estratégicos
     de pesquisa" — se o arquivo ainda não existir, siga o mesmo bootstrap
     do Passo 0 de `coordenador-test/SKILL.md` (pergunta via
     `AskUserQuestion`, cria o doc canônico) antes de seguir.
3. Acione o subagente `coordenador-de-pesquisa`
   (`subagent_type: "coordenador-de-pesquisa"`) com os caminhos exatos do
   passo 2 (não o conteúdo inteiro colado no prompt — o subagente lê os
   arquivos). Instrução explícita e não-negociável: **síntese estratégica,
   não replay tático** — não relitigue o estado de nenhuma task individual
   (isso é do modo "Acompanhamento"), não repita achados item a item de
   QA/segurança/deploy (isso é dos relatórios próprios, cite-os por link) —
   cruze os padrões entre eles: o portfólio ainda serve à agenda de
   pesquisa do instituto? há concentração de risco institucional/
   reputacional em alguma frente? o ritmo observado sugere um desvio de
   prioridade estratégica? Nunca bloqueia nem impede o fluxo normal do
   Kanban — é sempre consultivo, mesmo padrão de "não corrige nada, só
   reporta" do `cybersecurity-blue`/`devops`.
4. O `coordenador-de-pesquisa` escreve
   `docs/coordenador-report/<data-ISO>.html` (`date -u +"%Y-%m-%d"`, ex.:
   `docs/coordenador-report/2026-08-03.html` — mesmo formato de
   `docs/deploy-report/`/`docs/cybersec-report/`; reexecuções no mesmo dia
   sobrescrevem o arquivo do dia), mesmo esqueleto/classes de
   `docs/qa-report/*.html`/`docs/deploy-report/*.html` (achados com badge
   de severidade, seção "Para quem resolver" por achado — `product-owner`
   para desvio de agenda, `scrum-master` para reforçar gate de processo,
   `dev` nunca é dono direto de um achado estratégico). Adiciona também uma
   linha em `docs/persona/coordenador-instituto.html` § "Log de reuniões
   estratégicas" e um card em `docs/index.html` (seção "Outras fontes",
   grupo `docs/coordenador-report/`, criado se for a primeira reunião).
5. Rode a **Retrospectiva**.

## Modo "Criar nova tarefa"

1. **Origem da(s) descrição(ões)**:
   - Se `$ARGUMENTS` já trouxer a descrição da tarefa em linguagem natural,
     pule a pergunta abaixo — origem é "manual", uma única descrição, use
     `$ARGUMENTS` como texto.
   - Caso contrário, pergunte via `AskUserQuestion` (2 opções): **"Como você
     quer criar essa tarefa nova?"**
     - **"Descrever manualmente"** (Recomendado) — pergunte no chat (texto
       livre): "Qual a descrição dessa tarefa nova?". Uma única descrição.
     - **"A partir de um relatório existente"** — pergunte via
       `AskUserQuestion` (4 opções): **"De qual relatório?"**
       - **"Teste de persona (docs/persona/)"** — rode a sub-rotina
         **Origem: docs/persona/** (abaixo); ela devolve uma lista de uma
         ou mais descrições (uma por dor escolhida).
       - **"Relatório de QA (docs/qa-report/)"** — rode a sub-rotina
         **Origem: docs/qa-report/** (abaixo); ela devolve uma lista de uma
         ou mais descrições (uma por critério/achado escolhido).
       - **"Achados de segurança (docs/cybersec-report/)"** — rode a
         sub-rotina **Origem: docs/cybersec-report/** (abaixo); ela devolve
         uma lista de uma ou mais descrições (uma por achado escolhido).
       - **"Ver mais origens"** — mostra as duas restantes, fora do limite
         de 4: pergunte de novo via `AskUserQuestion` (2 opções): **"De
         qual relatório?"**
         - **"Achados de prontidão de deploy (docs/deploy-report/)"** —
           rode a sub-rotina **Origem: docs/deploy-report/** (abaixo); ela
           devolve uma lista de uma ou mais descrições (uma por achado
           escolhido).
         - **"Reunião estratégica (docs/coordenador-report/)"** — rode a
           sub-rotina **Origem: docs/coordenador-report/** (abaixo); ela
           devolve uma lista de uma ou mais descrições (uma por achado
           escolhido).
       Se uma 6ª origem de relatório existir no futuro, pagine do mesmo
       jeito (3 primeiras + "Ver mais", igual ao Passo 2 de
       `kanban-start/SKILL.md`).
   - Repita os passos 3 a 7 abaixo **para cada descrição** da lista resultante,
     na ordem, antes de seguir ao passo 8 (uma única Sincronização/Retrospectiva
     no final, mesmo que várias tarefas tenham sido criadas).
2. Rode o procedimento canônico **Branch da feature** de
   `kanban-start/SKILL.md` (seção "Branch da feature (canônico)"), com alvo
   `main` — tarefas avulsas (`A\d{3}`) sempre rodam em `main`, mesmo quando
   alocadas sob o bucket de uma feature no `KANBAN.md` só para organização
   visual. Troca automática, sem perguntar; cobre quem entra direto neste
   modo, quem chega via Modo "Atualizar spec", e quem chega via "Origem:
   persona" de `kanban-start/SKILL.md`.
3. **Checagem de escopo**: releia as seções `#sl` e `#fr` de
   `docs/index.html`. Se ainda estiverem no texto inicial ("A preencher"),
   siga sem checagem. Caso contrário, avalie se a descrição parece não bater
   com o que está documentado (ex.: menciona um tipo de integração, edital ou
   funcionalidade que os docs listam como fora de escopo). Se sim, rode a
   **Checagem de escopo** (abaixo) antes de prosseguir.
4. Descubra as features existentes: `find specs -mindepth 1 -maxdepth 1 -type d`
   (pode não existir nenhuma ainda). Pergunte via `AskUserQuestion` (até 4
   opções): **"Onde alocar essa tarefa?"** — uma opção por feature existente
   (rotulada com o slug), mais uma opção fixa **"Tarefa avulsa (sem
   feature)"**. Se houver mais de 3 features, mostre as 3 primeiras + a opção
   fixa de avulsa (o usuário pode digitar outro slug via "Other").
5. Gere o próximo ID avulso: leia `KANBAN.md` (se existir), encontre o maior
   `A\d{3}` já usado, e use o próximo (`A001` se nenhum existir). IDs `A\d{3}`
   nunca colidem com `T\d{3}` (gerados por `speckit-tasks`) — são namespaces
   diferentes.
6. Adicione a tarefa à seção `## To Do` de `KANBAN.md`, sob a feature
   escolhida (ou sob `### (avulsas)` se "sem feature"). Tarefas `A\d{3}` não
   têm `tasks.md` correspondente — existem só em `KANBAN.md` (ver formato em
   `KANBAN.md` — Formato, e nota em `docs/index.html` (seção `#arch`) se
   relevante).
7. Antes de perguntar, cheque se a task já se refere a um protótipo
   **existente** — o caso comum é uma task originada da sub-rotina "Origem:
   docs/persona/": o protótipo correspondente é sempre
   `prototype/<mesmo-nome-do-arquivo-de-persona>/` (ex.:
   `docs/persona/avulsa-A001.html` → `prototype/avulsa-A001/`). Confirme com
   `find prototype -maxdepth 1 -type d -name '<candidato>'`.
   - **Se já existe um protótipo para esse ID base**: pule a pergunta
     Sim/Não abaixo — acione o subagente `designer`
     (`subagent_type: "designer"`) pedindo para **ajustar esse protótipo
     existente** (nunca criar uma pasta nova para a mesma tela), descrevendo
     a mudança pedida pela task. Registre o mesmo caminho já existente junto
     da linha da task em `KANBAN.md` (várias tasks podem apontar para o
     mesmo protótipo, uma por dor/ajuste).
   - **Caso contrário**, pergunte via `AskUserQuestion` (2 opções): **"Essa
     tarefa envolve tela/fluxo de usuário?"**
     - **"Sim"** — acione o `designer` pedindo a criação de um protótipo
       estático **novo** em `prototype/<slug-ou-avulsa>-<ID>/` com
       `index.html`, `style.css` e `script.js` (HTML/CSS/JS puro, sem
       framework, sem lógica real, com um comentário no topo do HTML
       identificando-o como protótipo não-funcional), refletindo a
       descrição da tarefa. Registre o caminho do protótipo junto da linha
       da task em `KANBAN.md`.
     - **"Não"** — pule esta etapa.
8. Rode a **Sincronização** (para também atualizar as tasks reais de
   `specs/*/tasks.md`, preservando a(s) tarefa(s) avulsa(s) recém-criada(s)).
9. Rode a **Retrospectiva**.

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

## Origem: docs/qa-report/

Sub-rotina do Modo "Criar nova tarefa" (passo 1) — transforma critérios de
aceite reprovados/parciais documentados em `docs/qa-report/*.html`
(gerados por `/qa-test` ou `/qa-production-test`) em uma ou mais descrições
de tarefa avulsa. Não corrige nada nem edita o arquivo de relatório — só
lê.

1. Liste os arquivos: `find docs/qa-report -maxdepth 1 -name '*.html'`. Se
   nenhum existir, informe "Nenhum relatório de QA encontrado em
   docs/qa-report/ ainda — rode /qa-test ou /qa-production-test primeiro."
   e volte à pergunta do passo 1 do Modo "Criar nova tarefa" (o usuário
   escolhe manual ou desiste).
2. Se houver mais de um arquivo, pergunte via `AskUserQuestion` (até 4
   opções, rotuladas pelo nome do arquivo sem extensão) qual usar. Se
   houver só um, use-o direto sem perguntar.
3. Leia o arquivo escolhido e extraia cada critério com veredito 🔴 falhou
   ou 🟡 parcial da seção "Parecer — critério por critério" (um
   `<section class="story">` com badge `badge-high`/`badge-medium`, título
   em `<h3>` e o texto de "O que aconteceu"/"Por que é um problema") —
   critérios ✅ passou e ⚪ não aplicável nunca viram tarefa. Se existir a
   seção "Achados fora do escopo dos critérios" (só na variante produção),
   extraia dela também os achados 🔴/🟡 do mesmo jeito. Se existir uma
   seção "Para quem resolver", use-a para já saber o dono provável de cada
   item (`dev`, `product-owner`, `designer`).
4. Ofereça os critérios/achados via `AskUserQuestion` (`multiSelect:
   true`) para o usuário escolher quais viram tarefa — mesma paginação do
   Passo 2 de `kanban-start/SKILL.md`: até 4 por chamada (3 primeiras +
   "Ver mais" se houver mais de 4), rótulo = título curto do item,
   descrição = resumo de 1 frase de "Por que é um problema"/"O que
   aconteceu".
5. Para cada item selecionado, monte a descrição da tarefa: `<título do
   critério/achado> (via relatório QA docs/qa-report/<arquivo>#fr-N)` — o
   suficiente para quem for implementar abrir o link e ler o parecer
   completo; não copie o parecer inteiro para dentro do `KANBAN.md`.
6. Devolva a lista de descrições montadas ao passo 1 do Modo "Criar nova
   tarefa".

## Origem: docs/cybersec-report/

Sub-rotina do Modo "Criar nova tarefa" (passo 1) — transforma achados de
segurança documentados em `docs/cybersec-report/*.html` (gerados por
`/cybersecurity-check`) em uma ou mais descrições de tarefa avulsa. Não
corrige nada nem edita o arquivo de relatório — só lê.

1. Liste os arquivos: `find docs/cybersec-report -maxdepth 1 -name
   '*.html'`. Se nenhum existir, informe "Nenhum relatório de segurança
   encontrado em docs/cybersec-report/ ainda — rode /cybersecurity-check
   primeiro." e volte à pergunta do passo 1 do Modo "Criar nova tarefa" (o
   usuário escolhe manual ou desiste).
2. Se houver mais de um arquivo, pergunte via `AskUserQuestion` (até 4
   opções, rotuladas pelo nome do arquivo sem extensão) qual usar. Se
   houver só um, use-o direto sem perguntar.
3. Leia o arquivo escolhido e extraia cada achado com severidade Crítica,
   Alta ou Média da seção "Achados" (um `<section class="story"
   id="achado-N">` por achado, com badge `badge-high`/`badge-medium`,
   título em `<h3>` e o texto de "O que foi encontrado"/"Impacto") —
   achados ⚪ Informativa nunca viram tarefa por padrão (oferecer só se o
   usuário pedir explicitamente algo além dos achados). Se existir a seção
   "Para quem resolver", use-a para já saber o dono provável de cada item
   (quase sempre `dev`).
4. Ofereça os achados via `AskUserQuestion` (`multiSelect: true`) para o
   usuário escolher quais viram tarefa — mesma paginação do Passo 2 de
   `kanban-start/SKILL.md`: até 4 por chamada (3 primeiras + "Ver mais" se
   houver mais de 4), rótulo = título curto do achado (com a severidade),
   descrição = resumo de 1 frase de "Impacto".
5. Para cada achado selecionado, monte a descrição da tarefa: `<título do
   achado> (via relatório de segurança
   docs/cybersec-report/<arquivo>#achado-N)` — o suficiente para quem for
   implementar abrir o link e ler o parecer completo (incluindo prazo de
   remediação recomendado e, se houver, o raciocínio ATT&CK/D3FEND); não
   copie o parecer inteiro para dentro do `KANBAN.md`.
6. Devolva a lista de descrições montadas ao passo 1 do Modo "Criar nova
   tarefa".

## Origem: docs/deploy-report/

Sub-rotina do Modo "Criar nova tarefa" (passo 1) — transforma achados de
prontidão de deploy documentados em `docs/deploy-report/*.html` (gerados
por `/check-deployment`) em uma ou mais descrições de tarefa avulsa. Não
corrige nada nem edita o arquivo de relatório — só lê.

1. Liste os arquivos: `find docs/deploy-report -maxdepth 1 -name '*.html'`.
   Se nenhum existir, informe "Nenhum relatório de deploy encontrado em
   docs/deploy-report/ ainda — rode /check-deployment primeiro." e volte à
   pergunta do passo 1 do Modo "Criar nova tarefa" (o usuário escolhe manual
   ou desiste).
2. Se houver mais de um arquivo, pergunte via `AskUserQuestion` (até 4
   opções, rotuladas pelo nome do arquivo sem extensão) qual usar. Se
   houver só um, use-o direto sem perguntar.
3. Leia o arquivo escolhido e extraia cada achado com impacto Bloqueante,
   Alto ou Médio da seção "Achados" (um `<section class="story"
   id="achado-N">` por achado, com badge `badge-high`/`badge-medium`,
   título em `<h3>` e o texto de "O que foi encontrado"/"Impacto") —
   achados ⚪ Informativo nunca viram tarefa por padrão (oferecer só se o
   usuário pedir explicitamente algo além dos achados). Se existir a seção
   "Para quem resolver", use-a para já saber o dono provável de cada item
   (quase sempre `dev`; ocasionalmente `cybersecurity-blue` se o achado for
   redirecionado por sobreposição com segurança).
4. Ofereça os achados via `AskUserQuestion` (`multiSelect: true`) para o
   usuário escolher quais viram tarefa — mesma paginação do Passo 2 de
   `kanban-start/SKILL.md`: até 4 por chamada (3 primeiras + "Ver mais" se
   houver mais de 4), rótulo = título curto do achado (com o impacto),
   descrição = resumo de 1 frase de "Impacto".
5. Para cada achado selecionado, monte a descrição da tarefa: `<título do
   achado> (via relatório de deploy
   docs/deploy-report/<arquivo>#achado-N)` — o suficiente para quem for
   implementar abrir o link e ler o parecer completo (incluindo a janela de
   correção recomendada e, se houver, o fator do 12-Factor violado); não
   copie o parecer inteiro para dentro do `KANBAN.md`.
6. Devolva a lista de descrições montadas ao passo 1 do Modo "Criar nova
   tarefa".

## Origem: docs/coordenador-report/

Sub-rotina do Modo "Criar nova tarefa" (passo 1) — transforma achados
estratégicos documentados em `docs/coordenador-report/*.html` (gerados pelo
Modo "Reunião estratégica") em uma ou mais descrições de tarefa avulsa. Não
corrige nada nem edita o arquivo de relatório — só lê.

1. Liste os arquivos: `find docs/coordenador-report -maxdepth 1 -name
   '*.html'`. Se nenhum existir, informe "Nenhuma reunião estratégica
   encontrada em docs/coordenador-report/ ainda — rode `/kanban-sync` →
   Reunião estratégica primeiro." e volte à pergunta do passo 1 do Modo
   "Criar nova tarefa" (o usuário escolhe manual ou desiste).
2. Se houver mais de um arquivo, pergunte via `AskUserQuestion` (até 4
   opções, rotuladas pela data no nome do arquivo) qual usar. Se houver só
   um, use-o direto sem perguntar.
3. Leia o arquivo escolhido e extraia cada achado da seção de achados (um
   `<section class="story" id="achado-N">` por achado, com badge de
   severidade, título em `<h3>` e o texto de "Impacto"/"Por que é um
   problema") — reaproveite a seção "Para quem resolver" para já saber o
   dono provável de cada item (`product-owner` para desvio de agenda,
   `scrum-master` para reforçar gate de processo).
4. Ofereça os achados via `AskUserQuestion` (`multiSelect: true`) para o
   usuário escolher quais viram tarefa — mesma paginação do Passo 2 de
   `kanban-start/SKILL.md`: até 4 por chamada (3 primeiras + "Ver mais" se
   houver mais de 4), rótulo = título curto do achado, descrição = resumo
   de 1 frase de "Impacto"/"Por que é um problema".
5. Para cada achado selecionado, monte a descrição da tarefa: `<título do
   achado> (via reunião estratégica
   docs/coordenador-report/<data>.html#achado-N)` — o suficiente para quem
   for implementar abrir o link e ler o parecer completo; não copie o
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
`kanban-start`, `docs-sync`, `quick-task` — nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Tipo de reunião determinado (acompanhamento, criar tarefa, ou
      atualizar spec)
- [ ] Se "criar tarefa": branch trocado para `main` (passo 2) antes de
      qualquer edição, origem escolhida (manual, docs/persona/,
      docs/qa-report/, docs/cybersec-report/, ou docs/deploy-report/), e
      `KANBAN.md` reflete o estado atual com a(s) tarefa(s) nova(s)
      adicionada(s)
- [ ] Se "atualizar spec": branch trocado para a feature (passo 3) antes de
      acionar o `product-owner`, requisito formalizado em
      `spec.md`/`docs/index.html`, e a task avulsa (se aceita) seguiu o
      Modo "Criar nova tarefa" a partir do passo 2
- [ ] Se "começar feature grande": `spec.md` limpo em clarify/checklist,
      branch da feature criado e ativo antes de gerar `plan.md`/`tasks.md`,
      `plan.md` e `tasks.md` existem, e `KANBAN.md` reflete as tasks novas em
      To Do
- [ ] Se "reunião estratégica": checagem de estado vazio rodou primeiro,
      nenhuma task individual foi tocada, e `docs/coordenador-report/<data>.html`
      + a linha em `docs/persona/coordenador-instituto.html` § "Log de
      reuniões estratégicas" existem ao final
- [ ] Checagem de escopo rodou quando havia sinal de desvio, e foi respeitada
      a escolha do usuário (abandonar ou atualizar docs)
- [ ] Retrospectiva rodou e, se houve problema reportado, o arquivo correto
      foi atualizado com uma lição aprendida
