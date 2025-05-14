import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  login() {
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password)
      .then(() => {
        this.toastWelcome('top');//muestra el toast de bienvenida
        this.router.navigate(['/home']);
      })
      .catch(error => this.toastError('top'));//muestra el toast de error
  }

  register() {
    const { email, password } = this.loginForm.value;
    
    this.authService.register(email, password)
      .then(() => {this.toastWelcome('top');
      })  
  
      .catch(error => this.toastError('top'));
  }

  loginGoogle() {
    this.authService.loginWithGoogle()
      .then(() => {
        this.toastWelcome('top');
        this.router.navigate(['/home']);
      })
      .catch(error => this.toastError('top'));
    }

toastError(position: 'top' | 'middle' | 'bottom') {//Toast para mensaje de error
  this.toastController.create({
    message: 'Usuario o contraseña invalidos',
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


   
}

