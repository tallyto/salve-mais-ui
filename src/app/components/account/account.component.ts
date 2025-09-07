import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/services/account.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    standalone: false
})
export class AccountComponent {
  public accountForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar) {
      this.accountForm = this.formBuilder.group({
        id: [null],
        titular: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      })
    }

  createAccount() {
    if (this.accountForm.valid) {
      this.accountService.salvarAccount(this.accountForm.value).subscribe({
        next: value => {
          this.snackBar.open('Conta cadastrada com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          this.accountForm.reset();
          this.accountService.savedAccount.emit();
        },
        error: err => {
          this.snackBar.open('Erro ao cadastrar conta: ' + err.message, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      })
    }
  }

  resetForm() {
    this.accountForm.reset()
  }
}
