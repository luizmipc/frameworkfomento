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

**Última sincronização**: 2026-07-31T07:31Z

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
- [ ] T041 [US4] `TestCase`: `GET /?busca=<termo>` filtra a tabela por nome da chamada (parcial, case-insensitive) (FR-018)
- [ ] T042 [US4] `TestCase`: `GET /?instituicao=<nome>` filtra a tabela por instituição responsável (FR-019)
- [ ] T043 [US4] `TestCase`: `GET /?ordenar=fechamento` ordena a tabela por proximidade do prazo de fechamento (FR-020)
- [ ] T044 [US4] `TestCase`: cards de uma mesma coluna do quadro aparecem ordenados por `data_fechamento`, sem alterar o agrupamento por estágio (FR-021)
- [ ] T045 [US4] `TestCase`: sem parâmetros de busca/filtro, tabela e quadro exibem todos os editais do captador
- [ ] T046 [US4] Implementar busca (`busca`) e filtro (`instituicao`) via querystring em `EditalListView`/`EditalKanbanView` (FR-018, FR-019; depende de T016, T018)
- [ ] T047 [US4] Implementar ordenação por `data_fechamento` (principal na tabela via `ordenar`; secundária dentro de cada coluna do quadro) em `app/editais/views.py` (FR-020, FR-021; depende de T046)
- [ ] T048 [P] [US4] Adicionar campos de busca/filtro/ordenação em `edital_list.html` e `edital_kanban.html` — alinhar com `designer` (depende de T046, T047)
- [ ] A007 Confirmar visualmente, ao vivo, o comportamento responsivo em
  janela estreita (~463px): o CSS de `prototype/avulsa-A001/` já parece
  correto por leitura de código (`@media (max-width: 640px)` empilha a
  tabela em cards com `data-label`), mas segue sem confirmação ao vivo
  depois de 4 tentativas em `/fundraiser-test`. Confirmado nesta sessão,
  via `javascript_tool` lendo `window.innerWidth` antes/depois de
  `resize_window`, que a ferramenta de resize do browser **não muda o
  viewport real desta aba neste ambiente** (ficou em 2556px nos dois
  momentos) — não é mais "tentar de novo do mesmo jeito", é limitação de
  ferramental confirmada e documentada (memória do projeto
  `env_browser_resize_unreliable.md`). Não é uma task de correção — segue
  como lembrete, mas só fecha com um método de verificação diferente
  (resize manual, ou emulação de dispositivo real). Protótipo:
  `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-1` (rodada 1) /
  `#dor-5` (rodada 4).
- [ ] A015 Mostrar o total de editais exibidos (geral, ou já filtrado
  quando busca/instituição estiverem ativos) perto do título ou dos
  controles de busca/filtro — hoje só existe contagem por coluna do
  Kanban (A009); saber o total exige somar de cabeça ou contar linhas
  na tabela (FR-023 em `spec.md`, User Story 4). Protótipo:
  `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-1`.
- [ ] A016 Definir e implementar o que a Tabela/Kanban exibem quando um
  edital não tem `link` (agora opcional no cadastro, FR-003) — hoje
  `renderTabela()`/`renderKanban()` atribuem `href = edital.link` sem
  checar se existe; um edital real sem link produziria um "Ver chamada"
  clicável apontando para `href="undefined"`, pior que não mostrar link
  nenhum, pois parece funcional. Não é bug do protótipo hoje (nenhum dos
  5 editais mockados tem link vazio) — é lacuna de requisito a fechar
  antes de US2 (cadastro) ser implementada de verdade. Protótipo:
  `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-1`.
