import { ValidatorFn } from '@angular/forms';

export const noSoloEspacios: ValidatorFn = c => {
  const v = (c.value ?? '') as string;
  return v.length > 0 && v.trim().length === 0 ? { soloEspacios: true } : null;
};

export const nombreUnico = (nombres: () => string[]): ValidatorFn => c => {
  const v = ((c.value ?? '') as string).trim().toLowerCase();
  return v && nombres().some(n => n.trim().toLowerCase() === v) ? { duplicado: true } : null;
};
