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

### Session 2026-07-31

- Q: O link para a chamada continua sendo um campo obrigatório no cadastro (FR-003/FR-005), mesmo quando o edital foi anunciado mas o link oficial ainda não foi publicado (Edge Case)? → A: Não. O link passa a ser opcional no cadastro; o captador pode cadastrar o edital sem link e adicioná-lo ou corrigi-lo depois via edição (FR-013). Nome da chamada, instituição responsável, descrição e data de fechamento continuam obrigatórios.
- Q: A descrição do edital é um campo obrigatório no cadastro? FR-003 a listava como parte do "no mínimo", mas o Acceptance Scenario 2 da User Story 2 (que espelha, em texto, os campos obrigatórios de FR-003/FR-005) não a incluía na lista de campos que bloqueiam o salvamento — as duas listas estavam inconsistentes entre si. → A: Sim, descrição é obrigatória, consistente com a definição original de FR-003; o Acceptance Scenario 2 foi corrigido para incluí-la (e para remover o link, que deixou de ser obrigatório).
- Q: Quando uma busca por nome e/ou um filtro por instituição responsável estão ativos, a contagem por coluna do quadro de progresso (FR-024) deve refletir apenas os cartões visíveis após o filtro, ou sempre o total real de editais naquele estágio, independentemente do filtro? → A: Reflete o total já filtrado, pelo mesmo princípio que FR-023 já aplica ao total agregado — inclusive mostrando 0 quando o filtro esvazia uma coluna (consistente com a mensagem de estado vazio de FR-026).
- Q: Uma coluna do quadro de progresso genuinamente sem nenhum edital cadastrado naquele estágio (sem nenhuma busca/filtro ativo) deve exibir alguma mensagem de estado vazio, ou ficar em branco? → A: Fica em branco, sem mensagem — a mensagem de FR-026 é exclusiva do caso em que um filtro/busca ativo esconde cartões que existiriam sem o filtro; uma coluna vazia sem filtro já comunica sem ambiguidade que não há editais naquele estágio.

### Session 2026-08-04

- Q: O quadro de progresso (User Story 1) e o plano de submissão (User Story 5) evoluem juntos nesta rodada — o quadro ganha uma sétima coluna, "Elegibilidade", logo após Backlog; qual é a semântica exata desse novo estágio (o momento de já ter cumprido os critérios de elegibilidade, ou o de estar levantando/definindo quais são)? → A: O de levantar e definir — "Elegibilidade" é o estágio em que o captador lê o edital e monta/estrutura os critérios e itens de elegibilidade do plano de submissão; cumpri-los é o trabalho feito enquanto o edital permanece nessa coluna, sinalizado pela sugestão de avanço (FR-038) quando os itens essenciais associados a ela estão concluídos.
- Q: Todo item do plano de submissão passa a ter associação obrigatória a um estágio do quadro de progresso (substituindo a "categoria" opcional em texto livre de FR-033) — quais dos sete estágios fazem sentido como destino válido para um item? → A: Quatro dos sete — Elegibilidade, Em andamento, Validação e Submetido. Backlog fica de fora porque um item de plano só existe quando o captador já começou a trabalhar no edital; Aprovado e Não aprovado ficam de fora porque são o desfecho da submissão, não uma etapa de preparação (itens que só existem depois da aprovação continuam na seção "Pós-aprovação/Contratação", FR-048, não como itens do plano associados a um estágio terminal). Essa mesma associação obrigatória passa a ser a base do cálculo da sugestão de avanço de estágio (FR-038), que passa de duas regras distintas por transição para uma única regra — itens essenciais do grupo do estágio atual, todos concluídos — reaproveitada nas três transições Elegibilidade→Em andamento, Em andamento→Validação e Validação→Submetido.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompanhar editais em um quadro de progresso (Priority: P1)

Um captador de recursos quer ver, em um único lugar, todos os editais que está
acompanhando (nome da chamada, descrição, instituição responsável, link para
a chamada e datas importantes) e quer saber, a qualquer momento, em que
estágio do seu processo de captação cada edital se encontra — ainda não
começou a trabalhar nele (Backlog), já está levantando e definindo o que é
necessário para que a proposta seja elegível perante aquele edital
(Elegibilidade), já está preparando a proposta em si (Em andamento), está
revisando antes de enviar (Validação), já enviou a proposta ao financiador e
aguarda o resultado (Submetido), ou já recebeu o resultado — teve a proposta
aceita (Aprovado) ou recusada (Não aprovado). Ele organiza esse
acompanhamento movendo cada edital entre essas sete colunas conforme avança.

**Why this priority**: É o cenário de uso mais básico e imediatamente valioso
do gerenciamento de editais — sem ele, o captador não tem visão consolidada
do que precisa fazer nem prioriza corretamente seu tempo. Corresponde à
tarefa avulsa A001 já registrada no quadro do projeto.

**Independent Test**: Pode ser testado cadastrando dois ou três editais com
seus dados básicos, verificando que aparecem corretamente na listagem, e
movendo cada um entre as sete colunas do quadro de progresso — entrega
valor sozinho, mesmo sem as demais user stories implementadas.

**Acceptance Scenarios**:

1. **Given** existem editais cadastrados, **When** o captador acessa a tela
   de listagem, **Then** ele vê uma tabela com, no mínimo, nome da chamada,
   descrição, instituição responsável, link para a chamada e datas
   importantes (abertura e fechamento) de cada edital.
2. **Given** existem editais cadastrados, **When** o captador acessa a visão
   de quadro de progresso, **Then** ele vê cada edital representado como um
   cartão posicionado em uma das sete colunas (Backlog, Elegibilidade, Em
   andamento, Validação, Submetido, Aprovado, Não aprovado), de acordo com o
   estágio atual daquele edital.
3. **Given** um edital está na coluna "Backlog", **When** o captador começa a
   levantar os critérios necessários para que a proposta seja elegível
   perante aquele edital e move o cartão para a coluna "Elegibilidade",
   **Then** o sistema registra o novo estágio, refletindo a mudança tanto no
   quadro de progresso quanto na tabela — o edital passa a ser tratado, a
   partir desse momento, como um edital cuja preparação já começou (deixou de
   estar apenas no radar do captador).
4. **Given** um edital está na coluna "Em andamento", **When** o captador
   move esse edital para a coluna "Validação", **Then** o sistema registra o
   novo estágio e reflete essa mudança tanto na visão de quadro quanto na
   visão de tabela.
5. **Given** um edital está em qualquer coluna que não seja a primeira,
   **When** o captador decide que errou o estágio, **Then** ele consegue
   mover o edital de volta para uma coluna anterior (o fluxo não é somente de
   avanço).
6. **Given** um edital tem data de fechamento dentro de um dos quatro níveis
   de proximidade (até 7, até 14, até 21 ou até 30 dias), **When** o captador
   acessa a listagem ou o quadro de progresso, **Then** o sistema destaca
   esse edital em amarelo, mostrando apenas o nível mais urgente aplicável
   (ex.: um edital que vence em 5 dias — portanto dentro dos quatro limiares
   ao mesmo tempo — mostra somente o destaque de "até 7 dias", não os quatro
   destaques simultaneamente).
7. **Given** o captador está na visão de quadro de progresso, **When** ele
   move um edital de uma coluna para outra, **Then** o cabeçalho de cada
   coluna afetada (origem e destino) atualiza imediatamente a quantidade de
   editais exibida naquela coluna, refletindo o novo total.
8. **Given** o captador acessa a tela de listagem em uma tela estreita (ex.:
   celular), **When** a largura disponível não comporta todas as colunas
   lado a lado, **Then** o sistema reorganiza a apresentação da tabela (sem
   ocultar nenhuma coluna) para manter nome da chamada, descrição,
   instituição responsável, link e datas legíveis e acessíveis; **and**,
   separadamente, na visão de quadro de progresso em uma resolução de
   desktop padrão, as sete colunas (Acceptance Scenario 2) permanecem
   visíveis lado a lado, sem exigir rolagem horizontal para comparar
   colunas.
9. **Given** um edital está na coluna "Submetido", **When** o captador
   registra o resultado movendo esse edital para "Aprovado" ou para "Não
   aprovado", **Then** o sistema o exibe em exatamente uma dessas duas
   colunas por vez (nunca as duas simultaneamente), e o captador continua
   podendo movê-lo de volta a qualquer coluna anterior caso precise corrigir
   um erro de marcação — a movimentação entre colunas permanece livre e sem
   guarda de ordem (FR-002, FR-009).

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
   responsável, descrição ou data de fechamento), **Then** o sistema impede o
   salvamento e indica claramente quais campos faltam. O link para a chamada
   é opcional e sua ausência nunca impede o salvamento (FR-003).
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

Há ainda um terceiro caso, distinto dos dois anteriores: o captador cadastrou
um edital como candidato antes de avaliá-lo a fundo e, depois de avaliar,
concluiu que ele não tem a ver com a área de atuação da sua organização — mas
não quer excluí-lo, porque isso apagaria o registro de que já avaliou e
descartou aquele edital especificamente (e ele poderia acabar reavaliando o
mesmo edital do zero se ele ressurgir depois, ex.: divulgado de novo por outro
canal). Diferente de "não é mais relevante" (que é definitivo, cobre edital
cancelado ou desistência — FR-014), este caso é sobre deixar de ver um edital
na visão ativa sem perder o registro de que ele já foi avaliado, podendo
reverter a qualquer momento. Ele precisa poder marcar esse edital como
"Ignorado" para tirá-lo da sua visão principal sem excluí-lo, e consultar ou
reverter essa marcação depois.

**Why this priority**: É importante para manter a confiabilidade dos dados ao
longo do tempo, mas o gerenciamento básico (User Stories 1 e 2) já entrega
valor sem esta capacidade — na ausência dela, o captador apenas conviveria
com dados desatualizados até uma correção manual futura. Marcar um edital
como "Ignorado" segue essa mesma lógica de prioridade: é uma forma adicional
de manter a visão ativa do captador confiável ao longo do tempo (removendo do
seu radar o que não é relevante para a área dele), mas sem valor até que
existam editais suficientes cadastrados para a visão ativa começar a ficar
poluída com itens fora de escopo — por isso permanece dentro de US3, não vira
User Story própria com prioridade mais alta.

