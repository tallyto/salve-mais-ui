export interface GastoCartaoInput {
  id?: number;
  descricao: string;
  valor: number;
  data: Date;
  cartaoId: number;
  categoriaId: number;
}
