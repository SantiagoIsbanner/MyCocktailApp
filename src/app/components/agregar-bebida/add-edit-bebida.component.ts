import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Bebida } from 'src/app/models/bebida.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-add-edit-bebida',
  templateUrl: './add-edit-bebida.component.html',
  styleUrls: ['./add-edit-bebida.component.scss']
})
export class AddEditBebidaComponent {
  @Input() bebida?: Bebida;
  nombre = '';
  nuevoIngrediente = '';
  ingredientes: string[] = [];
  descripcion = '';
  foto: string | null = null;

  CameraSource = CameraSource;

  constructor(private modalCtrl: ModalController, private alertController: AlertController) {}

  ngOnInit() { // Inicializa los campos si se está editando una bebida
    if (this.bebida) { // Verifica si se está editando una bebida
      this.nombre = this.bebida.nombre; // Asigna el nombre de la bebida
      this.ingredientes = Array.isArray(this.bebida.ingredientes) 
        ? this.bebida.ingredientes
        : this.bebida.ingredientes.split(',').map(i => i.trim());
      this.descripcion = this.bebida.descripcion;
      this.foto = this.bebida.foto;
    }
  }

  addIngrediente() { // Agrega un nuevo ingrediente a la lista
    const ingrediente = this.nuevoIngrediente.trim(); // Elimina espacios al inicio y al final
    if (ingrediente) { // Verifica que el ingrediente no esté vacío
      this.ingredientes.push(ingrediente); // Agrega el ingrediente a la lista
      this.nuevoIngrediente = ''; // Limpia el campo de entrada
    }
  }

  removeIngrediente(index: number) { // Elimina un ingrediente de la lista
    this.ingredientes.splice(index, 1); // Elimina el ingrediente en la posición especificada
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
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
    }
  }

  removePhoto() {
    this.foto = null;
  }

  async save() {
  if (!this.nombre || this.ingredientes.length === 0 || !this.descripcion || !this.foto) {
    const alert = await this.alertController.create({
      header: 'Datos incompletos',
      message: 'Todos los campos son obligatorios.',
      buttons: ['OK']
    });

    await alert.present();
    return;
  }

    this.modalCtrl.dismiss({
      nombre: this.nombre,
      ingredientes: this.ingredientes,
      descripcion: this.descripcion,
      foto: this.foto
    });
  }

  close() {
    this.modalCtrl.dismiss(null);
  }

}
