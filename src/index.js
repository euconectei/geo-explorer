#!/usr/bin/env node

/**
 * Geo-Explorer CLI
 * Ponto de entrada principal do projeto.
 *
 * Uso:
 *   node src/index.js /trilha <tecnologia> [nivel]
 *   node src/index.js /desafio <tecnologia> <nivel>
 *   node src/index.js /certificado <tecnologia> <nivel> "<nome>"
 */

import { comandoTrilha } from './commands/trilha.js';
import { comandoDesafio } from './commands/desafio.js';
import { comandoCertificado } from './commands/certificado.js';

const args = process.argv.slice(2);
const comando = args[0];

function exibirAjuda() {
  console.log(`
🌍 GEO-EXPLORER — Explorador de Trilhas de Aprendizagem
========================================================

Comandos disponíveis:

  /trilha <tecnologia> [nivel]
      Apresenta o plano de estudos de uma tecnologia.
      Ex: /trilha javascript
          /trilha python iniciante

  /desafio <tecnologia> <nivel>
      Gera um desafio de código para praticar.
      Ex: /desafio javascript iniciante
          /desafio react intermediario

  /certificado <tecnologia> <nivel> "<nome>"
      Gera um certificado fictício de conclusão.
      Ex: /certificado python avancado "Maria Silva"

  --help | -h
      Exibe esta mensagem de ajuda.

Tecnologias disponíveis: javascript | python | react | node | devops
Níveis disponíveis: iniciante | intermediario | avancado
`);
}

switch (comando) {
  case '/trilha': {
    const tecnologia = args[1];
    const nivel = args[2];
    console.log(comandoTrilha(tecnologia, nivel));
    break;
  }

  case '/desafio': {
    const tecnologia = args[1];
    const nivel = args[2];
    console.log(comandoDesafio(tecnologia, nivel));
    break;
  }

  case '/certificado': {
    const tecnologia = args[1];
    const nivel = args[2];
    // Nome pode ter espaços e vir entre aspas — já é resolvido pelo shell
    const nome = args.slice(3).join(' ').replace(/^["']|["']$/g, '');
    console.log(comandoCertificado(tecnologia, nivel, nome));
    break;
  }

  case '--help':
  case '-h':
  case undefined:
    exibirAjuda();
    break;

  default:
    console.error(`❌ Comando desconhecido: "${comando}"`);
    console.error('   Use --help para ver os comandos disponíveis.');
    process.exit(1);
}
