import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddEditBebidaComponent } from 'src/app/components/agregar-bebida/add-edit-bebida.component';
import { BebidasService } from 'src/app/services/bebida.service';
import { Bebida } from 'src/app/models/bebida.model';

@Component({
  standalone: false,
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {

  bebidas: Bebida[] = [];
  currentPage = 1;
  perPage = 4;
  totalPages = 1;

  constructor(private bebidasService: BebidasService, private modalCtrl: ModalController) { }

  ionViewWillEnter() {
    this.loadBebidas();
  }

  loadBebidas() {
    const allBebidas = this.bebidasService.getAllBebidas(); 
    const total = allBebidas.length;
    this.totalPages = Math.ceil(total / this.perPage);

    const start = (this.currentPage - 1) * this.perPage;
    this.bebidas = allBebidas.slice(start, start + this.perPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBebidas();
    }
  }

  nextPage() {
    this.currentPage++;
    this.loadBebidas();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBebidas();
    }
  }

  async openModal(bebida?: Bebida) {
    const modal = await this.modalCtrl.create({
      component: AddEditBebidaComponent,
      componentProps: { bebida }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      if (bebida) {
        this.bebidasService.updateBebida(bebida.id, data);
      } else {
        this.bebidasService.addBebida(data);
      }
      this.loadBebidas();
    }
  }

  deleteBebida(id: number) {
    this.bebidasService.deleteBebida(id);
    this.loadBebidas();
  }

  alert(){
    console.log("alert");
  }

  ngOnInit() {
  }
}