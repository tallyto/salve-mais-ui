import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { NovoUsuarioDialogComponent } from './novo-usuario-dialog/novo-usuario-dialog.component';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['nome', 'email', 'criadoEm', 'ultimoAcesso', 'acoes'];
  loading = false;
  usuarioLogado: Usuario | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
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
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirDialogNovoUsuario() {
    const dialogRef = this.dialog.open(NovoUsuarioDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
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
      this.snackBar.open('Você não pode deletar sua própria conta', 'Fechar', { duration: 3000 });
      return;
    }

    if (confirm(`Tem certeza que deseja deletar o usuário ${usuario.nome}?`)) {
      this.usuarioService.deletarUsuario(usuario.id).subscribe({
        next: () => {
          this.snackBar.open('Usuário deletado com sucesso', 'Fechar', { duration: 3000 });
          this.carregarUsuarios();
        },
        error: (err) => {
          const errorMessage = err.error || 'Erro ao deletar usuário';
          this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
        }
      });
    }
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
