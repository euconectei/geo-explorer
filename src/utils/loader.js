import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

/**
 * Carrega e retorna o arquivo trilhas.json
 * @returns {Object}
 */
export function carregarTrilhas() {
  const conteudo = readFileSync(join(DATA_DIR, 'trilhas.json'), 'utf-8');
  return JSON.parse(conteudo);
}

/**
 * Carrega e retorna o arquivo desafios.json
 * @returns {Object}
 */
export function carregarDesafios() {
  const conteudo = readFileSync(join(DATA_DIR, 'desafios.json'), 'utf-8');
  return JSON.parse(conteudo);
}

/**
 * Retorna uma trilha pelo id
 * @param {string} id
 * @returns {Object|null}
 */
export function buscarTrilha(id) {
  const { trilhas } = carregarTrilhas();
  return trilhas.find(t => t.id === id.toLowerCase()) || null;
}

/**
 * Lista todos os ids de trilhas disponíveis
 * @returns {string[]}
 */
export function listarTrilhasDisponiveis() {
  const { trilhas } = carregarTrilhas();
  return trilhas.map(t => ({ id: t.id, nome: t.nome }));
}

/**
 * Retorna desafios de uma trilha/nível
 * @param {string} trilhaId
 * @param {string} nivel
 * @returns {Object[]|null}
 */
export function buscarDesafios(trilhaId, nivel) {
  const { desafios } = carregarDesafios();
  const trilha = desafios[trilhaId.toLowerCase()];
  if (!trilha) return null;
  const nivelNorm = normalizarNivel(nivel);
  return trilha[nivelNorm] || null;
}

/**
 * Normaliza o nível para o formato interno
 * @param {string} nivel
 * @returns {string}
 */
export function normalizarNivel(nivel) {
  const mapa = {
    'iniciante': 'iniciante',
    'basico': 'iniciante',
    'básico': 'iniciante',
    'beginner': 'iniciante',
    'intermediario': 'intermediario',
    'intermediário': 'intermediario',
    'intermediate': 'intermediario',
    'avancado': 'avancado',
    'avançado': 'avancado',
    'advanced': 'avancado',
  };
  return mapa[nivel.toLowerCase()] || nivel.toLowerCase();
}

/**
 * Escolhe um item aleatório de um array
 * @param {any[]} arr
 * @returns {any}
 */
export function escolherAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
