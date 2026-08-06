---
name: "kanban-start"
description: "Apresenta as tarefas pendentes (avulsas To Do de KANBAN.md + tasks T\\d{3} pendentes lidas direto de specs/*/tasks.md) como opções selecionáveis no chat (com atalho para criar tarefas novas a partir das dores de um teste de persona em docs/persona/, sem precisar rodar /meeting à parte), garante a branch certa da feature antes de implementar (main para tasks avulsas), deixa escolher o fluxo do Spec Kit (manual ou decidido pelo dev), delega a implementação ao dev, aciona o QA como gate obrigatório, oferece abrir PR quando a feature terminar, e roda uma retrospectiva de feedback ao final."
argument-hint: "Opcional: um Task ID (ex. T012 ou A001), com ou sem prefixo de slug, para pular a navegação por perguntas"
compatibility: "Requires KANBAN.md (gerado por meeting) para tasks avulsas + specs/*/tasks.md para tasks T\\d{3}, e os subagentes dev/qa/designer/product-owner/scrum-master em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/kanban-start/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Se `$ARGUMENTS` for um Task ID (`T\d{3}` ou `A\d{3}`, com ou sem prefixo de
slug), pule a navegação por perguntas do Passo 2 e vá direto ao Passo 3 usando
esse ID — mas ainda valide que está pendente antes de prosseguir: `A\d{3}`
deve estar em `## To Do` de `KANBAN.md`; `T\d{3}` deve ter `[ ]` no
`tasks.md` da feature **e** não estar em `## In Progress` de `KANBAN.md`. Se
já concluída, em progresso, ou não existir, informe e pare, sem inventar
fallback.

## Passo 1 — Dados frescos

Rode **apenas a sub-rotina "Sincronização"** de `meeting/SKILL.md` (a
seção `## Sincronização`, não o "modo Acompanhamento" inteiro) — sem
perguntar tipo de reunião, sem checagem de escopo, sem Retrospectiva; o
objetivo é podar de `KANBAN.md` qualquer task `T\d{3}` que já saiu de In
Progress (concluída ou removida de `tasks.md`) antes de montar a lista de
candidatas do Passo 2 — evita oferecer de novo uma task que já terminou.
Depois disso, se não houver nenhuma task avulsa em `## To Do` de
`KANBAN.md` **e** nenhuma linha `- [ ]` de task `T\d{3}` em nenhum
`specs/*/tasks.md` fora de `## In Progress`, reporte "Nenhuma tarefa
disponível — todas concluídas, em progresso, ou nenhuma feature tem
tasks.md ainda (rode `speckit-tasks` numa feature, ou crie uma tarefa
avulsa via `/meeting`)." e pare.

## Passo 2 — Selecionar a tarefa

`KANBAN.md` só guarda o backlog (To Do) das tasks avulsas `A\d{3}` — o
backlog das tasks `T\d{3}` vive só em `specs/<slug>/tasks.md` (ver
cabeçalho de `KANBAN.md`). Monte a lista plana de candidatas combinando as
duas fontes, na mesma ordem de sempre (features por diretório, avulsas por
último; dentro de cada feature, suas `A\d{3}` bucketadas ali, depois suas
`T\d{3}` na ordem de `tasks.md`):

1. Leia `## To Do` de `KANBAN.md` (só `A\d{3}`, por bucket de feature ou
   `(avulsas)`).
2. Leia `## In Progress` de `KANBAN.md` para saber quais `T\d{3}` já estão
   em andamento (excluir da lista abaixo).
3. `find specs -mindepth 1 -maxdepth 1 -type d`; para cada feature, leia
   `tasks.md` linha a linha (regex `- \[([ x])\] (T\d{3}) ?(\[P\])?
   ?(\[US\d+\])? (.*)`) e colete as `[ ]` cujo ID não esteja em In
   Progress (passo 2).

**Não pergunte por feature/bucket antes de mostrar tasks** — vá direto às
tasks reais.

