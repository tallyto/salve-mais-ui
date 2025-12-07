import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanoAposentadoria } from '../../models/plano-aposentadoria.model';
import { PlanoAposentadoriaService } from '../../services/plano-aposentadoria.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-plano-aposentadoria',
  templateUrl: './plano-aposentadoria.component.html',
  styleUrls: ['./plano-aposentadoria.component.css'],
  standalone: false
})
export class PlanoAposentadoriaComponent implements OnInit {
  planoForm: FormGroup;
  plano: PlanoAposentadoria | null = null;
  loading = false;
  isEditing = false;
  Math = Math; // Para usar Math.abs no template

  constructor(
    private fb: FormBuilder,
    private planoAposentadoriaService: PlanoAposentadoriaService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {
    this.planoForm = this.fb.group({
      idadeAtual: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      idadeAposentadoria: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      patrimonioAtual: ['', [Validators.required, Validators.min(0)]],
      contribuicaoMensal: ['', [Validators.required, Validators.min(0)]],
      taxaRetornoAnual: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      rendaDesejada: ['', [Validators.required, Validators.min(0)]],
      expectativaVida: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      inflacaoEstimada: [3.5, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.carregarPlano();
  }

  carregarPlano(): void {
    this.loading = true;
    this.planoAposentadoriaService.buscar().subscribe({
      next: (plano) => {
        this.plano = plano;
        this.isEditing = true;
        this.preencherFormulario(plano);
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          // Plano não existe ainda
          this.isEditing = false;
        } else {
          this.errorHandler.handleError(error);
        }
        this.loading = false;
      }
    });
  }

  preencherFormulario(plano: PlanoAposentadoria): void {
    this.planoForm.patchValue({
      idadeAtual: plano.idadeAtual,
      idadeAposentadoria: plano.idadeAposentadoria,
      patrimonioAtual: plano.patrimonioAtual,
      contribuicaoMensal: plano.contribuicaoMensal,
      taxaRetornoAnual: plano.taxaRetornoAnual,
      rendaDesejada: plano.rendaDesejada,
      expectativaVida: plano.expectativaVida,
      inflacaoEstimada: plano.inflacaoEstimada
    });
  }

  salvar(): void {
    if (this.planoForm.invalid) {
      this.planoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const planoData: PlanoAposentadoria = this.planoForm.value;

    const operacao = this.isEditing
      ? this.planoAposentadoriaService.atualizar(planoData)
      : this.planoAposentadoriaService.criar(planoData);

    operacao.subscribe({
      next: (plano) => {
        this.plano = plano;
        this.isEditing = true;
        this.snackBar.open(
          `Plano de aposentadoria ${this.isEditing ? 'atualizado' : 'criado'} com sucesso!`,
          'Fechar',
          { duration: 3000 }
        );
        this.loading = false;
      },
      error: (error) => {
        this.errorHandler.handleError(error);
        this.loading = false;
      }
    });
  }

  calcularAnosRestantes(): number {
    const idadeAtual = this.planoForm.get('idadeAtual')?.value || 0;
    const idadeAposentadoria = this.planoForm.get('idadeAposentadoria')?.value || 0;
    return Math.max(0, idadeAposentadoria - idadeAtual);
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarPercentual(valor: number): string {
    return valor.toFixed(2) + '%';
  }
}
