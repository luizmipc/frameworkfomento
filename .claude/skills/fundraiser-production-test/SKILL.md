---
name: "fundraiser-production-test"
description: "Equivalente a /fundraiser-test, mas testa a aplicação real (app/, rodando de verdade via docker compose/manage.py), não o protótipo estático — o subagente fundraiser vira um captador de recursos de verdade, loga com um usuário de teste e usa o sistema, devolvendo um documento de Persona (canvas + parecer/dores) salvo em docs/persona/. Use quando a intenção for 'quero saber que dores um captador de recursos sentiria usando a aplicação já implementada'."
argument-hint: "Opcional: slug da feature a testar (ex.: manage-call-for-proposals) — se vazio, detecta/pergunta"
compatibility: "Requires app/ com pelo menos uma feature implementada, o skill 'run' para subir a aplicação, docs/assets/ e o subagente fundraiser em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/fundraiser-production-test/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Irmão de `/fundraiser-test`: mesma ideia (persona real testando, relatório
honesto), mas aqui a aplicação é de verdade — cliques têm efeito real
(criam dados, chamam views, podem quebrar). Isso muda o que conta como dor:
num protótipo estático, um clique que não faz nada é esperado; aqui, é um
bug real e deve ser reportado como tal.

Este comando não escreve nem corrige nada além do documento de persona (e
do usuário de teste descartável do Passo 2) — agir sobre os achados é
sempre um comando separado, decidido pelo usuário depois de ler o
documento.

## Passo 1 — Escolher a feature a testar

1. Rode `find specs -mindepth 1 -maxdepth 1 -type d` para listar features.
2. Para cada uma, confirme o que **realmente** está implementado em `app/`
   (não confie só no `plan.md`): cheque a coluna `## Done` de `KANBAN.md`
   para essa feature e rode algo como `find app -mindepth 1 -maxdepth 1
   -type d -not -name config` para ver se existe um app Django real além
   do scaffold.
3. Se `$ARGUMENTS` nomear uma feature com implementação real, use-a.
4. Se nenhuma feature tiver nada implementado ainda (`app/` só com o
   scaffold padrão), **pare aqui** e informe: "Nada implementado em
   produção ainda — rode `/kanban-start` para implementar tasks primeiro,
   ou use `/fundraiser-test` para avaliar o protótipo estático." Não invoque
   o `fundraiser` para avaliar o que não existe.
5. Se a feature estiver só parcialmente implementada, prossiga, mas anote
   exatamente quais tasks estão em Done (o que existe de verdade) — o
   `fundraiser` deve testar só o que foi construído, não o escopo inteiro
   da spec.

## Passo 2 — Subir a aplicação real

1. Invoque o skill `run` (`Skill(skill="run")`) para subir a aplicação —
   não reimplemente a lógica de "como iniciar o projeto", reaproveite o que
   esse skill já sabe fazer para este repo (Docker/`uv run manage.py
   runserver`, conforme `README.md`/`docker-compose.yml`).
2. Confirme que a aplicação responde (ex.: `curl` na URL local ou
   navegação via browser) antes de prosseguir.
3. **Garanta um usuário de teste descartável** para login (as rotas exigem
   sessão autenticada) — crie de forma idempotente, ex. via `manage.py
   shell`, um usuário fixo só para este teste (ex. `fundraiser-test`) se
   ainda não existir. **Avise o usuário no chat que isso vai acontecer**
   antes de rodar — é uma alteração real no banco de dados local (SQLite de
   dev), reversível e de baixo risco, mas não é algo para fazer em
   silêncio. Não crie/edite nada além desse usuário de teste.

## Passo 3 — Percorrer a aplicação real com o usuário de teste

Prefira usar as ferramentas de browser (`mcp__claude-in-chrome__*`) para
testar de verdade, como a persona faria:
1. Carregue-as via `ToolSearch` (`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__form_input`).
2. Navegue até a aplicação rodando localmente, faça login com o usuário de
   teste.
3. Execute de ponta a ponta as tarefas realistas da persona (ver Passo 4)
   usando as telas e formulários reais — preencha dados plausíveis, envie
   formulários de verdade, confirme o que a aplicação faz (sucesso, erro,
   redirecionamento, mensagem de validação). Capture screenshot de cada
   tela/estado relevante, incluindo erros.
4. Aqui, ao contrário do protótipo estático, um clique/formulário que não
   funciona como esperado **é uma dor real** (possivelmente um bug) — anote
   com precisão o que foi tentado e o que aconteceu, para o `fundraiser`
   julgar o impacto na perspectiva da persona.

Se as ferramentas de browser não estiverem disponíveis ou falharem depois
de 2-3 tentativas, **não insista**: valide o que der por `curl`/`Bash`
(rotas respondem, formulário aceita/rejeita um POST de teste) e diga
claramente no documento final que a avaliação foi parcial, sem walkthrough
visual ao vivo.

## Passo 4 — Persona e teste (fundraiser)

Invoque o subagente `fundraiser` (`subagent_type: "fundraiser"`) com um
prompt que inclua:
- A feature testada, exatamente quais tasks estão em Done (Passo 1.5) e o
  caminho de `specs/<slug>/spec.md` para contexto de personas/cenários já
  levantados — insumo, não verdade absoluta, mesma lógica de
  `/fundraiser-test`.
- As observações reais da Passo 3 (screenshots descritas, erros
  encontrados, o que funcionou).
- As mesmas instruções de `/fundraiser-test` (seção "Passo 4" daquele
  skill) para encarnar uma persona concreta e plausível e executar 3-5
  tarefas realistas — mas deixando explícito que, aqui, bugs/erros reais
  encontrados **são dores válidas**, não apenas gaps de fluxo/clareza.
- O mesmo **"Template do documento de persona"** definido em
  `fundraiser-test/SKILL.md` — não duplicar o formato entre os dois
  comandos.
- Peça que escreva com `Write` em `docs/persona/<slug>-producao.html`
  (HTML, mesma convenção de assets compartilhados de `docs/`), e que
  adicione/atualize o card correspondente na seção "Outras fontes" de
  `docs/index.html`.

## Passo 5 — Reportar

```
## Teste de usabilidade em produção concluído (/fundraiser-production-test)

- Feature testada: <slug> (tasks em Done: N)
- Persona: <nome + uma linha de contexto>
- Dores encontradas: N (🔴 X · 🟡 Y · 🟢 Z)
- Documento completo: docs/persona/<slug>-producao.html
- Usuário de teste criado: <username>, local, descartável (ver Passo 2.3)

Este comando não corrige nada — se algo aqui virar trabalho, use
/quick-task (ajuste pontual) ou peça ao dev/designer para agir sobre o
parecer.
```

## Passo 6 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Feature com implementação real identificada (ou o comando parou
      cedo, honestamente, por não haver nada implementado)
- [ ] Aplicação real rodando e acessível antes do teste
- [ ] Usuário de teste descartável garantido, com aviso prévio ao usuário
- [ ] Aplicação percorrida de ponta a ponta com dados reais (ao vivo via
      browser, ou validação parcial por `curl` se browser não disponível)
- [ ] `fundraiser` produziu `docs/persona/<slug>-producao.html` com o
      mesmo template de `/fundraiser-test`, incluindo bugs reais
      encontrados como dores
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] Retrospectiva rodou ao final
