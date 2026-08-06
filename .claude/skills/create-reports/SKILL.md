---
name: "create-reports"
description: "Gera vários relatórios de uma vez (Segurança, Deploy, QA, Persona) em paralelo, a partir dos mesmos agentes/skills já existentes (cybersecurity-check, check-deployment, qa-test/qa-production-test, fundraiser-test/coordenador-test e variantes de produção) — sem duplicar lógica, só orquestra o fan-out e reúne os links no final."
argument-hint: "Opcional: quais relatórios gerar (ex. 'segurança e qa'), senão pergunta no chat"
compatibility: "Requires os subagentes cybersecurity-blue/devops/qa/fundraiser/coordenador-de-pesquisa em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/create-reports/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Composição fina (mesmo espírito de `quick-task`): não reimplementa nenhuma
lógica de relatório — só decide quais dos relatórios já existentes rodar e
os aciona em paralelo. Se `$ARGUMENTS` já indicar claramente quais tipos
gerar, pule a pergunta do Passo 1 e use-os direto.

## Passo 1 — Quais relatórios

Pergunte via `AskUserQuestion` (`multiSelect: true`, 4 opções): **"Quais
relatórios gerar?"**
- **"Segurança"** — `cybersecurity-blue` via `/cybersecurity-check`
  (`docs/cybersec-report/`).
- **"Deploy"** — `devops` via `/check-deployment` (`docs/deploy-report/`).
- **"QA"** — `qa`, mas primeiro pergunte via `AskUserQuestion` (2 opções):
  **"QA: protótipo ou aplicação real?"** — "Protótipo" (`/qa-test`) ou
  "Aplicação real" (`/qa-production-test`).
- **"Persona"** — pergunte via `AskUserQuestion` (`multiSelect: true`, até
  4 opções, combinando lente × alvo): "Fundraiser · protótipo"
  (`fundraiser-test`), "Fundraiser · aplicação real"
  (`fundraiser-production-test`), "Coordenador · protótipo"
  (`coordenador-test`), "Coordenador · aplicação real"
  (`coordenador-production-test`) — pode escolher mais de uma combinação.

## Passo 2 — Rodar em paralelo

Para cada relatório selecionado no Passo 1, acione o subagente dono
(`subagent_type` correspondente) instruindo-o a rodar exatamente a skill já
documentada nele (`/cybersecurity-check`, `/check-deployment`,
`/qa-test`/`/qa-production-test`, `/fundraiser-test`/
`/fundraiser-production-test`, `/coordenador-test`/
`/coordenador-production-test`) — **todas as chamadas de subagente desta
etapa vão num único bloco de mensagem, para rodarem em paralelo**, nunca
uma de cada vez em sequência. Não passe instruções além do que a skill de
cada um já cobre — este comando é só o fan-out.

## Passo 3 — Reunir e reportar

Espere todos os subagentes acionados no Passo 2 terminarem. Reporte:

```
## Relatórios gerados

- Segurança: docs/cybersec-report/<data>.html (ou "não selecionado")
- Deploy: docs/deploy-report/<data>.html (ou "não selecionado")
- QA: docs/qa-report/<arquivo>.html (ou "não selecionado")
- Persona: docs/persona/<arquivo>.html, ... (ou "não selecionado")

Rode /docs-sync para atualizar a navegação de docs/index.html com os
relatórios novos.
```

Não construa um dashboard HTML novo — `docs/index.html` (via `/docs-sync`)
já é o hub único que cross-linka todos os relatórios; reaproveite-o em vez
de duplicar.

## Passo 4 — Retrospectiva

Rode o mesmo procedimento canônico descrito em `kanban-start/SKILL.md`
(seção "Retrospectiva" — não duplicado aqui): pergunte via `AskUserQuestion`
se algo deu errado nesta rodada e, se sim, registre uma lição aprendida no
arquivo de agente/skill responsável (nunca em `speckit-*`/`.specify/`).

## Done When

- [ ] Quais relatórios gerar foi determinado (via `$ARGUMENTS` ou Passo 1),
      incluindo a sub-escolha protótipo/produção quando aplicável (QA,
      Persona)
- [ ] Todos os subagentes selecionados foram acionados num único bloco de
      mensagem (paralelo), não em sequência
- [ ] Relatório final lista o caminho de cada arquivo gerado e sugere
      `/docs-sync`
- [ ] Retrospectiva rodou ao final
