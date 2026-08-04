// Protótipo não-funcional — task A001
// Dados mockados em memória; nenhuma chamada de API real, nenhuma persistência.

// A038 / FR-002: "Concluído" virou 3 estágios terminais mutuamente exclusivos
// (Submetido → Aprovado / Não aprovado), resolvendo a ambiguidade da A036
// ("submetido" vs. "resultado já saiu"). Transição continua livre entre
// quaisquer colunas (sem guarda), mesmo comportamento de antes.
const STATUSES = ["backlog", "andamento", "validacao", "submetido", "aprovado", "nao_aprovado"];

// A039 (docs/persona/avulsa-A001.html#dor-4): Aprovado e Não aprovado são dois
// desfechos terminais mutuamente exclusivos, sem ordem entre si — a seta "→"
// (que sugere avanço sequencial do funil) não deve ficar habilitada em
// nenhum dos dois. A correção manual entre eles continua livre via
// drag-and-drop, que já permite soltar em qualquer coluna.
const ESTAGIOS_TERMINAIS_FUNIL = ["aprovado", "nao_aprovado"];

// A040 (docs/persona/avulsa-A001.html#dor-5): nos três estágios terminais o
// processo com o financiador já se encerrou — data_fechamento vencida vira
// dado histórico, não risco. Usado para não exibir o selo "Vencido" nesses
// casos (ver isVencido abaixo).
const ESTAGIOS_CONCLUIDOS = ["submetido", "aprovado", "nao_aprovado"];

const editais = [
  {
    id: "e1",
    chamada: "Chamada Pública Inovação Social 2026",
    descricao: "Apoio a projetos de inovação social voltados à redução de desigualdades regionais.",
    instituicao: "CNPq (fictício)",
    abertura: "2026-06-01",
    // A011: ajustado para cair no nível de proximidade "até 7 dias" (FR-022).
    fechamento: "2026-08-05",
    link: "https://exemplo.gov.br/chamadas/inovacao-social-2026",
    status: "backlog",
  },
  {
    id: "e2",
    chamada: "Edital Pesquisa Aplicada em Sustentabilidade",
    descricao: "Financiamento de pesquisas aplicadas com foco em transição energética e sustentabilidade.",
    instituicao: "FAPESP (fictício)",
    // A017 / FR-004 + Assumptions: data de abertura é opcional no cadastro —
    // este edital mockado fica sem ela de propósito, para demonstrar o
    // fallback. "" (em vez de omitir a chave) mantém o mesmo formato de
    // objeto em todos os itens da lista, mesmo raciocínio do link vazio do
    // e5 (A016). Fechamento continua obrigatório (FR-005), não muda.
    abertura: "",
    fechamento: "2026-09-15",
    link: "https://exemplo.org/editais/sustentabilidade",
    status: "andamento",
  },
  {
    id: "e3",
    chamada: "Programa de Fomento a Startups de Impacto",
    descricao: "Aporte não reembolsável para startups em estágio inicial com impacto socioambiental comprovado.",
    instituicao: "BNDES (fictício)",
    abertura: "2026-07-01",
    fechamento: "2026-10-01",
    link: "https://exemplo.com.br/fomento/startups-impacto",
    status: "validacao",
  },
  {
    id: "e4",
    chamada: "Chamada de Extensão Universitária Comunitária",
    descricao: "Apoio a projetos de extensão universitária desenvolvidos junto a comunidades vulneráveis.",
    instituicao: "CAPES (fictício)",
    abertura: "2026-04-10",
    fechamento: "2026-06-15",
    link: "https://exemplo.edu.br/extensao/comunitaria",
    // A038 / FR-002: proposta já foi enviada ao financiador, resultado ainda
    // não saiu — era "concluido" antes da 3ª coluna terminal existir.
    status: "submetido",
  },
  {
    id: "e6",
    chamada: "Edital de Pesquisa em Saúde Digital",
    descricao: "Financiamento de soluções digitais para ampliar acesso a serviços de saúde em regiões remotas.",
    instituicao: "FAPESP (fictício)",
    abertura: "2026-02-01",
    fechamento: "2026-04-30",
    link: "https://exemplo.org/editais/saude-digital",
    // A038 / FR-002: resultado saiu e a proposta foi aprovada pelo financiador.
    status: "aprovado",
  },
  {
    id: "e7",
    chamada: "Programa de Bolsas para Pesquisa em Biodiversidade",
    descricao: "Apoio a pesquisas de campo sobre conservação da biodiversidade em biomas brasileiros.",
    instituicao: "CNPq (fictício)",
    abertura: "2026-01-15",
    fechamento: "2026-03-20",
    link: "https://exemplo.gov.br/chamadas/biodiversidade",
    // A038 / FR-002: resultado saiu e a proposta não foi aprovada.
    status: "nao_aprovado",
  },
  {
    id: "e5",
    chamada: "Edital de Cultura e Patrimônio Digital",
    descricao: "Recursos para digitalização e preservação de acervos culturais e patrimônio histórico.",
    instituicao: "Fundação Cultural Exemplo (fictício)",
    abertura: "2026-06-20",
    // A011: ajustado para cair no nível de proximidade "até 21 dias" (FR-022).
    fechamento: "2026-08-19",
    // A016 / FR-003: link agora é opcional no cadastro — este edital mockado
    // fica sem link de propósito, para demonstrar o fallback. "" (em vez de
    // omitir a chave) mantém o mesmo formato de objeto em todos os itens da
    // lista, mais fácil de escanear.
    link: "",
    status: "backlog",
    // A018 / FR-027: mockado como ignorado de propósito — fora da área de
    // atuação do captador — para demonstrar a visão "somente ignorados"
    // (FR-029) já com um item nela, sem precisar clicar em nada primeiro.
    // O estágio ("backlog") não muda por estar ignorado (FR-030).
    ignorado: true,
  },
];

