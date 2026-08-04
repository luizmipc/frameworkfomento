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

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acompanhar editais em um quadro de progresso (Priority: P1)

Um captador de recursos quer ver, em um único lugar, todos os editais que está
acompanhando (nome da chamada, descrição, instituição responsável, link para
a chamada e datas importantes) e quer saber, a qualquer momento, em que
estágio do seu processo de captação cada edital se encontra — ainda não
começou a trabalhar nele (Backlog), já está preparando a proposta (Em
andamento), está revisando antes de enviar (Validação), já enviou a proposta
ao financiador e aguarda o resultado (Submetido), ou já recebeu o resultado
— teve a proposta aceita (Aprovado) ou recusada (Não aprovado). Ele organiza
esse acompanhamento movendo cada edital entre essas seis colunas conforme
avança.

**Why this priority**: É o cenário de uso mais básico e imediatamente valioso
do gerenciamento de editais — sem ele, o captador não tem visão consolidada
do que precisa fazer nem prioriza corretamente seu tempo. Corresponde à
tarefa avulsa A001 já registrada no quadro do projeto.

**Independent Test**: Pode ser testado cadastrando dois ou três editais com
seus dados básicos, verificando que aparecem corretamente na listagem, e
movendo cada um entre as seis colunas do quadro de progresso — entrega
valor sozinho, mesmo sem as demais user stories implementadas.

**Acceptance Scenarios**:

1. **Given** existem editais cadastrados, **When** o captador acessa a tela
   de listagem, **Then** ele vê uma tabela com, no mínimo, nome da chamada,
   descrição, instituição responsável, link para a chamada e datas
   importantes (abertura e fechamento) de cada edital.
2. **Given** existem editais cadastrados, **When** o captador acessa a visão
   de quadro de progresso, **Then** ele vê cada edital representado como um
   cartão posicionado em uma das seis colunas (Backlog, Em andamento,
   Validação, Submetido, Aprovado, Não aprovado), de acordo com o estágio
   atual daquele edital.
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
6. **Given** o captador está na visão de quadro de progresso, **When** ele
   move um edital de uma coluna para outra, **Then** o cabeçalho de cada
   coluna afetada (origem e destino) atualiza imediatamente a quantidade de
   editais exibida naquela coluna, refletindo o novo total.
7. **Given** o captador acessa a tela de listagem em uma tela estreita (ex.:
   celular), **When** a largura disponível não comporta todas as colunas
   lado a lado, **Then** o sistema reorganiza a apresentação da tabela (sem
   ocultar nenhuma coluna) para manter nome da chamada, descrição,
   instituição responsável, link e datas legíveis e acessíveis; **and**,
   separadamente, na visão de quadro de progresso em uma resolução de
   desktop padrão, as seis colunas (Acceptance Scenario 2) permanecem
   visíveis lado a lado, sem exigir rolagem horizontal para comparar
   colunas.
8. **Given** um edital está na coluna "Submetido", **When** o captador
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
o edital para o próximo estágio do quadro de progresso.

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
progresso, adicionando itens ao plano de submissão, marcando um deles como
essencial para elegibilidade e concluindo-o, e confirmando que: a sugestão
de avanço aparece quando as condições são atendidas (e some quando deixam
de ser); o resumo executivo reflete as pendências de elegibilidade ainda
abertas; e tanto o resumo executivo quanto o plano de submissão podem ser
exportados em PDF.

**Acceptance Scenarios**:

1. **Given** um edital cadastrado aparece na tabela ou no quadro de
   progresso, **When** o captador aciona o ícone de lupa associado a esse
   edital, **Then** o sistema abre uma página de detalhe exclusiva daquele
   edital, exibindo seus dados já cadastrados (FR-001, FR-006, FR-007), o
   plano de submissão e o resumo executivo.
2. **Given** o captador está na página de detalhe de um edital, **When** ele
   adiciona um novo item ao plano de submissão informando uma descrição,
   **Then** o sistema salva o item com status "Pendente" e o exibe na lista
   do plano de submissão daquele edital.
