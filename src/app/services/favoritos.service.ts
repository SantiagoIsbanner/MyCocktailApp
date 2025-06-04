import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private storageKey = 'favoritos';

  async getFavoritos(): Promise<any[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async addFavorito(id: string, source: 'api' | 'firestore') {
    const favoritos = await this.getFavoritos();
    if (!favoritos.find(fav => fav.id === id)) {
      favoritos.push({ id, source });
      localStorage.setItem(this.storageKey, JSON.stringify(favoritos));
    }
  }

  async removeFavorito(id: string) {
    const favoritos = await this.getFavoritos();
    const nuevos = favoritos.filter(fav => fav.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(nuevos));
  }

  async isFavorito(id: string): Promise<boolean> {
    const favoritos = await this.getFavoritos();
    return favoritos.some(fav => fav.id === id);
  }
}

