import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  private apiUrl =
    'http://localhost:3000/api';

  constructor(
    private http: HttpClient
  ) {}

  cadastrar(dados:any) {

    return this.http.post(
      `${this.apiUrl}/cadastro`,
      dados
    );
  }

  login(dados:any) {

    return this.http.post(
      `${this.apiUrl}/login`,
      dados
    );
  }
}