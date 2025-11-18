import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TenantService } from '../../services/tenant.service';
import { 
  Tenant, 
  SubscriptionPlan, 
  TenantBrandingDTO,
  TenantRegionalSettingsDTO 
} from '../../models/tenant.model';

@Component({
  selector: 'app-tenant-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './tenant-settings.component.html',
  styleUrl: './tenant-settings.component.css'
})
export class TenantSettingsComponent implements OnInit {
  brandingForm!: FormGroup;
  regionalForm!: FormGroup;
  tenant?: Tenant;
  loading = false;

  subscriptionPlans = Object.values(SubscriptionPlan);
  
  timezones = [
    'America/Sao_Paulo',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ];

  locales = [
    { value: 'pt_BR', label: 'Português (Brasil)' },
    { value: 'en_US', label: 'English (US)' },
    { value: 'es_ES', label: 'Español' },
    { value: 'fr_FR', label: 'Français' }
  ];

  currencies = [
    { value: 'BRL', label: 'Real (BRL)' },
    { value: 'USD', label: 'Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'Pound (GBP)' }
  ];

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private snackBar: MatSnackBar
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadTenantData();
  }

  initForms(): void {
    this.brandingForm = this.fb.group({
      displayName: [''],
      logoUrl: [''],
      faviconUrl: [''],
      primaryColor: ['', [Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      secondaryColor: ['', [Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      accentColor: ['', [Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });

    this.regionalForm = this.fb.group({
      timezone: ['America/Sao_Paulo', Validators.required],
      locale: ['pt_BR', Validators.required],
      currencyCode: ['BRL', Validators.required],
      dateFormat: ['dd/MM/yyyy']
    });
  }

  loadTenantData(): void {
    const tenantDomain = this.tenantService.getTenant();
    if (tenantDomain) {
      this.tenantService.getTenantByDomain(tenantDomain).subscribe({
        next: (tenant) => {
          this.tenant = tenant;
          this.populateForms(tenant);
        },
        error: (error) => {
          console.error('Erro ao carregar dados do tenant:', error);
          this.snackBar.open('Erro ao carregar configurações do tenant', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  populateForms(tenant: Tenant): void {
    this.brandingForm.patchValue({
      displayName: tenant.displayName,
      logoUrl: tenant.logoUrl,
      faviconUrl: tenant.faviconUrl,
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      accentColor: tenant.accentColor
    });

    this.regionalForm.patchValue({
      timezone: tenant.timezone || 'America/Sao_Paulo',
      locale: tenant.locale || 'pt_BR',
      currencyCode: tenant.currencyCode || 'BRL',
      dateFormat: tenant.dateFormat || 'dd/MM/yyyy'
    });
  }

  saveBranding(): void {
    if (this.brandingForm.valid && this.tenant?.id) {
      this.loading = true;
      const branding: TenantBrandingDTO = this.brandingForm.value;
      
      this.tenantService.updateBranding(this.tenant.id, branding).subscribe({
        next: (updatedTenant) => {
          this.tenant = updatedTenant;
          this.loading = false;
          this.snackBar.open('Configurações de marca atualizadas com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.applyBranding(updatedTenant);
        },
        error: (error) => {
          console.error('Erro ao atualizar marca:', error);
          this.loading = false;
          this.snackBar.open('Erro ao atualizar configurações de marca', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  saveRegionalSettings(): void {
    if (this.regionalForm.valid && this.tenant?.id) {
      this.loading = true;
      const settings: TenantRegionalSettingsDTO = this.regionalForm.value;
      
      this.tenantService.updateRegionalSettings(this.tenant.id, settings).subscribe({
        next: (updatedTenant) => {
          this.tenant = updatedTenant;
          this.loading = false;
          this.snackBar.open('Configurações regionais atualizadas com sucesso!', 'Fechar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erro ao atualizar configurações regionais:', error);
          this.loading = false;
          this.snackBar.open('Erro ao atualizar configurações regionais', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  applyBranding(tenant: Tenant): void {
    // Aplicar cores personalizadas ao tema
    const root = document.documentElement;
    if (tenant.primaryColor) {
      root.style.setProperty('--primary-color', tenant.primaryColor);
    }
    if (tenant.secondaryColor) {
      root.style.setProperty('--secondary-color', tenant.secondaryColor);
    }
    if (tenant.accentColor) {
      root.style.setProperty('--accent-color', tenant.accentColor);
    }
    
    // Atualizar favicon se houver
    if (tenant.faviconUrl) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = tenant.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }
}
