import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  public accountForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService) {
      this.accountForm = this.formBuilder.group({
        id: [null],
        saldo: ['', Validators.required],
        titular: ['', Validators.required],
    })
    }

  createAccount() {
    this.accountService.salvarAccount(this.accountForm.value).subscribe({
      next: value => {
        alert("Conta cadastrada com sucesso!")
        this.accountForm.reset()
        this.accountService.savedAccount.emit()
      },
      error: err =>  {
        alert(err)
      }
    })

  }
}
