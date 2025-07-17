import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaturaService } from '../../services/fatura.service';
import { CartaoService } from '../../services/cartao.service';
import { FaturaManualDTO, FaturaResponseDTO } from '../../models/fatura.model';
import { Cartao } from '../../models/cartao.model';

@Component({
  selector: 'app-fatura-form',
  templateUrl: './fatura-form.component.html',
  styleUrls: ['./fatura-form.component.css']
})
export class FaturaFormComponent implements OnInit {
  faturaForm: FormGroup;
  cartoes: Cartao[] = [];
  faturas: FaturaResponseDTO[] = [];
  loading = false;
  mostrarFormulario = false;

  displayedColumns: string[] = ['nomeCartao', 'valorTotal', 'dataVencimento', 'pago', 'totalCompras', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private faturaService: FaturaService,
    private cartaoService: CartaoService,
    private snackBar: MatSnackBar
  ) {
    this.faturaForm = this.fb.group({
      cartaoCreditoId: ['', Validators.required],
      valorTotal: ['', [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarCartoes();
    this.carregarFaturas();
  }

  carregarCartoes(): void {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
      },
      error: (error) => {
        console.error('Erro ao carregar cartões:', error);
        this.snackBar.open('Erro ao carregar cartões', 'Fechar', { duration: 3000 });
      }
    });
  }

  carregarFaturas(): void {
    this.loading = true;
    this.faturaService.listarFaturasNovas().subscribe({
      next: (faturas) => {
        this.faturas = faturas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar faturas:', error);
        this.snackBar.open('Erro ao carregar faturas', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.faturaForm.valid) {
      this.loading = true;

      const dataVencimento = this.faturaForm.value.dataVencimento;
      const dataFormatada = dataVencimento instanceof Date
        ? dataVencimento.toISOString().split('T')[0]
        : dataVencimento;

      const faturaData: FaturaManualDTO = {
        cartaoCreditoId: this.faturaForm.value.cartaoCreditoId,
        valorTotal: this.faturaForm.value.valorTotal,
        dataVencimento: dataFormatada
      };

      this.faturaService.criarFaturaManual(faturaData).subscribe({
        next: (fatura) => {
          this.snackBar.open('Fatura criada com sucesso!', 'Fechar', { duration: 3000 });
          this.faturaForm.reset();
          this.mostrarFormulario = false;
          this.carregarFaturas();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao criar fatura:', error);
          this.snackBar.open('Erro ao criar fatura', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  marcarComoPaga(id: number): void {
    this.faturaService.marcarComoPaga(id).subscribe({
      next: () => {
        this.snackBar.open('Fatura marcada como paga!', 'Fechar', { duration: 3000 });
        this.carregarFaturas();
      },
      error: (error) => {
        console.error('Erro ao marcar fatura como paga:', error);
        this.snackBar.open('Erro ao marcar fatura como paga', 'Fechar', { duration: 3000 });
      }
    });
  }

  excluirFatura(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta fatura?')) {
      this.faturaService.excluirFatura(id).subscribe({
        next: () => {
          this.snackBar.open('Fatura excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarFaturas();
        },
        error: (error) => {
          console.error('Erro ao excluir fatura:', error);
          this.snackBar.open('Erro ao excluir fatura', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  gerarFaturaAutomatica(cartaoId: number): void {
    this.faturaService.gerarFaturaAutomatica(cartaoId).subscribe({
      next: () => {
        this.snackBar.open('Fatura automática gerada com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarFaturas();
      },
      error: (error) => {
        console.error('Erro ao gerar fatura automática:', error);
        this.snackBar.open('Erro ao gerar fatura automática', 'Fechar', { duration: 3000 });
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.faturaForm.reset();
    }
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
