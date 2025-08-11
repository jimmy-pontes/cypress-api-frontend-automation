# 🧪 Testes Automatizados de API e Frontend

Este projeto demonstra a implementação de testes automatizados de API e Frontend utilizando o Cypress, com uma arquitetura modular, escalável e multiambiente. A aplicação alvo é a [ServerRest](https://serverest.dev).

- **Frontend:** https://front.serverest.dev  
- **API & Documentação:** https://serverest.dev

## 📋 Pré-requisitos

Antes de executar os testes, certifique-se de ter instalado:

### **Node.js (Obrigatório)**
- **Versão mínima:** 16.x ou superior (recomendado: 18+)
- **Download:** [https://nodejs.org/](https://nodejs.org/)
- **Verificar instalação:** 
  ```bash
  node --version
  npm --version
  ```

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/jimmy-pontes/cypress-api-frontend-automation.git
cd cypress-api-frontend-automation
```

### 2. Instale as dependências

```bash
npm install
```

## 🚀 Execução dos Testes

Os comandos personalizados estão definidos no arquivo package.json

### Interface do Cypress

```bash
npm run open
```

Abre a interface gráfica do Cypress, permitindo selecionar os testes manualmente e acompanhar a execução em tempo real.

### Execução em terminal (headless)

```bash
npm run all
```

Executa todos os testes automaticamente no terminal, exibindo apenas os resultados.

### Execução de teste específico

```bash
npm run spec --spec="cypress/e2e/caminho/do/teste.cy.js"
```

Executa apenas o arquivo de teste especificado.

### Execução de todos os testes de uma pasta

```bash
npm run spec --spec="cypress/e2e/caminho/da/pasta"
```

Executa todos os testes contidos na pasta especificada.

### Definindo o ambiente de execução

Para rodar os testes em um ambiente específico, adicione o parâmetro `ENV` antes do comando:

- Para Windows:
```bash
$env:ENV = "staging"; npm run {comando}
```

- Para MacOs
```bash
ENV=staging npm run {comando}
```


## 🗂️ Estrutura do Projeto

```
cypress-api-frontend-automation/
├── cypress/
│   ├── e2e/
│   │   ├── api-tests/           → Testes de API
│   │   │   
│   │   └── frontend-tests/      → Testes da interface web
│   │      
│   ├── fixtures/                → Dados de teste (JSON)
│   ├── mappings/
│   │   ├── routes/              → Rotas do backend
│   │   │   
│   │   └── selectors/           → Seletores do frontend
│   │       
│   ├── screenshots/             → Screenshots dos testes
│   └── support/
│       ├── commands.js          → Comandos personalizados reutilizáveis
│       ├── config.js            → Configuração de URLs por ambiente
│       └── e2e.js               → Centralização das importações
├── cypress.config.js            → Configuração principal do Cypress
├── package.json                 → Dependências e scripts
└── README.md                    → Documentação do projeto
```


## 🧠 Arquivos principais da arquitetura


#### 📄 `support/commands.js`

Este arquivo centraliza todas os comandos personalizados que são chamados nos arquivos de teste.

- Comandos que fazem diversas verificações e ações constantes nos testes.
- Possibilita testes menos verbosos chamando comandos específicos.
- Melhor manutenção e centralização de código.

**Exemplos de commands:**
```javascript
cy.generateUser()        // Gera dados de usuário
cy.createUser()          // Cria usuário via API
cy.fazerLoginCompleto()  // Login completo via Frontend
cy.visitLoginPage()      // Navega para página de login
```

#### 📄 `support/e2e.js`

Este arquivo centraliza todas as configurações e importações necessárias para a execução dos testes.

- É carregado automaticamente pelo Cypress ao iniciar os testes.
- Nele são importados módulos como `commands.js`, `config.js`, além das variáveis de ambiente.
- Garante que todas as dependências estejam disponíveis globalmente nos testes, evitando importações repetidas em cada arquivo de teste.


#### 📄 `support/config.js`

Este arquivo define as **URLs base** utilizadas durante a execução dos testes, separadas por ambiente.


#### 📄 `cypress.config.js`

Este arquivo é o ponto central de configuração do Cypress. Ele define o comportamento global dos testes e, neste projeto, permite a execução dos testes por ambiente (`dev`, `staging`, `prod`).

## 🎯 Cenários de Teste Implementados

### **API Tests:**
- ✅ **Login:** Autenticação com diferentes tipos de usuário
- ✅ **Usuários:** CRUD completo de usuários
- ✅ **Produtos:** CRUD completo de produtos
- ✅ **Carrinhos:** Gerenciamento de carrinho de compras
- ✅ **Cadastro:** Validações de cadastro via API

### **Frontend Tests:**
- ✅ **Login:** Fluxo completo de autenticação via interface
- ✅ **Cadastro:** Validações de cadastro via formulário
- ✅ **Lista de Compras:** Adição de produtos à lista

## ✅ Boas Práticas Implementadas

- Arquitetura multiambiente para testes isolados e realistas.
- Separação clara entre testes de API e Frontend.
- Comandos customizados reutilizáveis para reduzir duplicações.
- Organização modular para facilitar manutenção e escalabilidade.
- O projeto pode ser facilmente integrado a pipelines CI/CD.


## 📌 Requisitos

- Node.js (versão recomendada: 18+)
- Cypress (instalado via `npm install`)


## 👤 Autor

**Jimmy Pontes**  
QA Engineer Sênior | Test Automation | Web | API | Mobile

---

> Este projeto visa demonstrar boas práticas em automação de testes com Cypress.