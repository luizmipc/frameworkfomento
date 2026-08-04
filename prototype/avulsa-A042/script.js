// Protótipo não-funcional — task A042 (User Story 5)
// Dados mockados em memória (persistidos só via localStorage do navegador,
// nunca em servidor real); nenhuma chamada de API real, nenhuma geração de
// PDF real (exportações são simuladas via toast).

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

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function escAttr(s) {
  return escHtml(s).replace(/"/g, "&quot;");
}

// Identificação do proponente — dados de quem está submetendo, distintos
// dos dados do edital em si (equivalente ao bloco "Identificação do
// proponente" da referência docs/submissions/timeline-submission-finep-
// digital.html). Reaproveitado no resumo executivo/exportação.
const identificacao = {
  organizacao: "",
  cnpj: "",
  parceira: "",
  responsavel: "",
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
// openQuestion (2026-08-04): mesma badge [?] usada nos itens do plano —
// um risco também pode ser uma ambiguidade real do edital-fonte, não só
// uma advertência processual comum.
const riscos = [
  { texto: "Aprovação no mérito não é o mesmo que contratação garantida — pode haver um prazo próprio, definido pelo edital, para a assinatura do termo/contrato depois da aprovação." },
  { texto: "O edital pode ser alterado durante o período de submissão — revise a versão vigente pouco antes do envio, não confie só na leitura inicial." },
  { texto: "Confirme se o limite de propostas por proponente vale por chamada inteira ou por linha/categoria — editais nem sempre deixam isso explícito; abra um chamado com o financiador se o texto-fonte não esclarecer.", openQuestion: true },
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
// "essencial para elegibilidade" (opcional), estagio (obrigatório, um dos 4
// valores de ESTAGIOS_PLANO), responsável, data de conclusão e docRef
// (referência de documento, texto livre — não é upload real). Além disso,
// campos OPCIONAIS por item, paridade com docs/submissions/timeline-
// submission-finep-digital.html (2026-08-04, 2ª revisão):
//   - link: {text, href} — referência externa relacionada ao item.
//   - extra: {label, type, options?} — campo estruturado de valor (texto,
//     data, datetime-local ou select), armazenado em item.extraValor.
//   - textarea: {label} — observação livre, armazenada em item.observacao.
//   - openQuestion: true — badge [?], distinto de essencial/informativo.
//
// A maioria dos itens é do tipo implícito "normal" (checkbox simples). Dois
// tipos adicionais, também da referência, genericizados aqui:
//   - tipo: "condicional" — escolha por radio entre modalidades mutuamente
//     exclusivas, cada uma revelando seu próprio sub-checklist (branches).
//     "Concluído" = uma opção escolhida E todos os subitens dessa branch
//     marcados (ver isItemConcluido()).
//   - tipo: "radio" — cenário mutuamente exclusivo com campos extras
//     associados (extras[]), sem sub-checklist. "Concluído" = qualquer
//     opção escolhida (os extras não são obrigatórios para o gate, só
//     registro de apoio).
//
// leigo/comoPreencher (blocos 💬/🧭): no produto real, esse conteúdo seria
// escrito pelo próprio captador ao criar o item (é ele quem sabe onde
// buscar aquele documento para ESTE edital) — não é extraído
// automaticamente de PDF nenhum, ao contrário do que a skill
// fundraiser-submission-timeline faz para um edital real específico. Aqui
// só alguns itens mockam esse conteúdo, de propósito, para deixar claro
// que é opcional por item, não um campo obrigatório do modelo.
let planoItems = [
  // --- Elegibilidade: os itens essenciais concluídos habilitam a sugestão
  // de avanço para "Em andamento" nesta demonstração (edital.status acima).
  { id: "p2", descricao: "Comprovante de regularidade fiscal (CND)", essencial: true, concluido: true, docRef: "cnd-2026-07.pdf", estagio: "elegibilidade", responsavel: "Ana Souza", concluidoEm: "2026-07-12",
    leigo: "É a prova de que a organização não tem dívida com tributos federais em aberto.",
    comoPreencher: "Emita a Certidão Negativa de Débitos diretamente no site da Receita Federal — é gratuita e sai na hora." },
  { id: "p3", descricao: "Carta de anuência da instituição proponente", essencial: true, concluido: true, docRef: "carta-anuencia-assinada.pdf", estagio: "elegibilidade", responsavel: "Carlos Lima", concluidoEm: "2026-07-15",
    leigo: "É um documento assinado pela instituição parceira confirmando que ela topa participar do projeto.",
    comoPreencher: "Peça à instituição parceira uma carta assinada pelo representante legal — comece esse pedido cedo, processos internos de assinatura costumam demorar." },
  { id: "p6", descricao: "Confirmar enquadramento do projeto na linha temática do edital", essencial: false, concluido: false, docRef: "", estagio: "elegibilidade", responsavel: "", concluidoEm: "",
    extra: { label: "Linha temática", type: "select", options: [
      { value: "educacao", label: "Educação e formação" },
      { value: "meio-ambiente", label: "Meio ambiente e sustentabilidade" },
      { value: "saude", label: "Saúde comunitária" },
      { value: "inovacao-social", label: "Inovação social" },
    ] }, extraValor: "" },
  { id: "p13", descricao: "Atividade do projeto não consta na lista de impedimentos do financiador", essencial: true, concluido: true, docRef: "print-consulta-2026-07.png", estagio: "elegibilidade", responsavel: "Ana Souza", concluidoEm: "2026-07-10",
    link: { text: "Ver lista de impedimentos ↗", href: "https://exemplo.gov.br/lista-impedimentos" },
    leigo: "Alguns financiadores publicam uma lista de setores/atividades que nunca apoiam — se o projeto cair nessa lista, não adianta insistir.",
    comoPreencher: "Abra o link da lista, use Ctrl+F para buscar palavras-chave da área do projeto e confirme que nada bate." },
  { id: "p14", descricao: "Confirmar limite de propostas simultâneas junto ao edital", essencial: false, concluido: false, docRef: "", estagio: "elegibilidade", responsavel: "", concluidoEm: "",
    openQuestion: true, textarea: { label: "Outras propostas em andamento (se houver)" }, observacao: "" },
  {
    id: "p15", tipo: "condicional", descricao: "Natureza jurídica da organização proponente", essencial: true, estagio: "elegibilidade",
    leigo: "O tipo de organização (empresa com fins lucrativos, ou entidade sem fins lucrativos) muda quais documentos comprovam a regularidade jurídica dela.",
    comoPreencher: "Confirme no Contrato Social ou Estatuto qual é a natureza jurídica exata antes de marcar um dos dois caminhos abaixo.",
    radioValue: "osc",
    radioOptions: [
      { value: "empresa", label: "Pessoa jurídica com fins lucrativos" },
      { value: "osc", label: "Organização da sociedade civil (OSC) sem fins lucrativos" },
    ],
    branches: {
      empresa: [
        { id: "p15-empresa-1", label: "Contrato social registrado na Junta Comercial", concluido: false },
        { id: "p15-empresa-2", label: "Regularidade fiscal (CND) da empresa", concluido: false },
      ],
      osc: [
        { id: "p15-osc-1", label: "Estatuto social registrado em cartório de pessoas jurídicas", concluido: true },
        { id: "p15-osc-2", label: "Certidão de utilidade pública ou CEBAS, se exigido pelo edital", concluido: true, openQuestion: true },
      ],
    },
  },
  {
    id: "p16", tipo: "radio", descricao: "Enquadramento de porte da organização (defina com o financeiro antes de calcular a contrapartida)", essencial: false, estagio: "elegibilidade",
    leigo: "Vários editais escalonam a exigência de contrapartida pelo porte (faturamento/orçamento anual) do proponente — vale confirmar isso cedo.",
    comoPreencher: "Peça ao financeiro o valor de faturamento/orçamento do último ano fechado e escolha o cenário correspondente.",
    radioValue: null,
    radioOptions: [
      { value: "pequeno", label: "Pequeno porte" },
      { value: "medio", label: "Médio porte" },
      { value: "grande", label: "Grande porte" },
    ],
    extras: [{ id: "faturamento", label: "Faturamento/orçamento anual (R$)", type: "text" }],
    extraValores: {},
  },

  // --- Em andamento: preparação de conteúdo da proposta, ainda não
  // concluída — não bloqueia nada agora porque o estágio atual do edital é
  // "Elegibilidade" (o gate só olha o grupo do estágio atual).
  { id: "p1", descricao: "Projeto detalhado (formulário padrão do edital)", essencial: true, concluido: false, docRef: "", estagio: "andamento", responsavel: "Ana Souza", concluidoEm: "" },
  { id: "p4", descricao: "Currículo Lattes da equipe", essencial: false, concluido: false, docRef: "", estagio: "andamento", responsavel: "", concluidoEm: "" },
  { id: "p5", descricao: "Orçamento detalhado por rubrica", essencial: true, concluido: false, docRef: "", estagio: "andamento", responsavel: "", concluidoEm: "",
    leigo: "É a planilha que mostra quanto será gasto e em quê, dividido por categoria de despesa (rubrica).",
    comoPreencher: "Monte a planilha dividindo os valores por rubrica (ex.: equipamentos, serviços de terceiros, bolsas) e confira que o total bate com o valor solicitado no formulário.",
    extra: { label: "Valor total solicitado (R$)", type: "text" }, extraValor: "" },

  // --- Validação: revisão final antes do envio.
  { id: "p7", descricao: "Conferir se todos os anexos exigidos estão no formato e tamanho aceitos pelo edital", essencial: true, concluido: false, docRef: "", estagio: "validacao", responsavel: "", concluidoEm: "" },
  { id: "p8", descricao: "Revisão final do texto do projeto por um segundo leitor", essencial: false, concluido: false, docRef: "", estagio: "validacao", responsavel: "", concluidoEm: "" },

  // --- Submetido: itens do próprio ato de envio.
  { id: "p9", descricao: "Protocolar o envio no sistema do financiador", essencial: true, concluido: false, docRef: "", estagio: "submetido", responsavel: "", concluidoEm: "",
    extra: { label: "Data/hora planejada de envio", type: "datetime-local" }, extraValor: "" },
  { id: "p10", descricao: "Guardar o comprovante/protocolo de submissão", essencial: false, concluido: false, docRef: "", estagio: "submetido", responsavel: "", concluidoEm: "" },
];

// "Concluído" depende do tipo do item — normal usa o checkbox direto;
// condicional exige uma branch escolhida com todos os subitens marcados;
// radio conta como concluído assim que qualquer cenário é escolhido (os
// campos extras são registro de apoio, não bloqueiam, mesmo critério da
// referência para o tipo "radio").
function isItemConcluido(item) {
  if (item.tipo === "condicional") {
    if (!item.radioValue) return false;
    const subitens = item.branches[item.radioValue] || [];
    return subitens.length > 0 && subitens.every((s) => s.concluido);
  }
  if (item.tipo === "radio") {
    return !!item.radioValue;
  }
  return !!item.concluido;
}

function countOpenQuestions() {
  let n = 0;
  planoItems.forEach((item) => {
    if (item.openQuestion) n++;
    if (item.tipo === "condicional") {
      Object.values(item.branches).forEach((subitens) => {
        subitens.forEach((s) => {
          if (s.openQuestion) n++;
        });
      });
    }
  });
  riscos.forEach((r) => {
    if (r.openQuestion) n++;
  });
  return n;
}

// Estado de expandir/recolher por item (independente do progresso) — todos
// começam expandidos. "Expandir/recolher tudo" na topbar liga/desliga em
// bloco; o chevron por item alterna individualmente. Só se aplica a itens
// "normais" (condicional/radio não têm corpo recolhível, já são compactos).
const expandedIds = new Set(planoItems.filter((i) => !i.tipo).map((i) => i.id));
let allExpanded = true;

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// --- Persistência via localStorage (2026-08-04, 2ª revisão) ---
// A referência (docs/submissions/timeline-submission-finep-digital.html)
// persiste percorrendo todo elemento [data-persist] do DOM. Aqui a tela já
// é 100% renderizada a partir de um modelo de dados em JS (identificacao/
// edital/planoItems), então é mais direto (e mais robusto a mudanças de
// markup) serializar esse modelo inteiro, em vez de percorrer o DOM.
const STORAGE_KEY = "ff-a042-plano-submissao-v1";
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ identificacao, edital, planoItems }));
  } catch (e) {
    /* localStorage indisponível (modo privado, quota) — protótipo segue funcionando sem persistir */
  }
}
function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.identificacao) Object.assign(identificacao, saved.identificacao);
    if (saved.edital) Object.assign(edital, saved.edital);
    if (Array.isArray(saved.planoItems)) planoItems = saved.planoItems;
  } catch (e) {
    /* estado salvo corrompido/de uma versão anterior — segue com os dados mockados */
  }
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