**Independent Test**: Pode ser testado editando um campo de um edital já
cadastrado (ex.: data de fechamento) e confirmando que a mudança aparece
imediatamente na tabela e no quadro de progresso; separadamente, removendo um
edital e confirmando que ele deixa de aparecer nas duas visões; e,
separadamente, marcando um edital como "Ignorado" e confirmando que ele some
da tabela e do quadro de progresso padrão (mas não é excluído, continua
acessível pela visão de editais ignorados e pode ser desmarcado a qualquer
momento, voltando a aparecer no estágio em que já estava).

**Acceptance Scenarios**:

1. **Given** um edital já cadastrado, **When** o captador edita qualquer um
   dos seus dados (descrição, instituição, link, datas, documentação exigida
   ou critérios de avaliação), **Then** o sistema salva a alteração e passa a
   exibir o dado atualizado em todas as visões.
2. **Given** um edital que não é mais relevante para o captador, **When** ele
   opta por remover esse edital da sua lista, **Then** o sistema deixa de
   exibi-lo na tabela e no quadro de progresso.
3. **Given** um edital que o captador avaliou e concluiu não ter a ver com a
   área de atuação da sua organização, **When** ele marca esse edital como
   "Ignorado", **Then** o sistema deixa de exibi-lo na tabela e no quadro de
   progresso padrão, sem excluí-lo (distinto do Acceptance Scenario 2) e sem
   alterar o estágio de acompanhamento em que ele já se encontrava.
4. **Given** existem editais marcados como "Ignorado", **When** o captador
   acessa a visão/filtro de editais ignorados, **Then** ele vê a lista desses
   editais e consegue desmarcar qualquer um deles, fazendo-o voltar a
   aparecer imediatamente na tabela e no quadro de progresso, no mesmo
   estágio em que já estava antes de ser ignorado.

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
   exibir apenas os editais cujo nome da chamada contém esse termo,
   ignorando diferenças de acentuação (ex.: buscar "inovacao" encontra um
   edital chamado "Inovação").
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
6. **Given** existem editais cadastrados, **When** o captador acessa a
   listagem ou o quadro de progresso, **Then** o sistema exibe, próximo ao
   título da tela ou aos controles de busca/filtro, o número total de
   editais sendo exibidos no momento — mostrando o total geral quando
   nenhuma busca ou filtro está ativo, e o total já filtrado quando o
   captador aplicou busca e/ou filtro por instituição responsável.
