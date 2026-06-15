export interface Plano {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: string;
  precoMensal: number;
  maxUsuarios: number;
  maxTransacoesMes: number | null;
  maxStorageGb: number | null;
}