Rode `find docs/persona -maxdepth 1 -name '*.html'`. Se houver pelo menos um
arquivo, reserve uma vaga para a opção fixa **"Criar tarefa a partir de
dores de persona"** na `AskUserQuestion` abaixo — conta contra o limite de 4
opções junto das tasks. Se escolhida, vá para a sub-rotina **Origem:
persona** (abaixo) em vez de continuar a seleção normal.

Respeite o limite de 4 opções por chamada de `AskUserQuestion` (mais o
"Other" de texto livre, sempre disponível para o usuário digitar qualquer
Task ID fora das opções mostradas, de qualquer bucket):

- Reserve 1 vaga para a opção de persona (se aplicável) e, se a lista
  plana montada acima tiver mais itens do que as vagas restantes, 1 vaga
  para **"Ver mais tarefas"** (a última das 4).
- Preencha o resto das vagas com as primeiras tasks da lista plana, na
  ordem. Rótulo: `T0xx/A0xx — <descrição curta>`; descrição: bucket de
  origem (slug da feature, ou "avulsa") + fase/story quando houver (ex.:
  "001-manage-call-for-proposals · Setup" ou "avulsa").
- Se "Ver mais tarefas" for escolhida, repita a pergunta com o próximo
  lote da lista plana (mesma regra de vagas) até acabarem.
- Se o usuário usar "Other" para digitar um ID fora das opções mostradas,
  valide que existe e está pendente (`A\d{3}` em To Do de `KANBAN.md`, ou
  `T\d{3}` com `[ ]` em algum `tasks.md` e fora de In Progress) antes de
  aceitar.

## Origem: persona

Sub-rotina do Passo 2, acionada ao escolher "Criar tarefa a partir de dores
de persona" — evita ter que rodar `/meeting` à parte antes de
`/kanban-start` só para este caso.

