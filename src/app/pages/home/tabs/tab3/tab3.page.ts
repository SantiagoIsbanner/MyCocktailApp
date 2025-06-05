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

  ingredientName: string = ''; // Nombre del ingrediente a buscar
  cocktailName: string = ''; // Nombre del cóctel a buscar
  isModalOpen = false; // Indica si el modal está abierto
  selectedCocktail: any = null; // Cóctel seleccionado para mostrar detalles
  cocktails: any[] = []; // Lista de cócteles obtenidos

  bebidas$: Observable<Bebida[]>; // Observable para bebidas estándar
  bebidas: Bebida[] = []; // Lista de bebidas estándar

  bebidasComunidad$: Observable<Bebida[]>; // Observable para bebidas comunidad
  bebidasComunidad: Bebida[] = []; // Lista de bebidas de la comunidad

  userId: string | null = null; // ID del usuario autenticado

  currentPage = 1; // Página actual para la paginación
  perPage = 4; // Cantidad de elementos por página
  totalPages = 1; // Total de páginas para la paginación

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

  async openModal(bebida?: Bebida) { // Método para abrir el modal de agregar/editar bebida
    const modal = await this.modalCtrl.create({ // Crea una instancia del modal
      component: AddEditBebidaComponent, // Componente que se mostrará en el modal
      componentProps: { bebida }, // Pasa la bebida a editar si existe
    });

    await modal.present(); // Presenta el modal
    // Espera a que el modal se cierre y obtiene los datos devueltos

    const { data } = await modal.onDidDismiss(); // Espera a que el modal se cierre y obtiene los datos devueltos
    // Si hay datos, guarda la bebida (ya sea nueva o editada)

    if (data) { // Si hay datos, guarda la bebida (ya sea nueva o editada)
      try {
        await this.firestoreService.saveBebida(data); // Guarda la bebida en Firestore
        this.ngOnInit(); // Recargar bebidas luego de guardar
      } catch (error) { 
        console.error('Error guardando bebida:', error); // Manejo de errores al guardar bebida
        this.showErrorAlert('Ocurrió un error al guardar la bebida.');
      }
    }
  }

  editBebida(bebida: Bebida) {
    
    if (bebida.userId === this.userId) { // Verifica si el usuario es el creador de la bebida
      this.openModal(bebida); // Abre el modal para editar la bebida
    } else {
      this.showErrorAlert('No puedes editar esta bebida porque no eres su creador.');
    }
  }

  async confirmDelete(bebida: Bebida) { // Método para confirmar la eliminación de una bebida
    // Verifica si el usuario es el creador de la bebida antes de permitir la eliminación
    
    if (bebida.userId === this.userId) { // Verifica si el usuario es el creador de la bebida
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

  async deleteBebida(id: number) { // Método para eliminar una bebida 
    try {
      await this.firestoreService.deleteBebida(id);
      console.log(`🗑️ Bebida ${id} eliminada`);
      this.ngOnInit(); // Recargar lista después de borrar
    } catch (error) {
      console.error('Error al eliminar la bebida:', error);
      this.showErrorAlert('Ocurrió un error al eliminar la bebida.');
    }
  }

  loadBebidasPaginadas() { // Método para cargar las bebidas de la comunidad paginadas
    const start = (this.currentPage - 1) * this.perPage; // Calcular el índice de inicio para la paginación
    const paginadas = this.bebidasComunidad.slice(start, start + this.perPage); 

    // Crear nuevo observable para la página actual
    this.bebidasComunidad$ = new Observable((observer) => { // Crear un nuevo observable para la página actual
      observer.next(paginadas); // Emitir las bebidas paginadas
      observer.complete();
    });
  }
 
  goToPage(page: number) { // Método para ir a una página específica  
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBebidasPaginadas();
      setTimeout(() => {
      this.content.scrollToTop(300);
    }, 100);
    }
  }

  nextPage() { // Método para ir a la siguiente página
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBebidasPaginadas();
      setTimeout(() => {
      this.content.scrollToTop(300);
    }, 100);
    }
  }

  prevPage() { // Método para ir a la página anterior
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBebidasPaginadas();
      setTimeout(() => {
      this.content.scrollToTop(300);
    }, 100);
    }
  }

  toggleDetails(bebida: any) { // Método para alternar la visibilidad de los detalles de una bebida
  // Cambia el estado de showDetails al valor opuesto
    bebida.showDetails = !bebida.showDetails;
  }

  mostrarPassword = false; 

  toggleMostrarContrasena() { // Método para alternar la visibilidad de la contraseña 
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