---
name: "meeting"
description: "Reunião de scrum: sincroniza o quadro Kanban local (KANBAN.md) a partir dos checkboxes de todos os specs/*/tasks.md, cria uma nova tarefa avulsa (descrita manualmente ou extraída das dores de um teste de persona em docs/persona/, ou de um relatório de QA/segurança/deploy/reunião estratégica) e a aloca no quadro, formaliza um gap/insight como requisito real em spec.md via product-owner (atualizando o protótipo correspondente quando necessário), redireciona para a skill kanban-start para implementar uma task pendente, ajusta um protótipo existente diretamente via designer sem exigir requisito formal ou task nova (para tweaks puramente visuais), redireciona para a skill create-reports para rodar QA/segurança/deploy/persona em paralelo, ou roda o fluxo completo do Spec Kit (specify→clarify→checklist→plan→tasks) para uma feature nova que merece spec própria, criando ou atualizando o protótipo dela."
argument-hint: "Opcional: slug/caminho de uma feature para sincronizar só ela, ou a descrição de uma tarefa nova a criar"
compatibility: "Requires specs/*/tasks.md no formato gerado por speckit-tasks, docs/ (ver item 0 do plano de implementação), e as skills kanban-start (.claude/skills/kanban-start/SKILL.md, modo Implementar spec) e create-reports (.claude/skills/create-reports/SKILL.md, modo Criar relatórios)"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/meeting/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Esta é a "reunião de scrum": uma sincronização de acompanhamento do quadro
real de tasks, a criação de uma tarefa nova avulsa, a formalização de um
gap como requisito em `spec.md`, a implementação de uma task pendente
(redirecionamento para `kanban-start`), o ajuste direto de um protótipo
existente sem processo por trás, ou a geração de relatórios de QA/
segurança/deploy/persona (redirecionamento para `create-reports`). Nunca
dispara sozinha por inferência do modelo — só quando o usuário digitar
`/meeting`.

**Duas formas de usar este arquivo:**
- **Ritual completo** (`/meeting` chamado pelo usuário, ou por
  `/quick-task`): Passo 0 → um dos oito Modos → termina em Retrospectiva.
  Faz a pergunta de tipo de reunião e a checagem de escopo.
- **Sub-rotina "Sincronização"** (usada internamente por `/kanban-start` e
  `/quick-task` só para atualizar `KANBAN.md` a partir de `tasks.md`, sem
  ritual): rode **apenas** a seção `## Sincronização` abaixo — sem Passo 0,
  sem checagem de escopo, sem Retrospectiva. Quem invocar deve pedir
  explicitamente só essa sub-rotina, não o "modo Acompanhamento" inteiro.

## Passo 0 — Tipo de reunião

Liste as oito opções de uma vez, em texto simples no chat (nunca via
`AskUserQuestion` aqui — o tool trava em 4 opções por chamada, o que forçaria
paginação; a pergunta abaixo é justamente para não precisar disso), e espere
o usuário responder digitando o nome ou o número:

```
Que tipo de reunião de scrum é essa?

1. Acompanhamento — sincronizar o quadro a partir do estado real das tasks.
2. Criar nova tarefa — descrever uma tarefa nova e alocá-la no quadro.
3. Atualizar spec — descrever um gap/insight e formalizá-lo como requisito
   em spec.md, sem necessariamente criar task avulsa junto.
4. Implementar spec — implementar uma task pendente (mesmo ciclo de
   dev/QA/commit de rodar /kanban-start diretamente).
5. Atualizar protótipo — ajustar um protótipo existente (mudança
   puramente visual/estrutural) sem formalizar nada em spec.md/KANBAN.md.
6. Criar spec — fluxo completo do Spec Kit (specify→clarify→checklist→
   plan→tasks) para uma feature nova que merece spec própria.
7. Reunião estratégica (coordenador de pesquisa) — leitura holística e
   periódica do projeto inteiro, nível estratégico, não sobre uma task
   específica.
8. Criar relatórios — rodar QA/segurança/deploy/persona em paralelo
   (mesmo redirecionamento de rodar /create-reports diretamente).
```

Se `$ARGUMENTS` já contiver claramente uma descrição de tarefa nova (frase em
linguagem natural, não um slug/caminho existente), pule esta pergunta e siga
direto para o modo "Criar nova tarefa" com essa descrição — "Atualizar spec",
"Implementar spec", "Atualizar protótipo", "Criar spec", "Reunião
estratégica" e "Criar relatórios" só são alcançados escolhendo explicitamente
na pergunta, nunca por inferência do `$ARGUMENTS` (texto livre não distingue
de forma confiável um ajuste pequeno de uma feature grande, uma correção só
de protótipo, ou
uma leitura estratégica).

