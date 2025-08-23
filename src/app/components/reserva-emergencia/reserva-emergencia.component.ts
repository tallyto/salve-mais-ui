import { Component, OnInit } from '@angular/core';
import { ReservaEmergenciaService } from '../../services/reserva-emergencia.service';
import { ReservaEmergencia, ReservaEmergenciaDetalhe } from '../../models/reserva-emergencia.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-emergencia',
  templateUrl: './reserva-emergencia.component.html',
  styleUrls: ['./reserva-emergencia.component.css'],standalone: false
})
export class ReservaEmergenciaComponent implements OnInit {
  reservas: ReservaEmergencia[] = [];
  reservaAtual: ReservaEmergenciaDetalhe | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private reservaService: ReservaEmergenciaService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarReservas();
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
        this.error = 'Erro ao carregar reservas de emergência.';
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
      },
      error: (err) => {
        this.error = 'Erro ao carregar detalhes da reserva.';
        this.loading = false;
        this.snackBar.open(this.error, 'Fechar', { duration: 5000 });
      }
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
          this.snackBar.open('Reserva excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarReservas();
        },
        error: (err) => {
          this.error = 'Erro ao excluir reserva.';
          this.snackBar.open(this.error, 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  atualizarSaldo(valor: number): void {
    if (!this.reservaAtual) return;

    this.reservaService.atualizarSaldo(this.reservaAtual.id!, valor).subscribe({
      next: (reservaAtualizada) => {
        this.snackBar.open('Saldo atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarDetalhesReserva(this.reservaAtual!.id!);
      },
      error: (err) => {
        this.error = 'Erro ao atualizar saldo.';
        this.snackBar.open(this.error, 'Fechar', { duration: 5000 });
      }
    });
  }

  getCorProgresso(): string {
    if (!this.reservaAtual) return 'primary';

    const percentual = this.reservaAtual.percentualConcluido;

    if (percentual < 25) {
      return 'warn'; // Vermelho
    } else if (percentual < 75) {
      return 'accent'; // Amarelo/Laranja
    } else {
      return 'primary'; // Verde/Azul
    }
  }
}
