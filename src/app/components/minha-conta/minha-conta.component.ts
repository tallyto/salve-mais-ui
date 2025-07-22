import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.css']
})
export class MinhaContaComponent implements OnInit {
  usuario: {
    nome: string;
    email: string;
    criadoEm: string;
    ultimoAcesso?: string;
  } = {
    nome: '',
    email: '',
    criadoEm: '',
    ultimoAcesso: undefined
  };
  ngOnInit(): void {
    this.usuarioService.getUsuarioLogado().subscribe({
      next: (user) => {
        this.usuario = user;
        this.nomeForm.patchValue({ nome: user.nome });
      },
      error: () => {
        this.snackBar.open('Erro ao carregar dados do usuário', 'Fechar', { duration: 4000 });
      }
    });
  }

  editandoNome = false;
  editandoSenha = false;
  nomeForm: FormGroup;
  senhaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.nomeForm = this.fb.group({
      nome: [this.usuario.nome, [Validators.required, Validators.minLength(3)]],
    });
    this.senhaForm = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  editarDados() {
    this.editandoNome = true;
    this.nomeForm.patchValue({ nome: this.usuario.nome });
  }

  salvarNome() {
    if (this.nomeForm.invalid) return;
    this.usuarioService.atualizarNome({ email: this.usuario.email, nome: this.nomeForm.value.nome })
      .subscribe({
        next: () => {
          this.usuario.nome = this.nomeForm.value.nome;
          this.editandoNome = false;
          this.snackBar.open('Nome atualizado com sucesso!', 'Fechar', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open('Erro ao atualizar nome: ' + (err.error || 'Erro desconhecido'), 'Fechar', { duration: 4000 });
        }
      });
  }

  cancelarEdicaoNome() {
    this.editandoNome = false;
  }

  alterarSenha() {
    this.editandoSenha = true;
    this.senhaForm.reset();
  }

  salvarSenha() {
    if (this.senhaForm.invalid) return;
    this.usuarioService.atualizarSenha({
      email: this.usuario.email,
      senhaAtual: this.senhaForm.value.senhaAtual,
      novaSenha: this.senhaForm.value.novaSenha
    }).subscribe({
      next: () => {
        this.editandoSenha = false;
        this.snackBar.open('Senha alterada com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Erro ao alterar senha: ' + (err.error || 'Erro desconhecido'), 'Fechar', { duration: 4000 });
      }
    });
  }

  cancelarEdicaoSenha() {
    this.editandoSenha = false;
  }
}
