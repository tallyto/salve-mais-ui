// financa.model.ts
import {Categoria} from "./categoria.model";

export interface Financa {
  id: number;
  nome: string;
  categoria: Categoria;
  vencimento: string;
  valor: number;
  pago: boolean;
}
