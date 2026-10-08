/**
 * Teste de diagnóstico visual do PDF.
 *
 * Gera dois arquivos na pasta certificados/:
 *   - diagnostico-guias.pdf   → página com linhas de centro, grade e bounding boxes
 *   - diagnostico-real.pdf    → certificado real com dados fixos para inspeção
 *
 * Uso: node tests/pdf-diagnostico.js
 */

import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gerarPDF } from '../src/utils/pdfGenerator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'certificados');
mkdirSync(OUT, { recursive: true });

const W = 841.89;
const H = 595.28;

// ── Helpers de diagnóstico ────────────────────────────────────────────────────

function criarDoc() {
  return new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    bufferPages: true,
    autoFirstPage: true,
  });
}

/** Linha horizontal */
function hLine(doc, y, cor = 'red', lw = 0.4) {
  doc.moveTo(0, y).lineTo(W, y).lineWidth(lw).stroke(cor);
}

/** Linha vertical */
function vLine(doc, x, cor = 'red', lw = 0.4) {
  doc.moveTo(x, 0).lineTo(x, H).lineWidth(lw).stroke(cor);
}

/** Retângulo de bounding box */
function bbox(doc, x, y, w, h, cor = 'lime') {
  doc.rect(x, y, w, h).lineWidth(0.5).stroke(cor);
}

/** Label de debug */
function label(doc, texto, x, y) {
  doc.font('Helvetica').fontSize(6).fillColor('yellow').text(texto, x, y, { lineBreak: false });
}

// ── PDF 1: Guias visuais ──────────────────────────────────────────────────────

