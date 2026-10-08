import { buscarTrilha, normalizarNivel } from '../utils/loader.js';
import { gerarPDF } from '../utils/pdfGenerator.js';

/**
 * Comando /certificado
 * Gera um certificado fictício para uma trilha concluída.
 *
 * @param {string} tecnologia - id da trilha (ex: javascript, python)
 * @param {string} nivel - nível concluído (iniciante, intermediario, avancado)
 * @param {string} nomeAluno - nome da pessoa que concluiu a trilha
 * @param {Object} [opcoes]
 * @param {boolean} [opcoes.pdf] - se true, também gera arquivo PDF
 * @returns {string|Promise<string>} - certificado formatado em texto (ou Promise se --pdf)
 */
export function comandoCertificado(tecnologia, nivel, nomeAluno, opcoes = {}) {
  if (!tecnologia || !nivel || !nomeAluno) {
    return gerarAjudaCertificado();
  }

  const trilha = buscarTrilha(tecnologia);
  if (!trilha) {
    return `❌ Tecnologia "${tecnologia}" não encontrada.\n   Use /trilha para ver as opções disponíveis.`;
  }

  const nivelNorm = normalizarNivel(nivel);
  if (!trilha.niveis[nivelNorm]) {
    return [
      `❌ Nível "${nivel}" não encontrado para a trilha ${trilha.nome}.`,
      '   Níveis válidos: iniciante | intermediario | avancado',
    ].join('\n');
  }

  const dadosNivel = trilha.niveis[nivelNorm];
  const textoCertificado = gerarCertificado(nomeAluno, trilha, nivelNorm, dadosNivel);

  if (!opcoes.pdf) {
    return textoCertificado;
  }

  // Modo PDF: gera o arquivo e retorna Promise
  return gerarCertificadoPDF(nomeAluno, trilha, nivelNorm, dadosNivel).then(caminho => {
    return textoCertificado + `\n\n📄 PDF gerado com sucesso!\n   📁 ${caminho}`;
  });
}

/**
 * Monta o objeto de dados e chama o gerador de PDF
 */
function gerarCertificadoPDF(nomeAluno, trilha, nivel, dadosNivel) {
  const dataFormatada = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return gerarPDF({
    nomeAluno,
    nomeTrilha: trilha.nome,
    nivel,
    duracao: dadosNivel.duracao,
    qtdModulos: dadosNivel.modulos.length,
    modulos: dadosNivel.modulos.map(m => m.titulo),
    cargaHoraria: calcularCargaHoraria(dadosNivel.duracao, dadosNivel.modulos.length),
    dataEmissao: dataFormatada,
    codigo: gerarCodigoCertificado(nomeAluno, trilha.id, nivel),
  });
}

/**
 * Gera o certificado formatado
 * @param {string} nomeAluno
 * @param {Object} trilha
 * @param {string} nivel
 * @param {Object} dadosNivel
 * @returns {string}
 */
