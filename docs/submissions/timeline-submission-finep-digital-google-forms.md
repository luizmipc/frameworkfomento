# Roteiro para Google Forms — FINEP Mais Inovação Tecnologias Digitais, Rodada 2

> **O que é isto**: um roteiro para **montar manualmente** um Google Forms equivalente ao checklist interativo `timeline-submission-finep-digital.html`, útil para compartilhar partes específicas (ex.: mandar só a seção de Orçamento para o contador preencher, sem precisar abrir o HTML inteiro). Não existe integração automática com a API do Google Forms neste projeto — copie as perguntas abaixo ao criar o Form manualmente.
>
> **Limitação importante**: o Google Forms **não replica o portão de elegibilidade** do checklist HTML (o bloqueio do botão "pronto para envio" até a Fase 1 estar 100% resolvida) — Forms não suporta esse tipo de "E lógico" sobre dezenas de campos. Este roteiro serve para **coleta e compartilhamento pontual de respostas**, não substitui o HTML como ferramenta de acompanhamento gated.

## Configuração do Formulário

- **Título**: Checklist de Submissão — FINEP Tecnologias Digitais, Rodada 2
- **Descrição**: "Checklist de apoio para a submissão ao edital FINEP 'Mais Inovação Brasil – Rodada 2 – Tecnologias Digitais' (prazo 30/09/2026, 17h Brasília). Não é o formulário oficial da Finep — preencha a proposta real em financiamento.finep.gov.br."
- Ative "Dividir em seções" e crie uma seção por fase abaixo.

## Seção 1 — Identificação do proponente

| Pergunta | Tipo de campo |
|---|---|
| Empresa proponente (razão social) | Resposta curta |
| CNPJ | Resposta curta |
| ICT parceira | Resposta curta |
| Responsável pela captação | Resposta curta |

## Seção 2 — Fase 1: Elegibilidade da Empresa Proponente e Habilitação

*Texto de ajuda sugerido no topo da seção: "Todos os itens abaixo são eliminatórios — se algum não puder ser respondido 'Sim' hoje, vale parar e resolver isso antes de investir nas demais fases."*

| Pergunta | Tipo de campo | Texto de ajuda |
|---|---|---|
| Empresa é pessoa jurídica com fins lucrativos? | Múltipla escolha (Sim/Não) | 💬 A Finep só aceita empresas com fins lucrativos — ONGs, associações, fundações, cooperativas e MEI ficam de fora. 🧭 Confira o tipo societário no Contrato Social ou Estatuto. |
| Atividade do projeto não consta na lista de exclusão da Finep? | Múltipla escolha (Sim/Não) | 🧭 Busque por palavras-chave do seu setor na lista oficial (link no site da Finep) antes de responder. |
| Data de registro na Junta Comercial/RCPJ | Data | 💬 Precisa ser até 31/12 do ano anterior ao envio da proposta. |
| Atividade operacional comprovada nos últimos 12 meses? | Múltipla escolha (Sim/Não) | 🧭 Peça ao contador as Demonstrações Financeiras dos últimos 12 meses. |
| Linha temática / grupo de concorrência escolhido | Múltipla escolha (as 8 opções: 1.1, 1.2, 1.3, 2, 3, 4, 5, 6 — nomes completos no HTML) | 💬 Precisa ser compatível com o objeto social da empresa. |
| Sede da empresa é no território nacional? | Múltipla escolha (Sim/Não) | 🧭 Confirme no Cartão CNPJ. |
| A principal atividade de P&D do grupo econômico está no Brasil? | Múltipla escolha (Sim/Não) | 💬 Etapas pontuais (certificação, prototipagem, testes) podem ocorrer fora do país sem problema. |
| Documentos e link de vídeo da seção 6 já enviados/anexados? | Múltipla escolha (Sim/Não) | 🧭 Monte uma checklist própria de anexos e confira um por um antes de enviar. |
| Arranjo escolhido | Múltipla escolha (Simples / Em Rede) | 💬 Simples = só sua empresa + 1 ICT. Rede = sua empresa + ≥2 coexecutoras + 1 ICT, com regras extras (ver HTML). |
| Nome da ICT parceira | Resposta curta | |
| Anuência formal da ICT já obtida? | Múltipla escolha (Sim/Não) | 🧭 Precisa ser carta assinada pelo representante legal da ICT, não só um "sim" verbal. |
| Patrimônio líquido positivo? | Múltipla escolha (Sim/Não) | 🧭 Peça o valor ao contador no último Balanço fechado. |
| Qual dos 3 testes de resultado operacional se aplica? | Múltipla escolha (b.1 / b.2 / b.3 — descrições no HTML) | 🧭 Peça ao contador Resultado Operacional, Endividamento Oneroso e Ativo Total para decidir. |
| Valor solicitado à Finep (R$) | Resposta curta | 💬 Teto por arranjo: R$25M (Simples) ou R$40M (Rede); mínimo R$5M para ambos. |
| Percentual de contrapartida (%) | Resposta curta | 🧭 Depende do porte (faturamento) e do arranjo — tabela no Anexo 1. |
| Prazo de execução do projeto (meses) | Resposta curta | 💬 Máximo 36 meses. |
| TRL de entrada → saída | Resposta curta | 💬 Faixa 3 a 8; quem mira TRL 8 precisa começar entre 3 e 6. |