// A038 / FR-002: resolve a A036 (docs/persona/avulsa-A001.html#dor-2) —
// "Concluído" misturava "proposta submetida" e "resultado do edital já saiu"
// sem distinção. Agora são 3 estágios terminais mutuamente exclusivos.
const STATUS_LABEL = {
  backlog: "Backlog",
  andamento: "Em andamento",
  validacao: "Validação",
  submetido: "Submetido",
  aprovado: "Aprovado",
  nao_aprovado: "Não aprovado",
};

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// FR-011: prazo vencido = fechamento antes de hoje. Datas mockadas são
// YYYY-MM-DD, então comparar como string com a data de hoje (mesmo formato)
// já ordena corretamente, sem precisar de objetos Date.
function isVencido(fechamentoISO) {
  const hojeISO = new Date().toISOString().slice(0, 10);
  return fechamentoISO < hojeISO;
}

// FR-022 / A011: prazo próximo (mas não vencido), em quatro níveis — até 7,
// 14, 21 ou 30 dias. Retorna o nível mais urgente aplicável (o menor limiar
// que ainda comporta os dias restantes), ou null se vencido ou fora de todos
// os níveis. Precisa da diferença em dias (não só comparação lexicográfica
// como em isVencido), então usa Date aqui.
const NIVEIS_PROXIMIDADE = [7, 14, 21, 30];

function nivelProximidade(fechamentoISO) {
  if (isVencido(fechamentoISO)) return null;
  const hoje = new Date(new Date().toISOString().slice(0, 10));
  const fechamento = new Date(fechamentoISO);
  const diasRestantes = Math.round((fechamento - hoje) / 86400000);
  return NIVEIS_PROXIMIDADE.find((limite) => diasRestantes <= limite) ?? null;
}

