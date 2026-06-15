import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaEmergenciaService } from '../../services/reserva-emergencia.service';
import { HistoricoContribuicao, ReservaEmergencia, ReservaEmergenciaDetalhe } from '../../models/reserva-emergencia.model';
import { ContaService } from '../../services/conta.service';
import { Conta, TipoConta } from '../../models/conta.model';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SALVE_COMMON, SALVE_DATA, SALVE_OVERLAY } from '../../shared/primeng-shared';

@Component({
  selector: 'app-reserva-emergencia',
  templateUrl: './reserva-emergencia.component.html',
  standalone: true,
  imports: [CommonModule, ...SALVE_COMMON, ...SALVE_DATA, ...SALVE_OVERLAY]
})
export class ReservaEmergenciaComponent implements OnInit {
  reservas: ReservaEmergencia[] = [];
  reservaAtual: ReservaEmergenciaDetalhe | null = null;
  historico: HistoricoContribuicao[] = [];
  contas: Conta[] = [];
  contaOrigemId: number | null = null;
  valorDeposito: number | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private reservaService: ReservaEmergenciaService,
    private contaService: ContaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  get contasParaDeposito(): Conta[] {
    return this.contas.filter(c => c.tipo !== TipoConta.RESERVA_EMERGENCIA);
  }

  ngOnInit(): void {
    this.carregarReservas();
    this.contaService.getContas().subscribe({
      next: (contas) => { this.contas = contas; }
    });
  }

  carregarReservas(): void {
    this.loading = true;
    this.reservaService.getReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.loading = false;

        if (reservas.length > 0) {
          this.carregarDetalhesReserva(reservas[0].id!);
        }
      },
      error: (err) => {
        this.error = this.errMsg(err, 'Erro ao carregar reservas de emergência.');
        this.loading = false;
        this.showError(this.error);
      }
    });
  }

  carregarDetalhesReserva(id: number): void {
    this.loading = true;
    this.reservaService.getReservaById(id).subscribe({
      next: (reserva) => {
        this.reservaAtual = reserva;
        this.loading = false;
        this.carregarHistorico(id);
      },
      error: (err) => {
        this.error = this.errMsg(err, 'Erro ao carregar detalhes da reserva.');
        this.loading = false;
        this.showError(this.error);
      }
    });
  }

  carregarHistorico(id: number): void {
    this.reservaService.getHistorico(id).subscribe({
      next: (h) => { this.historico = h; },
      error: () => { this.historico = []; }
    });
  }

  criarReserva(): void {
    this.router.navigate(['/reserva-emergencia/criar']);
  }

  editarReserva(id: number): void {
    this.router.navigate(['/reserva-emergencia/editar', id]);
  }

  excluirReserva(id: number): void {
    this.confirmationService.confirm({
      header: 'Excluir reserva',
      message: 'Tem certeza que deseja excluir esta reserva de emergência?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.reservaService.deleteReserva(id).subscribe({
          next: () => {
            this.reservaAtual = null;
            this.reservas = [];
            this.historico = [];
            this.showSuccess('Reserva excluída com sucesso!');
            this.carregarReservas();
          },
          error: (err) => {
            this.error = this.errMsg(err, 'Erro ao excluir reserva.');
            this.showError(this.error);
          }
        });
      }
    });
  }

  depositar(): void {
    const valor = this.valorDeposito ?? 0;
    if (!this.reservaAtual || !this.contaOrigemId || valor <= 0) {
      this.showError('Informe um valor e selecione a conta de origem.');
      return;
    }

    this.reservaService.contribuirParaReserva(this.reservaAtual.id!, this.contaOrigemId, valor).subscribe({
      next: () => {
        this.showSuccess('Depósito realizado com sucesso!');
        this.valorDeposito = null;
        this.contaOrigemId = null;
        this.carregarDetalhesReserva(this.reservaAtual!.id!); // recarrega detalhes + histórico
      },
      error: (err) => {
        this.showError(this.errMsg(err, 'Erro ao realizar depósito.'));
      }
    });
  }

  private errMsg(err: any, fallback: string): string {
    return err?.error?.message ?? fallback;
  }

  getPercentualConcluido(): number {
    if (!this.reservaAtual) return 0;
    return Math.min(Math.max(this.reservaAtual.percentualConcluido, 0), 100);
  }

  getValorRestante(): number {
    if (!this.reservaAtual) return 0;
    return Math.max(this.reservaAtual.objetivo - this.reservaAtual.saldoAtual, 0);
  }

  getStatusReserva(): string {
    if (!this.reservaAtual) return 'Sem reserva';

    const percentual = this.reservaAtual.percentualConcluido;

    if (percentual >= 100) return 'Reserva completa';
    if (percentual >= 75) return 'Reta final';
    if (percentual >= 40) return 'Em construção';
    return 'Começando agora';
  }

  getStatusDescricao(): string {
    if (!this.reservaAtual) return '';

    const percentual = this.reservaAtual.percentualConcluido;

    if (percentual >= 100) return 'Sua meta já está coberta. Continue acompanhando a liquidez e o excedente.';
    if (percentual >= 75) return 'Você já protegeu a maior parte do objetivo. Mantenha a cadência dos aportes.';
    if (percentual >= 40) return 'A reserva está tomando forma. O foco agora é consistência mensal.';
    return 'Priorize aportes recorrentes até ganhar uma margem confortável.';
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  private showSuccess(message: string): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
