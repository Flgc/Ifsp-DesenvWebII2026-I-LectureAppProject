import {
 Component,
 OnInit
} from '@angular/core';

import {
 CommonModule
} from '@angular/common';

import {
 ActivatedRoute,
 Router
} from '@angular/router';

import {
 ReactiveFormsModule,
 FormBuilder,
 Validators,
 FormGroup
} from '@angular/forms';

import {
 PalestraService
} from '../services/palestra.service';

@Component({
 selector:'app-editar-evento',
 standalone:true,
 imports:[
   CommonModule,
   ReactiveFormsModule
 ],
 templateUrl:
 './editar-evento.component.html'
})
export class EditarEventoComponent
implements OnInit {
 id=0;
 //form=this.fb.group({
 form!: FormGroup; // Usando definite assignment assertion

 constructor(
   private route:ActivatedRoute,
   private fb:FormBuilder,
   private service:PalestraService,
   private router:Router
 ){
    // Inicialização movida para o construtor
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      nomePalestrante: ['', Validators.required],
      localEvento: ['', Validators.required],
      dataEvento: ['', Validators.required]
    });    
 }

 ngOnInit():void{
   this.id = Number(
    this.route.snapshot.paramMap.get('id')
   );
   this.carregar();
 }

 carregar(){
   this.service
   .buscarPorId(
     this.id
   )
   .subscribe((evento:any)=>{
     this.form.patchValue({
      titulo:evento.titulo,
      descricao:evento.descricao,
      nomePalestrante:evento.nomePalestrante,
      localEvento:evento.localEvento,
      dataEvento:evento.dataEvento
     });
   });
 }

 atualizar(){
   const dados = {
     ...this.form.value,
     admin:true
   };

   this.service.atualizarEvento(
     this.id,
     dados
   ).subscribe(()=>{
     alert(
      'Atualizado'
     );

     this.router.navigate(
      ['/home']
     );
   });
 }
}