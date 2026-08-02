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

**Última sincronização**: 2026-08-02T03:01Z

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
- [ ] T050 [US1] `TestCase` em `app/editais/tests.py`: `GET /kanban/` exibe, no cabeçalho de cada coluna, a quantidade de editais atualmente naquele estágio, atualizada imediatamente após mover um card (FR-024, Acceptance Scenario 6)
- [ ] T057 [US1] Nota (não `TestCase`): apresentação responsiva (FR-031) é validada por revisão visual manual do `designer`/QA, não por teste de Django (CSS/layout não é server-testável)
- [ ] T016 [US1] Implementar `EditalListView` (`LoginRequiredMixin`, filtrado por `captador=request.user`) em `app/editais/views.py`
- [ ] T017 [US1] Criar template `app/editais/templates/editais/edital_list.html` (tabela: chamada, descrição, instituição, abertura, fechamento, link, indicação de prazo vencido) — alinhar com `designer`
- [ ] T018 [US1] Implementar `EditalKanbanView` em `app/editais/views.py`, agrupando o queryset do captador pelas 4 colunas de `Estagio`
- [ ] T019 [US1] Criar template `app/editais/templates/editais/edital_kanban.html` (4 colunas, botões "mover para trás/frente") — alinhar com `designer`; interação de referência em `prototype/avulsa-A001/`
- [ ] T058 [P] [US1] CSS responsivo (FR-031) para `edital_list.html` (empilha em cards, `@media (max-width: 640px)`) e `edital_kanban.html` (4 colunas sem rolagem) — referência: `prototype/avulsa-A001/style.css` (depende de T017, T019)
- [ ] T051 [US1] Incluir a contagem de editais por coluna no contexto de `EditalKanbanView` e no cabeçalho de cada coluna em `edital_kanban.html` (FR-024; depende de T018, T019)
- [ ] T020 [US1] Implementar view `mover_estagio` (POST-only, `direcao=anterior|proxima`, 404 fora do dono, no-op nas bordas) em `app/editais/views.py`
- [ ] T021 [US1] Adicionar rotas `''`, `'kanban/'` e `'<int:pk>/mover/'` em `app/editais/urls.py` (depende de T016, T018, T020)
- [ ] T022 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` com campos válidos cria o `Edital` com `captador=request.user` e `estagio=Estagio.BACKLOG` (Acceptance Scenario 1)
- [ ] T023 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` sem `nome_chamada`, `instituicao`, `descricao` ou `data_fechamento` não salva e retorna erro por campo (FR-005, Acceptance Scenario 2)
- [ ] T024 [US2] `TestCase` em `app/editais/tests.py`: `documentacao_exigida` e `criterios_avaliacao` são salvos como texto livre e recuperáveis (FR-006, FR-007, FR-017, Acceptance Scenario 3)
- [ ] T049 [US2] `TestCase` em `app/editais/tests.py`: `POST /novo/` sem `link` salva o `Edital` com sucesso (campo opcional) e ele aparece na listagem sem link (FR-003, Acceptance Scenario 2 revisado)
- [ ] T025 [US2] Implementar `EditalCreateView` (`LoginRequiredMixin`, `form_class=EditalForm`, seta `captador=request.user`) em `app/editais/views.py`
- [ ] T026 [US2] Criar template `app/editais/templates/editais/edital_form.html` (form de cadastro; reaproveitado por US3) — alinhar com `designer`
- [ ] T027 [US2] Adicionar rota `'novo/'` em `app/editais/urls.py` (depende de T025)
- [ ] T028 [US2] Adicionar link/botão "Novo edital" em `edital_list.html` e `edital_kanban.html` — alinhar com `designer`
- [ ] T029 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/editar/` atualiza um campo e reflete imediatamente em listagem/kanban (Acceptance Scenario 1, SC-006)
- [ ] T030 [US3] `TestCase` em `app/editais/tests.py`: `POST /<id>/remover/` remove o edital, que deixa de aparecer (Acceptance Scenario 2)
- [ ] T031 [US3] `TestCase` em `app/editais/tests.py`: captador não consegue acessar `editar`/`remover` de um edital de outro captador (404) (FR-016)
- [ ] T060 [US3] `TestCase`: `POST /<id>/ignorar/` marca `ignorado=True` sem alterar `estagio` (FR-027, Acceptance Scenario 3)
- [ ] T061 [US3] `TestCase`: edital ignorado não aparece em `/` nem `/kanban/` por padrão, nem é contado (FR-023/FR-024) (FR-028)
- [ ] T062 [US3] `TestCase`: `GET /?ignorados=1` exibe só os editais ignorados do captador (FR-029, Acceptance Scenario 4)
- [ ] T063 [US3] `TestCase`: desmarcar um edital ignorado o traz de volta, no mesmo `estagio` de antes (FR-030, Acceptance Scenario 4)
- [ ] T032 [US3] Implementar `EditalUpdateView` (`LoginRequiredMixin`, queryset restrito ao dono, reaproveita `EditalForm`/`edital_form.html`) em `app/editais/views.py`
- [ ] T033 [US3] Implementar `EditalDeleteView` (`LoginRequiredMixin`, queryset restrito ao dono) em `app/editais/views.py`
- [ ] T034 [US3] Criar template `app/editais/templates/editais/edital_confirm_delete.html` (confirmação simples) — alinhar com `designer`
- [ ] T035 [US3] Adicionar rotas `'<int:pk>/editar/'` e `'<int:pk>/remover/'` em `app/editais/urls.py` (depende de T032, T033)
- [ ] T036 [US3] Adicionar links "Editar"/"Remover" por edital em `edital_list.html` e `edital_kanban.html` — alinhar com `designer`
- [ ] T064 [US3] Adicionar campo `ignorado` (`BooleanField(default=False)`) ao model `Edital` (FR-027)
- [ ] T065 [US3] Gerar migration incremental `0002_edital_ignorado.py` (depende de T064)
- [ ] T066 [US3] Implementar view `toggle_ignorado` (POST-only, 404 fora do dono) (FR-027, FR-030; depende de T064)
- [ ] T067 [US3] Adicionar rota `'<int:pk>/ignorar/'` (depende de T066)
- [ ] T068 [US3] Filtrar `ignorado=True` por padrão (inverte com `?ignorados=1`) em `EditalListView`/`EditalKanbanView`, refletindo nas contagens FR-023/FR-024 (FR-028, FR-029; depende de T064, T046, T051, T055)
- [ ] T069 [P] [US3] Segmented control `‹ Ativos` / `Ignorados ›` com botão Ignorar/Reverter em `edital_list.html`/`edital_kanban.html` — alinhar com `designer`; referência em `prototype/avulsa-A001/` (depende de T067, T068)
- [ ] T041 [US4] `TestCase`: `GET /?busca=<termo>` filtra a tabela por nome da chamada (parcial, case-insensitive) (FR-018)
- [ ] T059 [US4] `TestCase`: `GET /?busca=inovacao` (sem acento) encontra edital com "Inovação" — busca ignora acentuação (FR-018 estendido; depende de T046)
- [ ] T042 [US4] `TestCase`: `GET /?instituicao=<nome>` filtra a tabela por instituição responsável (FR-019)
- [ ] T043 [US4] `TestCase`: `GET /?ordenar=fechamento` ordena a tabela por proximidade do prazo de fechamento (FR-020)
- [ ] T044 [US4] `TestCase`: cards de uma mesma coluna do quadro aparecem ordenados por `data_fechamento`, sem alterar o agrupamento por estágio (FR-021)
- [ ] T045 [US4] `TestCase`: sem parâmetros de busca/filtro, tabela e quadro exibem todos os editais do captador
- [ ] T052 [US4] `TestCase`: `GET /` e `GET /kanban/` exibem, próximo ao título/controles, o total geral sem filtro e o total já filtrado quando busca/instituição estão aplicados (FR-023, Acceptance Scenario 6)
- [ ] T053 [US4] `TestCase`: com busca/filtro ativos aparece um indicador ("Filtrando por: ... · Limpar filtros"); "Limpar filtros" reseta busca e instituição juntos, sem alterar a ordenação (FR-025, Acceptance Scenario 7)
- [ ] T054 [US4] `TestCase`: (a) coluna do Kanban esvaziada por filtro mostra "Nenhum edital encontrado com esses critérios." e contador 0; (b) coluna genuinamente vazia sem filtro ativo permanece em branco, sem mensagem (FR-026, Acceptance Scenario 8, Edge Case)
- [ ] T046 [US4] Implementar busca (`busca`) e filtro (`instituicao`) via querystring em `EditalListView`/`EditalKanbanView` (FR-018, FR-019; depende de T016, T018)
- [ ] T047 [US4] Implementar ordenação por `data_fechamento` (principal na tabela via `ordenar`; secundária dentro de cada coluna do quadro) em `app/editais/views.py` (FR-020, FR-021; depende de T046)
- [ ] T048 [P] [US4] Adicionar campos de busca/filtro/ordenação em `edital_list.html` e `edital_kanban.html` — alinhar com `designer` (depende de T046, T047)
- [ ] T055 [US4] Adicionar total de editais (FR-023) e indicador de filtro ativo com "Limpar filtros" (FR-025) ao contexto e templates de `EditalListView`/`EditalKanbanView` (depende de T046)
- [ ] T056 [US4] Em `edital_kanban.html`, exibir "Nenhum edital encontrado com esses critérios." só na coluna esvaziada por filtro (FR-026; depende de T046, T051)
- [ ] T037 [Polish] Rodar `uv run manage.py test editais` e garantir que toda a suíte (T011-T015, T050, T057, T022-T024, T049, T029-T031, T060-T063, T041-T045, T052-T054, T059) passa
- [ ] T038 [Polish] Executar o roteiro de `specs/001-manage-call-for-proposals/quickstart.md` manualmente (via `docker compose up`)
- [ ] T039 [P] [Polish] Atualizar `/home/lm/repos/frameworkfomento/CLAUDE.md` com os comandos reais de build/lint/test e a arquitetura de alto nível
- [ ] T040 [P] [Polish] Atualizar `docs/architecture-and-tech.md` e `docs/class-diagram.md` refletindo o app `editais`, o model `Edital` e o fluxo de autenticação mínima
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
- [ ] A018 Implementar no protótipo o "ignorar edital" formalizado em
  FR-027 a FR-030: alternar um edital como Ignorado (sem removê-lo,
  distinto de FR-014/A030-remover), ocultá-lo por padrão da
  tabela/quadro/contagens (FR-023/FR-024), oferecer uma visão/filtro
  dedicado para localizar os ignorados, e permitir reverter a marcação.
  Não é uma 5ª coluna do Kanban — é um atributo `ignorado` ortogonal ao
  `estagio` (ver "Key Entities" em `spec.md`). Protótipo:
  `prototype/avulsa-A001/`. Pedido direto do usuário, formalizado via
  `/kanban-sync` → "Atualizar spec" em 2026-07-31.
- [ ] A020 FR-010 — Estágio sincronizado entre tabela e quadro (via
  relatório QA docs/qa-report/avulsa-A001.html#fr-010). Protótipo:
  `prototype/avulsa-A001/`.
- [ ] A035 Dar feedback textual imediato e visível (ex.: toast "Edital
  movido para Ignorados") no momento de clicar "Ignorar"/"Reverter" — hoje
  o item some/reaparece instantaneamente da visão atual sem nenhuma
  confirmação, só um contador pequeno no canto muda (FR-027/FR-030).
  Protótipo: `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-1` (reafirmada da 8ª rodada, agora
  confirmada ao vivo na 9ª). Ver também lição aprendida em
  `.claude/agents/designer.md` (2026-08-02) sobre feedback de ações que
  removem um item da visão atual.
- [ ] A036 Avaliar se o estágio "Concluído" do quadro de progresso precisa
  distinguir dois momentos reais diferentes do processo de captação —
  "submetido, aguardando parecer" vs. "resultado já saiu/processo
  encerrado" — hoje ambos caem na mesma coluna, sem diferenciação visual
  nem de dado. Decisão de produto (novo estágio/campo, ou documentar como
  limitação conhecida fora de escopo), não de UX. Protótipo:
  `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-2`.
- [ ] A037 Confirmar/declarar em FR-025 ou FR-029 se "Limpar filtros" deve
  mesmo resetar o toggle Ativos/Ignorados de volta para "Ativos" (comportamento
  atual do protótipo, decisão implícita não coberta por nenhum FR) ou se
  deveria preservar a visão atual e só limpar busca/instituição. Protótipo:
  `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-3`.

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

### (avulsas)

- [x] A019 A02:2021 — Cryptographic Failures: SECRET_KEY do Django hardcoded
  em `app/config/settings.py` (via relatório de segurança
  docs/cybersec-report/2026-08-01.html#achado-1). Corrigida: `SECRET_KEY`
  agora lida de `DJANGO_SECRET_KEY` via `os.environ.get`, com fallback de
  dev marcado; `.env`/`.env.example` criados (`.env` fora do git),
  `docker-compose.yml`/`Dockerfile` parametrizados com
  `DJANGO_HOST`/`DJANGO_PORT`. QA aprovado em 2026-08-01 (bandit limpo,
  `docker compose up` responde 200, `./run_tests.sh` verde, 3 testes de
  regressão em `app/config/tests.py`).
- [x] A021 A05:2021 — Security Misconfiguration: Dockerfile roda como root,
  sem `USER` não-root (via relatório de segurança
  docs/cybersec-report/2026-08-01.html#achado-2). Corrigida: usuário
  `appuser` (uid 1000) não-root criado e usado antes do `CMD`. QA aprovado
  em 2026-08-01 (`whoami`/`id` confirmados dentro e fora do bind mount,
  `migrate` grava normalmente).
- [x] A022 A05:2021 — `DEBUG=True` hardcoded em produção potencial (via
  relatório de segurança docs/cybersec-report/2026-08-01.html#achado-3).
  Corrigida: `DEBUG` lido de `DJANGO_DEBUG` (default `False`,
  secure-by-default). QA aprovado em 2026-08-01.
- [x] A023 A05:2021 — `SECRET_KEY` sem fallback seguro (fail-safe) caso a
  env var não seja setada em produção (via relatório de segurança
  docs/cybersec-report/2026-08-01.html#achado-4). Corrigida: levanta
  `ImproperlyConfigured` na importação se `DEBUG=False` e o valor ainda for
  o fallback hardcoded. QA aprovado em 2026-08-01 (4 cenários testados
  independentemente).
- [x] A024 A05:2021 — `ALLOWED_HOSTS` vazio e cabeçalhos/flags de
  transporte e sessão não endurecidos (via relatório de segurança
  docs/cybersec-report/2026-08-01.html#achado-5). Corrigida:
  `ALLOWED_HOSTS` lido de `DJANGO_ALLOWED_HOSTS`; HSTS/SSL
  redirect/cookies secure só ativos quando `DEBUG=False`. QA aprovado em
  2026-08-01 (`check --deploy` simulando produção: 7 warnings originais →
  2 restantes, fora de escopo declarado).
- [x] A025 A05:2021 — Cabeçalhos de segurança HTTP ausentes, achados do
  OWASP ZAP Baseline (via relatório de segurança
  docs/cybersec-report/2026-08-01.html#achado-6). Corrigida parcialmente
  por design: `Permissions-Policy`/`Cross-Origin-Embedder-Policy` enforced
  + `Content-Security-Policy-Report-Only` (retry pedido pelo usuário após
  QA sinalizar a lacuna) via novo `app/config/middleware.py`. CSP enforced
  fica pendente para quando houver templates reais (documentado no
  docstring do middleware); vazamento de versão via header `Server` não é
  corrigível via `runserver` de dev. QA aprovado em 2026-08-01 (headers
  confirmados via `curl -I`, `/admin/login/` intacto).
- [x] A026 A05:2021 — Dockerfile sem `HEALTHCHECK` (via relatório de
  segurança docs/cybersec-report/2026-08-01.html#achado-8). Corrigida:
  `HEALTHCHECK` via `python3 -c urllib.request` (imagem base sem
  curl/wget). QA aprovado em 2026-08-01 (`docker inspect` → `healthy`).
- [x] A027 A05:2021 — `manage.py check --deploy` não roda: gap de tooling no
  próprio script de auditoria (via relatório de segurança
  docs/cybersec-report/2026-08-02.html#achado-9). Corrigida:
  `shortcuts/security-test.sh` agora carrega `.env` (mesmo padrão de
  `run_tests.sh`) antes de rodar os testes. QA aprovado em 2026-08-02
  (`django-check` isolado produz warnings reais em vez de crashar).
- [x] A028 Self-check de segurança da task A023 não é executado
  automaticamente (via relatório de segurança
  docs/cybersec-report/2026-08-02.html#achado-10). Corrigida: `run_tests.sh`
  agora chama `uv run python config/tests.py` ao final. QA aprovado em
  2026-08-02 (regressão forçada e revertida, gate pega a falha de verdade).
- [x] A029 A05:2021 — Cross-Origin-Resource-Policy header ausente,
  residual do ZAP (via relatório de segurança
  docs/cybersec-report/2026-08-02.html#achado-11). Corrigida:
  `Cross-Origin-Resource-Policy: same-origin` adicionado em
  `app/config/middleware.py`. QA aprovado em 2026-08-02 (`curl -I`
  confirma o header, `/admin/login/` intacto).
- [x] A031 Nível 0 de maturidade CI/CD: nenhum pipeline automatizado (via
  relatório de deploy docs/deploy-report/2026-08-01.html#achado-1).
  Corrigida: novo `.github/workflows/ci.yml` — dispara em push/PR para
  `main`, roda `checkout` + `setup-uv` + `cp .env.example .env` +
  `./run_tests.sh` (lint + testes Django + self-check de segurança).
  Nível 1 de maturidade, sem pular para deploy automatizado (sem ambiente
  real ainda). QA aprovado em 2026-08-02 (YAML válido, ordem dos passos
  reproduz o fluxo local, `run_tests.sh` roda limpo de ponta a ponta).
- [x] A032 Servidor de desenvolvimento do Django (`runserver`) como
  processo de produção (via relatório de deploy
  docs/deploy-report/2026-08-01.html#achado-2). Corrigida junto com
  A033/A034 (mesmo trecho do `Dockerfile`): novo `entrypoint.sh` na raiz
  do repo (`migrate` + `exec uv run --no-dev gunicorn
  config.wsgi:application`), `gunicorn` adicionado como dependência
  principal. Retry pedido pelo usuário após retrospectiva: entrypoint
  movido de `app/entrypoint.sh` para a raiz (achado extra do dev: dentro
  de `app/` ficava escondido pelo bind-mount `./app:/app` do
  `docker-compose.yml` em runtime) e build/runtime passaram a usar
  `--no-dev`, cortando a imagem de 1.38GB para 270MB (`ruff`/`bandit`/
  `semgrep` saíram da imagem/venv de produção). QA reaprovado em
  2026-08-02 após as duas correções, medido do zero
  (`docker top`/`/proc/<pid>/cmdline` confirmam gunicorn, não `runserver`,
  `curl /admin/login/` → 200, tamanho de imagem remedido
  independentemente).
- [x] A033 Sem estágio de release automatizado (`migrate`/`collectstatic`
  ausentes) (via relatório de deploy
  docs/deploy-report/2026-08-01.html#achado-3). Corrigida: `migrate
  --noinput` roda no `entrypoint.sh` (raiz do repo) antes do `exec` do
  gunicorn. `collectstatic` propositalmente adiado (sem `STATIC_ROOT`
  configurado ainda em `settings.py`), documentado com comentário
  `ponytail:` no entrypoint. QA aprovado em 2026-08-02 (logs confirmam
  migrate rodando antes do gunicorn subir, sem regressão após o retry).
- [x] A034 Shutdown não gracioso: `CMD` em shell-form não repassa
  `SIGTERM` (via relatório de deploy
  docs/deploy-report/2026-08-01.html#achado-4). Corrigida: `CMD` do
  `Dockerfile` em forma JSON/exec (`CMD ["/entrypoint.sh"]`). QA aprovado
  em 2026-08-02, medido de forma independente 3x ao longo do ciclo
  (`docker stop` entre 0.45s-0.5s, `ExitCode 0` sempre, contra baseline de
  10.3s/`ExitCode 137`) — nota do QA: `uv run gunicorn` não vira PID 1 via
  exec-replace literal (fica supervisor fino com gunicorn como filho), mas
  repassa `SIGTERM` corretamente na prática; decisão do usuário foi manter
  como está, sem
  aprofundar para PID 1 puro.
