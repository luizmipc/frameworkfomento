---

description: "Task list for feature 001-manage-call-for-proposals"
---

# Tasks: Gerenciamento de Editais de Fomento

**Input**: Design documents from `/specs/001-manage-call-for-proposals/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/urls.md, quickstart.md

**Tests**: Incluídos — a Constitution do projeto (Princípio III, "Qualidade
Verificável Antes de Pronto") exige que toda task tenha teste cobrindo os
critérios de aceite antes de sair de "In Progress" para "Done"; não é uma
adição especulativa desta lista de tasks.

**Organization**: Tasks agrupadas por user story (US1/US2/US3/US4, prioridade
P1/P2/P3/P4 conforme `spec.md`), para permitir implementação e teste
independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de outra task incompleta)
- **[Story]**: A qual user story a task pertence (US1, US2, US3, US4)
- Caminhos de arquivo são absolutos/relativos à raiz do repo em `app/`

## Path Conventions

Projeto Django único em `app/` (ver `plan.md` → Project Structure): app novo
`app/editais/`, templates em `app/editais/templates/editais/` e
`app/templates/` (layout compartilhado), configuração em `app/config/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criar o app Django e ligar a infraestrutura mínima (settings, urls, layout base) antes de qualquer model/view.

- [ ] T001 Criar o app Django `editais` via `uv run manage.py startapp editais` dentro de `app/` (gera `app/editais/{__init__.py,models.py,views.py,admin.py,apps.py,tests.py,migrations/}`)
- [ ] T002 Registrar `'editais'` em `INSTALLED_APPS` e ajustar `LANGUAGE_CODE = 'pt-br'`, `TIME_ZONE = 'America/Sao_Paulo'`, `LOGIN_URL = 'login'`, `LOGIN_REDIRECT_URL = '/'`, `LOGOUT_REDIRECT_URL = '/'` em `app/config/settings.py` (depende de T001; ver research.md)
- [ ] T003 Em `app/config/urls.py`, adicionar `path('accounts/', include('django.contrib.auth.urls'))` e `path('', include('editais.urls'))` (depende de T001)
- [ ] T004 [P] Criar layout compartilhado `app/templates/base.html` (nav mínima com link para tabela/kanban/logout) — usar markup simples por ora; alinhar visual final com o `designer` antes de fechar a feature
- [ ] T005 [P] Criar `app/templates/registration/login.html` mínimo exigido pela `LoginView` padrão do Django (form de usuário/senha, sem estilização própria além do `base.html`) — alinhar com o `designer` antes de fechar a feature

**Checkpoint**: App Django existe, está registrado, roteável e com login funcional (ainda sem dados/telas de negócio).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Model, migration, form e rotas vazias que TODAS as user stories dependem.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa.

- [ ] T006 Criar model `Edital` com `Estagio(TextChoices)` e a property `prazo_vencido` em `app/editais/models.py`, conforme `data-model.md` (campos `captador` FK, `nome_chamada`, `instituicao`, `descricao`, `link`, `data_abertura`, `data_fechamento`, `documentacao_exigida`, `criterios_avaliacao`, `estagio`, `criado_em`, `atualizado_em`) (depende de T001)
- [ ] T007 Gerar a migration inicial: `uv run manage.py makemigrations editais` → `app/editais/migrations/0001_initial.py` (depende de T006)
- [ ] T008 [P] Registrar `Edital` em `app/editais/admin.py` (list_display básico) — permite ao `dev`/`qa` popular dados de teste via `/admin/` antes de US2 existir (depende de T006)
- [ ] T009 [P] Criar `app/editais/forms.py` com `EditalForm(ModelForm)` sobre `Edital`, excluindo `captador` e `estagio` dos campos editáveis pelo usuário (depende de T006)
- [ ] T010 [P] Criar `app/editais/urls.py` com `app_name = "editais"` e `urlpatterns = []` vazio, pronto para receber as rotas de cada user story (depende de T003)

**Checkpoint**: Model, migration, form e roteamento-base prontos — user stories podem começar.

---

## Phase 3: User Story 1 - Acompanhar editais em um quadro de progresso (Priority: P1) 🎯 MVP

**Goal**: Captador vê todos os seus editais em tabela e em quadro de 4 colunas (Backlog/Em andamento/Validação/Concluído), e move um edital entre colunas em qualquer direção.

**Independent Test**: Popular 2-3 editais via `/admin/` (T008), acessar `/` e `/kanban/`, confirmar que aparecem corretamente e que dá para mover um card entre as 4 colunas nos dois sentidos.

### Tests for User Story 1

