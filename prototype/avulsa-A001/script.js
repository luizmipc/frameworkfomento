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
    fechamento: "2026-08-30",
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
    fechamento: "2026-08-20",
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

// --- Visão tabela ---
function renderTabela() {
  const corpo = document.getElementById("tabela-corpo");
  corpo.innerHTML = "";
  editais.forEach((edital) => {
    const tr = document.createElement("tr");
    const vencido = isVencido(edital.fechamento);
    tr.classList.toggle("vencido", vencido);
    // Ordem prioriza as colunas decisivas para priorização (Fechamento, Abertura, Link)
    // logo após o identificador (Chamada); Instituição/Descrição, menos decisivas, ficam por
    // último. Os data-label alimentam o layout empilhado em telas estreitas (ver style.css).
    tr.innerHTML = `
      <td data-label="Chamada">${edital.chamada}</td>
      <td data-label="Fechamento">${formatDate(edital.fechamento)}${vencido ? ' <span class="badge-vencido">Vencido</span>' : ""}</td>
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
  STATUSES.forEach((status) => {
    const list = document.querySelector(`.card-list[data-status="${status}"]`);
    list.innerHTML = "";
  });

  editais.forEach((edital) => {
    const list = document.querySelector(`.card-list[data-status="${edital.status}"]`);
    const node = cardTemplate.content.cloneNode(true);
    const card = node.querySelector(".card");
    card.dataset.id = edital.id;
    card.querySelector(".card-title").textContent = edital.chamada;
    card.querySelector(".card-inst").textContent = edital.instituicao;
    card.querySelector(".card-dates").textContent =
      `${formatDate(edital.abertura)} — ${formatDate(edital.fechamento)}`;
    const vencido = isVencido(edital.fechamento);
    card.classList.toggle("vencido", vencido);
    card.querySelector(".card-vencido-badge").classList.toggle("hidden", !vencido);
    card.querySelector(".card-link").href = edital.link;
    list.appendChild(node);
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
