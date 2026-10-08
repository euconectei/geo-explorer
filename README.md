# 🌍 Geo-Explorer

Explorador de trilhas de aprendizagem desenvolvido como projeto de portfólio para o desafio da [DIO](https://web.dio.me).

O Geo-Explorer permite consultar trilhas de estudo, receber desafios de código e gerar certificados fictícios de conclusão — tudo via CLI ou como ferramentas de um servidor MCP integrado ao IBM Bob.

---

## 📁 Estrutura do Projeto

```
geo-explorer/
├── src/
│   ├── index.js                  # Ponto de entrada da CLI
│   ├── commands/
│   │   ├── trilha.js             # Comando /trilha
│   │   ├── desafio.js            # Comando /desafio
│   │   └── certificado.js        # Comando /certificado (texto + PDF)
│   ├── data/
│   │   ├── trilhas.json          # Base de trilhas fictícias
│   │   └── desafios.json         # Base de desafios por tecnologia e nível
│   └── utils/
│       ├── loader.js             # Utilitários de leitura de dados
│       └── pdfGenerator.js       # Gerador de certificado em PDF (pdfkit)
├── mcp-server/
│   ├── src/index.ts              # Servidor MCP (TypeScript)
│   ├── build/                    # Build compilado do servidor MCP
│   ├── package.json
│   └── tsconfig.json
├── tests/
│   ├── trilha.test.js            # Testes do comando /trilha
│   ├── desafio.test.js           # Testes do comando /desafio
│   ├── certificado.test.js       # Testes do comando /certificado
│   ├── loader.test.js            # Testes dos utilitários de dados
│   └── pdf-diagnostico.js        # Script de diagnóstico visual do PDF
├── certificados/                 # PDFs gerados (ignorado pelo git)
└── package.json
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/geo-explorer.git
cd geo-explorer

# Instale as dependências
npm install
```

---

## 🖥️ Como Usar os Comandos

Todos os comandos são executados via `node src/index.js`.

### `/trilha` — Plano de estudos

Apresenta as trilhas disponíveis ou o plano de estudos de uma tecnologia.

```bash
# Lista todas as trilhas disponíveis
node src/index.js /trilha

# Visão geral de uma trilha (todos os níveis)
node src/index.js /trilha javascript
node src/index.js /trilha python

# Plano de estudos detalhado por nível
node src/index.js /trilha javascript iniciante
node src/index.js /trilha python intermediario
node src/index.js /trilha react avancado
```

**Tecnologias disponíveis:** `javascript` | `python` | `react` | `node` | `devops`  
**Níveis disponíveis:** `iniciante` | `intermediario` | `avancado`

> O comando também aceita aliases: `avançado`, `advanced`, `básico`, `beginner`, `intermediário`, `intermediate`.

---

### `/desafio` — Desafio de código

Gera um desafio de código aleatório para praticar.

```bash
node src/index.js /desafio javascript iniciante
node src/index.js /desafio python intermediario
node src/index.js /desafio react avancado
```

Cada chamada sorteia um desafio diferente da base. O resultado inclui descrição, exemplo de entrada/saída e uma dica.

---

### `/certificado` — Certificado de conclusão

Gera um certificado fictício de conclusão de trilha em formato texto.  
Com a flag `--pdf`, também salva o certificado como arquivo PDF na pasta `certificados/`.

```bash
# Somente texto no terminal
node src/index.js /certificado javascript iniciante "Maria Silva"
node src/index.js /certificado python avancado "João Santos"
node src/index.js /certificado react intermediario "Ana Pereira"

# Texto + arquivo PDF gerado em certificados/
node src/index.js /certificado react intermediario "Ana Pereira" --pdf
```

> ⚠️ Coloque seu nome entre aspas quando ele contiver espaços.

O PDF gerado é uma página A4 em modo paisagem com fundo escuro, borda decorativa, nome do aluno em destaque, caixa de informações da trilha, lista de módulos concluídos e código único de verificação.

O código do certificado é **determinístico**: o mesmo nome + trilha + nível sempre gera o mesmo código — útil para verificar autenticidade fictícia.

---

## 🧪 Como Executar os Testes

```bash
# Rodar todos os testes automatizados
npm test

# Rodar em modo watch (re-executa ao salvar)
npm run test:watch

# Ver relatório de cobertura
npm run test:coverage
```

Os testes cobrem:
- **55 casos de teste** distribuídos em 4 arquivos
- Todos os comandos: `/trilha`, `/desafio`, `/certificado`
- Utilitários de dados: carregamento, busca, normalização de níveis, aleatoriedade

### Diagnóstico visual do PDF

Para inspecionar o layout do certificado PDF com guias visuais (linhas de centro, bounding boxes, coordenadas):

```bash
node tests/pdf-diagnostico.js
```

Gera dois arquivos em `certificados/`:
- `diagnostico-guias.pdf` — grade de alinhamento com todas as caixas rotuladas
- `certificado-GEO-ANAPREAINT-2026-46872.pdf` — certificado real para comparação

---

## 🔌 Servidor MCP

O Geo-Explorer também expõe seus recursos como um **servidor MCP** (Model Context Protocol), permitindo que ferramentas como o IBM Bob utilizem os comandos diretamente em conversas.

### Compilar o servidor MCP

```bash
# A partir da raiz do projeto
npm run mcp:build

# Ou manualmente
cd mcp-server
npm install
npm run build
```

### Registrar no IBM Bob

Adicione ao seu `mcp.json` (workspace ou global):

```json
{
  "mcpServers": {
    "geo-explorer": {
      "command": "node",
      "args": ["/caminho/absoluto/para/geo-explorer/mcp-server/build/index.js"]
    }
  }
}
```

### Ferramentas disponíveis via MCP

| Ferramenta    | Parâmetros                              | Descrição                                     |
|---------------|-----------------------------------------|-----------------------------------------------|
| `trilha`      | `tecnologia`, `nivel` (opcional)        | Retorna o plano de estudos de uma tecnologia  |
| `desafio`     | `tecnologia`, `nivel`                   | Gera um desafio de código aleatório           |
| `certificado` | `tecnologia`, `nivel`, `nome`           | Gera um certificado fictício de conclusão     |

---

## 💡 Melhorias Realizadas

- **5 trilhas completas** (JavaScript, Python, React, Node.js, DevOps) com 3 níveis cada, totalizando mais de 100 módulos e 400+ tópicos
- **Aliases de nível** — aceita variações como `avançado`, `advanced`, `básico`, `beginner` etc.
- **Geração de PDF** com a flag `--pdf` — certificado em página A4 paisagem com layout visual, usando `pdfkit`
- **Código de certificado determinístico** — o mesmo nome + trilha + nível sempre gera o mesmo código
- **Carga horária calculada automaticamente** com base na duração e quantidade de módulos
- **55 testes automatizados** cobrindo casos de sucesso, erros e casos extremos
- **Script de diagnóstico visual** para inspecionar o layout do PDF com guias de alinhamento
- **Servidor MCP em TypeScript** com tipos explícitos e validação com Zod

---

## 📚 O Que Aprendi

- Como estruturar um projeto CLI modular com ES Modules no Node.js
- Como gerar PDFs programaticamente com `pdfkit`, usando coordenadas absolutas para evitar quebras de página automáticas e problemas com caracteres especiais
- Como construir e registrar um **servidor MCP** com `@modelcontextprotocol/sdk`
- Como usar o **Zod** para validação de esquemas de entrada nas ferramentas MCP
- Como escrever testes com **Jest** para módulos ES (`--experimental-vm-modules`)
- Como criar testes de diagnóstico visual para validar layout de documentos gerados

---

## ⚠️ Aviso

Este projeto é fictício e educacional. Os certificados gerados **não têm validade real** e existem apenas para fins de portfólio e prática.

---

## 📄 Licença

MIT