- [ ] A017 Mesmo tratamento do A016, agora para `data_abertura` ausente —
  é o único outro campo que a spec já declara opcional (FR-004:
  "O sistema DEVE permitir que o captador registre... a data de abertura,
  além da data de fechamento"; Assumptions: "a data de abertura é
  desejável mas pode não estar disponível em todos os casos"). Hoje
  `formatDate()` em `script.js` não trata `abertura` ausente/vazia — um
  edital real sem ela quebraria a formatação de data em vez de mostrar um
  texto neutro. Os demais campos (`nome_chamada`, `instituicao`,
  `descricao`, `data_fechamento`) são obrigatórios por FR-003/FR-005 e
  não precisam desse tratamento. Protótipo: `prototype/avulsa-A001/`.
  Pedido direto do usuário, não via teste de persona.

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

### 001-manage-call-for-proposals

- [x] A008 Designer audita `prototype/avulsa-A001/` contra todas as tasks
  do KANBAN.md que o referenciam (A002-A007) e reconcilia qualquer gap —
  garante que o protótipo reflete de fato o que cada task descreve, sem
  depender de lembrete manual a cada nova task avulsa criada. Auditoria
  rodada em 2026-07-31: A002-A006 já corretas no código, nenhum ajuste
  necessário; A007 fora de escopo (não é task de código).
- [x] A002 Layout responsivo da tabela de editais (colunas decisivas não
  somem em janela estreita). Protótipo: `prototype/avulsa-A001/`.
  Confirmado ao vivo via browser em 2026-07-31 (ordem de colunas
  Chamada/Fechamento/Abertura/Link/Instituição/Descrição).
- [x] A003 Largura mínima das colunas do quadro Kanban (4 colunas cabem em
  desktop padrão sem rolagem). Protótipo: `prototype/avulsa-A001/`.
  Confirmado ao vivo via browser em 2026-07-31.
- [x] A004 Link da chamada no card do quadro Kanban. Protótipo:
  `prototype/avulsa-A001/`. Confirmado ao vivo via browser em 2026-07-31
  (link "Ver chamada ↗" presente em todos os cards).
- [x] A005 `tabindex="0"` supérfluo removido do card do Kanban. Protótipo:
  `prototype/avulsa-A001/`. Confirmado em 2026-07-31 (`grep tabindex` não
  retorna nada em `index.html`/`script.js`; árvore de acessibilidade só
  lista os elementos nativamente focáveis).
- [x] A006 Edital mockado com prazo vencido + indicação visual (FR-011).
  Protótipo: `prototype/avulsa-A001/`. Confirmado ao vivo via browser em
  2026-07-31 (badge "Vencido" na tabela e no card do quadro).
- [x] A009 Contagem de editais por coluna do quadro Kanban. Protótipo:
  `prototype/avulsa-A001/`. Confirmado ao vivo via browser em 2026-07-31,
  incluindo atualização dinâmica da contagem ao mover um card entre
  colunas.
- [x] A010 Protótipo de busca, filtro por instituição e ordenação por
  fechamento (User Story 4, FR-018 a FR-021). Protótipo:
  `prototype/avulsa-A001/`. Confirmado ao vivo via browser em 2026-07-31
  (busca textual, filtro populado dinamicamente com as 5 instituições,
  ordenação da tabela, e ordenação secundária dentro de cada coluna do
  quadro).
- [x] A011 Indicação de prazo próximo em níveis — 7/14/21/30 dias, amarelo
  (FR-022). Protótipo: `prototype/avulsa-A001/`. Confirmado ao vivo via
  browser em 2026-07-31 (badges "Vence em até 7 dias"/"Vence em até 21
  dias" nas duas visões, com precedência correta sobre o badge de
  vencido).
- [x] A012 Busca reconhece termo sem acento ("inovacao" encontra
  "Inovação"). Protótipo: `prototype/avulsa-A001/`. Confirmado ao vivo
  via browser em 2026-07-31.
- [x] A013 Indicador visível de busca/filtro ativo, com "Limpar filtros".
  Protótipo: `prototype/avulsa-A001/`. Confirmado ao vivo via browser em
  2026-07-31 (indicador aparece com busca e com filtro de instituição,
  "Limpar filtros" reseta os dois sem tocar a ordenação).
- [x] A014 Mensagem de estado vazio por coluna do Kanban quando o filtro
  zera o resultado ali. Protótipo: `prototype/avulsa-A001/`. Confirmado
  ao vivo via browser em 2026-07-31 (filtrando por uma instituição com 1
  único edital, as 3 colunas restantes mostraram "Nenhum edital
  encontrado com esses critérios." com contador "(0)").
