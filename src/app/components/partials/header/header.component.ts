import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /** Getters */
  get user() {
    // TODO: NO Extrae los valores del usuario que vamos a ocupar, ni los hace persistentes mientras que el usuario esta logueado
    return this.authService.user;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl( '/' );
  }

}
