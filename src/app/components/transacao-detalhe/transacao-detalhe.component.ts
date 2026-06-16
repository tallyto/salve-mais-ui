import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TransacaoService } from '../../services/transacao.service';
import { Transacao } from '../../models/transacao.model';
import { TipoTransacao } from '../../models/tipo-transacao.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transacao-detalhe',
  templateUrl: './transacao-detalhe.component.html',
  standalone: false
})
export class TransacaoDetalheComponent implements OnInit {
  transacao: Transacao | null = null;
  loading = false;
  error = false;
  tipoTransacao = TipoTransacao;

  constructor(
    private route: ActivatedRoute,
    private transacaoService: TransacaoService,
    private messageService: MessageService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.carregarTransacao();
  }

  carregarTransacao(): void {
    this.loading = true;
    this.error = false;
    
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID da transação não fornecido' });
      this.loading = false;
      return;
    }

    this.transacaoService.obterTransacao(+id).subscribe({
      next: (data) => {
        this.transacao = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Erro ao carregar os detalhes da transação'
        });
      }
    });
  }

  voltar(): void {
    this.location.back();
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarData(data: Date): string {
    if (!data) return '';
    
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDescricaoTipo(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
        return 'Crédito';
      case TipoTransacao.DEBITO:
        return 'Débito';
      case TipoTransacao.TRANSFERENCIA_SAIDA:
        return 'Transferência (Saída)';
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
        return 'Transferência (Entrada)';
      case TipoTransacao.PAGAMENTO_FATURA:
        return 'Pagamento de Fatura';
      default:
        return tipo;
    }
  }

  getSinalValor(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
        return '+';
      case TipoTransacao.DEBITO:
      case TipoTransacao.TRANSFERENCIA_SAIDA:
      case TipoTransacao.PAGAMENTO_FATURA:
        return '-';
      default:
        return '';
    }
  }

  getTipoIcon(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
        return 'arrow_upward';
      case TipoTransacao.DEBITO:
        return 'arrow_downward';
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
      case TipoTransacao.TRANSFERENCIA_SAIDA:
        return 'swap_horiz';
      case TipoTransacao.PAGAMENTO_FATURA:
        return 'credit_card';
      default:
        return 'help';
    }
  }
}
