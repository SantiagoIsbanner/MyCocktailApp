import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Bebida } from 'src/app/models/bebida.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  standalone: false,
  selector: 'app-add-edit-bebida',
  templateUrl: './add-edit-bebida.component.html',
  styleUrls: ['./add-edit-bebida.component.scss']
})
export class AddEditBebidaComponent {
  @Input() bebida?: Bebida;
  nombre = '';
  ingredientes = '';
  descripcion = '';
  foto: string | null = null;

  CameraSource = CameraSource;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.bebida) {
      this.nombre = this.bebida.nombre;
      this.ingredientes = this.bebida.ingredientes;
      this.descripcion = this.bebida.descripcion;
      this.foto = this.bebida.foto;
    }
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

  save() {
    if (!this.nombre || !this.ingredientes || !this.descripcion || !this.foto) {
      alert('Todos los campos son obligatorios');
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
