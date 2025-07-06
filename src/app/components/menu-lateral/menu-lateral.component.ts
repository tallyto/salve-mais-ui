import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public username: string = 'Usuário';
  public userEmail: string = 'usuario@email.com';
  public appVersion: string = '1.3.5';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Abrir o menu lateral por padrão em telas maiores
    setTimeout(() => {
      if (window.innerWidth > 768) {
        this.sidenav.open();
      }
    });

    // Tentar obter informações do usuário do localStorage (se disponível)
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        if (parsedInfo.name) this.username = parsedInfo.name;
        if (parsedInfo.email) this.userEmail = parsedInfo.email;
      } catch (e) {
        console.error('Erro ao processar informações do usuário', e);
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    this.router.navigate(['/login']);
  }
}
