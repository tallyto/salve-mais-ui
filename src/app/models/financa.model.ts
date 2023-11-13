// financa.model.ts
export interface Financa {
  id: number;
  nome: string;
  categoria: {
    id: number;
    nome: string;
  };
  vencimento: string;
  valor: number;
  pago: boolean;
}
