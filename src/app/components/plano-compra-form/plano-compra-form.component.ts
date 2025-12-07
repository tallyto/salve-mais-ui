import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanoCompra, StatusPlano, TipoCompra } from '../../models/plano-compra.model';
import { PlanoCompraService } from '../../services/plano-compra.service';

@Component({
  selector: 'app-plano-compra-form',
  templateUrl: './plano-compra-form.component.html',
  styleUrls: ['./plano-compra-form.component.css'],
  standalone: false
})
export class PlanoCompraFormComponent implements OnInit {
  planoForm: FormGroup;
  statusOptions = Object.values(StatusPlano);
  tipoOptions = Object.values(TipoCompra);
  prioridadeOptions = [
    { value: 1, label: 'Alta' },
    { value: 2, label: 'Média' },
    { value: 3, label: 'Baixa' }
  ];

  constructor(
    private fb: FormBuilder,
    private planoCompraService: PlanoCompraService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PlanoCompraFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlanoCompra
  ) {
    this.planoForm = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', Validators.maxLength(500)],
      valorTotal: [0, [Validators.required, Validators.min(0.01)]],
      valorEconomizado: [0, [Validators.min(0)]],
      tipoCompra: [TipoCompra.A_VISTA, Validators.required],
      numeroParcelas: [null],
      taxaJuros: [0, [Validators.min(0)]],
      valorEntrada: [0, [Validators.min(0)]],
      dataPrevista: [''],
      categoria: [''],
      prioridade: [2, Validators.required],
      status: [StatusPlano.PLANEJADO, Validators.required],
      ativo: [true]
    });

    // Observar mudanças no tipo de pagamento
    this.planoForm.get('tipoCompra')?.valueChanges.subscribe(tipo => {
      this.ajustarCamposParaTipo(tipo);
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.planoForm.patchValue({
        ...this.data,
        dataPrevista: this.data.dataPrevista ? this.data.dataPrevista.split('T')[0] : null
      });
    }
  }

  ajustarCamposParaTipo(tipo: TipoCompra): void {
    const numeroParcelas = this.planoForm.get('numeroParcelas');
    const taxaJuros = this.planoForm.get('taxaJuros');

    if (tipo === TipoCompra.A_VISTA) {
      numeroParcelas?.clearValidators();
      numeroParcelas?.setValue(null);
      taxaJuros?.setValue(0);
    } else if (tipo === TipoCompra.PARCELADO_SEM_JUROS) {
      numeroParcelas?.setValidators([Validators.required, Validators.min(2)]);
      taxaJuros?.setValue(0);
    } else {
      numeroParcelas?.setValidators([Validators.required, Validators.min(2)]);
      taxaJuros?.setValidators([Validators.required, Validators.min(0.01)]);
    }

    numeroParcelas?.updateValueAndValidity();
    taxaJuros?.updateValueAndValidity();
  }

  get mostrarParcelas(): boolean {
    const tipo = this.planoForm.get('tipoCompra')?.value;
    return tipo !== TipoCompra.A_VISTA;
  }

  get mostrarJuros(): boolean {
    const tipo = this.planoForm.get('tipoCompra')?.value;
    return tipo === TipoCompra.PARCELADO_COM_JUROS || tipo === TipoCompra.FINANCIAMENTO;
  }

  calcularValorParcela(): number {
    const valorTotal = this.planoForm.get('valorTotal')?.value || 0;
    const valorEntrada = this.planoForm.get('valorEntrada')?.value || 0;
    const numeroParcelas = this.planoForm.get('numeroParcelas')?.value || 1;
    const taxaJuros = this.planoForm.get('taxaJuros')?.value || 0;

    const valorFinanciar = valorTotal - valorEntrada;

    if (taxaJuros > 0) {
      // Fórmula Price
      const taxa = taxaJuros / 100;
      return valorFinanciar * (taxa * Math.pow(1 + taxa, numeroParcelas)) / (Math.pow(1 + taxa, numeroParcelas) - 1);
    }

    return valorFinanciar / numeroParcelas;
  }

  salvar(): void {
    if (this.planoForm.valid) {
      const plano: PlanoCompra = this.planoForm.value;
      const request = plano.id 
        ? this.planoCompraService.atualizar(plano.id, plano)
        : this.planoCompraService.criar(plano);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            plano.id ? 'Plano atualizado com sucesso' : 'Plano criado com sucesso',
            'Fechar',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erro ao salvar plano:', error);
          this.snackBar.open('Erro ao salvar plano', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
