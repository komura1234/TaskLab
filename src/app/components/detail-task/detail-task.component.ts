import { Component, computed, inject, input, output } from '@angular/core';
import { AlertController, IonActionSheet, IonButton, IonCard, IonCardContent, IonCardTitle, IonCheckbox, IonIcon, IonText, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {ellipsisHorizontalOutline} from 'ionicons/icons'
import { Task } from '../../models/task';
import { TaskService } from '../../services/task/task.service';
import { CategoryService } from '../../services/category/category.service';
@Component({
  selector: 'app-detail-task',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.scss'],
  imports: [IonCard,IonCardContent,IonCardTitle,IonText,IonCheckbox,IonButton,IonIcon,IonActionSheet],
})
export class DetailTaskComponent {
  private readonly alertController=inject(AlertController);
  private readonly toastController=inject(ToastController);
  readonly tareasService= inject(TaskService)
  readonly categoryService=inject(CategoryService)
  readonly task=input.required<Task>();
  readonly editar=output<Task>()
  readonly categoria=computed(()=>this.categoryService.items().find(c=>c.id===this.task().categoriaId) ?? null);

  public isActionSheetOpen = false;
  public actionSheetButtons=[
    {
      text: 'Editar',
      data: {
        action: 'edit',
      },
    },
    {
      text: 'Cambiar categoría',
      data: {
        action: 'category',
      },
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
    },
  ]

  constructor() {
    addIcons({ellipsisHorizontalOutline})
  }

  setOpen(opened:boolean){
    this.isActionSheetOpen=opened
  }

  onAction(ev:Event){
    this.setOpen(false);
    const action=(ev as CustomEvent).detail.data?.action
    if(action==='edit') this.editar.emit(this.task())
    if(action==='category') this.cambiarCategoria()
    if(action==='delete') this.eliminar()
  }

  alternar(){
    this.tareasService.alternarCompletada(this.task().id)
  }

  private async eliminar(){
    const task=this.task();
    const alert=await this.alertController.create({
      header:'Eliminar tarea',
      message:`¿Eliminar "${task.titulo}"?`,
      buttons:[
        {text:'Cancelar',role:'cancel'},
        {text:'Eliminar',role:'destructive'},
      ],
    });
    await alert.present();

    const {role}=await alert.onDidDismiss();
    if(role!=='destructive') return;

    const ok=await this.tareasService.eliminar(task.id);
    await this.avisar(ok?'Tarea eliminada':this.tareasService.error() ?? 'No se pudo eliminar',ok);
  }

  private async cambiarCategoria(){
    const task=this.task()

    const alert=await this.alertController.create({
      header:'Cambiar categoría',
      inputs:[
        {type:'radio',label:'Sin categoría',value:null,checked:task.categoriaId===null},
        ...this.categoryService.items().map(c=>({type:'radio' as const,label:c.nombre,value:c.id,checked:task.categoriaId===c.id})),
      ],
      buttons:[
        {text:'Cancelar',role:'cancel'},
        {text:'Guardar',role:'confirm'},
      ],
    });
    await alert.present();
    const {data,role}=await alert.onDidDismiss();

    if(role!=='confirm') return

    const categoriaId=(data?.values ?? null) as string|null;
    
    if(categoriaId===task.categoriaId) return;
    const ok=await this.tareasService.cambiarCategoria(task.id,categoriaId);
    await this.avisar(ok?'Categoría actualizada':this.tareasService.error() ?? 'No se pudo cambiar la categoría',ok)
  }

  private async avisar(message:string,ok:boolean){
    const toast=await this.toastController.create({message,color:ok?'success':'danger',duration:1500})
   
    await toast.present()
  }
}