> Escrever estas tasks primeiro; devem falhar antes da implementação abaixo.

- [ ] T011 [US1] `TestCase` em `app/editais/tests.py`: listagem (`GET /`) exibe nome, descrição, instituição, link e datas dos editais do captador logado, com link clicável (FR-001, FR-012)
- [ ] T012 [US1] `TestCase` em `app/editais/tests.py`: kanban (`GET /kanban/`) exibe as 4 colunas fixas e um edital recém-criado aparece em "Backlog" (FR-002, FR-008)
- [ ] T013 [US1] `TestCase` em `app/editais/tests.py`: `POST /<id>/mover/` avança e retrocede o `estagio` corretamente, e é no-op nas bordas (Backlog não retrocede, Concluído não avança) (FR-009, FR-010)
- [ ] T014 [US1] `TestCase` em `app/editais/tests.py`: listagem e kanban de um captador nunca exibem editais de outro captador (FR-015, FR-016)
- [ ] T015 [US1] `TestCase` em `app/editais/tests.py`: edital com `data_fechamento` no passado é marcado como vencido na resposta (via `prazo_vencido`/contexto do template) (FR-011)

### Implementation for User Story 1

- [ ] T016 [US1] Implementar `EditalListView` (`LoginRequiredMixin`, `get_queryset` filtrado por `captador=request.user`) em `app/editais/views.py`
- [ ] T017 [US1] Criar template `app/editais/templates/editais/edital_list.html` (tabela: chamada, descrição, instituição, abertura, fechamento, link clicável, indicação visual de prazo vencido) — alinhar estilo final com `designer`
- [ ] T018 [US1] Implementar `EditalKanbanView` em `app/editais/views.py`, agrupando o queryset do captador pelas 4 colunas de `Estagio`
- [ ] T019 [US1] Criar template `app/editais/templates/editais/edital_kanban.html` (4 colunas, cards com botões acessíveis "mover para trás/frente", desabilitados nas bordas) — alinhar estilo final com `designer`; interação de referência em `prototype/avulsa-A001/`
- [ ] T020 [US1] Implementar view `mover_estagio` (POST-only, `direcao=anterior|proxima`, 404 se o edital não pertence ao `request.user`, no-op nas bordas, redireciona para `next`/`kanban`) em `app/editais/views.py`
- [ ] T021 [US1] Adicionar rotas `''`, `'kanban/'` e `'<int:pk>/mover/'` em `app/editais/urls.py` (depende de T016, T018, T020)

**Checkpoint**: US1 completo e testável de forma independente (dados de teste via `/admin/`).

---

## Phase 4: User Story 2 - Cadastrar um edital (Priority: P2)

**Goal**: Captador cadastra um edital pela própria interface (nome, instituição, descrição, link, datas, documentação exigida, critérios de avaliação), sem depender do `/admin/`.

**Independent Test**: Acessar `/novo/`, tentar salvar vazio (deve indicar campos obrigatórios faltando), preencher todos os campos e confirmar que o edital aparece completo na listagem (US1) e no `/admin/`.

### Tests for User Story 2

- [ ] T022 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` com todos os campos obrigatórios válidos cria o `Edital` com `captador=request.user` e `estagio=Estagio.BACKLOG`, e ele aparece na listagem (Acceptance Scenario 1)
- [ ] T023 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` sem `nome_chamada`, `instituicao`, `link` ou `data_fechamento` não salva e retorna erro por campo faltando (FR-005, Acceptance Scenario 2)
- [ ] T024 [US2] `TestCase` em `app/editais/tests.py`: `documentacao_exigida` e `criterios_avaliacao` são salvos como texto livre e recuperáveis integralmente depois (FR-006, FR-007, FR-017, Acceptance Scenario 3)

### Implementation for User Story 2

- [ ] T025 [US2] Implementar `EditalCreateView` (`LoginRequiredMixin`, `form_class=EditalForm`, `form_valid` seta `captador=request.user`) em `app/editais/views.py`
- [ ] T026 [US2] Criar template `app/editais/templates/editais/edital_form.html` (form de cadastro; reaproveitado por US3 para edição) — alinhar com `designer`
- [ ] T027 [US2] Adicionar rota `'novo/'` em `app/editais/urls.py` (depende de T025)
- [ ] T028 [US2] Adicionar link/botão "Novo edital" para `/novo/` em `edital_list.html` e `edital_kanban.html` — alinhar com `designer`

**Checkpoint**: US1 + US2 funcionam juntos — cadastro real pela UI, sem depender do `/admin/`.

---

## Phase 5: User Story 3 - Manter os dados de um edital atualizados (Priority: P3)

