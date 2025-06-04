import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Bebida } from 'src/app/models/bebida.model';
import { BebidasService } from 'src/app/services/bebida.service';
import { CocktailService } from 'src/app/services/cocktail.service';
import { Observable } from 'rxjs';
import { AddEditBebidaComponent } from 'src/app/components/agregar-bebida/add-edit-bebida.component';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgZone } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ViewChild } from '@angular/core';


@Component({
  standalone: false,
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  @ViewChild('contenido', { static: false }) content!: IonContent;

  ingredientName: string = '';
  cocktailName: string = '';
  isModalOpen = false;
  selectedCocktail: any = null;
  cocktails: any[] = [];

  bebidas$: Observable<Bebida[]>; // Observable para bebidas estándar
  bebidas: Bebida[] = [];

  bebidasComunidad$: Observable<Bebida[]>; // Observable para bebidas comunidad
  bebidasComunidad: Bebida[] = [];

  userId: string | null = null;

  currentPage = 1;
  perPage = 4;
  totalPages = 1;

  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private bebidasService: BebidasService,
    private modalCtrl: ModalController,
    private cocktailService: CocktailService,
    private ngZone: NgZone 
  ) {
    // Inicializar observables para no depender solo de ngOnInit
    this.bebidas$ = this.firestoreService.getAllBebidas();
    this.bebidasComunidad$ = this.firestoreService.getAllBebidasComunidad();
    this.userId = this.authService.getUserId();
  }

  ngOnInit() {
    // Cargar bebidas estándar
    this.bebidas$ = this.firestoreService.getAllBebidas();

    // Cargar bebidas comunidad y calcular paginación
    this.firestoreService.getAllBebidasComunidad().subscribe((bebidas) => {
      this.bebidasComunidad = bebidas || [];
      this.totalPages = Math.ceil(this.bebidasComunidad.length / this.perPage) || 1;
      this.loadBebidasPaginadas();
    });
  }

  async openModal(bebida?: Bebida) {
    const modal = await this.modalCtrl.create({
      component: AddEditBebidaComponent,
      componentProps: { bebida },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      try {
        await this.firestoreService.saveBebida(data);
        this.ngOnInit(); // Recargar bebidas luego de guardar
      } catch (error) {
        console.error('Error guardando bebida:', error);
        this.showErrorAlert('Ocurrió un error al guardar la bebida.');
      }
    }
  }

  editBebida(bebida: Bebida) {
    
    if (bebida.userId === this.userId) {
      this.openModal(bebida);
    } else {
      this.showErrorAlert('No puedes editar esta bebida porque no eres su creador.');
    }
  }

  async confirmDelete(bebida: Bebida) {
    
    if (bebida.userId === this.userId) {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: `¿Seguro que deseas eliminar la bebida ${bebida.nombre}?`,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', handler: () => this.deleteBebida(bebida.id) },
        ],
      });

      await alert.present();
    } else { 
      this.showErrorAlert('No puedes eliminar esta bebida porque no eres su creador.');
    }
  }

  async deleteBebida(id: number) {
    try {
      await this.firestoreService.deleteBebida(id);
      console.log(`🗑️ Bebida ${id} eliminada`);
      this.ngOnInit(); // Recargar lista después de borrar
    } catch (error) {
      console.error('Error al eliminar la bebida:', error);
      this.showErrorAlert('Ocurrió un error al eliminar la bebida.');
    }
  }

  loadBebidasPaginadas() {
    const start = (this.currentPage - 1) * this.perPage;
    const paginadas = this.bebidasComunidad.slice(start, start + this.perPage);

    // Crear nuevo observable para la página actual
    this.bebidasComunidad$ = new Observable((observer) => {
      observer.next(paginadas);
      observer.complete();
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBebidasPaginadas();
      setTimeout(() => {
      this.content.scrollToTop(300);
    }, 100);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBebidasPaginadas();
      setTimeout(() => {
      this.content.scrollToTop(300);
    }, 100);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBebidasPaginadas();
      setTimeout(() => {
      this.content.scrollToTop(300);
    }, 100);
    }
  }

  toggleDetails(bebida: any) {
    bebida.showDetails = !bebida.showDetails;
  }

  mostrarPassword = false;

  toggleMostrarContrasena() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  async showErrorAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }
}