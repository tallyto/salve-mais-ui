import { Component, OnInit } from '@angular/core';
import { NotificacaoService, NotificacaoDTO } from '../../services/notificacao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css']
})
export class NotificacoesComponent implements OnInit {
  notificacoes: NotificacaoDTO[] = [];
  loading = false;
  filtroAtual = 'TODAS';

  filtros = [
    { valor: 'TODAS', label: 'Todas' },
    { valor: 'CONTA_ATRASADA', label: 'Contas Atrasadas' },
    { valor: 'CONTA_PROXIMA_VENCIMENTO', label: 'Próximas ao Vencimento' },
    { valor: 'FATURA_ATRASADA', label: 'Faturas Atrasadas' }
  ];

  constructor(
    private notificacaoService: NotificacaoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarNotificacoes();
  }

  carregarNotificacoes(): void {
    this.loading = true;
    this.notificacaoService.obterNotificacoes().subscribe({
      next: (notificacoes) => {
        this.notificacoes = notificacoes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar notificações:', error);
        this.snackBar.open('Erro ao carregar notificações', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  filtrarNotificacoes(): NotificacaoDTO[] {
    if (this.filtroAtual === 'TODAS') {
      return this.notificacoes;
    }
    return this.notificacoes.filter(n => n.tipo === this.filtroAtual);
  }

  aplicarFiltro(filtro: string): void {
    this.filtroAtual = filtro;
  }

  navegarParaEntidade(notificacao: NotificacaoDTO): void {
    if (notificacao.tipoEntidade === 'CONTA_FIXA') {
      this.router.navigate(['/despesas-fixas']);
    } else if (notificacao.tipoEntidade === 'FATURA') {
      this.router.navigate(['/faturas']);
    }
  }

  getCorPrioridade(prioridade: string): string {
    return this.notificacaoService.getCorPrioridade(prioridade);
  }

  getIconeTipo(tipo: string): string {
    return this.notificacaoService.getIconeTipo(tipo);
  }

  formatarDias(dias: number, tipo: string): string {
    if (tipo.includes('ATRASADA')) {
      return dias === 1 ? '1 dia de atraso' : `${dias} dias de atraso`;
    } else {
      if (dias === 0) return 'Vence hoje';
      if (dias === 1) return 'Vence amanhã';
      return `Vence em ${dias} dias`;
    }
  }

  getPrioridadeLabel(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA': return 'Crítica';
      case 'ALTA': return 'Alta';
      case 'MEDIA': return 'Média';
      case 'BAIXA': return 'Baixa';
      default: return prioridade;
    }
  }

  getNotificacoesPrioridade(): number {
    return this.notificacoes.filter(n =>
      n.prioridade === 'ALTA' || n.prioridade === 'CRITICA'
    ).length;
  }

  getNotificacoesAtrasadas(): number {
    return this.notificacoes.filter(n =>
      n.tipo.includes('ATRASADA')
    ).length;
  }
}
