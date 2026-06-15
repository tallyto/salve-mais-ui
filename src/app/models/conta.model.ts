export enum TipoConta {
  CORRENTE = 'CORRENTE',
  POUPANCA = 'POUPANCA',
  INVESTIMENTO = 'INVESTIMENTO',
  RESERVA_EMERGENCIA = 'RESERVA_EMERGENCIA'
}

export interface Conta {
  id: number;
  titular: string;
  saldo: number;
  tipo?: TipoConta;
  taxaRendimento?: number;
  descricao?: string;
}
