import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController, ToastOptions, ModalController, ModalOptions } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  modalController = inject(ModalController);
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

  urlTree(url: string) : UrlTree {
    return this.router.parseUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  getFromLocalStorage(key: string) {
    const valueString = localStorage.getItem(key);
    return valueString ? JSON.parse(valueString) : valueString;
  }

  async presentModal(modalOptions: ModalOptions) {
    const modal = await this.modalController.create(modalOptions);

    await modal.present();

    const { data } = await modal.onWillDismiss();

    return data ?? null;
  }

  dismissModal(data?: any) {
    return this.modalController.dismiss(data)
  }

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: "Seleccione una imagen",
      promptLabelPicture: "Saca una foto"
    });
  };
  getLocalStorageUser() {
    return this.getFromLocalStorage('user')
  }

  constructor() { }
}
