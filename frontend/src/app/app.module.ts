import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';
import { ListaComponent } from './pages/plantilla/lista/lista.component';
import { ListacomparativaComponent } from './pages/plantilla/listacomparativa/listacomparativa.component';
import { ImagenComponent } from './pages/plantilla/imagen/imagen.component';

import { ModalComponent } from './pages/modal/modal.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { AuthGuard } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ListaComponent,
    ListacomparativaComponent,
    ImagenComponent,
    ModalComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Configurar la posición del toast
    }),
    SweetAlert2Module.forRoot(), // Configuración de SweetAlert2
    FormsModule,
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard, // Agrega el guardián aquí
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
