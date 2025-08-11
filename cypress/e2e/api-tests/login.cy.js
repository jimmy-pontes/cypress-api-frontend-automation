describe('Fluxo de login', () => {

    it('Login com sucesso de usuário padrão', () => {
        cy.createAndLoginUser();
      
        cy.get('@user').then(user => {
          cy.log('Usuário criado e logado:', user.email);
        });
      });


      it('Login com sucesso de usuário administrador', () => {
        cy.createAndLoginAdmin();
      
        cy.get('@user').then(user => {
          cy.log('Usuário criado e logado:', user.email);
        });
      });


      it('Login com credenciais não cadastradas', () => {
        
        const credenciais = {
          email: 'naoexiste@example.com',
          password: 'naoexiste'
        };
    
        cy.api({
          method: 'POST',
          url: Cypress.config('apiBaseUrl') + routes.loginRoute.login,
          body: credenciais,
          failOnStatusCode: false
  
        }).then(response => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.equal('Email e/ou senha inválidos');
          expect(response.body).to.not.have.property('authorization');
      });
      });


      it('Login sem informar as credenciais', () => {
        
        const credenciais = {
          email: '',
          password: ''
        };
    
        cy.api({
          method: 'POST',
          url: Cypress.config('apiBaseUrl') + routes.loginRoute.login,
          body: credenciais,
          failOnStatusCode: false
  
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.email).to.equal('email não pode ficar em branco');
          expect(response.body.password).to.equal('password não pode ficar em branco');
      });
      });


      it('Login com email inválido', () => {
        
        const credenciais = {
          email: 'invalido',
          password: '123456'
        };
    
        cy.api({
          method: 'POST',
          url: Cypress.config('apiBaseUrl') + routes.loginRoute.login,
          body: credenciais,
          failOnStatusCode: false
  
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.email).to.equal('email deve ser um email válido');
      });
      });


      it('Login com payload vazio', () => {
        
        const credenciais = {
          
        };
    
        cy.api({
          method: 'POST',
          url: Cypress.config('apiBaseUrl') + routes.loginRoute.login,
          body: credenciais,
          failOnStatusCode: false
  
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.email).to.equal('email é obrigatório');
          expect(response.body.password).to.equal('password é obrigatório');

      });
      });
  
  
  });
