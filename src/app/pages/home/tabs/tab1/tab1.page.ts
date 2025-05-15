import { Component, OnInit } from '@angular/core';
import { CocktailService } from 'src/app/services/cocktail.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  
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
