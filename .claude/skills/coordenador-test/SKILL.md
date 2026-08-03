---
name: "coordenador-test"
description: "Faz o subagente coordenador-de-pesquisa vestir a pele de um coordenador/diretor de pesquisa institucional (visão de portfólio, não de um único captador) e testar um protótipo estático (prototype/<slug-ou-avulsa>-<ID>/), devolvendo um documento de Persona (canvas completo + parecer/dores) salvo em docs/persona/<pasta>-coordenador.html. Use quando a intenção for 'quero saber se este protótipo serve à agenda estratégica de pesquisa do instituto e ao risco institucional, não só à experiência de um captador individual'. Para essa segunda lente (captador individual), use /fundraiser-test. Para testar a aplicação real já implementada, use /coordenador-production-test."
argument-hint: "Opcional: nome da pasta do protótipo (ex.: avulsa-A001) — se vazio, detecta/pergunta"
compatibility: "Requires prototype/*/ (protótipos estáticos gerados via kanban-sync), docs/assets/ (sistema de design compartilhado) e o subagente coordenador-de-pesquisa em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/coordenador-test/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando não escreve nem corrige nada — é uma leitura estratégica
honesta, vestindo a pele de quem responde pelo portfólio de pesquisa do
instituto, não pela experiência de uma única pessoa captando recursos. O
resultado é um relatório; agir sobre ele é sempre um comando separado.

## Passo 0 — Garantir a agenda institucional (bootstrap)

Rode `find docs/persona -maxdepth 1 -name 'coordenador-instituto.html'`. Se
não existir:

1. Pergunte via `AskUserQuestion` (texto livre onde fizer sentido) os dados
   institucionais reais necessários para fundamentar a persona: papel de
   quem coordena a pesquisa (diretor, coordenador de captação, etc.), porte
   e tipo do instituto (universidade, ICT, empresa, coletivo), quantas
   propostas/captadores ativos supervisiona hoje, linhas de pesquisa
   prioritárias, tipos de parceria/arranjo aceitáveis, apetite a risco
   institucional.
2. Com `Write`, crie `docs/persona/coordenador-instituto.html` seguindo a
   estrutura de seções definida em "Template da agenda institucional"
   abaixo — este é o doc canônico, criado uma vez, atualizado só quando a
   agenda muda (nunca a cada rodada de teste).
3. Adicione um card apontando para ele na seção "Outras fontes" de
   `docs/index.html` (grupo `docs/persona/`, se ainda não existir).

Se já existir, siga direto ao Passo 1 — não pergunte de novo nem tente
inferir se está desatualizado (se o usuário achar que mudou, ele mesmo pede
para atualizar via `/quick-task` ou edição direta).

### Template da agenda institucional

Página HTML única (`docs/persona/coordenador-instituto.html`), mesmo
esqueleto de `docs/index.html`/`docs/persona/*.html` (`<div class="layout">`
com `<nav class="toc">` + `<main>`, classes já existentes em
`docs/assets/style.css`). Seções:

1. **Cabeçalho**: nome da persona como `h1`, uma citação representativa em
   `.quote`, `.lede` explicando que este é o doc canônico da agenda
   institucional, criado/atualizado em `<data>`.
2. **Quem é essa persona** (canvas): papel institucional, porte/tipo do
   instituto, quantas propostas/captadores ativos supervisiona hoje, quais
   decisões estratégicas toma.
3. **Interesses estratégicos de pesquisa**: linhas de pesquisa prioritárias
   (lista nomeada, não texto livre genérico), tipos de parceria/arranjo
   aceitáveis, escala de proposta que faz sentido perseguir.
4. **Critérios de aprovação/risco institucional**: capacidade de execução e
   prestação de contas, viabilidade financeira/contrapartida, pensamento de
   portfólio/ROI — o que faz esta pessoa dizer "vale perseguir" vs. "não
   serve ao instituto".
5. **Frustrações atuais**: falta de visibilidade de portfólio, dependência
   de informação informal dispersa sobre financiadores.
6. **Histórico de avaliações de edital**: tabela vazia inicialmente
   (edital | veredito | data | link), alimentada por `/coordenador-edital-fit`.
7. **Log de rodadas de teste**: lista vazia inicialmente, alimentada por
   este comando e por `/coordenador-production-test` (um link por rodada).
8. **Log de reuniões estratégicas**: tabela vazia inicialmente (data |
   síntese | link), alimentada pelo Modo "Reunião estratégica" de
   `/kanban-sync`.

## Passo 1 — Escolher o protótipo

1. Rode `find prototype -mindepth 1 -maxdepth 1 -type d` para listar os
   protótipos existentes.
2. Se `$ARGUMENTS` já nomear uma pasta existente (ex.: `avulsa-A001`), use-a
   direto.
3. Se só existir uma pasta, use-a sem perguntar.
4. Se houver mais de uma e `$ARGUMENTS` não decidir, pergunte via
   `AskUserQuestion` (até 4 opções, rotuladas com o nome da pasta, descrição
   = a linha da task correspondente em `KANBAN.md` se encontrada).

