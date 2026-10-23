import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonIcon, IonTab, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { create } from 'ionicons/icons';
import { RemoteService } from '../../core/config/remote-config/remote-service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  imports: [IonContent,IonHeader,IonTab,IonTabs,IonTabBar, IonToolbar,IonTabButton,IonIcon, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {
 readonly remote=inject(RemoteService);
  constructor() {
    addIcons({create})
   }

  ngOnInit() {
  }

}
