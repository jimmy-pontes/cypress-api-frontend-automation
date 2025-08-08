# 🧪 Testes Automatizados de API e Frontend

Este projeto demonstra a implementação de testes automatizados de API e Frontend utilizando o Cypress, com uma arquitetura modular, escalável e multiambiente. A aplicação alvo é a [ServerRest](https://serverest.dev).

- **Frontend:** https://front.serverest.dev  
- **API & Documentação:** https://serverest.dev


## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/jimmy-pontes/cypress-api-frontend-automation.git
cd nome-do-repositorio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie o arquivo `.env.dev` na raiz do projeto com o seguinte conteúdo:

```env
USER_EMAIL=example@example.com
USER_PASS=example_password
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=example_password
```

Substitua os valores de e-mail e senha pelas credenciais corretas para execução dos testes localmente.

> ℹ️ A arquitetura permite testes em múltiplos ambientes (`dev`, `staging`, `prod`). Para isso, basta criar os arquivos `.env.dev`, `.env.staging` e `.env.prod`, com os respectivos dados de cada ambiente.


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

```bash
ENV=staging npm run spec --spec="cypress/e2e/..."
```


## 🗂️ Estrutura do Projeto

```
/cypress
  /e2e
    /api-tests           → Testes de API
    /frontend-tests      → Testes da interface web
  /support
    commands.js          → Comandos personalizados reutilizáveis
    config.js            → Configuração de URLs por ambiente
    e2e.js               → Centralização das importações do projeto
    users.js             → Gerenciamento de credenciais por ambiente
```


## 🧠 Arquivos principais da arquitetura


#### 📄 `cypress/e2e.js`

Este arquivo centraliza todas as configurações e importações necessárias para a execução dos testes.

- É carregado automaticamente pelo Cypress ao iniciar os testes.
- Nele são importados módulos como `commands.js`, `users.js`, `config.js`, além das variáveis de ambiente.
- Garante que todas as dependências estejam disponíveis globalmente nos testes, evitando importações repetidas em cada arquivo de teste.



#### 📄 `support/config.js`

Este arquivo define as **URLs base** utilizadas durante a execução dos testes, separadas por ambiente.


#### 📄 `users.js`

Este arquivo centraliza as credenciais utilizadas nos testes, separando-as por tipo de usuário (`user`, `admin`), com valores carregados dinamicamente a partir das variáveis de ambiente.

### Exemplo:

```js
const users = {
  user: {
    email: Cypress.env('USER_EMAIL'),
    password: Cypress.env('USER_PASS')
  },
  admin: {
    email: Cypress.env('ADMIN_EMAIL'),
    password: Cypress.env('ADMIN_PASS')
  }
};
module.exports = users;
```

### 📌 Finalidade

- **Segurança:** Evita expor credenciais sensíveis.
- **Flexibilidade:** Permite execução de testes com usuários diferentes por ambiente (`dev`, `staging`, `prod`).
- **Centralização:** Facilita a manutenção e reutilização das credenciais nos testes.

#### 📄 `cypress.config.js`

Este arquivo é o ponto central de configuração do Cypress. Ele define o comportamento global dos testes e, neste projeto, é responsável por **carregar dinamicamente as variáveis de ambiente de acordo com o ambiente de execução** (`dev`, `staging`, `prod`).

### 📌 Funcionamento detalhado

O `cypress.config.js` utiliza os pacotes `dotenv` e `fs` para ler o arquivo `.env` do ambiente configurado (ex: `.env.dev`, `.env.staging`).

Ele verifica o valor da variável `ENV` (padrão `dev`), carrega o arquivo `.env.${ENV}`, e injeta essas variáveis em `config.env`.


## ✅ Boas Práticas Implementadas

- Arquitetura multiambiente para testes isolados e realistas.
- Separação clara entre testes de API e Frontend.
- Uso de variáveis de ambiente para segurança e flexibilidade.
- Comandos customizados reutilizáveis para reduzir duplicações.
- Organização modular para facilitar manutenção e escalabilidade.
- O projeto pode ser facilmente integrado a pipelines CI/CD.


## 📌 Requisitos

- Node.js (versão recomendada: 18+)
- Cypress (instalado via `npm install`)
- Acesso às credenciais de teste da aplicação ServerRest


## 👤 Autor

**Jimmy Pontes**  
QA Engineer Sênior | Test Automation | Web | API | Mobile

---

> Este projeto visa demonstrar boas práticas em automação de testes com Cypress.