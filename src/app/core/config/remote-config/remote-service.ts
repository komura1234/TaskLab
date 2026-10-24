import { Service, signal } from '@angular/core';
import {initializeApp} from 'firebase/app';
import{activate, fetchAndActivate, getBoolean, getRemoteConfig, onConfigUpdate, RemoteConfig} from 'firebase/remote-config'
import { environment } from '../../../../environments/environment';
const flags={
    task_categorias:true,
    task_crear_tarea:true,
    task_buscador:true
}
export type Flag =keyof typeof flags
@Service()
export class RemoteService {

    private remoteConfig!:RemoteConfig
    private readonly _flags=signal<Record<Flag,boolean>>(flags);
    readonly banderas= this._flags.asReadonly();

    async inciarBanderas():Promise<void>{
      this.remoteConfig= getRemoteConfig(initializeApp(environment.firebase));
      this.remoteConfig.settings.minimumFetchIntervalMillis= environment.production?60_000:0;
      this.remoteConfig.defaultConfig=flags;

      try{
        await fetchAndActivate(this.remoteConfig);
      }catch{}
      this.leer();
      this.escuchar();
     document.addEventListener('resume',()=>this.refrescar())
      
    }
    private escuchar():void{
        try{
        onConfigUpdate(this.remoteConfig,{
            next:async()=>{
                await activate(this.remoteConfig);
                this.leer()
            },
            error:(e)=> console.warn('Problemas con rconfig',e),
            complete:()=>{},
        })
        }catch{

        }
        
 

    }
    private leer():void{
      const banderas={...flags}

      for(const f of Object.keys(flags) as Flag[])banderas[f]=getBoolean(this.remoteConfig,f);
      this._flags.set(banderas);
    }

    activo(flag:Flag):boolean{
        return this._flags()[flag];
    }

    async refrescar():Promise<void>{
        try{
            await fetchAndActivate(this.remoteConfig);
            this.leer()
        }catch{}
    }
}
