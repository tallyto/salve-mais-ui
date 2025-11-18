export interface Usuario {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
  ultimoAcesso?: string;
  tenantId?: string;
}
