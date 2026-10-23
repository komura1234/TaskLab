import { Component, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRadio, IonRadioGroup, IonText, IonTextarea, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipse } from 'ionicons/icons';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss'],
  imports: [IonHeader,IonToolbar,IonButtons,IonContent,IonItem,IonInput,IonButton,IonTitle,IonCard,IonCardContent,IonTextarea,IonText,IonList,IonRadioGroup,IonRadio,IonIcon],
})
export class ModalTaskComponent  implements OnInit {

  constructor(private modalController:ModalController) {
    addIcons({ellipse})
   }

  ngOnInit() {}
  
  cancel(){
    this.modalController.dismiss()
  }


  confirm(){
    this.modalController.dismiss()
  }
}
