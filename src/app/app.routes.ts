import { Route, Routes} from "@angular/router";


export const routes:Routes=[
    {path:'',pathMatch:'full',redirectTo:'tasks'},
    {
        path: 'tasks',
        loadComponent: () => import('./pages/tasks/tasks.page').then( m => m.TasksPage)
    },
 
 
]