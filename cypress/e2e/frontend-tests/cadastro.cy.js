describe('Testes de Cadastro - Frontend', () => {

    describe('Cenários de Sucesso', () => {
  
      it('Deve cadastrar usuário com sucesso', () => {
        cy.generateUser().then(userData => {
          cy.cadastrarViaUI(userData, false);
          
          // Verificar sucesso
          cy.contains('Cadastro realizado com sucesso').should('be.visible');
          cy.url().should('include', '/home');
        });
      });


      it('Deve cadastrar administrador com sucesso', () => {
        cy.generateUser().then(userData => {
          cy.cadastrarViaUI(userData, true);
          
          cy.contains('Cadastro realizado com sucesso').should('be.visible');
          cy.url().should('include', '/admin/home');
        });
      });
  
    });
  
    describe('Cenários de Falha', () => {
  
      beforeEach('Abrir página de cadastro', () => {
        cy.visitCadastro();
      });
  

      it('Deve falhar ao tentar cadastrar com campos vazios', () => {
        cy.get(selectors.telaCadastro.botaoCadastrar).click();
        
        cy.contains('Nome é obrigatório').should('be.visible');
        cy.contains('Email é obrigatório').should('be.visible');
        cy.contains('Password é obrigatório').should('be.visible');
        
        cy.url().should('include', '/cadastrarusuarios');
      });
  
  
    });
  

    describe('Validações de Interface', () => {
  
      beforeEach('Abrir página de cadastro', () => {
        cy.visitCadastro();
      });
  
      it('Deve exibir placeholders corretos nos campos', () => {
        cy.get(selectors.telaCadastro.inputNome)
          .should('have.attr', 'placeholder')
          .and('include', 'Digite seu nome');
          
        cy.get(selectors.telaCadastro.inputEmail)
          .should('have.attr', 'placeholder')
          .and('include', 'Digite seu email');
          
        cy.get(selectors.telaCadastro.inputPassword)
          .should('have.attr', 'placeholder')
          .and('include', 'Digite sua senha');
      });
  

      it('Deve ter campos com tipos corretos', () => {
        cy.get(selectors.telaCadastro.inputNome).should('have.attr', 'type', 'text');
        cy.get(selectors.telaCadastro.inputEmail).should('have.attr', 'type', 'email');
        cy.get(selectors.telaCadastro.inputPassword).should('have.attr', 'type', 'password');
        cy.get(selectors.telaCadastro.checkboxAdministrador).should('have.attr', 'type', 'checkbox');
      });
  

      it('Deve exibir textos corretos dos elementos', () => {
        cy.get(selectors.telaCadastro.botaoCadastrar).should('contain.text', 'Cadastrar');
        cy.contains('Cadastrar como administrador?').should('be.visible');
        cy.contains('Já é cadastrado?').should('be.visible');
        cy.contains('Entrar').should('be.visible');
      });
  

      it('Deve redirecionar para login ao clicar em "Entrar"', () => {
        cy.get(selectors.telaCadastro.botaoEntrar).click();
        cy.url().should('include', '/login');
      });
  
  
    });
  
    afterEach('Limpar dados', () => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });
  
  });