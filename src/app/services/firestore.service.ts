import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, DocumentReference } from '@angular/fire/firestore';
import { collection,  getDocs, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Bebida } from '../models/bebida.model';
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}
//Guarda la bebida en firestore
  async saveDailyCocktail(data: any): Promise<void> {
    const todayId = this.getTodayId(); // e.g., '2025-05-18'
    const docRef: DocumentReference = doc(this.firestore, `dailyCocktail/${todayId}`);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, data);
      console.log(`✅ Bebida del día guardada:`, todayId);
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

// Guardar una bebida en Firestore
  async saveBebida(bebida: Bebida): Promise<void> {
    const bebidaRef = doc(this.firestore, `bebidasComunidad/${bebida.nombre}`); 
    await setDoc(bebidaRef, bebida);
    console.log('✅ Bebida guardada en Firestore:', bebida.nombre);
  }

  // Obtener todas las bebidas desde Firestore
  getAllBebidas(): Observable<Bebida[]> {
    const bebidasRef = collection(this.firestore, 'bebidasComunidad');
    return collectionData(bebidasRef, { idField: 'id' }) as Observable<Bebida[]>;
  }

  // Eliminar una bebida por su ID
  async deleteBebida(id: number): Promise<void> {
  const bebidaRef = doc(this.firestore, `bebidasComunidad/${id}`);
  await deleteDoc(bebidaRef);
}
getAllBebidasComunidad(): Observable<Bebida[]> {
    const bebidasRef = collection(this.firestore, 'bebidasComunidad'); // 🔥 Referencia a la colección
    return collectionData(bebidasRef, { idField: 'id' }) as Observable<Bebida[]>;
  }

  
} 