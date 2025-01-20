import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, UserCredential } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { UnsubscriptionError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  constructor() { }


  signIn(user: User): Promise<UserCredential> {
    return signInWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );
    }


  signUp(user: User): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      user.email,
      user.password
    );
  }

  async signOut() {
    await this.auth.signOut();
    localStorage.removeItem('user');
  }

  async updateUser(displayName: string) {
    const user = await this.auth.currentUser;
    if (user) {
      // Actualiza el perfil del usuario
      await updateProfile(user, { displayName: displayName });
    }
  }

  setDocument(path: string, data: any) {
    return setDoc(doc(this.firestore, path), data)
  }

  async getDocument(path: string) {
    const docSnap = await getDoc(doc(this.firestore, path));
    return docSnap.data();
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async isAuthenticated() {
    const userExists: boolean = await new Promise((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve (true);
        } else {
          resolve (false);
        }
      })
    })
    return userExists;
  }
}
