import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-modal-preparacion',
  templateUrl: './modal-preparacion.component.html',
  styleUrls: ['./modal-preparacion.component.scss']
})
export class ModalPreparacionComponent {
  @Input() bebida: any;

  constructor(private modalCtrl: ModalController) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}