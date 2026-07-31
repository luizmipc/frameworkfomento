# Feature Specification: Gerenciamento de Editais de Fomento

**Feature Branch**: `001-manage-call-for-proposals`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "o objetivo dela será definir muito bem, quais são as características necessárias para realizar o gerenciamento correto dos editais para captores de recursos. Além disso, a tarefa A001 faz parte dessa spec"

## Clarifications

### Session 2026-07-30

- Q: Cadastrar um edital cria um registro individual do captador ou adiciona um edital de uma base compartilhada/curada? → A: Cada captador cadastra e mantém sua própria lista de editais; não existe, nesta feature, uma base compartilhada/curada visível a outros captadores.
- Q: O quadro de progresso e os dados de um edital são visíveis só a quem cadastrou ou compartilhados com a organização proponente? → A: Gerenciamento individual — os editais cadastrados por um captador, e o estágio de acompanhamento de cada um, são visíveis e editáveis apenas por esse captador nesta feature. Colaboração multiusuário/por organização fica fora de escopo.
- Q: Documentação exigida e critérios de avaliação são texto livre descritivo ou um checklist estruturado com itens marcáveis como atendidos/pendentes? → A: Texto livre descritivo (lista de itens em texto), sem controle individual de status "atendido/pendente" por item nesta feature — o acompanhamento de progresso do edital continua sendo feito pelo Estágio de Acompanhamento (quadro de progresso), não por um checklist interno de documentos.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompanhar editais em um quadro de progresso (Priority: P1)

Um captador de recursos quer ver, em um único lugar, todos os editais que está
acompanhando (nome da chamada, descrição, instituição responsável, link para
a chamada e datas importantes) e quer saber, a qualquer momento, em que
estágio do seu processo de captação cada edital se encontra — ainda não
começou a trabalhar nele (Backlog), já está preparando a proposta (Em
andamento), está revisando antes de enviar (Validação) ou já foi submetido/
finalizado (Concluído). Ele organiza esse acompanhamento movendo cada edital
entre essas quatro colunas conforme avança.

**Why this priority**: É o cenário de uso mais básico e imediatamente valioso
do gerenciamento de editais — sem ele, o captador não tem visão consolidada
do que precisa fazer nem prioriza corretamente seu tempo. Corresponde à
tarefa avulsa A001 já registrada no quadro do projeto.

**Independent Test**: Pode ser testado cadastrando dois ou três editais com
seus dados básicos, verificando que aparecem corretamente na listagem, e
movendo cada um entre as quatro colunas do quadro de progresso — entrega
valor sozinho, mesmo sem as demais user stories implementadas.

**Acceptance Scenarios**:

1. **Given** existem editais cadastrados, **When** o captador acessa a tela
   de listagem, **Then** ele vê uma tabela com, no mínimo, nome da chamada,
   descrição, instituição responsável, link para a chamada e datas
   importantes (abertura e fechamento) de cada edital.
2. **Given** existem editais cadastrados, **When** o captador acessa a visão
   de quadro de progresso, **Then** ele vê cada edital representado como um
   cartão posicionado em uma das quatro colunas (Backlog, Em andamento,
   Validação, Concluído), de acordo com o estágio atual daquele edital.
3. **Given** um edital está na coluna "Em andamento", **When** o captador
   move esse edital para a coluna "Validação", **Then** o sistema registra o
   novo estágio e reflete essa mudança tanto na visão de quadro quanto na
   visão de tabela.
4. **Given** um edital está em qualquer coluna que não seja a primeira,
   **When** o captador decide que errou o estágio, **Then** ele consegue
   mover o edital de volta para uma coluna anterior (o fluxo não é somente de
   avanço).
5. **Given** um edital tem data de fechamento dentro de um dos quatro níveis
   de proximidade (até 7, até 14, até 21 ou até 30 dias), **When** o captador
   acessa a listagem ou o quadro de progresso, **Then** o sistema destaca
   esse edital em amarelo, mostrando apenas o nível mais urgente aplicável
   (ex.: um edital que vence em 5 dias — portanto dentro dos quatro limiares
   ao mesmo tempo — mostra somente o destaque de "até 7 dias", não os quatro
   destaques simultaneamente).

