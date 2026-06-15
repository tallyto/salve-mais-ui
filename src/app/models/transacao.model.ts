import { TipoTransacao } from "./tipo-transacao.enum";

export interface Transacao {
  id: number;
  tipo: TipoTransacao;
  valor: number;
  data: Date;
  descricao: string;
  conta?: ContaResumo;
  contaDestino?: ContaResumo;
  fatura?: FaturaResumo;
  categoria?: CategoriaResumo;
  provento?: ProventoResumo;
  contaFixa?: ContaFixaResumo;
  transacaoOriginalId?: number;
  observacoes?: string;
}

export interface ContaResumo {
  id: number;
  titular: string;
}

export interface FaturaResumo {
  id: number;
  cartao: string;
  dataVencimento: Date;
  valorTotal: number;
}

export interface CategoriaResumo {
  id: number;
  nome: string;
}

export interface ProventoResumo {
  id: number;
  descricao: string;
  valor: number;
}

export interface ContaFixaResumo {
  id: number;
  nome: string;
  valor: number;
}

export interface TransacaoFiltro {
  contaId?: number;
  tipo?: TipoTransacao;
  dataInicio?: Date;
  dataFim?: Date;
  categoriaId?: number;
  transacaoOriginalId?: number;
  faturaId?: number;
  contaFixaId?: number;
  proventoId?: number;
}