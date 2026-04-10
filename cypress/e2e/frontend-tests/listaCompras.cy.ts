import { SetupData } from '../../support/types';

describe('Fluxo de Lista de Compras - Frontend', () => {

  describe('Adicionar Produto à Lista de Compras', () => {

    beforeEach('Setup: criar admin, produto e usuário, fazer login e adicionar produto à lista', () => {
      cy.setupProdutoEUsuario();

      cy.get<SetupData>('@setupData').then(data => {
        cy.fazerLoginCompleto(data.usuario);

        cy.url().should('include', '/home');
        cy.contains('Serverest Store').should('be.visible');
        cy.contains('Produtos').should('be.visible');

        cy.adicionarProdutoLista();
        cy.url().should('include', '/minhaListaDeProdutos');
        cy.contains('Lista de Compras').should('be.visible');
        cy.contains('Total: 1').should('be.visible');

        cy.get(selectors.listaCompras.adicionarProdutoCarrinho).should('be.visible');
        cy.get(selectors.listaCompras.limparLista).should('be.visible');
        cy.get(selectors.listaCompras.paginaInicial).should('be.visible');
      });
    });

    it('Deve manipular quantidade do produto na lista', () => {
      cy.get(selectors.listaCompras.aumentarQtdProduto).click();
      cy.contains('Total: 2').should('be.visible');
      cy.get(selectors.listaCompras.diminuirQtdProduto).click();
      cy.contains('Total: 1').should('be.visible');
    });

    it('Deve limpar a lista', () => {
      cy.limparListaCompras();

      cy.url().should('include', '/minhaListaDeProdutos');
      cy.contains('Lista de Compras').should('be.visible');
      cy.get(selectors.listaCompras.paginaInicial).should('be.visible');
      cy.contains('Seu carrinho está vazio').should('be.visible');
    });

    afterEach('Limpeza', () => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

  });

});
