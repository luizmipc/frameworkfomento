# Requirements Quality Checklist: Coluna "Elegibilidade" e gate por estágio

**Purpose**: Validar que a revisão desta rodada — sétima coluna
"Elegibilidade" no quadro Kanban, associação obrigatória de item do plano de
submissão a um estágio (substitui a categoria opcional de FR-033), e o novo
modelo de gate por grupo de estágio (FR-038/FR-041) — está internamente
consistente e pronta para handoff ao `dev`.
**Created**: 2026-08-04
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 O propósito exato do estágio "Elegibilidade" (levantar/definir
      critérios, não necessariamente já os ter cumprido) está documentado
      onde a coluna é definida, e não deixado implícito? [Completeness,
      Spec §FR-002]
- [x] CHK002 Os quatro valores válidos para a associação obrigatória de item
      a estágio, e a justificativa para excluir os outros três (Backlog,
      Aprovado, Não aprovado), estão documentados junto ao próprio campo?
      [Completeness, Spec §FR-033]
- [x] CHK003 O que acontece com um item cujo estágio associado não é o
      estágio atual do edital (ainda não chegou lá, ou o edital já passou
      por ele) está coberto pela regra geral de FR-034 (progresso agregado
      sobre todos os itens, independente de estágio), sem exigir uma regra
      dedicada nova? [Completeness, Spec §FR-034, FR-038]
- [ ] CHK004 A spec define explicitamente se o estágio associado a um item
      já criado pode ser alterado depois (reatribuir o item a outro grupo),
      ou se essa possibilidade fica implícita na mesma convenção genérica de
      "criado ou editado" já usada para os demais atributos do item (nunca
      formalizada com FR próprio, nem antes nem agora)? [Gap, Spec §FR-033,
      Acceptance Scenario 12 de US5]

## Requirement Clarity

