import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonList, IonNote, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar, ModalController, ToastController } from '@ionic/angular';
import { DetailTaskComponent } from '../../components/detail-task/detail-task.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ModalTaskComponent } from '../../components/modals/modal-task/modal-task.component';
import { FlagPipe } from '../../shared/pipes/flag-pipe';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  imports: [IonContent, 
    IonHeader, 
    IonGrid,
    IonCol,
    IonNote,
    IonSearchbar,
    IonRow,
    IonTitle, 
    IonToolbar,
    IonCard, 
    IonCardTitle,
    IonText,
    IonChip,
    IonList,
    IonCardSubtitle,
    IonCardHeader,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonIcon,
    CommonModule, 
    FormsModule,
    FlagPipe,
    DetailTaskComponent]
})
export class TasksPage implements OnInit {
   private toastController=inject(ToastController);
   readonly tareasService=inject(TaskService)
  constructor(private modalController:ModalController) { 
    addIcons({add})
  }

  ngOnInit() {
  }


  async openModalRegister(task?:Task) {
    const modal = await this.modalController.create({
      component: ModalTaskComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if(role === 'confirm'){
      const toast= await this.toastController.create({
        message:task?'Tarea acutalizada':'Tarea Creada',
        color:'success',
        duration:1500
    })
      toast.present();
    }
    
  }

}
