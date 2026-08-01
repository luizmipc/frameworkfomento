---
name: "cybersecurity-check"
description: "Faz o subagente cybersecurity-blue subir a aplicação real (app/, rodando de verdade) e rodar shortcuts/security-test.sh (SAST via bandit, SCA via uv audit/pip-audit, checagem de configuração via manage.py check --deploy, e um scan dinâmico OWASP ZAP Baseline), classificando achados por severidade CVSS e mapeando ao OWASP Top 10/ASVS — devolvendo um cybersec-report salvo em docs/cybersec-report/. Use quando a intenção for 'quero saber se há vulnerabilidades de segurança conhecidas na aplicação'."
argument-hint: "Opcional: nada necessário — sempre testa a aplicação real em app/"
compatibility: "Requires app/ (aplicação Django real), shortcuts/security-test.sh, docs/assets/ (sistema de design compartilhado), o skill 'run' e o subagente cybersecurity-blue em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/cybersecurity-check/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando não corrige nada — é uma auditoria de segurança honesta contra
a aplicação real, rodando de verdade. O resultado é um relatório; agir sobre
ele (corrigir dependência, endurecer configuração, patchear código) é sempre
um comando separado (`/quick-task`, `/kanban-sync` → "Criar nova tarefa"),
decidido pelo usuário depois de ler o relatório. Diferente do `qa`, aqui não
existe variante de protótipo estático — segurança de um mockup HTML/CSS/JS
sem backend não tem superfície de ataque real para testar.

## Passo 1 — Subir a aplicação real

1. Invoque o skill `run` (`Skill(skill="run")`) para subir a aplicação —
   não reimplemente "como iniciar o projeto", reaproveite o que esse skill
   já sabe fazer para este repo (mesma lógica de `qa-production-test`
   Passo 2).
2. Confirme que a aplicação responde (`curl` na URL local) antes de
   prosseguir.

## Passo 2 — Rodar `shortcuts/security-test.sh`

1. Rode `./shortcuts/security-test.sh` a partir da raiz do repo e capture a
   saída completa das quatro checagens (bandit, auditoria de dependências,
   `manage.py check --deploy`, OWASP ZAP Baseline).
2. Se o scan ZAP tiver sido pulado (sem `docker` disponível no ambiente),
   registre isso honestamente no relatório — não invente achados dinâmicos
   que não rodaram.
3. Liste os arquivos gerados em `docs/cybersec-report/zap/` (relatório HTML
   bruto do ZAP) — são evidência de apoio, não o relatório final.

## Passo 3 — Classificação e escrita do relatório

Invoque o subagente `cybersecurity-blue` (`subagent_type:
"cybersecurity-blue"`) com um prompt que inclua:
- A saída completa capturada no Passo 2, por checagem.
- Instrução explícita de aplicar as **Táticas de segurança** já descritas
  em `cybersecurity-blue.md` (CVSS + contexto de exploração, ASVS nível 1
  como régua, raciocínio ATT&CK → D3FEND para achados Crítico/Alto, postura
  geral pelo NIST CSF) — não só transcrever a saída da ferramenta.
- Instrução de honestidade: reporte só o que as ferramentas realmente
  encontraram — nunca invente uma vulnerabilidade para parecer mais
  completo, e registre também os controles que passaram sem ressalva.
- O template de saída — seção **"Template do documento cybersec-report"**
  abaixo.
- Peça que escreva com `Write` em
  `docs/cybersec-report/<data-ISO>.html` (ex.:
  `docs/cybersec-report/2026-08-01.html`) — HTML, nunca `.md`, linkando os
  assets compartilhados `../assets/style.css`/`../assets/script.js` (mesma
  convenção do resto de `docs/`, ver `docs-sync/SKILL.md`) — e que adicione
  um card apontando para esse arquivo na seção "Outras fontes" de
  `docs/index.html` (crie o grupo `docs/cybersec-report/` se for o primeiro
  relatório).

### Template do documento cybersec-report

Página HTML única por rodada de teste, no mesmo esqueleto de
`docs/index.html`/`docs/qa-report/*.html` (`<div class="layout">` com
`<nav class="toc">` + `<main>`), reaproveitando as classes já existentes em
`docs/assets/style.css` (`.quote`, `.kicker`, `.lede`, `.callout`,
`.badge-high`/`.badge-medium`/`.badge-low`/`.badge-na` para severidade,
`.story`/`.story-head` por achado, tabelas para os resumos). Estrutura de
conteúdo (não o HTML literal — adapte ids/âncoras ao `nav.toc`):

