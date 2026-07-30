# frameworkfomento template

Repositório para um Framework de Aprovação em Editais de Fomento.

Projeto open-source com o objetivo de facilitar a vida de captadores de recurso.

## Sobre o projeto

Captar recursos por meio de editais de fomento (públicos ou privados) é um processo trabalhoso: exige entender critérios de avaliação, organizar documentação, redigir propostas alinhadas ao edital e revisar tudo antes da submissão. Muitas boas iniciativas perdem oportunidades de financiamento não por falta de mérito, mas por dificuldades no processo de elaboração e aprovação da proposta.

O **frameworkfomento** nasce para endereçar esse problema: um framework aberto que ajuda captadores de recursos a estruturar, revisar e aumentar as chances de aprovação de propostas em editais de fomento.

## Objetivos

- Reduzir a barreira de entrada para organizações e pessoas que buscam captar recursos via editais.
- Sistematizar boas práticas de elaboração de propostas, com base nos critérios mais comuns de avaliação usados por editais de fomento.
- Ser uma ferramenta aberta, gratuita e colaborativa, mantida pela comunidade.

## Status do projeto

Este projeto está em estágio inicial. A estrutura de código, funcionalidades e documentação técnica ainda serão definidas e evoluirão com as próximas contribuições.

## Fluxo de trabalho (tutorial básico)

Este projeto é desenvolvido com o [GitHub Spec Kit](https://github.com/github/spec-kit) (fluxo orientado por spec) mais um quadro Kanban local (`KANBAN.md`) e seis agentes de papel em `.claude/agents/`: `product-owner`, `dev`, `designer`, `scrum-master`, `qa` e `fundraiser`. Cada um tem escopo e regras de handoff documentados no próprio arquivo.

Documentação viva do projeto:
- `docs/` — requisitos funcionais/não funcionais, regras de negócio, escopo, arquitetura, diagrama de classes, critérios de aceite.
- `.specify/memory/constitution.md` — princípios não-negociáveis do projeto (simplicidade/YAGNI, qualidade via QA antes de "Done", spec antes de código, etc.).
- `specs/<feature>/` — spec, plano e tasks de cada feature, geradas pelo Spec Kit.
- `KANBAN.md` — quadro To Do / In Progress / Done, única fonte de verdade do que está em andamento.

### Comandos disponíveis

| Comando | Para que serve |
|---|---|
| `/speckit-constitution` | Cria/atualiza os princípios do projeto |
| `/speckit-specify` | Escreve a spec de uma feature nova |
| `/speckit-clarify` | Resolve ambiguidades da spec |
| `/speckit-plan` | Gera o plano técnico (arquitetura, models, etc.) |
| `/speckit-tasks` | Quebra o plano em tasks (`T001`, `T002`...) |
| `/speckit-analyze` | Checa consistência entre spec/plano/tasks antes de implementar |
| `/speckit-implement` | Executa as tasks (uso manual; o dia a dia normalmente passa pelo `/kanban-start`) |
| `/kanban-sync` | "Reunião de scrum": sincroniza o quadro, ou cria uma tarefa avulsa |
| `/kanban-start` | Escolhe uma tarefa do quadro (aqui no chat) e a implementa de ponta a ponta |
| `/docs-sync` | Revisa e atualiza `docs/` a partir do estado real do projeto |
| `/feature-start` | Atalho: roda specify→clarify→checklist→plan→tasks→kanban-sync numa tacada só, para uma feature grande/nova |
| `/quick-task` | Atalho: cria uma tarefa avulsa e já a implementa (kanban-sync + kanban-start em um comando), para ajustes pequenos |

### Por onde começar, de acordo com a intenção

- **"Quero começar uma feature nova"** → `/feature-start` (roda specify → clarify → checklist → plan → tasks → kanban-sync por trás; se preferir controlar cada etapa manualmente, os mesmos comandos `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/kanban-sync` continuam disponíveis um a um). Depois, `/kanban-start` repetido até esvaziar o To Do da feature.
- **"Quero corrigir/ajustar algo pequeno, sem spec formal, e já implementar"** → `/quick-task` (cria a tarefa avulsa e já a inicia; equivale a `/kanban-sync` → "Criar nova tarefa" → `/kanban-start` em um só passo).
- **"Quero ver o que está pendente/em andamento"** → `/kanban-sync` → escolha "Acompanhamento".
- **"Quero implementar a próxima tarefa do quadro"** → `/kanban-start` (a seleção é feita aqui mesmo no chat, com opções clicáveis).
- **"Achei um bug numa tarefa que já estava Done"** → `/quick-task` descrevendo o bug e referenciando o ID original (ex.: "Corrige regressão em T012: ..."). Nunca "reabra" a task antiga — `tasks.md`/`KANBAN.md` são um registro histórico; a correção é uma task nova e rastreável.
- **"Quero atualizar a documentação do projeto"** → `/docs-sync`.
- **"Quero mudar um princípio/regra do projeto"** → `/speckit-constitution`.

O `/kanban-start` já cuida de acionar o `dev` para implementar, o `qa` como gate obrigatório (testes de UI e lógica antes de fechar a task) e, ao final, pergunta se algo deu errado — se sim, registra a lição aprendida no arquivo do agente/skill responsável, para o processo melhorar com o tempo. Depois dessa retrospectiva, pergunta também se deve commitar ou commitar e dar push — sempre em Conventional Commits, com uma mensagem detalhada o suficiente para o commit servir como documentação da mudança (o quê, por quê, decisões tomadas na implementação e resultado do QA).

## Como contribuir

Contribuições são bem-vindas. Abra uma *issue* para sugerir ideias, relatar problemas ou discutir direções do projeto, ou envie um *pull request* com sua proposta de mudança.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
