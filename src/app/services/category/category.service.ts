import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../../core/storage/storage.service';
import { Category } from '../../models/category';

const key = 'categorys';
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly storage = inject(StorageService);

  private readonly _items = signal<Category[]>([]);
  readonly items = this._items.asReadonly();
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  private async ejecutar(accion: () => Promise<void>): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    
    try { await accion(); }
    catch (e) { this.error.set((e as Error).message); }
    finally { this.cargando.set(false); }
  }

  cargar(): Promise<void> {
    return this.ejecutar(async () => this._items.set(await this.leer()));
  }

  guardar(item: Category): Promise<void> {
    return this.ejecutar(async () => {
      const lista = [...(await this.leer()).filter(x => x.id !== item.id), item];
      await this.storage.guardar(key, JSON.stringify(lista));
      this._items.set(lista);
    });
  }

  eliminar(id: string): Promise<void> {
    return this.ejecutar(async () => {
      const lista = (await this.leer()).filter(x => x.id !== id);
      await this.storage.guardar(key, JSON.stringify(lista));
      this._items.set(lista);
    });
  }

  private async leer(): Promise<Category[]> {
    const raw = await this.storage.leer(key);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  }
}
