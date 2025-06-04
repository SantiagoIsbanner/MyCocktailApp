import { Component, OnInit } from '@angular/core';
import { CocktailService } from 'src/app/services/cocktail.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ModalController } from '@ionic/angular';
import { ModalPreparacionComponent } from 'src/app/components/modal-preparacion/modal-preparacion.component';

@Component({
  standalone: false,
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
    
  ) {}

 ngOnInit() {
  this.cargarDailyCocktail();
   
}
//obtiene una bebida aleatoria de la API, descompone sus atributos en campos para que puedan ser almacenados en la base de datos
//llamando al servicio de firestore
obtenerYGuardarDailyCocktail() {
  this.cocktailService.getRandomCocktail().subscribe({
    next: (res) => {
      const bebida = res?.drinks?.[0];
      if (bebida) {
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
      }
      
    },
    error: (err) => console.error('❌ Error al obtener bebida:', err),
  });
}
//Devuelve un listado con los ingredientes que lleva la bebida, evitando traer valores nulos
  extraerIngredientes(bebida: any): string[] {
  const ingredientes: string[] = [];
  for (let i = 1; i <= 15; i++) {
    const ingrediente = bebida[`strIngredient${i}`];
    if (ingrediente) {
      ingredientes.push(ingrediente);
    }
  }
  return ingredientes;
}
//llama al metodo getTodayCocktail desde el servicio firestore que luego se mostrara por pantalla
async cargarDailyCocktail() {
  this.bebidaDelDia = await this.firestoreService.getTodayCocktail();
}


async abrirModal() {
  const modal = await this.modalCtrl.create({
    component: ModalPreparacionComponent,
    componentProps: { bebida: this.bebidaDelDia }
  });
  await modal.present();
}
 

}
