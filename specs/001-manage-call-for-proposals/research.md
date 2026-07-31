# Research: Gerenciamento de Editais de Fomento

Nenhum item de Technical Context ficou marcado como `NEEDS CLARIFICATION`
depois da leitura de `spec.md` + checklists — as decisões abaixo resolvem os
únicos pontos técnicos em aberto (todos derivados de tensões ou lacunas já
sinalizadas nos checklists da spec, não de ambiguidade de negócio).

## Decisão: Autenticação mínima via `django.contrib.auth`

- **Decision**: Usar o app `django.contrib.auth` (já em `INSTALLED_APPS`) com
  suas views prontas (`LoginView`/`LogoutView` via
  `django.contrib.auth.urls`) e um único template mínimo
  `templates/registration/login.html`. Toda view de `editais` usa
  `LoginRequiredMixin`/`@login_required` e escopa dados por `request.user`.
  Usuários são criados via `manage.py createsuperuser` ou `/admin/` — sem
  tela de auto-cadastro nesta feature.
- **Rationale**: FR-015/FR-016 exigem que cada edital pertença e seja
  visível apenas ao captador que o cadastrou — isso exige alguma noção de
  identidade de usuário mesmo que "autenticação" em si esteja marcada como
  fora de escopo em Assumptions. `django.contrib.auth` já está instalado no
  scaffold (zero dependência nova) e cobre exatamente o mínimo necessário
  (login/logout) sem implementar registro, recuperação de senha ou perfis —
  isso fica para uma feature de auth dedicada, se e quando for necessária.
- **Alternatives considered**: (a) Nenhuma autenticação, um único
  "captador" implícito global — rejeitado porque contradiz FR-016
  explicitamente ("restringir... ao captador que os cadastrou", que só faz
  sentido falando de múltiplos captadores possíveis). (b) App de auth
  customizado com registro self-service — rejeitado por YAGNI: a spec não
  pede cadastro de usuário, só isolamento de dados por captador.

## Decisão: Um único model `Edital`, sem tabelas auxiliares

- **Decision**: `documentacao_exigida` e `criterios_avaliacao` são
  `TextField` de texto livre no próprio model `Edital`, não um model
  relacionado nem uma estrutura JSON/checklist.
- **Rationale**: FR-017 é explícito — "texto livre descritivo... sem
  checklist estruturado com marcação individual". Uma tabela `Documento`
  separada seria uma abstração sem segundo caso de uso real (Ponytail/YAGNI).
- **Alternatives considered**: Model `DocumentoExigido` relacionado (1:N) —
  rejeitado, resolveria um requisito ("atendido/pendente" por item) que a
  spec explicitamente diz não existir nesta feature.

## Decisão: Estágio de acompanhamento como `CharField` com `choices`

- **Decision**: Campo `estagio` em `Edital`, `CharField(choices=...)` com os
  4 valores fixos (`backlog`, `andamento`, `validacao`, `concluido`), default
  `backlog` (FR-008). Sem model `Estagio` separado.
- **Rationale**: São exatamente 4 valores fixos definidos na spec
  (FR-002/Key Entities), sem atributos próprios (nome, ordem, cor) que
  justificassem virar entidade — `choices` é o padrão idiomático do Django
  para esse caso e evita uma junção desnecessária.
- **Alternatives considered**: Model `Estagio` com FK — rejeitado, YAGNI
  (não há necessidade de estágios configuráveis pelo usuário nesta spec).

## Decisão: Mudança de estágio via POST simples, sem drag-and-drop obrigatório

- **Decision**: Cada card do kanban tem dois botões ("mover para trás" /
  "mover para frente") que fazem POST para uma view que atualiza `estagio`
  e redireciona de volta ao quadro — sem JavaScript nem dependência de
  drag-and-drop no backend. É o mesmo padrão de interação (acessível, por
  teclado) já usado no protótipo de referência de A001
  (`prototype/avulsa-A001/script.js`, função `updateMoveButtons`).
