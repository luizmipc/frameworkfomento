---
name: "kanban-start"
description: "Apresenta as tarefas To Do do KANBAN.md como opções selecionáveis no chat, deixa escolher o fluxo do Spec Kit (manual ou decidido pelo dev), delega a implementação ao dev, aciona o QA como gate obrigatório, e roda uma retrospectiva de feedback ao final."
argument-hint: "Opcional: um Task ID (ex. T012 ou A001), com ou sem prefixo de slug, para pular a navegação por perguntas"
compatibility: "Requires KANBAN.md (gerado por kanban-sync) e os subagentes dev/qa/designer/product-owner/scrum-master em .claude/agents/"
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
esse ID — mas ainda valide que está em **To Do** antes de prosseguir (se
estiver em Done/In Progress ou não existir, informe e pare, sem inventar
fallback).

## Passo 1 — Dados frescos

Rode **apenas a sub-rotina "Sincronização"** de `kanban-sync/SKILL.md` (a
seção `## Sincronização`, não o "modo Acompanhamento" inteiro) — sem
perguntar tipo de reunião, sem checagem de escopo, sem Retrospectiva; o
objetivo é só garantir que `KANBAN.md` reflita o `tasks.md` mais recente
antes de oferecer tarefas. Se não houver nenhuma task em To Do depois disso,
reporte "Nenhuma tarefa em To Do — todas concluídas, em progresso, ou nenhuma
feature tem tasks.md ainda (rode `speckit-tasks` numa feature, ou crie uma
tarefa avulsa via `/kanban-sync`)." e pare.

## Passo 2 — Selecionar a tarefa

Leia a seção `## To Do` de `KANBAN.md` (inclui tasks `T\d{3}` com feature e
`A\d{3}` avulsas), preservando a ordem em que aparecem.

Respeite o limite de 4 opções por chamada de `AskUserQuestion` (mais o
"Other" de texto livre, sempre disponível para o usuário digitar qualquer
Task ID fora das opções mostradas):

- **Se houver mais de uma feature/bucket com tasks em To Do E o total passar
  de 4**: pergunte primeiro por feature via `AskUserQuestion` (até 4 opções,
  rotuladas com o slug ou "avulsas", descrição "N tarefas pendentes —
  próxima: T0xx/A0xx `<descrição curta>`"). Filtre a lista para a
  feature/bucket escolhido.
- **Com a lista já filtrada** (ou desde o início, se só havia uma
  feature/bucket com pendências):
  - Até 4 tasks: ofereça todas como opções diretas (rótulo
    `T0xx/A0xx — <descrição curta>`, descrição com a fase/story ou "avulsa").
  - Mais de 4: ofereça as 3 primeiras (ordem de prioridade/dependência) + uma
    4ª opção literal **"Ver mais tarefas desta feature"**; se escolhida,
    repita com o próximo lote até acabarem.
- Se o usuário usar "Other" para digitar um ID fora das opções mostradas,
  valide que existe e está em To Do no escopo atual antes de aceitar.

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

## Passo 4 — Mover para In Progress

Edite `KANBAN.md`: mova a linha da task escolhida de `## To Do` para
`## In Progress` (remova o cabeçalho da feature em To Do se ficar vazio),
adicionando o sufixo de proveniência (`feature`, caminho de `tasks.md` — ou
"avulsa" — timestamp via `date -u +"%Y-%m-%dT%H:%MZ"`, `via /kanban-start`).
**Não edite `specs/<slug>/tasks.md`** — o checkbox lá continua `[ ]` até o
`dev` de fato terminar e marcar `[x]`.

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

Quando o `dev` reportar a task como concluída, rode o **Checkpoint de etapa**
(seção abaixo) — etapa que acabou: "o dev implementou a task"; etapa
anterior: Passo 3 (escolher o fluxo). Só depois de "Seguir" vá ao Passo 6.

## Passo 6 — Gate de QA (obrigatório)

Invoque o subagente `qa` (`subagent_type: "qa"`) com o mesmo Task
ID/descrição/caminho de `tasks.md` (e o caminho do protótipo, se houver),
pedindo que escreva e rode testes de UI e de Lógica cobrindo os critérios de
aceite dessa task/feature (ver `qa.md`).

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

Rode de novo **apenas a sub-rotina "Sincronização"** de `kanban-sync/SKILL.md`
(mesma regra do Passo 1 — sem pergunta, sem checagem de escopo, sem
Retrospectiva) para refletir o resultado das tasks com `tasks.md` (se o `dev`
marcou `[x]`, some de In Progress e aparece em Done). Para tasks avulsas
(`A\d{3}`, sem `tasks.md`), edite `KANBAN.md` você mesmo: se QA aprovou, mova
a linha de In Progress para Done; se não, ela já ficou em In Progress com a
nota do Passo 6.

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
     `scrum-master`, `fundraiser`, `qa`) ou uma das nossas skills
     (`kanban-sync`, `kanban-start`, `docs-sync`, `feature-start`,
     `quick-task`, todas em `.claude/skills/`). **Nunca edite** skills
     `speckit-*` nem nada em `.specify/`.
  2. Adicione (ou crie) uma seção `## Lições aprendidas` ao final do arquivo
     identificado, com uma entrada curta e datada (`date -u +%Y-%m-%d`): o
     que aconteceu e a regra concreta para evitar da próxima vez.
  3. Reporte ao usuário qual arquivo foi atualizado e o que foi adicionado.

Este é o procedimento canônico de retrospectiva — `kanban-sync/SKILL.md`
referencia esta seção em vez de repeti-la.

Ao final da Retrospectiva (nos dois ramos — "Sem problemas" e depois de
registrar a lição aprendida em "Encontrei um problema"), siga para o Passo
10. **Exceção**: se o fluxo parou antes por bloqueio de QA (Passo 6, retry
esgotado), a Retrospectiva nem chega a rodar — não há Passo 10 nesse caso.

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
4. Se "Commit e push", rode `git push` na sequência.

## Completion Report

```
## Tarefa iniciada via /kanban-start

- Selecionada: <slug-ou-avulsa>#<TaskID> — <descrição>
- Fluxo escolhido: <deixar o dev decidir | etapa do Spec Kit: <nome>>
- Delegada ao subagente dev
- Resultado do QA: <aprovado | reprovado (retry usado) | reprovado (bloqueado)>
- Estado no KANBAN.md: <In Progress | Done>
- docs/ atualizado: <arquivo(s) ou "nenhum">
- Commit: <hash curto + resumo do título | "só commit, sem push" | "não commitado">

Rode /kanban-start de novo para a próxima tarefa, ou /kanban-sync só para
olhar o quadro.
```

## Done When

- [ ] Uma única task foi selecionada (via `AskUserQuestion` ou `$ARGUMENTS`
      validado)
- [ ] `KANBAN.md` foi atualizado (In Progress → Done ou nota de bloqueio)
- [ ] `specs/<slug>/tasks.md` só foi tocado pelo `dev` (nunca por este
      comando diretamente)
- [ ] O subagente `dev` foi acionado com Task ID, descrição e caminhos
      exatos
- [ ] O subagente `qa` foi acionado como gate obrigatório antes de Done
- [ ] Checkpoint de etapa rodou após dev, após QA aprovar, e após
      atualização de docs (quando esta última aconteceu)
- [ ] `kanban-sync` rodou de novo após o ciclo dev/qa
- [ ] Retrospectiva rodou ao final (quando não houve bloqueio de QA)
- [ ] Depois da Retrospectiva, perguntou-se sobre commit/push e, se aceito,
      o commit seguiu Conventional Commits com corpo detalhado
