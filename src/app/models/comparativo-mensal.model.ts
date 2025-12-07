export interface ComparativoMensalDTO {
  mesAnterior: string;
  mesAtual: string;
  resumoComparativo: ResumoComparativoDTO;
  categorias: ComparativoCategoriaDTO[];
  maioresVariacoes: DestaqueMudancaDTO[];
}

export interface ResumoComparativoDTO {
  totalProventosAnterior: number;
  totalProventosAtual: number;
  variacaoProventos: number;
  percentualProventos: number;
  
  totalDespesasAnterior: number;
  totalDespesasAtual: number;
  variacaoDespesas: number;
  percentualDespesas: number;
  
  saldoAnterior: number;
  saldoAtual: number;
  variacaoSaldo: number;
  percentualSaldo: number;
  
  statusGeral: 'MELHOROU' | 'PIOROU' | 'ESTAVEL';
}

export interface ComparativoCategoriaDTO {
  categoria: string;
  tipo: 'DESPESA' | 'PROVENTO';
  valorAnterior: number;
  valorAtual: number;
  variacao: number;
  percentual: number;
  tendencia: 'AUMENTO' | 'REDUCAO' | 'ESTAVEL';
}

export interface DestaqueMudancaDTO {
  categoria: string;
  tipo: string;
  variacaoAbsoluta: number;
  percentual: number;
  impacto: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO';
}
