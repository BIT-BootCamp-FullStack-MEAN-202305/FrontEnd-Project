import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  patternPassword: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
  patternEmail: RegExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

  // Procuramos usar los mismos nombres que espera nuestra API en las propiedades que agrupamos en nuestro FormBuilder Group
  loginForm: FormGroup = this.fb.group({
    email: [
      '',   // Valor por defecto vacio
      [
        Validators.required,
        Validators.pattern( this.patternEmail )
      ]
    ],
    password: [
      '', // Valor por defecto vacio
      [
        Validators.required,
        Validators.pattern( this.patternPassword )
      ]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    // console.group( 'loginForm' );
    // console.log( this.loginForm.value );
    // console.log( this.loginForm.valid );
    // console.groupEnd();

    // this.authService.validateToken().subscribe( console.log );   // Solo para probar

    const { email, password } = this.loginForm.value;

    this.authService.login( email, password )
      .subscribe( ( value ) => {

        /** Si el login es valido. Es un valor booleano true */
        if( value === true ) {
          // this.router.navigate([ 'dashboard' ]);
          this.router.navigateByUrl( '/dashboard' );
        }
        else {
          console.log( value );
          const { msg } = value as { ok: boolean, msg: string };

          // Si el login no es valido. Es un string que trae el mensaje de error del BackEnd
          Swal.fire(
            'Error',
            msg,
            'error'
          );
        }
      });
  }

}
