---
name: "qa-production-test"
description: "Equivalente a /qa-test, mas verifica a aplicação real (app/, rodando de verdade), não o protótipo estático — o subagente qa roda a suíte de testes automatizados relevante (uv run manage.py test) e faz um walkthrough ao vivo logado como usuário de teste, registrando pass/fail/partial por critério de aceite (FR-xxx de spec.md) com evidência real, salvo em docs/qa-report/. Use quando a intenção for 'quero saber se a aplicação já implementada realmente atende aos critérios de aceite'."
argument-hint: "Opcional: slug da feature a testar (ex.: manage-call-for-proposals) — se vazio, detecta/pergunta"
compatibility: "Requires app/ com pelo menos uma feature implementada, o skill 'run' para subir a aplicação, docs/assets/ e o subagente qa em .claude/agents/"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/qa-production-test/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Irmão de `/qa-test`: mesma ideia (conformidade a critério de aceite,
relatório honesto), mas aqui a aplicação é de verdade — testes
automatizados rodam de verdade e cliques têm efeito real. Isso muda o que
conta como falha: no protótipo, "falta estrutura" é o veredito máximo;
aqui, um critério que falha é um **bug real**.

Este comando não escreve nem corrige nada além do documento de relatório
(e do usuário de teste descartável do Passo 2) — agir sobre os achados é
sempre um comando separado, decidido pelo usuário depois de ler o
documento.

## Passo 1 — Escolher a feature a testar

1. Rode `find specs -mindepth 1 -maxdepth 1 -type d` para listar features.
2. Para cada uma, confirme o que **realmente** está implementado em `app/`
   (não confie só no `plan.md`): cheque quantas tasks `T\d{3}` estão `[x]`
   em `specs/<slug>/tasks.md` (o backlog/conclusão de `T\d{3}` vive só lá,
   não em `KANBAN.md`) e rode algo como `find app -mindepth 1 -maxdepth 1
   -type d -not -name config` para ver se existe um app Django real além
   do scaffold.
3. Se `$ARGUMENTS` nomear uma feature com implementação real, use-a.
4. Se nenhuma feature tiver nada implementado ainda (`app/` só com o
   scaffold padrão), **pare aqui** e informe: "Nada implementado em
   produção ainda — rode `/kanban-start` para implementar tasks primeiro,
   ou use `/qa-test` para avaliar o protótipo estático." Não invoque o
   `qa` para avaliar o que não existe.
5. Se a feature estiver só parcialmente implementada, prossiga, mas anote
   exatamente quais tasks estão em Done (o que existe de verdade) — o `qa`
   deve testar só os critérios cobertos pelo que foi construído, não o
   escopo inteiro da spec.

## Passo 2 — Subir a aplicação real

1. Invoque o skill `run` (`Skill(skill="run")`) para subir a aplicação —
   não reimplemente a lógica de "como iniciar o projeto", reaproveite o que
   esse skill já sabe fazer para este repo (Docker/`uv run manage.py
   runserver`, conforme `README.md`/`docker-compose.yml`).
2. Confirme que a aplicação responde (ex.: `curl` na URL local ou
   navegação via browser) antes de prosseguir.
3. **Garanta um usuário de teste descartável** para login (as rotas exigem
   sessão autenticada) — crie de forma idempotente, ex. via `manage.py
   shell`, um usuário fixo só para este teste (ex. `qa-test`) se ainda não
   existir. **Avise o usuário no chat que isso vai acontecer** antes de
   rodar — é uma alteração real no banco de dados local (SQLite de dev),
   reversível e de baixo risco, mas não é algo para fazer em silêncio. Não
   crie/edite nada além desse usuário de teste.

## Passo 3 — Rodar a suíte automatizada relevante

1. Identifique os testes já existentes cobrindo a feature/tasks em Done
   (Grep/Read em `app/*/tests*` ou onde o `qa` já os mantém, seguindo a
   convenção "não meça qualidade por cobertura vazia" de `qa.md`).
2. Rode `uv run manage.py test` (escopado ao(s) app(s) Django da feature,
   se possível, para não rodar a suíte inteira do projeto sem
   necessidade).
3. Capture a saída relevante (trecho com pass/fail por teste) — essa é
   evidência de primeira classe para os critérios cobertos por teste
   automatizado.