// A012: remove acentos antes de comparar, para que "inovacao" encontre
// "Inovação". NFD separa a letra do diacrítico (combining mark); o regex
// remove só os diacríticos (faixa Unicode U+0300 a U+036F), sem depender
// de nenhuma biblioteca.
function normalizeText(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// --- Busca + filtro compartilhados (US4 / FR-018, FR-019) ---
const searchInput = document.getElementById("search-input");
const instFilter = document.getElementById("inst-filter");
const sortFechamento = document.getElementById("sort-fechamento");
const filterIndicator = document.getElementById("filter-indicator");
const filterSummary = document.getElementById("filter-summary");
const clearFiltersBtn = document.getElementById("clear-filters");
const editalCount = document.getElementById("edital-count");
// A018 / FR-027..FR-030: segmented control "Ativos" / "Ignorados" — troca o
// universo exibido nas duas visões entre os dois conjuntos nomeados
// (padrão "ativos"), reaproveitando o mesmo pipeline de busca/filtro/
// contagem do US4 em vez de uma tela/rota separada. Estado vive em
// `mostrarIgnorados` (não num checkbox) porque é uma troca de contexto
// entre dois conjuntos, não uma propriedade liga/desliga — ver lição em
// .claude/agents/designer.md (2026-07-31).
const segmentAtivos = document.getElementById("segment-ativos");
const segmentIgnorados = document.getElementById("segment-ignorados");
const ignoradosCount = document.getElementById("ignorados-count");
let mostrarIgnorados = false;

function setMostrarIgnorados(valor) {
  mostrarIgnorados = valor;
  segmentAtivos.classList.toggle("active", !valor);
  segmentAtivos.setAttribute("aria-pressed", String(!valor));
  segmentIgnorados.classList.toggle("active", valor);
  segmentIgnorados.setAttribute("aria-pressed", String(valor));
  applyFilters();
}

segmentAtivos.addEventListener("click", () => setMostrarIgnorados(false));
segmentIgnorados.addEventListener("click", () => setMostrarIgnorados(true));

// Opções do filtro de instituição vêm dos dados mockados — sem lista fixa.
[...new Set(editais.map((e) => e.instituicao))].sort().forEach((inst) => {
  const opt = document.createElement("option");
  opt.value = inst;
  opt.textContent = inst;
  instFilter.appendChild(opt);
});

// A018 / FR-028: por padrão (toggle desmarcado) só editais NÃO ignorados
// entram no universo filtrado — de tabela, kanban e das contagens, todas
// derivadas de getFiltered(). Marcar o toggle inverte para "somente
// ignorados" (FR-029), sem precisar de uma lista/estado separado.
function getFiltered() {
  const termo = normalizeText(searchInput.value.trim());
  const inst = instFilter.value;
  const wantIgnorados = mostrarIgnorados;
  return editais.filter(
    (e) =>
      Boolean(e.ignorado) === wantIgnorados &&
      (!termo || normalizeText(e.chamada).includes(termo)) &&
      (!inst || e.instituicao === inst)
  );
}

// A013: existe busca, filtro de instituição e/ou a visão "Ignorados" em
// uso agora? Usado tanto pelo indicador quanto pela mensagem de coluna
// vazia do kanban (A014).
function isFilterActive() {
  return Boolean(searchInput.value.trim() || instFilter.value || mostrarIgnorados);
}

// A013/A018: atualiza a linha "Filtrando por: … · Limpar filtros",
// escondendo-a por completo (.hidden) quando não há busca, filtro de
// instituição nem a visão "Ignorados" ativa.
function updateFilterIndicator() {
  const termo = searchInput.value.trim();
  const inst = instFilter.value;
  const partes = [];
  if (mostrarIgnorados) partes.push("somente ignorados");
  if (termo) partes.push(`busca "${termo}"`);
  if (inst) partes.push(`instituição "${inst}"`);
  filterIndicator.classList.toggle("hidden", partes.length === 0);
  filterSummary.textContent = partes.length ? `Filtrando por: ${partes.join(" e ")}` : "";
}

// A018: contagem de editais ignorados, sempre visível junto do toggle
// (mesmo padrão do contador por coluna do kanban, A009), para o captador
// saber que há algo para ver ali antes mesmo de marcar a caixa.
function updateIgnoradosCount() {
  ignoradosCount.textContent = `(${editais.filter((e) => e.ignorado).length})`;
}

function byFechamento(a, b) {
  return a.fechamento < b.fechamento ? -1 : a.fechamento > b.fechamento ? 1 : 0;
}

// FR-023 / A015: total geral quando não há busca/filtro ativo, total já
// filtrado (getFiltered().length) quando há — nunca soma manual de coluna
// nem contagem de linha por conta do captador.
function updateEditalCount() {
  const total = getFiltered().length;
  const rotulo = total === 1 ? "edital exibido" : "editais exibidos";
  editalCount.textContent = `${total} ${rotulo}`;
}

// Reaplica busca/filtro nas duas visões + no indicador de cima, sempre juntos
// (US4): tabela e kanban compartilham a mesma barra de controles.
function applyFilters() {
  updateFilterIndicator();
  updateEditalCount();
  updateIgnoradosCount();
  renderTabela();
  renderKanban();
}

[searchInput, instFilter].forEach((el) => el.addEventListener("input", applyFilters));
sortFechamento.addEventListener("change", renderTabela);
clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  instFilter.value = "";
  // FR-025/FR-029: "Limpar filtros" reseta busca e filtro de instituição
  // apenas — o toggle Ativos/Ignorados é uma dimensão de visão separada e
  // nunca é resetado por este botão (spec.md, Acceptance Scenario 9 de
  // User Story 4). Chama applyFilters diretamente, sem tocar em
  // mostrarIgnorados/no segmented control.
  applyFilters();
});

