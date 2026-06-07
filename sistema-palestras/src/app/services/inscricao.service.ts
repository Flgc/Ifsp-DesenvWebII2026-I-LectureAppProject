import {
 Injectable
}
from '@angular/core';

import {
 HttpClient
}
from '@angular/common/http';

@Injectable({
 providedIn:'root'
})
export class InscricaoService {

 private apiUrl =
 "http://localhost:3000/api";

 constructor(
   private http:HttpClient
 ){}

 participar(
   idUsuario:number,
   idPalestra:number
 ){

   return this.http.post(
     `${this.apiUrl}/inscricao`,
     {
       idUsuario,
       idPalestra
     }
   );
 }

 cancelar(
   idUsuario:number,
   idPalestra:number
 ){

   return this.http.delete(
    `${this.apiUrl}/inscricao/${idUsuario}/${idPalestra}`
   );
 }

 minhasInscricoes(
   idUsuario:number
 ){

   return this.http.get(
    `${this.apiUrl}/inscricoes/${idUsuario}`
   );
 }

}