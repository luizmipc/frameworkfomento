// Protótipo não-funcional — task A001
// Dados mockados em memória; nenhuma chamada de API real, nenhuma persistência.

const STATUSES = ["backlog", "andamento", "validacao", "concluido"];

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
    abertura: "2026-05-15",
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
    status: "concluido",
  },
  {
    id: "e5",
    chamada: "Edital de Cultura e Patrimônio Digital",
    descricao: "Recursos para digitalização e preservação de acervos culturais e patrimônio histórico.",
    instituicao: "Fundação Cultural Exemplo (fictício)",
    abertura: "2026-06-20",
    // A011: ajustado para cair no nível de proximidade "até 21 dias" (FR-022).
    fechamento: "2026-08-19",
    link: "https://exemplo.cultura.gov.br/patrimonio-digital",
    status: "backlog",
  },
];

const STATUS_LABEL = {
  backlog: "Backlog",
  andamento: "Em andamento",
  validacao: "Validação",
  concluido: "Concluído",
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

// --- Busca + filtro compartilhados (US4 / FR-018, FR-019) ---
const searchInput = document.getElementById("search-input");
const instFilter = document.getElementById("inst-filter");
const sortFechamento = document.getElementById("sort-fechamento");

// Opções do filtro de instituição vêm dos dados mockados — sem lista fixa.
[...new Set(editais.map((e) => e.instituicao))].sort().forEach((inst) => {
  const opt = document.createElement("option");
  opt.value = inst;
  opt.textContent = inst;
  instFilter.appendChild(opt);
});

function getFiltered() {
  const termo = searchInput.value.trim().toLowerCase();
  const inst = instFilter.value;
  return editais.filter(
    (e) =>
      (!termo || e.chamada.toLowerCase().includes(termo)) &&
      (!inst || e.instituicao === inst)
  );
}

function byFechamento(a, b) {
  return a.fechamento < b.fechamento ? -1 : a.fechamento > b.fechamento ? 1 : 0;
}

[searchInput, instFilter].forEach((el) =>
  el.addEventListener("input", () => {
    renderTabela();
    renderKanban();
  })
);
sortFechamento.addEventListener("change", renderTabela);

// --- Visão tabela ---
function renderTabela() {
  const corpo = document.getElementById("tabela-corpo");
  corpo.innerHTML = "";
  const lista = getFiltered().sort(byFechamento);
  if (sortFechamento.value === "desc") lista.reverse();
  if (lista.length === 0) {
    corpo.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum edital encontrado com esses critérios.</td></tr>';
    return;
  }
  lista.forEach((edital) => {
    const tr = document.createElement("tr");
    const vencido = isVencido(edital.fechamento);
    // FR-022: badge de prazo próximo só se aplica a editais ainda não vencidos
    // — vencido (FR-011) tem precedência e exclui o cálculo de nível.
    const nivel = vencido ? null : nivelProximidade(edital.fechamento);
    tr.classList.toggle("vencido", vencido);
    tr.classList.toggle("proximo", !vencido && nivel !== null);
    let badgePrazo = "";
    if (vencido) badgePrazo = ' <span class="badge-vencido">Vencido</span>';
    else if (nivel !== null) badgePrazo = ` <span class="badge-proximo">Vence em até ${nivel} dias</span>`;
    // Ordem prioriza as colunas decisivas para priorização (Fechamento, Abertura, Link)
    // logo após o identificador (Chamada); Instituição/Descrição, menos decisivas, ficam por
    // último. Os data-label alimentam o layout empilhado em telas estreitas (ver style.css).
    tr.innerHTML = `
      <td data-label="Chamada">${edital.chamada}</td>
      <td data-label="Fechamento">${formatDate(edital.fechamento)}${badgePrazo}</td>
      <td data-label="Abertura">${formatDate(edital.abertura)}</td>
      <td data-label="Link"><a href="${edital.link}" target="_blank" rel="noopener">Ver chamada</a></td>
      <td data-label="Instituição">${edital.instituicao}</td>
      <td data-label="Descrição">${edital.descricao}</td>
    `;
    corpo.appendChild(tr);
  });
}

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

    doStatus.forEach((edital) => {
      const node = cardTemplate.content.cloneNode(true);
      const card = node.querySelector(".card");
      card.dataset.id = edital.id;
      card.querySelector(".card-title").textContent = edital.chamada;
      card.querySelector(".card-inst").textContent = edital.instituicao;
      card.querySelector(".card-dates").textContent =
        `${formatDate(edital.abertura)} — ${formatDate(edital.fechamento)}`;
      const vencido = isVencido(edital.fechamento);
      // FR-022: mesma precedência da tabela — só calcula nível se não vencido.
      const nivel = vencido ? null : nivelProximidade(edital.fechamento);
      card.classList.toggle("vencido", vencido);
      card.classList.toggle("proximo", !vencido && nivel !== null);
      card.querySelector(".card-vencido-badge").classList.toggle("hidden", !vencido);
      const badgeProximo = card.querySelector(".card-proximo-badge");
      badgeProximo.classList.toggle("hidden", nivel === null);
      if (nivel !== null) badgeProximo.textContent = `Vence em até ${nivel} dias`;
      card.querySelector(".card-link").href = edital.link;
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
    card.querySelector('[data-dir="1"]').disabled = idx === STATUSES.length - 1;
  });
}

function moveEdital(id, newStatus) {
  const edital = editais.find((e) => e.id === id);
  if (!edital) return;
  edital.status = newStatus;
  renderKanban();
}

// Clique nos botões de mover (acessível, sem depender de drag-and-drop)
document.getElementById("board").addEventListener("click", (event) => {
  const btn = event.target.closest(".move-btn");
  if (!btn) return;
  const card = btn.closest(".card");
  const edital = editais.find((e) => e.id === card.dataset.id);
  const idx = STATUSES.indexOf(edital.status);
  const newIdx = idx + Number(btn.dataset.dir);
  if (newIdx >= 0 && newIdx < STATUSES.length) {
    moveEdital(edital.id, STATUSES[newIdx]);
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

renderTabela();
renderKanban();
