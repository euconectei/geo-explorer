import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';

// Dimensões A4 landscape em pontos
const W = 841.89;
const H = 595.28;

// Paleta de cores
const COR = {
  fundo:      '#0f172a',
  bordaForte: '#38bdf8',
  bordaFraca: '#1d4ed8',
  titulo:     '#f8fafc',
  destaque:   '#38bdf8',
  subTexto:   '#94a3b8',
  boxFundo:   '#1e3a5f',
  boxBorda:   '#38bdf8',
  boxTexto:   '#f8fafc',
  boxSub:     '#7dd3fc',
  modTitulo:  '#38bdf8',
  modItem:    '#cbd5e1',
  rodape:     '#475569',
  rodapeDim:  '#334155',
};

/**
 * Gera um arquivo PDF do certificado.
 * Usa coordenadas absolutas em todos os elementos.
 *
 * @param {Object} dados
 * @param {string} dados.nomeAluno
 * @param {string} dados.nomeTrilha
 * @param {string} dados.nivel
 * @param {string} dados.duracao
 * @param {number} dados.qtdModulos
 * @param {string[]} dados.modulos
 * @param {string} dados.cargaHoraria
 * @param {string} dados.dataEmissao
 * @param {string} dados.codigo
 * @param {string} [outputDir]
 * @returns {Promise<string>}
 */
