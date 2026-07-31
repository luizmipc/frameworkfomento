# Business Rules & Requirements Quality Checklist: Gerenciamento de Editais de Fomento

**Purpose**: Validar a qualidade dos requisitos e regras de negócio da spec
(cadastro, prazos, ciclo de vida/estágio no quadro de progresso,
documentação exigida, critérios de avaliação) como gate de
Definition-of-Ready antes do handoff para `/speckit-plan`.
**Created**: 2026-07-30
**Feature**: [spec.md](../spec.md)

**Note**: Este checklist testa a escrita dos requisitos (completude, clareza,
consistência, mensurabilidade) de `spec.md`, não a implementação —
independentemente de `plan.md`/`tasks.md` já existirem ou não para esta
feature (ver Notes para o histórico).

## Requirement Completeness

- [ ] CHK001 Estão definidos requisitos para o estado vazio da listagem/quadro de progresso, quando o captador ainda não cadastrou nenhum edital? [Gap]
- [ ] CHK002 Estão definidos requisitos de formato/tamanho para os campos textuais do edital (nome da chamada, descrição, link)? [Gap]
- [x] CHK003 Está definido como o texto livre de "documentação exigida" (FR-017) deve ser estruturado — campo único vs. lista de itens? [Completeness, Spec §FR-017]
- [x] CHK004 Está claro, além dos quatro campos obrigatórios (FR-003), quais demais campos do edital são opcionais vs. obrigatórios? [Spec §FR-003, FR-005]
- [ ] CHK005 Estão definidos requisitos para validação do formato/formato válido do link informado para a chamada? [Gap]
- [ ] CHK029 Está definido o que o total agregado (FR-023) e as contagens por coluna (FR-024) exibem quando o captador ainda não tem nenhum edital cadastrado (zero editais, sem filtro ativo)? [Gap, Spec §FR-023, FR-024]

## Requirement Clarity

- [ ] CHK006 Está quantificado o que conta como "prazo próximo do vencimento", ou o requisito só cobre prazos já vencidos (FR-011)? [Clarity, Spec §FR-011]
- [ ] CHK007 Está quantificado, em unidade de tempo objetiva, o que significa "poucos segundos" em SC-005? [Clarity, Spec §SC-005]
- [ ] CHK008 Está definido, de forma testável, o que conta como uma "ação" em "3 ações ou menos" (SC-003)? [Ambiguity, Spec §SC-003]
- [ ] CHK009 Está especificado o formato esperado das datas importantes do edital (apenas data, ou data e hora; fuso horário)? [Clarity, Spec §FR-004]
- [ ] CHK030 É especificado se o indicador de filtro ativo (FR-025, ex.: "Filtrando por: ...") deve exibir os valores literais do termo de busca e/ou da instituição selecionada, ou apenas um aviso genérico de que algum filtro está ativo? [Clarity, Spec §FR-025]
- [ ] CHK031 É especificado o texto/rótulo visual usado para indicar a ausência de link de um edital (FR-012), agora que o link deixou de ser obrigatório? [Clarity, Spec §FR-012]

## Requirement Consistency

- [x] CHK010 Os nomes das quatro colunas do quadro de progresso são usados de forma consistente entre User Story 1, FR-002 e Key Entities (Estágio de Acompanhamento)? [Consistency, Spec §FR-002]
- [x] CHK011 FR-009 (mover em qualquer direção) e o Edge Case sobre "pular colunas intermediárias" descrevem um comportamento consistente entre si? [Consistency, Spec Edge Cases]
- [x] CHK012 Os campos obrigatórios listados em FR-003 são consistentes com os campos cuja ausência é bloqueada por FR-005? [Consistency, Spec §FR-003, FR-005]
- [x] CHK032 A regra de "total filtrado, não total geral" aplicada ao total agregado (FR-023) e às contagens por coluna (FR-024) usa exatamente a mesma base de filtros (busca por nome e instituição responsável) nas duas definições? [Consistency, Spec §FR-023, FR-024]
- [x] CHK033 Os campos definidos como obrigatórios em FR-003 são usados de forma consistente em todos os pontos da spec que os listam (FR-005, Acceptance Scenario 2 da User Story 2, Key Entities, SC-002)? [Consistency, Spec §FR-003, FR-005, Key Entities, SC-002]

