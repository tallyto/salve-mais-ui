import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Conta, TipoConta } from 'src/app/models/conta.model';
import { ContaService } from 'src/app/services/conta.service';
import { ReservaEmergenciaService } from '../../services/reserva-emergencia.service';

@Component({
  selector: 'app-reserva-emergencia-form',
  templateUrl: './reserva-emergencia-form.component.html',
  styleUrls: ['./reserva-emergencia-form.component.css'],
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
    private snackBar: MatSnackBar
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
        this.snackBar.open(this.errMsg(err, 'Erro ao carregar contas.'), 'Fechar', { duration: 5000 });
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
        this.snackBar.open(this.errMsg(err, 'Erro ao carregar dados da reserva.'), 'Fechar', { duration: 5000 });
        this.loading = false;
        this.router.navigate(['/reserva-emergencia']);
      }
    });
  }

  onSubmit(): void {
    if (this.reservaForm.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos corretamente.', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading = true;
    const formData = this.reservaForm.value;

    if (this.isEditMode && this.reservaId) {
      // Modo de edição
      this.reservaService.updateReserva(this.reservaId, formData).subscribe({
        next: () => {
          this.snackBar.open('Reserva atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/reserva-emergencia']);
        },
        error: (err) => {
          this.snackBar.open(this.errMsg(err, 'Erro ao atualizar reserva.'), 'Fechar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      this.reservaService.createReserva(formData).subscribe({
        next: () => {
          this.snackBar.open('Reserva criada com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/reserva-emergencia']);
        },
        error: (err) => {
          this.snackBar.open(this.errMsg(err, 'Erro ao criar reserva.'), 'Fechar', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }

  calcularObjetivoAutomatico(): void {
    const multiplicador = this.reservaForm.get('multiplicadorDespesas')?.value;

    if (!multiplicador) {
      this.snackBar.open('Selecione um multiplicador de despesas primeiro.', 'Fechar', { duration: 3000 });
      return;
    }

    this.calculandoObjetivo = true;
    this.reservaService.calcularObjetivoAutomatico(multiplicador).subscribe({
      next: (valor) => {
        this.reservaForm.patchValue({ objetivo: valor });
        this.calculandoObjetivo = false;
      },
      error: (err) => {
        this.snackBar.open(this.errMsg(err, 'Erro ao calcular objetivo.'), 'Fechar', { duration: 5000 });
        this.calculandoObjetivo = false;
      }
    });
  }

  simularTempoParaCompletar(): void {
    const objetivoCtrl = this.reservaForm.get('objetivo');
    const mensal = this.reservaForm.get('valorContribuicaoMensal');

    if (objetivoCtrl?.invalid || mensal?.invalid) {
      this.snackBar.open('Defina um objetivo e uma contribuição mensal válidos primeiro.', 'Fechar', { duration: 3000 });
      return;
    }

    const objetivo = objetivoCtrl?.value;
    const valorMensal = mensal?.value;
    const taxaRendimento = this.reservaForm.get('taxaRendimento')?.value ?? 0;

    if (valorMensal <= 0) {
      this.snackBar.open('A contribuição mensal deve ser maior que zero.', 'Fechar', { duration: 3000 });
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

  private errMsg(err: any, fallback: string): string {
    return err?.error?.message ?? fallback;
  }
}
