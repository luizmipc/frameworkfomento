---
name: "quick-task"
description: "Cria uma tarefa avulsa (via kanban-sync) e já a inicia com kanban-start, em um só comando — para ajustes pequenos e pontuais que não precisam de spec formal. Use quando a intenção for 'quero corrigir/ajustar algo pequeno agora'."
argument-hint: "Descrição do ajuste (linguagem natural) — se vazio, pergunta no chat"
compatibility: "Requires as skills kanban-sync e kanban-start"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/quick-task/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando é o ponto de entrada para o caminho "ajuste pequeno" descrito no
README: `kanban-sync (criar nova tarefa) → kanban-start`, em um só passo. Para
uma feature grande que merece spec própria, use `/feature-start` em vez
deste.

**Regressão/bug encontrado numa task já Done**: não existe (nem deve existir)
um comando para "reabrir" uma task — `tasks.md`/`KANBAN.md` são um registro
histórico (`[x]` = feito, ponto final). A forma correta é rodar `/quick-task`
descrevendo o bug e **referenciando o ID original na descrição** (ex.:
"Corrige regressão em T012: formulário não valida CPF vazio"). Isso cria uma
task nova e rastreável (`T012` foi feito; a nova, ex. `A007`, corrigiu um bug
nele) em vez de apagar o histórico de que a primeira entrega aconteceu. Se um
`docs/*.md` também estava errado por causa desse bug, o dono do arquivo
(`dev`/`product-owner`/`qa`, conforme o caso) o atualiza para refletir a
verdade atual — não se cria uma seção de "correção" separada.

## Passo 1 — Criar a tarefa avulsa

Rode o **"Modo Criar nova tarefa"** de `kanban-sync/SKILL.md` com a descrição
de `$ARGUMENTS` (ou peça a descrição no chat primeiro, se vazio) — **mas pare
ao final do passo 8 dele (Sincronização); não execute o passo 9 (Retrospectiva)
dele**. A retrospectiva deste fluxo combinado é só a do `kanban-start`, no
final (Passo 3 abaixo) — evita perguntar feedback duas vezes.

Anote o ID da tarefa criada (`A\d{3}`, com o slug/feature ou "avulsa" que
`kanban-sync` tiver atribuído).

## Passo 2 — Iniciar a tarefa

Invoque `Skill(skill="kanban-start", args="<ID da tarefa do Passo 1>")`,
passando o ID direto — isso pula a navegação por perguntas do Passo 2 de
`kanban-start` (já sabemos qual tarefa é) e segue seu fluxo normal: mover para
In Progress, delegar ao `dev`, gate do `qa`, refletir o resultado, atualização
condicional de `docs/`, e a Retrospectiva final.

## Passo 3

Nenhuma ação adicional — `kanban-start` já cobre a Retrospectiva deste fluxo
combinado (ver Passo 1).

## Completion Report

```
## Tarefa rápida via /quick-task

- Task criada: <slug-ou-avulsa>#<TaskID> — <descrição>
- (relatório completo de implementação/QA é o do /kanban-start, já emitido)
```

## Done When

- [ ] Tarefa avulsa criada em `KANBAN.md` (sem retrospectiva própria nesse
      passo)
- [ ] `kanban-start` foi invocado com o ID direto, sem repetir a seleção
- [ ] Uma única Retrospectiva rodou no total (a do `kanban-start`)
