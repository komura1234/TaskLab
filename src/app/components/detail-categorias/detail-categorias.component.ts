import { Component, OnInit } from '@angular/core';
import { IonActionSheet, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonChip, IonIcon, IonLabel, IonText } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detail-categorias',
  templateUrl: './detail-categorias.component.html',
  styleUrls: ['./detail-categorias.component.scss'],
   imports: [IonCard,IonCardHeader,IonCardContent,IonCardTitle,IonCardSubtitle,IonText,IonChip,IonLabel,IonCheckbox,IonButton,IonIcon,IonActionSheet],
 
})
export class DetailCategoriasComponent  implements OnInit {

 public isActionSheetOpen = false;
  public actionSheetButtons=[
        {
      text: 'Eliminar',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Editar',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cambiar Cateogira',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    }
  ]

  setOpen(opened:boolean){
    this.isActionSheetOpen=opened
  }
  constructor() { 
    addIcons({ellipsisHorizontalOutline})
  }

  ngOnInit() {}
}
