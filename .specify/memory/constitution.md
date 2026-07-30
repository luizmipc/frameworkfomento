<!--
Sync Impact Report
- Version change: (template, unratified) → 1.0.0
- Modified principles: none (initial ratification)
- Added principles:
  - I. Desenvolvimento Orientado por Spec
  - II. Simplicidade Antes de Abstração (YAGNI/Ponytail)
  - III. Qualidade Verificável Antes de "Pronto"
  - IV. Documentação Viva, Não Tribal
  - V. Foco no Captador de Recursos (Domain-First)
- Added sections:
  - Padrões de Código
  - Fluxo de Desenvolvimento e Papéis
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending manual check (not modified by this command)
  - .specify/templates/spec-template.md ⚠ pending manual check (not modified by this command)
  - .specify/templates/tasks-template.md ⚠ pending manual check (not modified by this command)
  - .claude/skills/speckit-*/** ⚠ pending manual check (not modified by this command)
- Follow-up TODOs: none — all placeholders resolved with values supplied by the project maintainer.
-->

# frameworkfomento Constitution

## Core Principles

### I. Desenvolvimento Orientado por Spec
Toda feature não-trivial DEVE passar pelo fluxo completo do Spec Kit
(constitution → specify → clarify → plan → tasks → analyze → implement)
antes de virar código. Specs DEVEM ser escritas para stakeholders de
negócio — captadores de recursos, avaliadores de edital, gestores de
organizações proponentes — nunca para desenvolvedores; escolhas de
tecnologia, modelos de dados e estrutura de código NÃO pertencem à spec.
Mudanças triviais (typo, configuração, documentação) PODEM pular o fluxo
completo, mas nenhuma mudança de comportamento de negócio é aceita sem uma
spec correspondente por trás.

**Rationale**: Um framework cujo objetivo é aumentar a taxa de aprovação de
propostas em editais só cumpre essa promessa se cada decisão de produto for
rastreável a um requisito de negócio explícito e revisável — não a uma
decisão de implementação isolada.

### II. Simplicidade Antes de Abstração (YAGNI/Ponytail)
Código novo DEVE preferir a solução mais simples que resolve o problema
real, priorizando biblioteca padrão ou recursos nativos do framework (Django,
Python) antes de adicionar uma dependência nova. Abstrações (interfaces,
camadas de indireção, configuração genérica) DEVEM esperar um segundo caso de
uso real e concreto que as justifique — nunca são criadas especulativamente.
Testes e documentação seguem a mesma lente: sem redundância, sem boilerplate
especulativo, cobrindo apenas o que existe e é usado.

**Rationale**: Um projeto open-source em estágio inicial, com um único
mantenedor, não pode pagar o custo de manutenção de abstrações prematuras;
cada linha de código extra é dívida técnica que atrasa a entrega de valor ao
captador de recursos.

### III. Qualidade Verificável Antes de "Pronto"
Nenhuma task é considerada concluída sem passar pelo agente `qa`: testes de
UI e de lógica cobrindo os critérios de aceite da spec DEVEM existir e
passar antes de uma task sair de "In Progress" para "Done" no quadro Kanban.
Regressões encontradas pelo `qa` voltam ao `dev` antes de qualquer nova
funcionalidade ser iniciada — correção de regressão tem prioridade sobre
escopo novo.

**Rationale**: Propostas em editais de fomento têm prazos rígidos e não
recuperáveis; uma falha silenciosa no framework pode custar a um captador de
recursos a perda de um prazo inteiro, portanto "pronto" só significa
verificado.

### IV. Documentação Viva, Não Tribal
Conhecimento de arquitetura, requisitos, regras de negócio e critérios de
aceite DEVE viver em `docs/` e nos artefatos do Spec Kit (`specs/`), nunca
apenas na cabeça de quem implementou. `docs/` e `KANBAN.md` são atualizados
exclusivamente via `/kanban-sync`, `/kanban-start` e `/docs-sync` — nunca
deixados desatualizados silenciosamente após uma mudança relevante.

**Rationale**: Um projeto open-source depende de contribuidores que entram e
saem; conhecimento que não está documentado é conhecimento que o projeto
perde a cada rotatividade de mantenedor ou colaborador.

### V. Foco no Captador de Recursos (Domain-First)
Toda decisão de produto, UX ou linguagem DEVE ser avaliada pela ótica de
quem tenta aprovar uma proposta em um edital de fomento — frequentemente sob
prazo apertado e sem profundo conhecimento técnico. Jargão técnico, fluxos
complexos de múltiplas etapas e telas genéricas de dashboard são evitados em
favor de linguagem simples, direta, e processos claros que guiam o usuário
passo a passo até a submissão da proposta.

**Rationale**: O sucesso do framework é medido pela capacidade real de um
captador de recursos — não de um desenvolvedor — usar a ferramenta sob
pressão de prazo; qualquer complexidade que exija conhecimento técnico prévio
é uma barreira direta ao objetivo do projeto.

## Padrões de Código

Python/Django segue PEP 8 e usa type hints em código novo. Django ORM é o
padrão de acesso a dados; SQL bruto só é aceito com justificativa
documentada no código ou na spec/plan correspondente. Migrations são sempre
geradas via `manage.py makemigrations`, nunca escritas à mão. Dependências
são geridas exclusivamente via `uv` (`app/pyproject.toml` / `app/uv.lock`) —
nunca `pip install` direto nem edição manual do lockfile. `Dockerfile` e
`docker-compose.yml` na raiz do repositório são a forma oficial de rodar a
aplicação. Segredos e credenciais NUNCA são commitados. Toda entrada de
usuário é validada via formulários Django. Dados de propostas e de
organizações proponentes são tratados como sensíveis por padrão. Interface e
specs são escritas em português por padrão; formulários DEVEM ser
utilizáveis por não-especialistas (acessibilidade é requisito, não
opcional).

## Fluxo de Desenvolvimento e Papéis

Os papéis do projeto são fixos e definidos em `.claude/agents/`:
`product-owner` (spec, negócio, docs de escopo), `dev` (arquitetura,
implementação, docs técnicos), `designer` (UX, protótipos), `scrum-master`
(kanban, gate de processo), `qa` (testes, critérios de aceite) e
`fundraiser` (advogado do usuário final). `/kanban-sync` e `/kanban-start`
são a forma oficial de mover trabalho entre estados; `KANBAN.md` é a fonte
de verdade do quadro de trabalho. Toda reunião ou execução relevante termina
em uma retrospectiva curta; problemas reportados nessa retrospectiva viram
uma "Lição aprendida" registrada no arquivo do agente ou skill responsável
pelo problema.

## Governance

Esta constitution tem precedência sobre qualquer convenção ad-hoc adotada no
projeto. Qualquer exceção a um dos princípios acima DEVE ser justificada
explicitamente na spec ou no commit correspondente à mudança — silêncio não
é justificativa válida. Emendas a esta constitution só são feitas via
`/speckit-constitution`, nunca por edição manual do arquivo, e seguem
versionamento semântico: MAJOR para remoção ou redefinição incompatível de
um princípio, MINOR para adição de novo princípio ou seção, PATCH para
redação ou clarificação sem mudança de significado. O projeto está em
estágio inicial, open-source, com um único mantenedor (luizmipc); a
aprovação de emendas é dele. O processo pode evoluir para revisão por
múltiplos mantenedores conforme o projeto crescer.

**Version**: 1.0.0 | **Ratified**: 2026-07-30 | **Last Amended**: 2026-07-30
