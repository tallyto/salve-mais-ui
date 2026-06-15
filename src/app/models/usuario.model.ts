export interface Usuario {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
  ultimoAcesso?: string;
  tenantId?: string;
}

export interface UsuarioCriacaoAdminDTO {
  nome: string;
  email: string;
  senha?: string;
}
