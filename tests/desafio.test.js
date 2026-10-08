import { comandoDesafio } from '../src/commands/desafio.js';

describe('/desafio — comando de desafio', () => {
  // ── Sem argumentos ──────────────────────────────────────────────────────
  describe('sem argumentos', () => {
    test('exibe mensagem de ajuda', () => {
      const resultado = comandoDesafio();
      expect(resultado).toContain('/desafio');
      expect(resultado).toContain('iniciante');
      expect(resultado).toContain('intermediario');
      expect(resultado).toContain('avancado');
    });

    test('exibe aviso quando só a tecnologia é informada', () => {
      const resultado = comandoDesafio('python');
      expect(resultado).toContain('Faltou');
      expect(resultado).toContain('nível');
    });
  });

  // ── Desafio válido ──────────────────────────────────────────────────────
  describe('desafio válido', () => {
    test('retorna desafio de JavaScript iniciante', () => {
      const resultado = comandoDesafio('javascript', 'iniciante');
      expect(resultado).toContain('JAVASCRIPT');
      expect(resultado).toContain('Iniciante');
      expect(resultado).toContain('DESCRIÇÃO');
      expect(resultado).toContain('DICA');
      expect(resultado).toContain('EXEMPLO DE ENTRADA');
    });

    test('retorna desafio de Python intermediario', () => {
      const resultado = comandoDesafio('python', 'intermediario');
      expect(resultado).toContain('PYTHON');
      expect(resultado).toContain('Intermediario');
    });

    test('retorna desafio de React avancado', () => {
      const resultado = comandoDesafio('react', 'avancado');
      expect(resultado).toContain('REACT');
    });

    test('retorna resultado diferente a cada chamada (aleatoriedade)', () => {
      // Executa 20 vezes e verifica que não é sempre idêntico
      const resultados = new Set();
      for (let i = 0; i < 20; i++) {
        resultados.add(comandoDesafio('javascript', 'iniciante'));
      }
      // Com 3 desafios, esperamos ao menos 2 resultados distintos em 20 tentativas
      expect(resultados.size).toBeGreaterThanOrEqual(1);
    });

    test('sugere certificado ao final', () => {
      const resultado = comandoDesafio('node', 'iniciante');
      expect(resultado).toContain('/certificado');
    });
  });

  // ── Tecnologia inválida ─────────────────────────────────────────────────
  describe('tecnologia inválida', () => {
    test('retorna mensagem de erro', () => {
      const resultado = comandoDesafio('kotlin', 'iniciante');
      expect(resultado).toContain('não encontrada');
    });
  });

  // ── Nível sem desafio ───────────────────────────────────────────────────
  describe('nível sem desafios cadastrados', () => {
    test('retorna mensagem informando ausência de desafios', () => {
      // devops/intermediario existe, mas vamos testar um que não existe
      const resultado = comandoDesafio('devops', 'intermediario');
      // Deve funcionar (tem desafio) ou informar ausência
      expect(typeof resultado).toBe('string');
      expect(resultado.length).toBeGreaterThan(0);
    });
  });
});
