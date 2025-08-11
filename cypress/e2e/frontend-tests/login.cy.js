describe('Testes de Login - Frontend', () => {
     
    describe('Cenários de Sucesso', () => {
  
      it('Deve fazer login com usuário administrador com sucesso', () => {
        // Criar usuário administrador via API
        cy.generateUser({ administrador: 'true' }).then(adminData => {
          cy.createUser(adminData).then(response => {
            expect(response.status).to.eq(201);

            cy.visitLoginPage();
            
            // Fazer login pelo front
            cy.get(selectors.telaLogin.inputEmail).type(adminData.email);
            cy.get(selectors.telaLogin.inputSenha).type(adminData.password);
            cy.get(selectors.telaLogin.botaoLogin).click();
            
            cy.url().should('include', '/admin/home');
            cy.contains('Bem Vindo').should('be.visible');
            cy.contains(adminData.nome).should('be.visible');
            
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
        });
      });
  

      it('Deve fazer login com usuário padrão com sucesso', () => {
        // Criar usuário padrão via API
        cy.generateUser({ administrador: 'false' }).then(userData => {
          cy.createUser(userData).then(response => {
            expect(response.status).to.eq(201);
            
            cy.visitLoginPage();
            cy.get(selectors.telaLogin.inputEmail).type(userData.email);
            cy.get(selectors.telaLogin.inputSenha).type(userData.password);
            cy.get(selectors.telaLogin.botaoLogin).click();
            
            cy.url().should('include', '/home');
            
            //confirmando que não possui acesso as funções de administrador
            cy.get(selectors.headerAdmin.cadastrarUsuario).should('not.exist');
            cy.get(selectors.headerAdmin.listarUsuarios).should('not.exist');
            cy.get(selectors.headerAdmin.cadastrarProdutos).should('not.exist');
            cy.get(selectors.headerAdmin.listarProdutos).should('not.exist');
            cy.get(selectors.headerAdmin.relatorios).should('not.exist');

            //validando elementos da visão do usuário
            cy.contains('Serverest Store').should('be.visible');
            cy.get(selectors.homeUser.listaCompras).should('be.visible');
            cy.get(selectors.homeUser.carrinhoButton).should('be.visible');
            cy.get(selectors.homeUser.botaoPesquisar).should('be.visible');
            cy.get(selectors.homeUser.adicionarProdutoLista).should('be.visible');
            cy.get(selectors.homeUser.logoutButton).should('be.visible');

          });
        });
      });
  

      it('Deve permitir login usando Enter', () => {
        cy.generateUser().then(userData => {
          cy.createUser(userData).then(response => {
            expect(response.status).to.eq(201);
            
            cy.visitLoginPage();
            cy.get(selectors.telaLogin.inputEmail).type(userData.email);
            cy.get(selectors.telaLogin.inputSenha).type(userData.password);
            
            cy.get(selectors.telaLogin.inputSenha).type('{enter}');
            
            cy.url().should('not.include', '/login');
            cy.url().should('include', '/home');

          });
        });
      });


      it('Deve fazer logout com sucesso', () => {
        // Criar usuário padrão via API
        cy.generateUser({ administrador: 'false' }).then(userData => {
          cy.createUser(userData).then(response => {
            expect(response.status).to.eq(201);
            
            cy.visitLoginPage();
            cy.get(selectors.telaLogin.inputEmail).type(userData.email);
            cy.get(selectors.telaLogin.inputSenha).type(userData.password);
            cy.get(selectors.telaLogin.botaoLogin).click();
            
            cy.url().should('include', '/home');

            //validando elementos da visão do usuário
            cy.contains('Serverest Store').should('be.visible');
            cy.get(selectors.homeUser.listaCompras).should('be.visible');
            cy.get(selectors.homeUser.carrinhoButton).should('be.visible');
            cy.get(selectors.homeUser.botaoPesquisar).should('be.visible');
            cy.get(selectors.homeUser.adicionarProdutoLista).should('be.visible');
            cy.get(selectors.homeUser.logoutButton).should('be.visible');

            //fazendo logout
            cy.get(selectors.homeUser.logoutButton).click();

            //voltando pra tela de login
            cy.url().should('include', '/login');
            cy.get(selectors.telaLogin.inputEmail).should('be.visible');
            cy.get(selectors.telaLogin.inputSenha).should('be.visible');
            cy.get(selectors.telaLogin.botaoLogin).should('be.visible');
            cy.get(selectors.telaLogin.linkCadastro).should('be.visible');

          });
        });
      });

      it('Deve permanecer autenticado ao dar refresh na página', () => {
        // Criar usuário padrão via API
        cy.generateUser({ administrador: 'false' }).then(userData => {
          cy.createUser(userData).then(response => {
            expect(response.status).to.eq(201);
            
            cy.visitLoginPage();
            cy.get(selectors.telaLogin.inputEmail).type(userData.email);
            cy.get(selectors.telaLogin.inputSenha).type(userData.password);
            cy.get(selectors.telaLogin.botaoLogin).click();
            
            cy.url().should('include', '/home');

            //validando elementos da visão do usuário
            cy.contains('Serverest Store').should('be.visible');
            cy.get(selectors.homeUser.listaCompras).should('be.visible');
            cy.get(selectors.homeUser.carrinhoButton).should('be.visible');
            cy.get(selectors.homeUser.botaoPesquisar).should('be.visible');
            cy.get(selectors.homeUser.adicionarProdutoLista).should('be.visible');
            cy.get(selectors.homeUser.logoutButton).should('be.visible');

            //fazendo logout
            cy.reload();

            cy.contains('Serverest Store').should('be.visible');
            cy.get(selectors.homeUser.listaCompras).should('be.visible');
            cy.get(selectors.homeUser.carrinhoButton).should('be.visible');
            cy.get(selectors.homeUser.botaoPesquisar).should('be.visible');
            cy.get(selectors.homeUser.adicionarProdutoLista).should('be.visible');
            cy.get(selectors.homeUser.logoutButton).should('be.visible');

          });
        });
      });
  
    });
  
    describe('Cenários de Falha', () => {
  
      it('Deve falhar com email e senha inválidos', () => {

        cy.visitLoginPage();
        cy.get(selectors.telaLogin.inputEmail).type('usuario@inexistente.com');
        cy.get(selectors.telaLogin.inputSenha).type('senhaErrada123');
        cy.get(selectors.telaLogin.botaoLogin).click();
        
        cy.contains('Email e/ou senha inválidos').should('be.visible');
        
        cy.url().should('include', '/login');
      });
  

      it('Deve falhar com email válido e senha inválida', () => {

        cy.generateUser().then(userData => {
          cy.createUser(userData).then(response => {
            expect(response.status).to.eq(201);
            
            cy.visitLoginPage();
            cy.get(selectors.telaLogin.inputEmail).type(userData.email);
            cy.get(selectors.telaLogin.inputSenha).type('senhaErrada123');
            cy.get(selectors.telaLogin.botaoLogin).click();
            
            cy.contains('Email e/ou senha inválidos').should('be.visible');
            
            cy.url().should('include', '/login');
          });
        });
      });
  

      it('Deve falhar com email inválido e senha válida', () => {
        cy.generateUser().then(userData => {
          cy.createUser(userData).then(response => {
            expect(response.status).to.eq(201);
            
            cy.visitLoginPage();
            cy.get(selectors.telaLogin.inputEmail).type('email@inexistente.com');
            cy.get(selectors.telaLogin.inputSenha).type(userData.password);
            cy.get(selectors.telaLogin.botaoLogin).click();
            
            cy.contains('Email e/ou senha inválidos').should('be.visible');
            
            cy.url().should('include', '/login');
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
  
      it('Deve exibir placeholders corretos nos campos', () => {
        
        cy.visitLoginPage();
        cy.get(selectors.telaLogin.inputEmail)
          .should('have.attr', 'placeholder')
          .and('include', 'Digite seu email');
          
        cy.get(selectors.telaLogin.inputSenha)
          .should('have.attr', 'placeholder')
          .and('include', 'Digite sua senha');
      });
  

      it('Deve ter campo de senha com tipo password', () => {
        
        cy.visitLoginPage();
        cy.get(selectors.telaLogin.inputSenha).should('have.attr', 'type', 'password');
      });
  

      it('Deve ter campo de email com tipo email', () => {
        
        cy.visitLoginPage();
        cy.get(selectors.telaLogin.inputEmail).should('have.attr', 'type', 'email');
      });
  

      it('Deve exibir texto correto no botão de login', () => {
        
        cy.visitLoginPage();
        cy.get(selectors.telaLogin.botaoLogin).should('contain.text', 'Entrar');
      });
  

      it('Deve exibir link para cadastro com texto correto', () => {
        
        cy.visitLoginPage();
        cy.get(selectors.telaLogin.linkCadastro).should('contain.text', 'Cadastre-se');
      });
  

      it('Deve redirecionar para página de cadastro ao clicar no link', () => {
        
        cy.visitLoginPage();
        cy.get(selectors.telaLogin.linkCadastro).click();
        
        cy.url().should('include', '/cadastrarusuarios');
      });
  
  
      it('Deve limpar campos após tentativa de login com erro', () => {
        
        cy.visitLoginPage();
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