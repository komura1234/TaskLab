export interface Category {
  id: string;
  nombre:string;
  descripcion:string;
}

export type CategoryForm = Omit<Category, 'id'>;

export function esCategory(x: unknown): x is Category {
  const c = x as Category;
  return !!c && typeof c.id === 'string' && typeof c.nombre === 'string' && typeof c.descripcion === 'string';
}
