import { inject, Injectable, Service, signal } from '@angular/core';
import { StorageService } from '../../core/storage/storage.service';
import { Task } from '../../models/task';

const key='task'
@Injectable({providedIn:'root'})
export class TaskService {
  private readonly storage=inject(StorageService);
  private readonly _items=signal<Task[]>([]);
  readonly items=this._items.asReadonly()
  readonly cargando=signal(false);
  readonly error= signal<string | null>(null);


  private async ejecutar(accion:()=>Promise<void>){
      this.cargando.set(true);
      this.error.set(null);

      try{await accion()}
      catch(e){this.error.set((e as Error).message);}
      finally{this.cargando.set(false)}
  }

 
  guadar(item:Task){
    this.ejecutar(async()=>{
     const taks=[...(await this.leer()).filter(x=>x.id!=item.id),item];
      await this.storage.guardar(key,JSON.stringify(taks));
      this._items.set(taks);
    })

  }


  private async leer():Promise<Task[]>{
    const resp=await this.storage.leer(key)
    return resp ? (JSON.parse(resp)as Task[]):[];
  }


}
