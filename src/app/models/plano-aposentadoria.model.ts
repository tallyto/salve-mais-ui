export interface PlanoAposentadoria {
  id?: number;
  idadeAtual: number;
  idadeAposentadoria: number;
  patrimonioAtual: number;
  contribuicaoMensal: number;
  rendaDesejada: number;
  taxaRetornoAnual: number;
  patrimonioNecessario?: number;
  patrimonioProjetado?: number;
  expectativaVida: number;
  inflacaoEstimada: number;
  observacoes?: string;
  ativo: boolean;
  anosParaAposentadoria?: number;
  anosAposAposentadoria?: number;
  deficitSuperavit?: number;
}
