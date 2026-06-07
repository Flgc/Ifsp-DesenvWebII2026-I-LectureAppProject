import { Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import {  LoginComponent } from './login/login.component';
import {  HomeComponent } from './home/home.component';
import {  CadastrarEventoComponent } from './cadastrar-evento/cadastrar-evento.component';
import {  EditarEventoComponent } from './editar-evento/editar-evento.component';
import {  adminGuard } from './guards/admin.guard';

export const routes: Routes = [
 {
  path:'',
  redirectTo:'login',
  pathMatch:'full'
 },

 {
  path:'login',
  component:LoginComponent
 },

 {
  path:'cadastro',
  component:CadastroComponent
 },

 {
  path:'home',
  component:HomeComponent
 },

 {
  path:'admin',
  component:
    CadastrarEventoComponent,
  canActivate:[
    adminGuard
  ]
 },

 {
  path:'editar/:id',
  component:
    EditarEventoComponent,
  canActivate:[
    adminGuard
  ]
 }
];