function gerarCertificado(nomeAluno, trilha, nivel, dadosNivel) {
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const codigo = gerarCodigoCertificado(nomeAluno, trilha.id, nivel);
  const cargaHoraria = calcularCargaHoraria(dadosNivel.duracao, dadosNivel.modulos.length);
  const emojiNivel = { iniciante: '🟢', intermediario: '🟡', avancado: '🔴' }[nivel] || '⚪';
  const conteudoModulos = dadosNivel.modulos.map(m => `     ✓ ${m.titulo}`).join('\n');

  return [
    '',
    '╔══════════════════════════════════════════════════════════╗',
    '║                                                          ║',
    '║            🌍  G E O - E X P L O R E R  🌍              ║',
    '║                                                          ║',
    '║              CERTIFICADO DE CONCLUSÃO                    ║',
    '║                                                          ║',
    '╠══════════════════════════════════════════════════════════╣',
    '║                                                          ║',
    '║  Certificamos que                                        ║',
    '║                                                          ║',
   `║  ★  ${centralizarTexto(nomeAluno.toUpperCase(), 52)}  ★  ║`,
    '║                                                          ║',
    '║  concluiu com êxito a trilha de aprendizagem:            ║',
    '║                                                          ║',
   `║      📚 Trilha: ${(trilha.nome + ' — ' + capitalizar(nivel) + ' ' + emojiNivel).padEnd(40)} ║`,
   `║      ⏱  Duração: ${dadosNivel.duracao.padEnd(39)} ║`,
   `║      📦 Módulos: ${String(dadosNivel.modulos.length).padEnd(39)} ║`,
   `║      🕐 Carga Horária: ${cargaHoraria.padEnd(34)} ║`,
    '║                                                          ║',
    '╠══════════════════════════════════════════════════════════╣',
    '║                                                          ║',
    '║  Módulos concluídos:                                     ║',
    ...dadosNivel.modulos.map(m => `║     ✓ ${m.titulo.padEnd(51)} ║`),
    '║                                                          ║',
    '╠══════════════════════════════════════════════════════════╣',
    '║                                                          ║',
   `║  Data de emissão: ${dataFormatada.padEnd(39)} ║`,
   `║  Código: ${codigo.padEnd(48)} ║`,
    '║                                                          ║',
    '║  Este é um certificado fictício gerado pelo              ║',
    '║  Geo-Explorer para fins de portfólio e aprendizagem.     ║',
    '║                                                          ║',
    '╚══════════════════════════════════════════════════════════╝',
    '',
    `🎉 Parabéns, ${nomeAluno.split(' ')[0]}! Continue explorando novas trilhas.`,
    `🚀 Próximo passo: /trilha ${trilha.id} ${proximoNivel(nivel)}`,
    '',
  ].join('\n');
}

/**
 * Gera um código único para o certificado
 * @param {string} nome
 * @param {string} trilhaId
 * @param {string} nivel
 * @returns {string}
 */
function gerarCodigoCertificado(nome, trilhaId, nivel) {
  const base = `${nome.replace(/\s/g, '').toUpperCase().slice(0, 4)}${trilhaId.toUpperCase().slice(0, 3)}${nivel.toUpperCase().slice(0, 3)}`;
  const ano = new Date().getFullYear();
  const hash = Math.abs(hashSimples(nome + trilhaId + nivel)) % 99999;
  return `GEO-${base}-${ano}-${String(hash).padStart(5, '0')}`;
}

/**
 * Hash simples para geração de código
 * @param {string} str
 * @returns {number}
 */
function hashSimples(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

/**
 * Calcula a carga horária estimada com base na duração e número de módulos
 * @param {string} duracao - ex: "4 semanas"
 * @param {number} qtdModulos
 * @returns {string}
 */
function calcularCargaHoraria(duracao, qtdModulos) {
  const match = duracao.match(/(\d+)/);
  const semanas = match ? parseInt(match[1]) : 4;
  const horas = semanas * 10 + qtdModulos * 2;
  return `${horas} horas`;
}

/**
 * Centraliza texto dentro de um espaço
 * @param {string} texto
 * @param {number} largura
 * @returns {string}
 */
function centralizarTexto(texto, largura) {
  if (texto.length >= largura) return texto.slice(0, largura);
  const espacos = largura - texto.length;
  const esqDir = Math.floor(espacos / 2);
  return ' '.repeat(esqDir) + texto + ' '.repeat(espacos - esqDir);
}

/**
 * Retorna o próximo nível
 * @param {string} nivel
 * @returns {string}
 */
function proximoNivel(nivel) {
  const ordem = { iniciante: 'intermediario', intermediario: 'avancado', avancado: 'iniciante' };
  return ordem[nivel] || 'intermediario';
}

/**
 * Capitaliza a primeira letra
 * @param {string} str
 * @returns {string}
 */
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Gera texto de ajuda
 * @returns {string}
 */
function gerarAjudaCertificado() {
  return [
    '🏆 COMANDO /certificado',
    '=======================',
    '',
    '📌 Uso: /certificado <tecnologia> <nivel> "<seu nome>"',
    '',
    '   Exemplo:',
    '   /certificado javascript iniciante "Maria Silva"',
    '   /certificado python intermediario "João Santos"',
    '   /certificado react avancado "Ana Pereira"',
    '',
    '📊 Níveis: iniciante | intermediario | avancado',
    '📚 Trilhas: javascript | python | react | node | devops',
    '',
    '⚠️  Lembre-se de colocar seu nome entre aspas.',
  ].join('\n');
}
