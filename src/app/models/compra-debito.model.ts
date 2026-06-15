import { Categoria } from "./categoria.model";

export interface CompraDebito {
  id: number;
  nome: string;
  categoria?: Categoria;
  dataCompra: string;
  valor: number;
  observacoes?: string;
}

export interface CompraDebitoInput {
  nome: string;
  categoriaId?: number;
  contaId: number;
  dataCompra: string;
  valor: number;
  observacoes?: string;
}
