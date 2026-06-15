import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { CompraParceladaService } from '@services/compra-parcelada.service';
import { CategoriaService } from '@services/categoria.service';
import { CartaoService } from '@services/cartao.service';
import { FormBaseService } from '@services/form-base.service';
import { Categoria } from '@models/categoria.model';
import { Cartao } from '@models/cartao.model';
import { CompraParceladaRequest } from '@models/compra-parcelada.model';
import { CategoriaFormComponent } from '@components/categoria/categoria-form/categoria-form.component';
import { CartaoFormComponent } from '@components/cartao/cartao-form/cartao-form.component';
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';

@Component({
  selector: 'app-compra-parcelada-form',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS,
    ...SALVE_DATA,
    ...SALVE_OVERLAY,
    CategoriaFormComponent,
    CartaoFormComponent
  ],
  templateUrl: './compra-parcelada-form.component.html'
})
export class CompraParceladaFormComponent implements OnInit {
  form!: FormGroup;
  categorias: Categoria[] = [];
  cartoes: Cartao[] = [];
  parcelasRestantes: number = 0;
  valorParcela: number = 0;
  datasVencimento: Date[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  isEditMode: boolean = false;
  compraId: number | null = null;
  showCategoriaDialog = false;

  constructor(
    private fb: FormBuilder,
    private compraParceladaService: CompraParceladaService,
    private categoriaService: CategoriaService,
    private cartaoService: CartaoService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private formBaseService: FormBaseService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategorias();
    this.loadCartoes();
    this.setupCalculations();
    this.checkEditMode();
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.compraId = +id;
        this.loadCompraParcelada(this.compraId);
      }
    });
  }

  loadCompraParcelada(id: number): void {
    this.loading = true;
    this.compraParceladaService.buscarPorId(id).subscribe({
      next: (compra) => {
        this.form.patchValue({
          descricao: compra.descricao,
          valorTotal: compra.valorTotal,
          dataCompra: compra.dataCompra,
          parcelaInicial: compra.parcelaInicial,
          totalParcelas: compra.totalParcelas,
          categoriaId: compra.categoriaId,
          cartaoId: compra.cartaoId
        });
        this.loading = false;
      },
      error: (error) => {
        this.formBaseService.showError('Erro ao carregar compra parcelada.');
        this.loading = false;
        this.router.navigate(['/compras/parceladas']);
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      valorTotal: [null, [Validators.required, Validators.min(0.01)]],
      dataCompra: [new Date().toISOString().split('T')[0], Validators.required],
      parcelaInicial: [1, [Validators.required, Validators.min(1)]],
      totalParcelas: [null, [Validators.required, Validators.min(1)]],
      categoriaId: [null, Validators.required],
      cartaoId: [null, Validators.required]
    });
  }

  setupCalculations(): void {
    // Recalcula parcelas quando valores mudarem
    this.form.valueChanges.subscribe(() => {
      this.calcularParcelas();
    });
  }

  calcularParcelas(): void {
    const valorTotal = this.form.get('valorTotal')?.value;
    const parcelaInicial = this.form.get('parcelaInicial')?.value;
    const totalParcelas = this.form.get('totalParcelas')?.value;
    const dataCompra = this.form.get('dataCompra')?.value;

    if (valorTotal && parcelaInicial && totalParcelas && parcelaInicial <= totalParcelas) {
      this.parcelasRestantes = this.compraParceladaService.calcularParcelasRestantes(
        parcelaInicial,
        totalParcelas
      );
      this.valorParcela = this.compraParceladaService.calcularValorParcela(
        valorTotal,
        parcelaInicial,
        totalParcelas
      );

      // Calcular datas de vencimento das parcelas
      if (dataCompra) {
        this.calcularDatasVencimento(dataCompra, parcelaInicial, totalParcelas);
      }
    } else {
      this.parcelasRestantes = 0;
      this.valorParcela = 0;
      this.datasVencimento = [];
    }
  }

  calcularDatasVencimento(dataCompra: Date | string, parcelaInicial: number, totalParcelas: number): void {
    // Garantir que temos um objeto Date válido
    const dataBase = dataCompra instanceof Date ? new Date(dataCompra) : new Date(dataCompra + 'T00:00:00');
    this.datasVencimento = [];

    for (let i = parcelaInicial; i <= totalParcelas; i++) {
      const dataVencimento = new Date(dataBase);
      const mesesAFrente = i - parcelaInicial;
      dataVencimento.setMonth(dataBase.getMonth() + mesesAFrente);
      this.datasVencimento.push(dataVencimento);
    }
  }

  formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR');
  }

  loadCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
      },
      error: (error: any) => {
      }
    });
  }

  loadCartoes(): void {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes: Cartao[]) => {
        this.cartoes = cartoes;
      },
      error: (error: any) => {
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Validação adicional
    const parcelaInicial = this.form.get('parcelaInicial')?.value;
    const totalParcelas = this.form.get('totalParcelas')?.value;

    if (parcelaInicial > totalParcelas) {
      this.errorMessage = 'Parcela inicial não pode ser maior que o total de parcelas';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Converter Date para string no formato YYYY-MM-DD
    const formValue = this.form.value;
    const dataCompra = formValue.dataCompra instanceof Date
      ? formValue.dataCompra.toISOString().split('T')[0]
      : formValue.dataCompra;

    const request: CompraParceladaRequest = {
      ...formValue,
      dataCompra: dataCompra
    };

    if (this.isEditMode && this.compraId) {
      // Modo de edição
      this.compraParceladaService.atualizar(this.compraId, request).subscribe({
        next: (response) => {
          this.formBaseService.showSuccess('Compra parcelada atualizada com sucesso.');
          this.router.navigate(['/compras/parceladas']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao atualizar compra parcelada';
          this.loading = false;
        }
      });
    } else {
      // Modo de criação
      this.compraParceladaService.criar(request).subscribe({
        next: (response) => {
          this.formBaseService.showSuccess(`Compra parcelada criada com sucesso. ${this.parcelasRestantes} parcelas de R$ ${this.valorParcela.toFixed(2)}`);
          this.router.navigate(['/compras/parceladas']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao criar compra parcelada';
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/compras/parceladas']);
  }

  get descricaoInvalid(): boolean {
    const control = this.form.get('descricao');
    return !!(control?.invalid && control?.touched);
  }

  get valorTotalInvalid(): boolean {
    const control = this.form.get('valorTotal');
    return !!(control?.invalid && control?.touched);
  }

  get parcelaInicialInvalid(): boolean {
    const control = this.form.get('parcelaInicial');
    const totalParcelas = this.form.get('totalParcelas')?.value;
    const parcelaInicial = control?.value;
    return !!(control?.invalid && control?.touched) ||
           (parcelaInicial && totalParcelas && parcelaInicial > totalParcelas);
  }

  get totalParcelasInvalid(): boolean {
    const control = this.form.get('totalParcelas');
    return !!(control?.invalid && control?.touched);
  }

  novaCategoria(): void {
    this.showCategoriaDialog = true;
  }

  onCategoriaCreated(categoria: Categoria): void {
    this.showCategoriaDialog = false;
    this.loadCategorias();
    this.form.patchValue({ categoriaId: categoria.id });
    this.formBaseService.showSuccess('Categoria criada com sucesso.');
  }

  onCategoriaDialogClose(): void {
    this.showCategoriaDialog = false;
  }

  novoCartao(): void {
    const dialogRef = this.dialogService.open(CartaoFormComponent, {
      header: 'Novo cartão',
      width: '600px',
      modal: true
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {
        this.loadCartoes();
        this.form.patchValue({ cartaoId: result.id });
        this.formBaseService.showSuccess('Cartão criado com sucesso.');
      }
    });
  }
}
