import {
 Component, 
 OnInit
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

import {
 AuthService
} from '../services/auth.service';

@Component({
 selector:'app-login',
 standalone:true,
 imports:[
   CommonModule,
   ReactiveFormsModule,
   RouterLink
 ],
 templateUrl:'./login.component.html'
})
export class LoginComponent {

 loginForm!:FormGroup;
 mensagem:string='';
 erro:boolean=false;

 constructor(
   private fb:FormBuilder,
   private api:ApiAuthService,
   private auth:AuthService,
   private router:Router
 ){

   this.loginForm=
   this.fb.group({

     email:[
       '',
       [
        Validators.required,
        Validators.email
       ]
     ],

     senha:[
       '',
       Validators.required
     ]
   });
 }

 entrar(){

   if(
     this.loginForm.invalid
   ){
     return;
   }

   this.api.login(
     this.loginForm.value
   )
   .subscribe({
     next:(response:any)=>{
       this.auth.login(
         response.userData
       );

       this.router.navigate(
         ['/home']
       );
     },

     error:(err)=>{
       this.erro=true;
       this.mensagem=
       err.error.message;
     }
   });
 }
}
