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

export interface FaturaManualDTO {
  cartaoCreditoId: number;
  valorTotal: number;
  dataVencimento: string; // yyyy-MM-dd
}

export interface FaturaResponseDTO {
  id: number;
  cartaoCreditoId: number;
  nomeCartao: string;
  valorTotal: number;
  dataVencimento: string;
  dataPagamento: string | null;
  pago: boolean;
  contaPagamentoId: number | null;
  nomeContaPagamento: string | null;
  totalCompras: number;
}

export interface CartaoCredito {
  id: number;
  nome: string;
  limite: number;
  vencimento: string;
}
