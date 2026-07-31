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
- [ ] T050 [US1] `TestCase` em `app/editais/tests.py`: `GET /kanban/` exibe, no cabeçalho de cada coluna, a quantidade de editais atualmente naquele estágio (ex.: "Validação (2)"), e a contagem atualiza imediatamente após um `POST /<id>/mover/` (FR-024, Acceptance Scenario 6)
- [ ] T057 [US1] Nota em `app/editais/tests.py` (comentário, não `TestCase`): a apresentação responsiva (FR-031, Acceptance Scenario 7 — tabela utilizável em tela estreita sem ocultar coluna; 4 colunas do kanban lado a lado em desktop padrão sem rolagem horizontal) é comportamento puramente de CSS, sem lógica de servidor variando por largura de tela — validada por revisão visual manual do `designer`/QA (ex.: DevTools em ~375px e ~1280px), não por `TestCase` de Django (que não renderiza CSS/layout); T011/T012 já cobrem que os dados/colunas existem na resposta, o que basta do lado de servidor

### Implementation for User Story 1

- [ ] T016 [US1] Implementar `EditalListView` (`LoginRequiredMixin`, `get_queryset` filtrado por `captador=request.user`) em `app/editais/views.py`
- [ ] T017 [US1] Criar template `app/editais/templates/editais/edital_list.html` (tabela: chamada, descrição, instituição, abertura, fechamento, link clicável, indicação visual de prazo vencido) — alinhar estilo final com `designer`
- [ ] T018 [US1] Implementar `EditalKanbanView` em `app/editais/views.py`, agrupando o queryset do captador pelas 4 colunas de `Estagio`
- [ ] T019 [US1] Criar template `app/editais/templates/editais/edital_kanban.html` (4 colunas, cards com botões acessíveis "mover para trás/frente", desabilitados nas bordas) — alinhar estilo final com `designer`; interação de referência em `prototype/avulsa-A001/`
- [ ] T058 [US1] [P] CSS responsivo (FR-031) para `edital_list.html` (`@media (max-width: 640px)`: empilhar a tabela em formato de card, uma linha por edital, mantendo todos os campos visíveis sem ocultar coluna) e para `edital_kanban.html` (4 colunas cabendo lado a lado em desktop padrão sem rolagem horizontal) — referência de implementação em `prototype/avulsa-A001/style.css` (mesmo breakpoint); alinhar com `designer` (depende de T017, T019)
- [ ] T051 [US1] Incluir a contagem de editais por coluna (ex.: "Validação (2)") no contexto de `EditalKanbanView` e no cabeçalho de cada coluna em `edital_kanban.html` (FR-024; depende de T018, T019)
- [ ] T020 [US1] Implementar view `mover_estagio` (POST-only, `direcao=anterior|proxima`, 404 se o edital não pertence ao `request.user`, no-op nas bordas, redireciona para `next`/`kanban`) em `app/editais/views.py`
- [ ] T021 [US1] Adicionar rotas `''`, `'kanban/'` e `'<int:pk>/mover/'` em `app/editais/urls.py` (depende de T016, T018, T020)

**Checkpoint**: US1 completo e testável de forma independente (dados de teste via `/admin/`).

---

## Phase 4: User Story 2 - Cadastrar um edital (Priority: P2)

**Goal**: Captador cadastra um edital pela própria interface (nome, instituição, descrição, link, datas, documentação exigida, critérios de avaliação), sem depender do `/admin/`.

**Independent Test**: Acessar `/novo/`, tentar salvar vazio (deve indicar campos obrigatórios faltando), preencher todos os campos e confirmar que o edital aparece completo na listagem (US1) e no `/admin/`.

### Tests for User Story 2