async function gerarDiagnosticoGuias() {
  const doc = criarDoc();
  const caminho = join(OUT, 'diagnostico-guias.pdf');
  const stream = createWriteStream(caminho);
  doc.pipe(stream);

  // Fundo escuro (igual ao certificado real)
  doc.rect(0, 0, W, H).fill('#0f172a');

  // Linha de centro horizontal e vertical
  hLine(doc, H / 2, '#ff0000', 0.6);   // y = 297.64
  vLine(doc, W / 2, '#ff0000', 0.6);   // x = 420.94

  // Grade a cada 50pt
  for (let x = 50; x < W; x += 50) vLine(doc, x, '#ffffff22', 0.3);
  for (let y = 50; y < H; y += 50) hLine(doc, y, '#ffffff22', 0.3);

  // Margens laterais de trabalho (52pt de cada lado)
  vLine(doc, 52, '#00ffff', 0.5);
  vLine(doc, W - 52, '#00ffff', 0.5);

  // ── Simula cada elemento com bbox colorida ───────────────────────────────

  // Bordas do certificado
  bbox(doc, 16, 16, W - 32, H - 32, '#38bdf8');

  // Cabeçalho GEO-EXPLORER
  const geoW = 400; const geoX = W / 2 - geoW / 2;
  bbox(doc, geoX, 46, geoW, 14, 'lime');
  label(doc, `GEO-EXPLORER  x=${geoX.toFixed(0)} y=46 w=${geoW}`, geoX, 46);

  // Linha sep cabeçalho
  hLine(doc, 80, '#1d4ed8', 1);
  label(doc, 'linha sep y=80', 54, 82);

  // Título certificado
  const titW = 700; const titX = W / 2 - titW / 2;
  bbox(doc, titX, 95, titW, 24, 'lime');
  label(doc, `CERTIFICADO  x=${titX.toFixed(0)} y=95 w=${titW}`, titX + 2, 97);

  // "Certificamos que"
  const cqW = 300; const cqX = W / 2 - cqW / 2;
  bbox(doc, cqX, 133, cqW, 12, 'orange');
  label(doc, `"Certificamos que"  x=${cqX.toFixed(0)} y=133 w=${cqW}`, cqX, 133);

  // Nome do aluno
  const nomeW = 700; const nomeX = W / 2 - nomeW / 2;
  bbox(doc, nomeX, 150, nomeW, 28, 'lime');
  label(doc, `NOME  x=${nomeX.toFixed(0)} y=150 w=${nomeW}`, nomeX + 2, 152);

  // Linha decorativa abaixo do nome
  const linhaY = 150 + 34;
  hLine(doc, linhaY, '#38bdf8', 0.8);
  label(doc, `linha nome y=${linhaY}`, 54, linhaY + 2);

  // "concluiu com exito"
  const cceW = 500; const cceX = W / 2 - cceW / 2;
  bbox(doc, cceX, linhaY + 10, cceW, 12, 'orange');
  label(doc, `"concluiu..."  x=${cceX.toFixed(0)} y=${linhaY + 10} w=${cceW}`, cceX, linhaY + 10);

  // BOX da trilha
  const BOX_W = 460; const BOX_H = 44;
  const BOX_X = (W - BOX_W) / 2;
  const BOX_Y = linhaY + 30;
  bbox(doc, BOX_X, BOX_Y, BOX_W, BOX_H, '#ff00ff');
  label(doc, `BOX  x=${BOX_X.toFixed(0)} y=${BOX_Y} w=${BOX_W} h=${BOX_H}`, BOX_X + 2, BOX_Y + 2);

  // Linha 1 da box (título da trilha)
  const box1W = BOX_W; const box1X = BOX_X;
  bbox(doc, box1X, BOX_Y + 8, box1W, 14, 'yellow');
  label(doc, `linha1 box  x=${box1X.toFixed(0)} y=${BOX_Y + 8} w=${box1W}`, box1X + 2, BOX_Y + 8);

  // Linha 2 da box (detalhes)
  bbox(doc, box1X, BOX_Y + 27, box1W, 10, 'yellow');
  label(doc, `linha2 box  x=${box1X.toFixed(0)} y=${BOX_Y + 27} w=${box1W}`, box1X + 2, BOX_Y + 27);

  // Linha sep módulos
  const SEP_Y = BOX_Y + BOX_H + 14;
  hLine(doc, SEP_Y, '#1d4ed8', 0.8);
  label(doc, `sep modulos y=${SEP_Y.toFixed(0)}`, 54, SEP_Y + 2);

  // Colunas de módulos
  const COL_L = 68; const COL_R = W / 2 + 18; const COL_W = W / 2 - 90;
  const MOD_Y0 = SEP_Y + 10;
  bbox(doc, COL_L, MOD_Y0, COL_W, 90, 'cyan');
  label(doc, `col-L  x=${COL_L} y=${MOD_Y0.toFixed(0)} w=${COL_W.toFixed(0)}`, COL_L, MOD_Y0);
  bbox(doc, COL_R, MOD_Y0, COL_W, 90, 'cyan');
  label(doc, `col-R  x=${COL_R.toFixed(0)} y=${MOD_Y0.toFixed(0)} w=${COL_W.toFixed(0)}`, COL_R, MOD_Y0);

  // Rodapé
  const ROD_SEP = H - 62;
  hLine(doc, ROD_SEP, '#1d4ed8', 0.8);
  label(doc, `rodape sep y=${ROD_SEP.toFixed(0)}`, 54, ROD_SEP + 2);

  // Legenda
  doc.font('Helvetica-Bold').fontSize(7).fillColor('white')
     .text('LEGENDA:', 10, 10, { lineBreak: false });
  doc.font('Helvetica').fontSize(6).fillColor('red')
     .text('  linhas vermelhas = centro da pagina (x=421, y=298)', 10, 20, { lineBreak: false });
  doc.font('Helvetica').fontSize(6).fillColor('lime')
     .text('  verde = caixas de texto', 10, 28, { lineBreak: false });
  doc.font('Helvetica').fontSize(6).fillColor('cyan')
     .text('  ciano = colunas de modulos', 10, 36, { lineBreak: false });
  doc.font('Helvetica').fontSize(6).fillColor('#ff00ff')
     .text('  magenta = caixa da trilha', 10, 44, { lineBreak: false });

  doc.flushPages();
  doc.end();

  return new Promise((res, rej) => {
    stream.on('finish', () => { console.log('Guias gerado:', caminho); res(caminho); });
    stream.on('error', rej);
  });
}

// ── PDF 2: Certificado real ───────────────────────────────────────────────────

async function gerarDiagnosticoReal() {
  const caminho = await gerarPDF({
    nomeAluno: 'Ana Pereira',
    nomeTrilha: 'React',
    nivel: 'intermediario',
    duracao: '6 semanas',
    qtdModulos: 6,
    modulos: ['Hooks Essenciais', 'Gerenciamento de Estado', 'Roteamento',
              'Consumo de APIs', 'Testes com Testing Library', 'Projeto Integrador'],
    cargaHoraria: '72 horas',
    dataEmissao: '08 de outubro de 2026',
    codigo: 'GEO-ANAPREAINT-2026-46872',
  }, OUT);
  console.log('Real gerado   :', caminho);
}

// ── Execução ──────────────────────────────────────────────────────────────────

await gerarDiagnosticoGuias();
await gerarDiagnosticoReal();
console.log('\nAbra os dois PDFs lado a lado para comparar o alinhamento.');
