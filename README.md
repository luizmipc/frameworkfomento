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

Este projeto é desenvolvido com o [GitHub Spec Kit](https://github.com/github/spec-kit) (fluxo orientado por spec) mais um quadro Kanban local (`KANBAN.md`) e oito agentes de papel em `.claude/agents/`: `product-owner`, `dev`, `designer`, `scrum-master`, `qa`, `fundraiser`, `cybersecurity-blue` e `devops`. Cada um tem escopo e regras de handoff documentados no próprio arquivo.

Documentação viva do projeto:
- `docs/` — requisitos funcionais/não funcionais, regras de negócio, escopo, arquitetura, diagrama de classes, critérios de aceite. Site HTML autocontido, sem markdown — abra `docs/index.html` no navegador.
- `docs/persona/` — documentos de Persona (canvas + parecer/dores) gerados por `/fundraiser-test`, `/fundraiser-production-test` e `/fundraiser-submission-timeline`, um captador de recursos real testando o protótipo, a aplicação em produção, ou um checklist de submissão recém-criado.
- `docs/submissions/` — checklists HTML de submissão gerados por `/fundraiser-submission-timeline` a partir dos PDFs reais de um edital, com portão de elegibilidade e roteiro de Google Forms companheiro.
- `docs/qa-report/` — relatórios de conformidade a critérios de aceite gerados por `/qa-test` e `/qa-production-test`.
- `docs/cybersec-report/` — relatórios de segurança (SAST/SCA/config/OWASP ZAP) gerados por `/cybersecurity-check`.
- `docs/deploy-report/` — relatórios de prontidão operacional de deploy (CI/CD, build de imagem, servidor de produção vs. dev, Doze Fatores) gerados por `/check-deployment`.
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
| `/kanban-sync` | "Reunião de scrum": sincroniza o quadro, cria uma tarefa avulsa, ou formaliza um gap como requisito em `spec.md` |
| `/kanban-start` | Escolhe uma tarefa do quadro (aqui no chat) e a implementa de ponta a ponta |
| `/docs-sync` | Revisa e atualiza `docs/` a partir do estado real do projeto |
| `/feature-start` | Atalho: roda specify→clarify→checklist→plan→tasks→kanban-sync numa tacada só, para uma feature grande/nova |
| `/quick-task` | Atalho: cria uma tarefa avulsa e já a implementa (kanban-sync + kanban-start em um comando), para ajustes pequenos |
| `/fundraiser-test` | O `fundraiser` vira um captador de recursos real e testa um protótipo estático, devolvendo um documento de Persona com parecer/dores em `docs/persona/` |
| `/fundraiser-production-test` | Igual ao anterior, mas testa a aplicação real já implementada (rodando de verdade), não o protótipo |
| `/fundraiser-submission-timeline` | Cria, a partir dos PDFs (Regulamento/Anexos) de um edital real, um checklist HTML de submissão com portão de elegibilidade funcional em `docs/submissions/`, mais um roteiro de Google Forms equivalente |
| `/qa-test` | O `qa` verifica se um protótipo estático sustenta os critérios de aceite, devolvendo um relatório em `docs/qa-report/` |
| `/qa-production-test` | Igual ao anterior, mas testa a aplicação real já implementada, com testes automatizados + walkthrough ao vivo |
| `/cybersecurity-check` | O `cybersecurity-blue` audita a aplicação real (SAST/SCA/config/OWASP ZAP), devolvendo um relatório de segurança em `docs/cybersec-report/` |
| `/check-deployment` | O `devops` audita a prontidão operacional de deploy da aplicação real (CI/CD, build Docker, servidor de produção vs. dev, Doze Fatores), devolvendo um relatório em `docs/deploy-report/` |

### Por onde começar, de acordo com a intenção

- **"Quero começar uma feature nova"** → `/feature-start` (roda specify → clarify → checklist → plan → tasks → kanban-sync por trás; se preferir controlar cada etapa manualmente, os mesmos comandos `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/kanban-sync` continuam disponíveis um a um). Depois, `/kanban-start` repetido até esvaziar o To Do da feature.
- **"Quero corrigir/ajustar algo pequeno, sem spec formal, e já implementar"** → `/quick-task` (cria a tarefa avulsa e já a inicia; equivale a `/kanban-sync` → "Criar nova tarefa" → `/kanban-start` em um só passo).
- **"Quero ver o que está pendente/em andamento"** → `/kanban-sync` → escolha "Acompanhamento".
- **"Quero implementar a próxima tarefa do quadro"** → `/kanban-start` (a seleção é feita aqui mesmo no chat, com opções clicáveis).
- **"Achei um bug numa tarefa que já estava Done"** → `/quick-task` descrevendo o bug e referenciando o ID original (ex.: "Corrige regressão em T012: ..."). Nunca "reabra" a task antiga — `tasks.md`/`KANBAN.md` são um registro histórico; a correção é uma task nova e rastreável.
- **"Quero atualizar a documentação do projeto"** → `/docs-sync`.
- **"Quero saber que dores um captador de recursos real sentiria usando o protótipo atual"** → `/fundraiser-test` (não corrige nada, só devolve o parecer honesto em `docs/persona/`).
- **"Quero saber que dores um captador de recursos real sentiria usando a aplicação já implementada"** → `/fundraiser-production-test` (mesma ideia, mas na aplicação rodando de verdade, não no protótipo).
- **"Preciso de um checklist de submissão real e confiável para este edital"** → `/fundraiser-submission-timeline <pasta-de-referência-do-edital>` (extrai os critérios eliminatórios dos PDFs do edital com âncora de item, valida com o `fundraiser` antes e depois de construir, e devolve um checklist HTML gated em `docs/submissions/` mais um roteiro de Google Forms — nunca inventa dado que não esteja no documento-fonte).
- **"Quero transformar dores achadas num teste de persona em tarefas"** → `/kanban-sync` → "Criar nova tarefa" → "A partir de um relatório existente" → "Teste de persona (docs/persona/)" (escolhe o arquivo, escolhe quais dores viram task — pode criar mais de uma de uma vez). A mesma lógica vale para achados de `/qa-test`/`/qa-production-test` (`docs/qa-report/`), `/cybersecurity-check` (`docs/cybersec-report/`) e `/check-deployment` (`docs/deploy-report/`).
- **"Quero saber se há vulnerabilidades de segurança conhecidas na aplicação"** → `/cybersecurity-check` (o `cybersecurity-blue` roda SAST/SCA/checagem de configuração/scan OWASP ZAP contra a aplicação real e devolve um parecer honesto em `docs/cybersec-report/`, sem corrigir nada).
- **"Quero saber se a aplicação está pronta para ser implantada em produção"** → `/check-deployment` (o `devops` audita CI/CD, build da imagem Docker, servidor de produção vs. dev e os Doze Fatores, devolvendo um parecer honesto em `docs/deploy-report/`, sem corrigir nada).
- **"Quero formalizar um gap ou insight como requisito real, não só uma tarefa avulsa"** → `/kanban-sync` → "Atualizar spec" (descreve o gap, o `product-owner` decide como formalizar em `spec.md` — novo FR, extensão de um existente, ou nova User Story — e opcionalmente já cria a tarefa avulsa correspondente na sequência).
- **"Quero mudar um princípio/regra do projeto"** → `/speckit-constitution`.

O `/kanban-start` já cuida de acionar o `dev` para implementar, o `qa` como gate obrigatório (testes de UI e lógica antes de fechar a task) e, ao final, pergunta se algo deu errado — se sim, registra a lição aprendida no arquivo do agente/skill responsável, para o processo melhorar com o tempo. Depois dessa retrospectiva, pergunta também se deve commitar ou commitar e dar push — sempre em Conventional Commits, com uma mensagem detalhada o suficiente para o commit servir como documentação da mudança (o quê, por quê, decisões tomadas na implementação e resultado do QA).

Cada feature ganha seu próprio branch (nome igual ao slug em `specs/<feature>/`), criado/trocado automaticamente por `/feature-start` e `/kanban-start`/`/kanban-sync`; tarefas avulsas (`A\d{3}`) sempre rodam em `main`. Quando todas as tasks de uma feature terminam e o branch já foi commitado e enviado, `/kanban-start` pergunta se quer abrir um PR para `main`.

## Segurança

Para auditoria automatizada, rode `/cybersecurity-check` — o
`cybersecurity-blue` sobe a aplicação real, roda `shortcuts/security-test.sh`
e devolve um relatório honesto (com interpretação real do agente, não só a
saída crua das ferramentas — severidade CVSS, mapeamento ao OWASP Top
10/ASVS, raciocínio MITRE ATT&CK/D3FEND nos achados críticos) em
`docs/cybersec-report/`.

`shortcuts/security-test.sh` roda sete ferramentas, nesta ordem — do achado
mais barato/crítico de checar (segredo vazado) ao mais lento (scan dinâmico
contra a aplicação rodando):

| Ordem | Teste | Ferramenta | Cobre |
|---|---|---|---|
| 1 | `gitleaks` | [gitleaks](https://github.com/gitleaks/gitleaks) | Segredos/credenciais vazados, inclusive no histórico do git |
| 2 | `bandit` | [bandit](https://github.com/PyCQA/bandit) | SAST — código Python |
| 3 | `semgrep` | [semgrep](https://github.com/semgrep/semgrep) | SAST — regras OWASP Top 10, complementa o bandit |
| 4 | `deps` | `uv audit` / [pip-audit](https://github.com/pypa/pip-audit) | SCA — CVEs conhecidas nas dependências Python (OWASP A06:2021) |
| 5 | `trivy` | [trivy](https://github.com/aquasecurity/trivy) | SCA + IaC — dependências e misconfiguração de `Dockerfile`/`docker-compose.yml` |
| 6 | `django-check` | `manage.py check --deploy` | Configuração de deploy do Django (OWASP A05:2021) |
| 7 | `zap` | OWASP ZAP Baseline | DAST — scan dinâmico contra o dev server rodando |

`gitleaks`, `trivy` e o ZAP rodam via imagem Docker oficial (sem instalar
nada novo no sistema) — se `docker` não estiver disponível, o script pula
essas três checagens sozinho e avisa, sem quebrar as demais.

Por padrão o script roda a suíte inteira; para rodar só alguns testes,
passe os nomes da coluna "Teste" acima como argumento, na ordem que
preferir (o script sempre executa na ordem canônica da tabela):

```bash
./shortcuts/security-test.sh                  # suíte completa
./shortcuts/security-test.sh gitleaks trivy    # só esses dois
./shortcuts/security-test.sh --list            # lista os nomes válidos
```

Para pentest, veja o [Penligent](https://www.penligent.ai/).

## Como contribuir

Contribuições são bem-vindas. Abra uma *issue* para sugerir ideias, relatar problemas ou discutir direções do projeto, ou envie um *pull request* com sua proposta de mudança.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
