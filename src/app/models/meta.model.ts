export enum StatusMeta {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA',
  PAUSADA = 'PAUSADA'
}

export interface Meta {
  id?: number;
  nome: string;
  descricao?: string;
  valorAlvo: number;
  valorAtual: number;
  dataInicio: string;
  dataAlvo: string;
  categoriaId?: number;
  status: StatusMeta;
  valorMensalSugerido?: number;
  icone?: string;
  cor?: string;
  notificarProgresso?: boolean;
  percentualConcluido?: number;
  valorRestante?: number;
  diasRestantes?: number;
}

export interface MetaAtualizarProgressoDTO {
  valor: number;
  descricao?: string;
}
