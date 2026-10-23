import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonTab, IonTabBar, IonTabButton, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { create } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [IonTab,IonTabBar, IonToolbar,IonTabButton,IonIcon, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {

  constructor() {
    addIcons({create})
   }

  ngOnInit() {
  }

}
