import { Categoria } from './categoria.model';
import { Cartao } from './cartao.model';

export interface CompraParcelada {
  id: number;
  descricao: string;
  valorTotal: number;
  dataCompra: string;
  parcelaInicial: number;
  totalParcelas: number;
  categoriaId: number;
  categoriaNome?: string;
  cartaoId: number;
  cartaoNome?: string;
  parcelasRestantes?: number;
  valorParcela?: number;
  parcelas?: Parcela[];
}

export interface CompraParceladaRequest {
  descricao: string;
  valorTotal: number;
  dataCompra: string;
  parcelaInicial: number;
  totalParcelas: number;
  categoriaId: number;
  cartaoId: number;
}

export interface Parcela {
  id: number;
  numeroParcela: number;
  totalParcelas: number;
  valor: number;
  dataVencimento: string;
  paga: boolean;
  compraParceladaId: number;
  descricaoCompra: string;
}

export interface ParcelasPaginadas {
  content: Parcela[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ComprasParceladasPaginadas {
  content: CompraParcelada[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
