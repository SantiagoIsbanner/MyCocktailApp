import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddEditBebidaComponent } from 'src/app/components/agregar-bebida/add-edit-bebida.component';
import { BebidasService } from 'src/app/services/bebida.service';
import { Bebida } from 'src/app/models/bebida.model';
import { CocktailService } from 'src/app/services/cocktail.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page {
searchType: string = 'name'; // Por defecto, busca por nombre
searchQuery: string = ''; // Input del usuario
cocktails: any[] = []; // Lista de resultados
isModalOpen: boolean = false;
selectedCocktail: any = null;
cocktailIngredients: { ingredient: string, measure: string }[] = [];
randomCocktail: any = null;

  constructor(private authService:AuthService, private bebidasService: BebidasService, private modalCtrl: ModalController, private cocktailService:CocktailService, private favoritosService: FavoritosService, private alertController: AlertController) { }

 

searchCocktail() {
  if (!this.searchQuery.trim()) {
    console.log("El campo de búsqueda está vacío.");
    return;
  }
  
   this.cocktails = [];
  this.selectedCocktail = null;

  if (this.searchType === 'name') {
    console.log("Buscando por nombre:", this.searchQuery);
    this.cocktailService.searchCocktailByName(this.searchQuery).subscribe(result => {
      if (result.drinks) {
        this.cocktails = result.drinks.map((cocktail: any) => ({
          ...cocktail,
          ingredients: this.extractIngredients(cocktail) // 🔥 Extraer ingredientes
        }));
      } else {
        console.log("No se encontraron cócteles.");
        this.cocktails = [];
      }
    });
  } else if (this.searchType === 'ingredient') {
    console.log("Filtrando por ingrediente:", this.searchQuery);
  this.cocktailService.filterCocktailByIngredient(this.searchQuery).subscribe(result => {
  if (result.drinks) {
    result.drinks.forEach((drink: any) => {
      this.cocktailService.searchCocktailByName(drink.strDrink).subscribe(fullResult => {
        if (fullResult.drinks) {
          this.cocktails.push({
            ...fullResult.drinks[0],
            ingredients: this.extractIngredients(fullResult.drinks[0])
          });
        }
      });
    });
  } else {
    console.log("No se encontraron cócteles con ese ingrediente.");
    this.cocktails = [];
  }
});
  }
}

toggleDetails(cocktail: any) {
  cocktail.showDetails = !cocktail.showDetails;
}


// 🔥 Función para extraer ingredientes y cantidades
extractIngredients(cocktail: any): { ingredient: string; quantity: string }[] {

  const ingredients: { ingredient: string; quantity: string }[] = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push({
        ingredient: ingredient,
        quantity: measure ? measure : "Cantidad no especificada"
      });
    }
  }

  return ingredients;
}

getRandomCocktail() {
  this.cocktailService.getRandomCocktail().subscribe(
    (data) => {
      this.randomCocktail = data.drinks[0];
      this.cocktailIngredients = [];

      // Extraer ingredientes y medidas del objeto de la API
      for (let i = 1; i <= 15; i++) {
        const ingredient = this.randomCocktail[`strIngredient${i}`];
        const measure = this.randomCocktail[`strMeasure${i}`];

        if (ingredient) {
          this.cocktailIngredients.push({
            ingredient,
            measure: measure ? measure.trim() : ''
          });
        }
      }
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
      ...cocktail,  // Copia todos los datos del cóctel
      ingredients: this.extractIngredients(cocktail)  // 🔥 Extraer ingredientes correctamente
    };
  }
}





}