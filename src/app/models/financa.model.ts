// financa.model.ts
import {Categoria} from "./categoria.model";
import {Account} from "./account.model";

export interface Financa {
  id: number;
  nome: string;
  categoria: Categoria;
  conta: Account;
  categoriaId?: number;
  contaId?: number;
  vencimento: string;
  valor: number;
  pago: boolean;
}
