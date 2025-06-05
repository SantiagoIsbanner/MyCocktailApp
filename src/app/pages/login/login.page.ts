import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastController, ModalController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {
    this.loginForm = new FormGroup({ // Inicializa el formulario reactivo
      email: new FormControl('', [Validators.required, Validators.email]), // Valida que el email sea requerido y tenga un formato correcto
      password: new FormControl('', [Validators.required, Validators.minLength(6)]) // Valida que la contraseña sea requerida y tenga al menos 6 caracteres
    });
  }

  async abrirModal() { // Método para abrir el modal
    const modal = await this.modalCtrl.create({ // Crea una instancia del modal
      component: ModalComponent // Especifica el componente que se mostrará en el modal
    });
    return await modal.present(); // Presenta el modal
  }

  login() {
    const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
    
    this.authService.login(email, password) // Llama al servicio de autenticación para iniciar sesión
      .then(() => { // Si la promesa se resuelve, muestra el toast de bienvenida y navega a la página de inicio
        this.toastWelcome('top');//muestra el toast de bienvenida
        this.router.navigate(['/home']); //navega a la página de inicio
      })
      .catch(error => this.toastError('top'));//muestra el toast de error
  }

  register() { // Método para registrar un nuevo usuario
    const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
    
    this.authService.register(email, password) // Llama al servicio de autenticación para registrar un nuevo usuario
      .then(() => {this.toastWelcome('top'); // Si la promesa se resuelve, muestra el toast de bienvenida
      })  
  
      .catch(error => this.toastError('top'));  // Si ocurre un error, muestra el toast de error
  }

  loginGoogle() { // Método para iniciar sesión con Google
    this.authService.loginWithGoogle() // Llama al servicio de autenticación para iniciar sesión con Google
      .then(() => {
        this.toastWelcome('top'); // Muestra el toast de bienvenida
        this.router.navigate(['/home']); // Navega a la página de inicio
      })
      .catch(error => this.toastError('top')); // Si ocurre un error, muestra el toast de error
    }

toastError(position: 'top' | 'middle' | 'bottom') {//Toast para mensaje de error
  this.toastController.create({
    message: 'Usuario o contraseña invalidos', // Mensaje de error genérico
    duration: 2500,
    position: position
    }).then((toast: any) => toast.present());
  }

  toastWelcome(position: 'top' | 'middle' | 'bottom') {//Toast para mensaje de bienvenida
    this.toastController.create({
      message: `Bienvenido ${this.loginForm.value.email} a la app de cocktails`,//evalua el email del usuario y lo usa para mostrar el msj de bienvenida con ese mail
      duration: 2500,
      position: position
      }).then((toast: any) => toast.present());
    }

  mostrarPassword = false;

  toggleMostrarContrasena() {  // Método para alternar la visibilidad de la contraseña
  // Cambia el estado de mostrarPassword al valor opuesto
    this.mostrarPassword = !this.mostrarPassword;
}

get logoSrc(): string { // Método para obtener la ruta de la imagen del logo según el tema actual
  // Obtiene el tema actual del body del documento
  const theme = document.body.getAttribute('data-theme') || 'light';
  return theme === 'dark' ? 'assets/logo-dark.png' : 'assets/logo-light.png'; // Retorna la ruta de la imagen del logo según el tema actual
}
}