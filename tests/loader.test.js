import {
  carregarTrilhas,
  carregarDesafios,
  buscarTrilha,
  listarTrilhasDisponiveis,
  buscarDesafios,
  normalizarNivel,
  escolherAleatorio,
} from '../src/utils/loader.js';

describe('loader — utilitários de dados', () => {
  // ── carregarTrilhas ──────────────────────────────────────────────────────
  describe('carregarTrilhas()', () => {
    test('retorna objeto com a chave "trilhas"', () => {
      const dados = carregarTrilhas();
      expect(dados).toHaveProperty('trilhas');
      expect(Array.isArray(dados.trilhas)).toBe(true);
    });

    test('contém as 5 trilhas esperadas', () => {
      const { trilhas } = carregarTrilhas();
      const ids = trilhas.map(t => t.id);
      expect(ids).toContain('javascript');
      expect(ids).toContain('python');
      expect(ids).toContain('react');
      expect(ids).toContain('node');
      expect(ids).toContain('devops');
    });
  });

  // ── carregarDesafios ─────────────────────────────────────────────────────
  describe('carregarDesafios()', () => {
    test('retorna objeto com a chave "desafios"', () => {
      const dados = carregarDesafios();
      expect(dados).toHaveProperty('desafios');
    });

    test('contém desafios para as tecnologias principais', () => {
      const { desafios } = carregarDesafios();
      expect(desafios).toHaveProperty('javascript');
      expect(desafios).toHaveProperty('python');
      expect(desafios).toHaveProperty('react');
    });
  });

  // ── buscarTrilha ─────────────────────────────────────────────────────────
  describe('buscarTrilha()', () => {
    test('retorna a trilha correta pelo id', () => {
      const trilha = buscarTrilha('javascript');
      expect(trilha).not.toBeNull();
      expect(trilha.id).toBe('javascript');
      expect(trilha.nome).toBe('JavaScript');
    });

    test('é case-insensitive', () => {
      const t1 = buscarTrilha('PYTHON');
      const t2 = buscarTrilha('python');
      expect(t1).not.toBeNull();
      expect(t1.id).toBe(t2.id);
    });

    test('retorna null para tecnologia inexistente', () => {
      expect(buscarTrilha('cobol')).toBeNull();
    });
  });

  // ── listarTrilhasDisponiveis ──────────────────────────────────────────────
  describe('listarTrilhasDisponiveis()', () => {
    test('retorna array com id e nome', () => {
      const lista = listarTrilhasDisponiveis();
      expect(Array.isArray(lista)).toBe(true);
      expect(lista[0]).toHaveProperty('id');
      expect(lista[0]).toHaveProperty('nome');
    });

    test('retorna 5 trilhas', () => {
      expect(listarTrilhasDisponiveis()).toHaveLength(5);
    });
  });

  // ── buscarDesafios ───────────────────────────────────────────────────────
  describe('buscarDesafios()', () => {
    test('retorna array de desafios para trilha/nível válidos', () => {
      const desafios = buscarDesafios('javascript', 'iniciante');
      expect(Array.isArray(desafios)).toBe(true);
      expect(desafios.length).toBeGreaterThan(0);
    });

    test('cada desafio tem os campos obrigatórios', () => {
      const desafios = buscarDesafios('python', 'intermediario');
      desafios.forEach(d => {
        expect(d).toHaveProperty('titulo');
        expect(d).toHaveProperty('descricao');
        expect(d).toHaveProperty('exemplo_entrada');
        expect(d).toHaveProperty('exemplo_saida');
        expect(d).toHaveProperty('dica');
      });
    });

    test('retorna null para tecnologia inexistente', () => {
      expect(buscarDesafios('golang', 'iniciante')).toBeNull();
    });
  });

  // ── normalizarNivel ──────────────────────────────────────────────────────
  describe('normalizarNivel()', () => {
    const casos = [
      ['iniciante', 'iniciante'],
      ['INICIANTE', 'iniciante'],
      ['básico', 'iniciante'],
      ['beginner', 'iniciante'],
      ['intermediario', 'intermediario'],
      ['intermediário', 'intermediario'],
      ['intermediate', 'intermediario'],
      ['avancado', 'avancado'],
      ['avançado', 'avancado'],
      ['advanced', 'avancado'],
    ];

    test.each(casos)('normaliza "%s" para "%s"', (entrada, esperado) => {
      expect(normalizarNivel(entrada)).toBe(esperado);
    });
  });

  // ── escolherAleatorio ────────────────────────────────────────────────────
  describe('escolherAleatorio()', () => {
    test('retorna um elemento do array', () => {
      const arr = [1, 2, 3, 4, 5];
      const resultado = escolherAleatorio(arr);
      expect(arr).toContain(resultado);
    });

    test('retorna o único elemento de array com 1 item', () => {
      expect(escolherAleatorio(['único'])).toBe('único');
    });
  });
});
