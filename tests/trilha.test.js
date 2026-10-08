import { comandoTrilha } from '../src/commands/trilha.js';

describe('/trilha — comando de trilha', () => {
  // ── Sem argumentos ──────────────────────────────────────────────────────
  describe('sem argumentos', () => {
    test('exibe a lista de trilhas disponíveis', () => {
      const resultado = comandoTrilha();
      expect(resultado).toContain('GEO-EXPLORER');
      expect(resultado).toContain('Trilhas disponíveis');
      expect(resultado).toContain('javascript');
      expect(resultado).toContain('python');
      expect(resultado).toContain('react');
      expect(resultado).toContain('node');
      expect(resultado).toContain('devops');
    });
  });

  // ── Trilha sem nível ────────────────────────────────────────────────────
  describe('tecnologia sem nível', () => {
    test('retorna visão geral da trilha JavaScript', () => {
      const resultado = comandoTrilha('javascript');
      expect(resultado).toContain('JAVASCRIPT');
      expect(resultado).toContain('iniciante');
      expect(resultado).toContain('intermediario');
      expect(resultado).toContain('avancado');
    });

    test('retorna visão geral da trilha Python', () => {
      const resultado = comandoTrilha('python');
      expect(resultado).toContain('PYTHON');
      expect(resultado).toContain('ciência de dados');
    });

    test('é case-insensitive para a tecnologia', () => {
      const lower = comandoTrilha('javascript');
      const upper = comandoTrilha('JAVASCRIPT');
      expect(lower).toContain('JAVASCRIPT');
      expect(upper).toContain('JAVASCRIPT');
    });
  });

  // ── Trilha com nível ────────────────────────────────────────────────────
  describe('tecnologia com nível', () => {
    test('retorna o plano de estudos de JavaScript iniciante', () => {
      const resultado = comandoTrilha('javascript', 'iniciante');
      expect(resultado).toContain('JAVASCRIPT');
      expect(resultado).toContain('Iniciante');
      expect(resultado).toContain('Módulo');
      expect(resultado).toContain('Fundamentos de JavaScript');
    });

    test('retorna o plano de estudos de Python avancado', () => {
      const resultado = comandoTrilha('python', 'avancado');
      expect(resultado).toContain('PYTHON');
      expect(resultado).toContain('Avancado');
      expect(resultado).toContain('Machine Learning');
    });

    test('aceita alias "avançado" com acento', () => {
      const resultado = comandoTrilha('react', 'avançado');
      expect(resultado).toContain('REACT');
      expect(resultado).toContain('Micro-frontends');
    });

    test('sugere próxima ação ao exibir a trilha', () => {
      const resultado = comandoTrilha('node', 'iniciante');
      expect(resultado).toContain('/desafio');
      expect(resultado).toContain('/certificado');
    });
  });

  // ── Tecnologia inválida ─────────────────────────────────────────────────
  describe('tecnologia inválida', () => {
    test('retorna mensagem de erro e lista disponíveis', () => {
      const resultado = comandoTrilha('cobol');
      expect(resultado).toContain('não encontrada');
      expect(resultado).toContain('javascript');
    });
  });

  // ── Nível inválido ──────────────────────────────────────────────────────
  describe('nível inválido', () => {
    test('retorna mensagem de erro com níveis válidos', () => {
      const resultado = comandoTrilha('javascript', 'expert');
      expect(resultado).toContain('não encontrado');
      expect(resultado).toContain('iniciante');
    });
  });
});
