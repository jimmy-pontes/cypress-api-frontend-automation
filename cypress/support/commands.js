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