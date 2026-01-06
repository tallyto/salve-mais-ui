import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransacaoService } from '../../services/transacao.service';
import { Transacao } from '../../models/transacao.model';
import { TipoTransacao } from '../../models/tipo-transacao.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transacao-detalhe',
  templateUrl: './transacao-detalhe.component.html',
  styleUrls: ['./transacao-detalhe.component.css'],
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
    private snackBar: MatSnackBar,
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
      this.snackBar.open('ID da transação não fornecido', 'Fechar', { duration: 3000 });
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
        this.snackBar.open(
          err.error?.message || 'Erro ao carregar os detalhes da transação', 
          'Fechar', 
          { duration: 3000 }
        );
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

  getCorValor(tipo: TipoTransacao): string {
    switch (tipo) {
      case TipoTransacao.CREDITO:
      case TipoTransacao.TRANSFERENCIA_ENTRADA:
        return 'texto-positivo';
      case TipoTransacao.DEBITO:
      case TipoTransacao.TRANSFERENCIA_SAIDA:
      case TipoTransacao.PAGAMENTO_FATURA:
        return 'texto-negativo';
      default:
        return '';
    }
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
}