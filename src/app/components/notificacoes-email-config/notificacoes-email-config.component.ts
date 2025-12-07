import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificacaoEmailService, NotificacaoEmailConfig } from 'src/app/services/notificacao-email.service';
import { TenantService } from 'src/app/services/tenant.service';

@Component({
    selector: 'app-notificacoes-email-config',
    templateUrl: './notificacoes-email-config.component.html',
    styleUrls: ['./notificacoes-email-config.component.css'],
    standalone: false
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
    private snackBar: MatSnackBar
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
    const domain = this.tenantService.getTenant();
    if (domain) {
      this.tenantDomain = domain;
    } else {
      console.error('Domínio do tenant não encontrado');
      this.snackBar.open('Erro ao obter informações do tenant', 'Fechar', { duration: 3000 });
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
        console.error('Erro ao carregar configuração:', error);
        this.loading = false;
        // Se não há configuração, não é um erro crítico
        if (error.status !== 404) {
          this.snackBar.open('Erro ao carregar configuração', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  salvar(): void {
    if (this.configForm.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
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
        this.snackBar.open('Configuração salva com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (error: any) => {
        console.error('Erro ao salvar configuração:', error);
        this.saving = false;
        this.snackBar.open('Erro ao salvar configuração', 'Fechar', { duration: 3000 });
      }
    });
  }

  desabilitar(): void {
    if (!this.configExistente) {
      this.snackBar.open('Não há configuração para desabilitar', 'Fechar', { duration: 3000 });
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
        this.snackBar.open('Notificações por email desabilitadas', 'Fechar', { duration: 3000 });
      },
      error: (error: any) => {
        console.error('Erro ao desabilitar:', error);
        this.saving = false;
        this.snackBar.open('Erro ao desabilitar notificações', 'Fechar', { duration: 3000 });
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
      return 'status-gray';
    }
    return this.configExistente.ativo ? 'status-green' : 'status-red';
  }

  enviarNotificacaoTeste(): void {
    this.sendingTest = true;
    this.notificacaoEmailService.enviarNotificacaoTeste().subscribe({
      next: () => {
        this.sendingTest = false;
        this.snackBar.open('Email de teste enviado com sucesso! Verifique sua caixa de entrada.', 'Fechar', { 
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error: any) => {
        console.error('Erro ao enviar notificação de teste:', error);
        this.sendingTest = false;
        const mensagem = error.status === 404 
          ? 'Configure as notificações antes de enviar um teste' 
          : 'Erro ao enviar email de teste. Verifique suas configurações.';
        this.snackBar.open(mensagem, 'Fechar', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
