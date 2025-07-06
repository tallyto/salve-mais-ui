export interface Tenant {
  id?: number;
  nome: string;
  dominio: string;
  email: string;
  ativo?: boolean;
  dataCriacao?: string;
}

export interface TenantCadastroDTO {
  nome: string;
  dominio: string;
  email: string;
}
