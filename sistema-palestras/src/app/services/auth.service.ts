import { Injectable, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Usuario } from '../models/usuario';

@Injectable({ providedIn:'root' })
export class AuthService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: object) {
      this.isBrowser = isPlatformBrowser(platformId);
    }
    
    login( usuario:Usuario ):void {
        if (this.isBrowser) {
            localStorage.setItem('userData', JSON.stringify(usuario));
        }        
    }

    logout(): void {
        if (this.isBrowser) {
        localStorage.removeItem('userData');
        }
    }

    getUser(): Usuario | null {
        if (!this.isBrowser) return null;
        const dados = localStorage.getItem('userData');
        return dados ? JSON.parse(dados) : null;
    }

    isLoggedIn(): boolean {
        if (!this.isBrowser) return false;
        return !!localStorage.getItem('userData');
    }

    isAdmin(): boolean {
        const usuario = this.getUser();
        return usuario?.admin || false;
    }    

    getUserId():number {
        const user = this.getUser();
        return user?.id || 0;
    }    
}