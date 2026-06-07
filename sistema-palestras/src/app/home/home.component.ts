import {
 Component,
 OnInit
} from '@angular/core';

import {
 CommonModule
} from '@angular/common';

import {
 Router,
 RouterLink
} from '@angular/router';

import {
 AuthService
} from '../services/auth.service';

import {
 PalestraService
} from '../services/palestra.service';

import {
 InscricaoService
} from '../services/inscricao.service';

import {
 Palestra
} from '../models/palestra';

@Component({
 selector:'app-home',
 standalone:true,
 imports:[
   CommonModule,
   RouterLink
 ],
 templateUrl:'./home.component.html'
})
export class HomeComponent
implements OnInit {
 palestras:Palestra[]=[];
 usuario:any;
 carregando=true;

 constructor(
   private auth:AuthService,
   private palestraService:PalestraService,
   private inscricaoService:InscricaoService,
   private router:Router
 ){}

 ngOnInit():void{
    if(
      !this.auth.isLoggedIn()
    ){
      this.router.navigate(
        ['/login']
    );
      return;
    }  
  this.usuario =
  this.auth.getUser();
  this.carregarEventos();
 }

 carregarEventos(){
   this.palestraService
   .listarPalestras()
   .subscribe({
     next:(dados)=>{
       this.palestras=dados;
       this.carregando=false;
     },

     error:()=>{
       this.carregando=false;
     }
   });
 }

 participar(
   idPalestra:number
 ){
   this.inscricaoService
   .participar(
     this.usuario.id,
     idPalestra
   )
   .subscribe({
     next:()=>{
       alert(
        'Inscrição realizada!'
       );
       this.carregarEventos();
     },
     error:(erro)=>{
       alert(
        erro.error.message
       );
     }
   });
 }

 cancelar(
   idPalestra:number
 ){
   this.inscricaoService
   .cancelar(
     this.usuario.id,
     idPalestra
   )
   .subscribe({
     next:()=>{
       alert(
         'Inscrição cancelada'
       );
       this.carregarEventos();
     }
   });
 }

 editarEvento(
   id:number
 ){
   this.router.navigate(
     ['/editar',id]
   );
 }

 excluirEvento(
   id:number
 ){
   const confirma =
   confirm(
    'Deseja excluir?'
   );
   
   if(!confirma){
     return;
   }

   this.palestraService
   .excluirEvento(
      id,
      true
   )
   .subscribe({
     next:()=>{
       this.carregarEventos();
     }
   });
 }

 logout(){
   this.auth.logout();
   this.router.navigate(
     ['/login']
   );
 }

 isAdmin(){
   return this.auth.isAdmin();
 }
}