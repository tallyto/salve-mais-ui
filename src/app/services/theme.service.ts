import { Injectable } from '@angular/core';
import { TenantService } from './tenant.service';
import { Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  constructor(private tenantService: TenantService) {}

  /**
   * Carrega e aplica o tema do tenant atual
   */
  loadTenantTheme(): void {
    const tenantDomain = this.tenantService.getTenant();
    if (tenantDomain) {
      this.tenantService.getTenantByDomain(tenantDomain).subscribe({
        next: (tenant) => {
          this.applyTheme(tenant);
        },
        error: (error) => {
          console.error('Erro ao carregar tema do tenant:', error);
        }
      });
    }
  }

  /**
   * Aplica as configurações de tema do tenant
   */
  applyTheme(tenant: Tenant): void {
    const root = document.documentElement;

    console.log('Applying tenant theme:', tenant);

    // Aplicar cores personalizadas
    if (tenant.primaryColor) {
      console.log('Setting primary color:', tenant.primaryColor);
      root.style.setProperty('--primary-color', tenant.primaryColor);
      root.style.setProperty('--mat-primary', tenant.primaryColor);
      
      // Aplicar a cor primária aos componentes Material
      this.applyMaterialColor(tenant.primaryColor, 'primary');
    }
    
    if (tenant.secondaryColor) {
      console.log('Setting secondary color:', tenant.secondaryColor);
      root.style.setProperty('--secondary-color', tenant.secondaryColor);
      root.style.setProperty('--mat-secondary', tenant.secondaryColor);
      
      // Aplicar a cor secundária aos componentes Material
      this.applyMaterialColor(tenant.secondaryColor, 'secondary');
    }
    
    if (tenant.accentColor) {
      console.log('Setting accent color:', tenant.accentColor);
      root.style.setProperty('--accent-color', tenant.accentColor);
      root.style.setProperty('--mat-accent', tenant.accentColor);
      
      // Aplicar a cor de acento aos componentes Material
      this.applyMaterialColor(tenant.accentColor, 'accent');
    }

    // Atualizar título da página
    if (tenant.displayName) {
      document.title = tenant.displayName;
    }

    // Atualizar favicon
    if (tenant.faviconUrl) {
      this.updateFavicon(tenant.faviconUrl);
    }

    // Armazenar informações do tema em localStorage
    localStorage.setItem('tenant_theme', JSON.stringify({
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      accentColor: tenant.accentColor,
      displayName: tenant.displayName,
      logoUrl: tenant.logoUrl
    }));
  }

  /**
   * Aplica cores aos componentes Material Angular
   */
  private applyMaterialColor(color: string, type: 'primary' | 'secondary' | 'accent'): void {
    // Criar um estilo inline para sobrescrever as cores do Material
    let styleId = `mat-${type}-override`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Aplicar cor aos componentes Material
    const cssRules = `
      .mat-toolbar.mat-primary,
      .mat-raised-button.mat-primary,
      .mat-fab.mat-primary,
      .mat-mini-fab.mat-primary,
      .mat-flat-button.mat-primary {
        background-color: ${type === 'primary' ? color : ''} !important;
      }
      
      .mat-button.mat-primary,
      .mat-icon-button.mat-primary,
      .mat-stroked-button.mat-primary {
        color: ${type === 'primary' ? color : ''} !important;
      }
      
      .mat-form-field.mat-focused .mat-form-field-label,
      .mat-form-field.mat-focused .mat-form-field-ripple {
        color: ${type === 'primary' ? color : ''} !important;
      }
      
      .mat-checkbox-checked .mat-checkbox-background,
      .mat-radio-button.mat-accent.mat-radio-checked .mat-radio-outer-circle,
      .mat-radio-button.mat-accent.mat-radio-checked .mat-radio-inner-circle {
        background-color: ${type === 'primary' ? color : ''} !important;
      }
      
      .mat-progress-bar-fill::after,
      .mat-progress-spinner circle,
      .mat-spinner circle {
        stroke: ${type === 'primary' ? color : ''} !important;
      }
    `;

    styleElement.innerHTML = type === 'primary' ? cssRules : '';
  }

  /**
   * Atualiza o favicon da página
   */
  private updateFavicon(faviconUrl: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    link.type = 'image/x-icon';
    link.href = faviconUrl;
  }

  /**
   * Obtém a URL do logo do tenant
   */
  getLogoUrl(): string | null {
    const theme = localStorage.getItem('tenant_theme');
    if (theme) {
      const parsedTheme = JSON.parse(theme);
      return parsedTheme.logoUrl || null;
    }
    return null;
  }

  /**
   * Obtém o nome de exibição do tenant
   */
  getDisplayName(): string | null {
    const theme = localStorage.getItem('tenant_theme');
    if (theme) {
      const parsedTheme = JSON.parse(theme);
      return parsedTheme.displayName || null;
    }
    return null;
  }

  /**
   * Remove o tema aplicado
   */
  clearTheme(): void {
    const root = document.documentElement;
    root.style.removeProperty('--primary-color');
    root.style.removeProperty('--secondary-color');
    root.style.removeProperty('--accent-color');
    root.style.removeProperty('--mat-primary');
    root.style.removeProperty('--mat-secondary');
    root.style.removeProperty('--mat-accent');
    localStorage.removeItem('tenant_theme');
  }
}
