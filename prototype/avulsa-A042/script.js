// Protótipo não-funcional — task A042 (User Story 5)
// Dados mockados em memória; nenhuma chamada de API real, nenhuma
// persistência, nenhuma geração de PDF real (exportações são simuladas
// via toast).

// Mesmo modelo de 6 estágios de prototype/avulsa-A001/ (FR-002), para que o
// "Estágio atual" desta tela use o mesmo vocabulário do quadro de progresso.
const STATUS_LABEL = {
  backlog: "Backlog",
  andamento: "Em andamento",
  validacao: "Validação",
  submetido: "Submetido",
  aprovado: "Aprovado",
  nao_aprovado: "Não aprovado",
};

// Um único edital nesta tela (página de detalhe) — dados equivalentes ao que
// já existiria a partir do cadastro (US2). Mockado em "Em andamento" com os
// 3 itens essenciais do plano já concluídos, para a sugestão de avanço
// aparecer sem precisar de nenhuma interação prévia (comportamento visível
// de cara).
const edital = {
  chamada: "Chamada Pública Inovação Social 2026",
  instituicao: "CNPq (fictício)",
  descricao: "Apoio a projetos de inovação social voltados à redução de desigualdades regionais.",
  link: "https://exemplo.gov.br/chamadas/inovacao-social-2026",
  abertura: "2026-06-01",
  fechamento: "2026-08-05",
  documentacao: "Projeto detalhado, comprovante de regularidade fiscal (CND), carta de anuência da instituição proponente, currículo Lattes da equipe e orçamento detalhado por rubrica.",
  criterios: "Aderência à área temática (peso 3), viabilidade técnica e orçamentária (peso 2), impacto social esperado (peso 3), capacidade da equipe proponente (peso 2).",
  status: "andamento",
};

// Plano de submissão: cada item tem descrição, "essencial para
// elegibilidade" (opcional) e status pendente/concluído. docRef é a
// referência de documento (texto livre) registrada ao concluir o item — não
// é upload de arquivo real.
let planoItems = [
  { id: "p1", descricao: "Projeto detalhado (formulário padrão do edital)", essencial: true, concluido: true, docRef: "projeto-detalhado-v3.pdf" },
  { id: "p2", descricao: "Comprovante de regularidade fiscal (CND)", essencial: true, concluido: true, docRef: "cnd-2026-07.pdf" },
  { id: "p3", descricao: "Carta de anuência da instituição proponente", essencial: true, concluido: true, docRef: "carta-anuencia-assinada.pdf" },
  { id: "p4", descricao: "Currículo Lattes da equipe", essencial: false, concluido: false, docRef: "" },
  { id: "p5", descricao: "Orçamento detalhado por rubrica", essencial: false, concluido: false, docRef: "" },
];

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// --- Toast (mesmo padrão de prototype/avulsa-A001/) ---
const toastEl = document.getElementById("toast");
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 2500);
}

// --- Cabeçalho / dados do edital ---
function renderEdital() {
  document.getElementById("edital-nome").textContent = edital.chamada;
  document.getElementById("edital-instituicao").textContent = edital.instituicao;
  document.getElementById("edital-estagio-badge").textContent = STATUS_LABEL[edital.status];
  document.getElementById("edital-descricao").textContent = edital.descricao;
  document.getElementById("edital-abertura").innerHTML = edital.abertura
    ? formatDate(edital.abertura)
    : '<span class="field-missing">Abertura não informada</span>';
  document.getElementById("edital-fechamento").textContent = formatDate(edital.fechamento);
  document.getElementById("edital-documentacao").textContent = edital.documentacao;
  document.getElementById("edital-criterios").textContent = edital.criterios;
  const linkEl = document.getElementById("edital-link");
  linkEl.innerHTML = edital.link
    ? `<a href="${edital.link}" target="_blank" rel="noopener">${edital.link}</a>`
    : '<span class="field-missing">Link não informado</span>';
}

// --- Sugestão de avanço de estágio ---
// Em andamento → Validação quando todos os itens ESSENCIAIS estão
// concluídos; Validação → Submetido quando 100% dos itens (essenciais ou
// não) estão concluídos. Fora dessas duas transições não há sugestão — esta
// tela nunca move o edital sozinha, só sugere uma ação de um clique.
function computeSuggestion() {
  if (edital.status === "andamento") {
    const essenciais = planoItems.filter((i) => i.essencial);
    if (essenciais.length > 0 && essenciais.every((i) => i.concluido)) {
      return { label: "Habilitado para ir a Validação →", actionLabel: "Mover para Validação", destino: "validacao" };
    }
  } else if (edital.status === "validacao") {
    if (planoItems.length > 0 && planoItems.every((i) => i.concluido)) {
      return { label: "Habilitado para ir a Submetido →", actionLabel: "Mover para Submetido", destino: "submetido" };
    }
  }
  return null;
}

const suggestionBanner = document.getElementById("suggestion-banner");
const suggestionText = document.getElementById("suggestion-text");
const suggestionAction = document.getElementById("suggestion-action");

