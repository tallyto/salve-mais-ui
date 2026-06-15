import {Categoria} from "./categoria.model";
import {Cartao} from "./cartao.model";

export interface GastoCartao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: Categoria;
  cartaoCredito: Cartao
}
