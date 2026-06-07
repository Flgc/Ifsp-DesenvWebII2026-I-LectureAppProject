import {
 Component
} from '@angular/core';

import {
 FormBuilder,
 FormGroup,
 Validators,
 ReactiveFormsModule
} from '@angular/forms';

import {
 Router,
 RouterLink
} from '@angular/router';

import {
 CommonModule
} from '@angular/common';

import {
 ApiAuthService
} from '../services/api-auth.service';

@Component({
 selector:'app-cadastro',
 standalone:true,
 imports:[
   CommonModule,
   ReactiveFormsModule,
   RouterLink
 ],
 templateUrl:'./cadastro.component.html'
})
export class CadastroComponent {

 cadastroForm!:FormGroup;

 mensagem:string='';

 erro:boolean=false;

 constructor(
   private fb:FormBuilder,
   private api:ApiAuthService,
   private router:Router
 ){

   this.cadastroForm =
     this.fb.group({

       nome:[
         '',
         [
          Validators.required,
          Validators.minLength(3)
         ]
       ],

       email:[
         '',
         [
          Validators.required,
          Validators.email
         ]
       ],

       senha:[
         '',
         [
          Validators.required,
          Validators.minLength(8)
         ]
       ]
     });
 }

 cadastrar(){

   if(
     this.cadastroForm.invalid
   ){
     return;
   }

   this.api
   .cadastrar(
     this.cadastroForm.value
   )
   .subscribe({

     next:()=>{

       this.erro=false;

       this.mensagem=
       'Cadastro realizado com sucesso';

       setTimeout(()=>{

         this.router.navigate(
           ['/login']
         );

       },1500);
     },

     error:(err)=>{

       this.erro=true;

       this.mensagem=
       err.error.message;
     }
   });
 }
}