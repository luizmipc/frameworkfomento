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
// de cara). Fechamento ajustado para ~6 semanas à frente da data mockada
// de "hoje" só para o contador de prazo ter algo interessante para mostrar
// (não é conteúdo de nenhuma FR — puro dado de demonstração).
const edital = {
  chamada: "Chamada Pública Inovação Social 2026",
  instituicao: "CNPq (fictício)",
  descricao: "Apoio a projetos de inovação social voltados à redução de desigualdades regionais.",
  link: "https://exemplo.gov.br/chamadas/inovacao-social-2026",
  abertura: "2026-06-01",
  fechamento: "2026-09-15",
  documentacao: "Projeto detalhado, comprovante de regularidade fiscal (CND), carta de anuência da instituição proponente, currículo Lattes da equipe e orçamento detalhado por rubrica.",
  criterios: "Aderência à área temática (peso 3), viabilidade técnica e orçamentária (peso 2), impacto social esperado (peso 3), capacidade da equipe proponente (peso 2).",
  status: "andamento",
};

// Riscos genéricos de captação — aplicáveis a qualquer edital, não
// extraídos de nenhum documento-fonte real (protótipo genérico). Sempre
// visíveis, fora do plano de submissão (nunca gated por item concluído).
const riscos = [
  "Aprovação no mérito não é o mesmo que contratação garantida — pode haver um prazo próprio, definido pelo edital, para a assinatura do termo/contrato depois da aprovação.",
  "O edital pode ser alterado durante o período de submissão — revise a versão vigente pouco antes do envio, não confie só na leitura inicial.",
  "Confirme se há limite de propostas por proponente (ou por linha/categoria) antes de duplicar uma submissão para outra chamada ou linha.",
];

// Documentos de pós-aprovação/contratação — só entram em jogo depois da
// proposta aprovada, nunca fazem parte do que falta para submeter agora.
// Seção separada e explicitamente não-gated.
const posAprovacao = [
  "Certidões de regularidade fiscal atualizadas (podem já estar vencidas entre a submissão e a aprovação — reemitir antes de contratar).",
  "Dados bancários e documentação societária para formalização do termo de outorga/contrato.",
  "Plano de execução detalhado por rubrica, caso não tenha sido exigido já na fase de submissão.",
];

// Plano de submissão: LISTA PLANA de itens (decisão de FR-033 — nunca
// reintroduzir fases com gate próprio). Cada item tem descrição,
// "essencial para elegibilidade" (opcional), status pendente/concluído,
// categoria (tag visual livre, só para agrupamento de leitura — não é um
// modelo de fase), responsável, data de conclusão e docRef (referência de
// documento, texto livre — não é upload real).
//
// leigo/comoPreencher (blocos 💬/🧭): no produto real, esse conteúdo seria
// escrito pelo próprio captador ao criar o item (é ele quem sabe onde
// buscar aquele documento para ESTE edital) — não é extraído
// automaticamente de PDF nenhum, ao contrário do que a skill
// fundraiser-submission-timeline faz para um edital real específico. Aqui
// só 3 dos 5 itens mockam esse conteúdo, de propósito, para deixar claro
// que é opcional por item, não um campo obrigatório do modelo.
let planoItems = [
  { id: "p1", descricao: "Projeto detalhado (formulário padrão do edital)", essencial: true, concluido: true, docRef: "projeto-detalhado-v3.pdf", categoria: "Documentação", responsavel: "Ana Souza", concluidoEm: "2026-07-10" },
  { id: "p2", descricao: "Comprovante de regularidade fiscal (CND)", essencial: true, concluido: true, docRef: "cnd-2026-07.pdf", categoria: "Financeiro", responsavel: "Ana Souza", concluidoEm: "2026-07-12",
    leigo: "É a prova de que a organização não tem dívida com tributos federais em aberto.",
    comoPreencher: "Emita a Certidão Negativa de Débitos diretamente no site da Receita Federal — é gratuita e sai na hora." },
  { id: "p3", descricao: "Carta de anuência da instituição proponente", essencial: true, concluido: true, docRef: "carta-anuencia-assinada.pdf", categoria: "Parcerias", responsavel: "Carlos Lima", concluidoEm: "2026-07-15",
    leigo: "É um documento assinado pela instituição parceira confirmando que ela topa participar do projeto.",
    comoPreencher: "Peça à instituição parceira uma carta assinada pelo representante legal — comece esse pedido cedo, processos internos de assinatura costumam demorar." },
  { id: "p4", descricao: "Currículo Lattes da equipe", essencial: false, concluido: false, docRef: "", categoria: "Equipe", responsavel: "", concluidoEm: "" },
  { id: "p5", descricao: "Orçamento detalhado por rubrica", essencial: false, concluido: false, docRef: "", categoria: "Financeiro", responsavel: "", concluidoEm: "",
    leigo: "É a planilha que mostra quanto será gasto e em quê, dividido por categoria de despesa (rubrica).",
    comoPreencher: "Monte a planilha dividindo os valores por rubrica (ex.: equipamentos, serviços de terceiros, bolsas) e confira que o total bate com o valor solicitado no formulário." },
];

