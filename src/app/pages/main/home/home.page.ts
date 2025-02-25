import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonLabel, IonItem, IonItemSliding, IonList, IonItemOptions, IonItemOption, IonAvatar, IonChip, IonSkeletonText, IonRefresher, IonRefresherContent, RefresherEventDetail, IonCard } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline, bodyOutline } from 'ionicons/icons';
import { Personaje } from 'src/app/models/personaje.model';
import { User } from 'src/app/models/user.model';
import { SupabaseService } from 'src/app/services/supabase.service';
import { QueryOptions } from '../../../services/query-options.interface';
import { IonRefresherCustomEvent } from '@ionic/core';
import { AddUpdatePersonajeComponent } from 'src/app/shared/components/add-update-personaje/add-update-personaje.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCard, IonRefresherContent, IonRefresher, IonSkeletonText, IonChip, IonAvatar, IonItemOption, IonItemOptions, IonList, IonItemSliding, IonItem, IonLabel, IonIcon, IonFabButton, IonFab, IonContent, CommonModule, FormsModule, HeaderComponent]
})

export class HomePage implements OnInit {
  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  supabaseService = inject(SupabaseService);
  personajes: Personaje[] = []; // Cambié "miniatures" a "personajes"
  loading: boolean = false;

  constructor() {
    addIcons({ createOutline, trashOutline, bodyOutline, add });
  }

  ngOnInit() {}

  async getPersonajes() { // Cambié "getMiniatures" a "getPersonajes"
    this.loading = true;
    const user = this.utilsService.getLocalStorageUser();
    const path: string = `users/${user.uid}/personajes`; // Cambié la ruta para personajes
    const queryOptions: QueryOptions = { orderBy: { field: "strength", direction: "desc" } };

    let timer: any;

    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        sub.unsubscribe();
      }, 5000);
    };

    let sub = (await this.firebaseService.getCollectionData(path, queryOptions)).subscribe({
      next: (res: any) => {
        console.log("Recibido cambio");
        console.log(res);
        this.personajes = res; // Cambié "miniatures" a "personajes"
        this.loading = false;
        resetTimer();
      },
    });
  }

  async addUpdatePersonaje(personaje?: Personaje) { // Cambié "addUpdateMiniature" a "addUpdatePersonaje"
    let success = await this.utilsService.presentModal({ component: AddUpdatePersonajeComponent, cssClass: "add-update-modal", componentProps: { personaje } });
    if (success) {
      this.getPersonajes(); // Cambié "getMiniatures" a "getPersonajes"
    }
  }

  ionViewWillEnter() {
    this.getPersonajes(); // Cambié "getMiniatures" a "getPersonajes"
  }

  confirmDeletePersonaje(personaje: Personaje) { // Cambié "confirmDeleteMiniature" a "confirmDeletePersonaje"
    this.utilsService.presentAlert({
      header: 'Eliminar Personaje',
      message: '¿Está seguro de que desea eliminar el personaje?',
      buttons: [
        { text: 'No' },
        {
          text: 'Sí',
          handler: () => {
            this.deletePersonaje(personaje); // Cambié "deleteMiniature" a "deletePersonaje"
          }
        }
      ]
    });
  }

  async deletePersonaje(personaje: Personaje) { // Cambié "deleteMiniature" a "deletePersonaje"
    const loading = await this.utilsService.loading();
    await loading.present();

    const user: User = this.utilsService.getLocalStorageUser();
    const path: string = `users/${user.uid}/personajes/${personaje.id}`; // Cambié la ruta para personajes

    const imagePath = this.supabaseService.getFilePath(personaje.image);
    await this.supabaseService.deleteFile(imagePath!);

    this.firebaseService.deleteDocument(path).then(res => {
      this.personajes = this.personajes.filter(listedPersonaje => listedPersonaje.id !== personaje.id); // Cambié "miniatures" a "personajes"
      this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Personaje borrado exitosamente", // Cambié "Miniatura" a "Personaje"
        position: "middle",
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      this.utilsService.presentToast({
        color: "danger",
        duration: 2500,
        message: error.message,
        position: "middle",
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getPersonajes(); // Cambié "getMiniatures" a "getPersonajes"
      event.target.complete();
    }, 2000);
  }

}
