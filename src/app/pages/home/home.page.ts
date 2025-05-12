import { Component } from '@angular/core';
import { CocktailService } from '../../services/cocktail.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  cocktails: any;
  constructor(private cocktailService: CocktailService, private authService:AuthService, private router:Router) {}

  ngOnInit() {
    this.cocktailService.getDailyCocktails().then(data => {
      this.cocktails = data;
    });
  }
 



  logout(){
    this.authService.logout()
    .then(()=>this.router.navigate(['/login']))
    .catch(error=>alert("Error al cerrar sesion: "+error.message))
  }
}

