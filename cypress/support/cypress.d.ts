import { UserData, ProductData, CartData, SetupData } from './types';
import * as selectorsModule from '../mappings/selectors/selectors';
import * as routesModule from '../mappings/routes/routes';

declare global {
  // eslint-disable-next-line no-var
  var selectors: typeof selectorsModule;
  // eslint-disable-next-line no-var
  var routes: typeof routesModule;

  namespace Cypress {
    interface Chainable {
      // Backend
      login(email: string, password: string): Chainable<Cypress.Response<any>>;
      generateUser(overrides?: Partial<UserData>): Chainable<UserData>;
      createUser(userData: UserData | Record<string, string>): Chainable<Cypress.Response<any>>;
      createAndLoginUser(isAdmin?: boolean): Chainable<void>;
      createAndLoginAdmin(): Chainable<void>;
      generateProduct(overrides?: Partial<ProductData>): Chainable<ProductData>;
      createProduct(productData: ProductData | Record<string, any>, authToken: string): Chainable<Cypress.Response<any>>;
      generateCart(overrides?: Partial<CartData>): Chainable<CartData>;
      createCart(cartData: CartData | Record<string, any>, authToken: string): Chainable<Cypress.Response<any>>;
      createProductForCart(authToken: string): Chainable<Cypress.Response<any>>;

      // Frontend
      visitLoginPage(): Chainable<void>;
      visitCadastro(): Chainable<void>;
      preencherCadastro(userData: UserData, isAdmin?: boolean): Chainable<void>;
      cadastrarViaUI(userData: UserData, isAdmin?: boolean): Chainable<void>;
      adicionarProdutoLista(): Chainable<void>;
      fazerLoginCompleto(userData: UserData): Chainable<void>;
      setupProdutoEUsuario(): Chainable<void>;
      visitListaCompras(): Chainable<void>;
      verificarProdutoNaLista(nomeProduto: string): Chainable<void>;
      limparListaCompras(): Chainable<void>;
      logoutUser(): Chainable<void>;
      validarAreaAdmin(nomeUsuario: string): Chainable<void>;
      validarAreaUsuario(): Chainable<void>;
      validarTelaLogin(): Chainable<void>;
      validarErroLogin(): Chainable<void>;
      fazerLogout(): Chainable<void>;
      tentarLogin(email: string, senha: string): Chainable<void>;
      fazerLoginCompletoComValidacao(userData: UserData, tipoUsuario?: 'admin' | 'user'): Chainable<void>;

      // cypress-plugin-api
      api(options: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;
    }

    interface TestConfigOverrides {
      frontendBaseUrl?: string;
      apiBaseUrl?: string;
    }

    interface ResolvedConfigOptions {
      frontendBaseUrl: string;
      apiBaseUrl: string;
    }
  }
}

export {};
