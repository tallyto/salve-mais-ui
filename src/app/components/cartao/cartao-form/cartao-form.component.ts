import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartaoService } from "../../../services/cartao.service";
import { Cartao } from "../../../models/cartao.model";

@Component({
  selector: 'app-cartao-form',
  templateUrl: './cartao-form.component.html',
  styleUrls: ['./cartao-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class CartaoFormComponent implements OnInit {
  public cartaoForm: FormGroup;
  public displayedColumnsCartao: string[] = ['nome', 'vencimento', 'acoes'];
  public cartoes: Cartao[] = [];
  public editingCartao: Cartao | null = null;
  public isDialogMode: boolean = false;
  public tempNome: string = '';
  public tempVencimento: Date | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private cartoService: CartaoService,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<CartaoFormComponent>
  ) {
    this.isDialogMode = !!dialogRef;
    this.cartaoForm = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      vencimento: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.listarCartoes()
  }

  salvarCartao() {
    if (this.cartaoForm.invalid) {
      return;
    }

    this.cartoService.salvarCartao(this.cartaoForm.value).subscribe({
      next: (value: Cartao) => {
        const message = this.cartaoForm.value.id ? 'Cartão atualizado com sucesso!' : 'Cartão salvo com sucesso!';
        this.snackBar.open(message, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.cartaoForm.reset();

        // Se estiver em modo dialog, fecha o dialog retornando o cartão criado
        if (this.isDialogMode && this.dialogRef) {
          this.dialogRef.close(value);
        } else {
          this.listarCartoes();
        }
      },
      error: (errorMessage: string) => {
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  fecharDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  private listarCartoes(): void {
    this.cartoService.listarCartoes().subscribe(
      cartoes => this.cartoes = cartoes
    );
  }

  startEdit(cartao: Cartao) {
    this.editingCartao = cartao;
    this.tempNome = cartao.nome;
    this.tempVencimento = cartao.vencimento ? new Date(cartao.vencimento) : null;
  }

  cancelEdit() {
    this.editingCartao = null;
  }

  saveEdit() {
    if (this.editingCartao && this.tempNome && this.tempVencimento) {
      const updatedCartao: Cartao = {
        ...this.editingCartao,
        nome: this.tempNome,
        vencimento: this.tempVencimento.toISOString()
      };

      this.cartoService.salvarCartao(updatedCartao).subscribe({
        next: () => {
          this.listarCartoes();
          this.editingCartao = null;
          this.snackBar.open('Cartão atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
        error: (errorMessage: string) => {
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  isEditing(cartao: Cartao): boolean {
    return this.editingCartao !== null && this.editingCartao.id === cartao.id;
  }

  excluirCartao(cartao: Cartao) {
    if (confirm(`Deseja realmente excluir o cartão ${cartao.nome}?`)) {
      this.cartoService.excluirCartao(cartao.id).subscribe({
        next: () => {
          this.listarCartoes();
          this.snackBar.open('Cartão excluído com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
        error: (errorMessage: string) => {
          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }
}
