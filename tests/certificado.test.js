import { comandoCertificado } from '../src/commands/certificado.js';

describe('/certificado — comando de certificado', () => {
  // ── Sem argumentos ──────────────────────────────────────────────────────
  describe('sem argumentos', () => {
    test('exibe mensagem de ajuda', () => {
      const resultado = comandoCertificado();
      expect(resultado).toContain('/certificado');
      expect(resultado).toContain('aspas');
    });

    test('exibe ajuda quando falta o nome', () => {
      const resultado = comandoCertificado('javascript', 'iniciante');
      expect(resultado).toContain('/certificado');
    });
  });

  // ── Certificado válido ──────────────────────────────────────────────────
  describe('certificado válido', () => {
    test('gera certificado para JavaScript iniciante', () => {
      const resultado = comandoCertificado('javascript', 'iniciante', 'Maria Silva');
      expect(resultado).toContain('CERTIFICADO DE CONCLUSÃO');
      expect(resultado).toContain('MARIA SILVA');
      expect(resultado).toContain('JavaScript');
    });

    test('contém código único de certificado', () => {
      const resultado = comandoCertificado('python', 'avancado', 'João Santos');
      expect(resultado).toMatch(/GEO-[A-Z0-9\u00C0-\u017E]+-\d{4}-\d{5}/);
    });

    test('código é determinístico — mesmo nome/trilha/nível gera mesmo código', () => {
      const r1 = comandoCertificado('react', 'intermediario', 'Ana Pereira');
      const r2 = comandoCertificado('react', 'intermediario', 'Ana Pereira');

      const extrairCodigo = (str) => str.match(/GEO-[A-Z0-9]+-\d{4}-\d{5}/)?.[0];
      expect(extrairCodigo(r1)).toBe(extrairCodigo(r2));
    });

    test('contém a data de emissão', () => {
      const resultado = comandoCertificado('node', 'iniciante', 'Carlos Lima');
      const anoAtual = new Date().getFullYear().toString();
      expect(resultado).toContain(anoAtual);
    });

    test('lista os módulos concluídos', () => {
      const resultado = comandoCertificado('javascript', 'iniciante', 'Beatriz Costa');
      expect(resultado).toContain('Fundamentos de JavaScript');
      expect(resultado).toContain('Funções e Escopo');
    });

    test('sugere próxima trilha ao final', () => {
      const resultado = comandoCertificado('python', 'iniciante', 'Lucas Martins');
      expect(resultado).toContain('/trilha');
    });

    test('aceita nível com acento (avançado)', () => {
      const resultado = comandoCertificado('devops', 'avançado', 'Paula Rocha');
      expect(resultado).toContain('CERTIFICADO');
      expect(resultado).toContain('PAULA ROCHA');
    });
  });

  // ── Tecnologia inválida ─────────────────────────────────────────────────
  describe('tecnologia inválida', () => {
    test('retorna mensagem de erro', () => {
      const resultado = comandoCertificado('golang', 'iniciante', 'Teste');
      expect(resultado).toContain('não encontrada');
    });
  });

  // ── Nível inválido ──────────────────────────────────────────────────────
  describe('nível inválido', () => {
    test('retorna mensagem de erro', () => {
      const resultado = comandoCertificado('react', 'expert', 'Teste');
      expect(resultado).toContain('não encontrado');
    });
  });

  // ── Carga horária ───────────────────────────────────────────────────────
  describe('carga horária calculada', () => {
    test('contém a carga horária em horas', () => {
      const resultado = comandoCertificado('javascript', 'avancado', 'Fernanda Lima');
      expect(resultado).toContain('horas');
    });
  });
});
