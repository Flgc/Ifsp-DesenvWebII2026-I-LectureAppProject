import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID  } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PalestraService } from '../services/palestra.service';
import { InscricaoService } from '../services/inscricao.service';
import { Palestra } from '../models/palestra';

@Component({ selector:'app-home', standalone:true, imports:[
   CommonModule,
   RouterLink
 ],
 templateUrl:'./home.component.html'
})

export class HomeComponent implements OnInit {
 palestras:Palestra[]=[];
 usuario:any;
 carregando=true;
 erroMensagem = ''

 constructor(
   private auth:AuthService,
   private palestraService:PalestraService,
   private inscricaoService:InscricaoService,
   private router:Router,
   private cdr: ChangeDetectorRef,
   @Inject(PLATFORM_ID) private platformId: object
 ){}

 ngOnInit():void{
    if (isPlatformBrowser(this.platformId)) {
        console.log('HOME INICIADA');    
        if(!this.auth.isLoggedIn()){    
          console.log('NAO LOGADO');    
          this.router.navigate(['/login']);
          return;
        }
        console.log('LOGADO');    
        this.usuario = this.auth.getUser();    
        console.log('USUARIO', this.usuario);
        this.carregarEventos();        
    }    
 }

 carregarEventos(){

    console.log('Iniciando carregamento');

   this.palestraService.listarPalestras().subscribe({
        next:(dados)=>{          
          
          console.log('DADOS RECEBIDOS', dados);

            this.palestras = dados;
            this.carregando = false;
            this.cdr.detectChanges();  // força a atualização da view
        },
        error:(erro)=>{
            
          console.error('ERRO NA REQUISIÇÃO:', erro);
            
            this.erroMensagem = 'Falha ao carregar eventos. Verifique o servidor.';
            this.carregando = false;
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

 excluirEvento(id:number){
   const confirma = confirm('Deseja excluir este evento?');
   
   if(!confirma){
     return;
   }

   this.palestraService.excluirEvento(id, true).subscribe({
     next:()=>{
        alert('Evento excluído com sucesso!');
        this.carregarEventos();  // recarrega a lista já está na home principal
     },
     error: (err) => {
        alert('Erro ao excluir evento.');
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