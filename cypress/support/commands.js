
//////////////////////////////////////////////////////////BACKEND///////////////////////////////////////////////////////

// Login
Cypress.Commands.add('login', (email, password) => {
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
Cypress.Commands.add('generateUser', (overrides = {}) => {
    const defaultUser = {
      nome: Cypress.faker.person.fullName(),
      email: Cypress.faker.internet.email(),
      password: '123456',
      administrador: 'false',
    };
    return cy.wrap({ ...defaultUser, ...overrides });
  });
  


  // Criar usuário via API
  Cypress.Commands.add('createUser', (userData) => {
    return cy.api({
      method: 'POST',
      url: Cypress.config('apiBaseUrl') + routes.usersRoute.cadastrarUsuario,
      body: userData,
      failOnStatusCode: false,
    });
  });



// Cria usuario e loga  
Cypress.Commands.add('createAndLoginUser', (isAdmin = false) => {
  const randomSuffix = Date.now() + Math.floor(Math.random() * 1000);
  const user = {
    nome: `Usuário Teste ${randomSuffix}`,
    email: `usuario${randomSuffix}@exemplo.com`,
    password: `Senha@${randomSuffix}`,
    administrador: isAdmin.toString()
  };

  // Criar usuário
  cy.createUser(user).then((response) => {
    expect(response.status).to.eq(201);
  });

  // Fazer login
  cy.login(user.email, user.password).then((loginResponse) => {
    expect(loginResponse.status).to.eq(200);
    expect(loginResponse.body.message).to.equal('Login realizado com sucesso');
    expect(loginResponse.body.authorization).not.be.empty;
    
    window.localStorage.setItem('authToken', loginResponse.body.authorization);
    cy.wrap(user).as('user');
  });
});




// Cria administrador e loga  
Cypress.Commands.add('createAndLoginAdmin', () => {
  cy.createAndLoginUser(true);
});




// Gerar payload padrão de produto
Cypress.Commands.add('generateProduct', (overrides = {}) => {
  const randomSuffix = Date.now() + Math.floor(Math.random() * 1000);
  const defaultProduct = {
    nome: `Produto Teste ${randomSuffix}`,
    preco: Math.floor(Math.random() * 1000) + 100,
    descricao: `Descrição do produto teste ${randomSuffix}`,
    quantidade: Math.floor(Math.random() * 50) + 1
  };
  return cy.wrap({ ...defaultProduct, ...overrides });
});

// Criar produto via API
Cypress.Commands.add('createProduct', (productData, authToken) => {
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
Cypress.Commands.add('generateCart', (overrides = {}) => {
  const defaultCart = {
    produtos: [
      {
        idProduto: '',
        quantidade: Math.floor(Math.random() * 5) + 1
      }
    ]
  };
  return cy.wrap({ ...defaultCart, ...overrides });
});

// Criar carrinho via API
Cypress.Commands.add('createCart', (cartData, authToken) => {
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
Cypress.Commands.add('createProductForCart', (authToken) => {
  const randomSuffix = Date.now() + Math.floor(Math.random() * 1000);
  const productData = {
    nome: `Produto Carrinho ${randomSuffix}`,
    preco: Math.floor(Math.random() * 1000) + 100,
    descricao: `Descrição do produto para carrinho ${randomSuffix}`,
    quantidade: Math.floor(Math.random() * 50) + 10
  };

  return cy.api({
    method: 'POST',
    url: Cypress.config('apiBaseUrl') + routes.productsRoute.cadastrarProduto,
    headers: {
      'Authorization': authToken
    },
    body: productData
  });
});



//////////////////////////////////////////////////////////FRONTEND///////////////////////////////////////////////////////


Cypress.Commands.add('visitLoginPage', () => {
  cy.visit(Cypress.config('frontendBaseUrl'));
  
  // Verificar se todos os elementos da tela de login estão visíveis
  cy.get(selectors.telaLogin.inputEmail, { timeout: 10000 }).should('be.visible');
  cy.get(selectors.telaLogin.inputSenha).should('be.visible');
  cy.get(selectors.telaLogin.botaoLogin).should('be.visible');
  cy.get(selectors.telaLogin.linkCadastro).should('be.visible');
  
});


Cypress.Commands.add('visitCadastro', () => {
  cy.visit(Cypress.config('frontendBaseUrl') + '/cadastrarusuarios');
  
  // Verificar se todos os elementos da tela de cadastro estão visíveis
  cy.get(selectors.telaCadastro.inputNome, { timeout: 10000 }).should('be.visible');
  cy.get(selectors.telaCadastro.inputEmail).should('be.visible');
  cy.get(selectors.telaCadastro.inputPassword).should('be.visible');
  cy.get(selectors.telaCadastro.checkboxAdministrador).should('be.visible');
  cy.get(selectors.telaCadastro.botaoCadastrar).should('be.visible');
  
});


Cypress.Commands.add('preencherCadastro', (userData, isAdmin = false) => {
  cy.get(selectors.telaCadastro.inputNome).clear().type(userData.nome);
  cy.get(selectors.telaCadastro.inputEmail).clear().type(userData.email);
  cy.get(selectors.telaCadastro.inputPassword).clear().type(userData.password);
  
  if (isAdmin) {
    cy.get(selectors.telaCadastro.checkboxAdministrador).check();
  } else {
    cy.get(selectors.telaCadastro.checkboxAdministrador).uncheck();
  }
  
});


Cypress.Commands.add('cadastrarViaUI', (userData, isAdmin = false) => {
  cy.visitCadastro();
  cy.preencherCadastro(userData, isAdmin);
  cy.get(selectors.telaCadastro.botaoCadastrar).click();
  });


  
// Comando para adicionar produto ao carrinho
Cypress.Commands.add('adicionarProdutoLista', () => {
  cy.get(selectors.homeUser.adicionarProdutoLista).first().click();
  
  
});



// Comando para fazer login completo via frontend
Cypress.Commands.add('fazerLoginCompleto', (userData) => {
  cy.visitLoginPage();
  
  cy.get(selectors.telaLogin.inputEmail).type(userData.email);
  cy.get(selectors.telaLogin.inputSenha).type(userData.password);
  cy.get(selectors.telaLogin.botaoLogin).click();
  
  
});


// Comando para setup completo de produto e usuário
Cypress.Commands.add('setupProdutoEUsuario', () => {
  let adminToken, produtoId, userData;
  
  // Criar admin para cadastrar produto
  cy.createAndLoginAdmin();
  cy.get('@user').then(admin => {
    adminToken = window.localStorage.getItem('authToken');
    
    // Criar produto
    cy.createProductForCart(adminToken).then(response => {
      expect(response.status).to.eq(201);
      produtoId = response.body._id;
      
      // Criar usuário padrão para comprar
      cy.generateUser({ administrador: 'false' }).then(user => {
        userData = user;
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          
          // Retornar dados necessários
          cy.wrap({
            produto: { id: produtoId, ...response.body },
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
  
  // Aguardar página carregar
  cy.contains('Lista de Compras', { timeout: 10000 }).should('be.visible');
  
});



// Comando para verificar produto na lista de compras
Cypress.Commands.add('verificarProdutoNaLista', (nomeProduto) => {
  cy.contains(nomeProduto).should('be.visible');
  cy.contains('Total: 1').should('be.visible');
  
});


// limpar lista de compras
Cypress.Commands.add('limparListaCompras', () => {
  cy.get(selectors.listaCompras.limparLista).click();

});


// fazer logout
Cypress.Commands.add('logoutUser', () => {
  cy.get(selectors.listaCompras.logoutButton).click();

});


// Comando para validar elementos da área administrativa
Cypress.Commands.add('validarAreaAdmin', (nomeUsuario) => {
  cy.url().should('include', '/admin/home');
  cy.contains('Bem Vindo').should('be.visible');
  cy.contains(nomeUsuario).should('be.visible');
  
  // Validar header admin
  cy.get(selectors.headerAdmin.cadastrarUsuario).should('be.visible');
  cy.get(selectors.headerAdmin.listarUsuarios).should('be.visible');
  cy.get(selectors.headerAdmin.cadastrarProdutos).should('be.visible');
  cy.get(selectors.headerAdmin.listarProdutos).should('be.visible');
  cy.get(selectors.headerAdmin.relatorios).should('be.visible');
  cy.get(selectors.headerAdmin.logoutButton).should('be.visible');

  // Validar home admin
  cy.get(selectors.homeAdmin.cadastrarUsuario).should('be.visible');
  cy.get(selectors.homeAdmin.listarUsuarios).should('be.visible');
  cy.get(selectors.homeAdmin.cadastrarProdutos).should('be.visible');
  cy.get(selectors.homeAdmin.listarProdutos).should('be.visible');
  cy.get(selectors.homeAdmin.relatorios).should('be.visible');
  
});

// Comando para validar elementos da área do usuário
Cypress.Commands.add('validarAreaUsuario', () => {
  cy.url().should('include', '/home');
  
  // Confirmar que NÃO possui acesso às funções de administrador
  cy.get(selectors.headerAdmin.cadastrarUsuario).should('not.exist');
  cy.get(selectors.headerAdmin.listarUsuarios).should('not.exist');
  cy.get(selectors.headerAdmin.cadastrarProdutos).should('not.exist');
  cy.get(selectors.headerAdmin.listarProdutos).should('not.exist');
  cy.get(selectors.headerAdmin.relatorios).should('not.exist');

  // Validar elementos da visão do usuário
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
Cypress.Commands.add('tentarLogin', (email, senha) => {
  cy.visitLoginPage();
  cy.get(selectors.telaLogin.inputEmail).type(email);
  cy.get(selectors.telaLogin.inputSenha).type(senha);
  cy.get(selectors.telaLogin.botaoLogin).click();
  
});

// Comando para login completo com validação de sucesso
Cypress.Commands.add('fazerLoginCompletoComValidacao', (userData, tipoUsuario = 'user') => {
  cy.fazerLoginCompleto(userData);
  
  if (tipoUsuario === 'admin') {
    cy.validarAreaAdmin(userData.nome);
  } else {
    cy.validarAreaUsuario();
  }
  
});