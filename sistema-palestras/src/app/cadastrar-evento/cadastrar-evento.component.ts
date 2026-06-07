import {
 Component
} from '@angular/core';

import {
 CommonModule
} from '@angular/common';

import {
 ReactiveFormsModule,
 FormBuilder,
 Validators,
 FormGroup
} from '@angular/forms';

import {
 Router
} from '@angular/router';

import {
 PalestraService
} from '../services/palestra.service';

@Component({
 selector:'app-cadastrar-evento',
 standalone:true,
 imports:[
   CommonModule,
   ReactiveFormsModule
 ],
 templateUrl:
 './cadastrar-evento.component.html'
})
export class CadastrarEventoComponent {
 mensagem='';
 erro=false;
 //form=this.fb.group({
 form!: FormGroup; // Usando definite assignment assertion

 constructor(
   private fb:FormBuilder,
   private palestraService:PalestraService,
   private router:Router
 ){
    // Inicialização movida para o construtor
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descricao: ['', [Validators.required, Validators.minLength(20)]],
      nomePalestrante: ['', Validators.required],
      localEvento: ['', Validators.required],
      dataEvento: ['', Validators.required]
    });    
 }

 salvar(){
   if(
    this.form.invalid
   ){
     return;
   }

   const data =
   new Date(
    this.form.value.dataEvento!
   );

   if(
    data <= new Date()
   ){
     this.erro=true;
     this.mensagem=
     'A data deve ser futura';
     return;
   }

   const dados = {
    ...this.form.value,
    admin:true
   };

   this.palestraService
   .cadastrarEvento(
     dados
   )
   .subscribe({
     next:()=>{
       alert(
        'Evento cadastrado'
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