## Modo "Acompanhamento"

1. Rode a **Sincronização** (seção abaixo) — já escreve `KANBAN.md` e
   reporta as contagens/anomalias da sua própria alçada (tasks avulsas +
   tasks `T\d{3}` em In Progress).
2. Releia as seções `#sl` e `#fr` de `docs/index.html`. Se ainda estiverem
   no texto inicial ("A preencher"), não há nada para comparar — siga sem
   checagem. Caso contrário, avalie (por julgamento, não regra
   determinística) se alguma task reconciliada parece ter saído do escopo
   documentado. Se sim, rode a **Checagem de escopo** antes de continuar.
3. Complemente o relatório da Sincronização com uma leitura **só-visão**
   (nunca persistida em `KANBAN.md` — isso reintroduziria a duplicação) do
   backlog real: para cada `specs/<slug>/tasks.md`, conte linhas `- [ ]` e
   `- [x]` que batam com a regex de task (`grep -c`). Reporte como uma
   linha extra por feature, ex.: `001-manage-call-for-proposals: 62
   pendentes / 8 concluídas em tasks.md`. Isso preserva a visibilidade que
   o modo sempre ofereceu, sem duplicar o dado em nenhum arquivo.
4. Rode a **Retrospectiva**.

## Modo "Atualizar spec"

Formaliza um gap ou insight como requisito real em `spec.md` — o mesmo
movimento que rodar `product-owner` manualmente para transformar uma dor de
persona ou um pedido direto em FR/User Story, só que como caminho suportado
do `/meeting` em vez de uma ação avulsa.

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
   `tasks.md`/`KANBAN.md`/`plan.md` nem `app/` — isso é decisão separada, dos
   passos 5 e 6 abaixo. Protótipo (`prototype/`) fica fora do escopo do
   `product-owner` aqui, mas **pode** ser atualizado no passo 5, pelo
   `designer`, depois que o requisito estiver formalizado.
5. Cheque se existe protótipo relevante para este gap: primeiro
   `find prototype -maxdepth 1 -type d -name '<slug>'` (protótipo da feature
   inteira, criado pelo Modo "Criar spec"); se não houver, procure
   protótipos avulsos já ligados a esta feature em `KANBAN.md` (linhas de
   task sob o bucket da feature que apontem para `prototype/avulsa-<ID>/`).
   - **Nenhum protótipo encontrado**: pule para o passo 6 sem perguntar —
     não há o que atualizar ainda (criar um protótipo novo, se fizer
     sentido, é decisão do passo 6 abaixo, via Modo "Criar nova tarefa").
   - **Existe ao menos um**: pergunte via `AskUserQuestion` (até 4 opções se
     houver mais de um candidato, rotuladas pelo caminho do protótipo)
     **"O requisito recém-formalizado muda algo visível na tela? Atualizar
     o protótipo `<caminho>` agora?"**
     - **"Sim"** — acione o subagente `designer` (`subagent_type:
       "designer"`) com o texto exato do requisito formalizado (FR/User
       Story) e o caminho do protótipo escolhido, pedindo para refletir a
       mudança **no protótipo existente**, sem recriar a pasta do zero.
       Instrução explícita de ponytail: mudança mínima que reflete o
       requisito novo, reaproveitando markup/JS já existente.
     - **"Não"** — pule esta etapa.
6. Quando o passo anterior terminar (ou for pulado), pergunte via
   `AskUserQuestion` (2 opções): **"Requisito formalizado em spec.md. Criar
   já uma tarefa avulsa para isso (protótipo e/ou lembrete de
   implementação)?"**
   - **"Sim"** — vá para o **Modo "Criar nova tarefa"**, a partir do passo 2
     (a origem já está resolvida: "manual", com uma descrição que referencia
     o FR/User Story recém-formalizado; o passo 2 de lá já troca de volta
     para `main` automaticamente, mesmo que este modo tenha deixado o branch
     na feature no passo 3 acima). Ao terminar aquele modo, não rode a
     Retrospectiva de novo — ela já roda uma vez só, no passo 7 abaixo.
   - **"Não"** — siga direto ao passo 7.
7. Rode a **Retrospectiva**.

## Modo "Implementar spec"

Puro redirecionamento — implementar uma task já é o trabalho de
`kanban-start/SKILL.md`, que sozinha cobre o ciclo inteiro (seleção de
task, branch + lock, handoff pro `dev`, gate obrigatório de QA,
Sincronização e Retrospectiva próprias). Nenhuma lógica é duplicada aqui.

