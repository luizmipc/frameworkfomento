---
name: "check-deployment"
description: "Faz o subagente devops subir a aplicação real (via o skill 'run'), verificar se há CI/CD configurado em .github/workflows/, validar docker-compose.yml, buildar a imagem do Dockerfile do zero, confirmar que o HEALTHCHECK chega a healthy, e inspecionar o processo de execução (CMD, migrate/collectstatic ausente, servidor de produção vs. dev server) contra os Doze Fatores — classificando achados por impacto na prontidão de deploy — devolvendo um deploy-report salvo em docs/deploy-report/. Use quando a intenção for 'quero saber se este projeto está pronto pra ser deployado de verdade'."
argument-hint: "Opcional: quais checagens rodar (ci, compose, build, healthcheck, runtime) — se vazio, roda a suíte completa"
compatibility: "Requires Dockerfile e docker-compose.yml na raiz, docs/assets/ (sistema de design compartilhado), o skill 'run', docker/docker compose instalados no ambiente, e o subagente devops em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/check-deployment/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando não corrige nada — é uma auditoria honesta de prontidão
operacional de deploy contra o estado real do repo, rodando de verdade.
O resultado é um relatório; agir sobre ele (escrever workflow de CI, trocar
o servidor de produção, adicionar passo de migrate) é sempre um comando
separado (`/quick-task`, `/meeting` → "Criar nova tarefa"), decidido
pelo usuário depois de ler o relatório. Diferente do `cybersecurity-blue`,
aqui não há ferramenta de terceiro dedicada (`gitleaks`/`trivy`/`zap`) — as
checagens são comandos diretos de Docker/git/GitHub Actions focados em
prontidão, não em vulnerabilidade.

## Passo 1 — Descobrir e validar o pipeline de CI/CD

1. `find .github/workflows -type f 2>/dev/null` a partir da raiz e registre
   honestamente o que a checagem realmente encontrar — nem invente um
   workflow que não existe, nem assuma "sem CI" sem checar; este arquivo
   fica desatualizado facilmente porque CI é adicionado/mudado fora deste
   comando.
2. Se existir algum arquivo, leia-o e resuma o que roda (build/lint/teste/
   deploy) e em quais triggers (push, PR, tag).
3. Não confunda com `.specify/workflows/speckit/workflow.yml` — isso é do
   Spec Kit (automação de spec/plan/tasks), sem relação com deploy da
   aplicação; se notar risco de confusão, diga isso explicitamente no
   relatório.

## Passo 2 — Subir a aplicação real e validar o HEALTHCHECK

1. Invoque o skill `run` (`Skill(skill="run")`) para subir a aplicação —
   não reimplemente "como iniciar o projeto" (mesma lógica do Passo 1 de
   `cybersecurity-check/SKILL.md`).
2. Confirme que a aplicação responde (`curl` na URL local) antes de
   prosseguir.
3. Se a aplicação tiver subido via `docker compose`, confirme que o
   `HEALTHCHECK` do `Dockerfile` chega a `healthy` dentro da janela
   configurada (`--start-period=5s --retries=3`) via `docker compose ps`
   ou `docker inspect --format='{{json .State.Health}}' <container>` —
   registre honestamente se ficar preso em `starting`/`unhealthy`.

## Passo 3 — Validar `docker-compose.yml` e variáveis de ambiente

1. Rode `docker compose config` a partir da raiz — pega erro de sintaxe ou
   variável não resolvida sem precisar subir nada.