7. **Given** o captador aplicou uma busca por nome e/ou um filtro por
   instituição responsável, **When** ele visualiza a tabela ou o quadro de
   progresso, **Then** um indicador visível (ex.: "Filtrando por: ... ·
   Limpar filtros") aparece próximo aos controles de busca/filtro, e, ao
   clicar em "Limpar filtros", a busca e o filtro por instituição são
   resetados juntos, em uma única ação, sem alterar a ordenação aplicada e
   sem alterar a visão de Ativos/Ignorados (FR-029) em que o captador estava
   no momento do clique.
8. **Given** uma busca e/ou um filtro por instituição deixam uma coluna do
   quadro de progresso sem nenhum edital correspondente, **When** o captador
   visualiza essa coluna, **Then** o sistema exibe, no lugar da coluna em
   branco, uma mensagem (ex.: "Nenhum edital encontrado com esses
   critérios.") indicando que a ausência de cartões é resultado do filtro
   aplicado, não da falta de editais cadastrados naquele estágio, e o
   cabeçalho dessa coluna exibe a contagem 0 (FR-024), consistente com o
   total já filtrado (FR-023).
9. **Given** o captador está na visão de editais "Ignorados" (FR-029) com um
   filtro por instituição responsável ativo, **When** ele clica em "Limpar
   filtros" só para limpar a busca ou o filtro de instituição, **Then** o
   filtro por instituição é removido, mas o captador permanece na visão
   "Ignorados" — a alternância Ativos/Ignorados não é afetada por "Limpar
   filtros" (FR-025, FR-029).

---

### User Story 5 - Consultar o detalhe de um edital e montar um plano de submissão com resumo executivo (Priority: P5)

Um captador de recursos que já está preparando a proposta de um edital
específico (estágio "Em andamento" ou além, no quadro de progresso da User
Story 1) precisa de um lugar único, dedicado àquele edital, para: revisar
todos os dados já cadastrados dele (User Stories 1 e 2), montar e acompanhar
um plano de submissão — uma lista de etapas/documentos necessários para
viabilizar o envio da proposta, cada um marcável como pendente ou concluído
— e saber, a qualquer momento, quais pendências de elegibilidade ainda
travam a submissão. Ele também precisa de um resumo executivo dessas
pendências e dos dados relevantes do edital, pronto para compartilhar fora
do sistema com quem, na organização proponente, precisa decidir ou
acompanhar aquela submissão sem operar o sistema (ex.: um coordenador de
pesquisa — ver Assumptions). Tanto o resumo executivo quanto o plano de
submissão devem poder ser exportados em PDF para impressão e
compartilhamento. À medida que o plano de submissão avança, o captador
espera uma sugestão — nunca uma trava — indicando que já é possível avançar
o edital para o próximo estágio do quadro de progresso. Ele também quer,
sem precisar rolar a página, enxergar de imediato o estado geral daquele
edital — se já está habilitado para avançar, quanto falta para o prazo de
fechamento e quantas pendências essenciais restam — e precisa de dois
espaços adicionais, sempre visíveis mas nunca bloqueantes: um para
registrar riscos e avisos daquele edital (ex.: prazos que só valem depois
da aprovação, possibilidade de o edital ser alterado durante a submissão) e
outro, claramente separado do plano de submissão, para itens que só entram
em jogo depois da aprovação (ex.: documentos de contratação) — sem
confundir o que é exigido agora com o que só será exigido depois.

**Why this priority**: Depende logicamente de existir um edital cadastrado
com estágio de acompanhamento (User Story 1) e dados básicos (User Story 2)
— sem eles não haveria o que detalhar nem em que estágio sugerir avanço.
Diferente das User Stories 1 a 4, que cobrem a gestão do conjunto de
editais, esta User Story aprofunda o trabalho dentro de um único edital já
em preparação ativa — por isso é a de menor prioridade: o gerenciamento
básico (cadastrar, acompanhar, editar, localizar) já entrega valor completo
sem ela, e ela ganha valor à medida que a preparação de uma proposta
específica se torna mais complexa (mais documentos, mais critérios de
elegibilidade a controlar).

**Independent Test**: Pode ser testado cadastrando um edital, abrindo sua
página de detalhe pelo ícone de lupa a partir da tabela ou do quadro de
progresso, adicionando itens ao plano de submissão associados a um estágio
do quadro de progresso (FR-033), marcando um deles como essencial para
elegibilidade e concluindo-o, e confirmando que: a sugestão
de avanço aparece quando as condições são atendidas (e some quando deixam
de ser); o resumo executivo reflete as pendências de elegibilidade ainda
abertas; e tanto o resumo executivo quanto o plano de submissão podem ser
exportados em PDF. Também pode ser testado separadamente: a barra de
resumo/veredito refletindo o gate de elegibilidade, a proximidade do prazo
e as pendências essenciais sem precisar rolar a página; e o registro de
riscos e de itens de pós-aprovação, confirmando que nenhum dos dois
interfere na elegibilidade nem na sugestão de avanço.

**Acceptance Scenarios**:

1. **Given** um edital cadastrado aparece na tabela ou no quadro de
   progresso, **When** o captador aciona o ícone de lupa associado a esse
   edital, **Then** o sistema abre uma página de detalhe exclusiva daquele
   edital, exibindo seus dados já cadastrados (FR-001, FR-006, FR-007), o
   plano de submissão e o resumo executivo.
2. **Given** o captador está na página de detalhe de um edital, **When** ele
   adiciona um novo item ao plano de submissão informando uma descrição e o
   estágio do quadro de progresso ao qual esse item está associado (uma das
   quatro opções válidas — Elegibilidade, Em andamento, Validação ou
   Submetido — FR-033), **Then** o sistema salva o item com status
   "Pendente" e o exibe, agrupado sob o estágio informado, na lista do plano
   de submissão daquele edital; **When** ele tenta salvar o item sem
   escolher um estágio, **Then** o sistema impede o salvamento e indica que
   a associação a um estágio é obrigatória.
3. **Given** um item do plano de submissão, **When** o captador marca esse
   item como "essencial para elegibilidade", **Then** o sistema passa a
   considerá-lo nas pendências de elegibilidade do resumo executivo enquanto
   ele permanecer "Pendente".
4. **Given** um item do plano de submissão em status "Pendente", **When** o
   captador registra a referência do documento correspondente (nome do
   arquivo ou anotação de onde ele está guardado, sem enviar o arquivo em
   si — FR-036), **Then** o sistema marca o item como "Concluído" e atualiza
   o progresso do plano de submissão exibido na página.
5. **Given** um edital está no estágio "Elegibilidade" e todos os itens do
   plano de submissão associados a esse estágio (FR-033) marcados como
   "essenciais para elegibilidade" estão "Concluído" (havendo ao menos um
   item essencial associado a "Elegibilidade"), **When** o captador visualiza
   a página de detalhe, **Then** o sistema exibe uma sugestão visível para
   avançar o edital para "Em andamento" (ex.: "Habilitado para ir a Em
   andamento"), com uma ação que, ao ser acionada, move o edital para esse
   estágio (FR-009, FR-010).
6. **Given** um edital está no estágio "Validação" e todos os itens do plano
   de submissão associados a esse estágio (FR-033) marcados como
   "essenciais para elegibilidade" estão "Concluído" (havendo ao menos um
   item essencial associado a "Validação"), **When** o captador visualiza a
   página de detalhe, **Then** o sistema exibe uma sugestão para avançar o
   edital para "Submetido", com a mesma ação de um clique — confirmando que
   a mesma regra do Acceptance Scenario 5 se aplica igualmente à transição
   Em andamento→Validação (não demonstrada aqui separadamente, por ser o
   mesmo mecanismo aplicado a um terceiro grupo de itens).
7. **Given** uma sugestão de avanço está sendo exibida, **When** o captador
   desmarca um item essencial já "Concluído" do grupo de itens associado ao
   estágio atual do edital (fazendo com que nem todos os itens essenciais
   daquele grupo estejam mais "Concluído"), **Then** a sugestão deixa de ser
   exibida, sem que o sistema altere automaticamente o estágio atual do
   edital — mover continua sendo sempre uma decisão explícita do captador
   (FR-009).
8. **Given** a página de detalhe de um edital, **When** o captador aciona o
   resumo executivo, **Then** o sistema exibe as pendências de elegibilidade
   principais (itens essenciais ainda "Pendente") junto aos dados do edital
   relevantes para decisão (nome da chamada, instituição responsável, prazo
   de fechamento, estágio de acompanhamento atual, documentação exigida e
   critérios de avaliação já cadastrados).
9. **Given** o resumo executivo de um edital está sendo exibido, **When** o
   captador aciona a exportação em PDF do resumo executivo, **Then** o
   sistema gera um arquivo PDF com esse conteúdo, apto para impressão e
   compartilhamento fora do sistema.
10. **Given** o plano de submissão de um edital está sendo exibido, **When**
    o captador aciona a exportação em PDF do plano de submissão, **Then** o
    sistema gera um arquivo PDF com a lista de itens, seus status
    (Pendente/Concluído) e quais são essenciais para elegibilidade, apto
    para impressão e compartilhamento fora do sistema.
11. **Given** a página de detalhe de um edital, **When** o captador a acessa,
    **Then** ele vê, no topo, sem precisar rolar a página, uma barra de
    resumo/veredito indicando o estado do gate de elegibilidade
    ("Habilitado"/"Pendente"), a proximidade ou o vencimento do prazo de
    fechamento e a quantidade de pendências essenciais ainda em aberto —
    distinta do banner de sugestão de avanço (Acceptance Scenarios 5 e 6),
    que só aparece quando as condições de FR-038 são atendidas.
12. **Given** um item do plano de submissão sendo criado ou editado, **When**
    o captador preenche, opcionalmente, "Em outras palavras", "Como
    preencher", responsável e/ou data de conclusão, **Then** o sistema salva
    e exibe esses valores junto ao item; **When** ele deixa qualquer um
    desses campos em branco, **Then** o item continua podendo ser criado,
    editado e concluído normalmente, sem nenhum bloqueio — distinto do
    estágio associado (FR-033), que é obrigatório e não pode ficar em
    branco (Acceptance Scenario 2).
13. **Given** a página de detalhe de um edital, **When** o captador acessa a
    seção "Riscos", **Then** ele a vê sempre visível — inclusive quando o
    plano de submissão está vazio —, consegue registrar avisos em texto
    livre, e confirma que nenhum risco registrado altera o gate de
    elegibilidade, a sugestão de avanço (Acceptance Scenarios 5 e 6) ou o
    resumo executivo (Acceptance Scenario 8).
14. **Given** a página de detalhe de um edital, **When** o captador acessa a
    seção "Pós-aprovação / Contratação", **Then** ele a vê visualmente
    separada do plano de submissão, consegue registrar itens em texto
    livre, e confirma que nenhum item dela conta como pendência de
    elegibilidade (Acceptance Scenario 8) nem afeta a sugestão de avanço de
    estágio (Acceptance Scenarios 5 e 6).
15. **Given** o captador está na página de detalhe com múltiplos itens no
    plano de submissão, **When** ele aciona o controle "Expandir/recolher
    tudo" da barra de ações fixa, **Then** todos os itens expandem ou
    recolhem juntos; **When** ele expande ou recolhe um item
    individualmente, **Then** apenas aquele item muda, sem afetar os
    demais; **and**, **When** ele imprime a página (ação "Imprimir" ou
    impressão nativa do navegador), **Then** o layout impresso permanece
    legível e completo — sem cortar plano de submissão, resumo executivo,
    Riscos ou Pós-aprovação — ocultando os controles de ação que não fazem
    sentido no papel.
16. **Given** um item do plano de submissão, um sub-requisito de um item
    condicional (Acceptance Scenario 17) ou um risco registrado (Acceptance
    Scenario 13), **When** o captador marca o indicador de "pergunta em
    aberto" (FR-052), **Then** o sistema exibe esse indicador junto ao
    item/sub-requisito/risco, distinto do indicador de "essencial para
    elegibilidade"/"Informativo" (FR-035), e o contador de "perguntas em
    aberto" da barra de resumo/veredito (FR-041) aumenta em um; **When** ele
    desmarca esse mesmo indicador, **Then** o contador diminui em um, sem
    que a marcação, em nenhum dos dois sentidos, afete o status
    Pendente/Concluído do item nem o gate de elegibilidade.
17. **Given** um item condicional do plano de submissão com duas
    modalidades mutuamente exclusivas, cada uma com seu próprio subconjunto
    de sub-requisitos (FR-053), **When** o captador escolhe uma modalidade e
    marca todos os sub-requisitos dela, **Then** o sistema passa a
    considerar o item "Concluído"; **When** ele troca para a outra
    modalidade, **Then** o sistema exibe apenas os sub-requisitos da nova
    modalidade escolhida (os da modalidade anterior deixam de contar), e o
    item volta a "Pendente" até que os sub-requisitos da nova modalidade
    também estejam todos marcados.
18. **Given** um item de cenário do plano de submissão com cenários
    mutuamente exclusivos e um campo de apoio associado (FR-054), **When**
    o captador escolhe um dos cenários sem preencher o campo de apoio,
    **Then** o sistema já considera o item "Concluído", confirmando que o
    campo de apoio é apenas registro de apoio, nunca condição para a
    conclusão.
19. **Given** o captador preencheu a identificação do proponente (FR-049),
    concluiu itens do plano de submissão e moveu o edital de estágio,
    **When** ele fecha e reabre a página de detalhe (ou atualiza o
    navegador), **Then** todos esses dados preenchidos continuam lá, sem
    exigir login ou conta de usuário adicional (FR-055).

---

### Edge Cases

- O que acontece quando um edital cadastrado não tem link oficial disponível
  no momento do cadastro (ex.: chamada anunciada mas edital completo ainda
  não publicado)? Resolução: o link deixou de ser um campo obrigatório no
  cadastro (FR-003); o captador cadastra o edital sem link e o adiciona
  depois via edição (FR-013), sem ficar bloqueado enquanto o link oficial não
  é publicado. Ver Clarifications (sessão 2026-07-31).
- Como o sistema trata um edital cuja data de fechamento já passou, mas que o
  captador ainda não moveu para nenhum dos estágios terminais (Submetido,
  Aprovado ou Não aprovado) no quadro de progresso?
- O que acontece se dois editais diferentes tiverem o mesmo nome de chamada
  (ex.: edições anuais de um mesmo programa, "Edital 2025" e "Edital 2026")?
- Como o sistema se comporta quando o captador tenta mover um edital
  diretamente do Backlog para Aprovado ou Não aprovado, pulando colunas
  intermediárias como Elegibilidade, Em andamento, Validação ou Submetido?
  Resolução: é permitido — a movimentação entre colunas do quadro de
  progresso continua livre e sem guarda de ordem (FR-002, FR-009), incluindo
  alcançar diretamente qualquer um dos três novos estágios (Submetido,
  Aprovado, Não aprovado) a partir de qualquer coluna anterior, sem exigir
  passagem prévia por Submetido, e incluindo pular "Elegibilidade" caso o
  captador já tenha os critérios de elegibilidade resolvidos e não precise
  passar por ela.
- O que acontece quando um edital não possui data de abertura definida (só a
  data de fechamento é conhecida no momento do cadastro)?
- Como a listagem trata um número grande de editais cadastrados (ex.: mais de
  50) em termos de conseguir localizar um edital específico? Este é
  exatamente o problema que a User Story 4 (busca, filtro e ordenação —
  FR-018 a FR-021) endereça.
- Como o filtro por instituição responsável (FR-019) trata o mesmo
  financiador digitado de formas diferentes em cadastros diferentes (ex.:
  "Fundação X" em um edital e "Fundação X Ltda" em outro)? Achado de teste de
  usabilidade sobre a User Story 2 (ainda não implementada — o campo é texto
  livre, FR-003); ver nota de decisão em Assumptions.
- O que acontece quando o captador cadastra um edital como candidato, avalia
  a fundo e conclui que ele não tem a ver com a área de atuação da sua
  organização, mas não quer excluí-lo (para não perder o registro de que já
  avaliou e descartou aquele edital, evitando reavaliá-lo do zero se ele
  ressurgir)? Resolução: FR-027 a FR-030 (User Story 3) formalizam a marcação
  "Ignorado" como um atributo de visibilidade independente do estágio de
  acompanhamento — o edital some da visão ativa (tabela e quadro) sem ser
  excluído (distinto de FR-014) e sem perder o estágio em que já estava,
  podendo ser revertido a qualquer momento.
- Como uma coluna do quadro de progresso se comporta quando não há nenhuma
  busca ou filtro ativo e simplesmente não existe nenhum edital cadastrado
  naquele estágio (ausência não causada por filtro)? Resolução: a coluna
  permanece em branco, sem mensagem adicional — a mensagem de FR-026 é
  exclusiva do caso em que uma busca/filtro ativo remove todos os cartões de
  uma coluna que teria conteúdo sem o filtro; uma coluna vazia sem filtro
  ativo já comunica sem ambiguidade "nenhum edital neste estágio ainda" e não
  precisa de texto extra. Ver Clarifications (sessão 2026-07-31).
- Como o sistema trata um plano de submissão (User Story 5) sem nenhum item
  cadastrado, ou sem nenhum item marcado como "essencial para elegibilidade"
  entre os associados ao estágio atual do edital? Resolução: a sugestão de
  avanço de estágio (FR-038) exige ao menos um item essencial concluído
  dentro do grupo de itens associados ao estágio atual do edital — mesma
  regra reaproveitada para as três transições cobertas (Elegibilidade→Em
  andamento, Em andamento→Validação, Validação→Submetido); a ausência de
  itens essenciais nesse grupo não satisfaz a condição por vacuidade, então a
  sugestão simplesmente não aparece até existir ao menos um item essencial
  concluído associado ao estágio em que o edital se encontra.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir, para o captador de recursos, uma
  listagem em formato de tabela com todos os seus editais cadastrados,
  mostrando ao menos: nome da chamada, descrição, instituição responsável,
  link para a chamada e datas importantes (abertura e fechamento).
- **FR-002**: O sistema DEVE oferecer, além da tabela, uma visão de quadro de
  progresso (kanban) com exatamente sete colunas, nesta ordem: Backlog,
  Elegibilidade, Em andamento, Validação, Submetido, Aprovado e Não aprovado.
  As duas últimas continuam sendo estágios terminais que registram o
  resultado do edital junto ao financiador — mutuamente exclusivos entre si
  (um edital tem exatamente um estágio ativo por vez, nunca os dois ao mesmo
  tempo) e não sequenciais um em relação ao outro (não existe uma ordem entre
  Aprovado e Não aprovado; ambos representam o mesmo momento do processo — o
  desfecho da submissão — sob dois resultados possíveis).

  Coluna "Elegibilidade" (nova nesta rodada): posicionada logo após Backlog,
  representa o momento em que o captador já decidiu acompanhar o edital
  (saiu do Backlog) e está lendo o edital para levantar e definir o que é
  necessário para que a proposta seja elegível — isto é, para montar e
  estruturar os critérios e itens de elegibilidade do plano de submissão
  (FR-033 a FR-036) — não necessariamente para já tê-los cumpridos (cumprir
  esses itens é o que o captador faz enquanto o edital permanece nessa
  coluna, e a sugestão de avanço de FR-038 sinaliza quando eles já foram
  cumpridos). "Em andamento" continua representando a preparação ativa da
  proposta em si (produção de conteúdo, coleta de documentos que vão além do
  mínimo de elegibilidade), o que só faz sentido depois de a elegibilidade já
  estar mapeada e resolvida — daí "Elegibilidade" vir antes de "Em andamento"
  na ordem do quadro.

  Decisão de produto sobre a movimentação entre colunas: este requisito não
  introduz nenhuma guarda de ordem nova — a transição entre as sete colunas
  permanece totalmente livre em qualquer direção, incluindo alcançar
  Aprovado/Não aprovado a partir de qualquer coluna, não só de Submetido, e
  incluindo pular "Elegibilidade" quando o captador já resolveu a
  elegibilidade por fora do sistema (ver FR-009, que já cobria esse princípio
  para o modelo de quatro colunas, depois seis, e passa a cobrir as sete).
  Justificativa: o protótipo de referência (`prototype/avulsa-A001/`) já
  implementa transição livre sem nenhuma trava entre colunas, e passar a
  exigir Submetido como pré-requisito de Aprovado/Não aprovado seria uma
  restrição nova, não pedida pelo usuário, que bloquearia correções manuais
  legítimas (ex.: o captador marca Aprovado/Não aprovado por engano, ou o
  edital é reaberto para nova rodada de avaliação e precisa voltar para
  Validação).
- **FR-003**: O sistema DEVE permitir que o captador cadastre um novo edital
  informando, no mínimo: nome da chamada, instituição responsável, descrição
  e data de fechamento (prazo de submissão). O link para a chamada é
  desejável mas não é obrigatório no momento do cadastro — cobre o caso de um
  edital anunciado antes da publicação do link oficial (ver Edge Cases) — e
  pode ser adicionado ou corrigido depois por meio da edição do edital
  (FR-013).
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
  quaisquer das sete colunas do quadro de progresso (FR-002), em qualquer
  direção (tanto avançando quanto retornando a uma coluna anterior) —
  incluindo mover diretamente para ou a partir de Aprovado/Não aprovado sem
  exigir passagem prévia por Submetido (ver justificativa de produto em
  FR-002).
- **FR-010**: O sistema DEVE manter o estágio de um edital sincronizado entre
  a visão de tabela e a visão de quadro de progresso — mudar o estágio em uma
  visão DEVE refletir imediatamente na outra.
- **FR-011**: O sistema DEVE indicar visualmente, na listagem e/ou no quadro
  de progresso, editais cuja data de fechamento já passou, para que o
  captador identifique prazos vencidos.
- **FR-012**: O sistema DEVE tornar o link para a chamada de cada edital
  acessível diretamente a partir da tabela e do quadro de progresso, quando
  esse link estiver cadastrado; para um edital sem link registrado (FR-003),
  o sistema DEVE indicar visualmente a ausência do link, sem impedir a
  visualização dos demais dados do edital.
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
  quanto na visão de quadro de progresso. A comparação usada pela busca DEVE
  ignorar diferenças de acentuação (ex.: digitar "inovacao" encontra um
  edital chamado "Inovação"), para que o captador não precise digitar
  acentos corretamente para localizar um edital. Formalização de um
  comportamento já implementado e confirmado ao vivo no protótipo
  `prototype/avulsa-A001/` (task A012 do quadro do projeto).
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
- **FR-023**: O sistema DEVE exibir, próximo ao título da tela ou aos
  controles de busca/filtro, o número total de editais sendo exibidos no
  momento — refletindo o total geral de editais cadastrados quando nenhuma
  busca ou filtro está ativo, e o total já filtrado (não o total geral) quando
  o captador tem uma busca por nome e/ou um filtro por instituição
  responsável aplicados. Este requisito permanece dentro da User Story 4 (não
  vira uma User Story própria) porque não introduz uma tarefa nova do
  captador — é um refinamento de visibilidade sobre a mesma capacidade de
  "localizar um edital entre muitos" que FR-018 a FR-021 já cobrem, e por isso
  compartilha a mesma prioridade (P4) e o mesmo teste independente. A origem
  é uma lacuna de usabilidade encontrada em teste com persona (Débora
  Nakashima, `docs/persona/avulsa-A001.html#dor-1`, severidade média): sem um
  total agregado visível, o captador precisava somar de cabeça as contagens
  por coluna do quadro de progresso (FR-024) ou contar linhas na tabela para
  saber quantos editais está acompanhando — a mesma conta manual que a
  ferramenta deveria eliminar.
- **FR-024**: O sistema DEVE exibir, no cabeçalho de cada coluna do quadro de
  progresso, a quantidade de editais atualmente naquela coluna (ex.:
  "Validação (2)"), atualizada dinamicamente conforme editais entram, saem ou
  são movidos entre colunas — inclusive imediatamente após o captador mover
  um cartão (FR-009). Quando uma busca por nome e/ou um filtro por
  instituição responsável estão ativos (FR-018/FR-019), essa contagem por
  coluna reflete apenas os editais atualmente visíveis naquela coluna após o
  filtro — o mesmo princípio de "total filtrado, não total geral" que FR-023
  já aplica ao total agregado — incluindo o valor 0 quando o filtro não deixa
  nenhum cartão na coluna (ver FR-026). Este requisito permanece dentro da
  User Story 1 (não
  vira User Story própria) porque é um refinamento de visibilidade sobre a
  mesma visão de quadro de progresso já coberta por FR-002 e FR-009 — ver
  Acceptance Scenario 6. Formalização de um comportamento já implementado e
  confirmado ao vivo no protótipo `prototype/avulsa-A001/` (task A009 do
  quadro do projeto), que nunca havia sido registrado como requisito.
- **FR-025**: O sistema DEVE exibir, próximo aos controles de busca/filtro,
  tanto na visão de tabela quanto na de quadro de progresso, um indicador
  visível de que uma busca por nome e/ou um filtro por instituição
  responsável está ativo (ex.: "Filtrando por: ... · Limpar filtros"), com
  uma ação "Limpar filtros" que reseta busca e filtro por instituição
  simultaneamente, em uma única ação, sem alterar a ordenação vigente (ver
  Acceptance Scenario 7 de User Story 4). Este requisito é tratado como FR
  separado de FR-018/FR-019 (e não uma reescrita deles) porque cobre um sinal
  distinto — visibilidade de que um filtro está ativo, não a capacidade de
  buscar/filtrar em si. Origem: teste de usabilidade com persona, severidade
  média — sem esse indicador, um captador que filtra e esquece de limpar
  pode ler uma contagem já filtrada (ex.: a contagem por coluna de FR-024 ou
  o total de FR-023) como se fosse o total geral, e reportar um número
  incorreto a terceiros. Formalização de um comportamento já implementado e
  confirmado ao vivo no protótipo `prototype/avulsa-A001/` (task A013).
  Escopo de "Limpar filtros": a ação reseta somente busca (FR-018) e filtro
  por instituição responsável (FR-019) — a alternância entre a visão de
  editais ativos e a de editais "Ignorados" (FR-029) é uma dimensão
  diferente (qual conjunto de editais está sendo visualizado, não um filtro
  de refinamento dentro desse conjunto) e permanece inalterada por essa
  ação, inclusive quando o captador está na visão de Ignorados no momento do
  clique (ver Acceptance Scenario 9 de User Story 4). Achado de teste de
  usabilidade com persona (Beatriz Noronha, `docs/persona/avulsa-A001.html`):
  sem essa distinção explícita, "Limpar filtros" também devolvia o captador
  à visão "Ativos" quando ele só queria limpar a busca, tirando-o sem aviso
  do lugar de onde estava.
- **FR-026**: O sistema DEVE exibir, em qualquer coluna do quadro de
  progresso que fique sem nenhum edital correspondente por causa de uma
  busca e/ou filtro ativo, uma mensagem indicando que não há resultado para
  os critérios aplicados (ex.: "Nenhum edital encontrado com esses
  critérios."), em vez de deixar a coluna em branco (ver Acceptance Scenario
  8 de User Story 4). Este requisito estende ao quadro de progresso um
  comportamento que a visão de tabela já entrega implicitamente ao aplicar
  FR-018/FR-019 (uma tabela sem linhas já comunica "nenhum resultado" pela
  ausência natural de conteúdo tabular; uma coluna de quadro vazia, sem
  mensagem, é ambígua — pode ser lida como "nenhum edital cadastrado nesse
  estágio"). Formalização de um comportamento já implementado e confirmado
  ao vivo no protótipo `prototype/avulsa-A001/` (task A014).
- **FR-027**: O sistema DEVE permitir que o captador marque um edital já
  cadastrado como "Ignorado", sem excluí-lo (distinto da remoção definitiva,
  FR-014). Esta marcação é um atributo de visibilidade ortogonal ao Estágio
  de Acompanhamento — não é um oitavo estágio do quadro de progresso, que
  passa a ter exatamente sete colunas nesta rodada (FR-002). Justificativa de
  produto: cobre o caso de um edital que o captador
  cadastrou como candidato antes de avaliá-lo a fundo e, após avaliar,
  concluiu que não tem a ver com a área de atuação da sua organização — ele
  quer registrar que já avaliou e descartou aquele edital especificamente,
  para não precisar reavaliá-lo do zero caso ele ressurja (ex.: divulgado de
  novo por outro canal), o que a exclusão definitiva (FR-014) não permite
  preservar. Uma coluna adicional dedicada foi considerada e descartada
  porque "ignorado" não é um estágio do processo de captação (o edital não
  avança nem retrocede por ser ignorado) — é sobre o captador não querer ver
  aquele item agora, o que é melhor modelado como um estado de visibilidade
  reversível do que como posição no funil.
- **FR-028**: O sistema DEVE ocultar, por padrão, editais marcados como
  "Ignorado" tanto da tabela quanto do quadro de progresso — inclusive das
  contagens exibidas (total geral de FR-023 e contagem por coluna de
  FR-024) — mantendo inalterado o estágio de acompanhamento que o edital já
  tinha antes de ser ignorado.
- **FR-029**: O sistema DEVE oferecer ao captador uma forma de alternar
  entre a visão de editais ativos e a visão de editais marcados como
  "Ignorado", tanto na tabela quanto no quadro de progresso, para que ele
  possa revisar os ignorados sem precisar lembrar manualmente de cada um.
  Essa alternância DEVE ser apresentada como um controle de duas posições
  nomeadas (ex.: "‹ Ativos" / "Ignorados ›", com indicação da quantidade de
  editais ignorados) — não como uma caixa de marcação (checkbox/toggle)
  liga-desliga, não como uma oitava coluna do quadro de progresso (FR-002
  passa a ter exatamente sete colunas nesta rodada) e não como uma rota/tela
  totalmente separada. Os dois conjuntos (ativos e ignorados) são tratados
  como posições opostas de uma mesma alternância, reaproveitando os mesmos
  controles de busca/filtro/ordenação e a mesma lógica de contagem total
  (FR-023) já usados pela visão padrão. Justificativa de UX (decisão do
  `designer`): um controle de alternância de duas posições nomeadas é o
  padrão indicado para alternar entre visões/categorias mutuamente
  exclusivas (Nielsen Norman Group) — diferente de um checkbox/toggle, que
  comunica o estado liga/desliga de uma única propriedade, não a troca entre
  dois conjuntos nomeados de itens. Revisão desta rodada: o texto original
  de FR-029 deixava o mecanismo de UI deliberadamente em aberto ("uma
  visão/filtro dedicado"); agora que a decisão de UX foi tomada e
  implementada e confirmada ao vivo no protótipo `prototype/avulsa-A001/`
  (task A018), o requisito passa a especificar o padrão de interação real
  em vez de permanecer livre. Por ser um seletor de qual conjunto de editais
  está sendo visualizado — não um filtro de refinamento dentro de um
  conjunto —, esta alternância NÃO é resetada pela ação "Limpar filtros"
  (FR-025): trocar entre Ativos e Ignorados é uma ação distinta, feita
  apenas por este próprio controle, nunca como efeito colateral de limpar
  busca/instituição.
- **FR-030**: O sistema DEVE permitir que o captador desmarque um edital
  como "Ignorado" a partir da visão de ignorados (FR-029), fazendo-o voltar
  a aparecer na tabela e no quadro de progresso, no mesmo estágio de
  acompanhamento em que já estava antes de ser ignorado.
- **FR-031**: O sistema DEVE manter a listagem em tabela e o quadro de
  progresso utilizáveis em diferentes larguras de tela. Na tabela, os dados
  essenciais (nome da chamada, descrição, instituição responsável, link e
  datas) DEVEM permanecer legíveis e acessíveis em telas estreitas (ex.:
  celular), reorganizando a apresentação quando necessário em vez de ocultar
  qualquer coluna. No quadro de progresso, as sete colunas (FR-002) DEVEM
  permanecer visíveis lado a lado em resoluções de desktop padrão, sem exigir
  rolagem horizontal. Este requisito é tratado como FR separado de FR-001/
  FR-002 (e não uma extensão deles) porque cobre um sinal distinto —
  usabilidade da apresentação através de diferentes tamanhos de tela, não a
  existência dos dados/colunas em si, que FR-001/FR-002 já garantem. Ver
  Acceptance Scenario 8 de User Story 1. Formalização de um comportamento já
  implementado e confirmado ao vivo no protótipo `prototype/avulsa-A001/`
  (tasks A002 e A003 do quadro do projeto), que nunca havia sido registrado
  como requisito.
- **FR-032**: O sistema DEVE oferecer, a partir de cada edital exibido na
  tabela (FR-001) e no quadro de progresso (FR-002), um ícone de lupa que
  leva o captador a uma página de detalhe exclusiva daquele edital, reunindo
  a seção "Identificação do proponente" (FR-049), os dados já cadastrados
  (FR-001, FR-006, FR-007), o plano de submissão (FR-033 a FR-036, FR-050 a
  FR-054), a sugestão de avanço no quadro de progresso quando aplicável
  (FR-038), o resumo executivo (FR-037), a barra de resumo/veredito
  (FR-041), a barra de ações fixa (FR-042, FR-043), a seção Riscos (FR-047)
  e a seção Pós-aprovação / Contratação (FR-048).
- **FR-033**: O sistema DEVE permitir que o captador adicione, na página de
  detalhe de um edital, itens ao plano de submissão daquele edital, cada um
  com uma descrição em texto informada pelo captador (ex.: "Balanço
  assinado pelo contador", "Anuência da ICT parceira") e, obrigatoriamente,
  um estágio do quadro de progresso (FR-002) ao qual esse item está
  associado, escolhido em uma lista fechada de exatamente quatro valores
  válidos — Elegibilidade, Em andamento, Validação ou Submetido — sem a qual
  o item não pode ser salvo. Cada item recém-adicionado começa com status
  "Pendente" (FR-034).

  Por que só esses quatro estágios (e não os sete de FR-002): "Backlog" fica
  de fora porque um item de plano de submissão só existe quando o captador
  já começou a trabalhar no edital — Backlog representa "ainda não comecei",
  não há o que planejar ali; "Aprovado" e "Não aprovado" ficam de fora
  porque são o desfecho da submissão, não uma etapa de preparação — associar
  um item de plano a um resultado não faria sentido (ver FR-048 para onde
  ficam os itens que só existem depois da aprovação). Os quatro estágios
  restantes são, cada um, uma etapa real de preparação em que existe
  trabalho concreto do captador a fazer antes de avançar: levantar e
  cumprir critérios de elegibilidade (Elegibilidade), produzir/coletar o
  conteúdo da proposta em si (Em andamento), revisar antes de enviar
  (Validação), e acompanhar/responder eventuais diligências enquanto o
  edital aguarda o resultado do financiador (Submetido).

  Decisão de escopo: o plano de submissão desta feature continua sendo uma
  lista plana de itens definida manualmente pelo captador — a associação
  obrigatória a um estágio não introduz sub-fases dentro de um estágio nem
  um modelo configurável por edital, apenas agrupa os itens já existentes
  pelo estágio do quadro de progresso ao qual cada um pertence; documentação
  exigida (FR-006) e critérios de avaliação (FR-007) continuam sendo a
  referência de conteúdo que o captador consulta para decidir quais itens
  criar e a qual estágio associar cada um. Este FR não reabre FR-017:
  documentação exigida e critérios de avaliação continuam sendo texto livre,
  sem controle individual de status — o plano de submissão é uma lista
  separada e adicional, específica desta página de detalhe, não uma
  reinterpretação desses dois campos.

  Revisão desta rodada: este requisito substitui a versão anterior, na qual
  o captador podia atribuir a cada item uma "categoria" opcional em texto
  livre curto, usada apenas como etiqueta visual sem efeito funcional. A
  categoria deixa de existir como campo próprio — a associação a um dos
  quatro estágios válidos passa a cumprir esse mesmo papel de
  agrupamento/etiqueta visual da lista (trabalho de apresentação a cargo do
  `designer`), agora obrigatória e de valor fechado, e passa também a ser a
  base do cálculo da sugestão de avanço de estágio por grupo (FR-038).

  Formalização adicional desta rodada: um item pode, alternativamente à
  estrutura padrão de um único checkbox aqui descrita, ser cadastrado em uma
  das duas estruturas alternativas de FR-053 (condicional, com
  sub-requisitos ramificados por modalidade) ou FR-054 (cenário mutuamente
  exclusivo com campos de apoio). Nos dois casos, a associação obrigatória a
  um dos quatro estágios válidos e a participação no gate de FR-038
  continuam se aplicando normalmente — apenas o critério de "Concluído"
  (FR-034) muda conforme definido em cada um desses dois requisitos, em vez
  do checkbox simples.
- **FR-034**: O sistema DEVE permitir que o captador altere o status de
  qualquer item do plano de submissão entre "Pendente" e "Concluído", e DEVE
  exibir, na página de detalhe, quantos itens do plano de submissão já estão
  "Concluído" em relação ao total cadastrado.
- **FR-035**: O sistema DEVE permitir que o captador marque qualquer item do
  plano de submissão como "essencial para elegibilidade" (e desmarque essa
  indicação a qualquer momento), sinalizando que a ausência desse item
  bloqueia a elegibilidade da proposta perante o edital. Este atributo é
  independente do status "Pendente"/"Concluído" (FR-034) — um item pode ser
  essencial e pendente, essencial e concluído, ou não essencial em qualquer
  status. É também independente do estágio associado ao item (FR-033) — um
  item de qualquer um dos quatro estágios válidos pode ser marcado como
  essencial; é o cruzamento entre estágio associado e este atributo que
  FR-038 usa para calcular a sugestão de avanço, agrupando os itens
  essenciais por estágio.

  Formalização adicional desta rodada: o sistema DEVE tornar esta marcação
  visível de forma simétrica — tanto quando o item é essencial (indicador
  ex.: "Essencial") quanto quando não é (indicador ex.: "Informativo", com o
  sentido explícito de "não bloqueante para o avanço de estágio") —, nunca
  deixando um dos dois estados apenas implícito pela ausência do outro.
- **FR-036**: O sistema DEVE permitir que o captador registre, para um item
  do plano de submissão, uma referência ao documento correspondente (ex.:
  nome do arquivo ou uma anotação livre de onde ele está guardado), sem
  exigir o envio/armazenamento do arquivo em si nesta feature — o efeito de
  registrar essa referência é marcar o item como "Concluído" (FR-034).
  Decisão de escopo: o envio real de arquivo (upload com armazenamento no
  sistema) fica fora desta rodada porque o projeto ainda não tem uma stack
  de armazenamento de arquivo definida (dev usa SQLite, sem serviço de
  storage configurado); tratar apenas o metadado agora entrega o valor
  central pedido — saber o que já foi providenciado — sem introduzir uma
  decisão de infraestrutura nova por baixo de uma spec de negócio. Ver
  Assumptions para o registro deste corte como candidato a feature futura.
- **FR-037**: O sistema DEVE oferecer, na página de detalhe de um edital
  (FR-032), um resumo executivo que reúne: (a) as pendências de
  elegibilidade principais — os itens do plano de submissão marcados como
  "essenciais para elegibilidade" (FR-035) que ainda estão com status
  "Pendente" (FR-034); e (b) os dados do próprio edital relevantes para
  quem precisa decidir ou acompanhar a submissão sem operar o sistema (nome
  da chamada, instituição responsável, data de fechamento, estágio de
  acompanhamento atual, documentação exigida e critérios de avaliação já
  cadastrados — FR-001, FR-006, FR-007). Quando não houver nenhuma
  pendência de elegibilidade em aberto, o sistema DEVE indicar isso
  explicitamente (ex.: "Nenhuma pendência de elegibilidade em aberto"), em
  vez de exibir a seção vazia sem explicação.
- **FR-038**: O sistema DEVE exibir, na página de detalhe (FR-032), uma
  sugestão visível para avançar o edital ao próximo estágio do quadro de
  progresso (FR-002) sempre que, para o estágio atual do edital, existir
  pelo menos um item do plano de submissão associado a esse estágio
  (FR-033) marcado como "essencial para elegibilidade" (FR-035) e todos os
  itens associados a esse estágio marcados como essenciais estiverem
  "Concluído" (FR-034). A mesma regra é reaproveitada nas três transições em
  que o estágio atual do edital coincide com um dos quatro estágios válidos
  de associação de item (FR-033) e tem um próximo estágio no quadro: (a) de
  "Elegibilidade" para "Em andamento"; (b) de "Em andamento" para
  "Validação"; (c) de "Validação" para "Submetido". Em nenhum dos três casos
  a ausência de itens essenciais associados àquele estágio satisfaz a
  condição por vacuidade (ver Edge Cases) — sem nenhum item essencial
  cadastrado naquele grupo, a sugestão simplesmente não aparece. Itens não
  essenciais do mesmo grupo, e itens associados a outros estágios, não
  afetam esta avaliação — a regra olha exclusivamente para o grupo de itens
  associados ao estágio atual do edital.

  A sugestão inclui uma ação que, ao ser acionada, move o edital para o
  estágio sugerido, usando o mesmo mecanismo de FR-009/FR-010, e desaparece
  imediatamente se um item essencial daquele grupo deixar de estar
  "Concluído" (ex.: o captador o desmarca), sem mover automaticamente o
  edital de volta a um estágio anterior.

  Decisão de escopo (revisão desta rodada — substitui a versão anterior
  deste requisito): a versão anterior usava duas regras distintas por
  transição — itens essenciais concluídos para a transição Em andamento→
  Validação; 100% de todos os itens (essenciais e não essenciais)
  concluídos para a transição Validação→Submetido. Com a associação
  obrigatória de item a estágio (FR-033), o modelo passa a ser único e
  reaproveitado nas três transições cobertas — "itens essenciais do grupo do
  estágio atual, todos concluídos" — o que também resolve, para a nova
  coluna Elegibilidade, o mesmo mecanismo sem precisar de uma quarta regra
  ad hoc. Itens não essenciais continuam existindo e podendo ser cadastrados
  em qualquer um dos quatro estágios válidos, mas não bloqueiam nem
  habilitam a sugestão — apenas os essenciais do grupo do estágio atual
  contam.

  Os demais estágios (Backlog e Submetido→Aprovado/Não aprovado) permanecem
  fora do mecanismo de sugestão: Backlog porque nenhum item de plano de
  submissão pode estar associado a ele (FR-033); Submetido→Aprovado/Não
  aprovado porque depende do resultado do financiador, uma decisão externa
  que o plano de submissão não modela (itens associados a "Submetido"
  registram acompanhamento enquanto o edital aguarda resposta — ex.:
  responder a uma diligência — mas não determinam esse resultado). O pedido
  original também mencionava uma sugestão para "retroceder" — decisão de
  produto: não é formalizada como um mecanismo novo porque mover um edital
  para qualquer coluna anterior já é livre e sem guarda de ordem hoje
  (FR-009); uma sugestão condicional ao progresso do plano de submissão faz
  sentido apenas para avançar, nunca para retroceder.
- **FR-039**: O sistema DEVE permitir que o captador exporte o resumo
  executivo (FR-037) de um edital como um arquivo PDF, contendo os mesmos
  dados exibidos na tela, apto para impressão e compartilhamento fora do
  sistema (ex.: com um coordenador de pesquisa da organização proponente,
  que não precisa ter acesso ao sistema para consultar essas informações —
  ver Assumptions). O mecanismo técnico de geração do PDF fica em aberto
  para a fase de planejamento técnico.
- **FR-040**: O sistema DEVE permitir que o captador exporte o plano de
  submissão (FR-033 a FR-036) de um edital como um arquivo PDF, contendo a
  lista de itens, seus status (Pendente/Concluído) e a indicação de quais
  são essenciais para elegibilidade, apto para impressão e compartilhamento
  fora do sistema. O mecanismo técnico de geração do PDF fica em aberto para
  a fase de planejamento técnico.
- **FR-041**: O sistema DEVE exibir, no topo da página de detalhe (FR-032),
  sempre visível sem exigir rolagem, uma barra de resumo/veredito com: (a)
  o estado do gate de elegibilidade do edital ("Habilitado" ou "Pendente"),
  calculado pela regra de FR-038 (itens essenciais do grupo do estágio
  atual, todos concluídos) quando o edital está em um dos três estágios
  cobertos por FR-038 — "Elegibilidade", "Em andamento" ou "Validação"; para
  um edital em qualquer outro estágio (Backlog, Submetido, Aprovado, Não
  aprovado), onde FR-038 não define nenhuma sugestão de avanço para aquele
  estágio, a barra exibe o gate como não aplicável a esse estágio, mostrando
  apenas os itens (b), (c) e (d) a seguir; (b) a proximidade
  ou o vencimento do prazo de fechamento do próprio edital, reaproveitando
  os limiares e a codificação visual já definidos em FR-011 (prazo vencido)
  e FR-022 (proximidade em quatro níveis); (c) a quantidade de pendências
  essenciais ainda em aberto no plano de submissão (itens marcados como
  "essencial para elegibilidade" — FR-035 — com status "Pendente" —
  FR-034); e (d) a quantidade de indicadores de "pergunta em aberto"
  (FR-052) atualmente ativos naquele edital, somando itens do plano de
  submissão, sub-requisitos de itens condicionais (FR-053) e riscos
  registrados (FR-047) marcados com esse indicador — item (d) formalizado
  nesta rodada, junto com o próprio mecanismo de FR-052. Este requisito é
  tratado como FR separado de FR-038 (e não uma
  reescrita dele) porque cobre um sinal distinto: FR-038 é uma sugestão
  condicional que aparece e desaparece conforme um limiar específico é
  cruzado (o momento de avançar de estágio); a barra de resumo/veredito é
  um painel de status permanente, sempre presente na página de detalhe,
  independentemente de haver ou não uma sugestão de avanço no momento.
- **FR-042**: O sistema DEVE exibir, fixa (sticky) no topo da página de
  detalhe (FR-032) enquanto o captador rola a página, uma barra de ações
  reunindo: um controle para expandir ou recolher, de uma vez, todos os
  itens do plano de submissão (ver FR-043 para o controle equivalente por
  item individual); uma ação "Imprimir" que aciona a impressão da página
  corrente pelo navegador (ver FR-044 para os requisitos de layout de
  impressão); e os botões de exportação em PDF do resumo executivo
  (FR-039) e do plano de submissão (FR-040), que passam a ficar
  posicionados nessa mesma barra fixa, sem alterar o comportamento de
  exportação já especificado por esses dois requisitos — "Imprimir" a
  página inteira e "Exportar PDF" um conteúdo específico (resumo ou plano)
  continuam sendo ações distintas, apenas compartilhando o mesmo local de
  acesso na tela.
- **FR-043**: O sistema DEVE permitir que o captador expanda ou recolha,
  individualmente, a exibição detalhada de cada item do plano de submissão
  (ex.: ocultando temporariamente os campos didáticos de FR-045 e os demais
  metadados do item, mantendo sempre visíveis ao menos sua descrição e seu
  status), independentemente do controle global de expandir/recolher todos
  os itens de uma vez (FR-042).
- **FR-044**: O sistema DEVE apresentar a página de detalhe de um edital
  (FR-032), quando impressa diretamente pelo navegador (ex.: via atalho de
  impressão do sistema operacional ou a ação "Imprimir" de FR-042), em um
  layout legível e completo — sem cortar conteúdo do plano de submissão, do
  resumo executivo, da seção Riscos (FR-047) ou da seção Pós-aprovação /
  Contratação (FR-048) — e ocultando os controles de ação que não fazem
  sentido no papel (ex.: botões de expandir/recolher, de exportação em PDF
  e de mudança de estágio). Este requisito é tratado como FR separado de
  FR-039/FR-040 (e não uma extensão deles) porque cobre a fidelidade de
  impressão da página inteira do navegador, não a geração de um arquivo PDF
  dedicado ao resumo executivo ou ao plano de submissão isoladamente.
- **FR-045**: O sistema DEVE permitir que o captador registre,
  opcionalmente, para cada item do plano de submissão, ao criar ou editar
  esse item, dois textos livres adicionais: uma paráfrase em linguagem
  simples do que o item significa ("Em outras palavras") e uma orientação
  prática de onde obter o dado ou documento correspondente ("Como
  preencher"). Ambos os campos são opcionais e, quando não preenchidos, não
  impedem a criação, a edição ou a conclusão do item. Decisão de escopo:
  diferente do artefato de referência (skill `fundraiser-submission-
  timeline`, que extrai esse conteúdo automaticamente do Regulamento de um
  edital em PDF), aqui esses textos são digitados manualmente pelo próprio
  captador — esta feature não inclui extração automática de conteúdo a
  partir de PDF.
- **FR-046**: O sistema DEVE permitir que o captador registre,
  opcionalmente, para cada item do plano de submissão, um responsável
  (texto livre, ex.: nome de quem vai providenciar aquele item) e uma data
  de conclusão. Ambos os campos são opcionais, puramente informativos, e
  não têm efeito sobre o status Pendente/Concluído do item (FR-034, que
  continua sendo alternado manualmente ou pelo registro de referência de
  documento — FR-036) nem sobre o cálculo de elegibilidade (FR-035,
  FR-038) — servem apenas de acompanhamento adicional para o captador e
  para quem lê o resumo executivo ou as exportações em PDF.
- **FR-047**: O sistema DEVE oferecer, na página de detalhe de um edital
  (FR-032), uma seção "Riscos" sempre visível, independente da existência
  ou do progresso do plano de submissão, na qual o captador registra
  livremente, em texto, avisos ou riscos daquele edital (ex.: prazos que só
  se aplicam depois da aprovação, possibilidade de o edital ser alterado
  durante a submissão). Esta seção segue o mesmo modelo de FR-006/FR-007/
  FR-017 — texto livre descritivo, sem controle individual de status
  "atendido/pendente" por item — e nunca é considerada no cálculo de
  elegibilidade (FR-035, FR-038) nem nos itens (a)-(c) da barra de
  resumo/veredito (FR-041), que são derivados desse cálculo: é informativa,
  nunca bloqueante.

  Formalização adicional desta rodada: um risco registrado pode,
  opcionalmente, carregar o mesmo indicador de "pergunta em aberto" de
  FR-052 — quando o risco em si representa uma ambiguidade do edital-fonte a
  confirmar, não apenas um aviso processual comum. Essa marcação segue a
  mesma natureza informativa e não-gated do restante desta seção: entra
  apenas no contador (d) da barra de resumo/veredito (FR-041), nunca no
  cálculo de elegibilidade (FR-035, FR-038) nem nos itens (a)-(c) dessa
  mesma barra.
- **FR-048**: O sistema DEVE oferecer, na página de detalhe de um edital
  (FR-032), uma seção "Pós-aprovação / Contratação" separada e visualmente
  distinta do plano de submissão (FR-033), na qual o captador registra
  livremente, em texto, itens que só se tornam relevantes depois da
  aprovação do edital (ex.: documentos exigidos para a contratação). Assim
  como a seção Riscos (FR-047), esta seção segue o modelo de texto livre
  descritivo de FR-017 e é explicitamente não-gated: nenhum item dela é
  considerado nas pendências de elegibilidade do resumo executivo (FR-037),
  no gate exibido na barra de resumo/veredito (FR-041) ou na sugestão de
  avanço de estágio (FR-038) — a separação visual existe justamente para
  que o captador nunca confunda um item de pós-aprovação com um requisito
  da submissão em si.

  Decisão desta rodada: com a associação obrigatória de item de plano de
  submissão a um estágio do quadro de progresso (FR-033), avaliou-se se os
  itens de pós-aprovação deveriam, em vez de existir nesta seção à parte,
  virar itens do plano de submissão associados ao estágio terminal
  "Aprovado". Decisão: não — os estágios terminais (Aprovado, Não aprovado)
  ficam de fora, deliberadamente, da lista de estágios válidos para
  associação de item (FR-033), justamente porque representam o desfecho da
  submissão, não uma etapa de preparação em que ainda existe trabalho a
  fazer antes de avançar; um item de pós-aprovação não poderia ser
  associado a nenhum dos quatro estágios válidos sem passar uma mensagem
  errada (ex.: associá-lo a "Submetido" sugeriria que ele é exigido antes do
  resultado, o que não é o caso). Itens de pós-aprovação são conceitualmente
  distintos do plano de submissão — só passam a existir depois que o edital
  já chegou ao desfecho, não são um requisito para chegar lá — por isso
  continuam modelados como esta seção à parte, à margem do plano de
  submissão e não-gated, em vez de um grupo do plano associado a um
  estágio.

  Formalização dos FR-049 a FR-055 (esta rodada): comparando o protótipo da
  página de detalhe (User Story 5) com um artefato de referência real —
  `docs/submissions/timeline-submission-finep-digital.html`, gerado pela
  skill `fundraiser-submission-timeline` a partir do Regulamento de um
  edital FINEP real —, identificaram-se dez mecanismos do artefato de
  referência ainda não formalizados nesta spec (mais do que polimento
  visual: capacidades inteiras do modelo de dados). Os sete FRs a seguir
  formalizam esses mecanismos, já implementados e testados ao vivo no
  protótipo `prototype/avulsa-A042/`; FR-035, FR-041 e FR-047, acima, e
  FR-033, acima, já receberam as extensões pontuais correspondentes.
- **FR-049**: O sistema DEVE oferecer, na página de detalhe de um edital
  (FR-032), uma seção "Identificação do proponente" sempre visível,
  distinta dos dados do próprio edital (FR-001, FR-006, FR-007, FR-032) —
  ela é sobre quem está submetendo a proposta, não sobre o edital em si —,
  na qual o captador registra, em campos de texto editáveis, os dados da
  submissão: organização proponente (razão social), CNPJ, instituição
  parceira (quando houver) e responsável pela captação. Os quatro campos
  são opcionais e informativos, seguindo o mesmo princípio de texto livre
  não-gated de FR-047/FR-048: nenhum deles bloqueia a navegação, o gate de
  elegibilidade (FR-035, FR-038) ou qualquer exportação (FR-039, FR-040). Os
  valores preenchidos DEVEM ser preservados entre sessões (FR-055).
- **FR-050**: O sistema DEVE permitir que o captador associe a um item do
  plano de submissão (FR-033), opcionalmente, um campo estruturado de valor
  adicional — distinto da descrição do item (FR-033) e dos textos didáticos
  (FR-045) —, com um rótulo definido pelo captador e um tipo escolhido entre
  texto livre curto, data, data e hora, ou seleção de uma lista fechada de
  opções definida pelo captador (ex.: "Valor solicitado (R$)" como texto,
  "Data/hora planejada de envio" como data e hora, "Linha temática" como
  seleção). Quando presente, o valor preenchido pelo captador nesse campo é
  salvo e exibido junto ao item; sua ausência ou seu preenchimento nunca
  afetam o status Pendente/Concluído do item (FR-034) nem o cálculo de
  elegibilidade (FR-035, FR-038) — é registro de apoio, na mesma linha do
  responsável e da data de conclusão (FR-046).
- **FR-051**: O sistema DEVE permitir que o captador associe a um item do
  plano de submissão (FR-033), opcional e independentemente entre si: (a)
  um link para uma referência externa relacionada ao item (ex.: a lista de
  exclusão/impedimentos publicada por um financiador), exibido como um link
  clicável junto à descrição do item; e (b) uma observação em texto livre e
  longo, distinta do campo estruturado (FR-050) e dos textos didáticos
  (FR-045), para registrar contexto adicional (ex.: outras propostas em
  andamento relacionadas àquele item). Como os demais atributos opcionais do
  item (FR-045, FR-046, FR-050), nenhum dos dois afeta o status
  Pendente/Concluído (FR-034) ou o cálculo de elegibilidade (FR-035,
  FR-038).
- **FR-052**: O sistema DEVE permitir que o captador marque, de forma
  independente de qualquer outra marcação, um item do plano de submissão
  (FR-033), um sub-requisito de um item condicional (FR-053) ou um risco
  registrado (FR-047) com um indicador de "pergunta em aberto" — sinalizando
  que a exigência do edital-fonte correspondente é ambígua ou incerta e
  precisa de confirmação externa (ex.: junto ao financiador) antes de poder
  ser dada como de fato resolvida. Este indicador é independente de
  "essencial para elegibilidade" (FR-035) — um item pode carregar as duas
  marcações ao mesmo tempo, nenhuma delas, ou só uma — e não bloqueia, por
  si só, o status Pendente/Concluído do item (FR-034) nem o cálculo de
  elegibilidade (FR-035, FR-038): sinaliza incerteza para o captador
  confirmar, não impede a conclusão do item. A quantidade total de
  marcações ativas (itens, sub-requisitos e riscos) é contabilizada na
  barra de resumo/veredito (FR-041).
- **FR-053**: O sistema DEVE permitir que um item do plano de submissão
  (FR-033) seja cadastrado, alternativamente à estrutura padrão de um único
  checkbox, como uma escolha entre modalidades mutuamente exclusivas (ex.:
  natureza jurídica da organização proponente — pessoa jurídica com fins
  lucrativos ou organização da sociedade civil), cada modalidade revelando
  seu próprio subconjunto de sub-requisitos a cumprir, visível apenas depois
  de o captador escolher essa modalidade. Este item só é considerado
  "Concluído" (FR-034) quando uma modalidade foi escolhida E todos os
  sub-requisitos daquela modalidade estão marcados como cumpridos; escolher
  uma modalidade diferente troca o subconjunto de sub-requisitos exibido e
  considerado, sem misturar sub-requisitos de modalidades diferentes. Um
  item deste tipo participa do mesmo gate de sugestão de avanço de estágio
  (FR-038) que qualquer outro item, quando marcado como essencial para
  elegibilidade (FR-035) e associado ao estágio atual do edital (FR-033) —
  a condição "Concluído" usada por FR-038 é a definida aqui, não a de um
  checkbox simples.
- **FR-054**: O sistema DEVE permitir que um item do plano de submissão
  (FR-033) seja cadastrado, alternativamente, como uma escolha entre
  cenários mutuamente exclusivos (ex.: porte da organização proponente —
  pequeno, médio ou grande), sem sub-requisitos ramificados (distinto de
  FR-053), podendo carregar um ou mais campos de valor associados (ex.:
  faturamento anual), no mesmo espírito do campo estruturado de FR-050, mas
  como registro de apoio à escolha do cenário, não como condição para a
  conclusão do item. Este item é considerado "Concluído" (FR-034) assim que
  qualquer um dos cenários é escolhido, independentemente de os campos de
  apoio associados estarem ou não preenchidos. Como o item condicional de
  FR-053, um item de cenário participa normalmente do gate de sugestão de
  avanço de estágio (FR-038) quando marcado como essencial para
  elegibilidade (FR-035) e associado ao estágio atual do edital (FR-033) —
  usando este critério de "Concluído" (escolha feita), não o checkbox
  simples.
- **FR-055**: O sistema DEVE preservar, entre sessões do captador (ex.:
  fechar e reabrir o navegador, atualizar a página), os dados preenchidos na
  página de detalhe de um edital (FR-032) — identificação do proponente
  (FR-049), status e demais atributos de cada item do plano de submissão
  (FR-033 a FR-036, FR-045, FR-046, FR-050 a FR-054) e o estágio de
  acompanhamento do edital (FR-002) —, sem exigir que o captador crie uma
  conta ou faça login adicional além do já assumido para acessar o sistema
  (ver Assumptions). O mecanismo técnico de persistência (ex.: armazenamento
  local do navegador vs. persistência no servidor) fica em aberto para a
  fase de planejamento técnico; este requisito garante apenas o resultado
  observável pelo captador — o dado preenchido não se perde entre visitas.

### Key Entities

- **Edital (Chamada de Fomento)**: representa uma oportunidade de captação de
  recursos. Atributos obrigatórios: nome da chamada, descrição, instituição
  responsável, data de fechamento (prazo de submissão). Atributos opcionais:
  link para a chamada, data de abertura, documentação exigida, critérios de
  avaliação, riscos registrados (texto livre — FR-047) e itens de
  pós-aprovação/contratação (texto livre — FR-048). Relaciona-se com um
  estágio de acompanhamento (ver Estágio de Acompanhamento). Tem ainda um
  atributo de visibilidade independente do estágio — ignorado (sim/não,
  padrão não) — que, quando ativo, oculta o edital das visões padrão
  (tabela e quadro de progresso) sem alterar seu estágio de acompanhamento
  nem excluir seus dados (ver FR-027 a FR-030).
- **Identificação do Proponente**: representa os dados de quem está
  submetendo a proposta a um edital específico — distintos dos dados do
  próprio edital (ver Edital). Pertence a exatamente um edital, dentro da
  página de detalhe desse edital (FR-032, FR-049). Atributos, todos
  opcionais e informativos, nunca bloqueantes do gate de elegibilidade
  (FR-035, FR-038): organização proponente (razão social), CNPJ, instituição
  parceira (quando houver) e responsável pela captação.
- **Captador de Recursos**: pessoa responsável por identificar, avaliar e
  submeter propostas a editais de fomento em nome de uma organização
  proponente. É quem cadastra, acompanha e move os editais entre estágios.
- **Estágio de Acompanhamento**: representa em que ponto do processo de
  captação um edital se encontra, com sete valores possíveis, nesta ordem:
  Backlog, Elegibilidade, Em andamento, Validação, Submetido, Aprovado, Não
  aprovado. Os dois últimos são estágios terminais e mutuamente exclusivos
  entre si (nunca ambos ao mesmo tempo), registrando o resultado do edital
  junto ao financiador, mas não sequenciais um em relação ao outro (ver
  FR-002). Cada edital tem exatamente um estágio ativo por vez.
  "Elegibilidade" é o estágio em que o captador levanta e define os
  critérios/itens necessários para que a proposta seja elegível perante o
  edital (ver FR-002, FR-033).
- **Item do Plano de Submissão**: representa uma etapa ou documento
  necessário para viabilizar o envio da proposta de um edital específico,
  dentro da página de detalhe desse edital (FR-032). Atributos
  obrigatórios: descrição (texto livre, definida pelo captador), status
  (Pendente ou Concluído, padrão Pendente — FR-034), indicador de
  "essencial para elegibilidade" (sim/não, padrão não — FR-035), estágio
  associado do quadro de progresso (um dos quatro valores válidos —
  Elegibilidade, Em andamento, Validação ou Submetido — FR-033). Atributos
  opcionais: referência ao documento correspondente quando registrada
  (metadado em texto — nome do arquivo ou anotação de localização; não
  armazena o arquivo em si nesta feature, ver FR-036), paráfrase "Em outras
  palavras" e orientação "Como preencher" (texto livre, cada um — FR-045),
  responsável e data de conclusão (FR-046), campo estruturado opcional de
  valor (rótulo, tipo — texto/data/data e hora/seleção fechada — e o valor
  preenchido, FR-050), link externo opcional relacionado ao item (texto do
  link e URL, FR-051), observação livre opcional (texto longo, distinta do
  campo estruturado, FR-051), e indicador de "pergunta em aberto" opcional
  (sim/não, padrão não, FR-052). Pertence a exatamente um edital; não existe
  independentemente dele.

  Um item pode, alternativamente à estrutura padrão descrita acima (um
  único checkbox Pendente/Concluído), ser cadastrado como item condicional —
  com uma modalidade escolhida entre opções mutuamente exclusivas e um
  subconjunto de sub-requisitos por modalidade, cada sub-requisito com seu
  próprio indicador opcional de "pergunta em aberto" (FR-053) — ou como item
  de cenário — com um cenário escolhido entre opções mutuamente exclusivas e
  campos de apoio associados, sem sub-requisitos (FR-054). Em ambos os
  casos, o critério de "Concluído" (FR-034) segue a definição específica de
  FR-053 ou FR-054, não o checkbox simples.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um captador de recursos consegue visualizar todos os seus
  editais cadastrados, com dados essenciais (chamada, instituição, prazo de
  fechamento, link) e o estágio de acompanhamento de cada um, em uma única
  tela, sem precisar consultar fontes externas.
- **SC-002**: Um captador consegue cadastrar um novo edital com todos os
  dados obrigatórios (nome, instituição, descrição, data de fechamento) e,
  quando já disponíveis, os dados opcionais (link, data de abertura), em até
  5 minutos.
- **SC-003**: Um captador consegue mover um edital entre estágios do quadro
  de progresso em 3 ações ou menos.
- **SC-004**: 100% dos editais cadastrados exibem prazo de fechamento, de
  forma que o captador nunca precise recorrer a uma planilha ou anotação
  externa para saber quando um edital fecha; entre os editais que têm link
  cadastrado (campo opcional, FR-003), 100% exibem esse link acessível
  diretamente na tabela e no quadro de progresso.
- **SC-005**: Um captador identifica editais com prazo de fechamento já
  vencido em poucos segundos ao abrir a listagem ou o quadro de progresso,
  sem precisar comparar datas manualmente.
- **SC-006**: Um captador consegue corrigir um dado desatualizado de um
  edital (ex.: prazo prorrogado) e ver essa correção refletida
  imediatamente em ambas as visões (tabela e quadro de progresso).
- **SC-007**: Um captador consegue marcar como "Ignorado" um edital fora da
  área de atuação da sua organização, deixar de vê-lo na tabela e no quadro
  de progresso, e depois localizá-lo e desmarcá-lo, recuperando-o
  integralmente (dados e estágio) sem ter perdido nenhuma informação
  previamente registrada.
- **SC-008**: Um captador consegue montar e acompanhar o plano de submissão
  de um edital (adicionar itens, marcá-los como concluídos, marcar quais são
  essenciais para elegibilidade) e recebe uma sugestão clara de avanço no
  quadro de progresso assim que as condições são atendidas, sem precisar
  calcular manualmente se o edital já pode avançar de estágio.
- **SC-009**: Um captador consegue gerar, em poucos cliques, um PDF do
  resumo executivo e um PDF do plano de submissão de um edital, prontos para
  impressão e compartilhamento fora do sistema com quem precisa decidir ou
  acompanhar aquela submissão.

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
- Assume-se que a consistência de grafia do campo instituição responsável
  entre cadastros diferentes do mesmo captador é responsabilidade de quem
  cadastra (texto livre, FR-003); esta rodada da spec não introduz um FR de
  autocomplete/normalização de instituição. Risco identificado em teste de
  usabilidade: se o mesmo financiador for digitado de formas diferentes em
  cadastros diferentes (ex.: "Fundação X" vs. "Fundação X Ltda"), o filtro
  por instituição (FR-019) os trata como instituições distintas,
  fragmentando o agrupamento que o filtro deveria oferecer. Decisão de
  produto: não é um bug do protótipo atual (que só lê dados mockados já
  digitados de forma consistente) nem um requisito desta feature agora — é
  um risco estrutural de como a User Story 2 (ainda não implementada) vai
  tratar esse campo. Fica registrado aqui para reavaliação quando a User
  Story 2 for implementada (candidato natural: autocomplete a partir das
  instituições já cadastradas pelo mesmo captador), sem bloquear o
  fechamento desta spec nem virar FR condicional nesta rodada.
- Assume-se que "coordenador de pesquisa" (User Story 5) não é um ator do
  sistema nesta feature — ele não tem login nem acesso direto ao
  gerenciamento de editais, que permanece estritamente restrito ao captador
  que cadastrou cada edital (FR-015, FR-016). O resumo executivo é desenhado
  para ser útil a esse leitor, mas chega até ele por fora do sistema (ex.:
  PDF impresso ou enviado por e-mail pelo captador — FR-039), não por um
  acesso concedido dentro da aplicação. Colaboração multiusuário real (um
  coordenador de pesquisa logado, revisando editais dentro do sistema)
  permanece fora de escopo, na mesma linha de FR-016.
- Assume-se que o registro de documentos no plano de submissão (FR-036)
  cobre apenas o metadado (referência/nome do documento), não o envio e
  armazenamento do arquivo em si — o projeto ainda não tem uma stack de
  armazenamento de arquivo definida nesta fase (`app/` é um scaffold Django
  com SQLite em dev, sem serviço de storage configurado). Upload real de
  arquivo fica registrado aqui como candidato a uma feature futura, sem
  bloquear o fechamento desta rodada.
- Assume-se que o mecanismo técnico de geração dos PDFs de resumo executivo
  (FR-039) e de plano de submissão (FR-040) fica em aberto para a fase de
  planejamento técnico — esta spec não prescreve biblioteca ou serviço de
  geração.
