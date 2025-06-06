import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Servicio de autenticación
import { FormControl, FormGroup, Validators } from '@angular/forms'; // Manejo de formularios reactivos
import { ToastController, ModalController } from '@ionic/angular'; // Controladores para toasts y modales
import { ModalComponent } from '../../components/modal/modal.component'; // Componente del modal

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup; // Define el formulario reactivo para el login

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private router: Router, // Servicio de navegación
    private toastController: ToastController, // Controlador para notificaciones tipo toast
    private modalCtrl: ModalController // Controlador para manejo de modales
  ) {
    // Inicializa el formulario con validaciones
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]), // Campo de email con validaciones
      password: new FormControl('', [Validators.required, Validators.minLength(6)]) // Campo de contraseña con validación de mínimo 6 caracteres
    });
  }

  /**
   * Abre un modal con contenido adicional.
   */
  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent // Especifica el componente del modal
    });
    return await modal.present(); // Muestra el modal en pantalla
  }

  /**
   * Inicia sesión con email y contraseña.
   */
  login() {
    const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
    
    this.authService.login(email, password) // Llama al servicio de autenticación
      .then(() => { 
        this.toastWelcome('top'); // Muestra un mensaje de bienvenida
        this.router.navigate(['/home']); // Redirige a la página principal
      })
      .catch(() => this.toastError('top')); // Muestra mensaje de error si la autenticación falla
  }

  /**
   * Registra un nuevo usuario en Firebase.
   */
  register() {
    const { email, password } = this.loginForm.value; // Obtiene los valores del formulario
    
    this.authService.register(email, password) // Llama al servicio de autenticación para registro
      .then(() => this.toastWelcome('top')) // Muestra mensaje de bienvenida si el registro es exitoso
      .catch(() => this.toastError('top')); // Muestra mensaje de error si el registro falla
  }

  /**
   * Inicia sesión con Google.
   */
  loginGoogle() {
    this.authService.loginWithGoogle() // Llama al servicio de autenticación con Google
      .then(() => {
        this.toastWelcome('top'); // Muestra un mensaje de bienvenida
        this.router.navigate(['/home']); // Redirige a la página principal
      })
      .catch(() => this.toastError('top')); // Muestra mensaje de error si la autenticación falla
  }

  /**
   * Muestra un mensaje de error en un toast.
   * @param position Posición en la pantalla ('top', 'middle' o 'bottom')
   */
  toastError(position: 'top' | 'middle' | 'bottom') {
    this.toastController.create({
      message: 'Usuario o contraseña inválidos', // Mensaje de error genérico
      duration: 2500, // Duración del toast en milisegundos
      position: position // Ubicación del toast en pantalla
    }).then((toast: any) => toast.present());
  }

  /**
   * Muestra un mensaje de bienvenida en un toast con el email del usuario.
   * @param position Posición en la pantalla ('top', 'middle' o 'bottom')
   */
  toastWelcome(position: 'top' | 'middle' | 'bottom') {
    this.toastController.create({
      message: `Bienvenido ${this.loginForm.value.email} a la app de cócteles`, // Muestra el email en el mensaje
      duration: 2500, // Duración del toast en milisegundos
      position: position // Ubicación del toast en pantalla
    }).then((toast: any) => toast.present());
  }

  mostrarPassword = false; // Variable para alternar visibilidad de la contraseña

  /**
   * Alterna la visibilidad de la contraseña en el formulario.
   */
  toggleMostrarContrasena() {
    this.mostrarPassword = !this.mostrarPassword; // Cambia entre mostrar y ocultar contraseña
  }

  /**
   * Obtiene la ruta de la imagen del logo según el tema actual.
   * @returns URL del logo adaptado al tema (oscuro o claro).
   */
  get logoSrc(): string {
    const theme = document.body.getAttribute('data-theme') || 'light'; // Obtiene el tema del sistema
    return theme === 'dark' ? 'assets/logo-dark.png' : 'assets/logo-light.png'; // Retorna la imagen según el tema
  }
}
