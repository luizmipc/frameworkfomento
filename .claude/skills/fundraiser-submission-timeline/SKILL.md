---
name: "fundraiser-submission-timeline"
description: "Transforma o Regulamento/Anexos reais de um edital de fomento (qualquer instituição — não hardcoded para FINEP) num checklist HTML preenchível, imprimível e com portão de elegibilidade funcional em docs/submissions/, mais um roteiro para montar um Google Forms equivalente. Extrai critérios eliminatórios com âncora de item, valida com o subagente fundraiser duas vezes (antes e depois de construir), e nunca inventa dado que não esteja no documento-fonte. Use quando a intenção for 'preciso de um checklist de submissão real e confiável para este edital'. Para testar UX de protótipo/produção já existente, use /fundraiser-test ou /fundraiser-production-test — este comando é para CRIAR um novo checklist a partir de PDFs de edital."
argument-hint: "<pasta-de-referência-do-edital> [nome-do-arquivo-de-saída.html] — ex.: ref/finep-digital/ timeline-submission-finep-digital.html"
compatibility: "Requires .claude/agents/fundraiser.md, docs/submissions/jspdf.umd.min.js (vendorizado; criado na 1ª execução se ausente), docs/assets/style.css (para o relatório de persona) e uma pasta com os PDFs do Regulamento/Anexos do edital"
metadata:
  author: "frameworkfomento"
  source: ".claude/skills/fundraiser-submission-timeline/SKILL.md"
user-invocable: true
disable-model-invocation: true
---

## User Input

```text
$ARGUMENTS
```

Este comando cria um artefato novo (não corrige um existente) e não
implementa nada na aplicação — o entregável é um checklist HTML autônomo em
`docs/submissions/`, um roteiro de Google Forms companheiro, e um relatório
de validação em `docs/persona/`. Zero invenção: toda exigência (`[L]`) tem
âncora de item do documento-fonte; onde o edital não é claro, o item vira
`[?]`, nunca uma suposição.

## Passo 1 — Ingestão

1. Se `$ARGUMENTS` já traz a pasta de referência e o nome de saída, use-os
   direto. Senão, rode `ls ref/` — as subpastas de `ref/` são o local
   canônico dos PDFs de edital; se houver uma candidata óbvia, confirme com
   o usuário via `AskUserQuestion`; senão, pergunte o caminho direto.
2. Rode `ls` na pasta de referência para listar os PDFs disponíveis
   (Regulamento, Anexos, FAQ). Confirme com `pdfinfo` a contagem de páginas
   de cada um antes de ler, para não perder conteúdo por paginação.
3. Se a pasta não existir ou estiver vazia, informe isso ao usuário e pare
   — não há o que extrair ainda.

## Passo 2 — Extração literal

Leia o Regulamento e os Anexos **por completo** (`Read` com `pages`,
paginando conforme necessário) e extraia, cada afirmação com a âncora do
item de origem:

- Órgão financiador, programa, prazo de submissão exato (data **e** hora,
  fuso horário) e se é fluxo contínuo ou data única.
- A etapa eliminatória de habilitação/elegibilidade **por completo** — todos
  os subitens, não só o primeiro (esse foi o erro da 1ª rodada deste skill:
  cobrir só "elegibilidade da empresa" e esquecer teto de valor,
  contrapartida, prazo de execução, arranjo/parceria obrigatória e o teste
  de capacidade financeira completo).
- Regras de arranjo/parceria obrigatória (ex.: parceria com ICT), com toda
  sub-regra de cada modalidade de arranjo, não só a mais simples.
- Valores mínimo/máximo, percentual de contrapartida (a tabela completa por
  porte/arranjo se houver) e prazo máximo de execução do projeto.
- **Lista nomeada das linhas temáticas/grupos de concorrência** — o nome
  oficial de cada uma, não só o rótulo (I/II/III ou 1/2/3). Isso vira um
  campo de seleção real no checklist, não texto livre — falhar em extrair
  isso por completo foi o gap identificado na 1ª rodada.
