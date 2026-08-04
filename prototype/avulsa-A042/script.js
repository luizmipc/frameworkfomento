// Protótipo não-funcional — task A042 (User Story 5)
// Dados mockados em memória; nenhuma chamada de API real, nenhuma
// persistência, nenhuma geração de PDF real (exportações são simuladas
// via toast).

// Mesmo modelo de 7 estágios de prototype/avulsa-A001/ (FR-002, atualizado
// 2026-08-04 com a coluna "Elegibilidade"), para que o "Estágio atual" desta
// tela use o mesmo vocabulário do quadro de progresso.
const STATUS_LABEL = {
  backlog: "Backlog",
  elegibilidade: "Elegibilidade",
  andamento: "Em andamento",
  validacao: "Validação",
  submetido: "Submetido",
  aprovado: "Aprovado",
  nao_aprovado: "Não aprovado",
};

// FR-033: os 4 estágios válidos para associação de item do plano de
// submissão — só os estágios "de preparação" do Kanban (Backlog fica fora,
// nada a planejar antes de começar; os 2 terminais ficam fora, são
// desfecho, não etapa de preparação). PROXIMO_ESTAGIO mapeia a transição de
// avanço sugerida a partir de cada um (FR-038/FR-041) — as mesmas 3
// transições em que a sugestão de avanço pode aparecer.
const ESTAGIOS_PLANO = ["elegibilidade", "andamento", "validacao", "submetido"];
const PROXIMO_ESTAGIO = {
  elegibilidade: "andamento",
  andamento: "validacao",
  validacao: "submetido",
};

