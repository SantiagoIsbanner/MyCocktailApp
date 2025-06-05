import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';/*importo authservice para verificar data del user*/
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; /*importo camera para tomar fotos*/
import { Preferences } from '@capacitor/preferences'; /*importo preferences para guardar la foto del user*/

@Component({
  standalone: false,
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss']
})
export class Tab4Page implements OnInit {

   userData: any = {}; /*variable para almacenar la data del user actual*/
  isDarkMode = false; // variable para el modo oscuro
  CameraSource = CameraSource; // variable para definir la fuente de la cámara
  foto: string | null = null; // variable para almacenar la foto del usuario
  bebidasGuardadas: any[] = []; // variable para almacenar las bebidas guardadas
  cantidadbebidasGuardadas: number = 0; // variable para contar la cantidad de bebidas guardadas

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Obtiene el tema guardado o usa 'light' por defecto
    this.isDarkMode = savedTheme === 'dark';  // Inicializa el modo oscuro según el tema guardado
  }

  async ionViewWillEnter() { // Método que se ejecuta cuando la vista está a punto de entrar
    await this.cargarBebidasGuardadas(); // Carga las bebidas guardadas desde localStorage
  }
  //cargar bebidas guardadas
  async cargarBebidasGuardadas() { // Método para cargar las bebidas guardadas desde localStorage
    const bebidasGuardadasString = localStorage.getItem('bebidasGuardadas'); // Obtiene las bebidas guardadas como string desde localStorage
    if (bebidasGuardadasString) { 
      this.bebidasGuardadas = JSON.parse(bebidasGuardadasString);//si hay bebidas las guardo
      this.cantidadbebidasGuardadas = this.bebidasGuardadas.length;//cuento la cantidad
    } else {
      this.bebidasGuardadas = [];//sino setea a 0
      this.cantidadbebidasGuardadas = 0;
    }
  }

  async ngOnInit() {
    this.authService.getCurrentUser().then(user => { /*trae la data del user actual */
      this.userData = user;
      /*console.log(user);muestra la data del user actual en consola*/
    });

    const storedPhoto = await Preferences.get({ key: 'user-photo' });
      if (storedPhoto.value) {
        this.foto = storedPhoto.value;
      }
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
    this.authService.logout() // Cierra la sesión del usuario
    .then(()=>this.router.navigate(['/login'])) // Redirige al usuario a la página de login
    .catch(error=>alert("Error al cerrar sesion: "+error.message))
    }
    
  toggleDarkMode() { // Método para alternar entre modo oscuro y claro
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light'; // Define el tema según el estado del modo oscuro
    document.body.setAttribute('data-theme', theme); // Aplica el tema al body del documento
    localStorage.setItem('theme', theme); // Guarda el tema en localStorage
  }

  async takePhoto(source: CameraSource) {
  try {
    const image = await Camera.getPhoto({ // Obtiene una foto de la cámara o galería
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    this.foto = 'data:image/jpeg;base64,' + image.base64String;

    await Preferences.set({ 
      key: 'user-photo', // Guarda la foto en Preferences
      value: this.foto
    });
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
  }
}

}

