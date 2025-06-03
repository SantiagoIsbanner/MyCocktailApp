import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false, 
})
export class AppComponent {


  constructor() {

    this.setInitialAppTheme();  // Este método se encarga de establecer el tema inicial de la aplicación

  }


  // Verifica si hay un tema guardado en el localStorage, si no existe usa 'light' por defecto

  setInitialAppTheme() {

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme); // y aplica el tema al atributo data-theme del body

  }
}