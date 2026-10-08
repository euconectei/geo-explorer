import { buscarTrilha, listarTrilhasDisponiveis } from '../utils/loader.js';

/**
 * Comando /trilha
 * Apresenta o plano de estudos de uma tecnologia.
 *
 * @param {string} tecnologia - id da trilha (ex: javascript, python, react)
 * @param {string} [nivel] - nível desejado (iniciante, intermediario, avancado)
 * @returns {string} - texto formatado com a trilha
 */
export function comandoTrilha(tecnologia, nivel) {
  if (!tecnologia) {
    return gerarListaDeTrilhas();
  }

  const trilha = buscarTrilha(tecnologia);

  if (!trilha) {
    const disponiveis = listarTrilhasDisponiveis().map(t => `• ${t.nome} (${t.id})`).join('\n');
    return [
      `❌ Trilha "${tecnologia}" não encontrada.`,
      '',
      '📚 Trilhas disponíveis:',
      disponiveis,
    ].join('\n');
  }

  if (!nivel) {
    return gerarVisaoGeral(trilha);
  }

  return gerarPlanoEstudos(trilha, nivel);
}

/**
 * Gera a lista de todas as trilhas disponíveis
 * @returns {string}
 */
function gerarListaDeTrilhas() {
  const trilhas = listarTrilhasDisponiveis();
  const linhas = [
    '🌍 GEO-EXPLORER — Trilhas de Aprendizagem',
    '==========================================',
    '',
    '📚 Trilhas disponíveis:',
    '',
  ];

  trilhas.forEach(t => {
    linhas.push(`  • ${t.nome.padEnd(15)} → /trilha ${t.id}`);
  });

  linhas.push('');
  linhas.push('💡 Uso: /trilha <tecnologia> [nivel]');
  linhas.push('   Exemplo: /trilha javascript iniciante');
  linhas.push('   Níveis: iniciante | intermediario | avancado');

  return linhas.join('\n');
}

/**
 * Gera uma visão geral da trilha com todos os níveis
 * @param {Object} trilha
 * @returns {string}
 */
function gerarVisaoGeral(trilha) {
  const linhas = [
    `🗺️  TRILHA: ${trilha.nome.toUpperCase()}`,
    '='.repeat(40),
    '',
    `📖 ${trilha.descricao}`,
    '',
    '📊 Níveis disponíveis:',
    '',
  ];

  const niveis = Object.entries(trilha.niveis);
  niveis.forEach(([nomeNivel, dados]) => {
    const emoji = { iniciante: '🟢', intermediario: '🟡', avancado: '🔴' }[nomeNivel] || '⚪';
    linhas.push(`  ${emoji} ${capitalizar(nomeNivel)}`);
    linhas.push(`     ⏱  Duração: ${dados.duracao}`);
    linhas.push(`     📦 Módulos: ${dados.modulos.length}`);
    linhas.push('');
  });

  linhas.push('💡 Para ver o plano completo de um nível:');
  linhas.push(`   /trilha ${trilha.id} iniciante`);
  linhas.push(`   /trilha ${trilha.id} intermediario`);
  linhas.push(`   /trilha ${trilha.id} avancado`);

  return linhas.join('\n');
}

/**
 * Gera o plano de estudos detalhado para um nível específico
 * @param {Object} trilha
 * @param {string} nivelInput
 * @returns {string}
 */
function gerarPlanoEstudos(trilha, nivelInput) {
  const mapaAlias = {
    'basico': 'iniciante',
    'básico': 'iniciante',
    'beginner': 'iniciante',
    'intermediário': 'intermediario',
    'intermediate': 'intermediario',
    'avançado': 'avancado',
    'advanced': 'avancado',
  };

  const nivelNorm = mapaAlias[nivelInput.toLowerCase()] || nivelInput.toLowerCase();
  const dados = trilha.niveis[nivelNorm];

  if (!dados) {
    return [
      `❌ Nível "${nivelInput}" não encontrado na trilha ${trilha.nome}.`,
      '   Níveis válidos: iniciante | intermediario | avancado',
    ].join('\n');
  }

  const emojiNivel = { iniciante: '🟢', intermediario: '🟡', avancado: '🔴' }[nivelNorm] || '⚪';

  const linhas = [
    `🗺️  TRILHA: ${trilha.nome.toUpperCase()} — ${capitalizar(nivelNorm)} ${emojiNivel}`,
    '='.repeat(50),
    '',
    `📖 ${trilha.descricao}`,
    '',
    `⏱  Duração estimada: ${dados.duracao}`,
    `📦 Total de módulos: ${dados.modulos.length}`,
    '',
    '━'.repeat(50),
    '📋 PLANO DE ESTUDOS',
    '━'.repeat(50),
    '',
  ];

  dados.modulos.forEach(modulo => {
    linhas.push(`  📌 Módulo ${modulo.numero}: ${modulo.titulo}`);
    modulo.topicos.forEach(topico => {
      linhas.push(`     ▸ ${topico}`);
    });
    linhas.push('');
  });

  linhas.push('━'.repeat(50));
  linhas.push('');
  linhas.push(`🚀 Pronto para o desafio? Use: /desafio ${trilha.id} ${nivelNorm}`);
  linhas.push(`🏆 Concluiu? Gere seu certificado: /certificado ${trilha.id} ${nivelNorm} "Seu Nome"`);

  return linhas.join('\n');
}

/**
 * Capitaliza a primeira letra de uma string
 * @param {string} str
 * @returns {string}
 */
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
