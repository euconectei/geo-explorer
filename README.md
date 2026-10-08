# 🌍 Geo-Explorer

Explorador de trilhas de aprendizagem desenvolvido como projeto de portfólio para o desafio da [DIO](https://web.dio.me).

O Geo-Explorer permite consultar trilhas de estudo, receber desafios de código e gerar certificados fictícios de conclusão — tudo via CLI ou como ferramentas de um servidor MCP integrado ao IBM Bob.

---

## 📁 Estrutura do Projeto

```
geo-explorer/
├── src/
│   ├── index.js              # Ponto de entrada da CLI
│   ├── commands/
│   │   ├── trilha.js         # Comando /trilha
│   │   ├── desafio.js        # Comando /desafio
│   │   └── certificado.js    # Comando /certificado
│   ├── data/
│   │   ├── trilhas.json      # Base de trilhas fictícias
│   │   └── desafios.json     # Base de desafios por tecnologia e nível
│   └── utils/
│       └── loader.js         # Utilitários de leitura de dados
├── mcp-server/
│   ├── src/index.ts          # Servidor MCP (TypeScript)
│   ├── build/                # Build compilado do servidor MCP
│   ├── package.json
│   └── tsconfig.json
├── tests/
│   ├── trilha.test.js        # Testes do comando /trilha
│   ├── desafio.test.js       # Testes do comando /desafio
│   ├── certificado.test.js   # Testes do comando /certificado
│   └── loader.test.js        # Testes dos utilitários de dados
├── docs/
│   └── (documentação adicional)
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

Todos os comandos são executados via `node src/index.js` ou simplesmente `npm start`.

### `/trilha` — Plano de estudos

Apresenta as trilhas disponíveis ou o plano de estudos de uma tecnologia.

```bash
# Lista todas as trilhas disponíveis
node src/index.js /trilha

# Visão geral de uma trilha
node src/index.js /trilha javascript
node src/index.js /trilha python

# Plano de estudos detalhado por nível
node src/index.js /trilha javascript iniciante
node src/index.js /trilha python intermediario
node src/index.js /trilha react avancado
```

**Tecnologias disponíveis:** `javascript` | `python` | `react` | `node` | `devops`
**Níveis disponíveis:** `iniciante` | `intermediario` | `avancado`

---

### `/desafio` — Desafio de código

Gera um desafio de código aleatório para praticar.

```bash
node src/index.js /desafio javascript iniciante
node src/index.js /desafio python intermediario
node src/index.js /desafio react avancado
```

---

### `/certificado` — Certificado de conclusão

Gera um certificado fictício de conclusão de trilha.

```bash
node src/index.js /certificado javascript iniciante "Maria Silva"
node src/index.js /certificado python avancado "João Santos"
node src/index.js /certificado react intermediario "Ana Pereira"
```

> ⚠️ Coloque seu nome entre aspas quando ele contiver espaços.

---

## 🧪 Como Executar os Testes

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (re-executa ao salvar)
npm run test:watch

# Ver relatório de cobertura
npm run test:coverage
```

Os testes cobrem:
- **55 casos de teste** distribuídos em 4 arquivos
- Todos os comandos: `/trilha`, `/desafio`, `/certificado`
- Utilitários de dados: carregamento, busca, normalização, aleatoriedade

---

## 🔌 Servidor MCP

O Geo-Explorer também expõe seus recursos como um **servidor MCP** (Model Context Protocol), permitindo que ferramentas como o IBM Bob utilizem os comandos diretamente.

### Compilar o servidor MCP

```bash
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

| Ferramenta    | Descrição                                          |
|---------------|----------------------------------------------------|
| `trilha`      | Retorna o plano de estudos de uma tecnologia       |
| `desafio`     | Gera um desafio de código aleatório                |
| `certificado` | Gera um certificado fictício de conclusão          |

---

## 💡 Melhorias Realizadas

- **5 trilhas completas** (JavaScript, Python, React, Node.js, DevOps) com 3 níveis cada, totalizando mais de 100 módulos e 400+ tópicos
- **Aliases de nível** — aceita variações como `avançado`, `advanced`, `básico`, `beginner` etc.
- **Código de certificado determinístico** — o mesmo nome + trilha + nível sempre gera o mesmo código (útil para verificação)
- **Carga horária calculada automaticamente** com base na duração e quantidade de módulos
- **55 testes automatizados** cobrindo casos de sucesso, erros e casos extremos
- **Servidor MCP em TypeScript** com tipos explícitos e validação com Zod

---

## 📚 O Que Aprendi

- Como estruturar um projeto CLI modular com ES Modules no Node.js
- Como construir e registrar um **servidor MCP** com `@modelcontextprotocol/sdk`
- Como usar o **Zod** para validação de esquemas de entrada nas ferramentas MCP
- Como escrever testes com **Jest** para módulos ES (`--experimental-vm-modules`)
- Como separar responsabilidades: dados → utilitários → comandos → interface

---

## ⚠️ Aviso

Este projeto é fictício e educacional. Os certificados gerados **não têm validade real** e existem apenas para fins de portfólio e prática.

---

## 📄 Licença

MIT
