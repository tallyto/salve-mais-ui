import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '@services/usuario.service';
import { MessageService } from 'primeng/api';
import { SALVE_COMMON, SALVE_FORMS } from '@shared/primeng-shared';

@Component({
    selector: 'app-minha-conta',
    templateUrl: './minha-conta.component.html',
    standalone: true,
    imports: [
      ...SALVE_COMMON,
      ...SALVE_FORMS
    ]
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
    this.usuarioService.obterLogado().subscribe({
      next: (user) => {
        this.usuario = user;
        this.nomeForm.patchValue({ nome: user.nome });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar dados do usuário' });
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
    private messageService: MessageService
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
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Nome atualizado com sucesso!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar nome: ' + (err.error || 'Erro desconhecido') });
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
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso!' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao alterar senha: ' + (err.error || 'Erro desconhecido') });
      }
    });
  }

  cancelarEdicaoSenha() {
    this.editandoSenha = false;
  }
}
