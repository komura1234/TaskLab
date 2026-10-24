export const REGLAS = {
  titulo: { min: 3, max: 50 },
  descripcion: { max: 200 },
} as const;

export function validarTexto(titulo: string, descripcion: string): void {
  const n = titulo.trim();
  if (!n) throw new Error('El titulo es obligatorio');
  if (n.length < REGLAS.titulo.min) throw new Error(`El titulo debe tener mínimo ${REGLAS.titulo.min} caracteres`);
  if (n.length > REGLAS.titulo.max) throw new Error(`El titulo debe tener máximo ${REGLAS.titulo.max} caracteres`);
  if (descripcion.trim().length > REGLAS.descripcion.max) throw new Error(`La descripción debe tener máximo ${REGLAS.descripcion.max} caracteres`);
}