3. **Given** um item do plano de submissão, **When** o captador marca esse
   item como "essencial para elegibilidade", **Then** o sistema passa a
   considerá-lo nas pendências de elegibilidade do resumo executivo enquanto
   ele permanecer "Pendente".
4. **Given** um item do plano de submissão em status "Pendente", **When** o
   captador registra a referência do documento correspondente (nome do
   arquivo ou anotação de onde ele está guardado, sem enviar o arquivo em
   si — FR-036), **Then** o sistema marca o item como "Concluído" e atualiza
   o progresso do plano de submissão exibido na página.
5. **Given** todos os itens marcados como "essenciais para elegibilidade" no
   plano de submissão de um edital estão "Concluído" (havendo ao menos um
   item essencial cadastrado) e o edital está no estágio "Em andamento",
   **When** o captador visualiza a página de detalhe, **Then** o sistema
   exibe uma sugestão visível para avançar o edital para "Validação" (ex.:
   "Habilitado para ir a Validação"), com uma ação que, ao ser acionada,
   move o edital para esse estágio (FR-009, FR-010).
6. **Given** 100% dos itens do plano de submissão de um edital (essenciais e
   não essenciais) estão "Concluído" (havendo ao menos um item cadastrado) e
   o edital está no estágio "Validação", **When** o captador visualiza a
   página de detalhe, **Then** o sistema exibe uma sugestão para avançar o
   edital para "Submetido", com a mesma ação de um clique.
7. **Given** uma sugestão de avanço está sendo exibida, **When** o captador
   desmarca um item já "Concluído" (reduzindo o progresso do plano de
   submissão abaixo do limiar aplicável), **Then** a sugestão deixa de ser
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
  intermediárias como Em andamento, Validação ou Submetido? Resolução: é
  permitido — a movimentação entre colunas do quadro de progresso continua
  livre e sem guarda de ordem (FR-002, FR-009), incluindo alcançar
  diretamente qualquer um dos três novos estágios (Submetido, Aprovado, Não
  aprovado) a partir de qualquer coluna anterior, sem exigir passagem prévia
  por Submetido.
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
  cadastrado, ou sem nenhum item marcado como "essencial para
  elegibilidade"? Resolução: a sugestão de avanço de estágio (FR-038) exige
  ao menos um item essencial concluído (para sugerir a transição Em
  andamento → Validação) ou ao menos um item cadastrado com 100% concluído
  (para sugerir a transição Validação → Submetido) — em nenhum dos dois
  casos a ausência de itens satisfaz a condição por vacuidade, então a
  sugestão simplesmente não aparece até existir conteúdo real no plano de
  submissão.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir, para o captador de recursos, uma
  listagem em formato de tabela com todos os seus editais cadastrados,
  mostrando ao menos: nome da chamada, descrição, instituição responsável,
  link para a chamada e datas importantes (abertura e fechamento).