---

### User Story 2 - Cadastrar um edital com os dados necessários para geri-lo (Priority: P2)

Um captador de recursos toma conhecimento de um novo edital de fomento
(público ou privado) e precisa registrá-lo no sistema para começar a
acompanhá-lo: nome da chamada, instituição responsável, descrição, link
oficial, datas importantes (ao menos abertura e fechamento das submissões),
documentação exigida pelo edital e critérios de avaliação usados pela banca
ou parecerista. Sem esse cadastro completo, ele não consegue depois se
organizar para atender a todos os requisitos antes do prazo.

**Why this priority**: Depende logicamente de existir um edital cadastrado
para que a User Story 1 tenha o que exibir, mas o cadastro em si tem valor
incremental — sem dados de documentação exigida e critérios de avaliação, o
captador só teria um quadro de progresso "vazio de conteúdo útil" para
preparar a proposta em si.

**Independent Test**: Pode ser testado cadastrando um edital do zero,
preenchendo todos os campos, e confirmando que os dados ficam disponíveis
integralmente na listagem (User Story 1) e podem ser consultados depois sem
perda de informação.

**Acceptance Scenarios**:

1. **Given** o captador está prestes a cadastrar um novo edital, **When** ele
   informa nome da chamada, instituição responsável, descrição, link, data de
   abertura e data de fechamento, **Then** o sistema salva o edital e o torna
   visível na listagem e no quadro de progresso, iniciando na coluna
   Backlog.
2. **Given** o captador está cadastrando um edital, **When** ele tenta
   salvar sem informar um campo obrigatório (nome da chamada, instituição
   responsável, link ou data de fechamento), **Then** o sistema impede o
   salvamento e indica claramente quais campos faltam.
3. **Given** um edital está sendo cadastrado, **When** o captador registra a
   documentação exigida (lista de documentos comprobatórios pedidos pelo
   edital) e os critérios de avaliação (como a proposta será julgada),
   **Then** essas informações ficam associadas ao edital e disponíveis para
   consulta a qualquer momento.

---

### User Story 3 - Manter os dados de um edital atualizados (Priority: P3)

Um captador de recursos percebe que um dado de um edital já cadastrado
mudou (por exemplo, a instituição prorrogou o prazo de fechamento, corrigiu o
link oficial, ou publicou um adendo com novos critérios de avaliação), ou
decide que um edital não é mais relevante para acompanhar (foi cancelado, ou
a organização desistiu de concorrer). Ele precisa poder corrigir os dados ou
remover o edital da sua lista ativa sem perder o histórico do que já havia
sido feito.

**Why this priority**: É importante para manter a confiabilidade dos dados ao
longo do tempo, mas o gerenciamento básico (User Stories 1 e 2) já entrega
valor sem esta capacidade — na ausência dela, o captador apenas conviveria
com dados desatualizados até uma correção manual futura.

**Independent Test**: Pode ser testado editando um campo de um edital já
cadastrado (ex.: data de fechamento) e confirmando que a mudança aparece
imediatamente na tabela e no quadro de progresso; e, separadamente, removendo
um edital e confirmando que ele deixa de aparecer nas duas visões.

**Acceptance Scenarios**:

1. **Given** um edital já cadastrado, **When** o captador edita qualquer um
   dos seus dados (descrição, instituição, link, datas, documentação exigida
   ou critérios de avaliação), **Then** o sistema salva a alteração e passa a
   exibir o dado atualizado em todas as visões.
2. **Given** um edital que não é mais relevante para o captador, **When** ele
   opta por remover esse edital da sua lista, **Then** o sistema deixa de
   exibi-lo na tabela e no quadro de progresso.

---

### User Story 4 - Localizar um edital específico entre muitos (Priority: P4)

Um captador de recursos que acompanha simultaneamente cerca de dez editais de
fontes diferentes (prefeitura, governo estadual, fundações privadas) precisa
encontrar rapidamente um edital específico, sem ler a lista inteira, e
responder de imediato "o que fecha primeiro?". Ele busca editais pelo nome da
chamada, filtra a lista por instituição responsável, e ordena os editais por
data de fechamento.

