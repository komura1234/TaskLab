import { Component, computed, inject, input, output } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardTitle, IonCheckbox, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {ellipsisHorizontalOutline} from 'ionicons/icons'
import { Task } from '../../models/task';
import { TaskService } from '../../services/task/task.service';
import { CategoryService } from '../../services/category/category.service';
@Component({
  selector: 'app-detail-task',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.scss'],
  imports: [IonCard,IonCardContent,IonCardTitle,IonCheckbox,IonButton,IonIcon],
})
export class DetailTaskComponent {
  readonly tareasService= inject(TaskService)
  readonly categoryService=inject(CategoryService)
  readonly task=input.required<Task>();
  readonly opciones=output<Task>()
  readonly categoria=computed(()=>this.categoryService.items().find(c=>c.id===this.task().categoriaId) ?? null);

  constructor() {
    addIcons({ellipsisHorizontalOutline})
  }

  alternar(){
    this.tareasService.alternarCompletada(this.task().id)
  }
}
