import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);

  constructor() { }

  signIn(user :User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signUp(user :User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  async updateUser(displayName :string) {
    const user = await this.auth.currentUser;
    if (user) {
      await user.updateProfile ({ displayName: displayName});
    }
  }
}
