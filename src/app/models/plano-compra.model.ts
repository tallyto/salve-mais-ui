export enum TipoCompra {
  A_VISTA = 'A_VISTA',
  PARCELADO_SEM_JUROS = 'PARCELADO_SEM_JUROS',
  PARCELADO_COM_JUROS = 'PARCELADO_COM_JUROS',
  FINANCIAMENTO = 'FINANCIAMENTO'
}

export enum StatusPlano {
  PLANEJADO = 'PLANEJADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

export interface PlanoCompra {
  id?: number;
  nome: string;
  descricao?: string;
  valorTotal: number;
  valorEconomizado: number;
  tipoCompra: TipoCompra;
  numeroParcelas?: number;
  taxaJuros?: number;
  valorParcela?: number;
  valorEntrada?: number;
  dataPrevista?: string;
  categoria?: string;
  prioridade: number; // 1=Alta, 2=Média, 3=Baixa
  status: StatusPlano;
  ativo: boolean;
  percentualEconomizado?: number;
  valorRestante?: number;
  valorFinal?: number;
  jurosTotal?: number;
}