// --- Identificação do proponente ---
function renderIdentificacao() {
  document.getElementById("id-organizacao").value = identificacao.organizacao;
  document.getElementById("id-cnpj").value = identificacao.cnpj;
  document.getElementById("id-parceira").value = identificacao.parceira;
  document.getElementById("id-responsavel").value = identificacao.responsavel;
}

const IDENTIFICACAO_FIELD_MAP = {
  "id-organizacao": "organizacao",
  "id-cnpj": "cnpj",
  "id-parceira": "parceira",
  "id-responsavel": "responsavel",
};
document.getElementById("identificacao").addEventListener("input", (event) => {
  const key = IDENTIFICACAO_FIELD_MAP[event.target.id];
  if (!key) return;
  identificacao[key] = event.target.value;
  saveState();
});

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
  riscos.forEach((r) => {
    const li = document.createElement("li");
    const qBadge = r.openQuestion ? '<span class="badge badge-q" title="Pergunta em aberto">[?]</span> ' : "";
    li.innerHTML = qBadge + escHtml(r.texto);
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
// associados ao ESTÁGIO ATUAL do edital estão concluídos (ver
// isItemConcluido(), que também cobre os itens condicional/radio), havendo
// ao menos 1 essencial nesse estágio. Itens de outros estágios (ou não
// essenciais, em qualquer estágio) nunca entram nessa conta. Fora dessas 3
// transições não há sugestão — esta tela nunca move o edital sozinha, só
// sugere uma ação de um clique.
function itensDoEstagioAtual() {
  return planoItems.filter((i) => i.estagio === edital.status);
}

function computeSuggestion() {
  const proximo = PROXIMO_ESTAGIO[edital.status];
  if (!proximo) return null;
  const essenciais = itensDoEstagioAtual().filter((i) => i.essencial);
  if (essenciais.length > 0 && essenciais.every(isItemConcluido)) {
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

// --- Barra de resumo/veredito no topo (gate + prazo + pendências +
// perguntas em aberto) — visão de 3 segundos sem rolar a página. O veredito
// reflete os itens ESSENCIAIS do grupo do ESTÁGIO ATUAL do edital (mesmo
// gate que habilita a sugestão de avanço acima).
function gateStatus() {
  const essenciais = itensDoEstagioAtual().filter((i) => i.essencial);
  const done = essenciais.filter(isItemConcluido).length;
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
  } else {
    const gs = gateStatus();
    badge.textContent = gs.complete ? "🟢 Habilitado" : `🔴 Pendente (${gs.done}/${gs.total})`;
    badge.className = "value verdict " + (gs.complete ? "verdict-go" : "verdict-pending");
    pendEl.textContent = gs.total - gs.done;
  }
  document.getElementById("open-questions-count").textContent = countOpenQuestions();
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
  const concluidos = planoItems.filter(isItemConcluido).length;
  const partes = [`${concluidos} de ${total} itens concluídos (todos os estágios)`];
  if (ESTAGIOS_PLANO.includes(edital.status)) {
    const essenciais = itensDoEstagioAtual().filter((i) => i.essencial);
    if (essenciais.length > 0) {
      const essenciaisConcluidos = essenciais.filter(isItemConcluido).length;
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
  saveState();
  showToast(`Estágio movido para ${STATUS_LABEL[edital.status]}`);
});

// --- Resumo executivo: identificação + dados do edital + pendências do
// estágio atual ---
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
  const pendentes = itensDoEstagioAtual().filter((i) => i.essencial && !isItemConcluido(i));
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

// --- Campos opcionais por item (extra estruturado / observação livre) ---
function renderExtraSlot(item) {
  if (!item.extra) return "";
  const value = item.extraValor || "";
  if (item.extra.type === "select") {
    const opts = ['<option value=""></option>']
      .concat(item.extra.options.map((o) => `<option value="${escAttr(o.value)}"${o.value === value ? " selected" : ""}>${escHtml(o.label)}</option>`))
      .join("");
    return `<label class="mini"><span>${escHtml(item.extra.label)}</span><select class="item-extra-input">${opts}</select></label>`;
  }
  return `<label class="mini"><span>${escHtml(item.extra.label)}</span><input type="${item.extra.type}" class="item-extra-input" value="${escAttr(value)}"></label>`;
}

function renderTextareaSlot(item) {
  if (!item.textarea) return "";
  const value = item.observacao || "";
  return `<label class="mini"><span>${escHtml(item.textarea.label)}</span><textarea class="item-textarea-input" rows="2">${escHtml(value)}</textarea></label>`;
}

function badgesHTML(item) {
  const tipo = item.essencial
    ? '<span class="badge badge-e" title="Essencial para elegibilidade">Essencial</span>'
    : '<span class="badge badge-c" title="Informativo — não bloqueia o avanço de estágio">Informativo</span>';
  const aberta = item.openQuestion ? ' <span class="badge badge-q" title="Pergunta em aberto — confirme antes de dar como resolvido">[?]</span>' : "";
  return tipo + aberta;
}

function didaticoHTML(item) {
  if (!item.leigo && !item.comoPreencher) return "";
  const leigoP = item.leigo ? `<p class="leigo">💬 <strong>Em outras palavras:</strong> ${escHtml(item.leigo)}</p>` : "";
  const comoP = item.comoPreencher ? `<p class="comofazer">🧭 <strong>Como preencher:</strong> ${escHtml(item.comoPreencher)}</p>` : "";
  return `<div class="didatico">${leigoP}${comoP}</div>`;
}

// --- Construção de cada <li> do plano — 3 formatos (normal via <template>
// clonado; condicional e radio via HTML montado em JS, mesmo mecanismo da
// referência, sem template estático porque a forma varia por item). ---
const planoItemTemplate = document.getElementById("plano-item-template");

function buildNormalItemLi(item) {
  const fragment = planoItemTemplate.content.cloneNode(true);
  const li = fragment.querySelector(".plano-item");
  li.dataset.id = item.id;
  li.classList.toggle("concluido", item.concluido);

  fragment.querySelector(".item-concluido").checked = item.concluido;
  fragment.querySelector(".item-desc").textContent = item.descricao;

  const linkEl = fragment.querySelector(".item-link");
  if (item.link) {
    linkEl.textContent = item.link.text;
    linkEl.href = item.link.href;
    linkEl.classList.remove("hidden");
  }

  fragment.querySelector(".badge-essencial").classList.toggle("hidden", !item.essencial);
  fragment.querySelector(".badge-informativo").classList.toggle("hidden", !!item.essencial);
  fragment.querySelector(".badge-aberta").classList.toggle("hidden", !item.openQuestion);

  const expanded = expandedIds.has(item.id);
  fragment.querySelector(".item-toggle").textContent = expanded ? "▾" : "▸";
  const body = fragment.querySelector(".item-body");
  body.hidden = !expanded;

  const didaticoWrap = fragment.querySelector(".didatico");
  const leigoP = fragment.querySelector(".leigo");
  const comofazerP = fragment.querySelector(".comofazer");
  if (item.leigo || item.comoPreencher) {
    didaticoWrap.classList.remove("hidden");
    leigoP.classList.toggle("hidden", !item.leigo);
    if (item.leigo) leigoP.querySelector(".leigo-text").textContent = item.leigo;
    comofazerP.classList.toggle("hidden", !item.comoPreencher);
    if (item.comoPreencher) comofazerP.querySelector(".comofazer-text").textContent = item.comoPreencher;
  } else {
    didaticoWrap.classList.add("hidden");
  }

  fragment.querySelector(".item-extra-slot").innerHTML = renderExtraSlot(item);
  fragment.querySelector(".item-textarea-slot").innerHTML = renderTextareaSlot(item);

  fragment.querySelector(".item-resp").value = item.responsavel || "";
  fragment.querySelector(".item-concluido-em").value = item.concluidoEm || "";

  const docrefWrap = fragment.querySelector(".item-docref");
  docrefWrap.classList.toggle("hidden", !item.concluido);
  fragment.querySelector(".item-docref-input").value = item.docRef || "";

  return li;
}

function buildCondicionalItemLi(item) {
  const li = document.createElement("li");
  li.className = "plano-item condicional-item";
  li.dataset.id = item.id;

  const radiosHTML = item.radioOptions
    .map(
      (o) =>
        `<label class="radio-opt"><input type="radio" name="${item.id}-radio" class="item-condicional-radio" value="${escAttr(o.value)}"${item.radioValue === o.value ? " checked" : ""}><span>${escHtml(o.label)}</span></label>`
    )
    .join("");

  const branchesHTML = Object.keys(item.branches)
    .map((key) => {
      const visible = item.radioValue === key;
      const subitensHTML = item.branches[key]
        .map((sub) => {
          const qBadge = sub.openQuestion ? ' <span class="badge badge-q" title="Pergunta em aberto">[?]</span>' : "";
          return `<label class="crit-sub"><input type="checkbox" class="item-branch-check" data-branch-id="${sub.id}"${sub.concluido ? " checked" : ""}><span>${escHtml(sub.label)}${qBadge}</span></label>`;
        })
        .join("");
      return `<div class="branch${visible ? "" : " hidden"}" data-branch="${key}">${subitensHTML}</div>`;
    })
    .join("");

  li.innerHTML = `<p class="crit-label"><strong>${escHtml(item.descricao)}</strong> ${badgesHTML(item)}</p>${didaticoHTML(item)}<div class="radio-row">${radiosHTML}</div>${branchesHTML}`;
  return li;
}

function buildRadioItemLi(item) {
  const li = document.createElement("li");
  li.className = "plano-item radio-item";
  li.dataset.id = item.id;

  const radiosHTML = item.radioOptions
    .map(
      (o) =>
        `<label class="radio-opt"><input type="radio" name="${item.id}-radio" class="item-radio-scenario" value="${escAttr(o.value)}"${item.radioValue === o.value ? " checked" : ""}><span>${escHtml(o.label)}</span></label>`
    )
    .join("");

  const extrasHTML = (item.extras || [])
    .map((f) => {
      const val = (item.extraValores && item.extraValores[f.id]) || "";
      return `<label class="mini"><span>${escHtml(f.label)}</span><input type="${f.type}" class="item-radio-extra" data-extra-id="${f.id}" value="${escAttr(val)}"></label>`;
    })
    .join("");

  li.innerHTML =
    `<p class="crit-label"><strong>${escHtml(item.descricao)}</strong> ${badgesHTML(item)}</p>${didaticoHTML(item)}<div class="radio-row">${radiosHTML}</div>` +
    (extrasHTML ? `<div class="item-extras-row">${extrasHTML}</div>` : "");
  return li;
}

function buildItemLi(item) {
  if (item.tipo === "condicional") return buildCondicionalItemLi(item);
  if (item.tipo === "radio") return buildRadioItemLi(item);
  return buildNormalItemLi(item);
}

// --- Lista do plano de submissão, agrupada pelos 4 estágios (FR-033/FR-038,
// 2026-08-04) ---
// planoGroups é o wrapper de TODAS as 4 <ul class="plano-list"> (uma por
// estágio, ver index.html) — a delegação de eventos fica nele em vez de em
// cada <ul> individual, então change/input/click continuam funcionando
// para item de qualquer grupo sem precisar de 4 listeners repetidos.
const planoGroups = document.getElementById("plano-groups");

function renderPlano() {
  ESTAGIOS_PLANO.forEach((estagio) => {
    const list = document.querySelector(`.plano-list[data-estagio="${estagio}"]`);
    list.innerHTML = "";
    const itens = planoItems.filter((i) => i.estagio === estagio);

    itens.forEach((item) => list.appendChild(buildItemLi(item)));

    if (itens.length === 0) {
      list.innerHTML = '<li class="empty-group">Nenhum item associado a este estágio ainda.</li>';
    }

    const concluidos = itens.filter(isItemConcluido).length;
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
// perder foco durante digitação). Radios de item condicional/radio também
// forçam re-render (mostrar/ocultar branch, refletir no gate) — evento
// discreto (clique), sem risco de perder foco de digitação.
planoGroups.addEventListener("change", (event) => {
  const target = event.target;
  const li = target.closest(".plano-item");
  if (!li) return;
  const item = planoItems.find((i) => i.id === li.dataset.id);
  if (!item) return;

  if (target.classList.contains("item-concluido")) {
    item.concluido = target.checked;
    renderPlano();
    if (item.concluido) {
      planoGroups.querySelector(`.plano-item[data-id="${item.id}"] .item-docref-input`)?.focus();
    }
    saveState();
    return;
  }
  if (target.classList.contains("item-concluido-em")) {
    item.concluidoEm = target.value;
    saveState();
    return;
  }
  if (target.classList.contains("item-condicional-radio")) {
    item.radioValue = target.value;
    renderPlano();
    saveState();
    return;
  }
  if (target.classList.contains("item-branch-check")) {
    const branchId = target.dataset.branchId;
    const subitem = item.branches[item.radioValue]?.find((s) => s.id === branchId);
    if (subitem) subitem.concluido = target.checked;
    renderPlano();
    saveState();
    return;
  }
  if (target.classList.contains("item-radio-scenario")) {
    item.radioValue = target.value;
    renderPlano();
    saveState();
    return;
  }
  if (target.classList.contains("item-extra-input") && target.tagName === "SELECT") {
    item.extraValor = target.value;
    saveState();
  }
});

// Digitar em referência de documento / responsável / campo extra /
// observação não precisa re-renderizar os grupos (perderia o foco do
// campo) — só atualiza o dado em memória e persiste.
planoGroups.addEventListener("input", (event) => {
  const target = event.target;
  const li = target.closest(".plano-item");
  if (!li) return;
  const item = planoItems.find((i) => i.id === li.dataset.id);
  if (!item) return;

  if (target.classList.contains("item-docref-input")) {
    item.docRef = target.value;
  } else if (target.classList.contains("item-resp")) {
    item.responsavel = target.value;
  } else if (target.classList.contains("item-extra-input")) {
    item.extraValor = target.value;
  } else if (target.classList.contains("item-textarea-input")) {
    item.observacao = target.value;
  } else if (target.classList.contains("item-radio-extra")) {
    item.extraValores = item.extraValores || {};
    item.extraValores[target.dataset.extraId] = target.value;
  } else {
    return;
  }
  saveState();
});

// Expandir/recolher por item (chevron) — não mexe no estado de conclusão.
// Só existe em itens normais (condicional/radio não têm .item-toggle).
planoGroups.addEventListener("click", (event) => {
  const btn = event.target.closest(".item-toggle");
  if (!btn) return;
  const li = btn.closest(".plano-item");
  const id = li.dataset.id;
  if (expandedIds.has(id)) expandedIds.delete(id);
  else expandedIds.add(id);
  renderPlano();
});

// Expandir/recolher tudo (topbar) — liga/desliga em bloco (só itens normais
// têm corpo recolhível).
document.getElementById("btn-toggle-all").addEventListener("click", () => {
  allExpanded = !allExpanded;
  expandedIds.clear();
  if (allExpanded) planoItems.filter((i) => !i.tipo).forEach((i) => expandedIds.add(i.id));
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
  saveState();
  newItemDesc.focus();
});

// --- Exportação em PDF (simulada — protótipo não gera arquivo real; ver
// nota no topo do index.html sobre por que isso continua simulado) ---
document.getElementById("export-resumo").addEventListener("click", () => {
  showToast("Exportação simulada: resumo executivo em PDF (protótipo não gera arquivo real).");
});
document.getElementById("export-plano").addEventListener("click", () => {
  showToast("Exportação simulada: plano de submissão em PDF (protótipo não gera arquivo real).");
});
document.getElementById("export-tudo").addEventListener("click", () => {
  showToast("Exportação simulada: página completa em PDF (protótipo não gera arquivo real).");
});

restoreState();
renderIdentificacao();
renderEdital();
renderRiscosEPosAprovacao();
renderPlano();
updateCountdown();
setInterval(updateCountdown, 60000);
