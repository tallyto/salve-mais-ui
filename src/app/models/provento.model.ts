export interface Provento {
  id?: number;
  descricao: string;
  data: Date;
  valor: number;
  conta?: any; // Adiciona campo opcional conta para facilitar edição
}
