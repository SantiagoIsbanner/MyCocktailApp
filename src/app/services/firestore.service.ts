import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, DocumentReference } from '@angular/fire/firestore';
import { collection, getDocs, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Bebida } from '../models/bebida.model';

/**
 * Servicio para gestionar la interacción con Firestore.
 * Permite guardar, obtener y eliminar bebidas y gestionar la "bebida del día".
 */
@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  
  constructor(private firestore: Firestore) {} // Inyección de Firestore para acceder a la base de datos

  /**
   * Guarda la bebida del día en Firestore, verificando si ya existe.
   * @param data - Datos de la bebida del día
   */
  async saveDailyCocktail(data: any): Promise<void> {
    const todayId = this.getTodayId(); // Obtiene la fecha actual en formato 'YYYY-MM-DD'
    const docRef: DocumentReference = doc(this.firestore, `dailycocktail/${todayId}`);

    const docSnap = await getDoc(docRef); // Obtiene el documento de Firestore
    if (!docSnap.exists()) { // Si no existe, lo guarda en la base de datos
      await setDoc(docRef, data);
      console.log(`✅ Bebida del día guardada:`, todayId);
    }
  }

  /**
   * Obtiene la fecha actual en formato 'YYYY-MM-DD'.
   * @returns String con la fecha del día.
   */
  private getTodayId(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Retorna la fecha con formato adecuado
  }

  /**
   * Obtiene la bebida del día desde Firestore.
   * @returns Datos de la bebida del día o `null` si no hay bebida guardada.
   */
  async getTodayCocktail(): Promise<any | null> {
    const todayId = this.getTodayId();
    const docRef = doc(this.firestore, `dailycocktail/${todayId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null; // Retorna los datos si existen, de lo contrario `null`
  }

  /**
   * Guarda una bebida en la colección de bebidas de la comunidad.
   * @param bebida - Objeto con los datos de la bebida a guardar.
   */
  async saveBebida(bebida: Bebida): Promise<void> {
    const bebidaRef = doc(this.firestore, `bebidasComunidad/${bebida.nombre}`); 
    await setDoc(bebidaRef, bebida);
    console.log('✅ Bebida guardada en Firestore:', bebida.nombre);
  }

  /**
   * Obtiene todas las bebidas de la comunidad desde Firestore.
   * @returns Observable con la lista de bebidas.
   */
  getAllBebidas(): Observable<Bebida[]> {
    const bebidasRef = collection(this.firestore, 'bebidasComunidad');
    return collectionData(bebidasRef, { idField: 'id' }) as Observable<Bebida[]>;
  }

  /**
   * Elimina una bebida por su ID en Firestore.
   * @param id - Identificador de la bebida a eliminar.
   */
  async deleteBebida(id: number): Promise<void> {
    const bebidaRef = doc(this.firestore, `bebidasComunidad/${id}`);
    await deleteDoc(bebidaRef);
  }

  /**
   * Obtiene todas las bebidas de la comunidad, con una referencia clara a la colección en Firestore.
   * @returns Observable con la lista de bebidas de la comunidad.
   */
  getAllBebidasComunidad(): Observable<Bebida[]> {
    const bebidasRef = collection(this.firestore, 'bebidasComunidad'); // Referencia a la colección
    return collectionData(bebidasRef, { idField: 'id' }) as Observable<Bebida[]>;
  }
}
