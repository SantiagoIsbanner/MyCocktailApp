import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Bebida } from 'src/app/models/bebida.model'; // Modelo de datos para bebidas
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Biblioteca para capturar imágenes
import { AlertController } from '@ionic/angular'; // Controlador para mostrar alertas
import { AuthService } from 'src/app/services/auth.service'; // Servicio de autenticación
import { FirestoreService } from 'src/app/services/firestore.service'; // Servicio para manejar datos en Firestore

@Component({
  standalone: false,
  selector: 'app-add-edit-bebida',
  templateUrl: './add-edit-bebida.component.html',
  styleUrls: ['./add-edit-bebida.component.scss']
})
export class AddEditBebidaComponent {
  
  @Input() bebida?: Bebida; // Datos de la bebida en caso de edición
  nombre = ''; // Nombre de la bebida
  nuevoIngrediente = ''; // Ingrediente que se va a agregar
  ingredientes: string[] = []; // Lista de ingredientes de la bebida
  descripcion = ''; // Descripción de la bebida
  foto: string | null = null; // URL de la foto de la bebida

  CameraSource = CameraSource; // Fuente de la cámara (para permitir tomar fotos)

  constructor(
    private authService: AuthService, // Servicio de autenticación del usuario
    private firestoreService: FirestoreService, // Servicio para manejar datos en Firestore
    private modalCtrl: ModalController, // Controlador de modal
    private alertController: AlertController // Controlador de alertas
  ) {}

  /**
   * Inicializa los datos si se está editando una bebida existente.
   */
  ngOnInit() {
    if (this.bebida) { // Verifica si se está editando una bebida
      this.nombre = this.bebida.nombre; // Asigna el nombre
      this.ingredientes = Array.isArray(this.bebida.ingredientes) 
        ? this.bebida.ingredientes // Si es un array, lo usa directamente
        : this.bebida.ingredientes.split(',').map(i => i.trim()); // Si es una string, la convierte en array
      this.descripcion = this.bebida.descripcion;
      this.foto = this.bebida.foto;
    }
  }

  /**
   * Agrega un nuevo ingrediente a la lista.
   */
  addIngrediente() {
    const ingrediente = this.nuevoIngrediente.trim(); // Limpia espacios innecesarios
    if (ingrediente) { // Verifica que el ingrediente no esté vacío
      this.ingredientes.push(ingrediente); // Agrega el ingrediente
      this.nuevoIngrediente = ''; // Limpia el campo de entrada
    }
  }

  /**
   * Elimina un ingrediente específico por índice.
   * @param index Índice del ingrediente a eliminar.
   */
  removeIngrediente(index: number) {
    this.ingredientes.splice(index, 1); // Elimina el ingrediente de la lista
  }

  /**
   * Captura una foto usando la cámara del dispositivo.
   * @param source Fuente de la imagen (cámara o galería).
   */
  async takePhoto(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90, // Alta calidad
        allowEditing: false, // No permite edición antes de guardar
        resultType: CameraResultType.Base64, // Formato en base64
        source // Fuente de la imagen (cámara o galería)
      });

      this.foto = `data:image/jpeg;base64,${image.base64String}`; // Guarda la imagen en formato base64
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
    }
  }

  /**
   * Elimina la foto seleccionada.
   */
  removePhoto() {
    this.foto = null; // Resetea el campo de la imagen
  }

  /**
   * Guarda la bebida en Firestore, validando que todos los campos estén completos.
   */
  async save() {
    if (!this.nombre || this.ingredientes.length === 0 || !this.descripcion || !this.foto) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Todos los campos son obligatorios',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    const userId = this.authService.getUserId(); // 🔥 Obtiene el ID del usuario actual

    if (!userId) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se puede guardar porque el usuario no está autenticado.',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    const bebida: Bebida = {
      id: Date.now(), // 🔥 Genera un ID único basado en el timestamp
      nombre: this.nombre,
      ingredientes: this.ingredientes.join(', '), // Convierte los ingredientes en una cadena separada por comas
      descripcion: this.descripcion,
      foto: this.foto,
      userId: userId // 🔥 Guarda el ID del usuario autenticado
    };

    await this.firestoreService.saveBebida(bebida); // Guarda la bebida en Firestore
    this.modalCtrl.dismiss(null); // Cierra el modal
  }

  /**
   * Cierra el modal sin guardar cambios.
   */
  close() {
    this.modalCtrl.dismiss(null);
  }
}
