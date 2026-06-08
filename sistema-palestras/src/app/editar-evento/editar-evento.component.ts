import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PalestraService } from '../services/palestra.service';

@Component({
 selector:'app-editar-evento',
 standalone:true,
 imports:[
   CommonModule,
   ReactiveFormsModule,
   RouterLink
 ],
 templateUrl:
 './editar-evento.component.html'
})
export class EditarEventoComponent implements OnInit {
 eventoForm!: FormGroup;
 eventoId!: number;
 carregando = true;
 mensagemErro = '';  
 
 constructor(
   private route:ActivatedRoute,
   private fb:FormBuilder,   
   private router:Router,
   private palestraService:PalestraService,
   private cdr: ChangeDetectorRef
 ){}

    ngOnInit(): void {
      this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
      this.inicializarForm();
      this.carregarEvento();        
    }

   inicializarForm(): void {
      this.eventoForm = this.fb.group({
        titulo: ['', Validators.required],
        descricao: ['', Validators.required],
        nomePalestrante: ['', Validators.required],
        localEvento: ['', Validators.required],
        dataEvento: ['', Validators.required]
      });   
   }

  carregarEvento(): void {
    console.log('Buscando evento ID:', this.eventoId);
    this.palestraService.buscarPorId(this.eventoId).subscribe({
      next: (evento: any) => {
        console.log('Evento recebido para edição:', evento);  

        // Ajusta a data para o formato aceito pelo input datetime-local
        let dataFormatada = '';
        if (evento.dataEvento) {
          const data = new Date(evento.dataEvento);
          if (!isNaN(data.getTime())) {
            dataFormatada = data.toISOString().slice(0, 16);
          } 
        }               
        
        this.eventoForm.patchValue({
          titulo: evento.titulo || '',
          descricao: evento.descricao || '',
          nomePalestrante: evento.nomePalestrante || '',
          localEvento: evento.localEvento || '',
          dataEvento: dataFormatada
        });

        this.carregando = false;
        this.cdr.detectChanges();   
        console.log('carregando agora é:', this.carregando);
      },
      error: (err) => {
        console.error('Erro ao buscar evento:', err);
        this.mensagemErro = 'Erro ao carregar evento. Verifique o backend.';
        this.carregando = false;
        this.cdr.detectChanges();
        console.log('carregando agora é:', this.carregando);
      }
    });
  }   

  atualizar(): void {
    if (this.eventoForm.invalid) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    // Obtém a data do formulário (formato ISO local: "YYYY-MM-DDTHH:MM")
    const dataLocal = this.eventoForm.value.dataEvento; // exemplo: "2026-07-22T20:00"

    // Converte para o formato esperado pelo backend: "YYYY-MM-DD HH:MM:SS"
    const dataFormatada = dataLocal.replace('T', ' ') + ':00';

    // Prepara os dados com admin e data no formato ajustado para o backend
    const dados = {
      titulo: this.eventoForm.value.titulo,
      descricao: this.eventoForm.value.descricao,
      nomePalestrante: this.eventoForm.value.nomePalestrante,
      localEvento: this.eventoForm.value.localEvento,
      dataEvento: dataFormatada,
      admin: true
    };    

    this.palestraService.atualizarEvento(this.eventoId, dados).subscribe({      
      next: () => {
        alert('Evento atualizado com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao atualizar:', err);
        this.mensagemErro = err.error?.message || 'Erro ao atualizar evento.';
      }
    });
  }
}