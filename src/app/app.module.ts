import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat'; // Módulo de Firebase (versión compat)
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Módulo para autenticación con Firebase
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Módulo para manejo de Firestore

import { environment } from '../environments/environment'; // Importación de la configuración de Firebase
import { HttpClientModule } from '@angular/common/http'; // Cliente HTTP para realizar peticiones a APIs externas
import { AppRoutingModule } from './app-routing.module'; // Módulo de rutas de la aplicación
import { LoginPageModule } from './pages/login/login.module'; // Módulo específico de la página de login

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Módulos para formularios reactivos y tradicionales

// Firebase SDK (modular)
import { provideAuth, getAuth } from '@angular/fire/auth'; // Manejo de autenticación con Firebase
import { initializeApp } from 'firebase/app'; // Inicialización de la aplicación de Firebase
import { getFirestore } from 'firebase/firestore'; // Obtención de la instancia de Firestore

// AngularFire modular
import { provideFirebaseApp } from '@angular/fire/app'; // Configuración modular de Firebase
import { provideFirestore } from '@angular/fire/firestore'; // Configuración modular de Firestore

import { HttpClient } from '@angular/common/http'; // Cliente HTTP
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; // Loader para la internacionalización con ngx-translate

/**
 * Factory para cargar archivos de traducción desde la carpeta assets/i18n/.
 * Se usa con ngx-translate para gestionar múltiples idiomas en la aplicación.
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent], // Declaración del componente raíz de la aplicación
  imports: [
    BrowserModule, // Módulo principal para aplicaciones web en Angular
    IonicModule.forRoot(), // Configuración de Ionic
    AppRoutingModule, // Módulo de rutas de la aplicación
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicialización de Firebase con las credenciales
    AngularFireAuthModule, // Módulo de autenticación con Firebase
    HttpClientModule, // Módulo para realizar solicitudes HTTP
    LoginPageModule, // Módulo de la página de inicio de sesión
    AngularFirestoreModule, // Módulo de Firestore para base de datos en Firebase
    FormsModule, // Módulo para formularios basados en template
    ReactiveFormsModule, // Módulo para formularios reactivos
  ],
  
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Estrategia para reutilización de rutas en Ionic
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Inicialización modular de Firebase
    provideFirestore(() => getFirestore()), // Inicialización modular de Firestore
    provideAuth(() => getAuth()), // Inicialización modular de autenticación con Firebase
  ],

  bootstrap: [AppComponent], // Punto de entrada de la aplicación
})
export class AppModule {}
