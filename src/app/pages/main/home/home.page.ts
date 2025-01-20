import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { AddUpdateMiniatureComponent } from 'src/app/shared/components/add-update-miniature/add-update-miniature.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class HomePage implements OnInit {
  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService)
  constructor() { addIcons({add}); }

  ngOnInit() {
  }

  signOut() {
    this.firebaseService.signOut().then(() => {
      this.utilsService.routerLink('/auth');
    });
  }

  addUpdateMiniature() {
    this.utilsService.presentModal({component: AddUpdateMiniatureComponent, cssClass: "add-update-modal"})
  }
}
