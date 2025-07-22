import { Component, OnInit } from '@angular/core';
import { NotificacaoService, ResumoNotificacoes } from '../../services/notificacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificacoes-widget',
  templateUrl: './notificacoes-widget.component.html',
  styleUrls: ['./notificacoes-widget.component.css']
})
export class NotificacoesWidgetComponent implements OnInit {
  resumo: ResumoNotificacoes | null = null;
  loading = false;

  constructor(
    private notificacaoService: NotificacaoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {
    this.loading = true;
    this.notificacaoService.obterResumoNotificacoes().subscribe({
      next: (resumo) => {
        this.resumo = resumo;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo de notificações:', error);
        this.loading = false;
      }
    });
  }

  navegarParaNotificacoes(): void {
    this.router.navigate(['/notificacoes']);
  }
}
