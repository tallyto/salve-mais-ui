import { formatarMoeda } from '@shared/utils';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Categoria} from "@models/categoria.model";
import {CategoriaService} from "@services/categoria.service";
import {GastoCartaoService} from "@services/gasto-cartao.service";
import {CartaoService} from "@services/cartao.service";
import {Cartao} from "@models/cartao.model";
import {MessageService} from "primeng/api";
import {GastoCartao} from "@models/gasto-cartao.model";
import {GastoCartaoInput} from "@models/input/gasto-cartao.input";
import { filter } from 'rxjs';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';
import { ListDespesasRecorrentesComponent } from '@components/despesas/list-despesas-recorrentes/list-despesas-recorrentes.component';

@Component({
    selector: 'app-despesas-recorrentes',
    templateUrl: './despesas-recorrentes.component.html',
    standalone: true,
    imports: [...SALVE_COMMON, ...SALVE_FORMS, ...SALVE_DATA, ...SALVE_OVERLAY, ListDespesasRecorrentesComponent]
})
export class DespesasRecorrentesComponent implements OnInit {
  gastosRecorrentes: FormGroup;
  public categorias: Categoria[] = [];
  public cartoes: Cartao[] = [];
  public editingGasto: GastoCartao | null = null;
  formatarMoeda = formatarMoeda;

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

  private salvarCompraConfirmado(gasto: GastoCartaoInput, isEditing: boolean) {
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

}
