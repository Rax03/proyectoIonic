import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);

  loading() {
    return this.loadingController.create( {spinner: "crescent" })
  }

  async presentToast(toastOptions? :ToastOptions | undefined) {
    const toast = await this.toastController.create(toastOptions);
    toast.present()
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  getFromLocalStorage(key: string) {
    const valueString = localStorage.getItem(key);
    return valueString ? JSON.parse(valueString) : valueString;
  }

  constructor() { }
}