// Um único edital nesta tela (página de detalhe) — dados equivalentes ao que
// já existiria a partir do cadastro (US2). Mockado em "Elegibilidade"
// (2026-08-04, FR-002/FR-038) com os itens essenciais desse grupo já
// concluídos, para a sugestão de avanço para "Em andamento" aparecer sem
// precisar de nenhuma interação prévia (comportamento visível de cara).
// Fechamento ajustado para ~6 semanas à frente da data mockada de "hoje" só
// para o contador de prazo ter algo interessante para mostrar (não é
// conteúdo de nenhuma FR — puro dado de demonstração).
const edital = {
  chamada: "Chamada Pública Inovação Social 2026",
  instituicao: "CNPq (fictício)",
  descricao: "Apoio a projetos de inovação social voltados à redução de desigualdades regionais.",
  link: "https://exemplo.gov.br/chamadas/inovacao-social-2026",
  abertura: "2026-06-01",
  fechamento: "2026-09-15",
  documentacao: "Projeto detalhado, comprovante de regularidade fiscal (CND), carta de anuência da instituição proponente, currículo Lattes da equipe e orçamento detalhado por rubrica.",
  criterios: "Aderência à área temática (peso 3), viabilidade técnica e orçamentária (peso 2), impacto social esperado (peso 3), capacidade da equipe proponente (peso 2).",
  status: "elegibilidade",
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
// estagio (obrigatório, um dos 4 valores de ESTAGIOS_PLANO — substituiu a
// "categoria" de texto livre opcional; usado tanto para o agrupamento
// visual quanto para o gate/sugestão de avanço, ver renderPlano() e
// computeSuggestion()), responsável, data de conclusão e docRef (referência
// de documento, texto livre — não é upload real).
//
// leigo/comoPreencher (blocos 💬/🧭): no produto real, esse conteúdo seria
// escrito pelo próprio captador ao criar o item (é ele quem sabe onde
// buscar aquele documento para ESTE edital) — não é extraído
// automaticamente de PDF nenhum, ao contrário do que a skill
// fundraiser-submission-timeline faz para um edital real específico. Aqui
// só alguns itens mockam esse conteúdo, de propósito, para deixar claro
// que é opcional por item, não um campo obrigatório do modelo.
//
// Distribuição por estágio (2026-08-04, FR-033): os itens que já existiam
// foram redistribuídos por plausibilidade (documentos que provam
// elegibilidade → Elegibilidade; preparação do conteúdo da proposta → Em
// andamento) e mais 4 itens novos (p6–p9) foram acrescentados para os 4
// grupos terem pelo menos 2 itens cada e demonstrar Validação/Submetido,
// que antes não tinham nenhum item mockado.
let planoItems = [
  // --- Elegibilidade: os 2 essenciais concluídos habilitam a sugestão de
  // avanço para "Em andamento" nesta demonstração (edital.status acima).
  { id: "p2", descricao: "Comprovante de regularidade fiscal (CND)", essencial: true, concluido: true, docRef: "cnd-2026-07.pdf", estagio: "elegibilidade", responsavel: "Ana Souza", concluidoEm: "2026-07-12",
    leigo: "É a prova de que a organização não tem dívida com tributos federais em aberto.",
    comoPreencher: "Emita a Certidão Negativa de Débitos diretamente no site da Receita Federal — é gratuita e sai na hora." },
  { id: "p3", descricao: "Carta de anuência da instituição proponente", essencial: true, concluido: true, docRef: "carta-anuencia-assinada.pdf", estagio: "elegibilidade", responsavel: "Carlos Lima", concluidoEm: "2026-07-15",
    leigo: "É um documento assinado pela instituição parceira confirmando que ela topa participar do projeto.",
    comoPreencher: "Peça à instituição parceira uma carta assinada pelo representante legal — comece esse pedido cedo, processos internos de assinatura costumam demorar." },
  { id: "p6", descricao: "Confirmar enquadramento do projeto na linha temática do edital", essencial: false, concluido: false, docRef: "", estagio: "elegibilidade", responsavel: "", concluidoEm: "" },

  // --- Em andamento: preparação de conteúdo da proposta, ainda não
  // concluída — não bloqueia nada agora porque o estágio atual do edital é
  // "Elegibilidade" (o gate só olha o grupo do estágio atual).
  { id: "p1", descricao: "Projeto detalhado (formulário padrão do edital)", essencial: true, concluido: false, docRef: "", estagio: "andamento", responsavel: "Ana Souza", concluidoEm: "" },
  { id: "p4", descricao: "Currículo Lattes da equipe", essencial: false, concluido: false, docRef: "", estagio: "andamento", responsavel: "", concluidoEm: "" },
  { id: "p5", descricao: "Orçamento detalhado por rubrica", essencial: true, concluido: false, docRef: "", estagio: "andamento", responsavel: "", concluidoEm: "",
    leigo: "É a planilha que mostra quanto será gasto e em quê, dividido por categoria de despesa (rubrica).",
    comoPreencher: "Monte a planilha dividindo os valores por rubrica (ex.: equipamentos, serviços de terceiros, bolsas) e confira que o total bate com o valor solicitado no formulário." },

  // --- Validação: revisão final antes do envio.
  { id: "p7", descricao: "Conferir se todos os anexos exigidos estão no formato e tamanho aceitos pelo edital", essencial: true, concluido: false, docRef: "", estagio: "validacao", responsavel: "", concluidoEm: "" },
  { id: "p8", descricao: "Revisão final do texto do projeto por um segundo leitor", essencial: false, concluido: false, docRef: "", estagio: "validacao", responsavel: "", concluidoEm: "" },

  // --- Submetido: itens do próprio ato de envio.
  { id: "p9", descricao: "Protocolar o envio no sistema do financiador", essencial: true, concluido: false, docRef: "", estagio: "submetido", responsavel: "", concluidoEm: "" },
  { id: "p10", descricao: "Guardar o comprovante/protocolo de submissão", essencial: false, concluido: false, docRef: "", estagio: "submetido", responsavel: "", concluidoEm: "" },
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

// --- Sugestão de avanço de estágio (FR-038/FR-041, 2026-08-04) ---
// Fórmula única, reaproveitada nas 3 transições Elegibilidade→Em andamento,
// Em andamento→Validação, Validação→Submetido: todos os itens ESSENCIAIS
// associados ao ESTÁGIO ATUAL do edital estão concluídos, havendo ao menos
// 1 essencial nesse estágio. Itens de outros estágios (ou não essenciais,
// em qualquer estágio) nunca entram nessa conta. Fora dessas 3 transições
// não há sugestão — esta tela nunca move o edital sozinha, só sugere uma
// ação de um clique.
function itensDoEstagioAtual() {
  return planoItems.filter((i) => i.estagio === edital.status);
}

function computeSuggestion() {
  const proximo = PROXIMO_ESTAGIO[edital.status];
  if (!proximo) return null;
  const essenciais = itensDoEstagioAtual().filter((i) => i.essencial);
  if (essenciais.length > 0 && essenciais.every((i) => i.concluido)) {
    return {
      label: `Habilitado para ir a ${STATUS_LABEL[proximo]} →`,
      actionLabel: `Mover para ${STATUS_LABEL[proximo]}`,
      destino: proximo,
    };
  }
  return null;
}

const suggestionBanner = document.getElementById("suggestion-banner");
const suggestionText = document.getElementById("suggestion-text");
const suggestionAction = document.getElementById("suggestion-action");

// --- Barra de resumo/veredito no topo (gate + prazo + pendências) — visão
// de 3 segundos sem rolar a página. O veredito reflete os itens ESSENCIAIS
// do grupo do ESTÁGIO ATUAL do edital (mesmo gate que habilita a sugestão
// de avanço acima) — não mais "todos os essenciais do plano inteiro".
function gateStatus() {
  const essenciais = itensDoEstagioAtual().filter((i) => i.essencial);
  const done = essenciais.filter((i) => i.concluido).length;
  return { done, total: essenciais.length, complete: essenciais.length > 0 && done === essenciais.length };
}

function updateSummaryBar() {
  const badge = document.getElementById("verdict-badge");
  const pendEl = document.getElementById("pendencias-count");
  // Backlog e os 2 estágios terminais não têm grupo de plano associado
  // (FR-033) — o gate simplesmente não se aplica nesses estágios.
  if (!ESTAGIOS_PLANO.includes(edital.status)) {
    badge.textContent = "— não se aplica neste estágio";
    badge.className = "value verdict";
    pendEl.textContent = "–";
    return;
  }
  const gs = gateStatus();
  badge.textContent = gs.complete ? "🟢 Habilitado" : `🔴 Pendente (${gs.done}/${gs.total})`;
  badge.className = "value verdict " + (gs.complete ? "verdict-go" : "verdict-pending");
  pendEl.textContent = gs.total - gs.done;
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
  const partes = [`${concluidos} de ${total} itens concluídos (todos os estágios)`];
  if (ESTAGIOS_PLANO.includes(edital.status)) {
    const essenciais = itensDoEstagioAtual().filter((i) => i.essencial);
    if (essenciais.length > 0) {
      const essenciaisConcluidos = essenciais.filter((i) => i.concluido).length;
      partes.push(`${essenciaisConcluidos} de ${essenciais.length} essenciais concluídos em ${STATUS_LABEL[edital.status]}`);
    }
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
  // renderPlano() já chama updateProgressAndSuggestion()/updateResumoExecutivo()
  // — precisa ser chamado de novo aqui (não só os dois direto) para também
  // atualizar o destaque ".current" do novo grupo de estágio nas seções do
  // plano (ver renderPlano()).
  renderPlano();
  showToast(`Estágio movido para ${STATUS_LABEL[edital.status]}`);
});

// --- Resumo executivo: dados do edital + pendências do estágio atual ---
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
  // FR-038/FR-041: pendências que bloqueiam o AVANÇO a partir do estágio
  // atual — não mais "todos os essenciais do plano inteiro" (esse conceito
  // único de "elegibilidade" não existe mais; cada estágio tem seu próprio
  // gate, ver gateStatus()).
  const pendentes = itensDoEstagioAtual().filter((i) => i.essencial && !i.concluido);
  if (pendentes.length === 0) {
    pendenciasList.innerHTML = '<li class="pendencia-ok">Nenhuma pendência — todos os itens essenciais deste estágio estão concluídos.</li>';
    return;
  }
  pendentes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.descricao;
    pendenciasList.appendChild(li);
  });
}

