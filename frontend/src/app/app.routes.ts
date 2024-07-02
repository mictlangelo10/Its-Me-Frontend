import { PerfilComponent } from './pages/perfil/perfil.component';
import { Component } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: '', component: HomeComponent},
];
