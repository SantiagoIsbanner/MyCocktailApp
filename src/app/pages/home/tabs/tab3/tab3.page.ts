import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Bebida } from 'src/app/models/bebida.model';
import { BebidasService } from 'src/app/services/bebida.service';
import { CocktailService } from 'src/app/services/cocktail.service';
import { Observable } from 'rxjs';
import { AddEditBebidaComponent } from 'src/app/components/agregar-bebida/add-edit-bebida.component';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  ingredientName: string = '';
  cocktailName: string = '';
  isModalOpen = false;
  selectedCocktail: any = null;
  cocktails: any[] = []; 
  bebidas$: Observable<Bebida[]>; // 🔥 Observable para bebidas estándar
  bebidas: Bebida[] = [];
  bebidasComunidad$: Observable<Bebida[]>; // 🔥 Observable para bebidas de la comunidad
  bebidasComunidad: Bebida[] = []; // Lista paginada

  currentPage = 1;
  perPage = 4;
  totalPages = 1;

  constructor(private alertController:AlertController, private authService: AuthService,private firestoreService: FirestoreService, private bebidasService: BebidasService, private modalCtrl: ModalController, private cocktailService: CocktailService) 
  {
    this.bebidas$ = this.firestoreService.getAllBebidas();
  this.bebidasComunidad$ = this.firestoreService.getAllBebidasComunidad();
  }

  ngOnInit() {
    // 🔥 Cargar bebidas estándar y comunidad
    this.bebidas$ = this.firestoreService.getAllBebidas();
    this.firestoreService.getAllBebidasComunidad().subscribe(bebidas => {
      this.bebidasComunidad = bebidas;
      this.totalPages = Math.ceil(this.bebidasComunidad.length / this.perPage);
      this.loadBebidasPaginadas();
    });
  }

  async openModal(bebida?: Bebida) {
    const modal = await this.modalCtrl.create({
      component: AddEditBebidaComponent,
      componentProps: { bebida }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      await this.firestoreService.saveBebida(data);
      this.ngOnInit(); // 🔥 Recargar bebidas después de guardar
    }
  }

editBebida(bebida: Bebida) {
  const userId = this.authService.getUserId(); // 🔥 Obtener el UID del usuario actual

  if (bebida.userId === userId) {
    this.openModal(bebida); // Solo permite editar si el usuario es el creador
  } else {
    this.showErrorAlert('No puedes editar esta bebida porque no eres su creador.');
  }
}
async confirmDelete(bebida: Bebida) {
  const userId = this.authService.getUserId(); // 🔥 Obtener ID de usuario actual

  if (bebida.userId === userId) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Seguro que deseas eliminar la bebida ${bebida.nombre}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.deleteBebida(bebida.id) }
      ]
    });

    await alert.present();
  } else {
    this.showErrorAlert('No puedes eliminar esta bebida porque no eres su creador.');
  }
}

deleteBebida(id: number) {
  this.firestoreService.deleteBebida(id)
    .then(() => console.log(`🗑️ Bebida ${id} eliminada`))
    .catch(error => console.error('Error al eliminar la bebida:', error));
}

  loadBebidasPaginadas() {
    const start = (this.currentPage - 1) * this.perPage;
    this.bebidasComunidad$ = new Observable(observer => {
      observer.next(this.bebidasComunidad.slice(start, start + this.perPage));
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBebidasPaginadas();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBebidasPaginadas();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBebidasPaginadas();
    }
  }

  alert() {
    console.log("alert");
  }

  mostrarPassword = false;

  toggleMostrarContrasena() {
    this.mostrarPassword = !this.mostrarPassword;
  }


    toggleDetails(bebida: any) {
      bebida.showDetails = !bebida.showDetails;
    }

    async showErrorAlert(mensaje: string) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: mensaje,
    buttons: ['OK']
  });

  await alert.present();
}

}