Se `prototype/` estiver vazio, informe isso ao usuário e pare — não há o
que testar ainda (protótipos nascem via `/kanban-sync` → "Criar nova
tarefa" → "Essa tarefa envolve tela/fluxo de usuário?" → "Sim").

## Passo 2 — Reunir o contexto real da task

1. Ache a task dona do protótipo em `KANBAN.md` (procure o caminho
   `prototype/<pasta>/` nas linhas de task) — pegue a descrição completa.
2. Se a task pertencer a uma feature (`<slug>#T\d{3}`, não avulsa), leia
   `specs/<slug>/spec.md` (user stories, cenários de aceite, personas já
   levantadas) — isso é insumo, não verdade absoluta: o
   `coordenador-de-pesquisa` deve avaliar esses cenários pela lente
   institucional, não apenas confirmá-los.
3. Liste os arquivos do protótipo (`index.html`, `style.css`, `script.js`
   e quaisquer outros na pasta).

## Passo 3 — Percorrer o protótipo (evidência antes do julgamento)

Prefira ver o protótipo renderizado de verdade em vez de só ler o HTML. Se
ferramentas de browser (`mcp__claude-in-chrome__*`) estiverem disponíveis:
1. Carregue-as via `ToolSearch` (`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp`).
2. Abra `prototype/<pasta>/index.html` (caminho `file://` absoluto) numa
   aba nova.
3. Tente, como um coordenador institucional tentaria, ações que revelem
   visão de portfólio (ex.: quantas propostas estão em andamento ao mesmo
   tempo, se dá para distinguir risco entre elas, se algo sugere
   concentração indevida numa única frente). Capture screenshot de cada
   estado/tela relevante.
4. Anote **observações neutras** — ainda sem julgamento, isso é insumo para
   o Passo 4.

Se as ferramentas de browser não estiverem disponíveis, falharem depois de
2-3 tentativas, ou o protótipo não abrir, **não insista** — siga com
leitura cuidadosa de `index.html`/`style.css`/`script.js` como evidência, e
diga no relatório final que a avaliação foi por leitura de código, não por
uso ao vivo.

Lembre-se: o comentário no topo do `index.html` já identifica o protótipo
como não-funcional — cliques que não fazem nada não são uma dor por si só;
são esperados. Uma dor real, nesta lente, é sobre o protótipo esconder ou
não permitir visão de portfólio/risco institucional que um coordenador
precisaria.

## Passo 4 — Persona e teste (coordenador-de-pesquisa)

Invoque o subagente `coordenador-de-pesquisa`
(`subagent_type: "coordenador-de-pesquisa"`) com um prompt que inclua:
- A descrição da task (Passo 2.1) e, se houver, o resumo da spec/user
  stories/personas relevantes (Passo 2.2).
- O caminho da pasta do protótipo e a lista de arquivos (Passo 2.3).
- O caminho de `docs/persona/coordenador-instituto.html` (Passo 0) — ele
  deve ler a agenda institucional antes de julgar.
- As observações da navegação (Passo 3), se houve.
- Instrução explícita: **encarne o coordenador/diretor de pesquisa
  institucional** definido em `coordenador-instituto.html` (não um usuário
  genérico) e, ancorado nessa persona, execute mentalmente 3-5 tarefas
  realistas de visão de portfólio (ex.: "preciso saber, batendo o olho, se
  há concentração de risco num único financiador", "quero saber se alguma
  proposta em andamento saiu do escopo estratégico que definimos", "preciso
  decidir se aceito mais uma proposta nova dado o que já está em
  andamento"). Para cada tarefa, registre onde a persona hesitaria,
  erraria, ou desistiria — e por quê, na perspectiva institucional.
- Instrução explícita de honestidade: só reporte dores realmente
  observáveis, nunca invente. Se algo funcionou bem, diga também.
- O template de saída — seção **"Template do documento de persona"** de
  `fundraiser-test/SKILL.md` (mesmo formato, reaproveitado literalmente
  para não divergir entre os comandos de persona do repo).
- Peça que ele escreva o arquivo com `Write` em
  `docs/persona/<pasta-do-protótipo>-coordenador.html` — sufixo
  `-coordenador` obrigatório, nunca sobrescrever o
  `docs/persona/<pasta>.html` do `fundraiser` no mesmo protótipo — e que
  adicione um card apontando para esse arquivo na seção "Outras fontes" de
  `docs/index.html`, e uma linha em `docs/persona/coordenador-instituto.html`
  § "Log de rodadas de teste".

## Passo 5 — Reportar

```
## Leitura estratégica concluída (/coordenador-test)

- Protótipo testado: prototype/<pasta>/
- Persona: coordenador/diretor de pesquisa institucional
- Dores encontradas: N (🔴 X · 🟡 Y · 🟢 Z)
- Documento completo: docs/persona/<pasta>-coordenador.html

Este comando não corrige nada — se algo aqui virar trabalho, use
/quick-task (ajuste pontual) ou peça ao product-owner para agir sobre o
parecer.
```

## Passo 6 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] `docs/persona/coordenador-instituto.html` existe (bootstrap rodou se
      era a primeira vez)
- [ ] Protótipo a testar identificado
- [ ] Contexto real da task (e da spec, se houver) levantado antes do teste
- [ ] Protótipo percorrido (ao vivo via browser, ou por leitura de código
      se browser não disponível) — evidência antes do julgamento
- [ ] `coordenador-de-pesquisa` produziu `docs/persona/<pasta>-coordenador.html`
      com canvas de persona completo, dores reais (não inventadas) e o que
      funcionou bem
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] `docs/persona/coordenador-instituto.html` § "Log de rodadas de teste"
      ganhou uma linha nova
- [ ] Retrospectiva rodou ao final
