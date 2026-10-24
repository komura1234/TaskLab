import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../../core/storage/storage.service';
import { Category, esCategory } from '../../models/category';
import { validarTexto } from '../../shared/validations/reglas';
import { COLORES_CATEGORIA } from '../../shared/ui/colores';

const key = 'categorys';
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly storage = inject(StorageService);

  private readonly _items = signal<Category[]>([]);
  readonly items = this._items.asReadonly();
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  private async ejecutar(accion: () => Promise<void>): Promise<boolean> {
    this.cargando.set(true);
    this.error.set(null);

    try { await accion(); return true; }
    catch (e) { this.error.set((e as Error).message); return false; }
    finally { this.cargando.set(false); }
  }

  cargar(): Promise<boolean> {
    return this.ejecutar(async () => this._items.set(await this.leer()));
  }

  guardar(item: Category): Promise<boolean> {
    return this.ejecutar(async () => {
      const actual = await this.leer()
      this.validar(item, actual)

      const limpio = { ...item, nombre: item.nombre.trim() }
      const lista = actual.some(x => x.id === item.id)
        ? actual.map(x => (x.id === item.id ? limpio : x))
        : [...actual, limpio];
      await this.storage.guardar(key, JSON.stringify(lista));
      this._items.set(lista)
    });
  }

  eliminar(id: string): Promise<boolean> {
    return this.ejecutar(async () => {
      const actual = await this.leer();

      if (!actual.some(x => x.id === id)) throw new Error('La categoría no existe');
      const lista = actual.filter(x => x.id !== id)
      await this.storage.guardar(key, JSON.stringify(lista));
      this._items.set(lista)
    })
  }

  async existe(id: string): Promise<boolean> {
    return (await this.leer()).some(c => c.id === id);
  }

  private validar(item: Category, lista: Category[]): void {
    validarTexto(item.nombre, '');
    const nombre = item.nombre.trim().toLowerCase();

    if (lista.some(c => c.id !== item.id && c.nombre.trim().toLowerCase() === nombre))
      throw new Error('Ya existe una categoría con ese nombre');
  }

  private async leer(): Promise<Category[]> {
    const raw = await this.storage.leer(key);
    if (!raw) return [];
    
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('Los datos de categorías están corruptos');
    return data.map(c => ({ ...c, color: c?.color ?? COLORES_CATEGORIA[0] })).filter(esCategory);
  }
}
