import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { CartaoService } from '@services/cartao.service';
import { Cartao, CartaoLimiteDTO, CartaoLimiteStatusDTO } from '@models/cartao.model';

@Component({
  selector: 'app-cartao-limites',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './cartao-limites.component.html',
  styleUrl: './cartao-limites.component.css'
})
export class CartaoLimitesComponent implements OnInit {
  limiteForm: FormGroup;
  cartoes: Cartao[] = [];
  statusLimites: CartaoLimiteStatusDTO[] = [];
  alertas: CartaoLimiteStatusDTO[] = [];
  loading = false;
  displayedColumns: string[] = ['nomeCartao', 'limiteTotal', 'valorUtilizado', 'limiteDisponivel', 'percentualUtilizado', 'status', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private cartaoService: CartaoService,
    private snackBar: MatSnackBar
  ) {
    this.limiteForm = this.fb.group({
      cartaoId: ['', Validators.required],
      limiteTotal: ['', [Validators.required, Validators.min(0.01)]],
      limiteAlertaPercentual: [80, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit() {
    this.carregarCartoes();
    this.carregarStatusLimites();
    this.carregarAlertas();
  }

  carregarCartoes() {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar cartões', 'Fechar', { duration: 3000 });
      }
    });
  }

  carregarStatusLimites() {
    this.cartaoService.listarStatusLimiteTodos().subscribe({
      next: (status) => {
        this.statusLimites = status;
      },
      error: (error) => {
      }
    });
  }

  carregarAlertas() {
    this.cartaoService.verificarAlertas().subscribe({
      next: (alertas) => {
        this.alertas = alertas;
      },
      error: (error) => {
      }
    });
  }

  onSubmit() {
    if (this.limiteForm.valid) {
      this.loading = true;
      const formValue = this.limiteForm.value;

      const limiteDTO: CartaoLimiteDTO = {
        cartaoId: formValue.cartaoId,
        limiteTotal: formValue.limiteTotal,
        limiteAlertaPercentual: formValue.limiteAlertaPercentual
      };

      this.cartaoService.configurarLimite(formValue.cartaoId, limiteDTO).subscribe({
        next: (cartao) => {
          this.snackBar.open('Limite configurado com sucesso!', 'Fechar', { duration: 3000 });
          this.limiteForm.reset();
          this.limiteForm.patchValue({ limiteAlertaPercentual: 80 });
          this.carregarStatusLimites();
          this.carregarAlertas();
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Erro ao configurar limite', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  getStatusClass(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'status-excedido';
    if (status.alertaAtivado) return 'status-alerta';
    return 'status-normal';
  }

  getStatusText(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'Limite Excedido';
    if (status.alertaAtivado) return 'Em Alerta';
    return 'Normal';
  }

  getStatusIcon(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'error';
    if (status.alertaAtivado) return 'warning';
    return 'check_circle';
  }

  getProgressBarColor(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'warn';
    if (status.alertaAtivado) return 'accent';
    return 'primary';
  }

  removerLimite(cartaoId: number) {
    // Implementar remoção de limite se necessário
    this.snackBar.open('Funcionalidade de remoção será implementada', 'Fechar', { duration: 3000 });
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarPercentual(valor: number): string {
    return valor.toFixed(1) + '%';
  }
}