**Why this priority**: É a menos crítica das quatro user stories — o
gerenciamento básico (cadastrar, listar, mover entre estágios, editar e
remover) já entrega valor completo sem busca, filtro ou ordenação, e com
poucos editais cadastrados a ausência desses recursos passa despercebida.
Ela ganha valor à medida que o número de editais acompanhados cresce (ver
Edge Cases), o que a torna um refinamento de uso contínuo, não um bloqueador
inicial. Quanto ao escopo desta story: busca por nome e filtro por
instituição fazem sentido tanto na tabela quanto no quadro de progresso — em
ambas as visões o captador pode estar tentando localizar um edital
específico. Já a ordenação por data de fechamento é tratada de forma
diferente em cada visão: na tabela, que é uma lista plana sem outro
critério de organização, ordenar por data de fechamento é o comportamento
principal esperado; no quadro de progresso, o critério de organização
primário já é o estágio (a coluna) — reordenar o quadro inteiro por data de
fechamento romperia essa organização. Por isso, no quadro de progresso, a
ordenação por data de fechamento se aplica apenas dentro de cada coluna (um
critério secundário), preservando o agrupamento por estágio como a
organização principal.

**Independent Test**: Pode ser testado cadastrando vários editais com nomes,
instituições e datas de fechamento diferentes e, na visão de tabela,
buscando por um termo parcial do nome, filtrando por uma instituição
específica e ordenando por data de fechamento — confirmando que a lista
exibida corresponde ao esperado em cada caso; e, separadamente, confirmando
que os cartões dentro de uma mesma coluna do quadro de progresso aparecem
ordenados pela proximidade da data de fechamento.

**Acceptance Scenarios**:

1. **Given** existem editais cadastrados com nomes de chamada diferentes,
   **When** o captador digita um termo de busca, **Then** a tabela passa a
   exibir apenas os editais cujo nome da chamada contém esse termo.
2. **Given** existem editais de instituições responsáveis diferentes,
   **When** o captador seleciona um filtro por instituição responsável,
   **Then** a tabela passa a exibir apenas os editais daquela instituição.
3. **Given** existem editais com datas de fechamento diferentes, **When** o
   captador ordena a tabela por data de fechamento, **Then** os editais
   passam a aparecer ordenados por proximidade do prazo de fechamento.
4. **Given** existem múltiplos editais em uma mesma coluna do quadro de
   progresso, **When** o captador visualiza essa coluna, **Then** os
   cartões aparecem ordenados por data de fechamento, do mais próximo ao
   mais distante, sem alterar o agrupamento por estágio.
5. **Given** o captador aplicou uma busca e/ou um filtro por instituição,
   **When** ele limpa a busca/filtro, **Then** a listagem volta a exibir
   todos os editais cadastrados.

---

### Edge Cases

- O que acontece quando um edital cadastrado não tem link oficial disponível
  no momento do cadastro (ex.: chamada anunciada mas edital completo ainda
  não publicado)?
- Como o sistema trata um edital cuja data de fechamento já passou, mas que o
  captador ainda não moveu para "Concluído" no quadro de progresso?
- O que acontece se dois editais diferentes tiverem o mesmo nome de chamada
  (ex.: edições anuais de um mesmo programa, "Edital 2025" e "Edital 2026")?
- Como o sistema se comporta quando o captador tenta mover um edital
  diretamente do Backlog para Concluído, pulando as colunas intermediárias?
- O que acontece quando um edital não possui data de abertura definida (só a
  data de fechamento é conhecida no momento do cadastro)?
- Como a listagem trata um número grande de editais cadastrados (ex.: mais de
  50) em termos de conseguir localizar um edital específico? Este é
  exatamente o problema que a User Story 4 (busca, filtro e ordenação —
  FR-018 a FR-021) endereça.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir, para o captador de recursos, uma
  listagem em formato de tabela com todos os seus editais cadastrados,
  mostrando ao menos: nome da chamada, descrição, instituição responsável,
  link para a chamada e datas importantes (abertura e fechamento).
