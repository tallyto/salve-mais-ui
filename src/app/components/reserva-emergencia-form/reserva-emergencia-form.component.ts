import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Conta, TipoConta } from 'src/app/models/conta.model';
import { ContaService } from 'src/app/services/conta.service';
import { ReservaEmergenciaService } from '../../services/reserva-emergencia.service';
import { FormBaseService } from '../../services/form-base.service';

@Component({
  selector: 'app-reserva-emergencia-form',
  templateUrl: './reserva-emergencia-form.component.html',
  standalone: false
})
export class ReservaEmergenciaFormComponent implements OnInit {
  reservaForm: FormGroup;
  contas: Conta[] = [];
  contasDisponiveis: Conta[] = [];
  isEditMode = false;
  reservaId: number | null = null;
  loading = false;
  calculandoObjetivo = false;
  simulacaoResultado: { simples: string; comRendimento: string; taxa: number } | null = null;

  // Opções para o multiplicador de despesas
  multiplicadoresDisponiveis = [
    { valor: 3, descricao: '3 meses (mínimo recomendado)' },
    { valor: 6, descricao: '6 meses (recomendado)' },
    { valor: 9, descricao: '9 meses' },
    { valor: 12, descricao: '12 meses (conservador)' }
  ];

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaEmergenciaService,
    private contaService: ContaService,
    private route: ActivatedRoute,
    private router: Router,
    private formBaseService: FormBaseService
  ) {
    this.reservaForm = this.fb.group({
      objetivo: [null, [Validators.required, Validators.min(0.01)]],
      multiplicadorDespesas: [6, Validators.required],
      valorContribuicaoMensal: [null, [Validators.required, Validators.min(0.01)]],
      contaId: [null, Validators.required],
      taxaRendimento: [13.25, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.loading = true;


    // Carrega as contas disponíveis
    this.contaService.getContas().subscribe({
      next: (contas) => {
        this.contas = contas;

        this.contasDisponiveis = this.contas.filter(c => c.tipo === TipoConta.RESERVA_EMERGENCIA);

        // Em criação, prioriza conta do tipo RESERVA_EMERGENCIA; senão usa a primeira disponível
        if (!this.isEditMode && this.contasDisponiveis.length > 0) {
          const reservaConta = this.contasDisponiveis.find(c => c.tipo === TipoConta.RESERVA_EMERGENCIA);
          this.reservaForm.patchValue({
            contaId: (reservaConta ?? this.contasDisponiveis[0]).id
          });
        }

        // Verifica se está no modo de edição
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.isEditMode = true;
          this.reservaId = +id;
          this.carregarReserva(+id);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        this.formBaseService.showError(this.formBaseService.handleError(err, 'Erro ao carregar contas.'));
        this.loading = false;
      }
    });
  }

  carregarReserva(id: number): void {
    this.reservaService.getReservaById(id).subscribe({
      next: (reserva) => {
        this.reservaForm.patchValue({
          objetivo: reserva.objetivo,
          multiplicadorDespesas: reserva.multiplicadorDespesas,
          valorContribuicaoMensal: reserva.valorContribuicaoMensal,
          contaId: reserva.conta?.id ?? reserva.contaId
        });
        this.loading = false;
      },
      error: (err) => {
        this.formBaseService.showError(this.formBaseService.handleError(err, 'Erro ao carregar dados da reserva.'));
        this.loading = false;
        this.router.navigate(['/reserva-emergencia']);
      }
    });
  }

  onSubmit(): void {
    if (this.reservaForm.invalid) {
      this.formBaseService.showError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.loading = true;
    const formData = this.reservaForm.value;

    if (this.isEditMode && this.reservaId) {
      // Modo de edição
      this.reservaService.updateReserva(this.reservaId, formData).subscribe({
        next: () => {
          this.formBaseService.showSuccess('Reserva atualizada com sucesso!');
          this.router.navigate(['/reserva-emergencia']);
        },
        error: (err) => {
          this.formBaseService.showError(this.formBaseService.handleError(err, 'Erro ao atualizar reserva.'));
          this.loading = false;
        }
      });
    } else {
      this.reservaService.createReserva(formData).subscribe({
        next: () => {
          this.formBaseService.showSuccess('Reserva criada com sucesso!');
          this.router.navigate(['/reserva-emergencia']);
        },
        error: (err) => {
          this.formBaseService.showError(this.formBaseService.handleError(err, 'Erro ao criar reserva.'));
          this.loading = false;
        }
      });
    }
  }

  calcularObjetivoAutomatico(): void {
    const multiplicador = this.reservaForm.get('multiplicadorDespesas')?.value;

    if (!multiplicador) {
      this.formBaseService.showError('Selecione um multiplicador de despesas primeiro.');
      return;
    }

    this.calculandoObjetivo = true;
    this.reservaService.calcularObjetivoAutomatico(multiplicador).subscribe({
      next: (valor) => {
        this.reservaForm.patchValue({ objetivo: valor });
        this.calculandoObjetivo = false;
      },
      error: (err) => {
        this.formBaseService.showError(this.formBaseService.handleError(err, 'Erro ao calcular objetivo.'));
        this.calculandoObjetivo = false;
      }
    });
  }

  simularTempoParaCompletar(): void {
    const objetivoCtrl = this.reservaForm.get('objetivo');
    const mensal = this.reservaForm.get('valorContribuicaoMensal');

    if (objetivoCtrl?.invalid || mensal?.invalid) {
      this.formBaseService.showError('Defina um objetivo e uma contribuição mensal válidos primeiro.');
      return;
    }

    const objetivo = objetivoCtrl?.value;
    const valorMensal = mensal?.value;
    const taxaRendimento = this.reservaForm.get('taxaRendimento')?.value ?? 0;

    if (valorMensal <= 0) {
      this.formBaseService.showError('A contribuição mensal deve ser maior que zero.');
      return;
    }

    const mesesSimples = Math.ceil(objetivo / valorMensal);

    const taxaMensal = (taxaRendimento / 100) / 12;
    let saldo = 0;
    let mesesComRendimento = 0;
    while (saldo < objetivo && mesesComRendimento < 1000) {
      saldo = saldo * (1 + taxaMensal) + valorMensal;
      mesesComRendimento++;
    }

    const fmt = (m: number) => `${m} meses (${Math.floor(m / 12)} anos e ${m % 12} meses)`;

    this.simulacaoResultado = {
      simples: fmt(mesesSimples),
      comRendimento: fmt(mesesComRendimento),
      taxa: taxaRendimento
    };
  }

  cancelar(): void {
    this.router.navigate(['/reserva-emergencia']);
  }

}
