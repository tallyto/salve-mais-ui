import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../../models/categoria.model";
import {CategoriaService} from "../../services/categoria.service";
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import {CartaoService} from "../../services/cartao.service";
import {Cartao} from "../../models/cartao.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {GastoCartao} from "../../models/gasto-cartao.model";

@Component({
    selector: 'app-despesas-recorrentes',
    templateUrl: './despesas-recorrentes.component.html',
    styleUrls: ['./despesas-recorrentes.component.css'],
    standalone: false
})
export class DespesasRecorrentesComponent implements OnInit {
  gastosRecorrentes: FormGroup;
  public categorias: Categoria[] = [];
  public cartoes: Cartao[] = [];
  public editingGasto: GastoCartao | null = null;

  constructor(
    private despesaRecorrenteService: GastoCartaoService,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private cartaoService: CartaoService,
    private snackBar: MatSnackBar
  ) {
    this.gastosRecorrentes = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      data: ['', Validators.required],
      categoriaId: ['', Validators.required],
      cartaoId: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarCartoes();

    // Subscribe to edit event
    this.despesaRecorrenteService.editingGasto.subscribe((gasto: GastoCartao) => {
      if (gasto) {
        this.editingGasto = gasto;
        this.gastosRecorrentes.patchValue({
          id: gasto.id,
          descricao: gasto.descricao,
          valor: gasto.valor,
          data: gasto.data,
          categoriaId: gasto.categoria?.id,
          cartaoId: gasto.cartaoCredito?.id
        });
      }
    });
  }

  carregarCartoes(): void {
    this.cartaoService.listarCartoes().subscribe(
      cartoes => this.cartoes = cartoes
    )
  }


  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  salvarGastoRecorrente() {
    if (this.gastosRecorrentes.invalid) {
      return;
    }

    const gasto = this.gastosRecorrentes.value;
    const isEditing = !!gasto.id;

    // Verificar limite do cartão antes de salvar (apenas para novos gastos)
    if (!isEditing && gasto.cartaoCredito?.id && gasto.valor > 0) {
      this.cartaoService.verificarCompra(gasto.cartaoCredito.id, gasto.valor).subscribe({
        next: (resultado) => {
          if (!resultado.podeRealizar) {
            this.snackBar.open(
              `Compra excede o limite disponível do cartão (Disponível: ${this.formatarMoeda(resultado.limiteDisponivel)})`,
              'Fechar',
              {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['warning-snackbar']
              }
            );
            return;
          }
          this.salvarCompraConfirmado(gasto, isEditing);
        },
        error: () => {
          // Se não conseguir verificar o limite, prossegue com a compra
          this.salvarCompraConfirmado(gasto, isEditing);
        }
      });
    } else {
      this.salvarCompraConfirmado(gasto, isEditing);
    }
  }

  private salvarCompraConfirmado(gasto: any, isEditing: boolean) {
    this.despesaRecorrenteService.salvarCompra(gasto).subscribe({
      next: () => {
        this.limparFormulario();
        this.editingGasto = null;
        this.despesaRecorrenteService.gastaoCartaoSaved.emit();

        const message = isEditing ? 'Gasto atualizado com sucesso!' : 'Gasto salvo com sucesso!';
        this.snackBar.open(message, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (error) => {
        console.error('Erro ao salvar gasto recorrente:', error);
        let errorMessage = 'Erro ao salvar gasto recorrente';

        // Verificar se é erro de limite excedido
        if (error.error?.message?.includes('limite')) {
          errorMessage = 'Compra excede o limite disponível do cartão';
        }

        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  limparFormulario() {
    this.gastosRecorrentes.reset({
      id: null,
      descricao: '',
      valor: '',
      data: '',
      categoriaId: '',
      cartaoId: '',
    });
    this.editingGasto = null;
  }

  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}
