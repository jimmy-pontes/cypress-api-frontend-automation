describe('Fluxo completo de cadastro de usuários', () => {

    it('Criar usuário administrador com sucesso', () => {
      cy.generateUser({ administrador: 'true' }).then((user) => {
        cy.createUser(user).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.message).to.eq('Cadastro realizado com sucesso');
          expect(response.body._id).and.not.empty;
        });
      });
    });
  

    it('Criar usuário padrão com sucesso', () => {
      cy.generateUser().then((user) => {
        cy.createUser(user).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.message).to.eq('Cadastro realizado com sucesso');
          expect(response.body._id).and.not.empty;
        });
      });
    });
  
    it('Criar usuário com email duplicado', () => {
      cy.generateUser().then((user) => {
        cy.createUser(user).then(() => {
          cy.createUser(user).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.message).to.eq('Este email já está sendo usado');
          });
        });
      });
    });
  
    it('Criar usuário sem informar nome, email, senha e administrador e receber erro', () => {
      const user = {nome: '', email: '', password: '', administrador: ''};
      cy.createUser(user).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.nome).to.eq('nome não pode ficar em branco');
        expect(response.body.email).to.eq('email não pode ficar em branco');
        expect(response.body.password).to.eq('password não pode ficar em branco');
        expect(response.body.administrador).to.eq("administrador deve ser 'true' ou 'false'");
      });
    });
  
  
    it('Criar usuário com email inválido', () => {
      cy.generateUser({ email: 'email_invalido' }).then((user) => {
        cy.createUser(user).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.email).to.eq('email deve ser um email válido');
        });
      });
    });
  
    it('Criar usuário com payload vazio', () => {
      cy.createUser({}).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.nome).to.eq('nome é obrigatório');
        expect(response.body.email).to.eq('email é obrigatório');
        expect(response.body.password).to.eq('password é obrigatório');
        expect(response.body.administrador).to.eq('administrador é obrigatório');
      });
    });
  
  });