import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddEditBebidaComponent } from 'src/app/components/agregar-bebida/add-edit-bebida.component';
import { BebidasService } from 'src/app/services/bebida.service';
import { Bebida } from 'src/app/models/bebida.model';
import { AlertController } from '@ionic/angular';
import { FavoritosService } from 'src/app/services/favoritos.service';

@Component({
  standalone: false,
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page {

  bebidas: Bebida[] = [];
    currentPage = 1;
    perPage = 4;
    totalPages = 1;

    constructor(private bebidasService: BebidasService, private modalCtrl: ModalController, private alertController: AlertController, private favoritosService: FavoritosService) { }

    ionViewWillEnter() {
      this.loadBebidas();
    }
  
    loadBebidas() {
      const allBebidas = this.bebidasService.getAllBebidas(); 
      const total = allBebidas.length;
      this.totalPages = Math.ceil(total / this.perPage);
  
      const start = (this.currentPage - 1) * this.perPage;
      const pageBebidas = allBebidas.slice(start, start + this.perPage);

      this.bebidas = pageBebidas.map(b => ({ 
        ...b, 
        showDetails: false,
        isFavorita: false  // Inicializamos isFavorita como false
      }));

    }

    toggleDetails(bebida: any) {
      bebida.showDetails = !bebida.showDetails;
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
  
    async deleteBebida(id: number) {
       const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro que deseas eliminar la bebida?',
        buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.bebidasService.deleteBebida(id);
            this.loadBebidas(); 
            console.log('Bebida eliminada');
          }
        }
      ]
    });

    await alert.present();
  }

  alert() {
    console.log("alert");
  }
  
  toggleFavoritos(bebida: any) {
  bebida.isFavorita = !bebida.isFavorita;

  if (bebida.isFavorita) {
    this.saveBebida(bebida);  // guardar cuando es favorita
  } else {
    this.eliminarBebidaGuardada(bebida); // eliminar cuando ya no es favorita
  }
}

  async ngOnInit() {
    const favoritos = await this.favoritosService.getFavoritos();

      this.bebidas.forEach(bebida => {
        bebida.isFavorita = favoritos.some(fav => fav.id === bebida.id);
      });
 
    this.cargarBebidasGuardadas();
  }

  /*creo un array para tener las bebidas guardadas*/
    bebidasGuardadas: Bebida[] = [];
    cantidadbebidasGuardadas: number = 0; /*acumulo las bebidas guardadas*/

    cargarBebidasGuardadas() {
      const bebidasGuardadasString = localStorage.getItem('bebidasGuardadas');
      if (bebidasGuardadasString) {
        this.bebidasGuardadas = JSON.parse(bebidasGuardadasString);
        // Obtener todas las bebidas existentes
        const todasLasBebidas = this.bebidasService.getAllBebidas();
        
        // Filtrar solo las bebidas que aún existen
        this.bebidasGuardadas = this.bebidasGuardadas.filter(bebidaGuardada => 
          todasLasBebidas.some(bebida => bebida.id === bebidaGuardada.id)
        );
        
        this.cantidadbebidasGuardadas = this.bebidasGuardadas.length;
        // Actualizar localStorage
        localStorage.setItem('bebidasGuardadas', JSON.stringify(this.bebidasGuardadas));
        localStorage.setItem('cantidadbebidasGuardadas', this.cantidadbebidasGuardadas.toString());
      } else {
        this.bebidasGuardadas = [];
        this.cantidadbebidasGuardadas = 0;
        localStorage.setItem('bebidasGuardadas', JSON.stringify(this.bebidasGuardadas));
        localStorage.setItem('cantidadbebidasGuardadas', '0');
      }
    }

    saveBebida(bebida: Bebida) {
      // Verificar si ya existe la bebida
      const bebidaExistente = this.bebidasGuardadas.find(b => b.id === bebida.id);
      if (!bebidaExistente) {
        this.bebidasGuardadas.push(bebida);
        this.cantidadbebidasGuardadas = this.bebidasGuardadas.length;
        
        // Actualizar localStorage
        localStorage.setItem('bebidasGuardadas', JSON.stringify(this.bebidasGuardadas));
        localStorage.setItem('cantidadbebidasGuardadas', this.cantidadbebidasGuardadas.toString());
      }
    }

    eliminarBebidaGuardada(id: number) {
      this.bebidasGuardadas = this.bebidasGuardadas.filter(b => b.id !== id);
      this.cantidadbebidasGuardadas = this.bebidasGuardadas.length;
      localStorage.setItem('bebidasGuardadas', JSON.stringify(this.bebidasGuardadas));
      localStorage.setItem('cantidadbebidasGuardadas', this.cantidadbebidasGuardadas.toString());
    }
}

