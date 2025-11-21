import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-container',
  templateUrl: './categoria-container.component.html',
  styleUrls: ['./categoria-container.component.css'],
  standalone: false
})
export class CategoriaContainerComponent implements OnInit {
  public categorias: Categoria[] = [];
  public editingCategoria: Categoria | null = null;

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.listarCategorias();
  }

  onCategoriaCreated(categoria: Categoria): void {
    this.listarCategorias(); // Recarrega a lista
  }

  onCategoriaUpdated(categoria: Categoria): void {
    this.editingCategoria = null;
    this.listarCategorias(); // Recarrega a lista
  }

  onFormCancelled(): void {
    this.editingCategoria = null;
  }

  onCategoriaEdit(categoria: Categoria): void {
    this.editingCategoria = categoria;
  }

  onCategoriaDeleted(categoriaId: number): void {
    this.categorias = this.categorias.filter(c => c.id !== categoriaId);
    // Se estava editando a categoria excluída, limpa a edição
    if (this.editingCategoria && this.editingCategoria.id === categoriaId) {
      this.editingCategoria = null;
    }
  }

  onCategoriaUpdatedFromList(categoria: Categoria): void {
    // Atualiza a categoria na lista local e cria nova referência para detectar mudança
    const index = this.categorias.findIndex(c => c.id === categoria.id);
    if (index !== -1) {
      this.categorias = [
        ...this.categorias.slice(0, index),
        categoria,
        ...this.categorias.slice(index + 1)
      ];
    }
  }

  private listarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      (categorias: Categoria[]) => this.categorias = categorias
    );
  }
}