1. **Cabeçalho**: `h1` "Relatório de Segurança — cybersecurity-blue", uma
   `.lede` dizendo o que foi testado (aplicação real em `app/`), data,
   comandos/ferramentas rodados, e histórico de rodada (nº da rodada + o
   que mudou desde a última, mesmo padrão de `docs/qa-report/*.html`).
2. **Sumário executivo**: tabela com contagem de achados por severidade
   (Crítica/Alta/Média/Baixa/Informativa, com CVSS) **e** um parágrafo
   enquadrando a postura atual nas cinco funções do NIST CSF
   (Identify/Protect/Detect/Respond/Recover — ex.: "Detect: nenhum logging
   de tentativa de autenticação falha ainda; Protect: cookies de sessão
   sem `Secure`/`HttpOnly` configurados").
3. **Escopo e metodologia**: o que foi testado (SAST via bandit, SCA via
   `uv audit`/pip-audit, config via `manage.py check --deploy`, DAST via
   OWASP ZAP Baseline), tabela mapeando cada ferramenta à(s) categoria(s)
   do OWASP Top 10 2021 cobertas, e nota de que a régua de "passou" usa
   OWASP ASVS nível 1 como checklist (não só ausência de alerta da
   ferramenta).
4. **Achados**: um `section.story` por achado, `id="achado-N"`,
   `.story-head` com `h3` (ex.: "A06:2021 — Vulnerable and Outdated
   Components: `django` desatualizado, CVE-YYYY-NNNNN") + badge de
   severidade com o CVSS no texto (`badge-high` 🔴 "Crítica/Alta — CVSS
   X.X", `badge-medium` 🟡 "Média — CVSS X.X", `badge-low` 🟢 "Baixa — CVSS
   X.X", `badge-na` ⚪ "Informativa"), seguido de:
   - "O que foi encontrado" + "Evidência" (trecho real da saída da
     ferramenta, nunca inventado);
   - "Impacto";
   - "Recomendação";
   - "Prazo de remediação recomendado" (SLA por severidade: Crítica = antes
     do próximo deploy, Alta = até 30 dias, Média = até 60 dias, Baixa =
     até 90 dias);
   - **só para achados Crítica/Alta**: "Como isso seria explorado (MITRE
     ATT&CK)" e "Controle defensivo recomendado (MITRE D3FEND)".
5. **O que já está bem protegido**: achados negativos honestos (controles
   que passaram sem ressalva), mesmo espírito de "O que funcionou bem" do
   relatório de QA.
6. **Para quem resolver**: uma linha por achado com problema, linkando
   `#achado-N`, roteado quase sempre para `dev` (é sempre código/config/
   dependência real) — só rotear para `product-owner` se o achado for de
   compliance/processo, nunca para `designer`.
7. **Apêndice**: comandos exatos executados (os quatro passos de
   `shortcuts/security-test.sh`) e versões das ferramentas usadas.
8. `.page-footer` com o disclaimer padrão (ver Passo 4 abaixo).

## Passo 4 — Reportar

```
## Auditoria de segurança concluída (/cybersecurity-check)

- Aplicação testada: app/ (rodando de verdade)
- Achados: N (🔴 X Crítica/Alta · 🟡 Y Média · 🟢 Z Baixa · ⚪ W Informativa)
- Documento completo: docs/cybersec-report/<data>.html

Este comando não corrige nada — se algo aqui virar trabalho, use
/kanban-sync → "Criar nova tarefa" → "A partir de achados de segurança
(docs/cybersec-report/)", ou peça ao dev para agir sobre o parecer.
```

## Passo 5 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Aplicação real rodando e acessível antes do teste
- [ ] `shortcuts/security-test.sh` rodou e sua saída completa foi capturada
      (ZAP registrado como pulado, honestamente, se `docker` indisponível)
- [ ] `cybersecurity-blue` produziu `docs/cybersec-report/<data>.html` com
      achados classificados por severidade CVSS, raciocínio ATT&CK/D3FEND
      nos Crítica/Alta, e o que já está bem protegido
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] Retrospectiva rodou ao final