1. Rode a skill `kanban-start` diretamente (`Skill` tool, mesmo
   comportamento de digitar `/kanban-start`), passando `$ARGUMENTS` adiante
   se já trouxer um Task ID ou descrição.
2. Não rode a Retrospectiva deste arquivo depois — a de `kanban-start` já é
   a definitiva desta invocação (mesma razão do passo 6 do Modo "Atualizar
   spec": duas Retrospectivas para o mesmo ciclo seria ruído, não sinal).

## Modo "Atualizar protótipo"

A via rápida para um ajuste puramente visual/estrutural num protótipo já
existente — sem exigir que a mudança primeiro vire requisito formal em
`spec.md` (isso é o Modo "Atualizar spec") nem uma task nova no quadro
antes de agir (isso é o Modo "Criar nova tarefa"). Se a mudança na verdade
reflete um requisito/gap real (não só "o botão está no lugar errado"), use
um daqueles modos em vez deste — este aqui não deixa nenhum rastro em
`spec.md`/`KANBAN.md` de propósito.

1. Se `$ARGUMENTS` não trouxer a descrição da mudança, pergunte no chat
   (texto livre): "O que precisa mudar no protótipo?"
2. Descubra os protótipos existentes: `find prototype -mindepth 1 -maxdepth
   1 -type d`.
   - Nenhum encontrado: informe que ainda não há protótipo nenhum (criar um
     novo é via Modo "Criar nova tarefa" ou "Criar spec", conforme o caso)
     e pare — não há o que atualizar.
   - Um: use-o direto.
   - Mais de um: pergunte via `AskUserQuestion` (até 4 opções, rotuladas
     pelo caminho) qual protótipo ajustar.
3. Acione o subagente `designer` (`subagent_type: "designer"`) com a
   descrição da mudança e o caminho do protótipo escolhido, pedindo para
   refletir a mudança **no protótipo existente**, sem recriar a pasta do
   zero — instrução explícita de ponytail: mudança mínima que resolve o
   pedido, reaproveitando markup/JS já existente.
4. Rode a **Retrospectiva**.

## Modo "Criar relatórios"

Puro redirecionamento — mesmo padrão do Modo "Implementar spec": gerar
relatórios já é o trabalho de `create-reports/SKILL.md`, que sozinha cobre
o ciclo inteiro (seleção de tipos de relatório, fan-out paralelo pros
subagentes certos, coleta e reporte, Retrospectiva própria). Nenhuma
lógica é duplicada aqui.

1. Rode a skill `create-reports` diretamente (`Skill` tool, mesmo
   comportamento de digitar `/create-reports`), passando `$ARGUMENTS`
   adiante se já trouxer alguma preferência de quais relatórios rodar.
2. Não rode a Retrospectiva deste arquivo depois — a de `create-reports`
   já é a definitiva desta invocação (mesma razão do Modo "Implementar
   spec").

## Modo "Criar spec"

Fluxo completo do Spec Kit para uma feature nova que merece spec própria:
specify → clarify → checklist → plan → tasks, carregando as tasks geradas
direto no quadro, além de criar (ou atualizar) o protótipo estático
correspondente. Equivalente ao antigo `/feature-start`, agora como um
caminho suportado do `/meeting` em vez de comando próprio.

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
4. Antes de perguntar, cheque se já existe um protótipo para esta feature:
   `find prototype -maxdepth 1 -type d -name '<slug>'` (mesmo slug de
   `specs/<slug>/` — distinto dos protótipos avulsos `prototype/avulsa-<ID>/`
   que uma task específica dessa feature pode ganhar depois, via Modo
   "Criar nova tarefa").
   - **Se já existe**: pule a pergunta abaixo — acione o subagente `designer`
     (`subagent_type: "designer"`) pedindo para **atualizar esse protótipo
     existente** (`prototype/<slug>/`), refletindo as User Stories/FRs da
     spec recém-gerada, sem recriar a pasta do zero.
   - **Caso contrário**, pergunte via `AskUserQuestion` (2 opções): **"Essa
     feature envolve tela/fluxo de usuário? Criar um protótipo estático?"**
     - **"Sim"** — acione o `designer` pedindo a criação de um protótipo
       estático **novo** em `prototype/<slug>/` com `index.html`,
       `style.css` e `script.js` (HTML/CSS/JS puro, sem framework, sem
       lógica real, com um comentário no topo do HTML identificando-o como
       protótipo não-funcional — mesmo padrão de `prototype/avulsa-A001/`),
       refletindo as User Stories/FRs principais da spec recém-gerada.
     - **"Não"** — pule esta etapa.

   Em ambos os ramos, instrução explícita ao `designer`: siga ponytail — o
   mínimo de markup/JS que comunica o fluxo da spec, reaproveitando o que já
   existe no protótipo (quando houver) em vez de reescrever do zero, sem
   abstrações especulativas.
5. **Revisão de design (gate opcional)** — decoupla a etapa de design da de
   engenharia: um checkpoint para aprovar spec+protótipo antes de investir
   tempo/compute em plano técnico e código. Pergunte via `AskUserQuestion`
   (2 opções): **"Rodar uma revisão de design (QA e/ou persona) no
   protótipo antes de gerar o plano técnico?"**
   - **"Sim"** — acione o subagente `qa` (`qa-test`, contra o protótipo do
     passo 4) e, se já existir pelo menos um documento de persona anterior
     em `docs/persona/` para este projeto, acione também `fundraiser` e/ou
     `coordenador-de-pesquisa` (`fundraiser-test`/`coordenador-test`) pela
     mesma lógica. Ao final, pergunte via `AskUserQuestion` (2 opções):
     **"Spec e protótipo aprovados para seguir à implementação técnica
     (plano + tasks)?"**
     - **"Sim"** — siga ao passo 6.
     - **"Não"** — peça o motivo (texto livre), registre como Lição
       aprendida (mesmo formato da Retrospectiva) no arquivo responsável
       pelo gap apontado, e volte ao passo 2 pedindo ao `product-owner`
       para rodar só `speckit-clarify` (com o motivo como entrada) e
       `speckit-checklist` de novo — sem repetir `speckit-specify` do
       zero, a menos que o motivo indique que a spec inteira está errada.
       Não avance para plano/tasks nesta rodada.
   - **"Não"** — pule direto ao passo 6, comportamento padrão de hoje.
6. Acione o subagente `dev` (`subagent_type: "dev"`) com o caminho exato de
   `specs/<slug>/spec.md` gerado no passo 2, pedindo que rode em sequência:
   `speckit-plan` (produz `plan.md`) e `speckit-tasks` (produz `tasks.md`).
7. Rode a **Sincronização** (para carregar as tasks novas em `KANBAN.md`).
8. Rode a **Retrospectiva**.

## Modo "Reunião estratégica (coordenador de pesquisa)"

Ao contrário de todos os outros modos, este nunca cria, edita nem move
nenhuma task — é uma leitura consultiva do projeto inteiro, nunca um gate.

1. **Checagem de estado vazio**: se não existir `KANBAN.md` **e**
   `find specs -mindepth 1 -maxdepth 1 -type d` não achar nada, informe
   "Ainda não há board nem specs para uma leitura estratégica — rode
   `/meeting` → Acompanhamento ou comece uma feature primeiro." e
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
     - **"A partir de um relatório existente"** — liste as seis origens de
       uma vez, em texto simples (mesmo motivo do Passo 0: acima do limite
       de 4 do `AskUserQuestion`), e espere o usuário responder digitando o
       nome ou o número:
       ```
       De qual relatório?

       1. Teste de persona (docs/persona/)
       2. Relatório de QA (docs/qa-report/)
       3. Achados de segurança (docs/cybersec-report/)
       4. Achados de prontidão de deploy (docs/deploy-report/)
       5. Reunião estratégica (docs/coordenador-report/)
       ```
       Rode a sub-rotina **Origem: `<caminho escolhido>`** correspondente
       (abaixo); ela devolve uma lista de uma ou mais descrições (uma por
       achado/dor/critério escolhido). Se uma 6ª origem de relatório
       existir no futuro, acrescente à mesma lista — nunca pagine.
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
   encontrada em docs/coordenador-report/ ainda — rode `/meeting` →
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

Mantém `KANBAN.md` — que só guarda o que `specs/*/tasks.md` não consegue
guardar sozinho (ver o cabeçalho do próprio arquivo): a lista completa das
tasks avulsas `A\d{3}` (nas três colunas) e quais tasks `T\d{3}` estão
atualmente **In Progress**. Nunca lê nem escreve as colunas To Do/Done para
tasks `T\d{3}` — essas vivem só em `tasks.md` (`[ ]`/`[x]`), sem duplicação.

1. Leia o `KANBAN.md` anterior, se existir:
   - Todas as linhas `A\d{3}`, em qualquer coluna — carregam para a nova
     versão **sem alteração** (esta sub-rotina nunca move uma task avulsa de
     coluna; isso é sempre `/kanban-start` ou o Modo "Criar nova tarefa").
   - As linhas `T\d{3}` da coluna **In Progress**, com o slug da feature de
     cada uma (prefixo `<slug>#` da task-key).
   Se `KANBAN.md` não existir ainda, comece com tudo vazio — primeira
   sincronização, normal se só houver tasks avulsas até agora.
2. Para cada task `T\d{3}` encontrada em In Progress no passo anterior
   (respeitando um filtro de slug em `$ARGUMENTS`, se dado no modo
   Acompanhamento — pule a validação de tasks de outras features nesse
   caso): abra `specs/<slug>/tasks.md` e localize a linha daquele ID
   (regex `- \[([ x])\] (T\d{3}) ?(\[P\])? ?(\[US\d+\])? (.*)`).
   - `[x]` → **remova de In Progress** — a task terminou; o estado
     definitivo agora é o próprio `[x]` em `tasks.md`, não duplica em Done.
   - Linha não encontrada (task removida/renumerada em `tasks.md`) →
     **remova de In Progress** e reporte como anomalia.
   - `[ ]` → mantenha em In Progress, sem alteração.
3. Escreva `KANBAN.md` na raiz do repo (mesmo formato descrito no cabeçalho
   do próprio arquivo). Pegue o timestamp com `date -u +"%Y-%m-%dT%H:%MZ"`.
   Colunas **To Do** e **Done**: só as tasks `A\d{3}` carregadas do passo 1,
   agrupadas pelo mesmo bucket (feature ou "(avulsas)") e ordem que já
   tinham. Coluna **In Progress**: as `A\d{3}` carregadas do passo 1 mais as
   `T\d{3}` que sobraram do passo 2, na ordem em que já apareciam.
4. Reporte:
   ```
   ## Kanban sincronizado

   - Tasks T\d{3} em In Progress validadas: N (M concluídas e removidas,
     P sem linha correspondente em tasks.md — removidas e reportadas como
     anomalia)
   - Tasks avulsas (A\d{3}): X em To Do | Y em In Progress | Z em Done
     (sem alteração — esta sub-rotina nunca move avulsa de coluna)

   KANBAN.md atualizado em <caminho absoluto>.
   ```

## Retrospectiva

Procedimento canônico definido em `kanban-start/SKILL.md`, seção
"Retrospectiva" — não duplicado aqui. Pergunte da mesma forma ("Como foi essa
reunião?" em vez de "Está funcionando?") e, se houver problema reportado,
registre a lição aprendida no arquivo correto (um agente em
`.claude/agents/*.md`, ou uma das nossas skills — `meeting`,
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
      `spec.md`/`docs/index.html`, protótipo existente atualizado quando
      relevante e aceito (passo 5), e a task avulsa (se aceita) seguiu o
      Modo "Criar nova tarefa" a partir do passo 2
- [ ] Se "criar spec": `spec.md` limpo em clarify/checklist, branch da
      feature criado e ativo antes de gerar `plan.md`/`tasks.md`, protótipo
      criado ou atualizado quando a feature envolve tela (passo 4), o gate
      de revisão de design do passo 5 rodou (ou foi explicitamente pulado)
      antes de gerar plano/tasks, `plan.md` e `tasks.md` existem, e
      `KANBAN.md` reflete as tasks novas em To Do
- [ ] Se "reunião estratégica": checagem de estado vazio rodou primeiro,
      nenhuma task individual foi tocada, e `docs/coordenador-report/<data>.html`
      + a linha em `docs/persona/coordenador-instituto.html` § "Log de
      reuniões estratégicas" existem ao final
- [ ] Se "implementar spec": a skill `kanban-start` rodou até o fim, e a
      Retrospectiva deste arquivo **não** rodou duas vezes
- [ ] Se "atualizar protótipo": protótipo existente identificado (sem criar
      pasta nova), `designer` ajustou o protótipo, e nada foi escrito em
      `spec.md`/`KANBAN.md` neste modo
- [ ] Se "criar relatórios": a skill `create-reports` rodou até o fim, e a
      Retrospectiva deste arquivo **não** rodou duas vezes
- [ ] Checagem de escopo rodou quando havia sinal de desvio, e foi respeitada
      a escolha do usuário (abandonar ou atualizar docs)
- [ ] Retrospectiva rodou e, se houve problema reportado, o arquivo correto
      foi atualizado com uma lição aprendida
