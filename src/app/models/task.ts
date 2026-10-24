export interface Task {
  id: string;
  titulo:string;
  descripcion:string;
  categoriaId:string | null;
  completada:boolean;
}

export type TaskForm = Omit<Task, 'id' | 'completada'>;

export function esTask(x: unknown): x is Task {
  const t = x as Task;
  return !!t && typeof t.id === 'string' && typeof t.titulo === 'string'
    && typeof t.descripcion === 'string' && typeof t.completada === 'boolean'
    && (t.categoriaId === null || typeof t.categoriaId === 'string');
}
