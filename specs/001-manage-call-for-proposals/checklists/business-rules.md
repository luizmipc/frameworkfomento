# Business Rules & Requirements Quality Checklist: Gerenciamento de Editais de Fomento

**Purpose**: Validar a qualidade dos requisitos e regras de negócio da spec
(cadastro, prazos, ciclo de vida/estágio no quadro de progresso,
documentação exigida, critérios de avaliação) como gate de
Definition-of-Ready antes do handoff para `/speckit-plan`.
**Created**: 2026-07-30
**Feature**: [spec.md](../spec.md)

**Note**: Este checklist testa a escrita dos requisitos (completude, clareza,
consistência, mensurabilidade), não a implementação — `plan.md`/`tasks.md`
ainda não existem para esta feature.

## Requirement Completeness

- [ ] CHK001 Estão definidos requisitos para o estado vazio da listagem/quadro de progresso, quando o captador ainda não cadastrou nenhum edital? [Gap]
- [ ] CHK002 Estão definidos requisitos de formato/tamanho para os campos textuais do edital (nome da chamada, descrição, link)? [Gap]
- [x] CHK003 Está definido como o texto livre de "documentação exigida" (FR-017) deve ser estruturado — campo único vs. lista de itens? [Completeness, Spec §FR-017]
- [ ] CHK004 Está claro, além dos quatro campos obrigatórios (FR-003), quais demais campos do edital são opcionais vs. obrigatórios? [Spec §FR-003, FR-005]
- [ ] CHK005 Estão definidos requisitos para validação do formato/formato válido do link informado para a chamada? [Gap]

## Requirement Clarity

- [ ] CHK006 Está quantificado o que conta como "prazo próximo do vencimento", ou o requisito só cobre prazos já vencidos (FR-011)? [Clarity, Spec §FR-011]
- [ ] CHK007 Está quantificado, em unidade de tempo objetiva, o que significa "poucos segundos" em SC-005? [Clarity, Spec §SC-005]
- [ ] CHK008 Está definido, de forma testável, o que conta como uma "ação" em "3 ações ou menos" (SC-003)? [Ambiguity, Spec §SC-003]
- [ ] CHK009 Está especificado o formato esperado das datas importantes do edital (apenas data, ou data e hora; fuso horário)? [Clarity, Spec §FR-004]

## Requirement Consistency

- [x] CHK010 Os nomes das quatro colunas do quadro de progresso são usados de forma consistente entre User Story 1, FR-002 e Key Entities (Estágio de Acompanhamento)? [Consistency, Spec §FR-002]
- [x] CHK011 FR-009 (mover em qualquer direção) e o Edge Case sobre "pular colunas intermediárias" descrevem um comportamento consistente entre si? [Consistency, Spec Edge Cases]
- [x] CHK012 Os campos obrigatórios listados em FR-003 são consistentes com os campos cuja ausência é bloqueada por FR-005? [Consistency, Spec §FR-003, FR-005]

## Acceptance Criteria Quality

- [x] CHK013 O limite de "5 minutos" em SC-002 pode ser verificado objetivamente sem depender de detalhes de implementação? [Measurability, Spec §SC-002]
- [x] CHK014 Existe um cenário de aceite com resultado testável para o caminho de validação (campo obrigatório ausente) da User Story 2? [Spec §User Story 2, Acceptance Scenario 2]
- [ ] CHK015 Cada requisito funcional (FR-001–FR-017) está associado a pelo menos um cenário de aceite ou critério de sucesso mensurável? [Traceability, Gap]

## Scenario Coverage

- [x] CHK016 Está coberto por um requisito o caso de um edital sem data de abertura definida (Edge Cases)? [Coverage, Spec Edge Cases]
- [ ] CHK017 Está coberto por um requisito o caso de dois editais com o mesmo nome de chamada, de instituições diferentes (Edge Cases)? [Coverage, Spec Edge Cases]
- [ ] CHK018 Existe requisito sobre o comportamento da listagem com um volume grande de editais cadastrados, além de identificá-lo como Edge Case? [Coverage, Gap]
- [x] CHK019 Está definido o comportamento esperado ao remover (FR-014) um edital que está em estágio "Em andamento" ou "Validação" (não apenas Backlog/Concluído)? [Gap]

