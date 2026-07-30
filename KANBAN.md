# Kanban Board

Fonte de verdade do quadro. As colunas **To Do** e **Done** são geradas por
`/kanban-sync` a partir dos checkboxes de `specs/*/tasks.md` — não as edite
manualmente, edite o `tasks.md` de origem e rode `/kanban-sync` de novo. A
coluna **In Progress** é a exceção: `/kanban-start` (e humanos, editando
diretamente) podem mover tasks para lá; `/kanban-sync` preserva essas
marcações entre rodadas até o checkbox correspondente virar `[x]` em
`tasks.md`. Tasks com ID `A\d{3}` (avulsas, criadas via `/kanban-sync` →
"Criar nova tarefa") não têm `tasks.md` correspondente — vivem só aqui, em
todas as colunas.

**Última sincronização**: 2026-07-30T07:29Z

## To Do

_Nenhuma feature com `tasks.md` encontrada ainda — rode `speckit-tasks` numa
feature, ou crie uma tarefa avulsa via `/kanban-sync`._

## In Progress

_Nenhuma tarefa em progresso._

## Done

_Nenhuma tarefa concluída ainda._
