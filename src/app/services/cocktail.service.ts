import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private alcoholUrl='https://www.thecocktaildb.com/api/json/v1/1/random.php';
  private nonAlcoholUrl= 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';

  constructor(private http: HttpClient, private firestore:AngularFirestore) {}
  getAlcoholicCocktail(){
    return this.http.get(this.alcoholUrl);
  }
  async getNonAlcoholicCocktail(){
    const response = await this.http.get(this.nonAlcoholUrl).toPromise();
    const drinks = (response as any).drinks;
    const randomIndex= Math.floor(Math.random()* drinks.length);
    return drinks[randomIndex];
  }

  async getDailyCocktails(){
    const doc=await this.firestore.collection('dailyCocktails').doc('today').get().toPromise();
    const data= (doc as any).data();
    const today = new Date().toISOString().split('T')[0];
    if(data && data.date ===today){
      return data;
    }
    else {
      const alcoholResponse = await this.http.get<{ drinks: any[] }>(this.alcoholUrl).toPromise();
      const nonAlcoholResponse = await this.http.get<{ drinks: any[] }>(this.nonAlcoholUrl).toPromise();
  
      if (!alcoholResponse?.drinks || !nonAlcoholResponse?.drinks) {
        throw new Error('No se pudieron obtener las bebidas');
      }
  
      const newData = {
        date: today,
        alcoholic: alcoholResponse.drinks[0], // ✅ Solo accede si existe
        nonAlcoholic: nonAlcoholResponse.drinks[Math.floor(Math.random() * nonAlcoholResponse.drinks.length)]
      };

      await this.firestore.collection('dailyCocktails').doc('today').set(newData);
      return data;
      }

    }
  
  }

 

