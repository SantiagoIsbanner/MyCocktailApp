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

  constructor() {}

  ngOnInit() {
  }
 

}

