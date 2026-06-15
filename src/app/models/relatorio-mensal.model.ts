export interface RelatorioMensalDTO {
  mesReferencia: string;
  dataReferencia: Date;
  resumoFinanceiro: ResumoFinanceiroDTO;
  proventos: ItemProventoDTO[];
  receitasPendentes: ItemReceitasPendentesDTO[];
  cartoes: ItemCartaoDTO[];
  gastosFixos: ItemGastoFixoDTO[];
  comprasDebito: ItemCompraDebitoDTO[];
  outrasDespesas: ItemOutrasDescricaoDTO[];
  saldoFinal: number;
  totalDividas: number;
}

export interface ResumoFinanceiroDTO {
  totalProventos: number;
  totalReceitasPendentes: number;
  totalCartoes: number;
  totalGastosFixos: number;
  totalComprasDebito: number;
  totalOutrasDespesas: number;
  saldoFinal: number;
  totalDividas: number;
}

export interface ItemProventoDTO {
  id: number;
  descricao: string;
  valor: number;
  data: Date;
  contaTitular: string;
}

export interface ItemReceitasPendentesDTO {
  id: number;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  categoria: string;
  recebido: boolean;
}

export interface ItemCartaoDTO {
  cartaoId: number;
  nomeCartao: string;
  valorTotal: number;
  dataVencimento: Date;
  compras: CompraCartaoDTO[];
}

export interface CompraCartaoDTO {
  id: number;
  descricao: string;
  valor: number;
  data: Date;
  categoria: string;
}

export interface ItemGastoFixoDTO {
  id: number;
  nome: string;
  valor: number;
  vencimento: Date;
  categoria: string;
  pago: boolean;
}

export interface ItemCompraDebitoDTO {
  id: number;
  descricao: string;
  valor: number;
  dataCompra: Date;
  categoria: string;
  conta: string;
}

export interface ItemOutrasDescricaoDTO {
  id: number;
  descricao: string;
  valor: number;
  data: Date;
  categoria: string;
  tipo: string; // "COMPRA", "DESPESA", "OUTROS"
}
