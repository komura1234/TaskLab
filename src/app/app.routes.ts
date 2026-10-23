import { Route, Routes} from "@angular/router";


export const routes:Routes=[
    {path:'',pathMatch:'full',redirectTo:'tab-routes'},
   
    {path:'',loadChildren:()=> import('./pages/tabs/tabs.route').then(m=>m.TAB_ROUTES)
    },
    {path:'**',redirectTo:'tab-routes'}
 
]