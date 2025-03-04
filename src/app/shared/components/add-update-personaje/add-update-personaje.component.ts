import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonAvatar, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { CustomInputComponent } from "../../../shared/components/custom-input/custom-input.component";
import { lockClosedOutline, mailOutline, bodyOutline, personOutline, alertCircleOutline, imageOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { SupabaseService } from 'src/app/services/supabase.service';

interface Personaje {
  id: string | null;
  name: string | null;
  image: string | null;
  animeName: string | null;
  gender: string | null;
}

@Component({
  selector: 'app-add-update-personaje',
  templateUrl: './add-update-personaje.component.html',
  styleUrls: ['./add-update-personaje.component.scss'],
  imports: [IonAvatar, IonIcon, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent, CustomInputComponent, ReactiveFormsModule, IonItem, IonLabel, IonSelect, IonSelectOption]
})
export class AddUpdatePersonajeComponent implements OnInit {
  @Input() personaje: Personaje | null = null;
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);
  user: User = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    animeName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    gender: new FormControl('', [Validators.required, Validators.minLength(0)]),
  });

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, bodyOutline, alertCircleOutline, personOutline, imageOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.user = this.utilsService.getLocalStorageUser();
    if (this.personaje) {
      this.form.setValue({
        id: this.personaje.id,
        name: this.personaje.name,
        image: this.personaje.image,
        animeName: this.personaje.animeName,
        gender: this.personaje.gender
      });
    }
  }

  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture("Imagen del personaje")).dataUrl;
    if (dataUrl) {
      this.form.controls.image.setValue(dataUrl);
    }
  }

  async submit() {
    if (this.personaje) {
      this.updatePersonaje();
    } else {
      this.createPersonaje();
    }
  }

  async createPersonaje() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/miniatures`;
    const imageDataUrl = this.form.value.image;
    const imagePath = `${this.user.uid}/${Date.now()}`;
    const imageUrl = await this.supabaseService.uploadImage(imagePath, imageDataUrl!);
    this.form.controls.image.setValue(imageUrl);
    delete this.form.value.id;

    this.firebaseService.addDocument(path, this.form.value).then(res => {
      this.utilsService.dismissModal({ success: true });
      this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Personaje añadido exitosamente",
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

  async updatePersonaje() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/miniatures/${this.personaje!.id}`;

    if (this.form.value.image !== this.personaje!.image) {
      const imageDataUrl = this.form.value.image;
      const imagePath = this.supabaseService.getFilePath(this.personaje?.image ?? '');
      const imageUrl = await this.supabaseService.uploadImage(imagePath!, imageDataUrl!);
      this.form.controls.image.setValue(imageUrl);
    }
    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value).then(res => {
      this.utilsService.dismissModal({ success: true });
      this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Personaje editado exitosamente",
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
}