- **FR-002**: O sistema DEVE oferecer, além da tabela, uma visão de quadro de
  progresso (kanban) com exatamente seis colunas, nesta ordem: Backlog, Em
  andamento, Validação, Submetido, Aprovado e Não aprovado. As duas últimas
  são estágios terminais que registram o resultado do edital junto ao
  financiador — mutuamente exclusivos entre si (um edital tem exatamente um
  estágio ativo por vez, nunca os dois ao mesmo tempo) e não sequenciais um
  em relação ao outro (não existe uma ordem entre Aprovado e Não aprovado;
  ambos representam o mesmo momento do processo — o desfecho da submissão —
  sob dois resultados possíveis). Decisão de produto sobre a movimentação
  entre colunas: este requisito não introduz nenhuma guarda de ordem nova —
  a transição entre as seis colunas permanece totalmente livre em qualquer
  direção, incluindo alcançar Aprovado/Não aprovado a partir de qualquer
  coluna, não só de Submetido (ver FR-009, que já cobria esse princípio para
  o modelo de quatro colunas e passa a cobrir as seis). Justificativa: o
  protótipo de referência (`prototype/avulsa-A001/`) já implementa
  transição livre sem nenhuma trava entre colunas, e passar a exigir Submetido
  como pré-requisito de Aprovado/Não aprovado seria uma restrição nova, não
  pedida pelo usuário, que bloquearia correções manuais legítimas (ex.: o
  captador marca Aprovado/Não aprovado por engano, ou o edital é reaberto
  para nova rodada de avaliação e precisa voltar para Validação).
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
  quaisquer das seis colunas do quadro de progresso (FR-002), em qualquer
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
  de Acompanhamento — não é um sétimo estágio do quadro de progresso, que
  continua com exatamente seis colunas (FR-002). Justificativa de produto:
  cobre o caso de um edital que o captador
  cadastrou como candidato antes de avaliá-lo a fundo e, após avaliar,
  concluiu que não tem a ver com a área de atuação da sua organização — ele
  quer registrar que já avaliou e descartou aquele edital especificamente,
  para não precisar reavaliá-lo do zero caso ele ressurja (ex.: divulgado de
  novo por outro canal), o que a exclusão definitiva (FR-014) não permite
  preservar. Uma sétima coluna foi considerada e descartada porque
  "ignorado" não é um estágio do processo de captação (o edital não avança
  nem retrocede por ser ignorado) — é sobre o captador não querer ver aquele
  item agora, o que é melhor modelado como um estado de visibilidade
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
  liga-desliga, não como uma sétima coluna do quadro de progresso (FR-002
  permanece com exatamente seis colunas) e não como uma rota/tela
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
  qualquer coluna. No quadro de progresso, as seis colunas (FR-002) DEVEM
  permanecer visíveis lado a lado em resoluções de desktop padrão, sem exigir
  rolagem horizontal. Este requisito é tratado como FR separado de FR-001/
  FR-002 (e não uma extensão deles) porque cobre um sinal distinto —
  usabilidade da apresentação através de diferentes tamanhos de tela, não a
  existência dos dados/colunas em si, que FR-001/FR-002 já garantem. Ver
  Acceptance Scenario 7 de User Story 1. Formalização de um comportamento já
  implementado e confirmado ao vivo no protótipo `prototype/avulsa-A001/`
  (tasks A002 e A003 do quadro do projeto), que nunca havia sido registrado
  como requisito.
- **FR-032**: O sistema DEVE oferecer, a partir de cada edital exibido na
  tabela (FR-001) e no quadro de progresso (FR-002), um ícone de lupa que
  leva o captador a uma página de detalhe exclusiva daquele edital, reunindo
  os dados já cadastrados (FR-001, FR-006, FR-007), o plano de submissão
  (FR-033 a FR-036), a sugestão de avanço no quadro de progresso quando
  aplicável (FR-038) e o resumo executivo (FR-037).
