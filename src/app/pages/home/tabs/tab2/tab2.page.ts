import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BebidasService } from 'src/app/services/bebida.service';
import { CocktailService } from 'src/app/services/cocktail.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {

  @ViewChild('contenido', { static: false }) content!: IonContent; // Referencia al contenido para desplazamiento automático

  searchType: 'name' | 'ingredient' = 'name';  // Tipo de búsqueda (nombre o ingrediente)
  searchQuery: string = ''; // Texto de búsqueda ingresado por el usuario
  cocktails: any[] = []; // Lista de cócteles encontrados
  isModalOpen: boolean = false; // Estado de apertura del modal
  selectedCocktail: any = null; // Cóctel seleccionado para mostrar en el modal
  cocktailIngredients: { ingredient: string; measure: string }[] = []; // Ingredientes del cóctel seleccionado
  randomCocktail: any = null; // Cóctel aleatorio obtenido desde la API

  cocktails$: Observable<any[]> = of([]); // Observable para el manejo de cócteles paginados
  currentPage = 1; // Página actual
  perPage = 4; // Cantidad de cócteles por página
  totalPages = 1; // Número total de páginas

  constructor(
    private authService: AuthService, // Servicio de autenticación
    private bebidasService: BebidasService, // Servicio de bebidas
    private modalCtrl: ModalController, // Controlador de modal
    private cocktailService: CocktailService, // Servicio de cócteles
    private alertController: AlertController // Controlador de alertas
  ) {}

  // Método para buscar cócteles por nombre o ingrediente
  searchCocktail() {
    if (!this.searchQuery.trim()) { // Verifica que el campo de búsqueda no esté vacío
      console.log('El campo de búsqueda está vacío.');
      return;
    }

    this.cocktails = []; // Limpia resultados anteriores
    this.selectedCocktail = null; // Reinicia el cóctel seleccionado

    if (this.searchType === 'name') { // Búsqueda por nombre
      console.log('Buscando por nombre:', this.searchQuery);
      this.cocktailService.searchCocktailByName(this.searchQuery).subscribe(result => {
        if (result.drinks) {
          this.cocktails = result.drinks.map((cocktail: any) => ({
            ...cocktail,
            ingredients: this.extractIngredients(cocktail),
          }));
          this.currentPage = 1;
          this.loadBebidasPaginadas();
        } else {
          console.log('No se encontraron cócteles.');
        }
      });
    } else if (this.searchType === 'ingredient') { // Búsqueda por ingrediente
      console.log('Filtrando por ingrediente:', this.searchQuery);
      this.cocktailService.filterCocktailByIngredient(this.searchQuery).subscribe(result => {
        if (Array.isArray(result.drinks)) {
          // Obtiene detalles completos de cada cóctel usando Promise.all
          const promises = result.drinks.map((drink: any) =>
            this.cocktailService.searchCocktailByName(drink.strDrink).toPromise()
          );

          Promise.all(promises).then(fullResults => {
            this.cocktails = fullResults
              .filter(res => res.drinks && res.drinks.length > 0)
              .map(res => ({
                ...res.drinks[0],
                ingredients: this.extractIngredients(res.drinks[0])
              }));
            this.currentPage = 1;
            this.loadBebidasPaginadas();
          }).catch(error => {
            console.error('Error al obtener detalles completos:', error);
          });
        } else {
          console.log('No se encontraron cócteles con ese ingrediente.');
        }
      });
    }
  }

  // Alterna la visibilidad de los detalles de un cóctel
  toggleDetails(cocktail: any) {
    cocktail.showDetails = !cocktail.showDetails;
  }

  // Extrae ingredientes y cantidades de un cóctel
  extractIngredients(cocktail: any): { ingredient: string; measure: string }[] {
    const ingredients: { ingredient: string; measure: string }[] = [];

    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];

      if (ingredient) {
        ingredients.push({
          ingredient,
          measure: measure ? measure.trim() : 'Cantidad no especificada'
        });
      }
    }

    return ingredients;
  }

  // Obtiene un cóctel aleatorio
  getRandomCocktail() {
    this.cocktailService.getRandomCocktail().subscribe(
      (data) => {
        this.randomCocktail = data.drinks[0];
        this.cocktailIngredients = this.extractIngredients(this.randomCocktail);
      },
      (error) => {
        console.error('Error obteniendo cóctel', error);
      }
    );
  }

  // Paginación: carga cócteles por página
  loadBebidasPaginadas() {
    this.totalPages = Math.ceil(this.cocktails.length / this.perPage); // Calcula número total de páginas
    const start = (this.currentPage - 1) * this.perPage;
    const paginadas = this.cocktails.slice(start, start + this.perPage);
    this.cocktails$ = of(paginadas);
  }

  // Cambia a una página específica
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBebidasPaginadas();
      setTimeout(() => {
        this.content.scrollToTop(300); // Desplazamiento automático
      }, 100);
    }
  }

  // Avanza a la siguiente página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBebidasPaginadas();
      setTimeout(() => {
        this.content.scrollToTop(300);
      }, 100);
    }
  }

  // Retrocede a la página anterior
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBebidasPaginadas();
      setTimeout(() => {
        this.content.scrollToTop(300);
      }, 100);
    }
  }

  // Abre el modal con detalles del cóctel seleccionado
  setOpen(state: boolean, cocktail?: any) {
    this.isModalOpen = state;
    if (cocktail) {
      this.selectedCocktail = {
        ...cocktail,
        ingredients: this.extractIngredients(cocktail)
      };
    }
  }
}
