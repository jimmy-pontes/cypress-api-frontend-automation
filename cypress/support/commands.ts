import { faker } from '@faker-js/faker';
import { UserData, ProductData, CartData } from './types';

//////////////////////////////////////////////////////////BACKEND///////////////////////////////////////////////////////

// Login
Cypress.Commands.add('login', (email: string, password: string) => {
  return cy.api({
    method: 'POST',
    url: Cypress.config('apiBaseUrl') + routes.loginRoute.login,
    body: {
      email,
      password,
    },
    failOnStatusCode: false,
  });
});

// Gerar payload padrão de usuário (com possibilidade de sobrescrever campos)
Cypress.Commands.add('generateUser', (overrides: Partial<UserData> = {}) => {
  const defaultUser: UserData = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: '123456',
    administrador: 'false',
  };
  return cy.wrap({ ...defaultUser, ...overrides });
});

// Criar usuário via API
Cypress.Commands.add('createUser', (userData: UserData) => {
  return cy.api({
    method: 'POST',
    url: Cypress.config('apiBaseUrl') + routes.usersRoute.cadastrarUsuario,
    body: userData,
    failOnStatusCode: false,
  });
});

// Cria usuario e loga
Cypress.Commands.add('createAndLoginUser', (isAdmin: boolean = false) => {
  cy.generateUser({
    administrador: isAdmin.toString() as 'true' | 'false',
  }).then((user: UserData) => {

    cy.createUser(user).then((response) => {
      expect(response.status).to.eq(201);
    });

    cy.login(user.email, user.password).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      expect(loginResponse.body.message).to.equal('Login realizado com sucesso');
      expect(loginResponse.body.authorization).not.be.empty;

      window.localStorage.setItem('authToken', loginResponse.body.authorization);
      cy.wrap(user).as('user');
    });
  });
});

// Cria administrador e loga
Cypress.Commands.add('createAndLoginAdmin', () => {
  cy.createAndLoginUser(true);
});

// Gerar payload padrão de produto
Cypress.Commands.add('generateProduct', (overrides: Partial<ProductData> = {}) => {
  const defaultProduct: ProductData = {
    nome: faker.commerce.productName() + ' ' + Date.now(),
    preco: faker.number.int({ min: 100, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 50 }),
  };
  return cy.wrap({ ...defaultProduct, ...overrides });
});

// Criar produto via API
Cypress.Commands.add('createProduct', (productData: ProductData, authToken: string) => {
  return cy.api({
    method: 'POST',
    url: Cypress.config('apiBaseUrl') + routes.productsRoute.cadastrarProduto,
    headers: {
      'Authorization': authToken
    },
    body: productData,
    failOnStatusCode: false,
  });
});

// Gerar payload padrão de carrinho
Cypress.Commands.add('generateCart', (overrides: Partial<CartData> = {}) => {
  const defaultCart: CartData = {
    produtos: [
      {
        idProduto: '',
        quantidade: faker.number.int({ min: 1, max: 5 }),
      }
    ]
  };
  return cy.wrap({ ...defaultCart, ...overrides });
});

// Criar carrinho via API
Cypress.Commands.add('createCart', (cartData: CartData, authToken: string) => {
  return cy.api({
    method: 'POST',
    url: Cypress.config('apiBaseUrl') + routes.cartRoute.cadastrarCarrinho,
    headers: {
      'Authorization': authToken
    },
    body: cartData,
    failOnStatusCode: false,
  });
});

// Criar produto para usar no carrinho
Cypress.Commands.add('createProductForCart', (authToken: string) => {
  cy.generateProduct({ quantidade: faker.number.int({ min: 10, max: 50 }) }).then((productData: ProductData) => {
    return cy.api({
      method: 'POST',
      url: Cypress.config('apiBaseUrl') + routes.productsRoute.cadastrarProduto,
      headers: {
        'Authorization': authToken
      },
      body: productData
    });
  });
});

