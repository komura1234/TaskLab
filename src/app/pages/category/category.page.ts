import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonNote, IonSearchbar, IonText, IonTitle, IonToolbar, ModalController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category/category.service';
import { TaskService } from '../../services/task/task.service';
import { ModalCategoryComponent } from '../../components/modals/modal-category/modal-category.component';
import { DetailCategoriasComponent } from '../../components/detail-categorias/detail-categorias.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonNote, IonSearchbar, IonContent, IonText, IonIcon, IonFab, IonFabButton, DetailCategoriasComponent],
})
export class CategoryPage implements OnInit {
  private readonly modalController = inject(ModalController);
  private readonly toastController = inject(ToastController);
  readonly categoryService = inject(CategoryService);
  readonly taskService = inject(TaskService);
  readonly busqueda = signal('');

  readonly filtradas = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.categoryService.items().filter(c => c.nombre.toLowerCase().includes(q));
  });

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
    this.categoryService.cargar();
    this.taskService.cargar();
  }

  buscar(ev: Event) {
    this.busqueda.set((ev as CustomEvent).detail.value ?? '');
  }

  async abrirModal(categoria?: Category) {
    const modal = await this.modalController.create({
      component: ModalCategoryComponent,
      componentProps: { categoria: categoria ?? null },
      presentingElement: document.querySelector('ion-tabs') ?? undefined,
    })


    await modal.present()
    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') await this.avisar(categoria ? 'Categoría actualizada' : 'Categoría creada', 'success');
  }

  private async avisar(message: string, color: 'success' | 'danger') {

    const toast = await this.toastController.create({ message, color, duration: 1500 });
    await toast.present();
  }
}