// A035 (docs/persona/avulsa-A001.html#dor-1): feedback textual imediato ao
// ignorar/reverter — antes só o contador "Ignorados (N)" mudava, fora do
// fluxo de onde o clique aconteceu. Toast simples (sem dependência nova):
// some sozinho após alguns segundos, não bloqueia interação (não é
// alert/confirm). #toast já tem aria-live="polite" no HTML.
const toastEl = document.getElementById("toast");
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 2500);
}

// A018 / FR-027/FR-030: marca/desmarca um edital como ignorado — o estágio
// (edital.status) não é tocado, só o atributo ortogonal `ignorado`.
// applyFilters() reaplica o mesmo pipeline de getFiltered(), então o item
// some da visão atual (e reaparece na outra) sem lógica extra de remoção.
function toggleIgnorado(id) {
  const edital = editais.find((e) => e.id === id);
  if (!edital) return;
  edital.ignorado = !edital.ignorado;
  showToast(edital.ignorado ? "Edital movido para Ignorados" : "Edital revertido para Ativos");
  applyFilters();
}

// --- Visão tabela ---
function renderTabela() {
  const corpo = document.getElementById("tabela-corpo");
  corpo.innerHTML = "";
  const lista = getFiltered().sort(byFechamento);
  if (sortFechamento.value === "desc") lista.reverse();
  if (lista.length === 0) {
    corpo.innerHTML = '<tr><td colspan="8" class="empty-state">Nenhum edital encontrado com esses critérios.</td></tr>';
    return;
  }
  lista.forEach((edital) => {
    const tr = document.createElement("tr");
    // A040: em estágio terminal, o fechamento vencido já não é mais um risco
    // — é dado histórico do processo encerrado — então não conta como vencido
    // para fins de badge/borda vermelha.
    const vencido = isVencido(edital.fechamento) && !ESTAGIOS_CONCLUIDOS.includes(edital.status);
    // FR-022: badge de prazo próximo só se aplica a editais ainda não vencidos
    // — vencido (FR-011) tem precedência e exclui o cálculo de nível.
    const nivel = vencido ? null : nivelProximidade(edital.fechamento);
    tr.classList.toggle("vencido", vencido);
    tr.classList.toggle("proximo", !vencido && nivel !== null);
    // A018: linha só existe na visão "somente ignorados" ou "ativos" nunca as
    // duas ao mesmo tempo (getFiltered() já separa por edital.ignorado), mas
    // marca a classe a partir do dado em si, não do estado do toggle.
    tr.classList.toggle("ignorado", Boolean(edital.ignorado));
    let badgePrazo = "";
    if (vencido) badgePrazo = ' <span class="badge-vencido">Vencido</span>';
    else if (nivel !== null) badgePrazo = ` <span class="badge-proximo">Vence em até ${nivel} dias</span>`;
    // A016 / FR-003: link é opcional (cadastro pode não ter link) — sem ele,
    // nada de <a href> apontando para lugar nenhum, só um texto neutro.
    // A017 / FR-004: mesmo raciocínio para abertura, o único outro campo que
    // a spec declara opcional (Assumptions) — .field-missing é o mesmo
    // estado visual "campo ausente" usado pelos dois casos.
    // Ordem prioriza as colunas decisivas para priorização (Fechamento, Abertura, Link)
    // logo após o identificador (Chamada); Instituição/Descrição, menos decisivas, ficam por
    // último. Os data-label alimentam o layout empilhado em telas estreitas (ver style.css).
    tr.innerHTML = `
      <td data-label="Chamada">${edital.chamada}</td>
      <td data-label="Estágio"><span class="badge-estagio">${STATUS_LABEL[edital.status]}</span></td>
      <td data-label="Fechamento">${formatDate(edital.fechamento)}${badgePrazo}</td>
      <td data-label="Abertura">${
        edital.abertura
          ? formatDate(edital.abertura)
          : '<span class="field-missing">Abertura não informada</span>'
      }</td>
      <td data-label="Link">${
        edital.link
          ? `<a href="${edital.link}" target="_blank" rel="noopener">Ver chamada</a>`
          : '<span class="field-missing">Link não informado</span>'
      }</td>
      <td data-label="Instituição">${edital.instituicao}</td>
      <td data-label="Descrição">${edital.descricao}</td>
      <td data-label="Ações">
        <button type="button" class="ignore-btn" data-id="${edital.id}">${
          edital.ignorado ? "Reverter" : "Ignorar"
        }</button>
      </td>
    `;
    corpo.appendChild(tr);
  });
}

