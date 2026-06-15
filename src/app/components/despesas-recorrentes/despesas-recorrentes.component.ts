import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "../../models/categoria.model";
import {CategoriaService} from "../../services/categoria.service";
import {GastoCartaoService} from "../../services/gasto-cartao.service";
import {CartaoService} from "../../services/cartao.service";
import {Cartao} from "../../models/cartao.model";
import {MessageService} from "primeng/api";
import {GastoCartao} from "../../models/gasto-cartao.model";
import { filter } from 'rxjs';

@Component({
    selector: 'app-despesas-recorrentes',
    templateUrl: './despesas-recorrentes.component.html',
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
    private messageService: MessageService
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

    this.despesaRecorrenteService.editingGasto$.pipe(
      filter((gasto): gasto is GastoCartao => gasto !== null)
    ).subscribe((gasto: GastoCartao) => {
      this.editingGasto = gasto;
      this.gastosRecorrentes.patchValue({
        id: gasto.id,
        descricao: gasto.descricao,
        valor: gasto.valor,
        data: gasto.data ? new Date(gasto.data) : null,
        categoriaId: gasto.categoria?.id,
        cartaoId: gasto.cartaoCredito?.id
      });
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
    if (!isEditing && gasto.cartaoId && gasto.valor > 0) {
      this.cartaoService.verificarCompra(gasto.cartaoId, gasto.valor).subscribe({
        next: (resultado) => {
          if (!resultado.podeRealizar) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Limite insuficiente',
              detail: `Compra excede o limite disponível do cartão (Disponível: ${this.formatarMoeda(resultado.limiteDisponivel)})`,
              life: 5000
            });
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
    if (gasto.data instanceof Date) {
      const d = gasto.data;
      gasto.data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    this.despesaRecorrenteService.salvarCompra(gasto).subscribe({
      next: () => {
        this.limparFormulario();
        this.editingGasto = null;
        this.despesaRecorrenteService.gastosChanged$.next(undefined);

        const message = isEditing ? 'Gasto atualizado com sucesso!' : 'Gasto salvo com sucesso!';
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
      },
      error: (error) => {
        let errorMessage = 'Erro ao salvar gasto recorrente';

        // Verificar se é erro de limite excedido
        if (error.error?.message?.includes('limite')) {
          errorMessage = 'Compra excede o limite disponível do cartão';
        }

        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
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
