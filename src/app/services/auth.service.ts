import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

import { getAuth, User } from 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth:AngularFireAuth) { }
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

  getCurrentUser() {
  return new Promise((resolve, reject) => {
    this.afAuth.onAuthStateChanged(user => {
      resolve(user);
    });
  });
}

getUserId(): string | null {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    return user ? user.uid : null; // 🔥 Devuelve el UID del usuario o `null` si no está autenticado
  }

}
