import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonAvatar, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { HeaderComponent } from "../header/header.component";
import { CustomInputComponent } from "../custom-input/custom-input.component";
import { lockClosedOutline, mailOutline, bodyOutline, personOutline, alertCircleOutline, imageOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Personaje } from 'src/app/models/personaje.model'; // Aquí cambió "miniature" a "personaje"


@Component({
  selector: 'app-add-update-personaje',  // Cambié el nombre de "miniature" por "personaje"
  templateUrl: './add-update-personaje.component.html',
  styleUrls: ['./add-update-personaje.component.scss'],
  imports: [IonAvatar, IonIcon, IonButton, IonContent, CommonModule, FormsModule, HeaderComponent, CustomInputComponent, ReactiveFormsModule, IonItem, IonLabel, IonSelectOption]
})
export class AddUpdatePersonajeComponent implements OnInit {  // Cambié el nombre del componente
  @Input() personaje: Personaje | null = null;  // Aquí también se cambió "miniature" por "personaje"
  
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);
  user: User = {} as User;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    animeName: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    image: new FormControl(''),
  });
  

  constructor() { 
    addIcons({ mailOutline, lockClosedOutline, bodyOutline, alertCircleOutline, personOutline, imageOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.user = this.utilsService.getLocalStorageUser();
    if (this.personaje) {
      this.form.setValue({
        ...this.personaje,
        animeName: this.personaje.animeName || '',
        genre: this.personaje.genre || ''
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
      this.updatePersonaje();  // Se cambió el nombre de "updateMiniature" por "updatePersonaje"
    } else {
      this.createPersonaje();  // Se cambió el nombre de "createMiniature" por "createPersonaje"
    }
  }

  async createPersonaje() {  // Cambié "createMiniature" por "createPersonaje"
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/personajes`;  // Cambié "miniatures" por "personajes"

    const imageDataUrl = this.form.value.image;
    const imagePath = `${this.user.uid}/${Date.now()}`;
    const imageUrl = await this.supabaseService.uploadImage(imagePath, imageDataUrl!);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.name;

    this.firebaseService.addDocument(path, this.form.value).then(res => {
      this.utilsService.dismissModal({ success: true });
      this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Personaje añadido exitosamente",  // Mensaje modificado
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

  async updatePersonaje() {  // Cambié "updateMiniature" por "updatePersonaje"
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/personajes/${this.personaje!.id}`;  // Cambié "miniatures" por "personajes"

    if (this.form.value.image !== this.personaje!.image) {
      const imageDataUrl = this.form.value.image;
      const imagePath = this.supabaseService.getFilePath(this.personaje!.image);
      const imageUrl = await this.supabaseService.uploadImage(imagePath!, imageDataUrl!);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.name;

    this.firebaseService.updateDocument(path, this.form.value).then(res => {
      this.utilsService.dismissModal({ success: true });
      this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Personaje editado exitosamente",  // Mensaje modificado
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
