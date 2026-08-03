---
name: "coordenador-production-test"
description: "Equivalente a /coordenador-test, mas testa a aplicação real (app/, rodando de verdade via docker compose/manage.py), não o protótipo estático — o subagente coordenador-de-pesquisa vira um coordenador/diretor de pesquisa institucional de verdade, loga com um usuário de teste e usa o sistema com visão de portfólio, devolvendo um documento de Persona (canvas + parecer/dores) salvo em docs/persona/<slug>-producao-coordenador.html. Use quando a intenção for 'quero saber se a aplicação já implementada serve à agenda estratégica de pesquisa do instituto e ao risco institucional'."
argument-hint: "Opcional: slug da feature a testar (ex.: manage-call-for-proposals) — se vazio, detecta/pergunta"
compatibility: "Requires app/ com pelo menos uma feature implementada, o skill 'run' para subir a aplicação, docs/assets/ e o subagente coordenador-de-pesquisa em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/coordenador-production-test/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Irmão de `/coordenador-test`: mesma ideia (persona real testando, relatório
honesto), mas aqui a aplicação é de verdade — cliques têm efeito real. Isso
muda o que conta como dor: num protótipo estático, um clique que não faz
nada é esperado; aqui, é um bug real e deve ser reportado como tal.

Este comando não escreve nem corrige nada além do documento de persona (e
do usuário de teste descartável do Passo 2) — agir sobre os achados é
sempre um comando separado.

## Passo 0 — Garantir a agenda institucional (bootstrap)

Idêntico ao Passo 0 de `coordenador-test/SKILL.md` — rode
`find docs/persona -maxdepth 1 -name 'coordenador-instituto.html'` e, se
ausente, pergunte os dados institucionais e crie o doc canônico (seção
"Template da agenda institucional" daquele arquivo) antes de prosseguir. Se
já existir, siga direto ao Passo 1.

## Passo 1 — Escolher a feature a testar

1. Rode `find specs -mindepth 1 -maxdepth 1 -type d` para listar features.
2. Para cada uma, confirme o que **realmente** está implementado em `app/`
   (não confie só no `plan.md`): cheque a coluna `## Done` de `KANBAN.md`
   para essa feature e rode `find app -mindepth 1 -maxdepth 1 -type d -not
   -name config` para ver se existe um app Django real além do scaffold.
3. Se `$ARGUMENTS` nomear uma feature com implementação real, use-a.
4. Se nenhuma feature tiver nada implementado ainda, **pare aqui** e
   informe: "Nada implementado em produção ainda — rode `/kanban-start`
   para implementar tasks primeiro, ou use `/coordenador-test` para avaliar
   o protótipo estático." Não invoque o `coordenador-de-pesquisa` para
   avaliar o que não existe.
5. Se a feature estiver só parcialmente implementada, prossiga, mas anote
   exatamente quais tasks estão em Done — o `coordenador-de-pesquisa` deve
   testar só o que foi construído.

## Passo 2 — Subir a aplicação real

1. Invoque o skill `run` (`Skill(skill="run")`) para subir a aplicação.
2. Confirme que a aplicação responde antes de prosseguir.
3. **Garanta um usuário de teste descartável** para login — crie de forma
   idempotente, ex. via `manage.py shell`, um usuário fixo só para este
   teste (ex. `coordenador-test`) se ainda não existir. **Avise o usuário
   no chat que isso vai acontecer** antes de rodar. Não crie/edite nada além
   desse usuário de teste.

## Passo 3 — Percorrer a aplicação real com o usuário de teste

Prefira usar as ferramentas de browser (`mcp__claude-in-chrome__*`):
1. Carregue-as via `ToolSearch` (`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__form_input`).
2. Navegue até a aplicação rodando localmente, faça login com o usuário de
   teste.
3. Execute de ponta a ponta as tarefas de visão de portfólio (ver Passo 4)
   usando as telas e formulários reais. Capture screenshot de cada
   tela/estado relevante, incluindo erros.
4. Aqui, ao contrário do protótipo estático, um clique/formulário que não
   funciona como esperado **é uma dor real** — anote com precisão.

Se as ferramentas de browser não estiverem disponíveis ou falharem depois
de 2-3 tentativas, **não insista**: valide o que der por `curl`/`Bash`, e
diga claramente no documento final que a avaliação foi parcial.

## Passo 4 — Persona e teste (coordenador-de-pesquisa)

Invoque o subagente `coordenador-de-pesquisa`
(`subagent_type: "coordenador-de-pesquisa"`) com um prompt que inclua:
- A feature testada, exatamente quais tasks estão em Done (Passo 1.5) e o
  caminho de `specs/<slug>/spec.md`.
- O caminho de `docs/persona/coordenador-instituto.html` — ele deve ler a
  agenda institucional antes de julgar.
- As observações reais do Passo 3.
- As mesmas instruções de `/coordenador-test` (seção "Passo 4" daquele
  skill) para encarnar a persona institucional e executar 3-5 tarefas de
  visão de portfólio — mas deixando explícito que, aqui, bugs/erros reais
  encontrados **são dores válidas**, não apenas gaps de fluxo/clareza.
- O mesmo **"Template do documento de persona"** de `fundraiser-test/SKILL.md`.
- Peça que escreva com `Write` em
  `docs/persona/<slug>-producao-coordenador.html` (sufixo `-coordenador`
  obrigatório, nunca sobrescrever `docs/persona/<slug>-producao.html` do
  `fundraiser`), e que adicione/atualize o card correspondente em
  `docs/index.html`, e uma linha em
  `docs/persona/coordenador-instituto.html` § "Log de rodadas de teste".

## Passo 5 — Reportar

```
## Leitura estratégica em produção concluída (/coordenador-production-test)

- Feature testada: <slug> (tasks em Done: N)
- Persona: coordenador/diretor de pesquisa institucional
- Dores encontradas: N (🔴 X · 🟡 Y · 🟢 Z)
- Documento completo: docs/persona/<slug>-producao-coordenador.html
- Usuário de teste criado: <username>, local, descartável (ver Passo 2.3)

Este comando não corrige nada — se algo aqui virar trabalho, use
/quick-task ou peça ao product-owner para agir sobre o parecer.
```

## Passo 6 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] `docs/persona/coordenador-instituto.html` existe (bootstrap rodou se
      era a primeira vez)
- [ ] Feature com implementação real identificada (ou o comando parou
      cedo, honestamente, por não haver nada implementado)
- [ ] Aplicação real rodando e acessível antes do teste
- [ ] Usuário de teste descartável garantido, com aviso prévio ao usuário
- [ ] Aplicação percorrida de ponta a ponta com dados reais (ao vivo via
      browser, ou validação parcial por `curl` se browser não disponível)
- [ ] `coordenador-de-pesquisa` produziu
      `docs/persona/<slug>-producao-coordenador.html` com o mesmo template
      de `/coordenador-test`, incluindo bugs reais encontrados como dores
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] `docs/persona/coordenador-instituto.html` § "Log de rodadas de teste"
      ganhou uma linha nova
- [ ] Retrospectiva rodou ao final