**Goal**: Captador edita qualquer dado de um edital já cadastrado ou o remove da lista ativa.

**Independent Test**: Editar a data de fechamento de um edital existente e confirmar reflexo imediato em `/` e `/kanban/`; remover um edital e confirmar que some das duas visões.

### Tests for User Story 3

- [ ] T029 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/editar/` atualiza um campo (ex.: `data_fechamento`) e a mudança aparece imediatamente na listagem/kanban (Acceptance Scenario 1, SC-006)
- [ ] T030 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/remover/` remove o edital, que deixa de aparecer na listagem/kanban (Acceptance Scenario 2)
- [ ] T031 [US3] `TestCase` em `app/editais/tests.py`: captador não consegue acessar `editar`/`remover` de um edital de outro captador (404) (FR-016)

### Implementation for User Story 3

- [ ] T032 [US3] Implementar `EditalUpdateView` (`LoginRequiredMixin`, queryset restrito ao `request.user`, reaproveita `EditalForm`/`edital_form.html`) em `app/editais/views.py`
- [ ] T033 [US3] Implementar `EditalDeleteView` (`LoginRequiredMixin`, queryset restrito ao `request.user`) em `app/editais/views.py`
- [ ] T034 [US3] Criar template `app/editais/templates/editais/edital_confirm_delete.html` (confirmação simples) — alinhar com `designer`
- [ ] T035 [US3] Adicionar rotas `'<int:pk>/editar/'` e `'<int:pk>/remover/'` em `app/editais/urls.py` (depende de T032, T033)
- [ ] T036 [US3] Adicionar links "Editar"/"Remover" por edital em `edital_list.html` e `edital_kanban.html` — alinhar com `designer`

**Checkpoint**: Todas as user stories (US1, US2, US3) funcionam de forma independente e integrada.

---

## Phase 6: User Story 4 - Localizar um edital específico entre muitos (Priority: P4)

**Goal**: Captador busca editais por nome da chamada, filtra por instituição
responsável e ordena por data de fechamento (tabela: critério principal;
quadro: critério secundário dentro de cada coluna) — tanto na tabela quanto
no quadro de progresso. Adicionada a partir de uma dor real encontrada em
`docs/persona/avulsa-A001.html#dor-2` (teste de usabilidade via
`/fundraiser-test`), formalizada como FR-018 a FR-021 em `spec.md`.

**Independent Test**: Cadastrar vários editais com nomes/instituições/datas
de fechamento diferentes; na tabela, buscar por termo parcial do nome,
filtrar por instituição e ordenar por data de fechamento, confirmando o
resultado esperado em cada caso; separadamente, confirmar que os cards
dentro de uma mesma coluna do quadro aparecem ordenados por proximidade do
prazo, sem mudar de coluna.

### Tests for User Story 4

- [ ] T041 [US4] `TestCase` em `app/editais/tests.py`: `GET /?busca=<termo>` filtra a tabela para editais cujo `nome_chamada` contém o termo (parcial, case-insensitive) (FR-018, Acceptance Scenario 1)
- [ ] T042 [US4] `TestCase` em `app/editais/tests.py`: `GET /?instituicao=<nome>` filtra a tabela para editais daquela instituição (FR-019, Acceptance Scenario 2)
- [ ] T043 [US4] `TestCase` em `app/editais/tests.py`: `GET /?ordenar=fechamento` (e `-fechamento`) ordena a tabela por proximidade do prazo de fechamento, crescente/decrescente (FR-020, Acceptance Scenario 3)
- [ ] T044 [US4] `TestCase` em `app/editais/tests.py`: `GET /kanban/` exibe, dentro de uma mesma coluna com múltiplos editais, os cards ordenados por `data_fechamento` (mais próximo primeiro) sem alterar o agrupamento por estágio (FR-021, Acceptance Scenario 4)
- [ ] T045 [US4] `TestCase` em `app/editais/tests.py`: `GET /` e `GET /kanban/` sem parâmetros de busca/filtro exibem todos os editais do captador (Acceptance Scenario 5 — limpar busca/filtro volta ao estado completo)

### Implementation for User Story 4

- [ ] T046 [US4] Implementar busca (`busca`, contra `nome_chamada`) e filtro (`instituicao`) via querystring no `get_queryset` de `EditalListView` e `EditalKanbanView` em `app/editais/views.py` (FR-018, FR-019; depende de T016, T018)
- [ ] T047 [US4] Implementar ordenação por `data_fechamento` via querystring `ordenar` em `EditalListView` (critério principal) e ordenação secundária por `data_fechamento` dentro de cada coluna em `EditalKanbanView` (agrupamento por estágio preservado) em `app/editais/views.py` (FR-020, FR-021; depende de T046)
- [ ] T048 [US4] [P] Adicionar campos de busca/filtro/ordenação (form `GET` simples, sem JS) em `edital_list.html` e `edital_kanban.html`, preservando os parâmetros ao mover/paginar — alinhar com `designer` (depende de T046, T047)

