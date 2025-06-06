import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // Servicio de autenticación para obtener datos del usuario
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Librería para capturar fotos desde la cámara o galería
import { Preferences } from '@capacitor/preferences'; // Almacenamiento de preferencias para guardar la foto del usuario

@Component({
  standalone: false,
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss']
})
export class Tab4Page implements OnInit {

  userData: any = {}; // Variable para almacenar la información del usuario
  isDarkMode = false; // Controla si el modo oscuro está activado o no
  CameraSource = CameraSource; // Fuente de imágenes (cámara o galería)
  foto: string | null = null; // Variable para almacenar la foto del usuario
  bebidasGuardadas: any[] = []; // Lista de bebidas guardadas por el usuario
  cantidadbebidasGuardadas: number = 0; // Número total de bebidas guardadas

  constructor(
    private router: Router, // Servicio para redireccionar entre páginas
    private authService: AuthService // Servicio de autenticación del usuario
  ) {
    // Obtiene el tema guardado en localStorage y lo aplica
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
  }

  /**
   * Se ejecuta cada vez que el usuario entra a la vista para cargar las bebidas guardadas.
   */
  async ionViewWillEnter() {
    await this.cargarBebidasGuardadas();
  }

  /**
   * Carga las bebidas guardadas desde localStorage y actualiza el contador.
   */
  async cargarBebidasGuardadas() {
    const bebidasGuardadasString = localStorage.getItem('bebidasGuardadas');
    
    // Si hay bebidas guardadas, se convierten a un array y se actualiza el contador
    if (bebidasGuardadasString) { 
      this.bebidasGuardadas = JSON.parse(bebidasGuardadasString);
      this.cantidadbebidasGuardadas = this.bebidasGuardadas.length;
    } else {
      // Si no hay bebidas guardadas, se inicializa con un array vacío y contador en 0
      this.bebidasGuardadas = [];
      this.cantidadbebidasGuardadas = 0;
    }
  }

  /**
   * Se ejecuta al iniciar el componente para obtener la información del usuario y cargar su foto.
   */
  async ngOnInit() {
    try {
      this.userData = await this.authService.getCurrentUser(); // Obtiene el usuario autenticado
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
    }

    // Obtiene la foto guardada en preferencias
    const storedPhoto = await Preferences.get({ key: 'user-photo' });
    if (storedPhoto.value) {
      this.foto = storedPhoto.value;
    }
  }

  /**
   * Genera un nombre de usuario basado en el email.
   * @returns Nombre de usuario formateado.
   */
  getUsernameFromEmail(): string {
    if (!this.userData?.email) return 'Usuario';

    // Extrae la parte antes del @ y reemplaza puntos por espacios, capitalizando cada palabra
    return this.userData.email.split('@')[0]
      .replace(/\./g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  /**
   * Cierra la sesión del usuario y lo redirige a la página de inicio de sesión.
   */
  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/login'])) // Redirige al usuario al login después de cerrar sesión
      .catch(error => alert("Error al cerrar sesión: " + error.message));
  }

  /**
   * Alterna entre modo oscuro y claro.
   */
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';

    // Aplica el tema al documento y lo guarda en localStorage
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  /**
   * Captura una foto desde la cámara o galería y la guarda en preferencias.
   * @param source Fuente de la foto (cámara o galería)
   */
  async takePhoto(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90, // Calidad de imagen
        allowEditing: false, // No permite edición antes de guardar
        resultType: CameraResultType.Base64, // Formato en base64
        source
      });

      // Almacena la foto en la variable y en preferencias para que persista
      this.foto = `data:image/jpeg;base64,${image.base64String}`;
      await Preferences.set({ key: 'user-photo', value: this.foto });

    } catch (error) {
      alert("No se pudo capturar la foto. Asegúrate de que la cámara está disponible.");
      console.error('Error al obtener la imagen:', error);
    }
  }

}