// Estado de expandir/recolher por item (independente do progresso) — todos
// começam expandidos. "Expandir/recolher tudo" na topbar liga/desliga em
// bloco; o chevron por item alterna individualmente.
const expandedIds = new Set(planoItems.map((i) => i.id));
let allExpanded = true;

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

// --- Riscos / Pós-aprovação (estático, sempre visível) ---
function renderRiscosEPosAprovacao() {
  const riscosList = document.getElementById("riscos-list");
  riscosList.innerHTML = "";
  riscos.forEach((texto) => {
    const li = document.createElement("li");
    li.textContent = texto;
    riscosList.appendChild(li);
  });

  const posList = document.getElementById("pos-aprovacao-list");
  posList.innerHTML = "";
  posAprovacao.forEach((texto) => {
    const li = document.createElement("li");
    li.textContent = texto;
    posList.appendChild(li);
  });
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

// --- Barra de resumo/veredito no topo (gate de elegibilidade + prazo +
// pendências) — visão de 3 segundos sem rolar a página. O veredito reflete
// sempre os itens ESSENCIAIS do plano, independente do estágio atual do
// edital (é o mesmo gate que habilita a sugestão "andamento → validação").
function gateStatus() {
  const essenciais = planoItems.filter((i) => i.essencial);
  const done = essenciais.filter((i) => i.concluido).length;
  return { done, total: essenciais.length, complete: essenciais.length > 0 && done === essenciais.length };
}

function updateSummaryBar() {
  const gs = gateStatus();
  const badge = document.getElementById("verdict-badge");
  badge.textContent = gs.complete ? "🟢 Habilitado" : `🔴 Pendente (${gs.done}/${gs.total})`;
  badge.className = "value verdict " + (gs.complete ? "verdict-go" : "verdict-pending");
  document.getElementById("pendencias-count").textContent = gs.total - gs.done;
}

function updateCountdown() {
  const deadline = new Date(`${edital.fechamento}T23:59:59-03:00`);
  const diff = deadline.getTime() - Date.now();
  const el = document.getElementById("countdown");
  if (diff <= 0) {
    el.textContent = "Prazo encerrado";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  el.textContent = `${days}d ${hours}h restantes`;
}

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

  updateSummaryBar();
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

    const categoriaBadge = node.querySelector(".item-categoria");
    if (item.categoria) {
      categoriaBadge.textContent = item.categoria;
      categoriaBadge.classList.remove("hidden");
    } else {
      categoriaBadge.classList.add("hidden");
    }

    const expanded = expandedIds.has(item.id);
    node.querySelector(".item-toggle").textContent = expanded ? "▾" : "▸";
    const body = node.querySelector(".item-body");
    body.hidden = !expanded;

    const didaticoWrap = node.querySelector(".didatico");
    const leigoP = node.querySelector(".leigo");
    const comofazerP = node.querySelector(".comofazer");
    if (item.leigo || item.comoPreencher) {
      didaticoWrap.classList.remove("hidden");
      leigoP.classList.toggle("hidden", !item.leigo);
      if (item.leigo) leigoP.querySelector(".leigo-text").textContent = item.leigo;
      comofazerP.classList.toggle("hidden", !item.comoPreencher);
      if (item.comoPreencher) comofazerP.querySelector(".comofazer-text").textContent = item.comoPreencher;
    } else {
      didaticoWrap.classList.add("hidden");
    }

    node.querySelector(".item-resp").value = item.responsavel || "";
    node.querySelector(".item-concluido-em").value = item.concluidoEm || "";

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
// Concluído-em não força re-render (evitaria perder foco durante digitação).
planoList.addEventListener("change", (event) => {
  const target = event.target;
  const li = target.closest(".plano-item");
  if (!li) return;
  const item = planoItems.find((i) => i.id === li.dataset.id);

  if (target.classList.contains("item-concluido")) {
    item.concluido = target.checked;
    renderPlano();
    if (item.concluido) {
      planoList.querySelector(`.plano-item[data-id="${item.id}"] .item-docref-input`)?.focus();
    }
    return;
  }
  if (target.classList.contains("item-concluido-em")) {
    item.concluidoEm = target.value;
  }
});

// Digitar em referência de documento / responsável não precisa re-renderizar
// a lista inteira (perderia o foco do campo) — só atualiza o dado em memória.
planoList.addEventListener("input", (event) => {
  const target = event.target;
  const li = target.closest(".plano-item");
  if (!li) return;
  const item = planoItems.find((i) => i.id === li.dataset.id);

  if (target.classList.contains("item-docref-input")) {
    item.docRef = target.value;
  } else if (target.classList.contains("item-resp")) {
    item.responsavel = target.value;
  }
});

// Expandir/recolher por item (chevron) — não mexe no estado de conclusão.
planoList.addEventListener("click", (event) => {
  const btn = event.target.closest(".item-toggle");
  if (!btn) return;
  const li = btn.closest(".plano-item");
  const id = li.dataset.id;
  if (expandedIds.has(id)) expandedIds.delete(id);
  else expandedIds.add(id);
  renderPlano();
});

// Expandir/recolher tudo (topbar) — liga/desliga em bloco.
document.getElementById("btn-toggle-all").addEventListener("click", () => {
  allExpanded = !allExpanded;
  expandedIds.clear();
  if (allExpanded) planoItems.forEach((i) => expandedIds.add(i.id));
  renderPlano();
});

document.getElementById("btn-print").addEventListener("click", () => {
  window.print();
});

// --- Adicionar item ao plano ---
const addItemForm = document.getElementById("add-item-form");
const newItemDesc = document.getElementById("new-item-desc");
const newItemCategoria = document.getElementById("new-item-categoria");
const newItemEssencial = document.getElementById("new-item-essencial");

addItemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const descricao = newItemDesc.value.trim();
  if (!descricao) return;
  const id = `p${Date.now()}`;
  planoItems.push({
    id,
    descricao,
    essencial: newItemEssencial.checked,
    concluido: false,
    docRef: "",
    categoria: newItemCategoria.value.trim(),
    responsavel: "",
    concluidoEm: "",
  });
  expandedIds.add(id);
  newItemDesc.value = "";
  newItemCategoria.value = "";
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
document.getElementById("export-tudo").addEventListener("click", () => {
  showToast("Exportação simulada: página completa em PDF (protótipo não gera arquivo real).");
});

renderEdital();
renderRiscosEPosAprovacao();
renderPlano();
updateCountdown();
setInterval(updateCountdown, 60000);
