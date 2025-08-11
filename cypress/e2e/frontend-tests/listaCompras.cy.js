describe('Fluxo de Lista de Compras - Frontend', () => {

    describe('Adicionar Produto à Lista de Compras', () => {
  
      it('Deve adicionar produto à lista de compras com sucesso e manipular quantidade', () => {
        
        //Criar admin, produto e usuário
        cy.setupProdutoEUsuario();
        
        cy.get('@setupData').then(data => {
          const { usuario } = data;
            
            cy.fazerLoginCompleto(usuario);
            
            cy.url().should('include', '/home');
            cy.contains('Serverest Store').should('be.visible');
            cy.contains('Produtos').should('be.visible');
                        
            cy.adicionarProdutoLista();
            cy.url().should('include', '/minhaListaDeProdutos');
            cy.contains('Lista de Compras').should('be.visible');
            cy.contains('Total: 1').should('be.visible');
            
            //Verificar elementos da lista de compras
            cy.get(selectors.listaCompras.adicionarProdutoCarrinho).should('be.visible');
            cy.get(selectors.listaCompras.limparLista).should('be.visible');
            cy.get(selectors.listaCompras.paginaInicial).should('be.visible');
            
            //Verificar controles de quantidade
            cy.get(selectors.listaCompras.aumentarQtdProduto).click();
            cy.contains('Total: 2').should('be.visible');
            cy.get(selectors.listaCompras.diminuirQtdProduto).click();
            cy.contains('Total: 1').should('be.visible');

        });
      });
  
    
      it('Deve limpar a lista', () => {
        
        //Criar admin, produto e usuário
        cy.setupProdutoEUsuario();
        
        cy.get('@setupData').then(data => {
          const { usuario } = data;
            
            cy.fazerLoginCompleto(usuario);
            
            cy.url().should('include', '/home');
            cy.contains('Serverest Store').should('be.visible');
            cy.contains('Produtos').should('be.visible');
                        
            cy.adicionarProdutoLista();
            cy.url().should('include', '/minhaListaDeProdutos');
            cy.contains('Lista de Compras').should('be.visible');
            cy.contains('Total: 1').should('be.visible');
            
            //Verificar elementos da lista de compras
            cy.get(selectors.listaCompras.adicionarProdutoCarrinho).should('be.visible');
            cy.get(selectors.listaCompras.limparLista).should('be.visible');
            cy.get(selectors.listaCompras.paginaInicial).should('be.visible');
            
            cy.limparListaCompras()

            cy.url().should('include', '/minhaListaDeProdutos');
            cy.contains('Lista de Compras').should('be.visible');
            cy.get(selectors.listaCompras.paginaInicial).should('be.visible');
            cy.contains('Seu carrinho está vazio').should('be.visible');

        });
      });
  
    
  
    afterEach('Limpeza', () => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });
  
  });

});