## Seção 3 — Fase 2: Modelagem Técnica e Análise de Mérito

| Pergunta | Tipo de campo | Texto de ajuda |
|---|---|---|
| FAP preenchido e consistente (equipe, metodologia, TRL, metas, orçamento)? | Múltipla escolha (Sim/Não) | 💬 Inconsistência entre as partes do FAP reprova, mesmo com boa ideia. |
| Link do vídeo (até 10 min) | Resposta curta | 🧭 Teste o link numa aba anônima — não pode pedir senha/login/expirar. |
| Currículos Lattes de toda a equipe anexados? | Múltipla escolha (Sim/Não) | 🧭 Peça a cada integrante para atualizar o Lattes antes de submeter. |
| Observações sobre TRL/arranjo declarados no FAP (dupla checagem do Regulamento) | Parágrafo | ⚠ O Regulamento cita a checagem de TRL e de arranjo tanto na Habilitação quanto na Análise de Mérito, sem esclarecer se é redundante — garanta que os dados batam em ambos os lugares. |

## Seção 4 — Fase 3: Orçamento

| Pergunta | Tipo de campo | Texto de ajuda |
|---|---|---|
| Balanço + DRE assinados por contador (CRC) anexados? | Múltipla escolha (Sim/Não) | 🧭 Se a empresa for de grupo econômico, pergunte ao contador se a documentação consolidada também é exigida. |
| Se optante pelo SIMPLES, documentação contábil enviada mesmo assim? | Múltipla escolha (Sim/Não/Não se aplica) | 💬 Não há isenção para o SIMPLES neste edital. |
| Alguma despesa vedada (pró-labore, PLR, etc.) no orçamento? | Múltipla escolha (Sim/Não) | 🧭 Revise linha por linha antes de responder — a resposta esperada aqui é "Não". |
| Se Arranjo em Rede: ≥5% do orçamento para a(s) ICT(s)? | Múltipla escolha (Sim/Não/Não se aplica) | 🧭 Separe a rubrica "Serviços de Consultoria" e confira o percentual. |

## Seção 5 — Fase 4: Revisão Final e Submissão

| Pergunta | Tipo de campo | Texto de ajuda |
|---|---|---|
| Cadastro prévio feito em cadastro.finep.gov.br? | Múltipla escolha (Sim/Não) | 🧭 Proponente preenche um segmento a mais que coexecutoras. |
| Proposta preenchida em financiamento.finep.gov.br? | Múltipla escolha (Sim/Não) | |
| Consentimento LGPD da equipe obtido? | Múltipla escolha (Sim/Não) | 🧭 Um e-mail simples de confirmação de cada integrante já basta. |
| A empresa está dentro do limite de propostas (2 no total, 1 por grupo de concorrência)? | Múltipla escolha (Sim/Não) | ⚠ O Regulamento não deixa claro se as sub-linhas 1.1/1.2/1.3 contam como grupos separados — confirme com o canal oficial se for submeter mais de uma proposta na Linha 1. |
| Outras propostas em andamento (se houver) | Parágrafo | |
| Data/hora planejada de envio | Data e hora | 💬 Deixe pelo menos 2 dias de folga antes do prazo oficial (30/09/2026, 17h). |

---

*Gerado a partir de `docs/submissions/timeline-submission-finep-digital.html`. Fonte primária: `ref/finep-ref-digital/12_03_2026_TA_Regulamento.pdf` e `12_03_2026_TA_A1-3.pdf` (Anexo 1).*
