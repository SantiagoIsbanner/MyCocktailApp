import { Injectable } from '@angular/core'; 
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importación de Firebase Authentication
import firebase from 'firebase/compat/app'; // Importación para autenticación con Google
import { getAuth, User } from 'firebase/auth'; // Obtiene el servicio de autenticación y modelo de usuario

/**
 * Este servicio maneja la autenticación de usuarios en Firebase,
 * permitiendo registro, inicio de sesión y autenticación con Google.
 */
@Injectable({
  providedIn: 'root' // Define que el servicio está disponible en toda la aplicación
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {} // Inyección del servicio de autenticación de Firebase

  /**
   * Inicia sesión con correo electrónico y contraseña.
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promesa con la autenticación del usuario
   */
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Registra un nuevo usuario con correo y contraseña.
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promesa con la información del nuevo usuario registrado
   */
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * Inicia sesión con Google utilizando Firebase Authentication.
   * @returns Promesa con la información del usuario autenticado con Google
   */
  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  /**
   * Cierra la sesión del usuario actual.
   * @returns Promesa que indica si la sesión se cerró correctamente
   */
  logout() {
    return this.afAuth.signOut();
  }

  /**
   * Obtiene el usuario actualmente autenticado en Firebase.
   * @returns Promesa que resuelve con el usuario actual o `null` si no hay sesión activa
   */
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged(user => {
        resolve(user); // Retorna el usuario autenticado si existe
      });
    });
  }

  /**
   * Obtiene el UID del usuario autenticado.
   * @returns UID del usuario o `null` si no está autenticado
   */
  getUserId(): string | null {
    const auth = getAuth(); // Obtiene la instancia de autenticación
    const user: User | null = auth.currentUser; // Obtiene el usuario actual
    return user ? user.uid : null; // Devuelve el UID del usuario si está autenticado
  }
}
