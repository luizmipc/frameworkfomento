# Quickstart: Gerenciamento de Editais de Fomento

Guia de validação manual, ponte entre `plan.md`/`data-model.md`/`contracts/`
e o que o `qa` (e qualquer humano) roda para confirmar que a feature
funciona de ponta a ponta. Não repete código de implementação — só os
comandos e passos para exercitar os Acceptance Scenarios da spec.

## Pré-requisitos

- Docker + Docker Compose (via `docker-compose.yml`/`Dockerfile` na raiz),
  **ou** `uv` instalado localmente para rodar direto em `app/`.
- Migrations aplicadas e um usuário (captador) criado para login.

## Setup

Via Docker Compose (caminho padrão do projeto):

```bash
docker compose up --build
# em outro terminal, com o container rodando:
docker compose exec app uv run manage.py migrate
docker compose exec app uv run manage.py createsuperuser
```

Ou local, dentro de `app/`:

```bash
cd app
uv run manage.py migrate
uv run manage.py createsuperuser
uv run manage.py runserver 0.0.0.0:8000
```

## Roteiro de validação (mapeado às User Stories)

1. **Login** — acesse `http://localhost:8000/accounts/login/`, entre com o
   usuário criado acima. (Pré-requisito técnico de FR-015/FR-016, não uma
   User Story em si.)

2. **US2 — Cadastrar edital (P2, mas primeiro no roteiro pois US1 depende
   de dados existentes)**
   - Acesse `/novo/`, tente salvar sem preencher nada → confirma FR-005
     (erros por campo obrigatório: nome, instituição, link, data de
     fechamento).
   - Preencha nome da chamada, instituição, descrição, link, data de
     fechamento (e opcionalmente data de abertura, documentação exigida,
     critérios de avaliação) e salve → confirma US2 Acceptance Scenario 1
     e 3 (SC-002: deve ser possível em até 5 minutos).
   - Repita para 2-3 editais, variando datas (uma com `data_fechamento` no
     passado, para o passo de prazo vencido abaixo).

3. **US1 — Listagem e quadro de progresso (P1)**
   - Acesse `/` → confirma FR-001 (tabela com nome, descrição, instituição,
     link, datas) e FR-012 (link clicável).
   - Confirme que o edital com `data_fechamento` no passado está marcado
     visualmente como vencido (FR-011/SC-005).
   - Acesse `/kanban/` → confirma FR-002 (4 colunas, todo edital novo
     aparece em "Backlog" — FR-008).
   - Use os botões de mover em um card para avançar Backlog → Em andamento
     → Validação, depois volte uma coluna → confirma FR-009 (ambas as
     direções) em 1 clique por movimento (SC-003: 3 ações ou menos).
   - Volte para `/` → confirma que a mudança de estágio está refletida na
     tabela também (FR-010, se a tabela expõe estágio) e/ou volte para
     `/kanban/` após navegar por `/` → confirma SC-006 (sincronizado nas
     duas visões).

4. **US3 — Editar e remover (P3)**
   - Em `/<id>/editar/`, altere a data de fechamento (ex.: simular
     prorrogação de prazo) → confirma que a mudança aparece imediatamente
     em `/` e `/kanban/` (US3 Acceptance Scenario 1, SC-006).
   - Em `/<id>/remover/`, confirme a remoção → confirma que o edital some
     de `/` e `/kanban/` (US3 Acceptance Scenario 2).

5. **Isolamento por captador (FR-015/FR-016)** — crie um segundo usuário
   (`createsuperuser` de novo ou via `/admin/`), logue com ele, e confirme
   que `/` e `/kanban/` estão vazios (não mostram os editais do primeiro
   captador) até que esse segundo usuário cadastre os seus próprios.

## Testes automatizados

```bash
cd app
uv run manage.py test editais
```

Cobertura esperada (um `TestCase` por User Story, no mínimo): criação com
sucesso e com erro de validação (US2), listagem/kanban/mover estágio nas
duas direções incluindo os limites Backlog/Concluído (US1), edição e
remoção com confirmação de reflexo imediato e isolamento por `captador`
(US3 + FR-015/FR-016).
