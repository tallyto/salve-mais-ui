import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Conta } from 'src/app/models/conta.model';
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
  contasDisponiveis: Conta[] = []; // Todas as contas disponíveis
  contasCorrentes: Conta[] = []; // Contas para transferência
  isEditMode = false;
  reservaId: number | null = null;
  loading = false;
  calculandoObjetivo = false;

  // Form para contribuição inicial
  contribuicaoForm: FormGroup;
  mostrarContribuicaoInicial = false;

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
      taxaRendimento: [13.25, [Validators.min(0), Validators.max(100)]] // Taxa Selic aproximada
    });

    this.contribuicaoForm = this.fb.group({
      contaOrigemId: [null, Validators.required],
      valorInicial: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loading = true;


    // Carrega as contas disponíveis
    this.contaService.getContas().subscribe({
      next: (contas) => {
        this.contas = contas;

        // Disponibiliza todas as contas
        this.contasDisponiveis = this.contas;

        // Todas as contas podem ser usadas para transferência
        this.contasCorrentes = this.contas;

        // Se não estiver em modo de edição e houver contas disponíveis, seleciona a primeira
        if (!this.isEditMode && this.contasDisponiveis.length > 0) {
          this.reservaForm.patchValue({
            contaId: this.contasDisponiveis[0].id
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
        this.snackBar.open('Erro ao carregar contas.', 'Fechar', { duration: 5000 });
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
          contaId: reserva.contaId
        });
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar dados da reserva.', 'Fechar', { duration: 5000 });
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
          console.error('Erro ao atualizar reserva:', err);
          this.snackBar.open('Erro ao atualizar reserva.', 'Fechar', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      // Modo de criação - verifica se há contribuição inicial
      if (this.mostrarContribuicaoInicial && this.contribuicaoForm.valid) {
        // Primeiro, cria a reserva
        this.reservaService.createReserva(formData).subscribe({
          next: (reservaCriada) => {
            const contribuicao = this.contribuicaoForm.value;

            // Depois, faz a transferência inicial
            this.reservaService.contribuirParaReserva(
              reservaCriada.id!,
              contribuicao.contaOrigemId,
              contribuicao.valorInicial
            ).subscribe({
              next: () => {
                this.snackBar.open('Reserva criada e contribuição inicial realizada com sucesso!', 'Fechar', { duration: 3000 });
                this.router.navigate(['/reserva-emergencia']);
              },
              error: (transferError) => {
                console.error('Erro ao fazer contribuição inicial:', transferError);
                this.snackBar.open('Reserva criada, mas houve erro na contribuição inicial.', 'Fechar', { duration: 5000 });
                this.router.navigate(['/reserva-emergencia']);
              }
            });
          },
          error: (createError) => {
            console.error('Erro ao criar reserva:', createError);
            this.snackBar.open('Erro ao criar reserva.', 'Fechar', { duration: 5000 });
            this.loading = false;
          }
        });
      } else {
        // Cria a reserva sem contribuição inicial
        this.reservaService.createReserva(formData).subscribe({
          next: () => {
            this.snackBar.open('Reserva criada com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/reserva-emergencia']);
          },
          error: (err) => {
            console.error('Erro ao criar reserva:', err);
            this.snackBar.open('Erro ao criar reserva.', 'Fechar', { duration: 5000 });
            this.loading = false;
          }
        });
      }
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
        this.snackBar.open('Erro ao calcular objetivo.', 'Fechar', { duration: 5000 });
        this.calculandoObjetivo = false;
      }
    });
  }

  simularTempoParaCompletar(): void {
    if (this.reservaForm.get('objetivo')?.invalid || this.reservaForm.get('valorContribuicaoMensal')?.invalid) {
      this.snackBar.open('Defina um objetivo e uma contribuição mensal válidos primeiro.', 'Fechar', { duration: 3000 });
      return;
    }

    const objetivo = this.reservaForm.get('objetivo')?.value;
    const valorMensal = this.reservaForm.get('valorContribuicaoMensal')?.value;
    const taxaRendimento = this.reservaForm.get('taxaRendimento')?.value;

    // Se o valorMensal for zero, exibe alerta
    if (valorMensal <= 0) {
      this.snackBar.open('A contribuição mensal deve ser maior que zero para calcular o tempo.', 'Fechar', { duration: 3000 });
      return;
    }

    // Calcula meses necessários (sem considerar rendimentos)
    const mesesSimples = Math.ceil(objetivo / valorMensal);

    // Calcula meses considerando rendimentos (simulação simplificada)
    const taxaMensal = (taxaRendimento / 100) / 12; // Taxa mensal equivalente
    let saldo = 0;
    let mesesComRendimento = 0;

    while (saldo < objetivo && mesesComRendimento < 1000) { // Limite de 1000 meses para evitar loop infinito
      saldo = saldo * (1 + taxaMensal) + valorMensal;
      mesesComRendimento++;
    }

    // Exibe resultado
    this.snackBar.open(
      `Tempo estimado para completar a reserva:
      Sem rendimentos: ${mesesSimples} meses (${Math.floor(mesesSimples/12)} anos e ${mesesSimples%12} meses)
      Com rendimentos de ${taxaRendimento}% a.a.: ${mesesComRendimento} meses (${Math.floor(mesesComRendimento/12)} anos e ${mesesComRendimento%12} meses)`,
      'Fechar',
      { duration: 10000 }
    );
  }

  toggleContribuicaoInicial(): void {
    this.mostrarContribuicaoInicial = !this.mostrarContribuicaoInicial;

    if (this.mostrarContribuicaoInicial) {
      // Define contribuição inicial padrão como 1/3 do objetivo
      const objetivo = this.reservaForm.get('objetivo')?.value;
      if (objetivo) {
        this.contribuicaoForm.patchValue({
          valorInicial: objetivo / 3
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/reserva-emergencia']);
  }
}
