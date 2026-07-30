# Implementation Plan: Gerenciamento de Editais de Fomento

**Branch**: `001-manage-call-for-proposals` | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-manage-call-for-proposals/spec.md`

## Summary

Um único app Django novo (`editais`) dentro do projeto `app/` existente,
oferecendo CRUD completo de `Edital` escopado por captador (via
`django.contrib.auth`, já instalado no scaffold) mais duas visões
server-rendered dos mesmos dados: tabela (`ListView`) e quadro kanban de 4
colunas (`ListView` alternativo, agrupado por `estagio`). Mudança de estágio
é uma ação simples (POST) com botões acessíveis "mover para trás/frente",
sem JavaScript nem dependência nova — o protótipo de referência de A001
(`prototype/avulsa-A001/`) já mostra que essa interação funciona sem
drag-and-drop obrigatório. SQLite (já configurado) é suficiente; nenhum
serviço novo entra no `docker-compose.yml`.

## Technical Context

**Language/Version**: Python 3.12, Django 6.0.7 (já fixado em `app/pyproject.toml`)

**Primary Dependencies**: Apenas Django e sua stdlib (`django.contrib.auth`,
`django.contrib.admin`, `django.forms`) — nenhuma dependência nova via `uv add`.

**Storage**: SQLite (`app/db.sqlite3`, já configurado em `config/settings.py`) —
suficiente para o volume e o estágio atual do projeto (single-maintainer,
sem serviço de banco compartilhado).

**Testing**: `django.test.TestCase` (stdlib do Django) via
`uv run manage.py test editais`.

**Target Platform**: Servidor Linux via container Docker
(`docker-compose.yml` + `Dockerfile` já existentes na raiz), acessado por
navegador.

**Project Type**: Web application server-rendered (Django templates), single
project — não há frontend separado nem API pública nesta feature.

**Performance Goals**: N/A explícito na spec; volume esperado é de dezenas a
poucas centenas de editais por captador (uso individual), sem exigência de
throughput.

**Constraints**: Interface em português (Constitution Padrões de Código);
formulários utilizáveis por não especialistas; mover um edital de estágio em
3 ações ou menos (SC-003).

**Scale/Scope**: 1 app Django novo, 1 model, ~5 views, 3 templates
principais (listagem tabela, quadro kanban, formulário de edital) + páginas
de login mínimas do `django.contrib.auth`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Desenvolvimento Orientado por Spec**: PASS — este plano deriva
  inteiramente de `spec.md` (16/16 no checklist de requisitos, business-rules
  aprovado com exceções não bloqueantes documentadas); nenhuma decisão de
  negócio nova é tomada aqui.
- **II. Simplicidade Antes de Abstração (YAGNI/Ponytail)**: PASS — reutiliza
  `django.contrib.auth` já instalado (nenhuma dependência nova), usa
  `ModelForm`/`generic views` da própria stdlib do Django em vez de camadas
  de serviço/repositório especulativas, e o `Edital` é um único model sem
  entidades auxiliares (documentação exigida e critérios de avaliação são
  campos de texto no próprio model, conforme FR-017 — não uma tabela
  separada).
- **III. Qualidade Verificável Antes de "Pronto"**: PASS (a verificar em
  `speckit-implement`/`qa`) — `quickstart.md` define os cenários de validação
  manual e cada User Story terá testes `TestCase` cobrindo os Acceptance
  Scenarios correspondentes.
- **IV. Documentação Viva, Não Tribal**: PASS — `docs/architecture-and-tech.md`
  e `docs/class-diagram.md` serão atualizados ao final da implementação,
  fora deste plano (responsabilidade contínua do `dev`, não de um artefato
  do Spec Kit).
- **V. Foco no Captador de Recursos (Domain-First)**: PASS — nenhuma tela
  técnica exposta ao usuário; login é a única tela "de infraestrutura"
  visível, tratada como pré-requisito mínimo de FR-015/FR-016 (ver
  research.md), não como feature de auth completa (sem cadastro
  self-service, recuperação de senha, etc. nesta feature).

Nenhuma violação a justificar em Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-manage-call-for-proposals/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/
│   └── urls.md           # Phase 1 output — contrato de rotas (não há API/REST nesta feature)
├── checklists/
│   ├── requirements.md
│   └── business-rules.md
└── tasks.md              # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
app/
├── config/
│   ├── settings.py        # + 'editais' em INSTALLED_APPS, LOGIN_URL,
│   │                       #   LOGIN_REDIRECT_URL, LANGUAGE_CODE='pt-br'
│   └── urls.py             # + path('', include('editais.urls'))
│                            # + path('accounts/', include('django.contrib.auth.urls'))
├── editais/                # novo app Django
│   ├── __init__.py
│   ├── models.py            # Edital
│   ├── forms.py             # EditalForm (ModelForm)
│   ├── views.py             # ListView tabela, ListView kanban, Create/Update/DeleteView, mover_estagio
│   ├── urls.py
│   ├── admin.py              # opcional: registro simples para inspeção via /admin
│   ├── migrations/
│   ├── templates/editais/
│   │   ├── edital_list.html        # visão tabela
│   │   ├── edital_kanban.html      # visão quadro de progresso
│   │   ├── edital_form.html        # cadastro/edição
│   │   └── edital_confirm_delete.html
│   └── tests.py             # ou tests/ se crescer — TestCase por User Story
└── templates/
    └── registration/
        └── login.html        # template mínimo exigido pelo LoginView padrão do Django
```

**Structure Decision**: App Django único `editais` dentro de `app/`, seguindo
o layout padrão (`models.py`/`views.py`/`urls.py`/`migrations/`) pedido pelo
`CLAUDE.md` para o primeiro app real do projeto. Sem app `accounts`/`users`
dedicado — login usa as views prontas de `django.contrib.auth.urls`, só com
um template mínimo em `templates/registration/login.html`, porque
autenticação em si é fora de escopo desta spec (Assumptions) mas é
pré-requisito técnico inevitável de FR-015/FR-016 (ver research.md, decisão
"Autenticação mínima").

## Complexity Tracking

*Sem violações — seção vazia.*
