import { Component, OnInit } from '@angular/core';
import { CocktailService } from 'src/app/services/cocktail.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ModalController } from '@ionic/angular';
import { ModalPreparacionComponent } from 'src/app/components/modal-preparacion/modal-preparacion.component';
import { GoogleTranslateService } from 'src/app/services/google-translate.service'; // Asegúrate de que la ruta sea correcta

@Component({
  standalone:false,
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  bebidaDelDia: any = null;
  instruccionesTraducidas: string = '';
  mostrarOriginal: boolean = false;

  constructor(
    private cocktailService: CocktailService,
    private firestoreService: FirestoreService,
    private modalCtrl: ModalController,
    private googleTranslateService: GoogleTranslateService // Asegúrate de importar TranslateService correctamente
  ) {}

  ngOnInit() {
    this.cargarDailyCocktail();
  }

  // Obtiene un cóctel aleatorio y lo guarda en Firestore como "bebida del día"
  obtenerYGuardarDailyCocktail() {
    this.cocktailService.getRandomCocktail().subscribe({
      next: (res) => {
        const bebida = res?.drinks?.[0];
        if (!bebida) return;

        const bebidaSimplificada = {
          nombre: bebida.strDrink,
          categoria: bebida.strCategory,
          instrucciones: bebida.strInstructions,
          imagen: bebida.strDrinkThumb,
          ingredientes: this.extraerIngredientes(bebida),
          creado: new Date()
        };

        this.firestoreService.saveDailyCocktail(bebidaSimplificada)
          .catch(err => console.error('❌ Error al guardar bebida del día:', err));
      },
      error: (err) => console.error('❌ Error al obtener bebida:', err),
    });
  }

  // Extrae ingredientes no nulos de una bebida
  extraerIngredientes(bebida: any): string[] {
    const ingredientes: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingrediente = bebida[`strIngredient${i}`];
      if (ingrediente) ingredientes.push(ingrediente);
    }
    return ingredientes;
  }

  // Carga la bebida del día desde Firestore
  async cargarDailyCocktail() {
  this.bebidaDelDia = await this.firestoreService.getTodayCocktail();
  if (this.bebidaDelDia?.instrucciones) {
    this.googleTranslateService.translateText(this.bebidaDelDia.instrucciones, 'es').subscribe({
      next: (res: any) => {
        if (res?.data?.translations?.length > 0) {
          this.instruccionesTraducidas = res.data.translations[0].translatedText;
        } else {
          this.instruccionesTraducidas = this.bebidaDelDia.instrucciones; // fallback
        }
      },
      error: (err) => {
        console.error('Error traduciendo instrucciones:', err);
        this.instruccionesTraducidas = this.bebidaDelDia.instrucciones; // fallback
      }
    });
  }
}
  // Abre el modal con la preparación de la bebida del día
  async abrirModal() {
    const modal = await this.modalCtrl.create({
      component: ModalPreparacionComponent,
      componentProps: { bebida: this.bebidaDelDia }
    });
    await modal.present();
  }

  toggleDetails(cocktail: any) {
    cocktail.showDetails = !cocktail.showDetails;
  }

}