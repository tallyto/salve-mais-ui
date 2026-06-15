import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartaoService } from "@services/cartao.service";
import { Cartao } from "@models/cartao.model";
import { SALVE_COMMON, SALVE_FORMS, SALVE_DATA, SALVE_OVERLAY } from '@shared/primeng-shared';

@Component({
  selector: 'app-cartao-form',
  templateUrl: './cartao-form.component.html',
  standalone: true,
  imports: [
    ...SALVE_COMMON,
    ...SALVE_FORMS,
    ...SALVE_DATA,
    ...SALVE_OVERLAY
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
    private messageService: MessageService,
    @Optional() public dialogRef: DynamicDialogRef
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
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message, life: 3000 });
        this.cartaoForm.reset();

        // Se estiver em modo dialog, fecha o dialog retornando o cartão criado
        if (this.isDialogMode && this.dialogRef) {
          this.dialogRef.close(value);
        } else {
          this.listarCartoes();
        }
      },
      error: (errorMessage: string) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
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
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cartão atualizado com sucesso!', life: 3000 });
        },
        error: (errorMessage: string) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
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
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cartão excluído com sucesso!', life: 3000 });
        },
        error: (errorMessage: string) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 3000 });
        }
      });
    }
  }
}
