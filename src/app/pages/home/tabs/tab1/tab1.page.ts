import { Component, OnInit } from '@angular/core';
import { CocktailService } from 'src/app/services/cocktail.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ModalController } from '@ionic/angular';
import { ModalPreparacionComponent } from 'src/app/components/modal-preparacion/modal-preparacion.component';
import { GoogleTranslateService } from 'src/app/services/google-translate.service'; // Servicio para traducción de texto

@Component({
  standalone: false,
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  // Variables para almacenar la bebida del día y su traducción
  bebidaDelDia: any = null; 
  instruccionesTraducidas: string = ''; 
  mostrarOriginal: boolean = false; // Controla si se muestra el texto original o traducido

  constructor(
    private cocktailService: CocktailService, // Servicio para obtener cócteles de la API
    private firestoreService: FirestoreService, // Servicio para interactuar con Firestore
    private modalCtrl: ModalController, // Controlador de modales para mostrar detalles
    private googleTranslateService: GoogleTranslateService // Servicio de traducción
  ) {}

  ngOnInit() {
    this.cargarDailyCocktail(); // Cargar la bebida del día al inicializar el componente
  }

  /**
   * Obtiene un cóctel aleatorio y lo guarda en Firestore como "bebida del día"
   */
  obtenerYGuardarDailyCocktail() {
    this.cocktailService.getRandomCocktail().subscribe({
      next: (res) => {
        const bebida = res?.drinks?.[0]; // Obtiene el primer cóctel de la respuesta
        if (!bebida) return;

        const bebidaSimplificada = { // Estructura la bebida con datos esenciales
          nombre: bebida.strDrink,
          categoria: bebida.strCategory,
          instrucciones: bebida.strInstructions,
          imagen: bebida.strDrinkThumb,
          ingredientes: this.extraerIngredientes(bebida),
          creado: new Date()
        };

        // Guarda la bebida en Firestore
        this.firestoreService.saveDailyCocktail(bebidaSimplificada)
          .catch(err => console.error('Error al guardar bebida del día:', err));
      },
      error: (err) => console.error('Error al obtener bebida:', err),
    });
  }

  /**
   * Extrae los ingredientes de una bebida sin incluir valores nulos
   * @param bebida Objeto que contiene los datos del cóctel
   * @returns Lista de ingredientes disponibles
   */
  extraerIngredientes(bebida: any): string[] {
    const ingredientes: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingrediente = bebida[`strIngredient${i}`]; // Accede a los ingredientes dinámicamente
      if (ingrediente) ingredientes.push(ingrediente); // Solo agrega ingredientes válidos
    }
    return ingredientes;
  }

  /**
   * Carga la bebida del día desde Firestore y traduce sus instrucciones si es necesario
   */
  async cargarDailyCocktail() {
    this.bebidaDelDia = await this.firestoreService.getTodayCocktail(); // Obtiene la bebida del día

    if (this.bebidaDelDia?.instrucciones) {
      // Traduce las instrucciones a español usando Google Translate API
      this.googleTranslateService.translateText(this.bebidaDelDia.instrucciones, 'es').subscribe({
        next: (res: any) => {
          if (res?.data?.translations?.length > 0) {
            this.instruccionesTraducidas = res.data.translations[0].translatedText; // Traducción exitosa
          } else {
            this.instruccionesTraducidas = this.bebidaDelDia.instrucciones; // Fallback: usa las instrucciones originales
          }
        },
        error: (err) => {
          console.error('Error traduciendo instrucciones:', err);
          this.instruccionesTraducidas = this.bebidaDelDia.instrucciones; // Fallback en caso de error
        }
      });
    }
  }

  
  // Abre un modal con la preparación del cóctel seleccionado
   
  /*
   * Alterna la visualización de detalles del cóctel
   * @param cocktail Objeto del cóctel que se mostrará u ocultará
   */
  toggleDetails(cocktail: any) {
    cocktail.showDetails = !cocktail.showDetails; // Cambia el estado de visibilidad
  }

}
