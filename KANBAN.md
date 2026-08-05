# Kanban Board

Fonte de verdade só do que `specs/*/tasks.md` não consegue guardar sozinho —
nunca duplica o que já está lá. Tasks `T\d{3}` (com `tasks.md` de origem)
**não aparecem** em **To Do** nem em **Done** aqui: seu backlog é lido
direto do `[ ]` de cada `tasks.md`, e sua conclusão é o `[x]` de lá — ver o
`tasks.md` da feature para o estado real. A única coisa que este arquivo
guarda sobre uma task `T\d{3}` é se ela está **In Progress** agora (o
`tasks.md` só tem dois estados, `[ ]`/`[x]`; "em andamento" não existe lá).

Tasks `A\d{3}` (avulsas, criadas via `/meeting` → "Criar nova tarefa") não
têm `tasks.md` correspondente — vivem inteiramente aqui, nas três colunas
(To Do/In Progress/Done), do jeito que sempre viveram.

`/meeting` (sub-rotina Sincronização) e `/kanban-start` são os únicos que
escrevem este arquivo — não edite manualmente (exceto para corrigir uma
anomalia pontual já reportada por um deles).

**Última sincronização**: 2026-08-04T11:46Z

## To Do

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
- [x] A035 Dar feedback textual imediato e visível (ex.: toast "Edital
  movido para Ignorados") no momento de clicar "Ignorar"/"Reverter".
  Protótipo: `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-1` (reafirmada da 8ª rodada,
  confirmada ao vivo na 9ª). O código já implementava `showToast()` desde
  antes desta rodada (o quadro só não tinha sido sincronizado);
  confirmado ao vivo de novo em 2026-08-03 (toast "Edital movido para
  Ignorados" aparece ao clicar "Ignorar" na Tabela).
- [x] A039 A seta "→" desabilitava só no último item de `STATUSES`, não em
  qualquer estágio terminal — um card em "Aprovado" ainda podia ser movido
  para "Não aprovado" com um clique, sem aviso. Protótipo:
  `prototype/avulsa-A001/`. Via teste de persona
  `docs/persona/avulsa-A001.html#dor-4` (10ª rodada). Corrigida: novo array
  `ESTAGIOS_TERMINAIS_FUNIL = ["aprovado", "nao_aprovado"]` em `script.js`,
  `updateMoveButtons()` desabilita "→" nos dois estágios terminais (não só
  no último índice do array); drag-and-drop continua permitindo a correção
  manual entre os dois. Confirmado ao vivo via browser em 2026-08-03:
  Submetido → Aprovado via "→" funciona normalmente, "→" fica desabilitado
  assim que o card chega em Aprovado/Não aprovado, "←" continua habilitado.
- [x] A040 O selo vermelho "Vencido" aparecia igual em editais já
  Submetidos/Aprovados/Não aprovados e em editais ativos com prazo
  realmente perdido. Protótipo: `prototype/avulsa-A001/`. Via teste de
  persona `docs/persona/avulsa-A001.html#dor-5` (10ª rodada). Corrigida:
  novo array `ESTAGIOS_CONCLUIDOS = ["submetido", "aprovado",
  "nao_aprovado"]` em `script.js`; o cálculo de `vencido` em
  `renderTabela()`/`renderKanban()` passa a excluir esses três estágios
  (o selo simplesmente não aparece ali; efeito colateral esperado e correto:
  o badge amarelo "vence em até N dias" também para de aparecer nesses
  casos, pela mesma lógica). Confirmado ao vivo via browser em 2026-08-03:
  Tabela e Kanban não exibem mais "Vencido" nos três estágios terminais,
  mesmo com `fechamento` no passado.
- [x] A037 "Limpar filtros" resetava também o toggle Ativos/Ignorados de
  volta para "Ativos", perdendo o lugar de onde o captador estava — decisão
  implícita não coberta por nenhum FR. Protótipo: `prototype/avulsa-A001/`.
  Via teste de persona `docs/persona/avulsa-A001.html#dor-3`. Resolvida:
  decisão formalizada em `spec.md` (branch `001-manage-call-for-proposals`)
  — FR-025 passa a cobrir só busca/instituição, FR-029 ganha a contrapartida
  de que o toggle nunca é resetado por "Limpar filtros" (novo Acceptance
  Scenario 9 de User Story 4). Protótipo corrigido:
  `prototype/avulsa-A001/script.js`, listener de `clearFiltersBtn` não
  chama mais `setMostrarIgnorados(false)`. Confirmado ao vivo via browser
  em 2026-08-03: na visão "Ignorados" com filtro de instituição ativo,
  "Limpar filtros" limpa só a instituição e permanece em "Ignorados".
- [x] A041 Correção da A039 (Done) ficou incompleta: a seta "→" foi
  desabilitada em estágios terminais, mas a seta "←" a partir de "Não
  aprovado" continuava habilitada e movia o card silenciosamente de volta
  para "Aprovado" — o mesmo problema da Dor 4 original
  (`docs/persona/avulsa-A001.html#dor-4`), só que na direção oposta.
  Encontrado numa revisão de regressão ao vivo em 2026-08-03, depois da
  A039 já estar em Done — não reabriu a A039, seguiu como task nova,
  conforme convenção do projeto. Lição aprendida registrada em
  `.claude/agents/designer.md` (2026-08-03). Protótipo:
  `prototype/avulsa-A001/`. Corrigida: `updateMoveButtons()` generalizado
  para as duas direções — cada seta desabilita quando o estágio atual E o
  estágio de destino nessa direção (`STATUSES[idx - 1]` para "←",
  `STATUSES[idx + 1]` para "→") estão ambos em `ESTAGIOS_TERMINAIS_FUNIL`,
  sem depender da ordem do array. Confirmado ao vivo via browser em
  2026-08-03: card em "Não aprovado" tem "←" e "→" desabilitados; card em
  "Aprovado" mantém "←" habilitado (volta a "Submetido", correção
  legítima) e "→" desabilitado; drag-and-drop continua livre para a
  correção manual entre os dois terminais.

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