- **Rationale**: Resolve FR-009/FR-010 (mover em qualquer direção,
  sincronizado entre tabela e quadro) com o menor código possível — cumpre
  SC-003 (3 ações ou menos: abrir o quadro + 1 clique) sem introduzir uma
  dependência JS nova. CHK023 (acessibilidade de drag-and-drop) fica coberta
  por construção, já que a interação primária não depende de arrastar.
  Drag-and-drop como camada progressiva de UX (se o `designer` quiser) pode
  ser adicionado depois sem mudar o contrato do backend (o POST já existe).
- **Alternatives considered**: Drag-and-drop com JS + endpoint JSON —
  rejeitado por ora: mais código (fetch/JS, serialização) para o mesmo
  resultado funcional; pode ser adicionado depois como progressive
  enhancement se o `designer` pedir, sem quebrar o fluxo de formulário.

## Decisão: Link do edital é opcional no cadastro (FR-003 revisado)

- **Decision**: O campo `link` é `URLField(blank=True)`, opcional no
  formulário de cadastro.
- **Rationale**: O checklist `business-rules.md` (CHK020) havia levantado a
  tensão entre exigir `link` no cadastro e o Edge Case "edital sem link
  ainda disponível" (chamada anunciada, edital completo ainda não
  publicado). Essa tensão foi resolvida formalmente pelo `product-owner` via
  `speckit-clarify` (ver `## Clarifications` → `### Session 2026-07-31` em
  `spec.md`): o link deixou de ser obrigatório no cadastro; o captador pode
  cadastrar sem link e adicioná-lo depois via edição (FR-013). Nome da
  chamada, instituição, descrição e data de fechamento continuam
  obrigatórios.
- **Alternatives considered**: Manter `link` obrigatório — descartado, pois
  contradiria diretamente o FR-003 vigente e o Edge Case que ele agora
  cobre explicitamente.

## Decisão: Remoção de edital é exclusão definitiva (hard delete)

- **Decision**: FR-014 é implementado com `DeleteView`/`.delete()` padrão do
  Django — sem campo `ativo`/soft delete nem tabela de histórico.
- **Rationale**: Assumptions deixa explícito que o "comportamento exato de
  exclusão vs. arquivamento fica a critério da fase de planejamento
  técnico", desde que o edital suma das visões ativas. Soft delete
  adicionaria um campo, um filtro em todo `QuerySet`, e uma tela/estado
  extra para "editais removidos" que nenhuma User Story pede — YAGNI.
- **Alternatives considered**: Soft delete com `is_active`/`deleted_at` —
  rejeitado por ora; revisitar apenas se uma spec futura pedir
  histórico/recuperação de edital removido.

## Decisão: Prazo vencido é calculado, não armazenado

- **Decision**: `Edital.prazo_vencido` é uma `@property` Python que compara
  `data_fechamento < date.today()`, calculada em cada request — sem campo
  persistido nem job/cron.
- **Rationale**: Atende FR-011/SC-005 (indicação visual de prazo vencido)
  com uma linha de código; qualquer campo booleano armazenado exigiria um
  processo assíncrono para mantê-lo atualizado, que a spec não pede
  (Assumptions descarta notificações automáticas).
- **Alternatives considered**: Celery/cron para recalcular e persistir um
  flag — muito além do que SC-005 exige (é só indicação visual na tela).

## Decisão: `LANGUAGE_CODE`/`TIME_ZONE` ajustados para pt-br/America

- **Decision**: Alterar `config/settings.py`: `LANGUAGE_CODE = 'pt-br'`,
  `TIME_ZONE = 'America/Sao_Paulo'`.
- **Rationale**: Constitution — "Interface e specs são escritas em português
  por padrão" — e todas as datas de edital (abertura/fechamento) são
  relevantes no fuso horário brasileiro do captador. É uma mudança de
  configuração de uma linha, sem dependência nova.
- **Alternatives considered**: Manter `en-us`/UTC e formatar datas
  manualmente nos templates — mais código para o mesmo resultado.
