// firestore.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, DocumentReference } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}
//Guarda la bebida en firestore
  async saveDailyCocktail(data: any): Promise<void> {
    const todayId = this.getTodayId(); // e.g., '2025-05-18'
    const docRef: DocumentReference = doc(this.firestore, `dailycocktail/${todayId}`);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, data);
      console.log('✅ Daily cocktail guardado:', todayId);
    }
  }
//Obtiene la fecha del dia
  private getTodayId(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
  }
//Metodo que sera llamado desde el home para mostrar la bebida en
  async getTodayCocktail(): Promise<any | null> {
  const todayId = this.getTodayId();
  const docRef = doc(this.firestore, `dailycocktail/${todayId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}
} 