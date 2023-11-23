import {Cartao} from "./cartao.model";
import {GastoCartao} from "./gasto-cartao.model";

export interface Fatura {
  id: number;
  dataVencimento: Date;
  dataPagamento: Date;
  valorTotal: number;
  pago: boolean;
  cartaoCredito: Cartao
  compras: GastoCartao[];
}
