import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, MinLengthValidator } from '@angular/forms';
import { IonContent, IonButton, IonFab, IonFabButton, IonIcon, IonLabel, IonItem, IonItemSliding, IonList, IonItemOptions, IonItemOption, IonAvatar, IonChip } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import { AddUpdateMiniatureComponent } from 'src/app/shared/components/add-update-miniature/add-update-miniature.component';
import { Miniature } from 'src/app/models/miniature.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonChip, IonAvatar, IonItemOption, IonItemOptions, IonList, IonItemSliding, IonItem, IonLabel, IonIcon, IonFabButton, IonFab, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class HomePage implements OnInit {
  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService)
  miniatures: Miniature[] = [];
  constructor() { addIcons({createOutline,trashOutline,add}); }

  ngOnInit() {
  }

  // signOut() {
  //   this.firebaseService.signOut().then(() => {
  //     this.utilsService.routerLink('/auth');
  //   });
  // }

  async getMiniatures() {
    const user = this.utilsService.getLocalStorageUser();
    const path: string = `users/${user.uid}/miniatures`;

    let sub = (await this.firebaseService.getCollectionData(path)).subscribe({
      next: (res: any) => {
        sub.unsubscribe();

        this.miniatures = res;
      },
    });
  }

  addUpdateMiniature( miniature? :Miniature) {
    this.utilsService.presentModal({component: AddUpdateMiniatureComponent, cssClass: "add-update-modal", componentProps: {miniature}})
  }
  
  ionViewWillEnter() {
    this.getMiniatures();
  }
  
}
