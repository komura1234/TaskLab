import { Component, inject, input, OnInit } from '@angular/core';
import { NonNullableFormBuilder,ReactiveFormsModule,Validators } from '@angular/forms';
import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRadio, IonRadioGroup, IonText, IonTextarea, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipse } from 'ionicons/icons';
import { TaskService } from '../../../services/task/task.service';
import { CategoryService } from '../../../services/category/category.service';
import { REGLAS } from '../../../shared/validations/reglas';
import { noSoloEspacios } from '../../../shared/validations/validators';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss'],
  imports: [ReactiveFormsModule,IonHeader,IonToolbar,IonButtons,IonContent,IonItem,IonInput,IonButton,IonTitle,IonCard,IonCardContent,IonTextarea,IonText,IonList,IonRadioGroup,IonRadio,IonIcon],
})
export class ModalTaskComponent  implements OnInit {
  private readonly modalController=inject(ModalController);
  private readonly fBuilder=inject(NonNullableFormBuilder);
  readonly taskService=inject(TaskService)
  readonly categoryService=inject(CategoryService)
  readonly task= input<Task | null>(null);
  readonly reglas=REGLAS
  readonly form=this.fBuilder.group({
    titulo:['',[Validators.required,Validators.minLength(REGLAS.titulo.min),Validators.maxLength(REGLAS.titulo.max),noSoloEspacios]],
    descripcion:['',[Validators.maxLength(REGLAS.descripcion.max)]],
    categoriaId: this.fBuilder.control<string |null>(null),
  })

  errorMessage(campo:'titulo'|'descripcion'):string{
    const d=this.form.controls[campo].errors;
    if(!d)return'';
    if(d['required'] || d['soloEspacios']) return 'Campo Obligatorio'
    if(d['minlength']) return `Minimo ${d['minlength'].requiredLength} caracteres`;
    if(d['maxlength']) return `Maximo ${d['maxlength'].requiredLength} caracteres`;
    return 'Ingrese un Valor Valido';
  }

  constructor() {
    addIcons({ellipse})
   }

  ngOnInit() {
    this.categoryService.cargar()
    const tsk= this.task()
    if(tsk) this.form.patchValue({titulo:tsk.titulo,descripcion:tsk.descripcion,categoriaId:tsk.categoriaId})
  }
  
  cancel(){
    this.modalController.dismiss()
  }


  async confirm(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    const task= this.task()
    const resp= await this.taskService.guardar({
      id: task?.id??crypto.randomUUID(),
      completada:task?.completada ??false,
      ...this.form.getRawValue(),
    });
    if(resp) this.modalController.dismiss(null,'confirm')
  }
}
