import { Injectable } from '@angular/core';
import { Bebida } from '../models/bebida.model';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {
  private bebidas: Bebida[] = [];
  private storageKey = 'bebidas';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    this.bebidas = data ? JSON.parse(data) : [];
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.bebidas));
  }

  getAllBebidas(): Bebida[] {
    return [...this.bebidas]; // copia para evitar modificaciones externas
  }

  getBebidas(page: number, perPage: number): Bebida[] {
    const start = (page - 1) * perPage;
    return this.getAllBebidas().slice(start, start + perPage);
  }

  addBebida(bebida: Bebida) {
    bebida.id = this.generateNextId();
    this.bebidas.push(bebida);
    this.saveToStorage();
  }

  updateBebida(id: number, updated: Bebida) {
    const index = this.bebidas.findIndex(b => b.id === id);
    if (index > -1) {
      this.bebidas[index] = { ...updated, id }; // mantener el ID original
      this.saveToStorage();
    }
  }

  deleteBebida(id: number) {
    this.bebidas = this.bebidas.filter(b => b.id !== id);
    this.saveToStorage();
  }

  private generateNextId(): number {
    const ids = this.bebidas.map(b => b.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}
