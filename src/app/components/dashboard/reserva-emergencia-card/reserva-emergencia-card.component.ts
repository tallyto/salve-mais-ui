import { Component, Input } from '@angular/core';
import { SALVE_COMMON, SALVE_DATA } from '@shared/primeng-shared';
import { DashboardSummary } from '@services/dashboard.service';

type ReservaEmergencia = NonNullable<DashboardSummary['reservaEmergencia']>;

@Component({
  selector: 'app-reserva-emergencia-card',
  standalone: true,
  imports: [...SALVE_COMMON, ...SALVE_DATA],
  templateUrl: './reserva-emergencia-card.component.html'
})
export class ReservaEmergenciaCardComponent {
  @Input() summaryData: DashboardSummary | null = null;

  get temReserva(): boolean {
    return !!(this.summaryData?.temReservaEmergencia && this.summaryData?.reservaEmergencia);
  }

  private get reserva(): ReservaEmergencia | undefined {
    return this.summaryData?.reservaEmergencia;
  }

  get objetivo(): number | undefined {
    return this.reserva?.objetivo;
  }

  getPercentual(): number {
    return this.reserva?.percentualConcluido ?? 0;
  }

  getTempoRestante(): string {
    const tempo = this.reserva?.tempoRestante;
    return tempo ? tempo.toString() : '';
  }

  estaCompleta(): boolean {
    return this.getPercentual() >= 100;
  }

  getHealthClass(): string {
    const percentual = this.getPercentual();
    if (percentual >= 75) return 'health-excellent';
    if (percentual >= 50) return 'health-good';
    if (percentual >= 25) return 'health-average';
    return 'health-poor';
  }

  getStatus(): string {
    const percentual = this.getPercentual();
    if (percentual >= 75) return 'Excelente';
    if (percentual >= 50) return 'Boa';
    if (percentual >= 25) return 'Em progresso';
    return 'Inicial';
  }

  getIcon(): string {
    const percentual = this.getPercentual();
    if (percentual >= 75) return 'sentiment_very_satisfied';
    if (percentual >= 50) return 'sentiment_satisfied';
    if (percentual >= 25) return 'sentiment_dissatisfied';
    return 'sentiment_very_dissatisfied';
  }
}