## Edge Case Coverage

- [ ] CHK020 Está especificado o comportamento quando o link do edital ainda não está disponível no momento do cadastro (Edge Cases)? [Edge Case, Spec Edge Cases]
- [x] CHK021 Está especificado o comportamento para um edital com prazo de fechamento já vencido mas ainda não movido para "Concluído" (Edge Cases)? [Edge Case, Spec Edge Cases]

## Non-Functional Requirements

- [x] CHK022 Além da nota em Assumptions, está claro se a remoção de um edital (FR-014) implica exclusão definitiva ou apenas retirada das visões ativas? [Assumption, Spec §Assumptions]
- [ ] CHK023 Estão definidos requisitos de acessibilidade para mover um edital entre colunas do quadro de progresso (alternativa a arrastar-e-soltar)? [Gap]
- [ ] CHK024 Estão definidos requisitos para o caso de o mesmo captador acessar o sistema a partir de duas sessões simultâneas? [Gap]

## Dependencies & Assumptions

- [x] CHK025 A suposição de que "captador de recursos" já é um usuário autenticado está claramente demarcada como fora de escopo desta feature? [Assumption, Spec §Assumptions]
- [x] CHK026 A suposição de ausência de integração automática com fontes externas de editais é consistente com o escopo individual definido em FR-015? [Consistency, Spec §Assumptions, FR-015]

## Ambiguities & Conflicts

- [x] CHK027 Está claro se "critérios de avaliação" (FR-007) se refere aos critérios publicados pela instituição do edital, e não a critérios internos do captador? [Ambiguity, Spec §FR-007]
- [x] CHK028 Está claro se "instituição responsável" (FR-001, Key Entities) se refere à instituição que publica o edital, e não à organização proponente que submete a proposta? [Ambiguity, Spec §FR-001, Key Entities]

## Gate Result

**PASSOU COM EXCEÇÕES DOCUMENTADAS** (14/28 itens = 50% checked). Nenhuma
exceção invalida o escopo central da feature (cadastro de edital, prazos,
kanban de acompanhamento, documentação exigida, critérios de avaliação —
todos resolvidos e sem `[NEEDS CLARIFICATION]`). As exceções abaixo são
refinamentos de formato/mensurabilidade/NFR que não bloqueiam
`/speckit-plan` e podem ser resolvidos durante o planejamento técnico ou em
uma futura iteração desta spec:

- **CHK001, CHK002, CHK005** — detalhes de formato/validação de campo
  (estado vazio, tamanho de texto, validação de URL) não especificados;
  reasonable default de UX padrão se aplica.
- **CHK004, CHK015** — nem todo campo/FR tem um cenário de aceite dedicado
  (em especial FR-012 e os FRs de escopo FR-015/016/017, que são
  restrições de contorno, não comportamentos de UI); aceitável para specs
  de escopo.
- **CHK006, CHK007, CHK008, CHK009** — métricas de UX (prazo "próximo",
  "poucos segundos", "3 ações", formato de data/hora) não estão
  quantificadas com precisão numérica; recomenda-se quantificar durante o
  `/speckit-plan` ou em uma revisão de spec dedicada, sem bloquear o
  handoff.
- **CHK017, CHK018** — Edge Cases levantados na spec (nomes duplicados de
  edital, alto volume de editais cadastrados) não têm requisito funcional
  dedicado que os resolva; risco baixo para um MVP, mas vale revisão do
  `dev` no planejamento.
- **CHK020** — tensão entre FR-003 (link obrigatório no cadastro) e o Edge
  Case que pergunta sobre edital sem link ainda disponível; recomenda-se
  que o `dev`/`designer` tratem isso ao desenhar o formulário de cadastro
  (ex.: permitir link vazio com aviso, em vez de bloquear).
- **CHK023, CHK024** — acessibilidade do quadro de progresso (alternativa a
  drag-and-drop) e uso simultâneo em múltiplas sessões não têm requisito
  dedicado; ambos ficam como observações para o `designer`/`dev`.

## Notes

- Checklist gerado sem `plan.md`/`tasks.md` (ainda não existem para esta
  feature) — todos os itens referenciam apenas `spec.md`.
