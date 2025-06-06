import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';

/**
 * Servicio AuthGuard que protege las rutas de la aplicación.
 * Verifica si el usuario está autenticado antes de permitir el acceso.
 */
@Injectable({
  providedIn: 'root' // Define que el guardián de autenticación está disponible en toda la aplicación
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {} // Inyección de servicios de autenticación y navegación

  /**
   * Método que verifica si un usuario está autenticado antes de acceder a una ruta protegida.
   * @returns `true` si el usuario está autenticado, `false` si no lo está y lo redirige a la página de login.
   */
  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser(); // Obtiene el usuario actual

    if (user) {
      return true; // Permite el acceso a la ruta
    } else {
      this.router.navigate(['/login']); // Redirige al usuario al login si no está autenticado
      return false; // Bloquea el acceso a la ruta protegida
    }
  }
}