// A018 / FR-027: delegação de clique no corpo da tabela — mesmo padrão já
// usado para os botões de mover no board (ver listener de #board abaixo).
document.getElementById("tabela-corpo").addEventListener("click", (event) => {
  const btn = event.target.closest(".ignore-btn");
  if (!btn) return;
  toggleIgnorado(btn.dataset.id);
});

// --- Visão kanban ---
const cardTemplate = document.getElementById("card-template");

function renderKanban() {
  const filtrados = getFiltered();

  STATUSES.forEach((status) => {
    const list = document.querySelector(`.card-list[data-status="${status}"]`);
    list.innerHTML = "";

    // FR-021: dentro da coluna, ordenação automática por proximidade do
    // fechamento — critério secundário ao agrupamento por estágio, sem
    // controle visível (não usa o toggle de ordenação da visão Tabela).
    const doStatus = filtrados.filter((e) => e.status === status).sort(byFechamento);

    // A009: contador de editais por coluna, recalculado a cada render.
    document.querySelector(`.col-count[data-status="${status}"]`).textContent = `(${doStatus.length})`;

    // A014: coluna vazia por causa do filtro atual (não por não ter nenhum
    // edital nesse estágio) — mesma mensagem da visão Tabela (A010), para
    // não parecer que a coluna sumiu ou quebrou.
    if (doStatus.length === 0 && isFilterActive()) {
      list.innerHTML = '<p class="empty-state">Nenhum edital encontrado com esses critérios.</p>';
    }

    doStatus.forEach((edital) => {
      const node = cardTemplate.content.cloneNode(true);
      const card = node.querySelector(".card");
      card.dataset.id = edital.id;
      card.querySelector(".card-title").textContent = edital.chamada;
      card.querySelector(".card-inst").textContent = edital.instituicao;
      // A017 / FR-004: mesmo fallback da tabela para abertura ausente — usa
      // innerHTML (em vez de textContent) só aqui para poder aplicar
      // .field-missing na parte do texto que falta, mesma classe do estado
      // "campo ausente" já usado para link (A016).
      card.querySelector(".card-dates").innerHTML = edital.abertura
        ? `${formatDate(edital.abertura)} — ${formatDate(edital.fechamento)}`
        : `<span class="field-missing">Abertura não informada</span> — ${formatDate(edital.fechamento)}`;
      // A040: mesma regra da tabela — vencido não conta em estágio terminal.
      const vencido = isVencido(edital.fechamento) && !ESTAGIOS_CONCLUIDOS.includes(edital.status);
      // FR-022: mesma precedência da tabela — só calcula nível se não vencido.
      const nivel = vencido ? null : nivelProximidade(edital.fechamento);
      card.classList.toggle("vencido", vencido);
      card.classList.toggle("proximo", !vencido && nivel !== null);
      card.querySelector(".card-vencido-badge").classList.toggle("hidden", !vencido);
      const badgeProximo = card.querySelector(".card-proximo-badge");
      badgeProximo.classList.toggle("hidden", nivel === null);
      if (nivel !== null) badgeProximo.textContent = `Vence em até ${nivel} dias`;
      // A016 / FR-003: mesma regra da tabela — sem link, esconde a âncora
      // "Ver chamada" e mostra o texto de fallback no lugar dela.
      const cardLink = card.querySelector(".card-link");
      const cardLinkMissing = card.querySelector(".card-link-missing");
      cardLink.classList.toggle("hidden", !edital.link);
      cardLinkMissing.classList.toggle("hidden", Boolean(edital.link));
      if (edital.link) cardLink.href = edital.link;
      // A018 / FR-027/FR-030: mesma ação/rótulo da tabela.
      card.classList.toggle("ignorado", Boolean(edital.ignorado));
      card.querySelector(".ignore-btn").textContent = edital.ignorado ? "Reverter" : "Ignorar";
      list.appendChild(node);
    });
  });

  updateMoveButtons();
}

