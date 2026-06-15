// financa.model.ts
import {Categoria} from "./categoria.model";
import { Conta, TipoConta } from './conta.model';

export interface Financa {
  id: number;
  nome: string;
  categoria: Categoria;
  conta: Conta;
  categoriaId?: number;
  contaId?: number;
  vencimento: string;
  valor: number;
  pago: boolean;
}
