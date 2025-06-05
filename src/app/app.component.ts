import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, 
})
export class AppComponent {


  constructor() {

    this.setInitialAppTheme();

  }

  setInitialAppTheme() { // Setea el tema inicial de la aplicación
    // Verifica si hay un tema guardado en localStorage, si no, usa 'light' como tema por defecto

    const savedTheme = localStorage.getItem('theme') || 'light'; // 'light' es el tema por defecto
    // Aplica el tema al body del documento
    document.body.setAttribute('data-theme', savedTheme);// Establece el tema en el body
    // Si el tema es 'dark', establece la clase 'dark' en el body

  }
}
