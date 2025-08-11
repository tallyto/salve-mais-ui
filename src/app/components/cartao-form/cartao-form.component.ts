import {Component, OnInit} from '@angular/core';
import {CartaoService} from "../../services/cartao.service";
import {Cartao} from "../../models/cartao.model";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-cartao-form',
    templateUrl: './cartao-form.component.html',
    styleUrls: ['./cartao-form.component.css'],
    standalone: false
})
export class CartaoFormComponent implements OnInit {

  public cartaoForm: FormGroup;
  public displayedColumnsCartao: string[] = ['nome', 'vencimento', 'acoes'];
  public cartoes: Cartao[] = [];
  public editingCartao: Cartao | null = null;
  public tempNome: string = '';
  public tempVencimento: Date | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private cartoService: CartaoService,
    private snackBar: MatSnackBar
  ) {
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
    this.cartoService.salvarCartao(this.cartaoForm.value).subscribe({
      next: value => {
        this.cartaoForm.reset();
        this.listarCartoes();
        this.snackBar.open('Cartão salvo com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: error => {
        console.log(error);
        this.snackBar.open('Erro ao salvar cartão', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    })
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
        error: error => {
          console.log(error);
          this.snackBar.open('Erro ao atualizar cartão', 'Fechar', {
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
        error: (error: any) => {
          console.log(error);
          this.snackBar.open('Erro ao excluir cartão', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }
}
