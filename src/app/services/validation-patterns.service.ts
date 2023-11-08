import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationPatternsService {

  public pass: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  public email: RegExp = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

  constructor() { }
}