- **Documentos exigidos na submissão (Passo/seção "Apresentação das
  Propostas") vs. documentos exigidos só na contratação/pós-aprovação** —
  nunca misturar as duas listas no checklist final; é o erro mais fácil de
  cometer e o mais caro (desinforma sobre o que é urgente agora).
- Riscos e armadilhas processuais explícitos no Regulamento (reenvio
  automático inabilitando proposta anterior, limite de propostas por
  proponente/grupo de concorrência, prorrogação de prazo, mudança de regras
  durante fluxo contínuo, esgotamento de orçamento por grupo de
  concorrência).

Marque `[?]` em qualquer exigência que o documento-fonte não esclarece
(nunca inventar; se o dado provavelmente está num Manual da Plataforma fora
do repo, diga isso explicitamente).

## Passo 3 — Double-check pré-implementação (fundraiser)

Invoque o subagente `fundraiser` (`subagent_type: "fundraiser"`) com um
prompt que inclua:
- A extração completa do Passo 2, organizada por fase proposta do
  checklist.
- Os caminhos dos PDFs-fonte, para ele ler de novo por conta própria (não
  confiar só na sua paráfrase).
- Pedido explícito: confirmar que a etapa eliminatória foi coberta por
  completo (comparar contra o Regulamento item a item, não só validar o que
  já foi extraído), que a separação submissão/contratação está correta, e
  apontar qualquer critério eliminatório real que ficou de fora.

Incorpore os achados antes de seguir para a construção.

## Passo 4 — Construção do HTML

Referência de implementação: `docs/submissions/timeline_de_submiss_o_estrat_gica.html`
(arquitetura validada e aprovada pelo usuário — reusar o padrão, não
reinventar). Gerar `docs/submissions/<nome-de-saída>.html`, self-contained
(sem CDN — CSS local, ícones via Unicode/SVG inline), com:

- **Fase de elegibilidade** com todos os critérios `[E]` extraídos no Passo
  2 — checkboxes simples, grupos condicionais (radio + sub-checklist) para
  regras tipo "arranjo A ou arranjo B", grupos radio para testes
  alternativos (ex.: testes financeiros "ao menos 1 dos 3"). Esta fase é o
  **portão real**: nenhuma fase depende dela para começar (fases
  intermediárias ficam sempre abertas — trabalho em paralelo, como um
  captador de verdade faria, não um bloqueio sequencial artificial), mas o
  botão final de "pronto para envio" só libera com ela 100% resolvida.
- **Fases intermediárias** (modelagem técnica, orçamento, etc., conforme o
  que o edital pedir) sempre abertas.
- **Fase final** com **2º portão**: só libera "pronto para envio" com a
  fase de elegibilidade completa **e** os próprios itens desta fase
  marcados (não confiar só na fase de elegibilidade — foi um bug
  encontrado e corrigido na 1ª rodada).
- **Linhas temáticas como campo de seleção nomeado** (`<select>`), nunca
  texto livre "I–VI" sem dizer o que cada uma é.
- **Cada critério carrega, além do texto literal da exigência + âncora do
  item**: dois blocos curtos adicionais, obrigatórios em todo critério —
  - `💬 Em outras palavras:` uma paráfrase em linguagem simples do que
    aquilo significa na prática, para alguém que não é da área e não leu o
    Regulamento inteiro. (Formulação própria — não precisa de âncora, mas a
    exigência que ela explica precisa ter uma.)
  - `🧭 Como preencher:` passos práticos e didáticos de onde buscar ou como
    obter aquele dado (ex.: "peça ao seu contador o Balanço Patrimonial
    assinado com o nº de registro no CRC", "confirme com a ICT parceira se
    ela topa assinar a carta de anuência antes de prosseguir").
- Bloco de **Riscos** sempre visível (não dentro de nenhuma fase).
- Seção de **Pós-aprovação/Contratação** separada e explicitamente
  não-gated — documentos que só entram depois da aprovação, para não
  confundir com o que é exigido agora.
- Campos "Responsável" e "Concluído em" por critério, identificação do
  proponente com placeholders `<<PREENCHER>>`, persistência via
  `localStorage`, CSS de impressão (`@media print`, `@page`,
  `print-color-adjust: exact` nos checkboxes/inputs).
- Exportação de PDF genuinamente preenchível via AcroForm do jsPDF
  vendorizado (`docs/submissions/jspdf.umd.min.js` — reusar a cópia
  existente; só vendorizar de `docs/communications/onepage/jspdf.umd.min.js`
  se o destino ainda não tiver o arquivo). Campos de checkbox/texto reais
  (`AcroFormCheckBox`/`AcroFormTextField`, `doc.addField(...)`), não texto
  desenhado sem interatividade.

## Passo 5 — Roteiro Google Forms

Não há ferramenta de API do Google Forms disponível — criar um Form ao vivo
exigiria login numa conta Google, ação que só o usuário pode fazer. Em vez
disso, gerar `docs/submissions/<nome-de-saída-sem-extensão>-google-forms.md`:
um roteiro pronto para colar manualmente ao montar o Form, organizado por
fase, cada pergunta com:
- O texto da pergunta (versão simplificada do critério, reaproveitando o
  "💬 Em outras palavras" do Passo 4).
- O tipo de campo sugerido no Google Forms (Caixa de seleção múltipla /
  Resposta curta / Parágrafo / Data / Múltipla escolha).
- O texto de ajuda da pergunta (reaproveitando o "🧭 Como preencher").

O arquivo deve declarar explicitamente, no topo: é um roteiro de montagem
manual (facilita compartilhar partes do checklist — ex.: mandar só a seção
financeira para o contador preencher sem abrir o HTML inteiro); a lógica de
portão Fase-elegibilidade→Fase-final **não é replicável 1:1** no Google
Forms (Forms não suporta um "E lógico" sobre dezenas de campos) — serve
para coleta/compartilhamento pontual, não substitui o checklist HTML gated.

## Passo 6 — Validação pós-implementação (fundraiser)

Invoque o subagente `fundraiser` de novo para testar o HTML já construído:
- Tente carregar no Chrome (a ferramenta `Skill` está disponível para ele
  invocar `claude-in-chrome` sozinho). Se a extensão não conectar, não pare
  — faça revisão por leitura de código, cruzando cada critério contra os
  PDFs-fonte de novo (não confiar na extração do Passo 2 sem reconferir).
- Vista a pele de um captador de recursos real prestes a submeter a este
  edital específico. Confirme que o portão de elegibilidade bloqueia
  corretamente o botão de envio, que os campos didáticos (💬/🧭) realmente
  ajudam alguém leigo, e que nada foi classificado errado entre
  submissão/contratação.
- Produza o relatório em `docs/persona/<nome-de-saída-sem-extensão>.html`
  seguindo o **mesmo template de persona já definido em
  `fundraiser-test/SKILL.md`** (seção "Template do documento de persona" —
  não duplicar o formato, só reaproveitar).

Aplique os achados acionáveis de volta no HTML antes de considerar
concluído.

## Passo 7 — Publicação

Adicione cards em `docs/index.html` § "Outras fontes": o checklist HTML, o
roteiro Google Forms, e o relatório de persona — mesmo padrão visual dos
cards existentes (`<a class="doc-card">` com `<h3>`/`<p>`).

## Passo 8 — Reportar

```
## Checklist de submissão criado (/fundraiser-submission-timeline)

- Edital: <órgão/programa>
- Prazo extraído: <data e hora, com âncora de item>
- Checklist: docs/submissions/<nome>.html
- Roteiro Google Forms: docs/submissions/<nome>-google-forms.md
- Validação fundraiser: docs/persona/<nome>.html
- Achados aplicados: <resumo do que o double-check pré e a validação pós
  encontraram e foi corrigido>
- Perguntas em aberto ([?]): <lista, ou "nenhuma">

Este comando não implementa nem submete nada — o checklist é uma
ferramenta de acompanhamento; a submissão real acontece na plataforma
oficial do financiador.
```

## Passo 9 — Retrospectiva

Rode o procedimento canônico descrito em `kanban-start/SKILL.md` (seção
"Retrospectiva"): pergunte se algo deu errado neste fluxo e, se sim,
registre a lição aprendida no arquivo de agente/skill responsável (nunca em
`speckit-*`/`.specify/`).

## Done When

- [ ] Regulamento/Anexos lidos por completo, etapa eliminatória coberta em
      todos os subitens, linhas temáticas extraídas com nome oficial
- [ ] `fundraiser` validou a extração contra os PDFs antes de construir
- [ ] `docs/submissions/<nome>.html` construído: portão de elegibilidade
      funcional (bloqueia só o veredito de envio, não o trabalho paralelo),
      2º portão na fase final cobrindo seus próprios itens, todo critério
      com 💬/🧭, `localStorage`, impressão, PDF AcroForm real
- [ ] `docs/submissions/<nome>-google-forms.md` gerado, com nota de escopo
- [ ] `fundraiser` testou o HTML construído e produziu
      `docs/persona/<nome>.html`
- [ ] `docs/index.html` (seção "Outras fontes") linka os três artefatos
      novos
- [ ] Nenhum documento de contratação listado como exigência de submissão
- [ ] Retrospectiva rodou ao final
