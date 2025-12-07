import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, StatusMeta } from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-meta-form',
  templateUrl: './meta-form.component.html',
  styleUrls: ['./meta-form.component.css'],
  standalone: false
})
export class MetaFormComponent implements OnInit {
  metaForm: FormGroup;
  categorias: Categoria[] = [];
  statusOptions = Object.values(StatusMeta);
  iconeOptions = ['savings', 'home', 'flight', 'directions_car', 'school', 'favorite', 'celebration', 'laptop'];
  corOptions = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ffeb3b', '#795548'];

  constructor(
    private fb: FormBuilder,
    private metaService: MetaService,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MetaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Meta
  ) {
    this.metaForm = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', Validators.maxLength(500)],
      valorAlvo: [0, [Validators.required, Validators.min(0.01)]],
      valorAtual: [0, [Validators.min(0)]],
      dataInicio: [new Date().toISOString().split('T')[0], Validators.required],
      dataAlvo: ['', Validators.required],
      categoriaId: [null],
      status: [StatusMeta.EM_ANDAMENTO, Validators.required],
      icone: ['savings'],
      cor: ['#3f51b5'],
      notificarProgresso: [false]
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();
    
    if (this.data) {
      this.metaForm.patchValue({
        ...this.data,
        dataInicio: this.data.dataInicio ? this.data.dataInicio.split('T')[0] : null,
        dataAlvo: this.data.dataAlvo ? this.data.dataAlvo.split('T')[0] : null
      });
    }
  }

  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: (error) => console.error('Erro ao carregar categorias:', error)
    });
  }

  salvar(): void {
    if (this.metaForm.valid) {
      const meta: Meta = this.metaForm.value;
      const request = meta.id 
        ? this.metaService.atualizar(meta.id, meta)
        : this.metaService.criar(meta);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            meta.id ? 'Meta atualizada com sucesso' : 'Meta criada com sucesso',
            'Fechar',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erro ao salvar meta:', error);
          this.snackBar.open('Erro ao salvar meta', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
