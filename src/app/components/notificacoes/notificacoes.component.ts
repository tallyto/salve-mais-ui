import { Component, OnInit } from '@angular/core';
import { NotificacaoService, NotificacaoDTO } from '../../services/notificacao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notificacoes',
    templateUrl: './notificacoes.component.html',
    styleUrls: ['./notificacoes.component.css'],
    standalone: false
})
export class NotificacoesComponent implements OnInit {
  notificacoes: NotificacaoDTO[] = [];
  loading = false;
  filtroAtual = 'TODAS';

  filtros = [
    { valor: 'TODAS', label: 'Todas Notificações' },
    { valor: 'CONTA_ATRASADA', label: 'Contas Atrasadas' },
    { valor: 'CONTA_PROXIMA_VENCIMENTO', label: 'Contas a Vencer' },
    { valor: 'FATURA_ATRASADA', label: 'Faturas Atrasadas' },
    { valor: 'FATURA_PROXIMA_VENCIMENTO', label: 'Faturas a Vencer' }
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
      this.router.navigate(['/cartao/faturas']);
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
  
  getIconeFiltro(filtro: string): string {
    switch (filtro) {
      case 'TODAS': return 'notifications_active';
      case 'CONTA_ATRASADA': return 'warning';
      case 'CONTA_PROXIMA_VENCIMENTO': return 'date_range';
      case 'FATURA_ATRASADA': return 'credit_score';
      case 'FATURA_PROXIMA_VENCIMENTO': return 'payment';
      default: return 'filter_list';
    }
  }
  
  getContadorPorFiltro(filtro: string): number {
    if (filtro === 'TODAS') {
      return this.notificacoes.length;
    }
    return this.notificacoes.filter(n => n.tipo === filtro).length;
  }
  
  getFiltroLabel(filtroValor: string): string {
    const filtro = this.filtros.find(f => f.valor === filtroValor);
    return filtro ? filtro.label : filtroValor;
  }
  
  getBackgroundColor(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA': return 'rgba(211, 47, 47, 0.15)';
      case 'ALTA': return 'rgba(244, 67, 54, 0.15)';
      case 'MEDIA': return 'rgba(255, 152, 0, 0.15)';
      case 'BAIXA': return 'rgba(76, 175, 80, 0.15)';
      default: return 'rgba(0, 0, 0, 0.1)';
    }
  }
  
  getIconColor(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA': return '#d32f2f';
      case 'ALTA': return '#f44336';
      case 'MEDIA': return '#ff9800';
      case 'BAIXA': return '#4caf50';
      default: return '#757575';
    }
  }
}
