import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompraParceladaService } from '../../services/compra-parcelada.service';
import { CategoriaService } from '../../services/categoria.service';
import { CartaoService } from '../../services/cartao.service';
import { Categoria } from '../../models/categoria.model';
import { Cartao } from '../../models/cartao.model';
import { CompraParceladaRequest } from '../../models/compra-parcelada.model';
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component';
import { CartaoFormComponent } from '../cartao-form/cartao-form.component';

@Component({
  selector: 'app-compra-parcelada-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './compra-parcelada-form.component.html',
  styleUrls: ['./compra-parcelada-form.component.css']
})
export class CompraParceladaFormComponent implements OnInit {
  form!: FormGroup;
  categorias: Categoria[] = [];
  cartoes: Cartao[] = [];
  parcelasRestantes: number = 0;
  valorParcela: number = 0;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private compraParceladaService: CompraParceladaService,
    private categoriaService: CategoriaService,
    private cartaoService: CartaoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategorias();
    this.loadCartoes();
    this.setupCalculations();
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
    } else {
      this.parcelasRestantes = 0;
      this.valorParcela = 0;
    }
  }

  loadCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (categorias: Categoria[]) => {
        this.categorias = categorias;
        console.log('Categorias carregadas:', categorias);
      },
      error: (error: any) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  loadCartoes(): void {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes: Cartao[]) => {
        this.cartoes = cartoes;
      },
      error: (error: any) => {
        console.error('Erro ao carregar cartões:', error);
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

    const request: CompraParceladaRequest = this.form.value;

    this.compraParceladaService.criar(request).subscribe({
      next: (response) => {
        console.log('Compra parcelada criada:', response);
        alert(`Compra parcelada criada com sucesso! ${this.parcelasRestantes} parcelas de R$ ${this.valorParcela.toFixed(2)}`);
        this.router.navigate(['/compras-parceladas']);
      },
      error: (error) => {
        console.error('Erro ao criar compra parcelada:', error);
        this.errorMessage = error.error?.message || 'Erro ao criar compra parcelada';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/compras-parceladas']);
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
    const dialogRef = this.dialog.open(CategoriaFormComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategorias();
        // Seleciona automaticamente a categoria recém-criada
        this.form.patchValue({ categoriaId: result.id });
        this.snackBar.open('Categoria criada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }

  novoCartao(): void {
    const dialogRef = this.dialog.open(CartaoFormComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCartoes();
        // Seleciona automaticamente o cartão recém-criado
        this.form.patchValue({ cartaoId: result.id });
        this.snackBar.open('Cartão criado com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
