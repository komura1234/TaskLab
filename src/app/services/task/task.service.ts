import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { StorageService } from '../../core/storage/storage.service';
import { esTask, Task } from '../../models/task';
import { CategoryService } from '../category/category.service';
import { validarTexto } from '../../shared/validations/reglas';

const key='task'
@Injectable({providedIn:'root'})
export class TaskService {
  private readonly storage=inject(StorageService);
  private readonly categoryService=inject(CategoryService);
  private readonly _items=signal<Task[]>([]);
  readonly items=this._items.asReadonly()
  readonly cargando=signal(false);
  readonly error= signal<string | null>(null);
  private cargado=false;
  readonly pendientes=computed(()=>this._items().filter(t=>!t.completada).length)


  readonly conteoPorCategoria=computed(()=>{
    const conteo=new Map<string,number>();
    
    for(const t of this._items()) if(t.categoriaId) conteo.set(t.categoriaId,(conteo.get(t.categoriaId)??0)+1);
    return conteo
  })

  private async ejecutar(accion:()=>Promise<void>):Promise<boolean>{
      this.cargando.set(true);
      this.error.set(null);

      try{await accion(); return true}
      catch(e){this.error.set((e as Error).message); return false}
      finally{this.cargando.set(false)}
  }
  cargar(): Promise<boolean> {
    return this.ejecutar(async () => {
      this._items.set(await this.leer());
      this.cargado=true;
    });
  }

  guardar(item:Task):Promise<boolean>{
    return this.ejecutar(async()=>{

      await this.validar(item);
      const limpio={...item,titulo:item.titulo.trim(),descripcion:item.descripcion.trim()};
      const actual=await this.actual();

      const tasks=actual.some(x=>x.id===item.id)
        ?actual.map(x=>x.id===item.id?limpio:x)
        :[limpio,...actual];
      await this.escribir(tasks);
    })
  }

  eliminar(id:string):Promise<boolean>{
    return this.ejecutar(async()=>{
      const actual=await this.actual();

      if(!actual.some(x=>x.id===id)) throw new Error('La tarea no existe');
      await this.escribir(actual.filter(x=>x.id!==id));
    })
  }

  alternarCompletada(id:string):Promise<boolean>{
    return this.ejecutar(async()=>{

      await this.escribir((await this.actual()).map(x=>x.id===id?{...x,completada:!x.completada}:x));
    })
  }

  cambiarCategoria(id:string,categoriaId:string|null):Promise<boolean>{
    return this.ejecutar(async()=>{

      if(categoriaId!==null && !(await this.categoryService.existe(categoriaId)))
        throw new Error('La categoría seleccionada no existe');
      await this.escribir((await this.actual()).map(x=>x.id===id?{...x,categoriaId}:x));
    })
  }

  quitarCategoria(categoriaId:string):Promise<boolean>{
    return this.ejecutar(async()=>{
      await this.escribir((await this.actual()).map(x=>x.categoriaId===categoriaId?{...x,categoriaId:null}:x));
    })
  }

  private async actual():Promise<Task[]>{
    if(!this.cargado){
      this._items.set(await this.leer());
      this.cargado=true;
    }
    return this._items();
  }

  private async escribir(tasks:Task[]):Promise<void>{
    await this.storage.guardar(key,JSON.stringify(tasks));
    
    this._items.set(tasks);
  }

  private async validar(item:Task):Promise<void>{

    validarTexto(item.titulo,item.descripcion);
    
    if(item.categoriaId!==null && !(await this.categoryService.existe(item.categoriaId)))
      throw new Error('La categoría seleccionada no existe');
  }


   async leer():Promise<Task[]>{
    const resp=await this.storage.leer(key)
    if(!resp) return [];
    const data:unknown=JSON.parse(resp);
    if(!Array.isArray(data)) throw new Error('Los datos de tareas están corruptos');
    return data.filter(esTask);
  }


}
