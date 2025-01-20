import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { CustomInputComponent } from "../../../shared/components/custom-input/custom-input.component";
import { lockClosedOutline, mailOutline, bodyOutline, personOutline, alertCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LogoComponent } from "../../../shared/components/logo/logo.component";
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-miniature',
  templateUrl: './add-update-miniature.component.html',
  styleUrls: ['./add-update-miniature.component.scss'],
  imports: [RouterLink, IonIcon, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent, CustomInputComponent, ReactiveFormsModule, LogoComponent]
})
export class AddUpdateMiniatureComponent  implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    units: new FormControl('', [Validators.required, Validators.min(1)]),
    strength: new FormControl('', [Validators.required, Validators.min(0)]),
  })

  constructor() { addIcons({ mailOutline, lockClosedOutline, bodyOutline, alertCircleOutline, personOutline }); }

  ngOnInit() {
  }

  async submit() {

    const loading = await this.utilsService.loading();
    await loading.present();
    this.firebaseService.signUp(this.form.value as User).then(res => {
      this.firebaseService.updateUser(this.form.value.name!)
      let uid = res.user.uid;
    }).catch(error => {
      this.utilsService.presentToast({
        color: "danger",
        duration: 2500,
        message: error.message,
        position: "middle",
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }
}