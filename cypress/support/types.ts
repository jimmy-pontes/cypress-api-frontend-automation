export interface UserData {
  nome: string;
  email: string;
  password: string;
  administrador: string;
}

export interface ProductData {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

export interface CartProduct {
  idProduto: string;
  quantidade: number;
}

export interface CartData {
  produtos: CartProduct[];
}

export interface SetupData {
  produto: { id: string; [key: string]: unknown };
  usuario: UserData;
  adminToken: string;
}
