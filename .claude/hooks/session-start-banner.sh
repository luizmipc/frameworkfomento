#!/usr/bin/env bash
cat <<'EOF' | jq -Rs '{systemMessage: .}'
Comandos deste projeto (frameworkfomento) — tutorial completo no README.md:

Spec Kit:
  /speckit-constitution   cria/atualiza os principios do projeto
  /speckit-specify        escreve a spec de uma feature nova
  /speckit-clarify        resolve ambiguidades da spec
  /speckit-plan           gera o plano tecnico
  /speckit-tasks          quebra o plano em tasks
  /speckit-analyze        checa consistencia entre spec/plano/tasks
  /speckit-implement      executa as tasks (uso manual)
  /speckit-converge       compara codigo vs spec/plano/tasks
  /speckit-checklist      gera checklist de qualidade
  /speckit-taskstoissues  converte tasks em issues do GitHub

Kanban e atalhos:
  /kanban-sync    reuniao de scrum: sincroniza o quadro ou cria tarefa avulsa
  /kanban-start   escolhe e implementa uma tarefa do quadro (aqui no chat)
  /feature-start  atalho: specify->clarify->plan->tasks->kanban-sync numa tacada
  /quick-task     atalho: cria e ja implementa uma tarefa pequena
  /docs-sync      atualiza docs/ a partir do estado real do projeto

Fundraiser (persona de captador de recursos):
  /fundraiser-test                  testa o prototipo estatico, devolve parecer em docs/persona/
  /fundraiser-production-test       testa a aplicacao real ja implementada, devolve parecer em docs/persona/
  /fundraiser-submission-timeline   cria checklist HTML gated de submissao a partir dos PDFs de um edital, em docs/submissions/

QA (guardiao de criterios de aceite):
  /qa-test             testa o prototipo estatico, devolve relatorio em docs/qa-report/
  /qa-production-test  testa a aplicacao real ja implementada, devolve relatorio em docs/qa-report/

Cybersecurity Blue (guardiao de seguranca defensiva):
  /cybersecurity-check  roda SAST/SCA/config/OWASP ZAP contra a app real, devolve relatorio em docs/cybersec-report/

Devops (auditoria de prontidao operacional de deploy):
  /check-deployment  builda a imagem, valida docker-compose/CI/CD e os Doze Fatores, devolve relatorio em docs/deploy-report/
EOF
