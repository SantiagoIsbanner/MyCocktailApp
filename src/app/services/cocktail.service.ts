import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CocktailService {
 private BASE_URL='https://thecocktaildb.com/api/json/v1/1';

  constructor(private http:HttpClient ) { }
  getRandomCocktail(){
    return this.http.get<any>(`${this.BASE_URL}/random.php`)
  }
  searchCocktailByName(name: string)
  {
    return this.http.get<any>(`${this.BASE_URL}/search.php?s=${name}`);
  }
  filterCocktailByIngredient(ingredient: string){
    return this.http.get<any>(`${this.BASE_URL}/filter.php?i=${ingredient}`);
  }

} 

