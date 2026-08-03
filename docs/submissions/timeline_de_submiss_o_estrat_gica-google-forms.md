# Roteiro para Google Forms — FINEP Mais Inovação Saúde, Rodada 2

> **O que é isto**: um roteiro para **montar manualmente** um Google Forms equivalente ao checklist interativo `timeline_de_submiss_o_estrat_gica.html`, útil para compartilhar partes específicas (ex.: mandar só a seção de Orçamento para o contador preencher, sem precisar abrir o HTML inteiro). Não existe integração automática com a API do Google Forms neste projeto — copie as perguntas abaixo ao criar o Form manualmente.
>
> **Limitação importante**: o Google Forms **não replica o portão de elegibilidade** do checklist HTML (o bloqueio do botão "pronto para envio" até a Fase 1 estar 100% resolvida) — Forms não suporta esse tipo de "E lógico" sobre dezenas de campos. Este roteiro serve para **coleta e compartilhamento pontual de respostas**, não substitui o HTML como ferramenta de acompanhamento gated.

## Configuração do Formulário

- **Título**: Checklist de Submissão — FINEP Saúde Empresas, Rodada 2
- **Descrição**: "Checklist de apoio para a submissão ao edital FINEP 'Mais Inovação Brasil – Rodada 2 – Saúde Empresas' (prazo 31/08/2026, 17h Brasília — [?] Regulamento diz 18h00, confirmar com a Finep). Não é o formulário oficial da Finep — preencha a proposta real em financiamento.finep.gov.br."
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
| Linha temática / grupo de concorrência escolhido | Múltipla escolha (I a VI — nomes completos no HTML) | 💬 Precisa ser compatível com o objeto social da empresa. |
| Sede da empresa é no território nacional? | Múltipla escolha (Sim/Não) | 🧭 Confirme no Cartão CNPJ. |
| A principal atividade de P&D do grupo econômico está no Brasil? | Múltipla escolha (Sim/Não) | 💬 Não vale ser mera tropicalização de solução da matriz estrangeira. |
| Arranjo escolhido | Múltipla escolha (Simples / Em Rede) | 💬 Simples = só sua empresa + 1 ICT. Rede = sua empresa + ≥2 coexecutoras + 1 ICT, com regras extras (ver HTML). |
| Nome da ICT parceira | Resposta curta | |
| Anuência formal da ICT já obtida? | Múltipla escolha (Sim/Não) | 🧭 Precisa ser carta assinada pelo representante legal da ICT, não só um "sim" verbal. |
| Patrimônio líquido positivo? | Múltipla escolha (Sim/Não) | 🧭 Peça o valor ao contador no último Balanço fechado. |
| Qual dos 3 testes de resultado operacional se aplica? | Múltipla escolha (b.1 / b.2 / b.3 — descrições no HTML) | 🧭 Peça ao contador Resultado Operacional, Endividamento Oneroso e Ativo Total para decidir. |
| Valor solicitado à Finep (R$) | Resposta curta | 💬 Teto varia por linha temática: R$15M (I/II), R$10M (III), R$30M (IV), R$15M (V/VI); mínimo R$5M para todas. |
| Percentual de contrapartida (%) | Resposta curta | 🧭 Depende do porte (faturamento) e do arranjo — tabela no Anexo 1. |
| Prazo de execução do projeto (meses) | Resposta curta | 💬 Máximo 36 meses. |

## Seção 3 — Fase 2: Modelagem Técnica

| Pergunta | Tipo de campo | Texto de ajuda |
|---|---|---|
| TRL entrada → saída | Resposta curta | 💬 Faixa 3 a 7 para este edital. |
| FAP preenchido e consistente (equipe, metodologia, TRL, metas, orçamento)? | Múltipla escolha (Sim/Não) | 💬 Inconsistência entre as partes do FAP reprova, mesmo com boa ideia. |
| Link do vídeo (até 10 min) | Resposta curta | 🧭 Cobre (i) inovação/relevância e (ii) capacidade técnica/infraestrutura/parceiros. |
| Currículos Lattes de toda a equipe anexados? | Múltipla escolha (Sim/Não) | 🧭 Peça a cada integrante para atualizar o Lattes antes de submeter. |
| Se Linha Temática V: AFE-ANVISA anexado? | Múltipla escolha (Sim/Não/Não se aplica) | 💬 Só se aplica a quem escolheu a linha de Dispositivos Médicos. |

## Seção 4 — Fase 3: Orçamento

| Pergunta | Tipo de campo | Texto de ajuda |
|---|---|---|
| Balanço + DRE assinados por contador (CRC) anexados? | Múltipla escolha (Sim/Não) | 🧭 Peça ao contador com antecedência. |
| Se optante pelo SIMPLES, documentação contábil enviada mesmo assim? | Múltipla escolha (Sim/Não/Não se aplica) | 💬 Não há isenção para o SIMPLES neste edital. |
| Alguma despesa vedada (pró-labore, PLR, etc.) no orçamento? | Múltipla escolha (Sim/Não) | 🧭 Revise linha por linha antes de responder — a resposta esperada aqui é "Não". |
| Se Arranjo em Rede: ≥5% do orçamento para a(s) ICT(s)? | Múltipla escolha (Sim/Não/Não se aplica) | 🧭 Separe a rubrica "Serviços de Consultoria" e confira o percentual. |
| 3 cotações válidas obtidas? | Múltipla escolha (Sim/Não) | ⚠ Não confirmado no Regulamento/Anexo 1 lidos — pode estar só no Manual da Plataforma; mais seguro já ir juntando. |

## Seção 5 — Fase 4: Revisão Final e Submissão

| Pergunta | Tipo de campo | Texto de ajuda |
|---|---|---|
| Cadastro prévio feito em cadastro.finep.gov.br? | Múltipla escolha (Sim/Não) | 🧭 Proponente preenche um segmento a mais que coexecutoras. |
| Proposta preenchida em financiamento.finep.gov.br? | Múltipla escolha (Sim/Não) | |
| Consentimento LGPD da equipe obtido? | Múltipla escolha (Sim/Não) | 🧭 Um e-mail simples de confirmação de cada integrante já basta. |
| A empresa está dentro do limite de propostas (2 no total, 1 por grupo de concorrência)? | Múltipla escolha (Sim/Não) | |
| Outras propostas em andamento (se houver) | Parágrafo | |
| Data/hora planejada de envio | Data e hora | 💬 Deixe pelo menos 2 dias de folga antes do prazo oficial. |

---

*Gerado a partir de `docs/submissions/timeline_de_submiss_o_estrat_gica.html`. Fonte primária: `docs/finep-ref/06_02_2026_Saude_Regulamento-1.pdf` e `06_02_2026_Saude_Anexo1.pdf`.*
