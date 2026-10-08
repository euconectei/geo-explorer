import { buscarDesafios, buscarTrilha, escolherAleatorio, normalizarNivel } from '../utils/loader.js';

/**
 * Comando /desafio
 * Gera um desafio de código conforme a tecnologia e nível informado.
 *
 * @param {string} tecnologia - id da trilha (ex: javascript, python)
 * @param {string} nivel - nível do desafio (iniciante, intermediario, avancado)
 * @returns {string} - texto formatado com o desafio
 */
export function comandoDesafio(tecnologia, nivel) {
  if (!tecnologia || !nivel) {
    return gerarAjudaDesafio(tecnologia);
  }

  const trilha = buscarTrilha(tecnologia);
  if (!trilha) {
    return `❌ Tecnologia "${tecnologia}" não encontrada.\n   Use /trilha para ver as opções disponíveis.`;
  }

  const nivelNorm = normalizarNivel(nivel);
  const desafios = buscarDesafios(tecnologia, nivel);

  if (!desafios || desafios.length === 0) {
    return [
      `❌ Não há desafios para ${trilha.nome} no nível "${nivel}".`,
      '   Níveis disponíveis: iniciante | intermediario | avancado',
    ].join('\n');
  }

  const desafio = escolherAleatorio(desafios);
  return formatarDesafio(desafio, trilha.nome, nivelNorm);
}

/**
 * Formata o desafio para exibição
 * @param {Object} desafio
 * @param {string} nomeTrilha
 * @param {string} nivel
 * @returns {string}
 */
function formatarDesafio(desafio, nomeTrilha, nivel) {
  const emojiNivel = { iniciante: '🟢', intermediario: '🟡', avancado: '🔴' }[nivel] || '⚪';

  const linhas = [
    `⚡ DESAFIO: ${nomeTrilha.toUpperCase()} — ${capitalizar(nivel)} ${emojiNivel}`,
    '='.repeat(55),
    '',
    `🎯 ${desafio.titulo}`,
    '',
    '━'.repeat(55),
    '📝 DESCRIÇÃO',
    '━'.repeat(55),
    '',
    desafio.descricao,
    '',
    '━'.repeat(55),
    '📥 EXEMPLO DE ENTRADA',
    '━'.repeat(55),
    '',
    desafio.exemplo_entrada,
    '',
    '━'.repeat(55),
    '📤 EXEMPLO DE SAÍDA',
    '━'.repeat(55),
    '',
    desafio.exemplo_saida,
    '',
    '━'.repeat(55),
    '💡 DICA',
    '━'.repeat(55),
    '',
    desafio.dica,
    '',
    '━'.repeat(55),
    '',
    '✅ Critérios de aceite:',
    '   • O código deve funcionar para o exemplo dado',
    '   • Trate casos extremos (null, vazio, negativo)',
    '   • Escreva pelo menos um teste para sua solução',
    '',
    `🏆 Concluiu? Gere seu certificado: /certificado ${nomeTrilha.toLowerCase()} ${nivel} "Seu Nome"`,
  ];

  return linhas.join('\n');
}

/**
 * Gera texto de ajuda quando o comando está incompleto
 * @param {string} [tecnologia]
 * @returns {string}
 */
function gerarAjudaDesafio(tecnologia) {
  const linhas = [
    '⚡ COMANDO /desafio',
    '===================',
    '',
    '📌 Uso: /desafio <tecnologia> <nivel>',
    '',
    '   Exemplo:',
    '   /desafio javascript iniciante',
    '   /desafio python intermediario',
    '   /desafio react avancado',
    '',
    '📊 Níveis: iniciante | intermediario | avancado',
    '📚 Trilhas: javascript | python | react | node | devops',
  ];

  if (tecnologia) {
    linhas.push('');
    linhas.push(`⚠️  Faltou informar o nível para a trilha "${tecnologia}".`);
  }

  return linhas.join('\n');
}

/**
 * Capitaliza a primeira letra
 * @param {string} str
 * @returns {string}
 */
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
