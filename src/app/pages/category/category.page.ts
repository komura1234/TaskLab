import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonNote, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  imports: [IonContent,IonNote ,IonHeader, IonSearchbar,IonTitle, IonToolbar, IonFab,IonIcon,IonFabButton,CommonModule, FormsModule]
})
export class CategoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
