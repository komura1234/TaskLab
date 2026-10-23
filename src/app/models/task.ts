export interface Task {
  id: string;
  nombre:string;
  descripcion:string;
  categoriaId:string | null;
  completada:boolean;
}