function updateMoveButtons() {
  document.querySelectorAll(".card").forEach((card) => {
    const edital = editais.find((e) => e.id === card.dataset.id);
    const idx = STATUSES.indexOf(edital.status);
    card.querySelector('[data-dir="-1"]').disabled = idx === 0;
    // A039: além do último índice de STATUSES, qualquer estágio terminal do
    // funil (Aprovado/Não aprovado) desabilita "→" — não há um "próximo"
    // entre os dois.
    card.querySelector('[data-dir="1"]').disabled =
      idx === STATUSES.length - 1 || ESTAGIOS_TERMINAIS_FUNIL.includes(edital.status);
  });
}

// A020 / FR-010: move o edital e re-renderiza as DUAS visões — antes só
// renderKanban() era chamado aqui, o que deixava a tabela sem meio de
// mostrar a mudança de estágio feita pelo quadro (ver
// docs/qa-report/avulsa-A001.html#fr-010: a tabela não tinha nenhum
// indicador de estágio, então FR-010 não era observável a partir dela).
// Ainda em aberto: spec.md não deixa explícito se um indicador visível na
// tabela é exigido por FR-010 ou se "sincronizado" cobria só o dado
// subjacente (que já era consistente antes desta mudança) — decisão
// tomada aqui é a interpretação de menor risco, pendente de confirmação
// do product-owner.
function moveEdital(id, newStatus) {
  const edital = editais.find((e) => e.id === id);
  if (!edital) return;
  edital.status = newStatus;
  renderKanban();
  renderTabela();
}

// Clique nos botões de mover (acessível, sem depender de drag-and-drop)
document.getElementById("board").addEventListener("click", (event) => {
  const moveBtn = event.target.closest(".move-btn");
  if (moveBtn) {
    const card = moveBtn.closest(".card");
    const edital = editais.find((e) => e.id === card.dataset.id);
    const idx = STATUSES.indexOf(edital.status);
    const newIdx = idx + Number(moveBtn.dataset.dir);
    if (newIdx >= 0 && newIdx < STATUSES.length) {
      moveEdital(edital.id, STATUSES[newIdx]);
    }
    return;
  }
  // A018 / FR-027: mesma ação do botão "Ignorar"/"Reverter" da tabela.
  const ignoreBtn = event.target.closest(".ignore-btn");
  if (ignoreBtn) {
    const card = ignoreBtn.closest(".card");
    toggleIgnorado(card.dataset.id);
  }
});

// Drag-and-drop simples entre colunas
document.getElementById("board").addEventListener("dragstart", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  event.dataTransfer.setData("text/plain", card.dataset.id);
  card.classList.add("dragging");
});

document.getElementById("board").addEventListener("dragend", (event) => {
  const card = event.target.closest(".card");
  if (card) card.classList.remove("dragging");
});

document.querySelectorAll(".card-list").forEach((list) => {
  list.addEventListener("dragover", (event) => {
    event.preventDefault();
    list.classList.add("drag-over");
  });
  list.addEventListener("dragleave", () => list.classList.remove("drag-over"));
  list.addEventListener("drop", (event) => {
    event.preventDefault();
    list.classList.remove("drag-over");
    const id = event.dataTransfer.getData("text/plain");
    moveEdital(id, list.dataset.status);
  });
});

// --- Alternância de visão (tabela / kanban) ---
document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".view-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
    document.getElementById(`view-${btn.dataset.view}`).classList.remove("hidden");
  });
});

updateFilterIndicator();
updateEditalCount();
updateIgnoradosCount();
renderTabela();
renderKanban();
