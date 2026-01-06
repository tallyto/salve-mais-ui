import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TenantService } from '../../services/tenant.service';
import {
  Tenant,
  SubscriptionPlan,
  TenantBasicInfoDTO,
  TenantSubscriptionDTO,
  TenantSmtpConfigDTO,
  TenantRegionalSettingsDTO
} from '../../models/tenant.model';
import { getTenantIdFromToken } from '../../utils/jwt.util';

@Component({
  selector: 'app-tenant-config',
  templateUrl: './tenant-config.component.html',
  styleUrls: ['./tenant-config.component.css'],
  standalone: false
})
export class TenantConfigComponent implements OnInit {

  brandingForm!: FormGroup;
  subscriptionForm!: FormGroup;
  smtpForm!: FormGroup;
  regionalForm!: FormGroup;

  currentTenant: Tenant | null = null;
  isLoading = false;

  subscriptionPlans = Object.values(SubscriptionPlan);

  timezones = [
    { value: 'America/Sao_Paulo', label: 'São Paulo (UTC-3)' },
    { value: 'America/New_York', label: 'Nova York (UTC-5)' },
    { value: 'Europe/London', label: 'Londres (UTC+0)' },
    { value: 'Europe/Madrid', label: 'Madrid (UTC+1)' },
    { value: 'Asia/Tokyo', label: 'Tóquio (UTC+9)' }
  ];

  locales = [
    { value: 'pt_BR', label: 'Português (Brasil)' },
    { value: 'en_US', label: 'Inglês (EUA)' },
    { value: 'es_ES', label: 'Espanhol (Espanha)' }
  ];

  currencies = [
    { value: 'BRL', label: 'Real (BRL)' },
    { value: 'USD', label: 'Dólar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ];

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCurrentTenant();
  }

  private initializeForms(): void {
    // Formulário de Marca
    this.brandingForm = this.fb.group({
      displayName: [''],
      logoUrl: [''],
      faviconUrl: ['']
    });

    // Formulário de Assinatura
    this.subscriptionForm = this.fb.group({
      subscriptionPlan: [SubscriptionPlan.FREE, Validators.required],
      maxUsers: [null, [Validators.min(1)]],
      maxStorageGb: [null, [Validators.min(1)]],
      trialEndDate: [null],
      subscriptionStartDate: [null],
      subscriptionEndDate: [null]
    });

    // Formulário de SMTP
    this.smtpForm = this.fb.group({
      host: ['', Validators.required],
      port: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
      user: ['', Validators.required],
      password: ['', Validators.required],
      fromEmail: ['', [Validators.required, Validators.email]],
      fromName: ['']
    });

    // Formulário Regional
    this.regionalForm = this.fb.group({
      timezone: ['America/Sao_Paulo', Validators.required],
      locale: ['pt_BR', Validators.required],
      currencyCode: ['BRL', Validators.required],
      dateFormat: ['dd/MM/yyyy']
    });
  }

  private loadCurrentTenant(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showError('Token não encontrado');
      return;
    }

    const tenantId = getTenantIdFromToken(token);
    if (!tenantId) {
      this.showError('ID do tenant não encontrado');
      return;
    }

    this.isLoading = true;
    this.tenantService.getTenantById(tenantId).subscribe({
      next: (tenant) => {
        this.currentTenant = tenant;
        this.populateForms(tenant);
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao carregar configurações do tenant');
        this.isLoading = false;
      }
    });
  }

  private populateForms(tenant: Tenant): void {
    // Preencher formulário de marca
    this.brandingForm.patchValue({
      displayName: tenant.displayName || '',
      logoUrl: tenant.logoUrl || '',
      faviconUrl: tenant.faviconUrl || ''
    });

    // Preencher formulário de assinatura
    this.subscriptionForm.patchValue({
      subscriptionPlan: tenant.subscriptionPlan || SubscriptionPlan.FREE,
      maxUsers: tenant.maxUsers,
      maxStorageGb: tenant.maxStorageGb,
      trialEndDate: tenant.trialEndDate,
      subscriptionStartDate: tenant.subscriptionStartDate,
      subscriptionEndDate: tenant.subscriptionEndDate
    });

    // Preencher formulário regional
    this.regionalForm.patchValue({
      timezone: tenant.timezone || 'America/Sao_Paulo',
      locale: tenant.locale || 'pt_BR',
      currencyCode: tenant.currencyCode || 'BRL',
      dateFormat: tenant.dateFormat || 'dd/MM/yyyy'
    });
  }

  onSubmitSubscription(): void {
    if (!this.subscriptionForm.valid || !this.currentTenant?.id) {
      return;
    }

    this.isLoading = true;
    const subscriptionData: TenantSubscriptionDTO = this.subscriptionForm.value;

    this.tenantService.updateSubscription(this.currentTenant.id, subscriptionData).subscribe({
      next: (tenant) => {
        this.currentTenant = tenant;
        this.showSuccess('Configurações de assinatura atualizadas com sucesso!');
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao atualizar configurações de assinatura');
        this.isLoading = false;
      }
    });
  }

  onSubmitSmtp(): void {
    if (!this.smtpForm.valid || !this.currentTenant?.id) {
      return;
    }

    this.isLoading = true;
    const smtpData: TenantSmtpConfigDTO = this.smtpForm.value;

    this.tenantService.updateSmtpConfig(this.currentTenant.id, smtpData).subscribe({
      next: (tenant) => {
        this.currentTenant = tenant;
        this.showSuccess('Configurações de e-mail atualizadas com sucesso!');
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao atualizar configurações de e-mail');
        this.isLoading = false;
      }
    });
  }

  onSubmitBranding(): void {
    if (!this.brandingForm.valid || !this.currentTenant?.id) {
      return;
    }

    this.isLoading = true;
    const basicInfoData = this.brandingForm.value;

    this.tenantService.updateBasicInfo(this.currentTenant.id, basicInfoData).subscribe({
      next: (tenant) => {
        this.currentTenant = tenant;
        this.showSuccess('Informações básicas atualizadas com sucesso!');
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao atualizar informações básicas. Tente novamente.');
        this.isLoading = false;
      }
    });
  }

  onSubmitRegional(): void {
    if (!this.regionalForm.valid || !this.currentTenant?.id) {
      return;
    }

    this.isLoading = true;
    const regionalData: TenantRegionalSettingsDTO = this.regionalForm.value;

    this.tenantService.updateRegionalSettings(this.currentTenant.id, regionalData).subscribe({
      next: (tenant) => {
        this.currentTenant = tenant;
        this.showSuccess('Configurações regionais atualizadas com sucesso!');
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Erro ao atualizar configurações regionais');
        this.isLoading = false;
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
