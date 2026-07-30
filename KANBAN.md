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

**Última sincronização**: 2026-07-30T22:32Z

## To Do

### 001-manage-call-for-proposals

- [ ] T001 [Setup] Criar o app Django `editais` via `uv run manage.py startapp editais` dentro de `app/` (gera `app/editais/{__init__.py,models.py,views.py,admin.py,apps.py,tests.py,migrations/}`)
- [ ] T002 [Setup] Registrar `'editais'` em `INSTALLED_APPS` e ajustar `LANGUAGE_CODE = 'pt-br'`, `TIME_ZONE = 'America/Sao_Paulo'`, `LOGIN_URL = 'login'`, `LOGIN_REDIRECT_URL = '/'`, `LOGOUT_REDIRECT_URL = '/'` em `app/config/settings.py` (depende de T001)
- [ ] T003 [Setup] Em `app/config/urls.py`, adicionar `path('accounts/', include('django.contrib.auth.urls'))` e `path('', include('editais.urls'))` (depende de T001)
- [ ] T004 [P] [Setup] Criar layout compartilhado `app/templates/base.html` (nav mínima com link para tabela/kanban/logout) — alinhar visual final com o `designer` antes de fechar a feature
- [ ] T005 [P] [Setup] Criar `app/templates/registration/login.html` mínimo exigido pela `LoginView` padrão do Django — alinhar com o `designer` antes de fechar a feature
- [ ] T006 [Foundational] Criar model `Edital` com `Estagio(TextChoices)` e a property `prazo_vencido` em `app/editais/models.py`, conforme `data-model.md` (depende de T001)
- [ ] T007 [Foundational] Gerar a migration inicial: `uv run manage.py makemigrations editais` → `app/editais/migrations/0001_initial.py` (depende de T006)
- [ ] T008 [P] [Foundational] Registrar `Edital` em `app/editais/admin.py` (list_display básico) (depende de T006)
- [ ] T009 [P] [Foundational] Criar `app/editais/forms.py` com `EditalForm(ModelForm)` sobre `Edital`, excluindo `captador` e `estagio` dos campos editáveis (depende de T006)
- [ ] T010 [P] [Foundational] Criar `app/editais/urls.py` com `app_name = "editais"` e `urlpatterns = []` vazio (depende de T003)
- [ ] T011 [US1] `TestCase` em `app/editais/tests.py`: listagem (`GET /`) exibe nome, descrição, instituição, link e datas dos editais do captador logado (FR-001, FR-012)
- [ ] T012 [US1] `TestCase` em `app/editais/tests.py`: kanban (`GET /kanban/`) exibe as 4 colunas fixas e um edital recém-criado aparece em "Backlog" (FR-002, FR-008)
- [ ] T013 [US1] `TestCase` em `app/editais/tests.py`: `POST /<id>/mover/` avança e retrocede o `estagio` corretamente, no-op nas bordas (FR-009, FR-010)
- [ ] T014 [US1] `TestCase` em `app/editais/tests.py`: listagem e kanban de um captador nunca exibem editais de outro captador (FR-015, FR-016)
- [ ] T015 [US1] `TestCase` em `app/editais/tests.py`: edital com `data_fechamento` no passado é marcado como vencido (FR-011)
- [ ] T016 [US1] Implementar `EditalListView` (`LoginRequiredMixin`, filtrado por `captador=request.user`) em `app/editais/views.py`
- [ ] T017 [US1] Criar template `app/editais/templates/editais/edital_list.html` (tabela: chamada, descrição, instituição, abertura, fechamento, link, indicação de prazo vencido) — alinhar com `designer`
- [ ] T018 [US1] Implementar `EditalKanbanView` em `app/editais/views.py`, agrupando o queryset do captador pelas 4 colunas de `Estagio`
- [ ] T019 [US1] Criar template `app/editais/templates/editais/edital_kanban.html` (4 colunas, botões "mover para trás/frente") — alinhar com `designer`; interação de referência em `prototype/avulsa-A001/`
- [ ] T020 [US1] Implementar view `mover_estagio` (POST-only, `direcao=anterior|proxima`, 404 fora do dono, no-op nas bordas) em `app/editais/views.py`
- [ ] T021 [US1] Adicionar rotas `''`, `'kanban/'` e `'<int:pk>/mover/'` em `app/editais/urls.py` (depende de T016, T018, T020)
- [ ] T022 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` com campos válidos cria o `Edital` com `captador=request.user` e `estagio=Estagio.BACKLOG` (Acceptance Scenario 1)
- [ ] T023 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` sem `nome_chamada`, `instituicao`, `link` ou `data_fechamento` não salva e retorna erro por campo (FR-005, Acceptance Scenario 2)
- [ ] T024 [US2] `TestCase` em `app/editais/tests.py`: `documentacao_exigida` e `criterios_avaliacao` são salvos como texto livre e recuperáveis (FR-006, FR-007, FR-017, Acceptance Scenario 3)
- [ ] T025 [US2] Implementar `EditalCreateView` (`LoginRequiredMixin`, `form_class=EditalForm`, seta `captador=request.user`) em `app/editais/views.py`
- [ ] T026 [US2] Criar template `app/editais/templates/editais/edital_form.html` (form de cadastro; reaproveitado por US3) — alinhar com `designer`
- [ ] T027 [US2] Adicionar rota `'novo/'` em `app/editais/urls.py` (depende de T025)
- [ ] T028 [US2] Adicionar link/botão "Novo edital" em `edital_list.html` e `edital_kanban.html` — alinhar com `designer`
- [ ] T029 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/editar/` atualiza um campo e reflete imediatamente em listagem/kanban (Acceptance Scenario 1, SC-006)
- [ ] T030 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/remover/` remove o edital, que deixa de aparecer (Acceptance Scenario 2)
- [ ] T031 [US3] `TestCase` em `app/editais/tests.py`: captador não consegue acessar `editar`/`remover` de um edital de outro captador (404) (FR-016)
- [ ] T032 [US3] Implementar `EditalUpdateView` (`LoginRequiredMixin`, queryset restrito ao dono, reaproveita `EditalForm`/`edital_form.html`) em `app/editais/views.py`
- [ ] T033 [US3] Implementar `EditalDeleteView` (`LoginRequiredMixin`, queryset restrito ao dono) em `app/editais/views.py`
- [ ] T034 [US3] Criar template `app/editais/templates/editais/edital_confirm_delete.html` (confirmação simples) — alinhar com `designer`
- [ ] T035 [US3] Adicionar rotas `'<int:pk>/editar/'` e `'<int:pk>/remover/'` em `app/editais/urls.py` (depende de T032, T033)
- [ ] T036 [US3] Adicionar links "Editar"/"Remover" por edital em `edital_list.html` e `edital_kanban.html` — alinhar com `designer`
- [ ] T037 [Polish] Rodar `uv run manage.py test editais` e garantir que toda a suíte (T011-T015, T022-T024, T029-T031) passa
- [ ] T038 [Polish] Executar o roteiro de `specs/001-manage-call-for-proposals/quickstart.md` manualmente (via `docker compose up`)
- [ ] T039 [P] [Polish] Atualizar `/home/lm/repos/frameworkfomento/CLAUDE.md` com os comandos reais de build/lint/test e a arquitetura de alto nível
- [ ] T040 [P] [Polish] Atualizar `docs/architecture-and-tech.md` e `docs/class-diagram.md` refletindo o app `editais`, o model `Edital` e o fluxo de autenticação mínima

### (avulsas)

- [ ] A001 Página com tabela de todos os editais abertos no momento
  (descrição, nome da chamada, instituição responsável, link para a chamada
  e datas importantes), com quadro Kanban para o captador de recursos mover
  cada edital entre Backlog → Em andamento → Validação → Concluído.
  Protótipo: `prototype/avulsa-A001/`. Escopo absorvido pela US1 de
  `specs/001-manage-call-for-proposals/` (ver T011-T021) — mantida aqui como
  avulsa por não ter `tasks.md` próprio; considerar fechar manualmente
  quando US1 for concluída.

## In Progress

_Nenhuma tarefa em progresso._

## Done

_Nenhuma tarefa concluída ainda._
