import {
    Injectable
}
from '@angular/core';

import {
    HttpClient
}
from '@angular/common/http';

import {
    Observable
}
from 'rxjs';

import {
    Palestra
}
from '../models/palestra';

@Injectable({
    providedIn:'root'
})
export class PalestraService {

    private apiUrl =
    "http://localhost:3000/api";

    constructor(
        private http:HttpClient
    ){}

    listarPalestras()
    :Observable<Palestra[]>{
        return this.http.get<Palestra[]>(
            `${this.apiUrl}/palestras`
        );
    }

    cadastrarEvento(
        dados:any
    ){
        return this.http.post(
            `${this.apiUrl}/admin`,
            dados
        );
    }

    atualizarEvento(
        id:number,
        dados:any
    ){
        return this.http.put(
            `${this.apiUrl}/eventos/${id}`,
            dados
        );
    }

    excluirEvento(
        id:number,
        admin:boolean
    ){
        return this.http.delete(
            `${this.apiUrl}/eventos/${id}`,
            {
                body:{admin}
            }
        );
    }

    buscarPorId(
        id:number
    ){
        return this.http.get(
            `${this.apiUrl}/eventos/${id}`
        );
    }    
}