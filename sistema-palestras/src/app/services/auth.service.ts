import { Injectable } from '@angular/core';

import { Usuario }
from '../models/usuario';

@Injectable({
    providedIn:'root'
})
export class AuthService {

    login(
        usuario:Usuario
    ):void {
        localStorage.setItem(
            'userData',
            JSON.stringify(usuario)
        );
    }

    logout():void {
        localStorage.removeItem(
            'userData'
        );
    }

    getUser():Usuario|null {
        const dados =
            localStorage.getItem(
                'userData'
            );

        if(!dados){
            return null;
        }

        return JSON.parse(
            dados
        );
    }

    getUserId():number {
        const user = this.getUser();
        return user?.id || 0;
    }    

    isLoggedIn():boolean {
        return !!localStorage.getItem(
            'userData'
        );
    }

    isAdmin():boolean {
        const usuario =
            this.getUser();
        return usuario?.admin || false;
    }

}