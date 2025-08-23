export interface ReservaEmergencia {
  id?: number;
  objetivo: number;
  multiplicadorDespesas: number;
  saldoAtual: number;
  percentualConcluido: number;
  dataCriacao: string;
  dataPrevisaoCompletar: string;
  valorContribuicaoMensal: number;
  contaId: number;
}

export interface ReservaEmergenciaDetalhe extends ReservaEmergencia {
  conta: {
    id: number;
    titular: string;
    saldo: number;
  };
  mesesRestantes: number;
  despesasMensaisMedia: number;
}

export interface ReservaEmergenciaInput {
  objetivo: number;
  multiplicadorDespesas: number;
  valorContribuicaoMensal: number;
  contaId: number;
}