## Acceptance Criteria Quality

- [x] CHK013 O limite de "5 minutos" em SC-002 pode ser verificado objetivamente sem depender de detalhes de implementação? [Measurability, Spec §SC-002]
- [x] CHK014 Existe um cenário de aceite com resultado testável para o caminho de validação (campo obrigatório ausente) da User Story 2? [Spec §User Story 2, Acceptance Scenario 2]
- [ ] CHK015 Cada requisito funcional (FR-001–FR-017) está associado a pelo menos um cenário de aceite ou critério de sucesso mensurável? [Traceability, Gap]
- [x] CHK034 Existe um cenário de aceite testável cobrindo o valor 0 exibido no cabeçalho de uma coluna filtrada (FR-024) em conjunto com a mensagem de estado vazio (FR-026)? [Spec §User Story 4, Acceptance Scenario 8]
- [x] CHK035 Cada requisito funcional novo desta rodada (FR-024–FR-026) está associado a pelo menos um cenário de aceite ou a um refinamento de cenário existente? [Traceability, Spec §FR-024–FR-026]

## Scenario Coverage

- [x] CHK016 Está coberto por um requisito o caso de um edital sem data de abertura definida (Edge Cases)? [Coverage, Spec Edge Cases]
- [ ] CHK017 Está coberto por um requisito o caso de dois editais com o mesmo nome de chamada, de instituições diferentes (Edge Cases)? [Coverage, Spec Edge Cases]
- [ ] CHK018 Existe requisito sobre o comportamento da listagem com um volume grande de editais cadastrados, além de identificá-lo como Edge Case? [Coverage, Gap]
- [x] CHK019 Está definido o comportamento esperado ao remover (FR-014) um edital que está em estágio "Em andamento" ou "Validação" (não apenas Backlog/Concluído)? [Gap]
- [x] CHK036 Está coberto por um requisito ou edge case o comportamento de uma coluna do quadro de progresso genuinamente vazia (sem nenhum edital cadastrado naquele estágio), sem filtro/busca ativos? [Coverage, Spec Edge Cases]

## Edge Case Coverage

- [x] CHK020 Está especificado o comportamento quando o link do edital ainda não está disponível no momento do cadastro (Edge Cases)? [Edge Case, Spec Edge Cases]
- [x] CHK021 Está especificado o comportamento para um edital com prazo de fechamento já vencido mas ainda não movido para "Concluído" (Edge Cases)? [Edge Case, Spec Edge Cases]

## Non-Functional Requirements

- [x] CHK022 Além da nota em Assumptions, está claro se a remoção de um edital (FR-014) implica exclusão definitiva ou apenas retirada das visões ativas? [Assumption, Spec §Assumptions]
- [ ] CHK023 Estão definidos requisitos de acessibilidade para mover um edital entre colunas do quadro de progresso (alternativa a arrastar-e-soltar)? [Gap]
- [ ] CHK024 Estão definidos requisitos para o caso de o mesmo captador acessar o sistema a partir de duas sessões simultâneas? [Gap]
- [ ] CHK037 Estão definidos requisitos de acessibilidade (ex.: leitor de tela) para o indicador de filtro ativo (FR-025) e para a contagem por coluna (FR-024), de forma que um captador usando tecnologia assistiva perceba que a visão está filtrada? [Gap, Accessibility]

## Dependencies & Assumptions

- [x] CHK025 A suposição de que "captador de recursos" já é um usuário autenticado está claramente demarcada como fora de escopo desta feature? [Assumption, Spec §Assumptions]
- [x] CHK026 A suposição de ausência de integração automática com fontes externas de editais é consistente com o escopo individual definido em FR-015? [Consistency, Spec §Assumptions, FR-015]

## Ambiguities & Conflicts

- [x] CHK027 Está claro se "critérios de avaliação" (FR-007) se refere aos critérios publicados pela instituição do edital, e não a critérios internos do captador? [Ambiguity, Spec §FR-007]
- [x] CHK028 Está claro se "instituição responsável" (FR-001, Key Entities) se refere à instituição que publica o edital, e não à organização proponente que submete a proposta? [Ambiguity, Spec §FR-001, Key Entities]
- [x] CHK038 Está claro se "editais atualmente naquela coluna" em FR-024 conta apenas os cartões visíveis após um filtro ativo, ou sempre o total real do estágio, independentemente do filtro? [Ambiguity, Spec §FR-024]

