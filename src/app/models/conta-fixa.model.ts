import {Categoria} from "./categoria.model";

export interface ContaFixa {
  id: number;
  nome: string;
  categoria: Categoria;
  vencimento: string;
  valor: number;
  pago: boolean;
}

export interface ContaFixaRecorrente {
  nome: string;
  categoriaId: number;
  contaId: number;
  dataInicio: string;
  valor: number;
  numeroParcelas: number;
  tipoRecorrencia: TipoRecorrencia;
  observacoes?: string;
}

export enum TipoRecorrencia {
  MENSAL = 'MENSAL',
  BIMENSAL = 'BIMENSAL', 
  TRIMESTRAL = 'TRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL'
}

export interface TipoRecorrenciaInfo {
  valor: TipoRecorrencia;
  descricao: string;
  meses: number;
}
