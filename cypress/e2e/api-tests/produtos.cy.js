describe('Fluxo de testes nas APIs de Produtos', () => {
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
  
    describe('Listar produtos', () => {
      
      it('Deve retornar lista de produtos com sucesso', () => {
        cy.api({
          method: 'GET',
          url: Cypress.config('apiBaseUrl') + routes.productsRoute.listarProdutos,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.all.keys('quantidade', 'produtos');
          
          expect(response.body.quantidade).to.be.a('number');
          expect(response.body.produtos).to.be.an('array');
          
          expect(response.body.produtos).to.have.length(response.body.quantidade);
          
          // Se houver produtos, validar estrutura
          if (response.body.quantidade > 0) {
            response.body.produtos.forEach(produto => {
              expect(produto).to.have.all.keys('_id', 'nome', 'preco', 'descricao', 'quantidade');
              expect(produto._id).to.be.a('string').and.not.be.empty;
              expect(produto.nome).to.be.a('string').and.not.be.empty;
              expect(produto.preco).to.be.a('number').and.be.greaterThan(0);
              expect(produto.descricao).to.be.a('string');
              expect(produto.quantidade).to.be.a('number').and.be.greaterThan(0);
            });
          }
          
          cy.log(`Total de produtos encontrados: ${response.body.quantidade}`);
        });
      });

  
    });
  

    describe('Cadastrar produto', () => {
      
      it('Deve cadastrar produto com sucesso', () => {
        cy.generateProduct().then(productData => {
          cy.createProduct(productData, authToken).then(response => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.equal('Cadastro realizado com sucesso');
            expect(response.body._id).to.be.a('string').and.not.be.empty;
            
            cy.wrap(response.body._id).as('produtoId');
          });
        });
      });
  

      it('Deve falhar ao cadastrar produto com nome duplicado', () => {
        // Primeiro criar um produto
        cy.generateProduct().then(productData => {
          cy.createProduct(productData, authToken).then(response => {
            expect(response.status).to.eq(201);
            
            // Tentar criar outro produto com mesmo nome
            cy.createProduct(productData, authToken).then(response => {
              expect(response.status).to.eq(400);
              expect(response.body.message).to.equal('Já existe produto com esse nome');
            });
          });
        });
      });
  

      it('Deve falhar ao cadastrar produto com dados inválidos', () => {
        const produtoInvalido = {
          nome: '',
          preco: -10,
          descricao: '',
          quantidade: -5
        };
  
        cy.createProduct(produtoInvalido, authToken).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.nome).to.equal('nome não pode ficar em branco');
          expect(response.body.preco).to.equal('preco deve ser um número positivo');
          expect(response.body.descricao).to.equal('descricao não pode ficar em branco');
          expect(response.body.quantidade).to.equal('quantidade deve ser maior ou igual a 0');
        });
      });
  

      it('Deve falhar ao cadastrar produto sem dados obrigatórios', () => {
        const produtoIncompleto = {};
  
        cy.createProduct(produtoIncompleto, authToken).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.nome).to.equal('nome é obrigatório');
          expect(response.body.preco).to.equal('preco é obrigatório');
          expect(response.body.descricao).to.equal('descricao é obrigatório');
          expect(response.body.quantidade).to.equal('quantidade é obrigatório');
        });
      });
  

      it('Deve falhar ao cadastrar produto sem autenticação', () => {
        cy.generateProduct().then(productData => {
          cy.api({
            method: 'POST',
            url: Cypress.config('apiBaseUrl') + routes.productsRoute.cadastrarProduto,
            body: productData,
            failOnStatusCode: false
          }).then(response => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
          });
        });
      });
  

      it('Deve falhar ao cadastrar produto com usuário não administrador', () => {
        // Criar usuário comum
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const userToken = window.localStorage.getItem('authToken');
          
          cy.generateProduct().then(productData => {
            cy.createProduct(productData, userToken).then(response => {
              expect(response.status).to.eq(403);
              expect(response.body.message).to.equal('Rota exclusiva para administradores');
            });
          });
        });
      });
  
    });
  

    describe('Buscar produto por ID', () => {
      let produtoTeste;
      let produtoId;
  
      beforeEach('Criar produto para teste', () => {
        cy.generateProduct().then(productData => {
          cy.createProduct(productData, authToken).then(response => {
            expect(response.status).to.eq(201);
            produtoId = response.body._id;
            produtoTeste = { ...productData, _id: produtoId };
            cy.wrap(produtoTeste).as('produtoTeste');
          });
        });
      });
  

      it('Deve buscar produto por ID com sucesso', () => {
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.buscarProduto}/${produtoId}`,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.all.keys('_id', 'nome', 'preco', 'descricao', 'quantidade');
          expect(response.body._id).to.equal(produtoId);
          expect(response.body.nome).to.equal(produtoTeste.nome);
          expect(response.body.preco).to.equal(produtoTeste.preco);
          expect(response.body.descricao).to.equal(produtoTeste.descricao);
          expect(response.body.quantidade).to.equal(produtoTeste.quantidade);
        });
      });
  

      it('Deve falhar ao buscar produto com ID inexistente', () => {
        const idInexistente = '0000000000000000';
        
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.buscarProduto}/${idInexistente}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.equal('Produto não encontrado');
        });
      });
  

      it('Deve falhar ao buscar produto com ID inválido', () => {
        const idInvalido = 'abc';
        
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.buscarProduto}/${idInvalido}`,
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
  

    describe('Editar produto', () => {
      let produtoTeste;
      let produtoId;
  
      beforeEach('Criar produto para teste', () => {
        cy.generateProduct().then(productData => {
          cy.createProduct(productData, authToken).then(response => {
            expect(response.status).to.eq(201);
            produtoId = response.body._id;
            produtoTeste = { ...productData, _id: produtoId };
          });
        });
      });
  

      it('Deve editar produto com sucesso', () => {
        const randomSuffix = Date.now() + Math.floor(Math.random() * 1000);
        const dadosAtualizados = {
          nome: `Produto Atualizado ${randomSuffix}`,
          preco: Math.floor(Math.random() * 1000) + 100,
          descricao: `Descrição atualizada do produto ${randomSuffix}`,
          quantidade: Math.floor(Math.random() * 50) + 1
        };
      
        cy.api({
          method: 'PUT',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.editarProduto}/${produtoId}`,
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
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.buscarProduto}/${produtoId}`,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.body.nome).to.equal(dadosAtualizados.nome);
          expect(response.body.preco).to.equal(dadosAtualizados.preco);
          expect(response.body.descricao).to.equal(dadosAtualizados.descricao);
          expect(response.body.quantidade).to.equal(dadosAtualizados.quantidade);
        });
      });
  

      it('Deve falhar ao editar produto com nome já existente', () => {
        // Criar outro produto
        cy.generateProduct({ nome: 'Produto Único' }).then(outroProductData => {
          cy.createProduct(outroProductData, authToken).then(() => {
            
            // Tentar editar o primeiro produto com o nome do segundo
            const dadosComNomeDuplicado = {
              nome: 'Produto Único',
              preco: 500,
              descricao: 'Descrição teste',
              quantidade: 10
            };
  
            cy.api({
              method: 'PUT',
              url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.editarProduto}/${produtoId}`,
              headers: {
                'Authorization': authToken
              },
              body: dadosComNomeDuplicado,
              failOnStatusCode: false
            }).then(response => {
              expect(response.status).to.eq(400);
              expect(response.body.message).to.equal('Já existe produto com esse nome');
            });
          });
        });
      });
  

      it('Deve falhar ao editar produto com dados inválidos', () => {
        const dadosInvalidos = {
          nome: '',
          preco: -100,
          descricao: '',
          quantidade: -10
        };
  
        cy.api({
          method: 'PUT',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.editarProduto}/${produtoId}`,
          headers: {
            'Authorization': authToken
          },
          body: dadosInvalidos,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.nome).to.equal('nome não pode ficar em branco');
          expect(response.body.preco).to.equal('preco deve ser um número positivo');
          expect(response.body.descricao).to.equal('descricao não pode ficar em branco');
          expect(response.body.quantidade).to.equal('quantidade deve ser maior ou igual a 0');
        });
      });
  
  
      it('Deve falhar ao editar produto sem autenticação', () => {
        const dadosAtualizados = {
          nome: 'Produto Teste',
          preco: 100,
          descricao: 'Descrição teste',
          quantidade: 5
        };
  
        cy.api({
          method: 'PUT',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.editarProduto}/${produtoId}`,
          body: dadosAtualizados,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
        });
      });
  

      it('Deve falhar ao editar produto com usuário não administrador', () => {
        // Criar usuário comum
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const userToken = window.localStorage.getItem('authToken');
          const dadosAtualizados = {
            nome: 'Produto Teste',
            preco: 100,
            descricao: 'Descrição teste',
            quantidade: 5
          };
  
          cy.api({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.editarProduto}/${produtoId}`,
            headers: {
              'Authorization': userToken
            },
            body: dadosAtualizados,
            failOnStatusCode: false
          }).then(response => {
            expect(response.status).to.eq(403);
            expect(response.body.message).to.equal('Rota exclusiva para administradores');
          });
        });
      });
  
    });
  

    describe('Excluir produto', () => {
      let produtoTeste;
      let produtoId;
  
      beforeEach('Criar produto para teste', () => {
        cy.generateProduct().then(productData => {
          cy.createProduct(productData, authToken).then(response => {
            expect(response.status).to.eq(201);
            produtoId = response.body._id;
            produtoTeste = { ...productData, _id: produtoId };
          });
        });
      });
  

      it('Deve excluir produto com sucesso', () => {
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.excluirProduto}/${produtoId}`,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.equal('Registro excluído com sucesso');
        });
  
        // Verificar se o produto foi realmente excluído
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.buscarProduto}/${produtoId}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.equal('Produto não encontrado');
        });
      });
  

      it('Deve falhar ao excluir produto inexistente', () => {
        const idInexistente = '0000000000000000';
        
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.excluirProduto}/${idInexistente}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.equal('Nenhum registro excluído');
        });
      });
  

      it('Deve falhar ao excluir produto com ID inválido', () => {
        const idInvalido = 'abc';
        
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.excluirProduto}/${idInvalido}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.id).to.equal('id deve ter exatamente 16 caracteres alfanuméricos');
        });
      });
  

      it('Deve falhar ao excluir produto sem autenticação', () => {
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.excluirProduto}/${produtoId}`,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
        });
      });
  

      it('Deve falhar ao excluir produto com usuário não administrador', () => {
        // Criar usuário comum
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const userToken = window.localStorage.getItem('authToken');
  
          cy.api({
            method: 'DELETE',
            url: `${Cypress.config('apiBaseUrl')}${routes.productsRoute.excluirProduto}/${produtoId}`,
            headers: {
              'Authorization': userToken
            },
            failOnStatusCode: false
          }).then(response => {
            expect(response.status).to.eq(403);
            expect(response.body.message).to.equal('Rota exclusiva para administradores');
          });
        });
      });
  
  
    });
  
    after('Limpeza', () => {
      // Limpar dados criados durante os testes se necessário
      cy.clearLocalStorage();
    });
  
  });