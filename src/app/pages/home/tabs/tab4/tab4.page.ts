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
  isDarkMode = false;
  CameraSource = CameraSource;
  foto: string | null = null;
  bebidasGuardadas: any[] = [];
  cantidadbebidasGuardadas: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
  }

  async ionViewWillEnter() {
    await this.cargarBebidasGuardadas();
  }
  //cargar bebidas guardadas
  async cargarBebidasGuardadas() {
    const bebidasGuardadasString = localStorage.getItem('bebidasGuardadas');
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

    await this.cargarBebidasGuardadas();
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
    
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  async takePhoto(source: CameraSource) {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    this.foto = 'data:image/jpeg;base64,' + image.base64String;

    await Preferences.set({
      key: 'user-photo',
      value: this.foto
    });
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
  }
}



}