// --- Lista do plano de submissão, agrupada pelos 4 estágios (FR-033/FR-038,
// 2026-08-04) ---
// planoGroups é o wrapper de TODAS as 4 <ul class="plano-list"> (uma por
// estágio, ver index.html) — a delegação de eventos fica nele em vez de em
// cada <ul> individual, então change/input/click continuam funcionando
// para item de qualquer grupo sem precisar de 4 listeners repetidos.
const planoGroups = document.getElementById("plano-groups");
const planoItemTemplate = document.getElementById("plano-item-template");

function renderPlano() {
  ESTAGIOS_PLANO.forEach((estagio) => {
    const list = document.querySelector(`.plano-list[data-estagio="${estagio}"]`);
    list.innerHTML = "";
    const itens = planoItems.filter((i) => i.estagio === estagio);

    itens.forEach((item) => {
      const node = planoItemTemplate.content.cloneNode(true);
      const li = node.querySelector(".plano-item");
      li.dataset.id = item.id;
      li.classList.toggle("concluido", item.concluido);

      node.querySelector(".item-concluido").checked = item.concluido;
      node.querySelector(".item-desc").textContent = item.descricao;
      node.querySelector(".badge-essencial").classList.toggle("hidden", !item.essencial);

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

      list.appendChild(node);
    });

    if (itens.length === 0) {
      list.innerHTML = '<li class="empty-group">Nenhum item associado a este estágio ainda.</li>';
    }

    const concluidos = itens.filter((i) => i.concluido).length;
    const progressEl = document.querySelector(`.group-progress[data-estagio="${estagio}"]`);
    progressEl.textContent = itens.length ? `(${concluidos}/${itens.length})` : "";

    // "Você está aqui" — destaca visualmente o grupo do estágio atual do
    // edital, o mesmo grupo usado pelo gate/sugestão de avanço acima.
    document.querySelector(`.plano-group[data-estagio="${estagio}"]`).classList.toggle("current", estagio === edital.status);
  });

  updateProgressAndSuggestion();
  updateResumoExecutivo();
}

