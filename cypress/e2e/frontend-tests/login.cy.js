describe('Testes de Login - Frontend', () => {
     
  describe('Cenários de Sucesso', () => {

    it('Deve fazer login com usuário administrador com sucesso', () => {
      cy.generateUser({ administrador: 'true' }).then(adminData => {
        cy.createUser(adminData).then(response => {
          expect(response.status).to.eq(201);
          
          cy.fazerLoginCompletoComValidacao(adminData, 'admin');
        });
      });
    });

    it('Deve fazer login com usuário padrão com sucesso', () => {
      cy.generateUser({ administrador: 'false' }).then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          
          cy.fazerLoginCompletoComValidacao(userData, 'user');
        });
      });
    });

    it('Deve permitir login usando Enter', () => {
      cy.generateUser().then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          
          cy.visitLoginPage();
          cy.get(selectors.telaLogin.inputEmail).type(userData.email);
          cy.get(selectors.telaLogin.inputSenha).type(userData.password + '{enter}');
          
          cy.validarAreaUsuario();
        });
      });
    });

    it('Deve fazer logout com sucesso', () => {
      cy.generateUser({ administrador: 'false' }).then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          
          cy.fazerLoginCompletoComValidacao(userData, 'user');
          cy.fazerLogout();
        });
      });
    });

    it('Deve permanecer autenticado ao dar refresh na página', () => {
      cy.generateUser({ administrador: 'false' }).then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          
          cy.fazerLoginCompletoComValidacao(userData, 'user');
          
          cy.reload();
          cy.validarAreaUsuario();
        });
      });
    });

  });

  describe('Cenários de Falha', () => {

    it('Deve falhar com email e senha inválidos', () => {
      cy.tentarLogin('usuario@inexistente.com', 'senhaErrada123');
      cy.validarErroLogin();
    });

    it('Deve falhar com email válido e senha inválida', () => {
      cy.generateUser().then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          
          cy.tentarLogin(userData.email, 'senhaErrada123');
          cy.validarErroLogin();
        });
      });
    });

    it('Deve falhar com email inválido e senha válida', () => {
      cy.generateUser().then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          
          cy.tentarLogin('email@inexistente.com', userData.password);
          cy.validarErroLogin();
        });
      });
    });

    it('Deve falhar ao tentar login com campos vazios', () => {
      cy.visitLoginPage();
      cy.get(selectors.telaLogin.botaoLogin).click();
      
      cy.contains('Email é obrigatório').should('be.visible');
      cy.contains('Password é obrigatório').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('Deve falhar ao tentar login apenas com email preenchido', () => {
      cy.visitLoginPage();
      cy.get(selectors.telaLogin.inputEmail).type('usuario@test.com');
      cy.get(selectors.telaLogin.botaoLogin).click();
      
      cy.contains('Password é obrigatório').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('Deve falhar ao tentar login apenas com senha preenchida', () => {
      cy.visitLoginPage();
      cy.get(selectors.telaLogin.inputSenha).type('senha123');
      cy.get(selectors.telaLogin.botaoLogin).click();
      
      cy.contains('Email é obrigatório').should('be.visible');
      cy.url().should('include', '/login');
    });

  });

  describe('Validações de Interface', () => {

    beforeEach('Acessar página de login', () => {
      cy.visitLoginPage();
    });

    it('Deve exibir placeholders corretos nos campos', () => {
      cy.get(selectors.telaLogin.inputEmail)
        .should('have.attr', 'placeholder')
        .and('include', 'Digite seu email');
        
      cy.get(selectors.telaLogin.inputSenha)
        .should('have.attr', 'placeholder')
        .and('include', 'Digite sua senha');
    });

    it('Deve ter campos com tipos corretos', () => {
      cy.get(selectors.telaLogin.inputEmail).should('have.attr', 'type', 'email');
      cy.get(selectors.telaLogin.inputSenha).should('have.attr', 'type', 'password');
    });

    it('Deve exibir textos corretos', () => {
      cy.get(selectors.telaLogin.botaoLogin).should('contain.text', 'Entrar');
      cy.get(selectors.telaLogin.linkCadastro).should('contain.text', 'Cadastre-se');
    });

    it('Deve redirecionar para página de cadastro ao clicar no link', () => {
      cy.get(selectors.telaLogin.linkCadastro).click();
      cy.url().should('include', '/cadastrarusuarios');
    });

    it('Deve limpar campos após tentativa de login com erro', () => {
      cy.get(selectors.telaLogin.inputEmail).type('usuario@inexistente.com');
      cy.get(selectors.telaLogin.inputSenha).type('senhaErrada123');
      cy.get(selectors.telaLogin.botaoLogin).click();
      
      cy.contains('Email e/ou senha inválidos').should('be.visible');
      
      cy.get(selectors.telaLogin.inputEmail).clear().should('have.value', '');
      cy.get(selectors.telaLogin.inputSenha).clear().should('have.value', '');
    });

  });

  afterEach('Limpar localStorage e cookies', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

});