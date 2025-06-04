import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BebidasService } from 'src/app/services/bebida.service';
import { CocktailService } from 'src/app/services/cocktail.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {

  searchType: 'name' | 'ingredient' = 'name';  // Tipo más restrictivo
  searchQuery: string = '';
  cocktails: any[] = [];
  isModalOpen: boolean = false;
  selectedCocktail: any = null;
  cocktailIngredients: { ingredient: string; measure: string }[] = [];
  randomCocktail: any = null;

  constructor(
    private authService: AuthService,
    private bebidasService: BebidasService,
    private modalCtrl: ModalController,
    private cocktailService: CocktailService,
    private favoritosService: FavoritosService,
    private alertController: AlertController
  ) {}

  searchCocktail() {
    if (!this.searchQuery.trim()) {
      console.log('El campo de búsqueda está vacío.');
      return;
    }

    // Resetear resultados antes de buscar
    this.cocktails = [];
    this.selectedCocktail = null;

    if (this.searchType === 'name') {
      console.log('Buscando por nombre:', this.searchQuery);
      this.cocktailService.searchCocktailByName(this.searchQuery).subscribe(result => {
        if (result.drinks) {
          this.cocktails = result.drinks.map((cocktail: any) => ({
            ...cocktail,
            ingredients: this.extractIngredients(cocktail)
          }));
        } else {
          console.log('No se encontraron cócteles.');
          this.cocktails = [];
        }
      });
    } else if (this.searchType === 'ingredient') {
      console.log('Filtrando por ingrediente:', this.searchQuery);
      this.cocktails = [];
      this.cocktailService.filterCocktailByIngredient(this.searchQuery).subscribe(result => {
        if (result.drinks) {
          // Para evitar problemas con asincronía, usar Promise.all para obtener detalles completos
          const promises = result.drinks.map((drink: any) =>
            this.cocktailService.searchCocktailByName(drink.strDrink).toPromise()
          );

          Promise.all(promises).then(fullResults => {
            this.cocktails = fullResults
              .filter(res => res.drinks && res.drinks.length > 0)
              .map(res => {
                const cocktail = res.drinks[0];
                return {
                  ...cocktail,
                  ingredients: this.extractIngredients(cocktail)
                };
              });
          }).catch(error => {
            console.error('Error al obtener detalles completos:', error);
          });
        } else {
          console.log('No se encontraron cócteles con ese ingrediente.');
          this.cocktails = [];
        }
      });
    }
  }

  toggleDetails(cocktail: any) {
    cocktail.showDetails = !cocktail.showDetails;
  }

  // Extrae ingredientes y cantidades del objeto cocktail
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