function updateProgressAndSuggestion() {
  const total = planoItems.length;
  const concluidos = planoItems.filter((i) => i.concluido).length;
  const essenciais = planoItems.filter((i) => i.essencial);
  const essenciaisConcluidos = essenciais.filter((i) => i.concluido).length;
  const partes = [`${concluidos} de ${total} itens concluídos`];
  if (essenciais.length > 0) {
    partes.push(`${essenciaisConcluidos} de ${essenciais.length} essenciais concluídos`);
  }
  document.getElementById("progress-summary").textContent = partes.join(" · ");

  const suggestion = computeSuggestion();
  suggestionBanner.classList.toggle("hidden", !suggestion);
  if (suggestion) {
    suggestionText.textContent = suggestion.label;
    suggestionAction.textContent = suggestion.actionLabel;
  }
}

suggestionAction.addEventListener("click", () => {
  const suggestion = computeSuggestion();
  if (!suggestion) return;
  edital.status = suggestion.destino;
  renderEdital();
  updateProgressAndSuggestion();
  updateResumoExecutivo();
  showToast(`Estágio movido para ${STATUS_LABEL[edital.status]}`);
});

// --- Resumo executivo: dados do edital + pendências de elegibilidade ---
function updateResumoExecutivo() {
  document.getElementById("resumo-chamada").textContent = edital.chamada;
  document.getElementById("resumo-instituicao").textContent = edital.instituicao;
  document.getElementById("resumo-fechamento").textContent = formatDate(edital.fechamento);
  document.getElementById("resumo-estagio").textContent = STATUS_LABEL[edital.status];
  const resumoLink = document.getElementById("resumo-link");
  resumoLink.innerHTML = edital.link
    ? `<a href="${edital.link}" target="_blank" rel="noopener">Ver chamada</a>`
    : '<span class="field-missing">Não informado</span>';

  const pendenciasList = document.getElementById("pendencias-list");
  pendenciasList.innerHTML = "";
  const pendentes = planoItems.filter((i) => i.essencial && !i.concluido);
  if (pendentes.length === 0) {
    pendenciasList.innerHTML = '<li class="pendencia-ok">Nenhuma pendência — todos os itens essenciais estão concluídos.</li>';
    return;
  }
  pendentes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.descricao;
    pendenciasList.appendChild(li);
  });
}

// --- Lista do plano de submissão ---
const planoList = document.getElementById("plano-list");
const planoItemTemplate = document.getElementById("plano-item-template");

function renderPlano() {
  planoList.innerHTML = "";
  planoItems.forEach((item) => {
    const node = planoItemTemplate.content.cloneNode(true);
    const li = node.querySelector(".plano-item");
    li.dataset.id = item.id;
    li.classList.toggle("concluido", item.concluido);
    node.querySelector(".item-concluido").checked = item.concluido;
    node.querySelector(".item-desc").textContent = item.descricao;
    node.querySelector(".badge-essencial").classList.toggle("hidden", !item.essencial);
    const docrefWrap = node.querySelector(".item-docref");
    docrefWrap.classList.toggle("hidden", !item.concluido);
    node.querySelector(".item-docref-input").value = item.docRef || "";
    planoList.appendChild(node);
  });
  updateProgressAndSuggestion();
  updateResumoExecutivo();
}

// Marcar/desmarcar concluído — re-renderiza a lista inteira (troca de estado
// visual + mostra/esconde o campo de referência de documento). Ao concluir,
// foca o campo de referência para o captador já poder anotar o documento.
planoList.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".item-concluido");
  if (!checkbox) return;
  const li = checkbox.closest(".plano-item");
  const item = planoItems.find((i) => i.id === li.dataset.id);
  item.concluido = checkbox.checked;
  renderPlano();
  if (item.concluido) {
    planoList.querySelector(`.plano-item[data-id="${item.id}"] .item-docref-input`)?.focus();
  }
});

// Digitar na referência de documento não precisa re-renderizar a lista
// inteira (perderia o foco do campo) — só atualiza o dado em memória.
planoList.addEventListener("input", (event) => {
  const input = event.target.closest(".item-docref-input");
  if (!input) return;
  const li = input.closest(".plano-item");
  const item = planoItems.find((i) => i.id === li.dataset.id);
  item.docRef = input.value;
});

// --- Adicionar item ao plano ---
const addItemForm = document.getElementById("add-item-form");
const newItemDesc = document.getElementById("new-item-desc");
const newItemEssencial = document.getElementById("new-item-essencial");

addItemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const descricao = newItemDesc.value.trim();
  if (!descricao) return;
  planoItems.push({
    id: `p${Date.now()}`,
    descricao,
    essencial: newItemEssencial.checked,
    concluido: false,
    docRef: "",
  });
  newItemDesc.value = "";
  newItemEssencial.checked = false;
  renderPlano();
  newItemDesc.focus();
});

// --- Exportação em PDF (simulada — protótipo não gera arquivo real) ---
document.getElementById("export-resumo").addEventListener("click", () => {
  showToast("Exportação simulada: resumo executivo em PDF (protótipo não gera arquivo real).");
});
document.getElementById("export-plano").addEventListener("click", () => {
  showToast("Exportação simulada: plano de submissão em PDF (protótipo não gera arquivo real).");
});

renderEdital();
renderPlano();
