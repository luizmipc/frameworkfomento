# Contrato de rotas: Gerenciamento de Editais de Fomento

Esta feature não expõe API pública/REST — é uma aplicação Django
server-rendered. O "contrato" relevante é o conjunto de rotas HTTP e o que
cada uma garante, para orientar templates, testes e a implementação.

Todas as rotas abaixo exigem sessão autenticada (`LoginRequiredMixin`) e
operam exclusivamente sobre editais do `request.user` — qualquer tentativa
de acessar/editar/remover um `id` que não pertença ao usuário logado retorna
`404` (não `403`, para não vazar a existência do registro de outro
captador).

| Método | Rota                          | View                     | Cobre           | Efeito |
|--------|--------------------------------|--------------------------|-----------------|--------|
| GET    | `/`                             | `EditalListView`          | FR-001, US1     | Tabela com todos os editais do captador logado. |
| GET    | `/kanban/`                      | `EditalKanbanView`        | FR-002, US1     | Quadro com 4 colunas fixas (Backlog/Em andamento/Validação/Concluído), editais agrupados por `estagio`. |
| POST   | `/<int:pk>/mover/`                | `mover_estagio`           | FR-009, FR-010, US1 | Body: `direcao=anterior\|proxima`. Atualiza `estagio` um passo na direção pedida (sem sair dos 4 valores); redireciona de volta para `/kanban/` (ou `next` param). |
| GET/POST | `/novo/`                       | `EditalCreateView`        | FR-003–FR-008, US2 | GET exibe formulário; POST valida campos obrigatórios (FR-005) e cria com `estagio=BACKLOG` e `captador=request.user`. |
| GET/POST | `/<int:pk>/editar/`             | `EditalUpdateView`        | FR-013, US3     | Edita qualquer campo do edital (exceto `captador`/`estagio`, que não passam por este form). |
| GET/POST | `/<int:pk>/remover/`            | `EditalDeleteView`        | FR-014, US3     | GET confirma, POST remove definitivamente (ver research.md — hard delete). |
| —      | `/accounts/login/`, `/accounts/logout/` | views prontas de `django.contrib.auth.urls` | pré-requisito de FR-015/FR-016 | Login/logout mínimos — fora do escopo funcional desta spec, apenas infraestrutura. |

## Garantias por rota (o que os testes de `qa`/`dev` devem cobrir)

- `EditalListView`/`EditalKanbanView`: nunca retornam edital de outro
  `captador`; exibem indicação visual quando `prazo_vencido` é `True`
  (FR-011); link do edital é um `<a href>` clicável (FR-012).
- `mover_estagio`: idempotente nas bordas — tentar mover "para trás" a
  partir de `BACKLOG` ou "para frente" a partir de `CONCLUIDO` é um no-op
  (não lança erro, apenas não muda o estágio), consistente com o botão
  desabilitado no protótipo de A001.
- `EditalCreateView`: falha de validação (campo obrigatório ausente)
  re-renderiza o form com os erros por campo, sem perder os dados já
  digitados (comportamento padrão de `ModelForm` inválido).
- `EditalUpdateView`/`mover_estagio`: mudança é refletida imediatamente em
  ambas as visões (FR-010/FR-013/SC-006) — como não há cache, isso é
  garantido por construção (mesma fonte de dados, sem estado duplicado).
- `EditalDeleteView`: após confirmação, o edital não aparece mais em
  `EditalListView` nem `EditalKanbanView` (FR-014, Acceptance Scenario US3.2).
