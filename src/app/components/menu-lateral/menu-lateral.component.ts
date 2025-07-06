import {Component, OnInit, ViewChild, OnDestroy, AfterViewInit, HostListener} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Router, NavigationEnd} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Subscription, filter} from 'rxjs';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public username: string = 'Usuário';
  public userEmail: string = 'usuario@email.com';
  public appVersion: string = '1.3.5';
  public isAuthenticated: boolean = false;
  public isLargeScreen: boolean = false;

  private routerSubscription: Subscription | null = null;

  constructor(private router: Router, private authService: AuthService) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Verificar se o usuário está autenticado
    this.checkAuthentication();

    // Verificar autenticação a cada mudança de rota
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthentication();
      });

    // Tentar obter informações do usuário do localStorage (se disponível)
    this.updateUserInfo();
  }

  ngAfterViewInit(): void {
    // Abrir o menu lateral por padrão em telas maiores apenas se autenticado
    // Movido para AfterViewInit para garantir que sidenav está disponível
    setTimeout(() => {
      if (window.innerWidth > 768 && this.isAuthenticated && this.sidenav) {
        this.sidenav.open();
      }
    });
  }

  ngOnDestroy(): void {
    // Limpar a inscrição quando o componente for destruído
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = null;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isLargeScreen = window.innerWidth > 768;

    // Ajustar o modo do sidenav com base no tamanho da tela
    if (this.sidenav) {
      // Em telas pequenas, usar o modo 'over'
      // Em telas grandes, usar o modo 'side'
      this.sidenav.mode = this.isLargeScreen ? 'side' : 'over';

      // Abrir sidenav por padrão em telas grandes se autenticado
      if (this.isLargeScreen && this.isAuthenticated) {
        this.sidenav.open();
      } else if (!this.isLargeScreen) {
        this.sidenav.close();
      }
    }
  }

  private checkAuthentication(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;

    // Se o usuário estiver autenticado, atualizar as informações do usuário
    if (this.isAuthenticated) {
      this.updateUserInfo();
    }
  }

  private updateUserInfo(): void {
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

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
