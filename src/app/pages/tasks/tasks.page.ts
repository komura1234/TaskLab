import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonNote, IonRefresher, IonRefresherContent, IonSearchbar, IonText, IonTitle, IonToolbar, ModalController, ToastController } from '@ionic/angular';
import { DetailTaskComponent } from '../../components/detail-task/detail-task.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ModalTaskComponent } from '../../components/modals/modal-task/modal-task.component';
import { FlagPipe } from '../../shared/pipes/flag-pipe';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task/task.service';
import { CategoryService } from '../../services/category/category.service';
import { RemoteService } from '../../core/config/remote-config/remote-service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  imports: [IonContent,
    IonHeader,
    IonNote,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    IonText,
    IonChip,
    IonFab,
    IonFabButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    FlagPipe,
    DetailTaskComponent]
})
export class TasksPage implements OnInit {
  private readonly modalController=inject(ModalController);
  private readonly toastController=inject(ToastController);
  readonly tareasService=inject(TaskService)
  readonly categoryService=inject(CategoryService)
  private readonly remote=inject(RemoteService)
  readonly busqueda=signal('');
  readonly filtroCategoria=signal<string>('todas');

  readonly filtradas=computed(()=>{
    const q=this.busqueda().trim().toLowerCase();
    const f=this.filtroCategoria();
    return this.tareasService.items()
      .filter(t=>f==='todas' || (f==='sin' ? t.categoriaId===null : t.categoriaId===f))
      .filter(t=>!q || t.titulo.toLowerCase().includes(q))
      .sort((a,b)=>Number(a.completada)-Number(b.completada));
  });

  constructor() {
    addIcons({add})
  }

  ngOnInit() {
    this.tareasService.cargar();
    this.categoryService.cargar();
  }

  buscar(ev:Event){
    this.busqueda.set((ev as CustomEvent).detail.value ?? '');
  }

  async refrescar(ev:Event){
    await Promise.all([
      this.remote.refrescar()
    ]);
    (ev as CustomEvent).detail.complete()
  }

  async openModalRegister(task?:Task) {
    const modal = await this.modalController.create({
      component: ModalTaskComponent,
      componentProps: { task: task ?? null },
      presentingElement: document.querySelector('ion-tabs') ?? undefined,
    });
    await modal.present();

    const { role } = await modal.onWillDismiss();

    if(role === 'confirm'){
      const toast= await this.toastController.create({
        message:task?'Tarea actualizada':'Tarea creada',
        color:'success',
        duration:1500
      })
      await toast.present();
    }
  }

}
