import { Component, inject, input, output } from '@angular/core';
import { AlertController, IonButton, IonIcon, IonItem, IonLabel, IonList, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline, pricetagOutline, trashOutline } from 'ionicons/icons';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category/category.service';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-detail-categorias',
  templateUrl: './detail-categorias.component.html',
  styleUrls: ['./detail-categorias.component.scss'],
  imports: [IonList, IonItem, IonLabel, IonButton, IonIcon],
})
export class DetailCategoriasComponent {
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);
  readonly categorias = input.required<Category[]>();
  readonly filtrando = input(false);
  readonly editar = output<Category>();

  constructor() {
    addIcons({ createOutline, pricetagOutline, trashOutline });
  }

  textoTareas(id: string): string {
    const n = this.taskService.conteoPorCategoria().get(id) ?? 0;
    return n === 1 ? '1 tarea' : `${n} tareas`;
  }

  async eliminar(categoria: Category) {
    const n = this.taskService.conteoPorCategoria().get(categoria.id) ?? 0;
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: n
        ? `"${categoria.nombre}" tiene ${this.textoTareas(categoria.id)}. Quedarán sin categoría.`
        : `¿Eliminar "${categoria.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'destructive') return;

    const ok = await this.categoryService.eliminar(categoria.id);
    if (ok && n) await this.taskService.quitarCategoria(categoria.id);
    const toast = await this.toastController.create({
      message: ok ? 'Categoría eliminada' : this.categoryService.error() ?? 'No se pudo eliminar',
      color: ok ? 'success' : 'danger',
      duration: 1500,
    });
    await toast.present();
  }
}
