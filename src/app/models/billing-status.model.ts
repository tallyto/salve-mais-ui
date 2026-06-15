export type SubscriptionStatus = 'TRIAL' | 'ATIVO' | 'INADIMPLENTE' | 'CANCELADO';

export interface BillingStatus {
  subscriptionStatus: SubscriptionStatus;
  nomePlano: string;
  precoMensal: number | null;
  subscriptionEndDate: string | null;
  trialEndDate: string | null;
  diasRestantesTrial: number | null;
  cancelarEm: string | null;
  usuariosAtivos: number;
  maxUsuarios: number | null;
  transacoesMes: number;
  maxTransacoesMes: number | null;
  maxStorageGb: number | null;
}
