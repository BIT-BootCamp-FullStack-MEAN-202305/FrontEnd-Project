import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'
import { ValidationPatternsService } from 'src/app/services/validation-patterns.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Procuramos usar los mismos nombres que espera nuestra API en las propiedades que agrupamos en nuestro FormBuilder Group
  loginForm: FormGroup = this.fb.group({
    email: [
      '',   // Valor por defecto vacio
      [
        Validators.required,
        Validators.pattern( this.validation.email )
      ]
    ],
    password: [
      '', // Valor por defecto vacio
      [
        Validators.required,
        Validators.pattern( this.validation.pass )
      ]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private validation: ValidationPatternsService
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
