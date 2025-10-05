import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/services/account.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    standalone: false
})
export class AccountComponent {
  public accountForm: FormGroup;
  public isDialogMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<AccountComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.isDialogMode = data?.isDialogMode || false;
      this.accountForm = this.formBuilder.group({
        id: [null],
        titular: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      })
    }

  createAccount() {
    if (this.accountForm.valid) {
      this.accountService.salvarAccount(this.accountForm.value).subscribe({
        next: value => {
          const message = 'Conta cadastrada com sucesso!';

          if (this.isDialogMode) {
            this.dialogRef.close(value);
          } else {
            this.snackBar.open(message, 'Fechar', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
            this.accountForm.reset();
            this.accountService.savedAccount.emit();
          }
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

  fecharDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  resetForm() {
    this.accountForm.reset()
  }
}
