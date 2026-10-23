import { Route, Routes} from "@angular/router";
import { TabsPage } from "./tabs.page";


export const TAB_ROUTES:Routes=[
   {
    path: 'tab-routes',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('../tasks/tasks.page').then((m) => m.TasksPage),
      },

      {
        path:'category',
        loadComponent:()=>import('../category/category.page').then((m)=>m.CategoryPage)
      },
      
      {path:'',pathMatch:'full',redirectTo:'tasks'},

    ],
  },
]