import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Product } from '../protected/interfaces/product.interface';
import { Products } from '../auth/interfaces/products.interface';
import { ProductResponse } from '../protected/interfaces/product-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  /** Atributos */
  BASE_URL: string = environment.baseUrl;
  token!: string;
  headers!: HttpHeaders;


  constructor(
    private http: HttpClient
  ) {
    const token = localStorage.getItem( 'token' );    // Obtiene el Token del LocalStorage
    this.token = token ? token : '';                  // Verifica si existe el token en el LocalStorage
    this.headers = new HttpHeaders().set( 'X-Token', `${ this.token }` );
    // console.log( this.token );
  }

  /** Realiza petición al endpoint del BackEnd que registra productos */
  createProduct( product: Product ) {

    return this.http.post(
      `${ this.BASE_URL }/products`,      // URL del BackEnd al que debemos hacer la peticion
      product,                            // Objeto de producto a crear
      { headers: this.headers }           // Cabeceras con información requerida
    );
  }

  create2Product( productForm: any ) : Observable<any> {
    const formData = new FormData();
    // formData.append('file', this.uploadForm.get('profile').value);

    formData.append( 'name', productForm.get( 'name' ).value );
    formData.append( 'price', productForm.get( 'price' ).value );
    formData.append( 'description', productForm.get( 'description' ).value );
    formData.append( 'quantity', productForm.get( 'quantity' ).value  );
    formData.append( 'category', productForm.get( 'category' ).value );
    formData.append( 'urlImage', productForm.get( 'urlImage' ).value  );

    console.log( '<<<<<<', formData );

    return this.http.post<Product>(
      `${ this.BASE_URL }/products`,      // URL del BackEnd al que debemos hacer la peticion
      formData,                            // Objeto de producto a crear
      {                                   // Cabeceras con información requerida
        headers: this.headers,
        reportProgress: false,
        observe: 'events'
      }
    );
  }

  errorMgmt( error: HttpErrorResponse ) {
    let errorMessage = '';

    if( error.error instanceof ErrorEvent ) {
      errorMessage = error.error.message;
    }
    else {
      errorMessage = `Error Code ${ error.status }\nMessage: ${ error.message }`;
    }

    console.log( errorMessage );

    return throwError( () => {
      return errorMessage;
    });

  }

  getProducts() {
    return this.http.get<Products>(
      `${ this.BASE_URL }/products/`,   // URL del BackEnd al que debemos hacer la peticion
    );
  }

  getProductsByUser( userId: string ) {

    return this.http.get<Products>(
      `${ this.BASE_URL }/products/`,   // URL del BackEnd al que debemos hacer la peticion
      { headers: this.headers }                         // Cabeceras con información requerida
    )
    .pipe(
      tap( response => {
        console.log( response );
      }),
      map( response => response[ 'products' ] )
    );
  }

  getProductById( productId: string ) {

    return this.http.get<ProductResponse>(
      `${ this.BASE_URL }/products/${ productId }`,   // URL del BackEnd al que debemos hacer la peticion
      { headers: this.headers }                         // Cabeceras con información requerida
    ).pipe(
      tap( ( console.log ) ),
      map( response => response.product )
    );
  }

  deleteProduct( userId: string | undefined ) {

    return this.http.delete<Product>(
      `${ this.BASE_URL }/products/${ userId }`,   // URL del BackEnd al que debemos hacer la peticion
      { headers: this.headers }                         // Cabeceras con información requerida
    );
  }

  updateProduct( productId: string, product: Product ) {

    return this.http.patch(
      `${ this.BASE_URL }/products/${ productId }`,   // URL del BackEnd al que debemos hacer la peticion
      product,
      { headers: this.headers }                         // Cabeceras con información requerida
    );
  }

}
