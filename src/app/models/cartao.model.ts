export interface Cartao {
  id: number;
  nome: string;
  vencimento: string;
  limiteTotal?: number;
  limiteAlertaPercentual?: number;
  ativo?: boolean;
}

export interface CartaoLimiteDTO {
  cartaoId: number;
  limiteTotal: number;
  limiteAlertaPercentual: number;
}

export interface CartaoLimiteStatusDTO {
  cartaoId: number;
  nomeCartao: string;
  limiteTotal: number;
  valorUtilizado: number;
  limiteDisponivel: number;
  percentualUtilizado: number;
  limiteExcedido: boolean;
  alertaAtivado: boolean;
  limiteAlertaPercentual: number;
}
