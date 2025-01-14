import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);

  loading() {
    return this.loadingController.create( {spinner: "crescent" })
  }

  async presentToast(toastOptions? :ToastOptions | undefined) {
    const toast = await this.toastController.create(toastOptions);
    toast.present()
  }

  constructor() { }
}