- **FR-002**: O sistema DEVE oferecer, além da tabela, uma visão de quadro de
  progresso (kanban) com exatamente quatro colunas nesta ordem: Backlog, Em
  andamento, Validação e Concluído.
- **FR-003**: O sistema DEVE permitir que o captador cadastre um novo edital
  informando, no mínimo: nome da chamada, instituição responsável, descrição,
  link para a chamada e data de fechamento (prazo de submissão).
- **FR-004**: O sistema DEVE permitir que o captador registre, para cada
  edital, a data de abertura das submissões, além da data de fechamento.
- **FR-005**: O sistema DEVE impedir o cadastro de um edital sem os campos
  obrigatórios definidos em FR-003, indicando ao captador quais campos estão
  faltando.
- **FR-006**: O sistema DEVE permitir que o captador registre, para cada
  edital, a documentação exigida pelo edital (lista de documentos
  comprobatórios pedidos).
- **FR-007**: O sistema DEVE permitir que o captador registre, para cada
  edital, os critérios de avaliação usados para julgar as propostas
  submetidas àquele edital.
- **FR-008**: O sistema DEVE atribuir a todo edital recém-cadastrado o
  estágio inicial "Backlog" no quadro de progresso.
- **FR-009**: O sistema DEVE permitir que o captador mova um edital entre
  quaisquer das quatro colunas do quadro de progresso, em qualquer direção
  (tanto avançando quanto retornando a uma coluna anterior).
- **FR-010**: O sistema DEVE manter o estágio de um edital sincronizado entre
  a visão de tabela e a visão de quadro de progresso — mudar o estágio em uma
  visão DEVE refletir imediatamente na outra.
- **FR-011**: O sistema DEVE indicar visualmente, na listagem e/ou no quadro
  de progresso, editais cuja data de fechamento já passou, para que o
  captador identifique prazos vencidos.
- **FR-012**: O sistema DEVE tornar o link para a chamada de cada edital
  acessível diretamente a partir da tabela e do quadro de progresso.
- **FR-013**: O sistema DEVE permitir que o captador edite qualquer dado de
  um edital já cadastrado (descrição, instituição, link, datas, documentação
  exigida e critérios de avaliação).
- **FR-014**: O sistema DEVE permitir que o captador remova um edital da sua
  lista de acompanhamento ativo.
- **FR-015**: Cada edital cadastrado DEVE pertencer à lista de
  acompanhamento de um único captador; o sistema não deve exibir, nesta
  feature, uma base compartilhada/curada de editais visível a outros
  captadores — cadastrar um edital sempre cria um registro na lista pessoal
  de quem o cadastrou.
- **FR-016**: O sistema DEVE restringir a visualização e a edição dos
  editais (dados e estágio de acompanhamento) ao captador que os cadastrou;
  colaboração multiusuário ou compartilhamento entre membros de uma mesma
  organização proponente está fora do escopo desta feature.
- **FR-017**: O sistema DEVE permitir que documentação exigida e critérios
  de avaliação sejam registrados como texto livre descritivo (ex.: lista de
  itens em texto); esta feature não exige um checklist estruturado com
  marcação individual de "atendido/pendente" por item — o acompanhamento de
  progresso do edital é feito pelo Estágio de Acompanhamento.
- **FR-018**: O sistema DEVE permitir que o captador busque editais pelo
  nome da chamada, usando busca textual parcial, tanto na visão de tabela
  quanto na visão de quadro de progresso.
- **FR-019**: O sistema DEVE permitir que o captador filtre a listagem de
  editais por instituição responsável, tanto na visão de tabela quanto na
  visão de quadro de progresso.
- **FR-020**: O sistema DEVE permitir que o captador ordene a visão de
  tabela por data de fechamento, em ordem crescente ou decrescente de
  proximidade do prazo.
- **FR-021**: O sistema DEVE exibir, dentro de cada coluna do quadro de
  progresso, os cartões ordenados por data de fechamento (do mais próximo ao
  mais distante), como critério de ordenação secundário ao agrupamento por
  estágio — a ordenação por data de fechamento não reorganiza os editais
  entre colunas.
