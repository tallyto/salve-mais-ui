import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { CartaoService } from '@services/cartao.service';
import { Cartao, CartaoLimiteDTO, CartaoLimiteStatusDTO } from '@models/cartao.model';

@Component({
  selector: 'app-cartao-limites',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    SelectModule,
    TableModule,
    ProgressBarModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './cartao-limites.component.html',
  providers: [MessageService]
})
export class CartaoLimitesComponent implements OnInit {
  limiteForm: FormGroup;
  cartoes: Cartao[] = [];
  statusLimites: CartaoLimiteStatusDTO[] = [];
  alertas: CartaoLimiteStatusDTO[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cartaoService: CartaoService,
    private messageService: MessageService
  ) {
    this.limiteForm = this.fb.group({
      cartaoId: ['', Validators.required],
      limiteTotal: ['', [Validators.required, Validators.min(0.01)]],
      limiteAlertaPercentual: [80, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit() {
    this.carregarCartoes();
    this.carregarStatusLimites();
    this.carregarAlertas();
  }

  carregarCartoes() {
    this.cartaoService.listarCartoes().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar cartões', life: 3000 });
      }
    });
  }

  carregarStatusLimites() {
    this.cartaoService.listarStatusLimiteTodos().subscribe({
      next: (status) => {
        this.statusLimites = status;
      },
      error: (error) => {
      }
    });
  }

  carregarAlertas() {
    this.cartaoService.verificarAlertas().subscribe({
      next: (alertas) => {
        this.alertas = alertas;
      },
      error: (error) => {
      }
    });
  }

  onSubmit() {
    if (this.limiteForm.valid) {
      this.loading = true;
      const formValue = this.limiteForm.value;

      const limiteDTO: CartaoLimiteDTO = {
        cartaoId: formValue.cartaoId,
        limiteTotal: formValue.limiteTotal,
        limiteAlertaPercentual: formValue.limiteAlertaPercentual
      };

      this.cartaoService.configurarLimite(formValue.cartaoId, limiteDTO).subscribe({
        next: (cartao) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Limite configurado com sucesso!', life: 3000 });
          this.limiteForm.reset();
          this.limiteForm.patchValue({ limiteAlertaPercentual: 80 });
          this.carregarStatusLimites();
          this.carregarAlertas();
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao configurar limite', life: 3000 });
          this.loading = false;
        }
      });
    }
  }

  getStatusText(status: CartaoLimiteStatusDTO): string {
    if (status.limiteExcedido) return 'Limite Excedido';
    if (status.alertaAtivado) return 'Em Alerta';
    return 'Normal';
  }

  removerLimite(cartaoId: number) {
    // Implementar remoção de limite se necessário
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Funcionalidade de remoção será implementada', life: 3000 });
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarPercentual(valor: number): string {
    return valor.toFixed(1) + '%';
  }
}