2. Confira que `.env.example` cobre todas as variáveis referenciadas em
   `docker-compose.yml`/`Dockerfile` (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`,
   `DJANGO_ALLOWED_HOSTS`, `DJANGO_HOST`, `DJANGO_PORT`) — registre lacuna
   se alguma variável usada não tiver exemplo documentado.

## Passo 4 — Build de imagem limpo

1. Rode `docker build --no-cache -t frameworkfomento-deploy-check:<data-ISO>
   .` a partir da raiz — meça sucesso/falha e tempo de build.
2. Registre o tamanho real da imagem resultante (`docker images
   frameworkfomento-deploy-check:<data-ISO>`) como baseline — o repo ainda
   não define um budget de tamanho; registre o número, não invente um
   limite.
3. Se o build falhar, capture a saída completa do erro — nunca resuma
   "build falhou" sem o motivo real.
4. Remova a imagem de teste ao final (`docker rmi
   frameworkfomento-deploy-check:<data-ISO>`) para não deixar lixo local.

## Passo 5 — Inspecionar o processo de execução (Doze Fatores)

1. Leia o `CMD` do `Dockerfile` (`uv run manage.py runserver
   ${DJANGO_HOST:-0.0.0.0}:${DJANGO_PORT:-8000}`) e classifique: é o
   servidor de desenvolvimento do Django, não um servidor WSGI/ASGI de
   produção (gunicorn/daphne/uvicorn) — achado de prontidão (Dev/prod
   parity, Fator X). Não trate isso como achado de segurança per se — se
   quiser citar o ângulo de segurança do `runserver`, referencie que isso é
   escopo do `cybersecurity-blue`, não duplique a análise aqui.
2. Confirme se há passo de `migrate`/`collectstatic` automatizado no
   `CMD`/entrypoint — hoje não há. Registre como achado de separação
   build/release/run (schema pode divergir entre deploys).
3. Confirme que o `HEALTHCHECK` e o usuário não-root (`appuser`, uid 1000)
   já existem no `Dockerfile` — registre isso na seção "O que já está
   pronto para produção", não como achado novo.

## Passo 6 — Classificação e escrita do relatório

Invoque o subagente `devops` (`subagent_type: "devops"`) com um prompt que
inclua:
- A saída completa capturada nos Passos 1 a 5.
- Instrução explícita de aplicar as **Táticas de deployment** já descritas
  em `devops.md` (Doze Fatores, build/release/run, maturidade de pipeline
  CI/CD, fronteira com o `cybersecurity-blue`).
- Instrução de honestidade: reporte só o que as checagens realmente
  encontraram — nunca invente um achado para parecer mais completo, e
  registre também o que já está pronto para produção.
- O template de saída — seção **"Template do documento deploy-report"**
  abaixo.
- Peça que escreva com `Write` em
  `docs/deploy-report/<data-ISO>.html` (ex.:
  `docs/deploy-report/2026-08-01.html`) — HTML, nunca `.md`, linkando os
  assets compartilhados `../assets/style.css`/`../assets/script.js` (mesma
  convenção do resto de `docs/`, ver `docs-sync/SKILL.md`) — e que adicione
  um card apontando para esse arquivo na seção "Outras fontes" de
  `docs/index.html` (o grupo "Outras fontes" já existe — só adicione o card
  ao `.card-grid` existente, junto dos de persona/qa-report/cybersec-report).

### Template do documento deploy-report

Página HTML única por rodada de teste, no mesmo esqueleto de
`docs/index.html`/`docs/cybersec-report/*.html` (`<div class="layout">` com
`<nav class="toc">` + `<main>`), reaproveitando as classes já existentes em
`docs/assets/style.css` (`.quote`, `.kicker`, `.lede`, `.callout`,
`.badge-high`/`.badge-medium`/`.badge-low`/`.badge-na` para impacto,
`.story`/`.story-head` por achado, tabelas para os resumos). Estrutura de
conteúdo (não o HTML literal — adapte ids/âncoras ao `nav.toc`):

1. **Cabeçalho**: `h1` "Relatório de Prontidão de Deploy — devops", uma
   `.lede` dizendo o que foi testado (aplicação real, `Dockerfile`,
   `docker-compose.yml`, `.github/workflows/`), data, comandos rodados, e
   histórico de rodada (nº da rodada + o que mudou desde a última, mesmo
   padrão de `docs/qa-report/*.html`/`docs/cybersec-report/*.html`).
2. **Sumário executivo**: tabela com contagem de achados por impacto
   (🔴 Bloqueante/Alto, 🟡 Médio, 🟢 Baixo, ⚪ Informativo) **e** um
   parágrafo enquadrando a maturidade atual de CI/CD nos quatro níveis
   (0 — nenhuma automação; 1 — build/lint automatizado; 2 — testes
   automatizados no push; 3 — deploy automatizado com rollback) — classifique
   pelo que o Passo 1 realmente encontrou nesta rodada, não por um nível
   fixo assumido de antemão (hoje há `ci.yml` rodando lint+testes no push,
   nível 2 — mas confirme contra o estado real do arquivo a cada rodada).
3. **Escopo e metodologia**: quais das cinco checagens deste comando
   rodaram nesta rodada (completa ou parcial, se `$ARGUMENTS` restringiu) —
   tabela mapeando cada checagem ao que cobre:
   - CI/CD (`.github/workflows/`) — existência e conteúdo de pipeline
     automatizado.
   - `docker compose config` — validade de sintaxe/variáveis do compose.
   - Build de imagem (`docker build --no-cache`) — reprodutibilidade e
     tamanho.
   - `HEALTHCHECK`/`docker inspect` — disposability em runtime.
   - Inspeção do `CMD` — servidor de produção vs. dev, passo de release
     (migrate/collectstatic).
   Nota explícita da fronteira: misconfiguração de `Dockerfile`/
   `docker-compose.yml` com CVE/CVSS (via `trivy`) e configuração de deploy
   do Django (via `manage.py check --deploy`) são escopo do
   `/cybersecurity-check`, não recobertos aqui.
4. **Achados**: um `section.story` por achado, `id="achado-N"`,
   `.story-head` com `h3` (ex.: "Dev/prod parity: servidor de
   desenvolvimento do Django em produção (`runserver`)") + badge de impacto
   (`badge-high` 🔴 "Bloqueante/Alto", `badge-medium` 🟡 "Médio",
   `badge-low` 🟢 "Baixo", `badge-na` ⚪ "Informativo"), seguido de:
   - "O que foi encontrado" + "Evidência" (saída real do comando, nunca
     inventada);
   - "Impacto";
   - "Recomendação";
   - "Janela recomendada de correção" (Bloqueante = antes do próximo deploy
     real, Alto = até 30 dias, Médio = até 60 dias, Baixo = até 90 dias);
   - **só para achados Bloqueante/Alto**: "Fator do 12-Factor violado" (ex.:
     "IX. Disposability" ou "X. Dev/prod parity").
5. **O que já está pronto para produção**: achados negativos honestos
   (usuário não-root, `HEALTHCHECK` configurado, segredos só via env var
   com fail-safe) — mesmo espírito de "O que já está bem protegido" do
   `cybersec-report`.
6. **Para quem resolver**: uma linha por achado com problema, linkando
   `#achado-N`, roteado quase sempre para `dev` — se um achado se sobrepuser
   com lente de segurança, rotear para `cybersecurity-blue` em vez de
   duplicar a análise aqui.
7. **Apêndice**: comandos exatos executados nesta rodada e tamanho da
   imagem buildada.
8. `.page-footer` com o disclaimer padrão (ver Passo 7 abaixo).

## Passo 7 — Reportar

```
## Auditoria de prontidão de deploy concluída (/check-deployment)

- Aplicação testada: app/ (rodando de verdade) + Dockerfile + docker-compose.yml
- Achados: N (🔴 X Bloqueante/Alto · 🟡 Y Médio · 🟢 Z Baixo · ⚪ W Informativo)
- Documento completo: docs/deploy-report/<data>.html

Este comando não corrige nada — se algo aqui virar trabalho, use
/meeting → "Criar nova tarefa" → "A partir de um relatório existente" →
"docs/deploy-report/", ou peça ao dev para agir sobre o parecer.
```

## Passo 8 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Aplicação real rodando e acessível antes do teste
- [ ] `.github/workflows/` verificado (existente ou honestamente reportado
      como ausente)
- [ ] `docker compose config` rodou sem erro (ou o erro foi capturado)
- [ ] Build limpo (`docker build --no-cache`) rodou e teve sucesso/falha
      registrado, com tamanho de imagem anotado, e a imagem de teste
      removida ao final
- [ ] `HEALTHCHECK` confirmado `healthy` (ou o estado real registrado)
- [ ] `CMD` do `Dockerfile` inspecionado quanto a servidor de produção vs.
      dev e passo de migrate/collectstatic ausente
- [ ] `devops` produziu `docs/deploy-report/<data>.html` com achados
      classificados por impacto e sem duplicar escopo do
      `cybersecurity-blue`
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] Retrospectiva rodou ao final
