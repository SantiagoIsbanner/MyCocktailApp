import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';/*importo authservice para verificar data del user*/

@Component({
  standalone: false,
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss']
})
export class Tab4Page implements OnInit {
  
  userData: any = {};

  constructor(
    private router: Router,
    private authService: AuthService
  ) { 

   this.authService.getCurrentUser().then(user => {/*trae la data del user actual */
     this.userData = user;
     /*console.log(user);muestra la data del user actual en consola*/
   });

  }

  ngOnInit() {
    
  }

  // Método para generar nombre de usuario a partir del email
  getUsernameFromEmail(): string {
    if (!this.userData?.email) return 'Usuario';
    
    // Extrae la parte antes del @ y reemplaza puntos por espacios
    return this.userData.email.split('@')[0]
      .replace(/\./g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitaliza cada palabra
  }

  logout() {/*cierre de sesion*/
    this.authService.logout()
    .then(()=>this.router.navigate(['/login']))
    .catch(error=>alert("Error al cerrar sesion: "+error.message))
    }
    
  

  
}
