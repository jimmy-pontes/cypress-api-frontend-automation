export const telaLogin = {
    inputEmail: '[data-testid="email"]',
    inputSenha: '[data-testid="senha"]', 
    botaoLogin: '[data-testid="entrar"]',
    linkCadastro: '[data-testid="cadastrar"]'
  };
  
  export const telaCadastro = {
    inputNome: '[data-testid="nome"]',
    inputEmail: '[data-testid="email"]', 
    inputPassword: '[data-testid="password"]',
    checkboxAdministrador: '[data-testid="checkbox"]',
    botaoCadastrar: '[data-testid="cadastrar"]',
    botaoEntrar: '[data-testid="entrar"]'
  };

  export const headerAdmin = {
    cadastrarUsuario: '[data-testid="cadastrar-usuarios"]',
    listarUsuarios: '[data-testid="listar-usuarios"]', 
    cadastrarProdutos: '[data-testid="cadastrar-produtos"]',
    listarProdutos: '[data-testid="listar-produtos"]',
    relatorios: '[data-testid="link-relatorios"]',
    logoutButton: '[data-testid="logout"]'
  };

  export const homeAdmin = {
    cadastrarUsuario: '[data-testid="cadastrarUsuarios"]',
    listarUsuarios: '[data-testid="listarUsuarios"]', 
    cadastrarProdutos: '[data-testid="cadastrarProdutos"]',
    listarProdutos: '[data-testid="listarProdutos"]',
    relatorios: '[data-testid="relatorios"]'
  };

  export const telaCadastrarUsuarios = {
    nome: '[data-testid="nome"]',
    email: '[data-testid="email"]', 
    senha: '[data-testid="password"]',
    checkboxAdministrador: '[data-testid="checkbox"]'
  };
  
///// user

  export const homeUser = {
    listaCompras: '[data-testid="lista-de-compras"]',
    carrinhoButton: '[data-testid="carrinho"]', 
    botaoPesquisar: '[data-testid="botaoPesquisar"]',
    adicionarProdutoLista: '[data-testid="adicionarNaLista"]',
    logoutButton: '[data-testid="logout"]'
  };

  export const listaCompras = {
    adicionarProdutoCarrinho: '[data-testid="adicionar carrinho"]',
    limparLista: '[data-testid="limparLista"]', 
    paginaInicial: '[data-testid="paginaInicial"]',
    diminuirQtdProduto: '[data-testid="product-decrease-quantity"]',
    aumentarQtdProduto: '[data-testid="product-increase-quantity"]',
    logoutButton: '[data-testid="logout"]'
  };
  