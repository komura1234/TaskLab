import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes} from './app/app.routes';
import { AppComponent } from './app/app.component';
import { inject, provideAppInitializer } from '@angular/core';
import { RemoteService } from './app/core/config/remote-config/remote-service';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({mode:'ios', useSetInputAPI:true}),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideAppInitializer(()=>inject(RemoteService).inciarBanderas()),
  ],
});
