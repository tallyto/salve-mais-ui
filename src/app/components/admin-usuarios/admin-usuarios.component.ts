import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { NovoUsuarioDialogComponent } from './novo-usuario-dialog/novo-usuario-dialog.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    TableModule,
    TooltipModule
  ],
  templateUrl: './admin-usuarios.component.html'
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['nome', 'email', 'criadoEm', 'ultimoAcesso', 'acoes'];
  loading = false;
  usuarioLogado: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUsuarioLogado();
    this.carregarUsuarios();
  }

  carregarUsuarioLogado() {
    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
      },
      error: (err) => {
      }
    });
  }

  carregarUsuarios() {
    this.loading = true;
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar usuários' });
        this.loading = false;
      }
    });
  }

  abrirDialogNovoUsuario() {
    const ref = this.dialogService.open(NovoUsuarioDialogComponent, {
      header: 'Novo Usuário',
      width: '500px'
    });

    ref.onClose.subscribe(result => {
      if (result) {
        this.carregarUsuarios();
      }
    });
  }

  podeDeletar(usuario: Usuario): boolean {
    // Impedir que o usuário delete a si mesmo
    return this.usuarioLogado?.id !== usuario.id;
  }

  deletarUsuario(usuario: Usuario) {
    if (!this.podeDeletar(usuario)) {
      this.messageService.add({ severity: 'warn', summary: 'Ação bloqueada', detail: 'Você não pode deletar sua própria conta' });
      return;
    }

    this.confirmationService.confirm({
      header: 'Deletar usuário',
      message: `Tem certeza que deseja deletar o usuário ${usuario.nome}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.usuarioService.deletarUsuario(usuario.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário deletado com sucesso' });
            this.carregarUsuarios();
          },
          error: (err) => {
            const errorMessage = err.error || 'Erro ao deletar usuário';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
          }
        });
      }
    });
  }

  formatarData(data: string | undefined): string {
    if (!data) return 'Nunca';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
