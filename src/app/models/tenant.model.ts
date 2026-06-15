export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface Tenant {
  id?: string;
  nome: string;
  dominio: string;
  email: string;
  telefone?: string;
  endereco?: string;
  ativo?: boolean;
  dataCriacao?: string;

  // Customização de Marca
  displayName?: string;
  logoUrl?: string;
  faviconUrl?: string;

  // Configurações de Plano
  subscriptionPlan?: SubscriptionPlan;
  maxUsers?: number;
  maxStorageGb?: number;
  trialEndDate?: Date;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  enabledFeatures?: { [key: string]: boolean };

  // Configurações Regionais
  timezone?: string;
  locale?: string;
  currencyCode?: string;
  dateFormat?: string;
}

export interface TenantCadastroDTO {
  name: string;
  domain: string;
  email: string;
}

export interface TenantBasicInfoDTO {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  displayName?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface TenantSubscriptionDTO {
  subscriptionPlan: SubscriptionPlan;
  maxUsers?: number;
  maxStorageGb?: number;
  trialEndDate?: Date;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  enabledFeatures?: { [key: string]: boolean };
}

export interface TenantSmtpConfigDTO {
  host: string;
  port: number;
  user: string;
  password: string;
  fromEmail: string;
  fromName?: string;
}

export interface TenantRegionalSettingsDTO {
  timezone: string;
  locale: string;
  currencyCode: string;
  dateFormat?: string;
}