## Gate Result

**PASSOU COM EXCEÇÕES DOCUMENTADAS** (22/38 itens = 58% checked, após a
re-validação da sessão 2026-07-31). Nenhuma exceção invalida o escopo
central da feature (cadastro de edital, prazos, kanban de acompanhamento,
documentação exigida, critérios de avaliação — todos resolvidos e sem
`[NEEDS CLARIFICATION]`). As exceções abaixo são refinamentos de
formato/mensurabilidade/NFR que não bloqueiam `/speckit-plan` (já em
andamento nesta feature) e podem ser resolvidos durante o planejamento
técnico, pelo `designer`, ou em uma futura iteração desta spec:

- **CHK001, CHK002, CHK005** — detalhes de formato/validação de campo
  (estado vazio, tamanho de texto, validação de URL) não especificados;
  reasonable default de UX padrão se aplica.
- **CHK015** — nem todo FR tem um cenário de aceite dedicado (em especial
  os FRs de escopo FR-015/016/017, que são restrições de contorno, não
  comportamentos de UI); aceitável para specs de escopo.
- **CHK006, CHK007, CHK008, CHK009** — métricas de UX (prazo "próximo",
  "poucos segundos", "3 ações", formato de data/hora) não estão
  quantificadas com precisão numérica; recomenda-se quantificar durante o
  `/speckit-plan` ou em uma revisão de spec dedicada, sem bloquear o
  handoff.
- **CHK017, CHK018** — Edge Cases levantados na spec (nomes duplicados de
  edital, alto volume de editais cadastrados) não têm requisito funcional
  dedicado que os resolva; risco baixo para um MVP, mas vale revisão do
  `dev` no planejamento.
- **CHK023, CHK024, CHK037** — acessibilidade do quadro de progresso
  (alternativa a drag-and-drop), uso simultâneo em múltiplas sessões, e
  acessibilidade do indicador de filtro ativo/contagem por coluna para
  tecnologia assistiva não têm requisito dedicado; ficam como observações
  para o `designer`/`dev` — a exigência de acessibilidade em si já é um
  princípio da constitution (Padrões de Código), só falta o requisito
  específico para estes três elementos.
- **CHK029** — o valor exibido pelo total agregado (FR-023) e pelas
  contagens por coluna (FR-024) quando o captador não tem nenhum edital
  cadastrado (zero, sem filtro) não está explicitado; comportamento razoável
  (mostrar "0") pode ser assumido sem novo FR, mas vale confirmar no
  planejamento.
- **CHK030, CHK031** — o texto/rótulo exato do indicador de filtro ativo
  (FR-025) e da ausência de link (FR-012) não está especificado
  literalmente na spec; são decisões de conteúdo/UX que ficam com o
  `designer` antes ou durante o `/speckit-plan`.

Resolvido nesta rodada (não são mais exceções): **CHK004** (campos
opcionais vs. obrigatórios agora explícitos em FR-003/Key Entities) e
**CHK020** (link deixou de ser obrigatório no cadastro — FR-003, FR-005,
FR-012, Acceptance Scenario 2 da User Story 2 e Edge Cases atualizados via
`/speckit-clarify`, sessão 2026-07-31).

## Notes

- Checklist gerado originalmente em 2026-07-30, quando `plan.md`/`tasks.md`
  ainda não existiam para esta feature.
- Sessão 2026-07-31: `/speckit-clarify` resolveu 4 ambiguidades (link opcional
  no cadastro; descrição obrigatória — Acceptance Scenario 2 corrigido;
  contagem por coluna do FR-024 reflete o total filtrado, consistente com
  FR-023; coluna vazia sem filtro fica em branco, sem mensagem). Este
  checklist foi re-executado como gate de Definition-of-Ready sobre a spec já
  clarificada: CHK004 e CHK020 passaram a `[x]`; CHK029–CHK038 foram
  adicionados com foco em FR-024/FR-025/FR-026 e no comportamento do link
  agora opcional. `plan.md`/`tasks.md` já existem nesta feature, mas este
  checklist continua testando apenas a qualidade dos requisitos de
  `spec.md`, não a implementação.
