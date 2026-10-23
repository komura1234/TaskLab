import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class StorageService {
  async guardar(clave: string, valor: string): Promise<void> { localStorage.setItem(clave, valor); }
  async leer(clave: string): Promise<string | null> { return localStorage.getItem(clave); }
  async eliminar(clave: string): Promise<void> { localStorage.removeItem(clave); }
}