- [ ] T022 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` com todos os campos obrigatórios válidos cria o `Edital` com `captador=request.user` e `estagio=Estagio.BACKLOG`, e ele aparece na listagem (Acceptance Scenario 1)
- [ ] T023 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` sem `nome_chamada`, `instituicao`, `descricao` ou `data_fechamento` não salva e retorna erro por campo faltando (FR-005, Acceptance Scenario 2)
- [ ] T024 [US2] `TestCase` em `app/editais/tests.py`: `documentacao_exigida` e `criterios_avaliacao` são salvos como texto livre e recuperáveis integralmente depois (FR-006, FR-007, FR-017, Acceptance Scenario 3)
- [ ] T049 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` sem `link` salva o `Edital` com sucesso (campo opcional) e o edital aparece na listagem sem link (FR-003, Acceptance Scenario 2 revisado)

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
- [ ] T060 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/ignorar/` marca `ignorado=True` sem alterar `estagio` (FR-027, Acceptance Scenario 3)
- [ ] T061 [US3] `TestCase` em `app/editais/tests.py`: um edital com `ignorado=True` não aparece em `GET /` nem `GET /kanban/` por padrão, e não é contado no total (FR-023) nem na contagem por coluna (FR-024) (FR-028)
- [ ] T062 [US3] `TestCase` em `app/editais/tests.py`: `GET /?ignorados=1` (e o equivalente em `/kanban/`) exibe somente os editais com `ignorado=True` do captador logado (FR-029, Acceptance Scenario 4)
- [ ] T063 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/ignorar/` em um edital já ignorado desmarca `ignorado`, que volta a aparecer em `GET /`/`GET /kanban/` no mesmo `estagio` em que já estava (FR-030, Acceptance Scenario 4)

### Implementation for User Story 3

- [ ] T032 [US3] Implementar `EditalUpdateView` (`LoginRequiredMixin`, queryset restrito ao `request.user`, reaproveita `EditalForm`/`edital_form.html`) em `app/editais/views.py`
- [ ] T033 [US3] Implementar `EditalDeleteView` (`LoginRequiredMixin`, queryset restrito ao `request.user`) em `app/editais/views.py`
- [ ] T034 [US3] Criar template `app/editais/templates/editais/edital_confirm_delete.html` (confirmação simples) — alinhar com `designer`
- [ ] T035 [US3] Adicionar rotas `'<int:pk>/editar/'` e `'<int:pk>/remover/'` em `app/editais/urls.py` (depende de T032, T033)
- [ ] T036 [US3] Adicionar links "Editar"/"Remover" por edital em `edital_list.html` e `edital_kanban.html` — alinhar com `designer`
- [ ] T064 [US3] Adicionar campo `ignorado` (`BooleanField(default=False)`) ao model `Edital` em `app/editais/models.py`, conforme `data-model.md` (FR-027)
- [ ] T065 [US3] Gerar a migration incremental: `uv run manage.py makemigrations editais` → `app/editais/migrations/0002_edital_ignorado.py` (depende de T064)
- [ ] T066 [US3] Implementar view `toggle_ignorado` (POST-only, alterna `ignorado` do edital, 404 se não pertence ao `request.user`, redireciona para `next`/lista/kanban) em `app/editais/views.py` (FR-027, FR-030; depende de T064)
- [ ] T067 [US3] Adicionar rota `'<int:pk>/ignorar/'` em `app/editais/urls.py` (depende de T066)
- [ ] T068 [US3] Atualizar `get_queryset` de `EditalListView`/`EditalKanbanView` para excluir `ignorado=True` por padrão e, quando `?ignorados=1` estiver na querystring, inverter o filtro para exibir somente os ignorados; refletir essa exclusão/inclusão nas contagens de FR-023 (T055) e FR-024 (T051) em `app/editais/views.py` (FR-028, FR-029; depende de T064, T046, T051, T055)
- [ ] T069 [US3] [P] Segmented control "‹ Ativos" / "Ignorados ›" (com contagem de ignorados) em `edital_list.html` e `edital_kanban.html`, alternando o parâmetro `ignorados` na querystring e preservando `busca`/`instituicao`/`ordenar`; botão "Ignorar"/"Reverter" por edital chamando `POST /<id>/ignorar/` — alinhar com `designer`; interação/markup de referência em `prototype/avulsa-A001/index.html` (linhas 42-56) e `script.js` (linhas 126-243) (depende de T067, T068)

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
- [ ] T059 [US4] `TestCase` em `app/editais/tests.py`: `GET /?busca=inovacao` (sem acento) encontra um edital cujo `nome_chamada` contém "Inovação" (com acento) — busca ignora diferenças de acentuação (FR-018 estendido, Acceptance Scenario 1 revisado); depende de T046 tratar acentuação na comparação, não só case
- [ ] T042 [US4] `TestCase` em `app/editais/tests.py`: `GET /?instituicao=<nome>` filtra a tabela para editais daquela instituição (FR-019, Acceptance Scenario 2)
- [ ] T043 [US4] `TestCase` em `app/editais/tests.py`: `GET /?ordenar=fechamento` (e `-fechamento`) ordena a tabela por proximidade do prazo de fechamento, crescente/decrescente (FR-020, Acceptance Scenario 3)
- [ ] T044 [US4] `TestCase` em `app/editais/tests.py`: `GET /kanban/` exibe, dentro de uma mesma coluna com múltiplos editais, os cards ordenados por `data_fechamento` (mais próximo primeiro) sem alterar o agrupamento por estágio (FR-021, Acceptance Scenario 4)
- [ ] T045 [US4] `TestCase` em `app/editais/tests.py`: `GET /` e `GET /kanban/` sem parâmetros de busca/filtro exibem todos os editais do captador (Acceptance Scenario 5 — limpar busca/filtro volta ao estado completo)
- [ ] T052 [US4] `TestCase` em `app/editais/tests.py`: `GET /` e `GET /kanban/` exibem, próximo ao título/controles, o total geral de editais sem filtro ativo, e o total já filtrado (não o geral) quando `busca` e/ou `instituicao` estão aplicados (FR-023, Acceptance Scenario 6)
- [ ] T053 [US4] `TestCase` em `app/editais/tests.py`: com `busca` e/ou `instituicao` ativos, `GET /` e `GET /kanban/` exibem um indicador ("Filtrando por: ... · Limpar filtros") próximo aos controles; acionar "Limpar filtros" reseta busca e instituição juntos, em uma ação, sem alterar `ordenar` (FR-025, Acceptance Scenario 7)
- [ ] T054 [US4] `TestCase` em `app/editais/tests.py`: (a) `GET /kanban/` com `busca`/`instituicao` que esvazia uma coluna exibe "Nenhum edital encontrado com esses critérios." nessa coluna e a contagem do cabeçalho mostra 0 (FR-026, Acceptance Scenario 8); (b) caso negativo — uma coluna genuinamente sem editais naquele estágio, sem nenhum filtro ativo, permanece em branco, sem essa mensagem (Edge Case, FR-026)

### Implementation for User Story 4

- [ ] T046 [US4] Implementar busca (`busca`, contra `nome_chamada`) e filtro (`instituicao`) via querystring no `get_queryset` de `EditalListView` e `EditalKanbanView` em `app/editais/views.py` (FR-018, FR-019; depende de T016, T018)
- [ ] T047 [US4] Implementar ordenação por `data_fechamento` via querystring `ordenar` em `EditalListView` (critério principal) e ordenação secundária por `data_fechamento` dentro de cada coluna em `EditalKanbanView` (agrupamento por estágio preservado) em `app/editais/views.py` (FR-020, FR-021; depende de T046)
- [ ] T048 [US4] [P] Adicionar campos de busca/filtro/ordenação (form `GET` simples, sem JS) em `edital_list.html` e `edital_kanban.html`, preservando os parâmetros ao mover/paginar — alinhar com `designer` (depende de T046, T047)
- [ ] T055 [US4] Adicionar ao contexto de `EditalListView`/`EditalKanbanView` o total de editais exibidos (geral ou filtrado, FR-023) e um indicador de filtro ativo (`busca`/`instituicao` aplicados, FR-025); exibir ambos em `edital_list.html` e `edital_kanban.html`, com ação "Limpar filtros" que reseta `busca`/`instituicao` preservando `ordenar` (depende de T046)
- [ ] T056 [US4] Em `edital_kanban.html`, exibir "Nenhum edital encontrado com esses critérios." apenas na coluna que ficou sem cartões por causa de `busca`/`instituicao` ativos (contagem 0 no cabeçalho, FR-024/FR-026); uma coluna sem filtro ativo e sem editais naquele estágio permanece em branco, sem mensagem (Edge Case) (depende de T046, T051)

**Checkpoint**: US4 completo e testável de forma independente — não bloqueia nem é bloqueada por US1/US2/US3.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Fechar a feature — documentação viva e validação de ponta a ponta.

- [ ] T037 Rodar `uv run manage.py test editais` e garantir que toda a suíte (T011-T015, T050, T057, T022-T024, T049, T029-T031, T060-T063, T041-T045, T052-T054, T059) passa
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
- **US3 (Phase 5)**: depende de Foundational; reaproveita `edital_form.html` de US2 (T026) para o template de edição — se US2 ainda não foi implementada, T032 pode criar esse template como parte de si mesma. Exceção: T068 (filtro de `ignorado` nas contagens de FR-023/FR-024) depende de T046/T051/T055 da Phase 6 (US4) já existirem — a marcação "Ignorado" (FR-027/FR-028) só se torna testável de ponta a ponta (contagens corretas) depois que US4 implementa a contagem/filtro que ela precisa ajustar; T060/T061/T063 (marcar, ocultar da listagem simples, reverter) não têm essa dependência e podem ser feitos antes
- **US4 (Phase 6)**: depende de Foundational e de US1 (T016/T018, cujo `get_queryset` estende) — sem dependência de US2/US3 para T041-T048/T052-T056/T059; T068 de US3 depende de US4 (ver acima), não o contrário
- **Polish (Phase 7)**: depende de todas as user stories desejadas estarem completas

### Parallel Opportunities

- Setup: T004 e T005 são `[P]` (arquivos diferentes)
- Foundational: T008, T009, T010 são `[P]` entre si (arquivos diferentes), todos após T006/T007
- Entre user stories: US1, US2, US3 podem ser trabalhadas em paralelo por pessoas diferentes após Foundational (US4 depende de US1 estar pronta), com uma exceção pontual: T068 dentro de US3 depende de T046/T051/T055 de US4/US1 (ver "Phase Dependencies"); o restante de US3 (T029-T036, T060-T063, T064-T067, T069 sem o filtro `ignorados`) segue paralelizável normalmente; a ordem de prioridade recomendada é P1 → P2 → P3 → P4 (ver Implementation Strategy)
- US4: T048 é `[P]` em relação a nada dentro da própria phase (depende de T046/T047, que são sequenciais entre si)
- Polish: T039 e T040 são `[P]` entre si
- T050/T051 (contagem por coluna do kanban, FR-024) ficam dentro da Phase 3 (US1): T050 depende de T012 (kanban básico já existir para testar a contagem); T051 depende de T018/T019
- T057 (FR-031, responsivo) e T058 (implementação CSS) ficam dentro da Phase 3 (US1): T057 é uma nota, não bloqueia nada; T058 é `[P]` em relação ao resto da phase (CSS puro, sem lógica de view/model), depende apenas de T017/T019 já existirem para ter o que estilizar
- T049 (cadastro sem `link`, FR-003) fica dentro da Phase 4 (US2), mesma dependência de T022-T024: depende de T025 (`EditalCreateView`)
- T060-T063 (testes de FR-027/FR-028/FR-029/FR-030 — marcar/ocultar/visão de ignorados/reverter) e T064-T069 (implementação: campo `ignorado`, migration, view de toggle, rota, filtro nas queries/contagens, segmented control) ficam dentro da Phase 5 (US3): T064/T065 (model/migration) não dependem de nada além de T006/T007 já existirem; T066/T067 dependem de T064; T068 depende de T064 e das contagens de US4 (T046, T051, T055) — por isso T068 tem uma dependência cruzada Phase 5 → Phase 6 que não existia antes (ver nota abaixo); T069 é `[P]` em relação a T036 (arquivos de template diferentes: `edital_confirm_delete.html` vs. `edital_list.html`/`edital_kanban.html`), depende de T067/T068
- T052-T054 (testes de FR-023/FR-025/FR-026) e T055-T056 (implementação) ficam dentro da Phase 6 (US4): T055 depende de T046 (busca/filtro já implementados); T056 depende de T046 e de T051 (contagem por coluna, para exibir 0 junto da mensagem de FR-026)
- T059 (busca ignora acentuação, FR-018 estendido) fica dentro da Phase 6 (US4), mesma dependência de T041: depende de T046

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
- `link` é opcional no cadastro (`URLField(blank=True)`, FR-003 revisado pelo clarify de 2026-07-31) — ver `research.md` para a decisão atualizada; T023 testa os campos obrigatórios restantes e T049 cobre o caso positivo de cadastro sem `link`
- Remoção de edital (US3) é exclusão definitiva (hard delete) — ver `research.md`
- US4 (T041-T048) foi adicionada depois das demais, a partir de uma dor real encontrada via `/fundraiser-test` (`docs/persona/avulsa-A001.html#dor-2`), formalizada em `spec.md` como FR-018 a FR-021
- T052-T056 (FR-023/FR-025/FR-026 — total exibido, indicador de filtro ativo, mensagem de coluna vazia por filtro) e T050-T051 (FR-024 — contagem por coluna) formalizam comportamentos já implementados no protótipo `prototype/avulsa-A001/` (tasks A009/A013/A014 do quadro do projeto) que não tinham task correspondente em `tasks.md`; adicionadas por `speckit-analyze` (achados F7-F9)
- T057-T069 formalizam FR-018 (busca sem acento, estendido), FR-027 a FR-030 (marcar/ocultar/reverter "Ignorado") e FR-031 (novo, apresentação responsiva) — os três achados mais recentes de `speckit-analyze`/revisão de spec, sem task correspondente antes desta rodada:
  - **FR-018 (busca sem acento)**: não recebeu uma task de implementação separada de T046 — é tratada como extensão natural do mesmo filtro de busca (T046 já faz `nome_chamada__icontains=busca`; ignorar acentuação é um ajuste de normalização na mesma linha de código, ex.: usar `unicodedata.normalize`/`strip` dos dois lados da comparação em Python, já que o projeto roda em SQLite sem extensão `unaccent` — não em uma segunda função ou view). Só T059 (`TestCase`) foi adicionada; T046 permanece a única task de implementação e passa a cobrir os dois casos (com/sem acento).
  - **FR-027 a FR-030 (Ignorado)**: era a lacuna maior — nenhuma task cobria o campo, a view de alternância ou o segmented control antes desta rodada. Adicionadas T060-T063 (testes) e T064-T069 (model+migration, view de toggle, rota, filtro nas queries/contagens, template) dentro da Phase 5 (US3), reaproveitando a infraestrutura de contagem/querystring que US4 já implementa (T046/T051/T055) em vez de duplicá-la — daí a dependência cruzada T068 → US4 registrada em "Phase Dependencies".
  - **FR-031 (responsivo)**: tratada como comportamento majoritariamente de CSS. T057 registra que a verificação primária é revisão visual manual do `designer`/QA (Acceptance Scenario 7 não é verificável por `TestCase` de Django, que não renderiza layout/CSS); T058 é a única task de implementação, `@media (max-width: 640px)` para a tabela e ajuste de largura das colunas do kanban, usando `prototype/avulsa-A001/style.css` como referência direta de implementação (mesmo breakpoint já validado no protótipo).
  - `data-model.md` foi atualizado para incluir o campo `ignorado` (`BooleanField(default=False)`) na tabela de campos de `Edital`, que faltava desde que FR-027-030 foram formalizados em `spec.md` (não existia quando `data-model.md` foi gerado originalmente).
- Commitar após cada task ou grupo lógico de tasks