- **FR-022**: O sistema DEVE indicar visualmente, na listagem e/ou no quadro
  de progresso, editais cujo prazo de fechamento está se aproximando (mas
  ainda não venceu), em quatro níveis de proximidade — até 7 dias, até 14
  dias, até 21 dias e até 30 dias antes do fechamento — destacados em cor
  amarela, distinta da cor vermelha usada em FR-011 para prazo já vencido.
  Um edital cujo prazo se encaixa em mais de um nível (ex.: vence em 5 dias,
  simultaneamente dentro dos quatro limiares) DEVE exibir apenas o destaque
  do nível mais urgente aplicável, nunca mais de um destaque ao mesmo tempo.
  Este requisito é tratado como um FR separado de FR-011 (e não uma reescrita
  dele) porque cobre um sinal distinto — alerta gradual de proximidade, não
  prazo vencido — com cor, limiares e regra de "só o nível mais urgente"
  próprios, o que mantém FR-011 estável e cada requisito testável de forma
  independente.

### Key Entities

- **Edital (Chamada de Fomento)**: representa uma oportunidade de captação de
  recursos. Atributos principais: nome da chamada, descrição, instituição
  responsável, link para a chamada, data de abertura, data de fechamento
  (prazo de submissão), documentação exigida e critérios de avaliação.
  Relaciona-se com um estágio de acompanhamento (ver Estágio de
  Acompanhamento).
- **Captador de Recursos**: pessoa responsável por identificar, avaliar e
  submeter propostas a editais de fomento em nome de uma organização
  proponente. É quem cadastra, acompanha e move os editais entre estágios.
- **Estágio de Acompanhamento**: representa em que ponto do processo de
  captação um edital se encontra, com quatro valores possíveis: Backlog, Em
  andamento, Validação, Concluído. Cada edital tem exatamente um estágio
  ativo por vez.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um captador de recursos consegue visualizar todos os seus
  editais cadastrados, com dados essenciais (chamada, instituição, prazo de
  fechamento, link) e o estágio de acompanhamento de cada um, em uma única
  tela, sem precisar consultar fontes externas.
- **SC-002**: Um captador consegue cadastrar um novo edital com todos os
  dados essenciais (nome, instituição, descrição, link, datas) em até 5
  minutos.
- **SC-003**: Um captador consegue mover um edital entre estágios do quadro
  de progresso em 3 ações ou menos.
- **SC-004**: 100% dos editais cadastrados exibem prazo de fechamento e link
  para a chamada, de forma que o captador nunca precise recorrer a uma
  planilha ou anotação externa para saber quando um edital fecha.
- **SC-005**: Um captador identifica editais com prazo de fechamento já
  vencido em poucos segundos ao abrir a listagem ou o quadro de progresso,
  sem precisar comparar datas manualmente.
- **SC-006**: Um captador consegue corrigir um dado desatualizado de um
  edital (ex.: prazo prorrogado) e ver essa correção refletida
  imediatamente em ambas as visões (tabela e quadro de progresso).

## Assumptions

- Assume-se que "captador de recursos" já é um usuário autenticado do
  framework; o mecanismo de autenticação/login em si está fora do escopo
  desta spec e será tratado, se necessário, por outra feature.
- Assume-se que não há, nesta spec, integração automática com fontes
  externas de editais (ex.: raspagem de sites de fomento) — o cadastro é
  feito manualmente pelo captador com base no edital que ele identificou.
- Assume-se que um edital sempre tem uma data de fechamento (prazo de
  submissão) conhecida no momento do cadastro; a data de abertura é desejável
  mas pode não estar disponível em todos os casos.
- Assume-se que não há, nesta spec, geração de notificações automáticas
  (e-mail, push) sobre prazos próximos — a indicação de prazo vencido é
  apenas visual, dentro da própria tela de listagem/quadro de progresso.
- Assume-se que a remoção de um edital (User Story 3) retira o edital das
  visões ativas do captador, mas não implica necessariamente exclusão
  permanente de dados — o comportamento exato de exclusão vs. arquivamento
  fica a critério da fase de planejamento técnico, desde que o resultado
  visível ao captador (edital some das listas ativas) seja preservado.