// Marcar/desmarcar concluído — re-renderiza os grupos (troca de estado
// visual + mostra/esconde o campo de referência de documento + contadores
// por grupo). Ao concluir, foca o campo de referência para o captador já
// poder anotar o documento. Concluído-em não força re-render (evitaria
// perder foco durante digitação).
planoGroups.addEventListener("change", (event) => {
  const target = event.target;
  const li = target.closest(".plano-item");
  if (!li) return;
  const item = planoItems.find((i) => i.id === li.dataset.id);

  if (target.classList.contains("item-concluido")) {
    item.concluido = target.checked;
    renderPlano();
    if (item.concluido) {
      planoGroups.querySelector(`.plano-item[data-id="${item.id}"] .item-docref-input`)?.focus();
    }
    return;
  }
  if (target.classList.contains("item-concluido-em")) {
    item.concluidoEm = target.value;
  }
});

// Digitar em referência de documento / responsável não precisa re-renderizar
// os grupos (perderia o foco do campo) — só atualiza o dado em memória.
planoGroups.addEventListener("input", (event) => {
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
planoGroups.addEventListener("click", (event) => {
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
// FR-033: select obrigatório (substitui a antiga "Categoria" de texto
// livre opcional) — o <select required> com placeholder disabled já impede
// submit sem escolher um dos 4 estágios, sem precisar de validação em JS.
const newItemEstagio = document.getElementById("new-item-estagio");
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
    estagio: newItemEstagio.value,
    responsavel: "",
    concluidoEm: "",
  });
  expandedIds.add(id);
  newItemDesc.value = "";
  newItemEstagio.value = "";
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