- [x] CHK005 A regra de gate de FR-038 ("itens essenciais do grupo do
      estágio atual, todos concluídos") é enunciada uma única vez de forma
      canônica e reaproveitada nas três transições, em vez de redefinida
      com linguagem distinta em cada uma? [Clarity, Spec §FR-038]
- [x] CHK006 A ordem das sete colunas do quadro (Backlog → Elegibilidade →
      Em andamento → Validação → Submetido → Aprovado/Não aprovado) é
      idêntica, símbolo a símbolo, em todos os pontos da spec que a
      enumeram (FR-002, User Story 1, Key Entities)? [Consistency, Spec
      §FR-002, §Key Entities]
- [x] CHK007 O motivo de "Elegibilidade" vir antes de "Em andamento" na
      ordem do quadro (mapear elegibilidade antes de produzir a proposta em
      si) está explicitado, e não apenas assumido pela ordem das colunas?
      [Clarity, Spec §FR-002]

## Requirement Consistency

- [x] CHK008 A contagem de estágios "sete" (não mais "seis") está aplicada
      de forma consistente em todos os FRs que antes citavam "seis colunas"
      (FR-002, FR-009, FR-027, FR-029, FR-031), sem nenhuma ocorrência
      remanescente do número antigo? [Consistency, Spec §FR-002, §FR-009,
      §FR-027, §FR-029, §FR-031]
- [x] CHK009 A referência de FR-031 ao Acceptance Scenario de User Story 1
      sobre apresentação responsiva aponta para o número correto após a
      inserção do novo cenário de "Elegibilidade" (que deslocou a
      numeração)? [Consistency, Spec §FR-031, User Story 1]
- [x] CHK010 FR-027/FR-029 (marcação "Ignorado") continuam descrevendo essa
      marcação como não sendo um estágio adicional do quadro, agora
      corretamente referida como uma "oitava" coluna hipotética (não mais
      "sétima", já ocupada por Elegibilidade)? [Consistency, Spec §FR-027,
      §FR-029]
- [x] CHK011 FR-041 (barra de veredito) e FR-038 (sugestão de avanço)
      concordam entre si sobre quais estágios do edital tornam o gate de
      elegibilidade aplicável (Elegibilidade, Em andamento, Validação) e
      quais o tornam "não aplicável" (Backlog, Submetido, Aprovado, Não
      aprovado)? [Consistency, Spec §FR-038, §FR-041]
- [x] CHK012 A decisão de manter "Pós-aprovação/Contratação" (FR-048) como
      seção à parte — em vez de virar itens do plano associados ao estágio
      terminal "Aprovado" — está justificada com o mesmo raciocínio usado
      para excluir os estágios terminais da lista de valores válidos de
      FR-033, sem contradizer aquela decisão? [Consistency, Spec §FR-033,
      §FR-048]

## Acceptance Criteria Quality

- [x] CHK013 Os Acceptance Scenarios 5 e 6 de User Story 5 demonstram a
      regra de gate em dois grupos de estágio diferentes (Elegibilidade e
      Validação), de forma que a generalização para a terceira transição
      (Em andamento→Validação) fique explicitamente justificada como o
      mesmo mecanismo, em vez de deixada sem exemplo? [Acceptance Criteria,
      Spec §User Story 5]
- [x] CHK014 O Acceptance Scenario que cobre a criação de um item do plano
      de submissão (Acceptance Scenario 2 de US5) testa tanto o caminho
      feliz (estágio informado) quanto a rejeição por ausência do campo
      agora obrigatório? [Acceptance Criteria, Spec §User Story 5]

## Scenario Coverage

- [x] CHK015 Existe um Acceptance Scenario cobrindo a movimentação manual de
      um edital de "Backlog" para "Elegibilidade" pelo próprio captador
      (não apenas a sugestão automática de avanço), evidenciando que a
      coluna funciona tanto por sugestão quanto por movimentação livre já
      garantida por FR-002/FR-009? [Scenario Coverage, Spec §User Story 1]
- [x] CHK016 O Edge Case de pular colunas intermediárias ao mover um edital
      foi atualizado para incluir "Elegibilidade" na lista de colunas
      puláveis, consistente com a movimentação livre já garantida por
      FR-002/FR-009? [Scenario Coverage, Spec §Edge Cases]

## Edge Case Coverage

- [x] CHK017 O comportamento do gate quando o grupo de itens do estágio
      atual não tem nenhum item essencial cadastrado (vacuidade) está
      definido para as três transições cobertas, não apenas para a
      primeira? [Edge Case, Spec §FR-038, §Edge Cases]
- [ ] CHK018 A spec define o que ocorre com o cálculo de gate (FR-038) e com
      a contagem de pendências essenciais da barra de veredito (FR-041 item
      c) quando um edital é movido manualmente para um estágio "fora de
      ordem" (ex.: direto de Backlog para Validação, pulando Elegibilidade e
      Em andamento) — em particular, se pendências essenciais de estágios
      pulados (não visitados) devem ou não ser somadas a essa contagem? [Gap,
      Spec §FR-041]

## Dependencies & Assumptions

- [x] CHK019 A dependência entre a nova coluna "Elegibilidade"/associação de
      item a estágio e o trabalho de agrupamento visual da timeline
      (delegado ao `designer`, fora desta spec) está identificada sem que a
      spec de negócio prescreva a apresentação visual em si? [Dependencies,
      Spec §FR-033]

## Notes

- CHK004 e CHK018 ficam como **Outstanding** (não bloqueantes para o
  handoff desta rodada): CHK004 é uma lacuna pré-existente do modelo de
  edição de itens do plano de submissão (nunca formalizada com FR próprio,
  nem para a antiga "categoria" nem agora para o estágio associado) — não
  introduzida por esta revisão, e fora do escopo que o usuário pediu para
  fechar agora; CHK018 é um refinamento de borda sobre a contagem exibida
  na barra de veredito quando o captador pula estágios manualmente, com
  impacto baixo (a barra já é declaradamente "informativa, não bloqueante"
  — um eventual over-count nesse cenário raro não quebra nenhum fluxo
  crítico). Ambos ficam registrados aqui como candidatos a uma futura
  rodada de `/speckit-clarify`, sem impedir o avanço para `/speckit-plan`.
