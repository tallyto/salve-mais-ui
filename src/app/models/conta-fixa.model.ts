import {Categoria} from "./categoria.model";

export interface ContaFixa {
  id: number;
  nome: string;
  categoria: Categoria;
  vencimento: string;
  valor: number;
  pago: boolean;
}
