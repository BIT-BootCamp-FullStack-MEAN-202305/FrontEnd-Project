import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Category } from 'src/app/auth/interfaces/category.interface';
import { ProductsService } from 'src/app/services/products.service';

import { CategoriesService } from 'src/app/services/categories.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';


// Función de validación personalizada para el campo 'price'
function validatePrice( control: AbstractControl ) {
  const value = control.value;

  if (value < 0) {
    return { negativeValue: true };
  }
  return null;
}

// Función de validación personalizada para el campo 'quantity'
function validateQuantity( control: AbstractControl ) {
  const value = control.value;

  if (value <= 0) {
    return { invalidQuantity: true };
  }
  return null;
}

/*** Función de validación personalizada para el campo 'urlImage' ***/

// Función para validar una URL normal
function validateNormalUrl( control: AbstractControl ): { [key: string]: any } | null {
  const value = control.value;

  console.log( 'Valor proporcionado:', value );       // Imprime el valor en la consola

  // Verificar si el valor es un objeto de tipo File
  if ( value instanceof File ) {
    const imageType = value.type.split('/')[ 0 ];     // Obtener el tipo de imagen a partir del objeto File

    // Verificar si el tipo de archivo no es una imagen
    if ( imageType !== 'image' ) {
      return { invalidUrl: true };
    }
  }

  return null;    // Devolver nulo si no se encuentran errores de validación
}

// Función para validar una imagen codificada en base64
function validateBase64Image(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  const base64Pattern = /^data:image\/(jpeg|png|jpg|gif|svg\+xml);base64,([^\"]*)$/;

  console.log( 'Valor proporcionado:', value );       // Imprime el valor en la consola

  // Verificar si el valor es una cadena y si cumple con el patrón de imagen en base64
  if ( typeof value === 'string' && !base64Pattern.test( value ) ) {
    return { invalidBase64Image: true };
  }

  return null;    // Devolver nulo si no se encuentran errores de validación
}

// Función de validación personalizada para el campo 'description'
function validateDescription( control: AbstractControl ): { [key: string]: boolean } | null {
  const value = control.value;

  if ( value && (value.length < 3 || value.length > 140 ) ) {
    return { invalidDescriptionLength: true };
  }
  return null;
}


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  // Atributos
  categories!: Array<any>;
  preview!: string;
  percentDone: any = 0;
  users = [];

  // Procuramos usar los mismos nombres que espera nuestra API en las propiedades que agrupamos en nuestro FormBuilder Group
  productForm: FormGroup = this.fb.group({
    name: [
      '',   // Valor por defecto
      [
        Validators.required,
        Validators.minLength( 3 )
      ]
    ],
    price: [
      '',   // Valor por defecto
      [
        Validators.required,
        validatePrice
      ]
    ],
    quantity: [
      '',   // Valor por defecto
      [
        Validators.required,
        validateQuantity
      ]
    ],
    category: [
      '',  // Valor por defecto
      []
    ],
    description: [
      '',  // Valor por defecto
      []
    ],
    urlImage: [
      null,
      [
        validateNormalUrl,
        validateBase64Image
      ]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private router: Router,
    private categoriesService: CategoriesService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  updateFile( event: any ) {
    const file = (event.target).files[ 0 ];

    this.productForm.patchValue({
      urlImage: file
    });

    this.productForm.get( 'urlImage' )?.updateValueAndValidity();

    /*** Leer el path del archivo para mostrar el preview */
    const reader = new FileReader();

    reader.onload = () => {
      this.preview = reader.result as string;
    };

    reader.readAsDataURL( file );
  }

  createProduct() {
    console.group( 'productForm' );
    console.log( this.productForm.value );
    console.log( this.productForm.valid );
    console.groupEnd();

    this.productService.createProduct( this.productForm.value )
      .subscribe( ( response ) => {
        console.log( response );
      });

    this.productForm.reset();

    setTimeout( () => {
      this.router.navigate( [ 'dashboard', 'products' ] );
    }, 1000 );
  }

  create2Product() {
    console.log( this.productForm.value )

    this.productService.create2Product(
      this.productForm
    ).subscribe( ( event: HttpEvent<any> ) => {
      switch( event.type ) {
        case HttpEventType.Sent:
          console.log( 'Peticion realizada!' );
          break;
        case HttpEventType.ResponseHeader:
          console.log( 'La respuesta del \'header\' ha sido recibido!' );
          break;
        case HttpEventType.UploadProgress:
          // this.percentDone = Math.round( event.loaded / event.total * 100 );
          // console.log( `Actualizado ${ this.percentDone }%` );
          console.log( `Actualizo` );
          break;
        case HttpEventType.Response:
          console.log( 'El producto ha sido creado exitosamente!', event.body );
          this.percentDone = false;
          this.router.navigate( [ 'dashboard', 'products' ] );
      }
    });

  }


  loadCategories() {
    this.categoriesService.getCategories()
      .subscribe( categories => {
        this.categories = categories;
      });
  }

}
