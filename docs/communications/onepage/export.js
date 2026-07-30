function drawBlock(doc, x, y, width, heading, body, isList) {
  doc.setFont(undefined, "bold");
  doc.setFontSize(10);
  doc.setTextColor(58, 95, 217);
  doc.text(heading.toUpperCase(), x, y);

  let cursorY = y + 5;
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.setTextColor(26, 29, 36);

  if (isList) {
    body.forEach((item) => {
      const lines = doc.splitTextToSize("• " + item, width);
      doc.text(lines, x, cursorY);
      cursorY += lines.length * 4.2 + 1.5;
    });
  } else {
    const lines = doc.splitTextToSize(body, width);
    doc.text(lines, x, cursorY);
    cursorY += lines.length * 4.2;
  }

  return cursorY - y;
}

function exportPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const marginX = 18;
  const pageWidth = 210;
  const contentWidth = pageWidth - marginX * 2;
  const colGap = 8;
  const colWidth = (contentWidth - colGap) / 2;
  const col1X = marginX;
  const col2X = marginX + colWidth + colGap;

  doc.setFont(undefined, "bold");
  doc.setFontSize(9);
  doc.setTextColor(58, 95, 217);
  doc.text("FRAMEWORKFOMENTO", marginX, 20);

  doc.setFontSize(18);
  doc.setTextColor(26, 29, 36);
  const titleLines = doc.splitTextToSize(
    "Framework de Aprovação em Editais de Fomento",
    contentWidth
  );
  doc.text(titleLines, marginX, 28);
  let y = 28 + titleLines.length * 7;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(90, 96, 112);
  const ledeLines = doc.splitTextToSize(
    "Projeto open-source para facilitar a vida de captadores de recurso.",
    contentWidth
  );
  doc.text(ledeLines, marginX, y + 2);
  y += 2 + ledeLines.length * 5 + 3;

  doc.setDrawColor(58, 95, 217);
  doc.setLineWidth(0.6);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  const rowStartY = y;
  const h1 = drawBlock(
    doc,
    col1X,
    rowStartY,
    colWidth,
    "Problema",
    "Captar recursos por edital exige entender critérios de avaliação, organizar documentação, redigir propostas alinhadas e revisar tudo antes da submissão. Boas iniciativas perdem financiamento não por falta de mérito, mas por dificuldades no processo."
  );
  const h2 = drawBlock(
    doc,
    col2X,
    rowStartY,
    colWidth,
    "Solução",
    "Um framework aberto que ajuda captadores de recursos a estruturar, revisar e aumentar as chances de aprovação de propostas em editais de fomento, públicos ou privados."
  );
  const row2Y = rowStartY + Math.max(h1, h2) + 8;

  const h3 = drawBlock(
    doc,
    col1X,
    row2Y,
    colWidth,
    "Objetivos",
    [
      "Reduzir a barreira de entrada para quem busca captar recursos via editais",
      "Sistematizar boas práticas de elaboração, com base nos critérios mais comuns de avaliação",
      "Ser uma ferramenta aberta, gratuita e colaborativa, mantida pela comunidade",
    ],
    true
  );
  const h4 = drawBlock(
    doc,
    col2X,
    row2Y,
    colWidth,
    "Como o projeto é construído",
    "O sistema em si está em estágio inicial — sem requisitos funcionais definidos ainda. O que já existe é o processo: fluxo orientado por spec (Spec Kit), quadro Kanban local e agentes especializados (product-owner, dev, designer, scrum-master, qa, fundraiser) que darão forma ao produto de forma incremental."
  );

  let footerY = row2Y + Math.max(h3, h4) + 10;
  doc.setDrawColor(221, 225, 232);
  doc.setLineWidth(0.3);
  doc.line(marginX, footerY, pageWidth - marginX, footerY);
  footerY += 6;

  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 96, 112);
  doc.text("Status: estágio inicial, aberto a contribuições — licença MIT.", marginX, footerY);
  footerY += 5;
  doc.text("Contribua: abra uma issue ou envie um pull request.", marginX, footerY);

  doc.save("frameworkfomento-resumo.pdf");
}

document.getElementById("export-pdf").addEventListener("click", exportPdf);