1. Rode a sub-rotina **Origem: docs/persona/** de `meeting/SKILL.md`
   (escolha do arquivo de persona, extração das dores, seleção via
   `AskUserQuestion` com `multiSelect: true`) para obter uma lista de uma ou
   mais descrições de tarefa.
2. Para cada descrição da lista, rode os passos 2 a 7 do **Modo "Criar nova
   tarefa"** de `meeting/SKILL.md` (branch para `main`, checagem de
   escopo, alocação em feature/avulsa, geração do próximo ID avulso, adição
   em `KANBAN.md`, pergunta sobre protótipo) — **pare antes do passo 8 dele**
   (Sincronização); quem sincroniza este fluxo combinado é o próprio
   `/kanban-start` (Passo 1 já rodou antes de chegar aqui, e o Passo 7 roda
   depois do ciclo dev/QA).
3. Se exatamente **uma** tarefa foi criada, use o ID dela diretamente e
   siga para o Passo 4 deste comando (pule o resto da navegação do Passo 2).
4. Se **mais de uma** foi criada, releia `## To Do` de `KANBAN.md` (agora
   incluindo as tarefas recém-criadas) e retome a seleção normal do Passo 2
   desde o início, para o usuário escolher qual iniciar agora — as demais
   ficam em To Do para uma próxima chamada de `/kanban-start`.

## Passo 3 — Escolher o fluxo (flexibilidade)

Pule este passo inteiro para tasks `A\d{3}` (avulsas, sem spec/plan por
trás) — vá direto ao Passo 4.

Para tasks `T\d{3}`, pergunte via `AskUserQuestion` (2 opções): **"Como
prosseguir com essa tarefa?"**
- **"Deixar o dev decidir"** (Recomendado) — vá direto ao Passo 4; o `dev`
  usa seu próprio julgamento (já documentado em `dev.md`) sobre consultar
  `spec.md`/`plan.md`, pedir `speckit-clarify` de volta, etc.
- **"Escolher uma etapa do Spec Kit primeiro"** — sub-pergunta
  (`AskUserQuestion`, até 4 opções, só as que fazem sentido dado o estado dos
  artefatos da feature): `speckit-clarify` (esclarecer a spec antes),
  `speckit-plan`/replanejar, `speckit-analyze` (checar consistência antes de
  implementar), ou "Ir direto para o dev". Rode a etapa escolhida primeiro
  (via `Skill`, ou delegando ao agente dono — `product-owner` para clarify,
  `scrum-master` para analyze) e só então vá ao Passo 4.

## Passo 4 — Branch e mover para In Progress

Rode o procedimento canônico **Branch da feature** (seção abaixo) antes de
tocar em `KANBAN.md` — troque para o branch alvo primeiro, depois edite o
quadro já no branch certo: alvo é o slug da feature para tasks `T\d{3}`
(mesmo nome do diretório em `specs/`), ou `main` para tasks `A\d{3}`
(avulsas), independente do bucket em que a task apareça no `KANBAN.md`.

Depois, edite `KANBAN.md`: para `A\d{3}`, mova a linha da task escolhida de
`## To Do` para `## In Progress` (remova o cabeçalho da feature em To Do se
ficar vazio); para `T\d{3}` (que nunca teve linha em To Do de `KANBAN.md`
— seu backlog é só `tasks.md`), **adicione** a linha direto em `## In
Progress`, copiando o texto exato da task de `tasks.md`. Em ambos os casos,
adicione o sufixo de proveniência (`feature`, caminho de `tasks.md` — ou
"avulsa" — timestamp via `date -u +"%Y-%m-%dT%H:%MZ"`, `via /kanban-start`).
**Não edite `specs/<slug>/tasks.md`** — o checkbox lá continua `[ ]` até o
`dev` de fato terminar e marcar `[x]`.

## Branch da feature (canônico)

Procedimento usado por este comando (Passo 4) e referenciado pelos modos
"Atualizar spec", "Criar nova tarefa" e "Criar spec" de `meeting/SKILL.md`
— troca automaticamente para o branch da feature (ou
`main`, para trabalho avulso/sem feature), sem perguntar confirmação a cada
troca; a troca em si aparece só como uma linha no relato da etapa que a
chamou, nunca como uma `AskUserQuestion` própria.

Recebe um branch alvo (`<slug>` da feature, ou `main`).

1. `git branch --show-current` — se já for o alvo, não faça nada (idempotente).
2. Senão, `git show-ref --verify --quiet refs/heads/<alvo>`: se existir,
   `git checkout <alvo>`; se não existir, `git checkout -b <alvo>`.
3. Se o próprio `git checkout` recusar (mudança local não commitada seria
   sobrescrita), pare e mostre a mensagem do git ao usuário, pedindo para
   commitar ou resolver manualmente antes de repetir a etapa que chamou este
   procedimento — não force (nunca `-f`, stash ou descarte automático).
4. Em caso de sucesso, relate a troca em uma linha (`Branch: <anterior> →
   <novo>`) como parte da saída da etapa que chamou este procedimento.

## Passo 5 — Delegar ao dev

Invoque o subagente `dev` (tool de subagentes, `subagent_type: "dev"`) com um
prompt que inclua, literalmente:
- Task ID e descrição completa (verbatim, copiada da linha de origem,
  incluindo caminho(s) de arquivo já embutido(s));
- caminho exato `specs/<slug>/tasks.md` (se houver — avulsas não têm);
- se existir `prototype/<slug-ou-avulsa>-<ID>/`, o caminho dele e a
  instrução de lê-lo primeiro e alinhar a implementação a ele, acionando o
  `designer` se precisar ajustar algo antes de seguir;
- instrução para consultar `spec.md`/`plan.md` da mesma feature se precisar
  de contexto (não aplicável a avulsas);
- instrução para usar `codegraph_explore` antes de editar, para entender
  código/símbolos relacionados;
- lembrete para aplicar a lente do Ponytail (skill `ponytail:ponytail`) ao
  escrever/alterar código;
- lembrete das regras de handoff de `dev.md`: acionar `designer` se tocar
  UX, sinalizar `product-owner` (via `scrum-master`) se um requisito estiver
  ambíguo, em vez de assumir;
- instrução para implementar **só** aquela task (não rodar
  `speckit-implement` inteiro nem pular para a próxima) e marcar `[x]` em
  `tasks.md` ao terminar (só se houver `tasks.md` — avulsa não tem checkbox
  em arquivo nenhum, você marca no Passo 7);
- a proveniência: "Esta task foi selecionada via `/kanban-start`."
- instrução para o relatório de conclusão incluir, além do `[x]`, um
  resumo mínimo do que mudou e do que já foi verificado (arquivos
  tocados, testes/comandos rodados) — é esse resumo que o Passo 6 repassa
  ao `qa`, para ele validar em cima do que o `dev` já checou em vez de
  reconstruir o contexto do zero.

Quando o `dev` reportar a task como concluída, rode o **Checkpoint de etapa**
(seção abaixo) — etapa que acabou: "o dev implementou a task"; etapa
anterior: Passo 3 (escolher o fluxo). Só depois de "Seguir" vá ao Passo 6.

## Passo 6 — Gate de QA (obrigatório, merge-ready)

Invoque o subagente `qa` (`subagent_type: "qa"`) com o mesmo Task
ID/descrição/caminho de `tasks.md` (e o caminho do protótipo, se houver),
mais o resumo do que o `dev` já mudou/verificou (Passo 5), pedindo que
escreva e rode testes de UI e de Lógica cobrindo os critérios de aceite
dessa task/feature (ver `qa.md`).

Esta task, sozinha, fica **merge-ready** quando este passo aprova — não
confunda com a feature inteira estar pronta para ir a `main`; isso só
acontece no Passo 11, quando todas as tasks da feature estiverem `[x]` e
o PR for aberto (**integration-ready**). São dois níveis de "pronto"
diferentes, checados em passos diferentes.

- **QA aprova** → rode o **Checkpoint de etapa** (seção abaixo) — etapa que
  acabou: "o QA validou e aprovou"; etapa anterior: Passo 5 (dev). Só depois
  de "Seguir" vá ao Passo 7.
- **QA reprova** → devolva ao `dev` **uma única vez** com o relatório do
  `qa` (retry limitado a 1 rodada, nunca em loop). Se reprovar de novo, pare
  de repetir: deixe a task em In Progress no `KANBAN.md` com uma nota do
  achado do QA, e reporte a situação ao usuário em vez de continuar
  tentando sozinho (esse relato já serve de checkpoint — não rode a seção
  abaixo neste caso de bloqueio).

## Passo 7 — Refletir o resultado

Rode de novo **apenas a sub-rotina "Sincronização"** de `meeting/SKILL.md`
(mesma regra do Passo 1 — sem pergunta, sem checagem de escopo, sem
Retrospectiva) para refletir o resultado das tasks `T\d{3}` (se o `dev`
marcou `[x]` em `tasks.md`, a Sincronização a remove de In Progress — o
estado definitivo já é o `[x]` de lá, sem duplicar em Done). Para tasks
avulsas (`A\d{3}`, sem `tasks.md`), edite `KANBAN.md` você mesmo: se QA
aprovou, mova a linha de In Progress para Done; se não, ela já ficou em In
Progress com a nota do Passo 6.

## Passo 8 — Atualização condicional de docs/

Se o relato do `dev` ou do `qa` sinalizar que um requisito, regra de negócio
ou decisão de arquitetura documentada estava errada/incompleta (não é o caso
comum — só quando entendido que é necessário), invoque o dono do arquivo
correspondente (`product-owner` para requisitos/regras/escopo, `dev` para
arquitetura/tecnologias) para atualizar o `docs/*.md` relevante. Não faça
isso proativamente sem sinal claro do `dev`/`qa` — é uma checagem de
bom-senso, não uma pergunta ao usuário.

Se este passo de fato rodou (algum `docs/*.md` foi atualizado), rode o
**Checkpoint de etapa** (seção abaixo) — etapa que acabou: "docs/ foi
atualizado"; etapa anterior: Passo 6 (gate de QA). Se nada foi atualizado,
não há o que checar — siga direto ao Passo 9.

## Checkpoint de etapa (canônico)

Usado só depois de etapas com impacto real (implementação do dev, validação
do QA, atualização de `docs/`) — nunca depois de etapas mecânicas (mover
linha no `KANBAN.md`, sincronizar). Pergunte via `AskUserQuestion` (3
opções): **"<etapa que acabou, em 1 frase>. Como prosseguir?"**
- **"Seguir"** (Recomendado) — vá para a próxima etapa normalmente.
- **"Corrigir e refazer esta etapa"** — peça o que corrigir (texto livre) e
  reexecute a mesma etapa (reacionando o mesmo subagente com a correção
  incorporada à instrução); ao terminar, repita este mesmo checkpoint.
- **"Voltar para a etapa anterior"** — reexecute do zero a etapa anterior
  indicada acima (descartando o resultado da etapa que acabou de rodar,
  quando aplicável) e siga o fluxo normalmente a partir dali — o que vai
  bater neste checkpoint (ou no anterior) de novo, conforme o caso.

Não confunda com a Retrospectiva (Passo 9): este checkpoint é local a uma
etapa e não registra lição aprendida; só a Retrospectiva final faz isso.

## Passo 9 — Retrospectiva (feedback e aprendizado)

Pergunte via `AskUserQuestion` (2 opções): **"Está funcionando? Os testes do
QA rodaram e passaram corretamente?"**
- **"Sem problemas"** — encerre normalmente.
- **"Encontrei um problema"** — peça os detalhes (texto livre, ou via
  "Other"). Depois:
  1. Identifique o arquivo dono provável do problema: um agente em
     `.claude/agents/*.md` (`product-owner`, `dev`, `designer`,
     `scrum-master`, `fundraiser`, `coordenador-de-pesquisa`, `qa`) ou uma
     das nossas skills (`meeting`, `kanban-start`, `docs-sync`,
     `quick-task`, todas em `.claude/skills/`). **Nunca edite** skills
     `speckit-*` nem nada em `.specify/`.
  2. Adicione (ou crie) uma seção `## Lições aprendidas` ao final do arquivo
     identificado, com uma entrada curta e datada (`date -u +%Y-%m-%d`): o
     que aconteceu e a regra concreta para evitar da próxima vez.
  3. Reporte ao usuário qual arquivo foi atualizado e o que foi adicionado.

Este é o procedimento canônico de retrospectiva — `meeting/SKILL.md`
referencia esta seção em vez de repeti-la.

Ao final da Retrospectiva (nos dois ramos — "Sem problemas" e depois de
registrar a lição aprendida em "Encontrei um problema"), siga para o Passo
10. **Exceção**: se o fluxo parou antes por bloqueio de QA (Passo 6, retry
esgotado), a Retrospectiva nem chega a rodar — não há Passo 10 nem Passo 11
nesse caso.

## Passo 10 — Commit

Pergunte via `AskUserQuestion` (3 opções): **"Retrospectiva concluída. Como
registrar essa mudança no git?"**
- **"Commit e push"** (Recomendado) — cria o commit e dá push na sequência.
- **"Só commit"** — cria o commit, sem push (fica local para revisão).
- **"Não commitar agora"** — não faz nada; reporte como pendente no
  Completion Report.

Se "Commit e push" ou "Só commit":
1. Rode `git status` e `git diff` para revisar exatamente o que mudou nesta
   task (implementação do `dev`, ajustes em `docs/`, `KANBAN.md`,
   `specs/<slug>/tasks.md`).
2. Monte a mensagem em **Conventional Commits** (`feat:`, `fix:`, `docs:`,
   `chore:`, etc. — conforme a natureza da mudança predominante): título
   curto no padrão, seguido de um **corpo detalhado**. O commit deve
   funcionar como documentação da mudança, não só um rótulo — inclua o que
   mudou, por que (contexto da task/spec que motivou), decisões relevantes
   tomadas durante a implementação, e o resultado do QA. Errar para mais
   detalhe, não para menos.
3. `git add` só os arquivos relevantes (nunca `-A`/`.`), depois `git commit`.
4. Se "Commit e push", rode `git push -u origin HEAD` na sequência
   (idempotente — define upstream no primeiro push de um branch novo, e se
   comporta como push normal depois disso).

## Passo 11 — Abrir PR se a feature estiver completa (integration-ready)

Este é o gate de **integration-ready** da feature (distinto do
merge-ready por task do Passo 6 — ver nota lá). Só roda para tasks
`T\d{3}` cujo Passo 10 terminou em "Commit e push" — pule
silenciosamente para o Completion Report em qualquer outro caso (task
`A\d{3}`, ou Passo 10 resultou em "Só commit"/"Não commitar agora": não há
como abrir PR de um branch sem push).

1. Releia `specs/<slug>/tasks.md`. Se não houver nenhuma linha `T\d{3}`, ou
   se houver pelo menos uma ainda `[ ]`, a feature não está completa — pule
   para o Completion Report sem perguntar nada.
2. Se todas as `T\d{3}` estiverem `[x]`, pergunte via `AskUserQuestion`
   (2 opções): **"Todas as tasks de `<slug>` estão Done. Abrir PR para
   `main`?"**
   - **"Sim"** — rode `gh pr create --base main --head <slug> --title "<título
     de spec.md>" --body "<resumo curto do que foi entregue>"` (título: o
     texto após "Feature Specification:" em `specs/<slug>/spec.md`; corpo:
     2-3 linhas resumindo o que foi implementado, mais o rodapé padrão de PR
     das instruções gerais deste agente). Se o comando falhar (`gh` não
     autenticado, PR já existe, etc.), deixe o erro aparecer normalmente —
     não tente contornar.
   - **"Não"** — não cria PR agora; reporte como pendente no Completion
     Report.

## Completion Report

```
## Tarefa iniciada via /kanban-start

- Selecionada: <slug-ou-avulsa>#<TaskID> — <descrição>
- Branch: <branch atual, ex. "001-manage-call-for-proposals" ou "main">
- Fluxo escolhido: <deixar o dev decidir | etapa do Spec Kit: <nome>>
- Delegada ao subagente dev
- Resultado do QA: <aprovado | reprovado (retry usado) | reprovado (bloqueado)>
- Estado no KANBAN.md: <In Progress | Done>
- docs/ atualizado: <arquivo(s) ou "nenhum">
- Commit: <hash curto + resumo do título | "só commit, sem push" | "não commitado">
- PR: <URL do PR criado | "não oferecido (task avulsa ou feature incompleta)" | "oferecido, recusado">

Rode /kanban-start de novo para a próxima tarefa, ou /meeting só para
olhar o quadro.
```

## Done When

- [ ] Uma única task foi selecionada (via `AskUserQuestion`, `$ARGUMENTS`
      validado, ou criada na hora via "Origem: persona")
- [ ] Branch trocado automaticamente no Passo 4 (slug da feature para
      `T\d{3}`, `main` para `A\d{3}`), sem perguntar confirmação
- [ ] `KANBAN.md` foi atualizado (In Progress → Done ou nota de bloqueio)
- [ ] `specs/<slug>/tasks.md` só foi tocado pelo `dev` (nunca por este
      comando diretamente)
- [ ] O subagente `dev` foi acionado com Task ID, descrição e caminhos
      exatos
- [ ] O subagente `qa` foi acionado como gate obrigatório antes de Done
- [ ] Checkpoint de etapa rodou após dev, após QA aprovar, e após
      atualização de docs (quando esta última aconteceu)
- [ ] `meeting` rodou de novo após o ciclo dev/qa
- [ ] Retrospectiva rodou ao final (quando não houve bloqueio de QA)
- [ ] Depois da Retrospectiva, perguntou-se sobre commit/push e, se aceito,
      o commit seguiu Conventional Commits com corpo detalhado, e o push
      usou `git push -u origin HEAD`
- [ ] Se a task era `T\d{3}` e terminou com commit+push, checou se a feature
      ficou 100% Done e, se sim, perguntou sobre abrir PR