//////////////////////////////////////////////////////////FRONTEND///////////////////////////////////////////////////////

Cypress.Commands.add('visitLoginPage', () => {
  cy.visit(Cypress.config('frontendBaseUrl') as string);

  cy.get(selectors.telaLogin.inputEmail, { timeout: 10000 }).should('be.visible');
  cy.get(selectors.telaLogin.inputSenha).should('be.visible');
  cy.get(selectors.telaLogin.botaoLogin).should('be.visible');
  cy.get(selectors.telaLogin.linkCadastro).should('be.visible');
});

Cypress.Commands.add('visitCadastro', () => {
  cy.visit(Cypress.config('frontendBaseUrl') + '/cadastrarusuarios');

  cy.get(selectors.telaCadastro.inputNome, { timeout: 10000 }).should('be.visible');
  cy.get(selectors.telaCadastro.inputEmail).should('be.visible');
  cy.get(selectors.telaCadastro.inputPassword).should('be.visible');
  cy.get(selectors.telaCadastro.checkboxAdministrador).should('be.visible');
  cy.get(selectors.telaCadastro.botaoCadastrar).should('be.visible');
});

Cypress.Commands.add('preencherCadastro', (userData: UserData, isAdmin: boolean = false) => {
  cy.get(selectors.telaCadastro.inputNome).clear().type(userData.nome);
  cy.get(selectors.telaCadastro.inputEmail).clear().type(userData.email);
  cy.get(selectors.telaCadastro.inputPassword).clear().type(userData.password);

  if (isAdmin) {
    cy.get(selectors.telaCadastro.checkboxAdministrador).check();
  } else {
    cy.get(selectors.telaCadastro.checkboxAdministrador).uncheck();
  }
});

Cypress.Commands.add('cadastrarViaUI', (userData: UserData, isAdmin: boolean = false) => {
  cy.visitCadastro();
  cy.preencherCadastro(userData, isAdmin);
  cy.get(selectors.telaCadastro.botaoCadastrar).click();
});

// Comando para adicionar produto à lista
Cypress.Commands.add('adicionarProdutoLista', () => {
  cy.get(selectors.homeUser.adicionarProdutoLista).first().click();
});

// Comando para fazer login completo via frontend
Cypress.Commands.add('fazerLoginCompleto', (userData: UserData) => {
  cy.visitLoginPage();

  cy.get(selectors.telaLogin.inputEmail).type(userData.email);
  cy.get(selectors.telaLogin.inputSenha).type(userData.password);
  cy.get(selectors.telaLogin.botaoLogin).click();
});

// Comando para setup completo de produto e usuário
Cypress.Commands.add('setupProdutoEUsuario', () => {
  cy.createAndLoginAdmin();
  cy.get('@user').then(() => {
    const adminToken = window.localStorage.getItem('authToken') as string;

    cy.createProductForCart(adminToken).then(response => {
      expect(response.status).to.eq(201);
      const produtoId = response.body._id;

      cy.generateUser({ administrador: 'false' }).then((userData: UserData) => {
        cy.createUser(userData).then(createResponse => {
          expect(createResponse.status).to.eq(201);

          cy.wrap({
            produto: { id: produtoId, ...createResponse.body },
            usuario: userData,
            adminToken: adminToken
          }).as('setupData');
        });
      });
    });
  });
});

// Comando para acessar lista de compras
Cypress.Commands.add('visitListaCompras', () => {
  cy.get(selectors.homeUser.listaCompras).click();
  cy.contains('Lista de Compras', { timeout: 10000 }).should('be.visible');
});

// Comando para verificar produto na lista de compras
Cypress.Commands.add('verificarProdutoNaLista', (nomeProduto: string) => {
  cy.contains(nomeProduto).should('be.visible');
  cy.contains('Total: 1').should('be.visible');
});

// Limpar lista de compras
Cypress.Commands.add('limparListaCompras', () => {
  cy.get(selectors.listaCompras.limparLista).click();
});

