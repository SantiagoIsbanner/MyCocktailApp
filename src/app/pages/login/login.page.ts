import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  login() {
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password)
      .then(() => this.router.navigate(['/home']))
      .catch(error => alert("Usuario o contraseña invalidos: " + error.message));
  }

  register() {
    const { email, password } = this.loginForm.value;
    
    this.authService.register(email, password)
      .then(() => alert('Registro exitoso. Ahora puedes iniciar sesión.'))
      .catch(error => alert("Error al registrarse: " + error.message));
  }

  loginGoogle() {
    this.authService.loginWithGoogle()
      .then(() => this.router.navigate(['/home']))
      .catch(error => alert("Error en login con Google: " + error.message));
}
}