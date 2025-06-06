import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Servicio para interactuar con la API de TheCocktailDB.
 * Permite obtener cócteles aleatorios, buscar por nombre y filtrar por ingrediente.
 */
@Injectable({ providedIn: 'root' }) // Define que el servicio está disponible en toda la aplicación
export class CocktailService {
  
  private BASE_URL = 'https://thecocktaildb.com/api/json/v1/1'; // URL base de la API de cócteles

  constructor(private http: HttpClient) {} // Inyección del servicio HTTP para realizar peticiones

  /**
   * Obtiene un cóctel aleatorio desde la API.
   * @returns Observable con los datos del cóctel aleatorio.
   */
  getRandomCocktail() {
    return this.http.get<any>(`${this.BASE_URL}/random.php`);
  }

  /**
   * Busca cócteles por nombre en la API.
   * @param name - Nombre del cóctel a buscar.
   * @returns Observable con los cócteles que coinciden con el nombre.
   */
  searchCocktailByName(name: string) {
    return this.http.get<any>(`${this.BASE_URL}/search.php?s=${name}`);
  }

  /**
   * Filtra cócteles por ingrediente.
   * @param ingredient - Nombre del ingrediente.
   * @returns Observable con los cócteles que contienen ese ingrediente.
   */
  filterCocktailByIngredient(ingredient: string) {
    return this.http.get<any>(`${this.BASE_URL}/filter.php?i=${ingredient}`);
  }
}
