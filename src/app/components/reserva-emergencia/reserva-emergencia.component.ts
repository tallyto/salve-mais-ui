import { Component, OnInit } from '@angular/core';
import { ReservaEmergenciaService } from '../../services/reserva-emergencia.service';
import { HistoricoContribuicao, ReservaEmergencia, ReservaEmergenciaDetalhe } from '../../models/reserva-emergencia.model';
import { ContaService } from '../../services/conta.service';
import { Conta, TipoConta } from '../../models/conta.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-emergencia',
  templateUrl: './reserva-emergencia.component.html',
  styleUrls: ['./reserva-emergencia.component.css'],
  standalone: false
})
export class ReservaEmergenciaComponent implements OnInit {
  reservas: ReservaEmergencia[] = [];
  reservaAtual: ReservaEmergenciaDetalhe | null = null;
  historico: HistoricoContribuicao[] = [];
  contas: Conta[] = [];
  contaOrigemId: number | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private reservaService: ReservaEmergenciaService,
    private contaService: ContaService,
    private snackBar: MatSnackBar,
    private router: Router
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
        this.snackBar.open(this.error, 'Fechar', { duration: 5000 });
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
        this.snackBar.open(this.error, 'Fechar', { duration: 5000 });
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
    if (confirm('Tem certeza que deseja excluir esta reserva de emergência?')) {
      this.reservaService.deleteReserva(id).subscribe({
        next: () => {
          this.reservaAtual = null;
          this.reservas = [];
          this.historico = [];
          this.snackBar.open('Reserva excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarReservas();
        },
        error: (err) => {
          this.error = this.errMsg(err, 'Erro ao excluir reserva.');
          this.snackBar.open(this.error, 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  depositar(valor: number): void {
    if (!this.reservaAtual || !this.contaOrigemId || valor <= 0) {
      this.snackBar.open('Informe um valor e selecione a conta de origem.', 'Fechar', { duration: 3000 });
      return;
    }

    this.reservaService.contribuirParaReserva(this.reservaAtual.id!, this.contaOrigemId, valor).subscribe({
      next: () => {
        this.snackBar.open('Depósito realizado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarDetalhesReserva(this.reservaAtual!.id!); // recarrega detalhes + histórico
      },
      error: (err) => {
        this.snackBar.open(this.errMsg(err, 'Erro ao realizar depósito.'), 'Fechar', { duration: 5000 });
      }
    });
  }

  parseCurrency(value: string): number {
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
  }

  setValorDeposito(input: HTMLInputElement, valor: number): void {
    const formatted = valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    input.value = formatted;
    input.dispatchEvent(new Event('input'));
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

  getStatusClass(): string {
    if (!this.reservaAtual) return 'status-neutral';

    const percentual = this.reservaAtual.percentualConcluido;

    if (percentual >= 100) return 'status-complete';
    if (percentual >= 75) return 'status-strong';
    if (percentual >= 40) return 'status-progress';
    return 'status-attention';
  }
}
