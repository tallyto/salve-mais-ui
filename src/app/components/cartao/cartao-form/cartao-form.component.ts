import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CartaoService } from "@services/cartao.service";
import { Cartao } from "@models/cartao.model";

@Component({
  selector: 'app-cartao-form',
  templateUrl: './cartao-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    DialogModule,
    CalendarModule
  ],
  providers: [MessageService, DialogService]
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