Se não houver nenhum teste automatizado cobrindo um critério em escopo,
isso não é em si uma falha do critério — é uma lacuna a registrar
("critério sem cobertura automatizada, verificado só via walkthrough ao
vivo no Passo 4").

## Passo 4 — Percorrer a aplicação real com o usuário de teste

Prefira usar as ferramentas de browser (`mcp__claude-in-chrome__*`) para
testar de verdade:
1. Carregue-as via `ToolSearch` (`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__form_input`).
2. Navegue até a aplicação rodando localmente, faça login com o usuário de
   teste.
3. Para cada critério em escopo (Passo 1), pergunte: "esse FR-xxx se
   sustenta de ponta a ponta, com dados reais, na aplicação rodando?"
   Execute o cenário com dados plausíveis, envie formulários de verdade,
   confirme o que a aplicação faz (sucesso, erro, redirecionamento,
   mensagem de validação). Capture screenshot de cada tela/estado
   relevante, incluindo erros.
4. Aqui, ao contrário do protótipo estático, um clique/formulário que não
   funciona como esperado **é uma falha real** (possivelmente um bug) —
   anote com precisão o que foi tentado e o que aconteceu.

Se as ferramentas de browser não estiverem disponíveis ou falharem depois
de 2-3 tentativas, **não insista**: valide o que der por `curl`/`Bash`
(rotas respondem, formulário aceita/rejeita um POST de teste) e diga
claramente no documento final que a avaliação foi parcial, sem walkthrough
visual ao vivo.

## Passo 5 — Exploração livre (curta, fora do escopo dos critérios)

Depois do walkthrough guiado do Passo 4, peça que `qa` defina uma carta
(missão de uma frase) e um tempo-box curto para explorar a aplicação real
além dos FR-xxx testados — usando a metodologia de teste que já é dele
(risco, carta/time-box, valores de fronteira; ver `qa.md`). Só faz sentido
aqui: no protótipo estático cliques soltos majoritariamente não significam
nada (sem backend), então `qa-test` não tem equivalente a este passo.
Registre achados nesta seção só se forem bugs reais observados, nunca
especulação — se nada surgir, a seção some do relatório.

## Passo 6 — Verificação por critério (qa)

Invoque o subagente `qa` (`subagent_type: "qa"`) com um prompt que inclua:
- A feature testada, exatamente quais tasks estão em Done (Passo 1.5) e o
  caminho de `specs/<slug>/spec.md` para os FR-xxx/critérios em escopo
  (cruzados com as tasks Done — não teste critério de task ainda não
  feita).
- A saída da suíte automatizada (Passo 3) e as observações do walkthrough
  ao vivo (Passo 4).
- A carta e os achados da exploração livre (Passo 5), se houve.
- Instrução explícita da **lente deste comando**: aqui, diferente de
  `/qa-test`, o veredito é funcional de verdade — um critério com teste
  automatizado vermelho, ou que quebra no walkthrough ao vivo, é 🔴
  **falhou** (bug real, não gap estrutural). Vereditos: ✅ passou (teste
  verde e/ou walkthrough confirma) / 🟡 parcial (funciona parte do
  cenário, ou só um dos dois — teste ou walkthrough — confirma, o outro
  não foi possível checar) / 🔴 falhou (teste vermelho e/ou walkthrough
  expõe erro real) / ⚪ não aplicável (critério fora do escopo das tasks
  Done desta rodada).
- Mesma instrução de honestidade e o mesmo **"Template do documento de
  relatório QA"** definido em `qa-test/SKILL.md` — não duplicar o formato
  entre os dois comandos, mas incluir aqui a seção extra **"Achados fora
  do escopo dos critérios"** (Passo 5), ausente inteiramente se nada foi
  encontrado.
- Instrução de roteamento: aqui falhas **podem** ir para `dev` (bug real
  de implementação), além de `product-owner` (critério ambíguo/mudou de
  escopo) e `designer` (causa raiz visual/UX) — diferente de `qa-test`,
  que nunca rotea para `dev`.
- Peça que escreva com `Write` em `docs/qa-report/<slug>-producao.html`, e
  adicione/atualize o card correspondente em `docs/index.html`.

## Passo 7 — Reportar

```
## Verificação de conformidade em produção concluída (/qa-production-test)

- Feature testada: <slug> (tasks em Done: N)
- Critérios verificados: N (✅ X · 🟡 Y · 🔴 Z · ⚪ W)
- Testes automatizados: <resumo, ex. "12 passed, 1 failed">
- Documento completo: docs/qa-report/<slug>-producao.html
- Usuário de teste criado: <username>, local, descartável (ver Passo 2.3)

Este comando não corrige nada — se algo aqui virar trabalho, use
/quick-task ou peça ao dev/product-owner/designer para agir sobre o
parecer.
```

## Passo 8 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Feature com implementação real identificada (ou o comando parou
      cedo, honestamente, redirecionando para /kanban-start ou /qa-test)
- [ ] Aplicação real rodando e acessível antes do teste
- [ ] Usuário de teste descartável garantido, com aviso prévio ao usuário
- [ ] Suíte de testes automatizados relevante rodou, com saída capturada
- [ ] Aplicação percorrida de ponta a ponta com dados reais (ao vivo via
      browser, ou validação parcial por `curl` se browser não disponível)
- [ ] `qa` produziu `docs/qa-report/<slug>-producao.html` com veredito por
      critério (teste + walkthrough combinados), evidência real e
      roteamento incluindo `dev` quando for bug real
- [ ] `docs/index.html` (seção "Outras fontes") linka o documento novo
- [ ] Retrospectiva rodou ao final
