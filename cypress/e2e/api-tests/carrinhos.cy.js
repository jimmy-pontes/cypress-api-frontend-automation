describe('Fluxo de testes nas APIs de Carrinhos', () => {
    let adminToken;
    let adminUser;
  
    before('Criar usuário administrador para produtos', () => {
      cy.createAndLoginAdmin();
      
      cy.get('@user').then(admin => {
        adminUser = admin;
        adminToken = window.localStorage.getItem('authToken');
        cy.log('Admin criado e logado:', admin.email);
      });
    });
  
    describe('Listar carrinhos', () => {
      let authToken;
      let user;
      
      before('Criar usuário para listar carrinhos', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(regularUser => {
          user = regularUser;
          authToken = window.localStorage.getItem('authToken');
        });
      });
      
      it('Deve retornar lista de carrinhos com sucesso', () => {
        cy.api({
          method: 'GET',
          url: Cypress.config('apiBaseUrl') + routes.cartRoute.listarCarrinhos,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.all.keys('quantidade', 'carrinhos');
          
          expect(response.body.quantidade).to.be.a('number');
          expect(response.body.carrinhos).to.be.an('array');
          
          expect(response.body.carrinhos).to.have.length(response.body.quantidade);
          
          // Se tiver carrinho, validar estrutura
          if (response.body.quantidade > 0) {
            response.body.carrinhos.forEach(carrinho => {
              expect(carrinho).to.have.all.keys('produtos', 'precoTotal', 'quantidadeTotal', 'idUsuario', '_id');
              expect(carrinho._id).to.be.a('string').and.not.be.empty;
              expect(carrinho.produtos).to.be.an('array');
              expect(carrinho.precoTotal).to.be.a('number').and.be.greaterThan(0);
              expect(carrinho.quantidadeTotal).to.be.a('number').and.be.greaterThan(0);
              expect(carrinho.idUsuario).to.be.a('string').and.not.be.empty;
              
              // Validar estrutura dos produtos no carrinho
              carrinho.produtos.forEach(produto => {
                expect(produto).to.have.all.keys('idProduto', 'quantidade', 'precoUnitario');
                expect(produto.idProduto).to.be.a('string').and.not.be.empty;
                expect(produto.quantidade).to.be.a('number').and.be.greaterThan(0);
                expect(produto.precoUnitario).to.be.a('number').and.be.greaterThan(0);
              });
            });
          }
          
          cy.log(`Total de carrinhos encontrados: ${response.body.quantidade}`);
        });
      });
  
  
    });
  

    describe('Cadastrar carrinho', () => {
      let produtoId1, produtoId2;
  
      before('Criar produtos para usar nos carrinhos', () => {
        // Criar primeiro produto
        cy.createProductForCart(adminToken).then(response => {
          expect(response.status).to.eq(201);
          produtoId1 = response.body._id;
          
          // Criar segundo produto
          cy.createProductForCart(adminToken).then(response => {
            expect(response.status).to.eq(201);
            produtoId2 = response.body._id;
          });
        });
      });
      

      it('Deve cadastrar carrinho com um produto com sucesso', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const authToken = window.localStorage.getItem('authToken');
          
          const carrinhoData = {
            produtos: [
              {
                idProduto: produtoId1,
                quantidade: 2
              }
            ]
          };
  
          cy.createCart(carrinhoData, authToken).then(response => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.equal('Cadastro realizado com sucesso');
            expect(response.body._id).to.be.a('string').and.not.be.empty;
          });
        });
      });
  

      it('Deve cadastrar carrinho com múltiplos produtos', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const authToken = window.localStorage.getItem('authToken');
          
          const carrinhoData = {
            produtos: [
              {
                idProduto: produtoId1,
                quantidade: 1
              },
              {
                idProduto: produtoId2,
                quantidade: 3
              }
            ]
          };
  
          cy.createCart(carrinhoData, authToken).then(response => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.equal('Cadastro realizado com sucesso');
            expect(response.body._id).to.be.a('string').and.not.be.empty;
          });
        });
      });
  

      it('Deve falhar ao tentar criar segundo carrinho para o mesmo usuário', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const authToken = window.localStorage.getItem('authToken');
          
          const carrinhoData = {
            produtos: [
              {
                idProduto: produtoId1,
                quantidade: 1
              }
            ]
          };
  
          cy.createCart(carrinhoData, authToken).then(response => {
            expect(response.status).to.eq(201);
            
            const segundoCarrinhoData = {
              produtos: [
                {
                  idProduto: produtoId2,
                  quantidade: 1
                }
              ]
            };
  
            cy.createCart(segundoCarrinhoData, authToken).then(response => {
              expect(response.status).to.eq(400);
              expect(response.body.message).to.equal('Não é permitido ter mais de 1 carrinho');
            });
          });
        });
      });
  

      it('Deve falhar ao cadastrar carrinho com produto inexistente', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const authToken = window.localStorage.getItem('authToken');
          
          const carrinhoData = {
            produtos: [
              {
                idProduto: '0000000000000000',
                quantidade: 1
              }
            ]
          };
  
          cy.createCart(carrinhoData, authToken).then(response => {
            expect(response.status).to.eq(400);
            expect(response.body.message).to.equal('Produto não encontrado');
          });
        });
      });
  

      it('Deve falhar ao cadastrar carrinho com quantidade insuficiente no estoque', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const authToken = window.localStorage.getItem('authToken');
          
          const carrinhoData = {
            produtos: [
              {
                idProduto: produtoId1,
                quantidade: 999999 
              }
            ]
          };
  
          cy.createCart(carrinhoData, authToken).then(response => {
            expect(response.status).to.eq(400);
            expect(response.body.message).to.equal('Produto não possui quantidade suficiente');
          });
        });
      });
  

      it('Deve falhar ao cadastrar carrinho com dados inválidos', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const authToken = window.localStorage.getItem('authToken');
          
          const carrinhoInvalido = {
            produtos: [
              {
                idProduto: 'abc',
                quantidade: -1
              }
            ]
          };
  
          cy.createCart(carrinhoInvalido, authToken).then(response => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('produtos');
            expect(response.body).to.have.property('produtos[0].quantidade');
          });
        });
      });
  

      it('Deve falhar ao cadastrar carrinho sem produtos', () => {
        cy.createAndLoginUser();
        
        cy.get('@user').then(() => {
          const authToken = window.localStorage.getItem('authToken');
          
          const carrinhoVazio = {
            produtos: []
          };
  
          cy.createCart(carrinhoVazio, authToken).then(response => {
            expect(response.status).to.eq(400);
            expect(response.body.produtos).to.equal('produtos não contém 1 valor obrigatório');
          });
        });
      });
  

      it('Deve falhar ao cadastrar carrinho sem autenticação', () => {
        const carrinhoData = {
          produtos: [
            {
              idProduto: produtoId1,
              quantidade: 1
            }
          ]
        };
  
        cy.api({
          method: 'POST',
          url: Cypress.config('apiBaseUrl') + routes.cartRoute.cadastrarCarrinho,
          body: carrinhoData,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
        });
      });
  
    });
  

    describe('Buscar carrinho por ID', () => {
      let carrinhoId;
      let authToken;
      let produtoId;
  
      before('Criar carrinho para testes de busca', () => {
        // Criar produto
        cy.createProductForCart(adminToken).then(response => {
          produtoId = response.body._id;
          
          // Criar usuário e carrinho
          cy.createAndLoginUser();
          
          cy.get('@user').then(() => {
            authToken = window.localStorage.getItem('authToken');
            
            const carrinhoData = {
              produtos: [
                {
                  idProduto: produtoId,
                  quantidade: 2
                }
              ]
            };
  
            cy.createCart(carrinhoData, authToken).then(response => {
              expect(response.status).to.eq(201);
              carrinhoId = response.body._id;
            });
          });
        });
      });
  

      it('Deve buscar carrinho por ID com sucesso', () => {
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.buscarCarrinho}/${carrinhoId}`,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.all.keys('produtos', 'precoTotal', 'quantidadeTotal', 'idUsuario', '_id');
          expect(response.body._id).to.equal(carrinhoId);
          expect(response.body.produtos).to.be.an('array').and.have.length.greaterThan(0);
          expect(response.body.precoTotal).to.be.a('number').and.be.greaterThan(0);
          expect(response.body.quantidadeTotal).to.be.a('number').and.be.greaterThan(0);
        });
      });
  

      it('Deve falhar ao buscar carrinho com ID inexistente', () => {
        const idInexistente = '0000000000000000';
        
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.buscarCarrinho}/${idInexistente}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.equal('Carrinho não encontrado');
        });
      });
  

      it('Deve falhar ao buscar carrinho com ID inválido', () => {
        const idInvalido = 'abc';
        
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.buscarCarrinho}/${idInvalido}`,
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
  

    describe('Concluir compra (Excluir carrinho)', () => {
      let carrinhoId;
      let authToken;
  
      beforeEach('Criar carrinho para teste de conclusão', () => {

        cy.createProductForCart(adminToken).then(response => {
          const produtoId = response.body._id;
          
          cy.createAndLoginUser();
          
          cy.get('@user').then(() => {
            authToken = window.localStorage.getItem('authToken');
            
            const carrinhoData = {
              produtos: [
                {
                  idProduto: produtoId,
                  quantidade: 1
                }
              ]
            };
  
            cy.createCart(carrinhoData, authToken).then(response => {
              expect(response.status).to.eq(201);
              carrinhoId = response.body._id;
            });
          });
        });
      });
  

      it('Deve concluir compra com sucesso', () => {
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.excluirCarrinho}`,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.equal('Registro excluído com sucesso');
        });
  
        // Verificar se o carrinho foi realmente excluído
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.buscarCarrinho}/${carrinhoId}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.equal('Carrinho não encontrado');
        });
      });
  
  
      it('Deve falhar ao concluir compra sem autenticação', () => {
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.excluirCarrinho}`,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
        });
      });
  
    });
  

    describe('Cancelar compra (Cancelar carrinho)', () => {
      let carrinhoId;
      let authToken;
  
      beforeEach('Criar carrinho para teste de cancelamento', () => {
        // Criar produto
        cy.createProductForCart(adminToken).then(response => {
          const produtoId = response.body._id;
          
          // Criar usuário específico para cada teste
          cy.createAndLoginUser();
          
          cy.get('@user').then(() => {
            authToken = window.localStorage.getItem('authToken');
            
            const carrinhoData = {
              produtos: [
                {
                  idProduto: produtoId,
                  quantidade: 1
                }
              ]
            };
  
            cy.createCart(carrinhoData, authToken).then(response => {
              expect(response.status).to.eq(201);
              carrinhoId = response.body._id;
            });
          });
        });
      });
  

      it('Deve cancelar compra com sucesso', () => {
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.cancelarCarrinho}`,
          headers: {
            'Authorization': authToken
          }
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.equal('Registro excluído com sucesso. Estoque dos produtos reabastecido');
        });
  
        // Verificar se o carrinho foi realmente cancelado
        cy.api({
          method: 'GET',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.buscarCarrinho}/${carrinhoId}`,
          headers: {
            'Authorization': authToken
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.equal('Carrinho não encontrado');
        });
      });
  
  
      it('Deve falhar ao cancelar compra sem autenticação', () => {
        cy.api({
          method: 'DELETE',
          url: `${Cypress.config('apiBaseUrl')}${routes.cartRoute.cancelarCarrinho}`,
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.equal('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
        });
      });
  
    });
  
    after('Limpeza', () => {
      cy.clearLocalStorage();
    });
  
  });