// Fazer logout
Cypress.Commands.add('logoutUser', () => {
  cy.get(selectors.listaCompras.logoutButton).click();
});

// Comando para validar elementos da área administrativa
Cypress.Commands.add('validarAreaAdmin', (nomeUsuario: string) => {
  cy.url().should('include', '/admin/home');
  cy.contains('Bem Vindo').should('be.visible');
  cy.contains(nomeUsuario).should('be.visible');

  cy.get(selectors.headerAdmin.cadastrarUsuario).should('be.visible');
  cy.get(selectors.headerAdmin.listarUsuarios).should('be.visible');
  cy.get(selectors.headerAdmin.cadastrarProdutos).should('be.visible');
  cy.get(selectors.headerAdmin.listarProdutos).should('be.visible');
  cy.get(selectors.headerAdmin.relatorios).should('be.visible');
  cy.get(selectors.headerAdmin.logoutButton).should('be.visible');

  cy.get(selectors.homeAdmin.cadastrarUsuario).should('be.visible');
  cy.get(selectors.homeAdmin.listarUsuarios).should('be.visible');
  cy.get(selectors.homeAdmin.cadastrarProdutos).should('be.visible');
  cy.get(selectors.homeAdmin.listarProdutos).should('be.visible');
  cy.get(selectors.homeAdmin.relatorios).should('be.visible');
});

// Comando para validar elementos da área do usuário
Cypress.Commands.add('validarAreaUsuario', () => {
  cy.url().should('include', '/home');

  cy.get(selectors.headerAdmin.cadastrarUsuario).should('not.exist');
  cy.get(selectors.headerAdmin.listarUsuarios).should('not.exist');
  cy.get(selectors.headerAdmin.cadastrarProdutos).should('not.exist');
  cy.get(selectors.headerAdmin.listarProdutos).should('not.exist');
  cy.get(selectors.headerAdmin.relatorios).should('not.exist');

  cy.contains('Serverest Store').should('be.visible');
  cy.get(selectors.homeUser.listaCompras).should('be.visible');
  cy.get(selectors.homeUser.carrinhoButton).should('be.visible');
  cy.get(selectors.homeUser.botaoPesquisar).should('be.visible');
  cy.get(selectors.homeUser.adicionarProdutoLista).should('be.visible');
  cy.get(selectors.homeUser.logoutButton).should('be.visible');
});

// Comando para validar elementos da tela de login
Cypress.Commands.add('validarTelaLogin', () => {
  cy.url().should('include', '/login');
  cy.get(selectors.telaLogin.inputEmail).should('be.visible');
  cy.get(selectors.telaLogin.inputSenha).should('be.visible');
  cy.get(selectors.telaLogin.botaoLogin).should('be.visible');
  cy.get(selectors.telaLogin.linkCadastro).should('be.visible');
});

// Comando para validar mensagem de erro de login
Cypress.Commands.add('validarErroLogin', () => {
  cy.contains('Email e/ou senha inválidos').should('be.visible');
  cy.url().should('include', '/login');
});

// Comando para fazer logout
Cypress.Commands.add('fazerLogout', () => {
  cy.get(selectors.homeUser.logoutButton).click();
  cy.validarTelaLogin();
});

// Comando para tentar login (sem validação de sucesso)
Cypress.Commands.add('tentarLogin', (email: string, senha: string) => {
  cy.visitLoginPage();
  cy.get(selectors.telaLogin.inputEmail).type(email);
  cy.get(selectors.telaLogin.inputSenha).type(senha);
  cy.get(selectors.telaLogin.botaoLogin).click();
});

// Comando para login completo com validação de sucesso
Cypress.Commands.add('fazerLoginCompletoComValidacao', (userData: UserData, tipoUsuario: 'admin' | 'user' = 'user') => {
  cy.fazerLoginCompleto(userData);

  if (tipoUsuario === 'admin') {
    cy.validarAreaAdmin(userData.nome);
  } else {
    cy.validarAreaUsuario();
  }
});
