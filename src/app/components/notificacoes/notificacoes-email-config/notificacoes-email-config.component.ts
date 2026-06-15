import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificacaoEmailService, NotificacaoEmailConfig } from 'src/app/services/notificacao-email.service';
import { TenantService } from 'src/app/services/tenant.service';
import { MessageService } from 'primeng/api';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from 'src/app/shared/primeng-shared';
import { InfoBlockComponent } from '@components/shared';

@Component({
    selector: 'app-notificacoes-email-config',
    templateUrl: './notificacoes-email-config.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ...SALVE_COMMON, ...SALVE_FORMS, ...SALVE_DATA, ...SALVE_OVERLAY, InfoBlockComponent]
})
export class NotificacoesEmailConfigComponent implements OnInit {
  configForm!: FormGroup;
  loading = false;
  saving = false;
  sendingTest = false;
  configExistente: NotificacaoEmailConfig | null = null;
  tenantDomain: string = '';

  horariosDisponiveis = [
    { value: '06:00:00', label: '06:00 - Manhã cedo' },
    { value: '07:00:00', label: '07:00 - Início da manhã' },
    { value: '08:00:00', label: '08:00 - Manhã (Recomendado)' },
    { value: '09:00:00', label: '09:00 - Meio da manhã' },
    { value: '12:00:00', label: '12:00 - Meio-dia' },
    { value: '14:00:00', label: '14:00 - Início da tarde' },
    { value: '18:00:00', label: '18:00 - Fim da tarde' },
    { value: '20:00:00', label: '20:00 - Noite' },
    { value: '22:00:00', label: '22:00 - Fim da noite' }
  ];

  constructor(
    private fb: FormBuilder,
    private notificacaoEmailService: NotificacaoEmailService,
    private tenantService: TenantService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarTenantDomain();
    this.carregarConfiguracao();
  }

  initForm(): void {
    this.configForm = this.fb.group({
      ativo: [false],
      horario: ['08:00:00', Validators.required]
    });
  }

  carregarTenantDomain(): void {
    const domain = this.tenantService.obter();
    if (domain) {
      this.tenantDomain = domain;
    } else {
      this.showError('Erro ao obter informações do tenant');
    }
  }

  carregarConfiguracao(): void {
    this.loading = true;
    this.notificacaoEmailService.obterConfiguracao().subscribe({
      next: (config: any) => {
        if (config) {
          this.configExistente = config;
          this.configForm.patchValue({
            ativo: config.ativo,
            horario: config.horario
          });
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        // Se não há configuração, não é um erro crítico
        if (error.status !== 404) {
          this.showError('Erro ao carregar configuração');
        }
      }
    });
  }

  salvar(): void {
    if (this.configForm.invalid) {
      this.showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.saving = true;
    const formData = this.configForm.value;

    const config = {
      domain: this.tenantDomain,
      horario: formData.horario,
      ativo: formData.ativo
    };

    this.notificacaoEmailService.salvarConfiguracao(config).subscribe({
      next: (response: any) => {
        this.configExistente = response;
        this.saving = false;
        this.showSuccess('Configuração salva com sucesso!');
      },
      error: (error: any) => {
        this.saving = false;
        this.showError('Erro ao salvar configuração');
      }
    });
  }

  desabilitar(): void {
    if (!this.configExistente) {
      this.showError('Não há configuração para desabilitar');
      return;
    }

    this.saving = true;
    this.notificacaoEmailService.desabilitarNotificacao().subscribe({
      next: () => {
        this.configForm.patchValue({ ativo: false });
        if (this.configExistente) {
          this.configExistente.ativo = false;
        }
        this.saving = false;
        this.showSuccess('Notificações por email desabilitadas');
      },
      error: (error: any) => {
        this.saving = false;
        this.showError('Erro ao desabilitar notificações');
      }
    });
  }

  get ativoControl() {
    return this.configForm.get('ativo');
  }

  get horarioControl() {
    return this.configForm.get('horario');
  }

  getStatusText(): string {
    if (!this.configExistente) {
      return 'Não Configurado';
    }
    return this.configExistente.ativo ? 'Ativo' : 'Inativo';
  }

  getStatusColor(): string {
    if (!this.configExistente) {
      return 'secondary';
    }
    return this.configExistente.ativo ? 'success' : 'danger';
  }

  enviarNotificacaoTeste(): void {
    this.sendingTest = true;
    this.notificacaoEmailService.enviarNotificacaoTeste().subscribe({
      next: () => {
        this.sendingTest = false;
        this.showSuccess('Email de teste enviado com sucesso! Verifique sua caixa de entrada.');
      },
      error: (error: any) => {
        this.sendingTest = false;
        const mensagem = error.status === 404 
          ? 'Configure as notificações antes de enviar um teste' 
          : 'Erro ao enviar email de teste. Verifique suas configurações.';
        this.showError(mensagem);
      }
    });
  }

  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