export function gerarPDF(dados, outputDir) {
  const pastaDestino = outputDir ?? join(process.cwd(), 'certificados');
  mkdirSync(pastaDestino, { recursive: true });

  const nomeArquivo = `certificado-${dados.codigo}.pdf`;
  const caminhoArquivo = join(pastaDestino, nomeArquivo);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',   // A4 landscape = W:841.89 x H:595.28
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      bufferPages: true,
      autoFirstPage: true,
    });

    const stream = createWriteStream(caminhoArquivo);
    doc.pipe(stream);

    // ── 1. Fundo ────────────────────────────────────────────────────────────
    doc.rect(0, 0, W, H).fill(COR.fundo);

    // ── 2. Bordas decorativas ───────────────────────────────────────────────
    doc.rect(16, 16, W - 32, H - 32).lineWidth(2.5).stroke(COR.bordaForte);
    doc.rect(23, 23, W - 46, H - 46).lineWidth(0.8).stroke(COR.bordaFraca);

    // ── 3. Cabeçalho ────────────────────────────────────────────────────────
    centralizado(doc, 'Helvetica-Bold', 13, COR.destaque, 'GEO-EXPLORER', 46);
    centralizado(doc, 'Helvetica', 8, COR.boxSub, 'Explorador de Trilhas de Aprendizagem', 63);
    hLine(doc, 80, COR.bordaFraca, 0.7);

    // ── 4. Título ───────────────────────────────────────────────────────────
    centralizado(doc, 'Helvetica-Bold', 22, COR.titulo, 'CERTIFICADO DE CONCLUSÃO', 95);

    // ── 5. "Certificamos que" ───────────────────────────────────────────────
    centralizado(doc, 'Helvetica', 10, COR.subTexto, 'Certificamos que', 133);

    // ── 6. Nome do aluno ────────────────────────────────────────────────────
    centralizado(doc, 'Helvetica-Bold', 26, COR.destaque, dados.nomeAluno.toUpperCase(), 150);

    const linhaY = 184;
    doc.moveTo(W / 2 - 180, linhaY).lineTo(W / 2 + 180, linhaY)
       .lineWidth(0.8).stroke(COR.destaque);

    // ── 7. "concluiu com êxito" ─────────────────────────────────────────────
    centralizado(doc, 'Helvetica', 10, COR.subTexto,
      'concluiu com êxito a trilha de aprendizagem:', linhaY + 10);

    // ── 8. Caixa da trilha ──────────────────────────────────────────────────
    const nivelLabel = {
      iniciante:    'Iniciante',
      intermediario:'Intermediário',
      avancado:     'Avançado',
    }[dados.nivel] ?? capitalizar(dados.nivel);

    const BOX_W = 460;
    const BOX_H = 44;
    const BOX_X = (W - BOX_W) / 2;  // = 190.94 — centrado matematicamente
    const BOX_Y = linhaY + 28;

    doc.roundedRect(BOX_X, BOX_Y, BOX_W, BOX_H, 5)
       .fillAndStroke(COR.boxFundo, COR.boxBorda);

    // Textos dentro da caixa: passamos BOX_X como origem e BOX_W como largura
    // com align:'center' o pdfkit centraliza o texto dentro dos BOX_W pontos
    doc.font('Helvetica-Bold').fontSize(13).fillColor(COR.boxTexto)
       .text(`${dados.nomeTrilha} — ${nivelLabel}`, BOX_X, BOX_Y + 9,
             { width: BOX_W, align: 'center', lineBreak: false });

    doc.font('Helvetica').fontSize(8).fillColor(COR.boxSub)
       .text(`${dados.duracao}  ·  ${dados.qtdModulos} módulos  ·  ${dados.cargaHoraria}`,
             BOX_X, BOX_Y + 28, { width: BOX_W, align: 'center', lineBreak: false });

    // ── 9. Separador dos módulos ────────────────────────────────────────────
    const SEP_Y = BOX_Y + BOX_H + 14;
    hLine(doc, SEP_Y, COR.bordaFraca, 0.7);

    // ── 10. Módulos em duas colunas ─────────────────────────────────────────
    const MOD_Y0 = SEP_Y + 10;
    const PASSO  = 12.5;
    const COL_L  = 68;
    const COL_R  = W / 2 + 18;
    const COL_W  = W / 2 - 90;
    const metade = Math.ceil(dados.modulos.length / 2);

    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(COR.modTitulo)
       .text('MÓDULOS CONCLUÍDOS', COL_L, MOD_Y0, { lineBreak: false });

    dados.modulos.forEach((mod, i) => {
      const col   = i < metade ? COL_L : COL_R;
      const linha = i < metade ? i : i - metade;
      const y     = MOD_Y0 + 12 + linha * PASSO;
      doc.font('Helvetica').fontSize(8).fillColor(COR.modItem)
         .text(`[+] ${mod}`, col, y, { width: COL_W, lineBreak: false });
    });

    // ── 11. Rodapé ──────────────────────────────────────────────────────────
    const ROD_SEP = H - 62;
    hLine(doc, ROD_SEP, COR.bordaFraca, 0.7);

    doc.font('Helvetica').fontSize(8).fillColor(COR.rodape)
       .text(`Data de emissão: ${dados.dataEmissao}`, COL_L, ROD_SEP + 8,
             { lineBreak: false });

    doc.font('Helvetica-Bold').fontSize(8).fillColor(COR.rodape)
       .text(`Código: ${dados.codigo}`, COL_L, ROD_SEP + 20,
             { lineBreak: false });

    centralizado(doc, 'Helvetica', 7, COR.rodapeDim,
      'Certificado fictício gerado pelo Geo-Explorer para fins de portfólio e aprendizagem.',
      ROD_SEP + 8);

    // ── Finaliza ────────────────────────────────────────────────────────────
    doc.flushPages();
    doc.end();

    stream.on('finish', () => resolve(caminhoArquivo));
    stream.on('error', reject);
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Renderiza texto centralizado horizontalmente na página.
 * Mede a largura real da string com a fonte/tamanho ativos,
 * calcula X = (W - largura) / 2, e chama doc.text com lineBreak:false.
 * Não usa align:'center' do pdfkit — evita conflito de coordenadas.
 */
function centralizado(doc, font, size, color, texto, y) {
  doc.font(font).fontSize(size);
  const strW = doc.widthOfString(texto);
  const x = (W - strW) / 2;
  doc.fillColor(color).text(texto, x, y, { lineBreak: false });
}

/** Linha horizontal de margem a margem */
function hLine(doc, y, color, lw = 1) {
  doc.moveTo(52, y).lineTo(W - 52, y).lineWidth(lw).stroke(color);
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
