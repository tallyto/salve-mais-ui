export enum TipoCategoria {
  NECESSIDADE = 'NECESSIDADE',  // 50%
  DESEJO = 'DESEJO',            // 30%
  ECONOMIA = 'ECONOMIA'         // 20%
}

export interface Categoria {
  id: number;
  nome: string;
  tipo: TipoCategoria;
}
