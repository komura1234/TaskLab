import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, IonActionSheet, IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonNote, IonRefresher, IonRefresherContent, IonSearchbar, IonText, IonTitle, IonToolbar, ModalController, ToastController } from '@ionic/angular';
import { DetailTaskComponent } from '../../components/detail-task/detail-task.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ModalTaskComponent } from '../../components/modals/modal-task/modal-task.component';
import { FlagPipe } from '../../shared/pipes/flag-pipe';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task/task.service';
import { CategoryService } from '../../services/category/category.service';
import { RemoteService } from '../../core/config/remote-config/remote-service';

const TAMANO_PAGINA=20;

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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonActionSheet,
    FlagPipe,
    DetailTaskComponent]
})
export class TasksPage implements OnInit {
  private readonly modalController=inject(ModalController);
  private readonly alertController=inject(AlertController);
  private readonly toastController=inject(ToastController);
  readonly tareasService=inject(TaskService)
  readonly categoryService=inject(CategoryService)
  private readonly remote=inject(RemoteService)
  readonly busqueda=signal('');
  readonly filtroCategoria=signal<string>('todas');
  readonly limite=signal(TAMANO_PAGINA);
  readonly seleccionada=signal<Task|null>(null);

  readonly filtradas=computed(()=>{
    const q=this.busqueda().trim().toLowerCase();
    const f=this.filtroCategoria();
    return this.tareasService.items()
      .filter(t=>f==='todas' || (f==='sin' ? t.categoriaId===null : t.categoriaId===f))
      .filter(t=>!q || t.titulo.toLowerCase().includes(q))
      .sort((a,b)=>Number(a.completada)-Number(b.completada));
  });

  readonly visibles=computed(()=>this.filtradas().slice(0,this.limite()));
  readonly hayMas=computed(()=>this.visibles().length<this.filtradas().length);

  readonly botonesOpciones=[
    {text:'Editar',data:{action:'edit'}},
    {text:'Cambiar categoría',data:{action:'category'}},
    {text:'Eliminar',role:'destructive',data:{action:'delete'}},
    {text:'Cancelar',role:'cancel'},
  ];

  constructor() {
    addIcons({add})
  }

  ngOnInit() {
    this.tareasService.cargar();
    this.categoryService.cargar();
  }

  buscar(ev:Event){
    this.busqueda.set((ev as CustomEvent).detail.value ?? '');
    this.limite.set(TAMANO_PAGINA);
  }

  filtrar(categoria:string){
    this.filtroCategoria.set(categoria);
    this.limite.set(TAMANO_PAGINA);
  }

  cargarMas(ev:Event){
    this.limite.update(n=>n+TAMANO_PAGINA);
    (ev as InfiniteScrollCustomEvent).target.complete();
  }

  async refrescar(ev:Event){
    await Promise.all([
      this.remote.refrescar()
    ]);
    (ev as CustomEvent).detail.complete()
  }

  abrirOpciones(task:Task){
    this.seleccionada.set(task);
  }

  onOpcion(ev:Event){
    const task=this.seleccionada();
    this.seleccionada.set(null);
    if(!task) return;
    const action=(ev as CustomEvent).detail.data?.action
    if(action==='edit') this.openModalRegister(task)
    if(action==='category') this.cambiarCategoria(task)
    if(action==='delete') this.eliminar(task)
  }

  async openModalRegister(task?:Task) {
    const modal = await this.modalController.create({
      component: ModalTaskComponent,
      componentProps: { task: task ?? null },
      presentingElement: document.querySelector('ion-tabs') ?? undefined,
    });
    await modal.present();

    const { role } = await modal.onWillDismiss();

    if(role === 'confirm') await this.avisar(task?'Tarea actualizada':'Tarea creada',true)
  }

  private async eliminar(task:Task){
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

  private async cambiarCategoria(task:Task){
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
