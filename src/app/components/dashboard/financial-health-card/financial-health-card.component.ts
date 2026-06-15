import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DashboardSummary } from '../../../services/dashboard.service';

@Component({
  selector: 'app-financial-health-card',
  standalone: true,
  imports: [CommonModule, CardModule, ProgressBarModule],
  templateUrl: './financial-health-card.component.html'
})
export class FinancialHealthCardComponent {
  @Input() summaryData: DashboardSummary | null = null;

  getBalanceRatio(): number {
    if (!this.summaryData || this.summaryData.despesasMes === 0) {
      return 100;
    }

    // Proporção do saldo em relação às despesas mensais, limitada entre 0 e 100%
    const ratio = (this.summaryData.saldoTotal / this.summaryData.despesasMes) * 100;
    return Math.min(Math.max(ratio, 0), 100);
  }

  getBalanceHealthClass(): string {
    const ratio = this.getBalanceRatio();
    if (ratio >= 75) return 'health-excellent';
    if (ratio >= 50) return 'health-good';
    if (ratio >= 25) return 'health-average';
    return 'health-poor';
  }

  getHealthIcon(): string {
    const ratio = this.getBalanceRatio();
    if (ratio >= 75) return 'sentiment_very_satisfied';
    if (ratio >= 50) return 'sentiment_satisfied';
    if (ratio >= 25) return 'sentiment_dissatisfied';
    return 'sentiment_very_dissatisfied';
  }

  getHealthLabel(): string {
    const ratio = this.getBalanceRatio();
    if (ratio >= 75) return 'Excelente';
    if (ratio >= 50) return 'Boa';
    if (ratio >= 25) return 'Média';
    return 'Preocupante';
  }

  formatarPercentual(valor: number): string {
    return valor.toFixed(1).replace('.', ',') + '%';
  }

  getFinancialTip(): string {
    const ratio = this.getBalanceRatio();

    if (ratio >= 75) {
      return 'Sua saúde financeira está excelente! Considere investir o excedente para fazer seu dinheiro render mais.';
    }
    if (ratio >= 50) {
      return 'Você está em um bom caminho. Tente aumentar sua reserva de emergência para pelo menos 6 meses de despesas.';
    }
    if (ratio >= 25) {
      return 'Atenção às suas despesas. Tente reduzir gastos não essenciais para aumentar seu saldo.';
    }
    return 'Sua situação financeira requer atenção imediata. Considere cortar despesas e aumentar sua renda.';
  }
}