**Checkpoint**: US4 completo e testável de forma independente — não bloqueia nem é bloqueada por US1/US2/US3.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Fechar a feature — documentação viva e validação de ponta a ponta.

- [ ] T037 Rodar `uv run manage.py test editais` e garantir que toda a suíte (T011-T015, T022-T024, T029-T031, T041-T045) passa
- [ ] T038 Executar o roteiro de `specs/001-manage-call-for-proposals/quickstart.md` manualmente (via `docker compose up`), confirmando os 5 passos (login, US2, US1, US3, isolamento por captador)
- [ ] T039 [P] Atualizar `/home/lm/repos/frameworkfomento/CLAUDE.md` com os comandos reais de build/lint/test (`uv run manage.py runserver`, `uv run manage.py test`, `uv run manage.py migrate`) e a arquitetura de alto nível (app `editais`, model `Edital`, auth via `django.contrib.auth`)
- [ ] T040 [P] Atualizar `docs/architecture-and-tech.md` e `docs/class-diagram.md` refletindo o app `editais`, o model `Edital` e o fluxo de autenticação mínima

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — começa imediatamente
- **Foundational (Phase 2)**: depende de Setup — bloqueia todas as user stories
- **US1 (Phase 3)**: depende de Foundational; sem dependência de US2/US3 (dados de teste via `/admin/`, T008)
- **US2 (Phase 4)**: depende de Foundational; usa o mesmo `EditalForm`/model de US1 mas é testável e entregável de forma independente
- **US3 (Phase 5)**: depende de Foundational; reaproveita `edital_form.html` de US2 (T026) para o template de edição — se US2 ainda não foi implementada, T032 pode criar esse template como parte de si mesma
- **US4 (Phase 6)**: depende de Foundational e de US1 (T016/T018, cujo `get_queryset` estende) — sem dependência de US2/US3
- **Polish (Phase 7)**: depende de todas as user stories desejadas estarem completas

### Parallel Opportunities

- Setup: T004 e T005 são `[P]` (arquivos diferentes)
- Foundational: T008, T009, T010 são `[P]` entre si (arquivos diferentes), todos após T006/T007
- Entre user stories: US1, US2, US3 podem ser trabalhadas em paralelo por pessoas diferentes após Foundational (US4 depende de US1 estar pronta); a ordem de prioridade recomendada é P1 → P2 → P3 → P4 (ver Implementation Strategy)
- US4: T048 é `[P]` em relação a nada dentro da própria phase (depende de T046/T047, que são sequenciais entre si)
- Polish: T039 e T040 são `[P]` entre si

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Phase 1 (Setup) + Phase 2 (Foundational)
2. Completar Phase 3 (US1) — popular dados via `/admin/` (T008)
3. **PARAR e VALIDAR**: US1 testável isoladamente (listagem + kanban + mover estágio)

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → validar independentemente → MVP demonstrável (com dados via `/admin/`)
3. US2 → validar independentemente → cadastro real pela UI substitui a necessidade do `/admin/`
4. US3 → validar independentemente → edição/remoção completam o ciclo de vida do edital
5. US4 → validar independentemente → busca/filtro/ordenação (útil a partir de um volume real de editais; não bloqueia as demais)
6. Polish → documentação viva atualizada, suíte de testes verde, quickstart validado

---

## Notes

- `[P]` = arquivos diferentes, sem dependência de task incompleta
- Toda task de template (`T004, T005, T017, T019, T026, T034, T028, T036, T048`) usa markup Django simples e funcional; a forma final (CSS, disposição visual) é responsabilidade do `designer` e deve ser revisada com ele antes de considerar a feature pronta para release, por regra de handoff do `dev`
- `link` continua obrigatório no cadastro (FR-003/FR-005) — ver `research.md` para a justificativa de não afrouxar esse requisito nesta rodada
- Remoção de edital (US3) é exclusão definitiva (hard delete) — ver `research.md`
- US4 (T041-T048) foi adicionada depois das demais, a partir de uma dor real encontrada via `/fundraiser-test` (`docs/persona/avulsa-A001.html#dor-2`), formalizada em `spec.md` como FR-018 a FR-021
- Commitar após cada task ou grupo lógico de tasks
