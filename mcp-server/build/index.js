#!/usr/bin/env node
/**
 * Geo-Explorer MCP Server
 *
 * Expõe os três comandos do Geo-Explorer como ferramentas MCP:
 *   - trilha: retorna o plano de estudos de uma tecnologia
 *   - desafio: gera um desafio de código
 *   - certificado: gera um certificado fictício de conclusão
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// ─── Utilitários de dados ────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'src', 'data');
function carregarTrilhas() {
    return JSON.parse(readFileSync(join(DATA_DIR, 'trilhas.json'), 'utf-8'));
}
function carregarDesafios() {
    return JSON.parse(readFileSync(join(DATA_DIR, 'desafios.json'), 'utf-8'));
}
function normalizarNivel(nivel) {
    const mapa = {
        iniciante: 'iniciante',
        basico: 'iniciante',
        básico: 'iniciante',
        beginner: 'iniciante',
        intermediario: 'intermediario',
        intermediário: 'intermediario',
        intermediate: 'intermediario',
        avancado: 'avancado',
        avançado: 'avancado',
        advanced: 'avancado',
    };
    return mapa[nivel.toLowerCase()] ?? nivel.toLowerCase();
}
function escolherAleatorio(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function gerarCodigoCertificado(nome, trilhaId, nivel) {
    const base = `${nome.replace(/\s/g, '').toUpperCase().slice(0, 4)}${trilhaId.toUpperCase().slice(0, 3)}${nivel.toUpperCase().slice(0, 3)}`;
    const ano = new Date().getFullYear();
    let hash = 0;
    const str = nome + trilhaId + nivel;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const hashAbs = Math.abs(hash) % 99999;
    return `GEO-${base}-${ano}-${String(hashAbs).padStart(5, '0')}`;
}
function calcularCargaHoraria(duracao, qtdModulos) {
    const match = duracao.match(/(\d+)/);
    const semanas = match ? parseInt(match[1]) : 4;
    return `${semanas * 10 + qtdModulos * 2} horas`;
}
// ─── Servidor MCP ────────────────────────────────────────────────────────────
const server = new McpServer({
    name: 'geo-explorer',
    version: '1.0.0',
});
// ── Ferramenta: trilha ───────────────────────────────────────────────────────
server.registerTool('trilha', {
    description: 'Apresenta o plano de estudos de uma tecnologia. Se o nível não for informado, retorna a visão geral com todos os níveis disponíveis.',
    inputSchema: z.object({
        tecnologia: z
            .string()
            .describe('Tecnologia desejada: javascript, python, react, node ou devops'),
        nivel: z
            .enum(['iniciante', 'intermediario', 'avancado'])
            .optional()
            .describe('Nível da trilha (opcional): iniciante, intermediario ou avancado'),
    }),
}, async ({ tecnologia, nivel }) => {
    const { trilhas } = carregarTrilhas();
    const trilha = trilhas.find(t => t.id === tecnologia.toLowerCase());
    if (!trilha) {
        const disponiveis = trilhas.map(t => `• ${t.nome} (${t.id})`).join('\n');
        return {
            content: [
                {
                    type: 'text',
                    text: `Trilha "${tecnologia}" não encontrada.\n\nTrilhas disponíveis:\n${disponiveis}`,
                },
            ],
            isError: true,
        };
    }
    if (!nivel) {
        const linhas = [`# Trilha: ${trilha.nome}\n`, `${trilha.descricao}\n`];
        Object.entries(trilha.niveis).forEach(([nomeNivel, dados]) => {
            linhas.push(`## ${capitalizar(nomeNivel)}`);
            linhas.push(`- Duração: ${dados.duracao}`);
            linhas.push(`- Módulos: ${dados.modulos.length}\n`);
        });
        return { content: [{ type: 'text', text: linhas.join('\n') }] };
    }
    const nivelNorm = normalizarNivel(nivel);
    const dados = trilha.niveis[nivelNorm];
    if (!dados) {
        return {
            content: [{ type: 'text', text: `Nível "${nivel}" não encontrado para ${trilha.nome}.` }],
            isError: true,
        };
    }
    const linhas = [
        `# Trilha: ${trilha.nome} — ${capitalizar(nivelNorm)}`,
        ``,
        `${trilha.descricao}`,
        ``,
        `**Duração:** ${dados.duracao} | **Módulos:** ${dados.modulos.length}`,
        ``,
        `## Plano de Estudos`,
    ];
    dados.modulos.forEach(m => {
        linhas.push(`\n### Módulo ${m.numero}: ${m.titulo}`);
        m.topicos.forEach(t => linhas.push(`- ${t}`));
    });
    return { content: [{ type: 'text', text: linhas.join('\n') }] };
});
// ── Ferramenta: desafio ──────────────────────────────────────────────────────
server.registerTool('desafio', {
    description: 'Gera um desafio de código aleatório para praticar uma tecnologia em um nível específico.',
    inputSchema: z.object({
        tecnologia: z
            .string()
            .describe('Tecnologia: javascript, python, react, node ou devops'),
        nivel: z
            .enum(['iniciante', 'intermediario', 'avancado'])
            .describe('Nível de dificuldade: iniciante, intermediario ou avancado'),
    }),
}, async ({ tecnologia, nivel }) => {
    const { trilhas } = carregarTrilhas();
    const trilha = trilhas.find(t => t.id === tecnologia.toLowerCase());
    if (!trilha) {
        return {
            content: [{ type: 'text', text: `Tecnologia "${tecnologia}" não encontrada.` }],
            isError: true,
        };
    }
    const { desafios } = carregarDesafios();
    const nivelNorm = normalizarNivel(nivel);
    const lista = desafios[tecnologia.toLowerCase()]?.[nivelNorm];
    if (!lista || lista.length === 0) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Não há desafios para ${trilha.nome} no nível ${nivel}.`,
                },
            ],
            isError: true,
        };
    }
    const desafio = escolherAleatorio(lista);
    const texto = [
        `# Desafio: ${desafio.titulo}`,
        `**Tecnologia:** ${trilha.nome} | **Nível:** ${capitalizar(nivelNorm)}`,
        ``,
        `## Descrição`,
        desafio.descricao,
        ``,
        `## Exemplo de Entrada`,
        `\`\`\``,
        desafio.exemplo_entrada,
        `\`\`\``,
        ``,
        `## Exemplo de Saída`,
        `\`\`\``,
        desafio.exemplo_saida,
        `\`\`\``,
        ``,
        `## Dica`,
        desafio.dica,
        ``,
        `---`,
        `✅ Critérios: o código deve passar no exemplo, tratar casos extremos e ter pelo menos um teste.`,
    ].join('\n');
    return { content: [{ type: 'text', text: texto }] };
});
// ── Ferramenta: certificado ──────────────────────────────────────────────────
server.registerTool('certificado', {
    description: 'Gera um certificado fictício de conclusão de trilha para fins de portfólio.',
    inputSchema: z.object({
        tecnologia: z
            .string()
            .describe('Tecnologia concluída: javascript, python, react, node ou devops'),
        nivel: z
            .enum(['iniciante', 'intermediario', 'avancado'])
            .describe('Nível concluído: iniciante, intermediario ou avancado'),
        nome: z.string().describe('Nome completo do aluno para o certificado'),
    }),
}, async ({ tecnologia, nivel, nome }) => {
    const { trilhas } = carregarTrilhas();
    const trilha = trilhas.find(t => t.id === tecnologia.toLowerCase());
    if (!trilha) {
        return {
            content: [{ type: 'text', text: `Tecnologia "${tecnologia}" não encontrada.` }],
            isError: true,
        };
    }
    const nivelNorm = normalizarNivel(nivel);
    const dados = trilha.niveis[nivelNorm];
    if (!dados) {
        return {
            content: [{ type: 'text', text: `Nível "${nivel}" não encontrado.` }],
            isError: true,
        };
    }
    const dataFormatada = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    const codigo = gerarCodigoCertificado(nome, trilha.id, nivelNorm);
    const cargaHoraria = calcularCargaHoraria(dados.duracao, dados.modulos.length);
    const modulosLista = dados.modulos.map(m => `- ✓ ${m.titulo}`).join('\n');
    const texto = [
        `# 🌍 CERTIFICADO DE CONCLUSÃO — GEO-EXPLORER`,
        ``,
        `Certificamos que`,
        ``,
        `## ★ ${nome.toUpperCase()} ★`,
        ``,
        `concluiu com êxito a trilha de aprendizagem:`,
        ``,
        `**Trilha:** ${trilha.nome} — ${capitalizar(nivelNorm)}`,
        `**Duração:** ${dados.duracao}`,
        `**Carga Horária:** ${cargaHoraria}`,
        `**Módulos concluídos:** ${dados.modulos.length}`,
        ``,
        `## Módulos Concluídos`,
        modulosLista,
        ``,
        `---`,
        `**Data de emissão:** ${dataFormatada}`,
        `**Código do certificado:** ${codigo}`,
        ``,
        `*Este é um certificado fictício gerado pelo Geo-Explorer para fins de portfólio e aprendizagem.*`,
    ].join('\n');
    return { content: [{ type: 'text', text: texto }] };
});
// ── Inicialização ────────────────────────────────────────────────────────────
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('🌍 Geo-Explorer MCP Server rodando via stdio');
}
main().catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
});