- **FR-033**: O sistema DEVE permitir que o captador adicione, na página de
  detalhe de um edital, itens ao plano de submissão daquele edital, cada um
  com uma descrição em texto informada pelo captador (ex.: "Balanço
  assinado pelo contador", "Anuência da ICT parceira"). Cada item recém-
  adicionado começa com status "Pendente" (FR-034). Decisão de escopo: o
  plano de submissão desta feature é uma lista plana de itens definida
  manualmente pelo captador, sem fases/etapas pré-estruturadas específicas
  de cada edital — formalizar fases exigiria um modelo configurável por
  edital que não foi pedido nesta rodada; documentação exigida (FR-006) e
  critérios de avaliação (FR-007) continuam sendo a referência de conteúdo
  que o captador consulta para decidir quais itens criar. Este FR não
  reabre FR-017: documentação exigida e critérios de avaliação continuam
  sendo texto livre, sem controle individual de status — o plano de
  submissão é uma lista separada e adicional, específica desta página de
  detalhe, não uma reinterpretação desses dois campos.
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
  status.
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
  progresso (FR-002) quando as seguintes condições, mensuráveis a partir do
  plano de submissão, forem atendidas: (a) de "Em andamento" para
  "Validação" — existe pelo menos um item marcado como "essencial para
  elegibilidade" (FR-035) e todos os itens essenciais estão "Concluído"
  (FR-034); (b) de "Validação" para "Submetido" — existe pelo menos um item
  cadastrado no plano de submissão e 100% dos itens (essenciais e não
  essenciais) estão "Concluído". Em nenhum dos dois casos a ausência de
  itens satisfaz a condição por vacuidade (ver Edge Cases). A sugestão inclui
  uma ação que, ao ser acionada, move o edital para o estágio sugerido,
  usando o mesmo mecanismo de FR-009/FR-010, e desaparece imediatamente se o
  progresso do plano de submissão cair abaixo do limiar aplicável (ex.: o
  captador desmarca um item já concluído), sem mover automaticamente o
  edital de volta a um estágio anterior. Decisão de escopo: esta sugestão
  cobre apenas as transições Em andamento→Validação e Validação→Submetido,
  as duas em que o progresso do plano de submissão tem relação direta e
  mensurável com o momento de avançar; os demais estágios (Backlog,
  Submetido→Aprovado/Não aprovado) dependem de decisões que o plano de
  submissão não modela (início de trabalho, resultado do financiador) e
  permanecem fora do mecanismo de sugestão. O pedido original também
  mencionava uma sugestão para "retroceder" — decisão de produto: não é
  formalizada como um mecanismo novo porque mover um edital para qualquer
  coluna anterior já é livre e sem guarda de ordem hoje (FR-009); uma
  sugestão condicional ao progresso do plano de submissão faria sentido
  apenas para avançar, nunca para retroceder.
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

### Key Entities

- **Edital (Chamada de Fomento)**: representa uma oportunidade de captação de
  recursos. Atributos obrigatórios: nome da chamada, descrição, instituição
  responsável, data de fechamento (prazo de submissão). Atributos opcionais:
  link para a chamada, data de abertura, documentação exigida e critérios de
  avaliação. Relaciona-se com um estágio de acompanhamento (ver Estágio de
  Acompanhamento). Tem ainda um atributo de visibilidade independente do
  estágio — ignorado (sim/não, padrão não) — que, quando ativo, oculta o
  edital das visões padrão (tabela e quadro de progresso) sem alterar seu
  estágio de acompanhamento nem excluir seus dados (ver FR-027 a FR-030).
- **Captador de Recursos**: pessoa responsável por identificar, avaliar e
  submeter propostas a editais de fomento em nome de uma organização
  proponente. É quem cadastra, acompanha e move os editais entre estágios.
- **Estágio de Acompanhamento**: representa em que ponto do processo de
  captação um edital se encontra, com seis valores possíveis, nesta ordem:
  Backlog, Em andamento, Validação, Submetido, Aprovado, Não aprovado. Os
  dois últimos são estágios terminais e mutuamente exclusivos entre si
  (nunca ambos ao mesmo tempo), registrando o resultado do edital junto ao
  financiador, mas não sequenciais um em relação ao outro (ver FR-002).
  Cada edital tem exatamente um estágio ativo por vez.
- **Item do Plano de Submissão**: representa uma etapa ou documento
  necessário para viabilizar o envio da proposta de um edital específico,
  dentro da página de detalhe desse edital (FR-032). Atributos: descrição
  (texto livre, definida pelo captador), status (Pendente ou Concluído,
  padrão Pendente — FR-034), indicador de "essencial para elegibilidade"
  (sim/não, padrão não — FR-035), e referência ao documento correspondente
  quando registrada (metadado em texto — nome do arquivo ou anotação de
  localização; não armazena o arquivo em si nesta feature, ver FR-036).
  Pertence a exatamente um edital; não existe independentemente dele.

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
