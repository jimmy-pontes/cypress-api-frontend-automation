describe('Fluxo de testes nas APIs de Usuários', () => {
    let authToken;
    let adminUser;
  
    before('Criar e logar usuário administrador', () => {
      cy.createAndLoginAdmin();
      
      cy.get('@user').then(user => {
        adminUser = user;
        authToken = window.localStorage.getItem('authToken');
        cy.log('Admin criado e logado:', user.email);
      });
    });
  
    describe('Consultar lista de usuários', () => {
      
      it('Deve retornar lista de usuários ativos com sucesso', () => {
        cy.api({
          method: 'GET',
          url: Cypress.config('apiBaseUrl') + routes.usersRoute.listarUsuarios,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('usuarios');
          expect(response.body).to.have.all.keys('quantidade', 'usuarios');
      
          expect(response.body.quantidade).to.be.a('number');
          expect(response.body.usuarios).to.be.an('array');
          
          // Validar consistência entre quantidade e array
          expect(response.body.usuarios).to.have.length(response.body.quantidade);
          
          // Validar que existe pelo menos 1 usuário
          expect(response.body.quantidade).to.be.greaterThan(0);
          expect(response.body.usuarios.length).to.be.greaterThan(0);
          
          // Validar estrutura de cada usuário na lista
          response.body.usuarios.forEach(usuario => {
            expect(usuario).to.have.all.keys('_id', 'nome', 'email', 'password', 'administrador');
            expect(usuario._id).to.be.a('string').and.not.be.empty;
            expect(usuario.nome).to.be.a('string').and.not.be.empty;
            expect(usuario.email).to.be.a('string').and.not.be.empty;
            expect(usuario.password).to.be.a('string').and.not.be.empty;
            expect(usuario.administrador).to.be.oneOf(['true', 'false']);
          });
        });
      });
  
    }); 
  
    describe('Consultar usuário específico por ID', () => {
      let usuarioTeste;
      let usuarioId;
  
      beforeEach('Criar usuário para teste', () => {
        cy.generateUser().then(userData => {
          cy.createUser(userData).then(response => {
            expect(response.status).to.eq(201);
            usuarioId = response.body._id;
            usuarioTeste = { ...userData, _id: usuarioId };
            cy.wrap(usuarioTeste).as('usuarioTeste');
          });
        });
      });
  
      it('Deve consultar usuário por ID com sucesso', () => {
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.buscarUsuario}/${usuarioId}`,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.all.keys('_id', 'nome', 'email', 'password', 'administrador');
          expect(response.body._id).to.equal(usuarioId);
          expect(response.body.nome).to.equal(usuarioTeste.nome);
          expect(response.body.email).to.equal(usuarioTeste.email);
        });
      });
  
      it('Deve falhar ao consultar usuário com ID inexistente', () => {
        const idInexistente = '0000000000000000'; 
        
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.buscarUsuario}/${idInexistente}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.equal('Usuário não encontrado');
        });
      });
  
      it('Deve falhar ao consultar usuário com ID inválido', () => {
        const idInvalido = 'abc';
        
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.buscarUsuario}/${idInvalido}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.id).to.equal('id deve ter exatamente 16 caracteres alfanuméricos');
        });
      });
  
    }); 


    describe('Editar usuário', () => {
    let usuarioTeste;
    let usuarioId;

    beforeEach('Criar usuário para teste', () => {
      cy.generateUser().then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          usuarioId = response.body._id;
          usuarioTeste = { ...userData, _id: usuarioId };
        });
      });
    });

    it('Deve editar usuário com sucesso', () => {
      const dadosAtualizados = {
        nome: 'Nome Atualizado',
        email: `atualizado${Date.now()}@exemplo.com`,
        password: 'NovaSenha123',
        administrador: 'true'
      };

      cy.api({
        method: 'PUT',
        url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.editarUsuario}/${usuarioId}`,
        headers: {
          'Authorization': authToken
        },
        body: dadosAtualizados
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.equal('Registro alterado com sucesso');
      });

      // Verificar se as alterações foram aplicadas
      cy.api({
        method: 'GET',
        url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.buscarUsuario}/${usuarioId}`,
        headers: {
          'Authorization': authToken
        }
      }).then(response => {
        expect(response.body.nome).to.equal(dadosAtualizados.nome);
        expect(response.body.email).to.equal(dadosAtualizados.email);
        expect(response.body.administrador).to.equal(dadosAtualizados.administrador);
      });
    });


    it('Deve falhar ao editar usuário com dados inválidos', () => {
      const dadosInvalidos = {
        nome: '',
        email: 'email_invalido',
        password: '',
        administrador: 'talvez'
      };

      cy.api({
        method: 'PUT',
        url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.editarUsuario}/${usuarioId}`,
        headers: {
          'Authorization': authToken
        },
        body: dadosInvalidos,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body.nome).to.equal('nome não pode ficar em branco');
        expect(response.body.email).to.equal('email deve ser um email válido');
        expect(response.body.password).to.equal('password não pode ficar em branco');
        expect(response.body.administrador).to.equal("administrador deve ser 'true' ou 'false'");
      });
    });

  });


    describe('Excluir usuário', () => {
    let usuarioTeste;
    let usuarioId;

    beforeEach('Criar usuário para teste', () => {
      cy.generateUser().then(userData => {
        cy.createUser(userData).then(response => {
          expect(response.status).to.eq(201);
          usuarioId = response.body._id;
          usuarioTeste = { ...userData, _id: usuarioId };
        });
      });
    });

    it('Deve excluir usuário com sucesso', () => {
      cy.api({
        method: 'DELETE',
        url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.excluirUsuario}/${usuarioId}`,
        headers: {
          'Authorization': authToken
        }
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.equal('Registro excluído com sucesso');
      });

      // Verificar se o usuário foi realmente excluído
      cy.api({
        method: 'GET',
        url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.buscarUsuario}/${usuarioId}`,
        headers: {
          'Authorization': authToken
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.equal('Usuário não encontrado');
      });
    });

    it('Deve falhar ao excluir usuário inexistente', () => {
      const idInexistente = '507f1f77bcf86cd799439011';
      
      cy.api({
        method: 'DELETE',
        url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.excluirUsuario}/${idInexistente}`,
        headers: {
          'Authorization': authToken
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.equal('Nenhum registro excluído');
      });
    });

    it('Deve falhar ao excluir usuário com ID inválido', () => {
      const idInvalido = '123456';
      
      cy.api({
        method: 'DELETE',
        url: `${Cypress.config('apiBaseUrl')}${routes.usersRoute.excluirUsuario}/${idInvalido}`,
        headers: {
          'Authorization': authToken
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.equal('Nenhum registro excluído');
      });
    });

  
    after('Limpeza', () => {
      // Limpar dados criados durante os testes
      cy.clearLocalStorage();
    });
  
  });
  
}); 
