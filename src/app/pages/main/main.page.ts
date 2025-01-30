import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRouterOutlet, IonMenu, IonMenuToggle, IonLabel, IonItem, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, pizza, logOutOutline, personCircleOutline } from 'ionicons/icons';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonFooter, IonIcon, IonItem, IonLabel, IonRouterOutlet, IonContent, CommonModule, FormsModule, IonMenu, IonMenuToggle, RouterLink, HeaderComponent, RouterLinkActive]
})
export class MainPage implements OnInit {
  user: User;
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService)
  pages = [
    {
      title: "Inicio",
      url: "/main/home",
      icon: "home-outline"
    },
    {
      title: "Perfil",
      url: "/main/profile",
      icon: "person-outline"
    },
  ]

  constructor() {
    addIcons({ logOutOutline, pizza, homeOutline, personOutline, personCircleOutline });
    this.user = this.utilsService.getLocalStorageUser();
  }

  signOut() {
    this.firebaseService.signOut().then(() => { this.utilsService.routerLink("/auth") })
  }

  ngOnInit() {
  }

}
